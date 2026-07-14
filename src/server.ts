// IoMarkets.ai — OKX.AI A2MCP service (X Layer / x402), Express + OKX Payment SDK.
//
// The OKX Payment SDK (@okxweb3/x402-*) attaches as Express middleware: it builds
// the 402 PAYMENT-REQUIRED challenge for priced routes, verifies the EIP-3009
// payment, and settles USDT0 on X Layer via the OKX facilitator. We only write the
// business logic (the QuestDB query + the signature).
//
//   agent ──▶ paymentMiddleware ──(402 if unpaid)──▶ pay ──▶ handler ──▶ settle
//                                                                          │
//                              proof route: sign the settled tx via the ───┘
//                              "iomarkets-proof" settlement extension
//
// Docs: web3.okx.com/onchainos/dev-docs/payments/service-seller-sdk

import { AsyncLocalStorage } from "node:async_hooks";
import express, { type Request, type Response } from "express";
import { paymentMiddleware, x402ResourceServer } from "@okxweb3/x402-express";
import { ExactEvmScheme } from "@okxweb3/x402-evm/exact/server";
import { OKXFacilitatorClient } from "@okxweb3/x402-core";
import type { RoutesConfig } from "@okxweb3/x402-core/server";
import type { Network } from "@okxweb3/x402-core/types";

import { config, proofConfigured, x402Configured } from "./config.js";
import * as db from "./db/questdb.js";
import { sign, type AttestationPayload } from "./proof/sign.js";
import { tools } from "./mcp/tools.js";

const P = "/v1";
const CHAIN = "x-layer";
const NETWORK = config.x402.network as Network;
const PROOF_EXT_KEY = "iomarkets-proof";

const app = express();

// Behind a TLS-terminating proxy (Cloudflare Tunnel / Caddy / nginx): trust the
// X-Forwarded-Proto header so req.protocol is "https" and the x402 challenge's
// resource.url is built with https:// (OKX requires a public HTTPS endpoint).
app.set("trust proxy", true);

// ── x402 payment middleware (priced routes) ───────────────────────────────────
// Only mounted when the OKX facilitator creds + receiving wallet are configured;
// otherwise the routes serve free (useful for local dev before onboarding).
if (x402Configured()) {
  const facilitator = new OKXFacilitatorClient({
    apiKey: config.x402.apiKey,
    secretKey: config.x402.secretKey,
    passphrase: config.x402.passphrase,
  });

  const resourceServer = new x402ResourceServer(facilitator).register(
    NETWORK,
    new ExactEvmScheme(),
  );

  // Verification tier: after settlement, sign an attestation anchored to the real
  // settled tx and return it under response.extensions["iomarkets-proof"]. The
  // handler stashes what-to-sign on the async-local store (below); this reads it
  // plus the settled txid (context.result.transaction).
  resourceServer.registerExtension({
    key: PROOF_EXT_KEY,
    async enrichSettlementResponse(_declaration, context) {
      if (!proofConfigured()) return undefined;
      const pending = proofStore.getStore()?.pending;
      if (!pending) return undefined;
      return sign(
        { ...pending, chain: CHAIN, settlement_txid: context.result.transaction },
        config.proofPrivateKey,
      );
    },
  });

  const routes: RoutesConfig = {
    [`GET ${P}/signal/vwap`]: {
      accepts: [{ scheme: "exact", network: NETWORK, payTo: config.x402.payTo, price: config.prices.get_vwap }],
      description: "Volume-weighted average price for a trading pair",
      mimeType: "application/json",
    },
    [`GET ${P}/proof/price`]: {
      accepts: [{ scheme: "exact", network: NETWORK, payTo: config.x402.payTo, price: config.prices.get_price_proof }],
      description: "Signed point-in-time price attestation (anchored to the settlement tx)",
      mimeType: "application/json",
      extensions: { [PROOF_EXT_KEY]: {} }, // opt this route into the proof extension
    },
  };

  // syncFacilitatorOnStart=true: fetch the facilitator's supported payment kinds
  // at boot so buildPaymentRequirements knows `exact` is supported on the network.
  // (With false, the SDK never initializes supportedKinds and throws on the first
  // priced request: "Facilitator does not support exact on <network>".) Real creds
  // are required — a 401 here means the OKX_* creds are wrong.
  app.use(paymentMiddleware(routes, resourceServer, undefined, undefined, true));
  console.log(`x402 payment middleware active (network=${NETWORK}, payTo=${config.x402.payTo})`);
} else {
  console.warn(
    "x402 NOT configured (set X402_PAY_TO + OKX_API_KEY/SECRET/PASSPHRASE) — priced routes serve FREE. Dev only.",
  );
}

// Carries the proof route's to-sign payload from the handler to the settlement
// extension within a single request's async context.
type ProofPending = Omit<AttestationPayload, "server_pubkey" | "chain" | "settlement_txid">;
const proofStore = new AsyncLocalStorage<{ pending?: ProofPending }>();
app.use((_req, _res, next) => proofStore.run({}, next));

