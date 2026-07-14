# Deploy & Submit — July 17 checklist

Goal: get **one live A2MCP service** (`get_vwap`) listed on OKX.AI and pass review.
Everything is scoped so the eligibility gate — *approved + live* — is reachable.

## 0. Confirm the 3 OKX values first (blocks everything)
From OKX seller onboarding (`okx.ai/tutorial/asp` → become ASP, or the prompt-based
integration):
- [ ] OKX **Agentic Wallet** created → its **0x address** (`X402_PAY_TO`)
- [ ] **USDC contract on X Layer** (`X402_ASSET`)
- [ ] **Broker / facilitator URL** (`X402_FACILITATOR_URL`)
- [ ] Confirm: does OKX accept a standard x402 endpoint behind their **reverse-proxy broker** (Path A), or require the in-process **OKX Payment SDK** (Path B)?

## 1. Stand up the origin (stable host, NOT the laptop)
- [ ] `docker compose up -d` (QuestDB)
- [ ] Load schema: open `http://<host>:9000`, run `sql/schema.sql`
- [ ] `cp .env.example .env` and fill QuestDB + the 3 OKX values
- [ ] `pnpm gen-key` → paste `PROOF_*` lines into `.env`
- [ ] `pnpm install && pnpm typecheck`
- [ ] `pnpm start` → check `GET /health` returns `{ ok:true, questdb:true }`
- [ ] Wire real ingest (OKX ws → QuestDB `trades`) OR keep sample rows for the demo
- [ ] Put TLS in front (Caddy/nginx) → `PUBLIC_BASE_URL=https://…`

## 2. Put OKX's payment in front (Path A)
- [ ] Configure the OKX Broker/reverse-proxy with the route→price table:
      `GET /v1/signal/vwap → $0.002`, `GET /v1/proof/price → $0.01`
- [ ] Confirm an unpaid call gets `402`; a paid call settles USDC on X Layer and reaches the origin
- [ ] (Proof tier) confirm the broker forwards a settlement-tx header the origin can read
      (`x-settlement-txid` or base64 `PAYMENT-RESPONSE`) — else move `/v1/proof/price` to Path B

## 3. Register the A2MCP service
- [ ] Register as ASP → Agent-to-MCP, using `docs/ASP_LISTING.md`
- [ ] Submit **`get_vwap`** as the live service (add `get_price_proof` once the txid header is confirmed)
- [ ] **Submit for review by the morning of Jul 16** — review is ~24h; leave a resubmit buffer

## 4. Go live + submit (the eligibility gate)
- [ ] Confirm the ASP shows **live** in the OKX.AI marketplace (submission is invalid otherwise)
- [ ] Record ≤90s demo (agent paying + X Layer explorer tx)
- [ ] Post on X with **#OKXAI** (template in `docs/ASP_LISTING.md`)
- [ ] File the Google form (ASP details + X post link) **before Jul 17, 23:59 UTC**
