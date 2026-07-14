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

## Architecture (Path A — deadline-safe)

```
agent ──x402──▶ [OKX Payment SDK middleware] ──(settles USDT0 on X Layer)──▶ handler
                        │                                                       │
                   402 if unpaid                                      QuestDB query + sign
```

Recommended path (confirmed from OKX docs): the **OKX Payment SDK** (`@okxweb3/x402-*`,
Node.js) attaches as middleware — it builds the 402 challenge, verifies the EIP-3009
payment, and settles USDT0 on X Layer; you only write the business logic. Because
settlement happens in-process, the verification tier gets the settlement tx directly
and signs it into the attestation (no header plumbing). This repo's `server.ts` keeps
the handlers SDK-agnostic; wiring the middleware is the one remaining integration step
(see `docs/DEPLOY.md`).

## Quick start

```bash
docker compose up -d                 # QuestDB on :9000 (console) / :8812 (pg)
# load schema: open http://localhost:9000 and run sql/schema.sql
cp .env.example .env                 # fill QuestDB + the 3 OKX x402 values
pnpm install
pnpm gen-key >> .env                 # then prune to the two PROOF_* lines
pnpm start                           # server on :3000
curl localhost:3000/health
curl 'localhost:3000/v1/signal/vwap?pair=BTC-USDC'
curl localhost:3000/mcp/tools        # the A2MCP manifest
```

## Layout

```
src/server.ts       Hono server — data + proof routes, MCP manifest, health, landing
src/db/questdb.ts   QuestDB queries (getVwap, getPriceAt)
src/proof/sign.ts   ed25519 attestation signing (chain-neutral)
src/mcp/tools.ts    A2MCP tool manifest (service list + prices)
sql/schema.sql      trades table + reference queries
scripts/gen-key.ts  generate the proof keypair
scripts/verify-proof.ts  standalone third-party verifier
docs/ASP_LISTING.md OKX.AI registration copy (name/description/services/pricing)
docs/DEPLOY.md      deploy + submit checklist for the Jul 17 deadline
```

## Status / TODO

- [x] Data + proof endpoints, MCP manifest, signing, verifier
- [x] Confirm OKX config — X Layer `eip155:196`, USDT0 `0x779d…3736`, SDK `@okxweb3/x402-*` (`docs/OKX_X402_REFERENCE.md`)
- [ ] Create Agentic Wallet (email login via agent) → paste its 0x into `.env` `X402_PAY_TO`
- [ ] Wire live OKX ws → QuestDB ingest (sample rows work for the demo meanwhile)
- [ ] Register A2MCP service, pass review, go live
