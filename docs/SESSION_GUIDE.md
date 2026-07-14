# IoMarkets.ai → OKX.AI — full session guide

A consolidated record of the analysis, decisions, confirmed values, and next steps
from the setup session. Cross-references the focused docs
([HACKATHON](HACKATHON.md) · [OKX_X402_REFERENCE](OKX_X402_REFERENCE.md) ·
[ASP_LISTING](ASP_LISTING.md) · [DEPLOY](DEPLOY.md)).

---

## 1. Does IoMarkets.ai qualify for the OKX AI Genesis Hackathon?

**Yes — the idea qualifies strongly**, but only counts if it's **built, listed on
OKX.AI, and LIVE** before the deadline.

- Agent-native + x402-native = a natural **ASP** (Agentic Service Provider).
- Fits **Finance Copilot** ($7.5K) + **Software Utility** ($7.5K) + **Revenue
  Rocket** ($20K); differentiator (signed proofs) also fits **Creative Genius**.
- The original repo (`IoMarkets.ai-x402`) was built for a *different* contest
  (Global x402 Challenge on **Algorand**). To qualify for OKX it had to be ported
  to **OKX.AI + X Layer** — done in this new repo.

**Eligibility gate (critical):** *"Your ASP must pass OKX AI's internal review AND
go live to remain eligible. If it can't go live, the submission is invalid."*
Building and submitting are not enough — it must be **live**.

---

## 2. Hackathon requirements & deadline

- **⏰ Deadline: 2026-07-17, 23:59 UTC** (Google form). Review takes ~24h → **list
  by the morning of Jul 16**.
- 4 steps: **build ASP → submit for listing (pass review, go live) → post on X with
  #OKXAI + ≤90s demo → submit the Google form**.
- Prize pool $100K. Primary targets: **Finance Copilot + Revenue Rocket**.
- Full detail: [HACKATHON.md](HACKATHON.md).

---

## 3. Decision: register as A2MCP (not A2A)

| | **A2MCP** ✅ chosen | A2A |
|---|---|---|
| What | Standardized pay-per-call API, fixed price, x402 | Negotiated custom jobs, escrow, sign-off |
| Fit | IoMarkets *is* this (price feeds) | Would need escrow/negotiation we haven't built |
| Deadline | Deployable now | Days of new work |

Register **A2MCP** now; you can add an A2A "custom backtest" service later (one ASP
can hold both). Integration = **in-process OKX Payment SDK** (recommended).

---

## 4. Confirmed OKX values (pulled live from OKX docs)

Two corrections vs first assumptions: settlement is **USDT0 (not USDC)**, and OKX
ships an official **Node SDK**.

| Thing | Value |
|---|---|
| Network | `eip155:196` (X Layer mainnet); testnet `eip155:1952` |
| Settlement token | **USDT0** `0x779ded0c9e1022225f8e0630b35a9b54be713736` (decimals 6) |
| SDK | `@okxweb3/x402-express` + `-evm` + `-core` (Node.js) |
| Scheme | `exact` (EIP-3009); challenge in `PAYMENT-REQUIRED` header, x402Version 2 |
| Prices | USD strings (SDK converts to USDT0): `get_vwap` $0.002, `get_price_proof` $0.01 |
| Facilitator creds | apiKey / secretKey / passphrase from the OnchainOS **dev portal** |
| payTo | the **email-based Agentic Wallet** 0x address |

Full 402 challenge + registration prompts: [OKX_X402_REFERENCE.md](OKX_X402_REFERENCE.md).

### Registration is agent-driven (no web form)
Install the skill into an agent (Claude Code supported), then prompt:
1. `npx skills add okx/onchainos-skills --yes -g`
2. `Log in to Agentic Wallet on Onchain OS with my email` → provisions **payTo**
3. `Help me register an A2MCP ASP on OKX.AI using OKX Agent Identity from Onchain OS`
4. `Help me list my ASP on OKX.AI using Onchain OS` → reviewed within ~24h

### Marketplace reality (okx.ai/tasks)
Brand new (total volume ~$899), pays in USDT, demand skews to **analysis + on-chain
intelligence** (US stock trends, smart-money, wallet behavior, prediction markets,
World Cup) more than raw feeds. Our unique edge is **verifiable** market truth —
lead with that in the X post; consider an analysis wrapper service post-MVP.

---

## 5. What's built (repo: github.com/SergoVashakmadze/IoMarkets-OKX-ASP)

All pushed, typecheck-clean, boots.

- **`src/server.ts`** — Express + **OKX Payment SDK wired**. `get_vwap` (paid data);
  `get_price_proof` signs the **real settled tx** (`context.result.transaction`)
  via a registered `iomarkets-proof` settlement extension. Priced routes serve free
  until creds are set. *Verified: middleware authenticates against the real OKX
  facilitator (401 only on fake creds).*
- **`scripts/ingest.ts`** — OKX public WebSocket trades → QuestDB (ILP). Auto-
  reconnect, ping/pong, clean shutdown. *Verified live: real BTC-USDT trades parsed.*
- **`src/proof/sign.ts`** + `scripts/verify-proof.ts` — ed25519 attestations,
  independently verifiable. *Verified: valid signatures pass, tampered fail.*
- **`src/db/questdb.ts`**, `src/mcp/tools.ts`, `sql/schema.sql`, `docker-compose.yml`.

---

## 6. Wallet setup (where we are now)

Two DIFFERENT wallets — don't conflate:

1. **Dev-portal wallet → API keys** (`web3.okx.com/onchainos/dev-portal`).
   Chosen: **OKX Wallet** (native X Layer; better than MetaMask here, and Phantom
   is Solana-first with no X Layer → don't use Phantom).
   - Connect via **OKX mobile app** (More → Scan the QR in the modal) **or** the
     **OKX Wallet Chrome extension** ("Add").
   - Then **Verify address** (sign the message) — **you do this in the wallet**.
   - Create an API key → copy **apiKey / secretKey / passphrase** (secret +
     passphrase shown once). **Don't paste them into chat.**
2. **Agentic Wallet → payTo** (your receiving address). Created by **email login**
   through the agent, *not* wallet-connect. Separate step.

> Security: I don't connect wallets, sign, install extensions, or handle secrets on
> your behalf — those are yours. I wire the resulting values into `.env` locally.

---

## 7. Remaining checklist (all need your identity)

- [ ] **OKX Wallet** → connect + verify on the dev portal → create API key
      (`OKX_API_KEY` / `OKX_SECRET_KEY` / `OKX_PASSPHRASE`)
- [ ] **Agentic Wallet** (email login via agent) → `X402_PAY_TO`
- [ ] Deploy QuestDB + server on an **HTTPS + domain** host (not the laptop);
      run `pnpm ingest`; `/health` green
- [ ] **Self-check on testnet** (`X402_NETWORK=eip155:1952`): `curl -i .../v1/signal/vwap`
      → **402 + PAYMENT-REQUIRED**; confirm a paid call settles; flip to mainnet
- [ ] **Register + list** the A2MCP service via agent prompts — **by Jul 16 AM**
- [ ] Confirm ASP shows **LIVE** in the marketplace
- [ ] Record ≤90s demo (agent paying + X Layer explorer tx)
- [ ] Post on X with **#OKXAI**; file the Google form **before Jul 17 23:59 UTC**

Next once you have the API creds: tell me (don't paste secrets) and we wire `.env`
and move to deploy.
