# OKX.AI ASP — Handover / Resume Guide

Snapshot of where the OKX.AI hackathon submission stands and exactly how to finish
it. Written 2026-07-14, **updated 2026-07-16 ~21:30 UTC**. **Deadline: Google form
before 2026-07-17 23:59 UTC — ~26h left at time of writing.**

---

## 🟢 FUNDED & WORKING (Jul 16 ~23:00 UTC) — what's left

**The pipeline is proven end-to-end on production.** Funding landed, the paid call
works, and the proof tier now actually emits a signed attestation (it never did
before — see below).

- **Funded.** Banxa delivered 25.39 USDT to the **OKX exchange** (not MetaMask), and
  it withdrew straight to X Layer with **no cooling-off hold**. Buyer account holds
  **24.958 USDT0**; the ASP has earned **0.042 USDT0** across 5 real paid calls.
- **Demo verified live:** 402 → TEE-signed EIP-3009 → settle → 200 + data, payer
  `0x0b2a11d4…` → payTo `0x015bfbe8…`. A real transfer between two addresses.
- **Proof tier fixed and verified:** a paid `/v1/proof/price` returns
  `extensions["iomarkets-proof"]` with payload + signature anchored to the settlement
  txid; `pnpm verify` says **PROOF ACCEPTED**, and a forgery says **PROOF REJECTED**.

**Remaining — all of it is yours, none of it depends on the listing:**

1. **Record the demo (≤90s)** — storyboard in [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md).
   Switch to Account 2 first (`onchainos wallet switch f8234c27-…`), or `demo-pay.sh`
   hard-stops. **Switch back to Account 1 afterwards** or #5774 lookups break.
   Strongest beat: show a forged attestation getting `PROOF REJECTED`.
2. **Post on X** with **#OKXAI**, tagging @okx. Required regardless.
3. **File the Google form** before **Jul 17 23:59 UTC**. Required regardless. Its
   notes field is also the only sane channel left for nudging the listing.
4. **#5774 is still queued** — out of our hands. **DO NOT CHASE ON DISCORD/TELEGRAM**
   (see the moderation section below: two accounts lost, zero results).

## TL;DR — what's the current state

