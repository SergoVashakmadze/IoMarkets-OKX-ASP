# OKX.AI ASP — Handover / Resume Guide

Snapshot of where the OKX.AI hackathon submission stands and exactly how to finish
it. Written 2026-07-14, **updated 2026-07-15**. **Deadline: Google form before
2026-07-17 23:59 UTC; aim to be LIVE by Jul 16 AM.**

---

## TL;DR — what's the current state

The ASP is **built, deployed live, and submitted to OKX for review**. Remaining work
is **funding the wallet** (in progress — see below), then **bridge → demo → X post →
form**. Every remaining step now has a dedicated doc.

- **OKX Agent identity:** ASP **#5774** "IoMarkets.ai" — status **"Listing under
  review"** as of Jul 15 ~22:44 UTC (~25h in; review ~24h → goes LIVE). Watch it with
  `./scripts/watch-listing.sh --watch`.
- **Live endpoint:** https://okx.iomarkets.ai (public HTTPS, permanent, on-chain).
  - `GET /health` → `{ok:true, questdb:true, proof:true, x402:true}`
  - `GET /v1/signal/vwap` ($0.002) and `GET /v1/proof/price` ($0.01) → **HTTP 402 +
    PAYMENT-REQUIRED** (USDT0 on X Layer `eip155:196`, payTo below).
  - **NEW (Jul 15):** `GET /v1/proof/pubkey` (+ `/.well-known/okx-proof/pubkey.json`)
    publishes the ed25519 key `a95fc434…43cf4` so proofs verify trustlessly;
    `/mcp/tools` advertises it as `proof_pubkey_url`. Deployed + verified live.
- **payTo / Agentic Wallet:** `0x015bfbe816635b173e924688fba8794e30031266` (X Layer).

### Funding status (Jul 15)
OKX-exchange withdrawal was blocked by a UK first-purchase 24h cooling-off, so funding
pivoted to **MetaMask**: bought **~24 USDT on Arbitrum** (Banxa — still in a 24h
cool-off as of Jul 15 night) + **~$17 ETH on Arbitrum** (Ramp — landed, confirmed on
Arbitrum) for bridge gas. Next: **bridge Arbitrum USDT → X Layer USDT0** to the
Agentic Wallet — see [`BRIDGE.md`](BRIDGE.md). MetaMask source addr `0x4580…322376`
(≠ Agentic Wallet — bridge to a **custom recipient**).

### New docs / tooling (Jul 15)
- [`BRIDGE.md`](BRIDGE.md) — Arbitrum USDT → X Layer USDT0 to the Agentic Wallet
- [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md) — ≤90s storyboard + #OKXAI X post copy
- [`FORM_ANSWERS.md`](FORM_ANSWERS.md) — copy-paste Google form answers
- [`CHASE_ORGANISERS.md`](CHASE_ORGANISERS.md) — wording to expedite listing review
- `scripts/watch-listing.sh` — poll #5774 until LIVE

## Where it runs (deployment)

Deployed as a **separate product** on the existing Hetzner VPS, **sibling to the
untouched** Algorand-settled `api.iomarkets.ai`.

