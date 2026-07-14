# Deploy & Submit — July 17 checklist

Goal: get **one live A2MCP service** (`get_vwap`) listed on OKX.AI and pass review.
Everything is scoped so the eligibility gate — *approved + live* — is reachable.
Confirmed values + registration prompts: `docs/OKX_X402_REFERENCE.md`.

## 1. Stand up the origin (stable host with HTTPS + a domain — NOT the laptop)
OKX requires a **public HTTPS endpoint on a domain**. Pick a cloud node (HK / SG /
Tokyo). If the desk-note/analysis features call Claude/OpenAI, avoid HK nodes.
- [ ] `docker compose up -d` (QuestDB)
- [ ] Load schema: open `http://<host>:9000`, run `sql/schema.sql`
- [ ] `cp .env.example .env`, fill QuestDB; `X402_ASSET` + `X402_NETWORK` are pre-filled (USDT0 / X Layer)
- [ ] `pnpm gen-key` → paste `PROOF_*` lines into `.env`
- [ ] `pnpm install && pnpm typecheck`
- [ ] `pnpm start` → `GET /health` returns `{ ok:true, questdb:true }`
- [ ] Wire real ingest (OKX ws → QuestDB `trades`) OR keep sample rows for the demo
- [ ] Point domain + TLS (Caddy/nginx) at the origin → `PUBLIC_BASE_URL=https://…`

## 2. Make the paid endpoint x402-compliant (OKX Payment SDK — recommended)
- [ ] Install the OKX Node SDK: `@okxweb3/x402-*` (see `docs/OKX_X402_REFERENCE.md`)
- [ ] Attach its payment middleware to `/v1/signal/vwap` (and `/v1/proof/price`);
      set payTo = Agentic Wallet 0x, network `eip155:196`, asset USDT0, price in min units
- [ ] For the proof tier, read the settlement tx from the SDK's settlement result and
      pass it into `sign()` (in-process = the txid is available; no header plumbing)
- [ ] **Self-check:** `curl -i https://<domain>/v1/signal/vwap` → **HTTP 402 + PAYMENT-REQUIRED** (unpaid)

## 3. Register + list via your agent (no web form)
Install the skill into Claude Code, then prompt (full flow in `docs/OKX_X402_REFERENCE.md`):
- [ ] `npx skills add okx/onchainos-skills --yes -g`
- [ ] "Log in to Agentic Wallet on Onchain OS with my email" → copy the 0x → `.env` `X402_PAY_TO`
- [ ] "Help me register an A2MCP ASP on OKX.AI using OKX Agent Identity from Onchain OS"
      (name/description/services/pricing from `docs/ASP_LISTING.md`)
- [ ] "Help me list my ASP on OKX.AI using Onchain OS"
- [ ] **List for review by the morning of Jul 16** — review is ~24h; leave a resubmit buffer

## 4. Go live + submit (the eligibility gate)
- [ ] Confirm the ASP shows **live** in the OKX.AI marketplace (submission is invalid otherwise)
- [ ] Record ≤90s demo (agent paying + X Layer explorer tx)
- [ ] Post on X with **#OKXAI** (template in `docs/ASP_LISTING.md`)
- [ ] File the Google form (ASP details + X post link) **before Jul 17, 23:59 UTC**