// ── DATA TIER — get_vwap ──────────────────────────────────────────────────────
app.get(`${P}/signal/vwap`, async (req: Request, res: Response) => {
  const symbol = (req.query.pair as string) ?? "BTC-USDC";
  const windowMin = Number(req.query.window_min ?? "5");
  try {
    res.json(await db.getVwap(symbol, windowMin));
  } catch (e) {
    console.error("vwap query failed:", (e as Error).message);
    res.status(503).json({ error: "market data unavailable" });
  }
});

// ── VERIFICATION TIER — get_price_proof ───────────────────────────────────────
// The handler produces the price data and stashes what-to-sign; the actual
// ed25519 attestation (anchored to the settled txid) is attached by the
// "iomarkets-proof" settlement extension above. Never emits a proof unless the
// call was paid (settlement runs) and signing is configured.
app.get(`${P}/proof/price`, async (req: Request, res: Response) => {
  if (!proofConfigured()) {
    res.status(503).json({ error: "proof signing not configured (run `pnpm gen-key`)" });
    return;
  }
  const symbol = (req.query.pair as string) ?? "BTC-USDC";
  const at = (req.query.at as string) ?? new Date().toISOString();

  let row;
  try {
    row = await db.getPriceAt(symbol, at);
  } catch (e) {
    console.error("price-at query failed:", (e as Error).message);
    res.status(503).json({ error: "market data unavailable" });
    return;
  }
  if (!row) {
    res.status(404).json({ error: "no data at or before timestamp" });
    return;
  }

  const store = proofStore.getStore();
  if (store) {
    store.pending = {
      query_ts: new Date().toISOString(),
      symbol,
      source_ts: row.source_ts,
      price: row.price,
      source: row.source,
    };
  }
  // The signed attestation arrives in extensions["iomarkets-proof"] after settlement.
  res.json({
    symbol,
    source_ts: row.source_ts,
    price: row.price,
    source: row.source,
    attestation: `see response extensions["${PROOF_EXT_KEY}"] (ed25519, anchored to settlement tx)`,
  });
});

// ── MCP manifest (free) ───────────────────────────────────────────────────────
app.get("/mcp/tools", (_req, res) => res.json({ tools }));
app.get("/.well-known/mcp/tools.json", (_req, res) => res.json({ tools }));

// ── health (free) ─────────────────────────────────────────────────────────────
app.get("/health", async (_req, res) =>
  res.json({
    ok: true,
    chain: CHAIN,
    questdb: await db.ping(),
    proof: proofConfigured(),
    x402: x402Configured(),
  }),
);

// ── landing (free) ────────────────────────────────────────────────────────────
app.get("/", (_req, res) =>
  res.type("html").send(`<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>IoMarkets.ai — verifiable market-truth, paid per call (OKX.AI · X Layer)</title>
<style>
  body{margin:0;background:#0a1128;color:#fafaf9;font:16px/1.65 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
  .wrap{max-width:820px;margin:0 auto;padding:48px 24px 80px}
  h1{font-size:38px;line-height:1.15;margin:16px 0 8px}
  .g{background:linear-gradient(90deg,#d4af37,#8b5cf6);-webkit-background-clip:text;background-clip:text;color:transparent}
  .lead{font-size:18px;color:#94a3b8;max-width:640px}
  table{width:100%;border-collapse:collapse;background:#141a33;border:1px solid #27304d;border-radius:12px;overflow:hidden;margin-top:24px}
  th,td{text-align:left;padding:12px 16px;border-bottom:1px solid #27304d;font-size:14px}
  tr:last-child td{border-bottom:0}
  th{color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:.05em}
  code{font-family:ui-monospace,Menlo,Consolas,monospace;color:#06b6d4}
  .p{color:#d4af37;font-weight:600;white-space:nowrap}
  footer{margin-top:40px;color:#94a3b8;font-size:13px;border-top:1px solid #27304d;padding-top:20px}
</style></head><body><div class="wrap">
  <h1>IoMarkets.ai<br><span class="g">verifiable market-truth, paid per call</span></h1>
  <p class="lead">An agent-native market-data service on <b>OKX.AI</b>. Every call is a single
    x402 micropayment in USDT0 on <b>X Layer</b> — no accounts, no API keys. The verification tier
    returns an ed25519-signed price proof anchored to its on-chain settlement tx: verify it yourself,
    trust no one.</p>
  <table><thead><tr><th>Service (MCP tool)</th><th>Returns</th><th>Price/call</th></tr></thead><tbody>
    <tr><td><code>get_vwap</code></td><td>Volume-weighted average price</td><td class="p">${config.prices.get_vwap}</td></tr>
    <tr><td><code>get_price_proof</code></td><td>Signed point-in-time price attestation</td><td class="p">${config.prices.get_price_proof}</td></tr>
  </tbody></table>
  <footer>OKX.AI A2MCP · x402 on X Layer · USDT0 settlement · QuestDB-backed ·
    <a href="/mcp/tools" style="color:#06b6d4">/mcp/tools</a> · <a href="/health" style="color:#06b6d4">/health</a></footer>
</div></body></html>`),
);

app.listen(config.port, () => {
  console.log(`IoMarkets.ai A2MCP listening on :${config.port} (chain=${CHAIN})`);
  console.log(`Services: ${tools.map((t) => t.name).join(", ")}`);
});
