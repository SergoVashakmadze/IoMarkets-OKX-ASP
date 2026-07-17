# X post (#OKXAI) — copy-paste

Required hackathon deliverable: **post on X with #OKXAI**, introducing the ASP with a
demo/walkthrough (**≤90 seconds**), then link the post in the Google form.

> **Do this even if #5774 isn't LIVE yet.** The post and the form are required
> regardless, and neither depends on the listing. Waiting for approval risks having
> nothing filed at all.
>
> **Handles are unverified** — confirm `@okx` and your own handle before posting.
> Do NOT invent a handle; if unsure, drop the @ and write the name in plain text.

---

## Primary (with the video)

> My ASP **IoMarkets.ai** is live on **@okx** 🟢
>
> Autonomous agents pay **per call in USDT0 on X Layer** (x402) and get back
> **verifiable** market truth — an ed25519-signed price proof anchored to the
> settlement tx.
>
> No API keys. No accounts. Verify it yourself against our published key.
>
> Demo ↓ #OKXAI

## Shorter alt

> Agents don't need API keys — they need to **pay** and to **verify**.
>
> **IoMarkets.ai** on **@okx**: pay-per-call market data + cryptographic price
> proofs, settled in USDT0 on X Layer via x402.
>
> Trust no one. Verify everything. #OKXAI

## Forgery angle (strongest — leads with the differentiator)

> Anyone can *claim* a price. We sign ours.
>
> Every paid call to **IoMarkets.ai** on **@okx** returns an ed25519 attestation
> anchored to its x402 settlement tx on X Layer. Forge one and the verifier rejects
> it — watch it happen ↓
>
> Pay per call. Verify without trusting us. #OKXAI

---

## Thread reply 2 (drives the "verifiable" point)

> Every premium call returns a signed attestation + its on-chain settlement txid.
>
> Check the signature against `okx.iomarkets.ai/v1/proof/pubkey`, confirm the tx on
> the X Layer explorer. The proof needs **zero trust in us**.
>
> That's the product.

## Thread reply 3 (optional — the economics)

> It's real money, not a testnet. A buyer agent
> (`0x0b2a11d4…`) pays the ASP (`0x015bfbe8…`) $0.002–$0.01 in USDT0 per call,
> gaslessly, settled on X Layer. Micro-payments an agent can actually afford.

---

## Facts you can safely claim (all verified on production, Jul 17)

- Live endpoint `https://okx.iomarkets.ai`, `/health` green
- `get_vwap` $0.002 · `get_price_proof` $0.01 — both gated by a real **HTTP 402**
- x402 v2, scheme `exact`, network **X Layer** `eip155:196`, asset **USDT0**
- Settlement is **gasless for the payer** (OKX facilitator relays EIP-3009)
- Signed attestation anchored to the settlement txid; published key
  `a95fc434…43cf4` at `/v1/proof/pubkey`
- Forged attestations are **rejected** by the verifier (it pins the published key)
- ASP **#5774** registered on OKX.AI

## Do NOT claim

- ❌ **"Listed / approved / live on the OKX.AI marketplace"** — #5774 is still
  **"Listing under review" / "not listed"**. Say "registered as ASP #5774", not
  "listed". Do not caption the video with a LIVE badge that isn't there.
- ❌ Any volume, revenue or user numbers beyond the real ones (0.042 USDT0 earned
  across 5 calls as of Jul 17 — that's a demo, not traction).