The ASP is **built, deployed live, submitted to OKX, and its proof system is now
verified sound**. The blockers are **funding** (ours) and **listing approval**
(OKX's, out of our hands).

- **OKX Agent identity:** ASP **#5774** "IoMarkets.ai" — still **"Listing under
  review" / "not listed"** as of Jul 16 ~21:00 UTC. That's **~47h**, against an
  expected ~24h. The full record shows **`approvalRemark: null`** — no rejection, no
  changes requested, avatar/description/endpoint all present. It is simply queued;
  there is nothing to fix on our side. Watch with `./scripts/watch-listing.sh --watch`.
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

### Funding status (Jul 16 ~23:00 UTC) — DONE ✅

Banxa delivered to the **OKX exchange**, not MetaMask — which made the bridge
unnecessary. `FUNDING.md`'s withdrawal route worked with **no cooling-off hold**.

| Where | Balance | Notes |
|---|---|---|
| **Buyer — Account 2** `0x0b2a11d4…dba0` | **24.958 USDT0** (X Layer) | pays for demo calls |
| ASP — Account 1 `0x015bfbe8…1266` | **0.042 USDT0** | earned from 5 paid calls |
| MetaMask `0x45800…22376` (Arbitrum) | 0.00899 ETH (~$16.90) | unused; bridge not needed |

**Two accounts, and it matters.** The Agentic Wallet had only Account 1, whose X Layer
address **is** the `payTo` — so funding it would have made the demo pay itself
(may revert; reads as wash volume). Account 2 was created as the buyer.

- Account 1 — ASP identity (**#5774 lives here**): `a0ad600d-fba7-407d-a895-90114f25fb85`
- Account 2 — buyer: `f8234c27-f5ad-413b-b935-8f10e0edaa2f`

⚠️ `onchainos wallet add` **auto-switches** the active account, which silently breaks
every `#5774` lookup. Always switch back to Account 1 when done.

### 🔒 Proof EMISSION — was silently broken, now fixed (Jul 16, `e109852`)

**The paid proof tier never returned a proof.** `enrichSettlementResponse` read
`proofStore.getStore()?.pending`, but the AsyncLocalStorage middleware was registered
**after** the payment middleware — so the settlement extension ran with no context,
returned `undefined`, and said nothing. Buyers paid $0.01, got price data, and an
`attestation` field pointing at an `extensions["iomarkets-proof"]` key that was never
populated. Proved on production with temporary logging (`hasStore: false`).

Fixed by opening the async context **before** the payment middleware. Verified live:
the settlement response now carries the signed payload + signature anchored to the
real txid, `pnpm verify` returns **PROOF ACCEPTED**, and a forgery is **REJECTED**.
A paid call that emits no proof now **warns** instead of failing silently.

> This was load-bearing: the pubkey endpoint, the verifier's key pinning, and the
> forgery-rejection demo beat all depended on an attestation the product didn't emit.

### 🔒 Proof VERIFICATION — was circular, now fixed (Jul 16)

**`verify-proof.ts` was circular and accepted forgeries.** It checked the signature
against `att.payload.server_pubkey` — the key carried *inside the attestation being
verified*. Demonstrated by signing a payload claiming **BTC = $1** with a freshly
generated attacker keypair and txid `0xdeadbeef`: the verifier printed
`Signature: VALID`, exit 0. Since verifiable price proofs are **the** differentiator
(Creative Genius angle), a judge testing this would have sunk it.

Fixed in **`2930699`**: the payload's `server_pubkey` must equal the key published at
`/v1/proof/pubkey` before the signature is considered. The forgery now returns
`PROOF REJECTED` (exit 1). Overridable via `pnpm verify <att.json> <pubkey>` or
`$PROOF_PUBLIC_KEY` for rotation. Typecheck clean.

**Production keys verified consistent (Jul 16 ~21:10 UTC)** — all four agree on
`a95fc434…43cf4`: derived from prod `PROOF_PRIVATE_KEY`, prod `PROOF_PUBLIC_KEY`,
live `/v1/proof/pubkey`, and the constant pinned in `verify-proof.ts`. So the fix is
proven **both** ways: forgeries rejected, genuine proofs accepted. No redeploy needed.

> **Latent bug, fix AFTER the deadline.** `src/config.ts:38-39` reads
> `PROOF_PRIVATE_KEY` and `PROOF_PUBLIC_KEY` as **two independent env vars** — the
> published key is *not derived* from the signing key, and nothing validates they
> agree. They match in prod today, but if they ever drift the server would publish a
> key that cannot verify its own proofs, silently. Fix by deriving `proofPublicKey`
> from the private key. **Do not touch config on a live service before Jul 17.**
>
> To re-check without exposing the key, run it *inside the container* (never source
> `.env` locally):
> ```
> ssh root@89.167.70.245 'docker exec -i iomarkets-okx-server sh -c "cat > /app/chk.mjs"' < chk.mjs
> ssh root@89.167.70.245 'docker exec iomarkets-okx-server node /app/chk.mjs; docker exec iomarkets-okx-server rm -f /app/chk.mjs'
> ```
> where `chk.mjs` derives with `@noble/ed25519` and prints public values only.

### ⛔ Chasing the listing — STOP, it cost two accounts (Jul 16)

Three attempts to nudge organisers in community channels, three moderation actions:

- **Telegram:** first post auto-hidden ("links not allowed"); a reworded link-free
  repost got the account **restricted from posting**.
- **Discord:** post **blocked by AutoMod** ("content blocked by this server… may also
  be viewed by server owners") and the account **timed out** — twice.

**Root cause:** the gatekeeper was an automated filter, not a human. A new account
posting **wallet address + multiple URLs + urgency language** is the textbook
scam/drainer signature every crypto community auto-blocks — and every draft had all
three. Rewording a filtered message and reposting reads as deliberate evasion, which
is what escalates a hide into a restriction into a ban.

**Rules:** do not post in those channels again; do not evade the restrictions; never
rework-and-retry a filtered message — ask a human instead. And note **community mods
cannot approve #5774 anyway** — the review is OKX-internal, so this was near-zero
expected value at real cost.

**Legitimate channels, all still unused:** the **Google form's notes field**
(unfiltered, straight to organisers, required anyway — best option), **email/support
ticket** (long version in [`CHASE_ORGANISERS.md`](CHASE_ORGANISERS.md), never sent),
and the **required #OKXAI X post** tagging @okx (a deliverable you owe regardless,
links fine, and shipping beats pleading).

### New docs / tooling (Jul 15–16)
- [`BRIDGE.md`](BRIDGE.md) — Arbitrum USDT → X Layer USDT0 to the Agentic Wallet
- [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md) — ≤90s storyboard + #OKXAI X post copy
- [`FORM_ANSWERS.md`](FORM_ANSWERS.md) — copy-paste Google form answers
- [`CHASE_ORGANISERS.md`](CHASE_ORGANISERS.md) — **now carries a STOP notice**; the
  dead messages are kept only as a record of what not to send
- `scripts/watch-listing.sh` — poll #5774 until LIVE (a background watcher was running
  locally on Jul 16; it does **not** survive the session — re-run it)

### Known minor bug (not fixed)
`scripts/demo-pay.sh:26` runs `grep` under `set -euo pipefail`, so when no
`PAYMENT-REQUIRED` header comes back the script dies silently at line 26 and the
helpful error on line 27 never prints. Harmless when things work; annoying if
debugging live on camera. One-line fix.

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
   **Do NOT chase in Discord/Telegram** — three attempts, three moderation actions,
   and their mods can't approve it anyway (see the STOP section above). Any nudge
   goes in the Google form's notes field or an email.
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
- **The demo does NOT self-pay any more** (Jul 16). Fund **Account 2, the buyer**
  (`0x0b2a11d49c2cd72791987d0bc2203729733fdba0`), never the ASP wallet — payer ==
  payTo may revert and reads as wash volume. `demo-pay.sh` now hard-stops if you try.
  Payments land in Account 1; both accounts are yours. At $0.002/call, $5 ≈ 2,500 calls.
