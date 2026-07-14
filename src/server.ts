// IoMarkets.ai — OKX.AI A2MCP service (X Layer / x402).
//
// PATH A (this file): the server exposes clean data endpoints and holds NO
// private keys and NO in-process payment code. OKX's Broker/facilitator sits in
// front as a reverse proxy: it 402s unpaid calls, settles USDC on X Layer, then
// forwards the paid request to us — optionally carrying the settlement tx id in a
// header so the verification tier can anchor its signed proof.
//
// This keeps the origin dead-simple and deployable today. The proof tier still
// signs a real, independently-verifiable attestation as long as the broker
// forwards a settlement reference (see SETTLEMENT_TXID_HEADER). If your broker
// setup cannot forward that header, move the proof route to the in-process SDK
// (Path B) — the data route is unaffected either way.

import { serve } from "@hono/node-server";
import { Hono, type Context } from "hono";

import { config, proofConfigured } from "./config.js";
import * as db from "./db/questdb.js";
import { sign } from "./proof/sign.js";
import { tools } from "./mcp/tools.js";

const app = new Hono();
const P = "/v1";
const CHAIN = "x-layer";

// Header(s) the OKX broker may use to forward the on-chain settlement reference
// after it settles a paid call. We accept a few common spellings.
function settlementTxid(c: Context): string | undefined {
  const direct =
    c.req.header("x-settlement-txid") ??
    c.req.header("x-payment-txid") ??
    c.req.header("x-settlement-tx");
  if (direct) return direct;
  // Some brokers forward the base64 x402 PAYMENT-RESPONSE object instead.
  const raw = c.req.header("payment-response") ?? c.req.header("x-payment-response");
  if (!raw) return undefined;
  try {
    const d = JSON.parse(Buffer.from(raw, "base64").toString("utf8")) as Record<string, unknown>;
    return (d.transaction ?? d.txHash ?? d.txid) as string | undefined;
  } catch {
    return undefined;
  }
}

// ── DATA TIER — get_vwap ──────────────────────────────────────────────────────
app.get(`${P}/signal/vwap`, async (c) => {
  const symbol = c.req.query("pair") ?? "BTC-USDC";
  const windowMin = Number(c.req.query("window_min") ?? "5");
  try {
    return c.json(await db.getVwap(symbol, windowMin));
  } catch (e) {
    console.error("vwap query failed:", (e as Error).message);
    return c.json({ error: "market data unavailable" }, 503);
  }
});

// ── VERIFICATION TIER — get_price_proof ───────────────────────────────────────
// Returns an ed25519-signed attestation anchored to the settlement tx. Never
// emits a proof it can't anchor: no signing key or no settlement ref ⇒ error.
app.get(`${P}/proof/price`, async (c) => {
  if (!proofConfigured()) {
    return c.json({ error: "proof signing not configured (run `pnpm gen-key`)" }, 503);
  }
  const txid = settlementTxid(c);
  if (!txid) {
    return c.json(
      { error: "settlement reference absent; proof requires a paid (x402-settled) call" },
      402,
    );
  }
  const symbol = c.req.query("pair") ?? "BTC-USDC";
  const at = c.req.query("at") ?? new Date().toISOString();

  let row;
  try {
    row = await db.getPriceAt(symbol, at);
  } catch (e) {
    console.error("price-at query failed:", (e as Error).message);
    return c.json({ error: "market data unavailable" }, 503);
  }
  if (!row) return c.json({ error: "no data at or before timestamp" }, 404);

  const attestation = sign(
    {
      query_ts: new Date().toISOString(),
      symbol,
      source_ts: row.source_ts,
      price: row.price,
      source: row.source,
      chain: CHAIN,
      settlement_txid: txid,
    },
    config.proofPrivateKey,
  );
  return c.json(attestation);
});

// ── MCP manifest (free) ───────────────────────────────────────────────────────
// The A2MCP tool list a calling agent reads to discover services + prices.
app.get("/mcp/tools", (c) => c.json({ tools }));
app.get("/.well-known/mcp/tools.json", (c) => c.json({ tools }));

// ── health (free) ─────────────────────────────────────────────────────────────
app.get("/health", async (c) =>
  c.json({ ok: true, chain: CHAIN, questdb: await db.ping(), proof: proofConfigured() }),
);

// ── landing (free) ────────────────────────────────────────────────────────────
app.get("/", (c) =>
  c.html(`<!doctype html><html lang="en"><head><meta charset="utf-8">
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
    x402 micropayment in USDC on <b>X Layer</b> — no accounts, no API keys. The verification tier
    returns an ed25519-signed price proof anchored to its on-chain settlement tx: verify it yourself,
    trust no one.</p>
  <table><thead><tr><th>Service (MCP tool)</th><th>Returns</th><th>Price/call</th></tr></thead><tbody>
    <tr><td><code>get_vwap</code></td><td>Volume-weighted average price</td><td class="p">${config.prices.get_vwap}</td></tr>
    <tr><td><code>get_price_proof</code></td><td>Signed point-in-time price attestation</td><td class="p">${config.prices.get_price_proof}</td></tr>
  </tbody></table>
  <footer>OKX.AI A2MCP · x402 on X Layer · USDC settlement · QuestDB-backed ·
    <a href="/mcp/tools" style="color:#06b6d4">/mcp/tools</a> · <a href="/health" style="color:#06b6d4">/health</a></footer>
</div></body></html>`),
);

serve({ fetch: app.fetch, port: config.port }, (info) => {
  console.log(`IoMarkets.ai A2MCP listening on :${info.port} (chain=${CHAIN})`);
  console.log(`Services: ${tools.map((t) => t.name).join(", ")}`);
});
