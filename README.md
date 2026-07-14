# IoMarkets.ai — OKX.AI A2MCP ASP

**Verifiable market-truth oracle for autonomous agents.** Pay-per-call crypto market
signals and ed25519-signed price proofs, settled in **USDT0 on X Layer** via **x402**.
Built as an **Agent-to-MCP (A2MCP)** service for the **OKX.AI** marketplace
(OKX AI Genesis Hackathon). Confirmed OKX config + registration flow:
[`docs/OKX_X402_REFERENCE.md`](docs/OKX_X402_REFERENCE.md).

> Ported from the Algorand/x402 build (`IoMarkets.ai-x402`) to OKX.AI + X Layer.
> The market-data core, SQL, and proof-signing scheme carry over; only the payment
> rail changed. This repo is scoped to the **deadline MVP**: one live service.

## What it is

Two A2MCP tools a calling agent can discover and pay for per request:

| Tool | Returns | Price |
|---|---|---|
| `get_vwap` | Volume-weighted average price | $0.002 |
| `get_price_proof` | ed25519-signed price attestation, anchored to the settlement tx | $0.01 |

The proof is the differentiator: verify the signature against the published public
key **and** confirm the settlement tx on X Layer ⇒ trustworthy market truth, with
zero trust in us. See `scripts/verify-proof.ts`.

## Architecture (OKX Payment SDK — wired)

```
agent ──▶ paymentMiddleware ──(402 if unpaid)──▶ pay ──▶ handler ──▶ settle
              @okxweb3/x402-express                         │           │
                                          proof route: sign settled tx ─┘ via the
                                          "iomarkets-proof" settlement extension
```

`src/server.ts` is an **Express** app with the **OKX Payment SDK** wired
(`@okxweb3/x402-express` + `@okxweb3/x402-evm` + `@okxweb3/x402-core`): the payment
middleware builds the 402 challenge, verifies the EIP-3009 payment, and settles
USDT0 on X Layer via the OKX facilitator. `get_vwap` returns data after payment;
`get_price_proof` uses a registered **settlement extension** — after the payment
settles, it signs an ed25519 attestation anchored to the real settlement tx
(`context.result.transaction`) and returns it under
`response.extensions["iomarkets-proof"]`.

Priced routes serve **free** until all four x402 vars are set (`X402_PAY_TO`,
`OKX_API_KEY/SECRET/PASSPHRASE`), so you can run locally before OKX onboarding.
The paid 402 self-check requires real OKX Developer Portal credentials.

## Quick start

```bash
docker compose up -d                 # QuestDB on :9000 (console) / :8812 (pg)
# load schema: open http://localhost:9000 and run sql/schema.sql
cp .env.example .env                 # fill QuestDB; add OKX x402 vars when ready
pnpm install
pnpm gen-key >> .env                 # then prune to the two PROOF_* lines
pnpm ingest                          # stream live OKX trades → QuestDB (Ctrl-C to stop)
pnpm start                           # server on :3000
curl localhost:3000/health           # { ok, questdb, proof, x402 }
curl localhost:3000/mcp/tools        # the A2MCP manifest
# once the 4 x402 vars are set, the OKX self-check:
curl -i 'localhost:3000/v1/signal/vwap?pair=BTC-USDC'   # → HTTP 402 + PAYMENT-REQUIRED
```

## Layout

```
src/server.ts       Express server — OKX Payment SDK middleware, data + proof routes, MCP, health, landing
src/db/questdb.ts   QuestDB queries (getVwap, getPriceAt)
src/proof/sign.ts   ed25519 attestation signing (chain-neutral)
src/mcp/tools.ts    A2MCP tool manifest (service list + prices)
sql/schema.sql      trades table + reference queries
scripts/gen-key.ts  generate the proof keypair
scripts/ingest.ts   OKX public WebSocket trades → QuestDB (live market data)
scripts/verify-proof.ts  standalone third-party verifier
docs/OKX_X402_REFERENCE.md  confirmed OKX values + registration flow + marketplace notes
docs/ASP_LISTING.md OKX.AI registration copy (name/description/services/pricing)
docs/DEPLOY.md      deploy + submit checklist for the Jul 17 deadline
docs/HACKATHON.md   requirements, deadline, master checklist
```

## Status / TODO

- [x] Express + OKX Payment SDK middleware wired (`@okxweb3/x402-*`); typecheck clean; boots
- [x] Data + proof endpoints, MCP manifest, ed25519 signing + verifier
- [x] Confirmed OKX config — X Layer `eip155:196`, USDT0 `0x779d…3736`, SDK (`docs/OKX_X402_REFERENCE.md`)
- [ ] Apply for OKX Developer Portal creds → `OKX_API_KEY/SECRET/PASSPHRASE`
- [ ] Create Agentic Wallet (email login via agent) → `X402_PAY_TO`
- [ ] Deploy on HTTPS+domain host; run `curl -i → 402` self-check on testnet (`eip155:1952`)
- [x] Live OKX ws → QuestDB ingester (`pnpm ingest`) — WS path verified against the live feed
- [ ] Register A2MCP service, pass review, go live