- **Host:** `root@89.167.70.245` (SSH key-based; the laptop's `~/.ssh/id_ed25519`).
- **Dir:** `/root/iomarkets-okx/` — `docker-compose.okx.yml` runs:
  - `iomarkets-okx-server` (this app) + `iomarkets-okx-ingester` (auto-reconnect OKX
    WS → shared QuestDB). Both on the existing `iomarkets_default` docker network.
  - **Reuses the shared `questdb` container** from `/root/iomarkets/` (same `trades`
    schema). Our ingester revived the OKX feed the legacy `iomarkets-ingester-okx`
    had stalled (its WS closed ~Jun 22, no reconnect).
- **TLS/proxy:** the existing single **Caddy** (`/root/iomarkets/Caddyfile`) got one
  appended site block: `okx.iomarkets.ai { reverse_proxy okx-server:3000 }`
  (backup at `/root/iomarkets/Caddyfile.bak`). DNS: Cloudflare A record
  `okx` → `89.167.70.245`, **grey cloud (DNS-only)**.
- **Env on box:** `/root/iomarkets-okx/.env` (chmod 600) — same creds as the laptop
  `.env` but with `QUESTDB_HOST=questdb`, the shared QuestDB password, and
  `PUBLIC_BASE_URL=https://okx.iomarkets.ai`.

## Credentials (NOT in git)

All secrets live in `.env` (gitignored) locally and on the box. Includes
`OKX_API_KEY/SECRET/PASSPHRASE` (OKX Web3 Developer Portal), `X402_PAY_TO`,
`X402_NETWORK=eip155:196`, `PROOF_PRIVATE_KEY/PUBLIC_KEY`. **Never commit or paste
these.** If lost, the API key can be recreated at `web3.okx.com/onchainos/dev-portal`
and the proof keypair via `pnpm gen-key` (but the published `PROOF_PUBLIC_KEY` should
stay stable so existing attestations verify).

## Tooling (agent economy CLI)

- `onchainos` CLI at `~/.local/bin/onchainos` (v4.2.4). API-key login (no email OTP)
  reads `OKX_*` from env.
- A2A runtime: `@okxweb3/a2a-node` global npm pkg; daemon auto-starts
  (systemd user unit `okx-a2a.service`). Needed for `agent activate`.
- One-shot env for CLI: `export PATH="$(npm config get prefix)/bin:$HOME/.local/bin:$PATH"`
  then `set -a; eval "$(grep -E '^OKX_(API_KEY|SECRET_KEY|PASSPHRASE)=' .env)"; set +a`.

---

## ✅ Done

- [x] `.env` + proof keypair; OKX facilitator API key created
- [x] Agentic Wallet provisioned (payTo `0x015bfbe…1266`)
- [x] App validated locally: `/health` green, spec-correct 402 vs real OKX facilitator
- [x] Two repo bug fixes: `syncFacilitatorOnStart=true`, `app.set("trust proxy", true)`
- [x] Deployed to VPS as `okx.iomarkets.ai` (Caddy + DNS + shared QuestDB, fresh data)
- [x] ASP `#5774` registered on-chain + **submitted for review**

## ⏳ Remaining (do these to finish)

1. **Fund the demo wallet (in progress).** USDT bought on **Arbitrum** via MetaMask
   (cooling off ~24h); ETH gas on Arbitrum already landed. When the USDT clears,
   **bridge Arbitrum USDT → X Layer USDT0** to `0x015bfbe816635b173e924688fba8794e30031266`
   — full steps in [`BRIDGE.md`](BRIDGE.md). (Original OKX-withdrawal path in
   [`FUNDING.md`](FUNDING.md) is still valid but was blocked by a 24h cool-off.)
   NOT TRON, NOT X Layer **Testnet**.
2. **Confirm the ASP is LIVE.** `./scripts/watch-listing.sh` (one-shot) or `--watch`
   (poll until LIVE). Under the hood:
   ```
   onchainos agent get-my-agents      # look for #5774 approvalLabel != "under review"
   ```
   If rejected, read the reason and fix via `onchainos agent update` (re-reads QA).
   If review stalls past Jul 16 AM, nudge organisers — wording in [`CHASE_ORGANISERS.md`](CHASE_ORGANISERS.md).
3. **Record the demo (≤90s).** Storyboard + X post in [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md).
   Once funded, run the paid-call loop:
   ```
   cd /path/to/IoMarkets-OKX-ASP
   ./scripts/demo-pay.sh                 # /v1/signal/vwap  ($0.002)
   ./scripts/demo-pay.sh /v1/proof/price # signed proof     ($0.01)
   ```
   Screen-record: the 402 → agent signs → 200 + data, then the settlement tx on the
   X Layer explorer (https://www.okx.com/web3/explorer/xlayer). Show the signed proof
   verifying with `pnpm verify <attestation.json>`.
4. **Post on X** with **#OKXAI** — finalized copy in [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md)
   (confirm @handles). Attach the clip.
5. **File the Google form** (ASP details + X post link) **before Jul 17 23:59 UTC** —
   copy-paste answers in [`FORM_ANSWERS.md`](FORM_ANSWERS.md).

## Health checks / ops

```
# is the live endpoint up?
curl -s https://okx.iomarkets.ai/health

# fresh OKX trades flowing into the shared QuestDB? (run on the box)
ssh root@89.167.70.245 "curl -s -G 'http://localhost:9000/exec' --data-urlencode \
  \"query=SELECT count(),max(ts) FROM trades WHERE source='okx' AND ts>dateadd('m',-10,now());\""

# restart the OKX stack on the box
ssh root@89.167.70.245 "cd /root/iomarkets-okx && docker compose -f docker-compose.okx.yml up -d"
```

## Notes / risks

- The service endpoint is **permanent on-chain** in `#5774`. Changing domains later
  needs `agent update` (another ~24h review). Keep `okx.iomarkets.ai`.
- `.money` branding idea shelved; if wanted later, point `iomarkets.money` as a
  redirect (no on-chain change).
- The demo **self-pays** (payer == payTo), so the $5 is mostly a returnable buffer.
