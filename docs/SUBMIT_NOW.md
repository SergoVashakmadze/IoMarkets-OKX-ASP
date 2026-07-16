# SUBMIT — the only doc you need (deadline: Jul 17, 23:59 UTC)

Everything is built, funded, verified and recorded. **Three things left, ~15 minutes.**
You can do all of it from any machine — no code, no CLI, no `.env` needed.

---

## ✅ Already done (don't redo)

- ASP live: `https://okx.iomarkets.ai` — `get_vwap` ($0.002), `get_price_proof` ($0.01)
- Real paid calls settling USDT0 on X Layer, buyer → seller, ~0.05 USDT0 earned
- Proof tier emits a signed attestation; forgeries are rejected by the verifier
- **Video recorded: `demo-90s.mp4`** (45s) — in the project root

## ⚠️ The one blocker

**#5774 is still "Listing under review" / "not listed".** Not our doing — it's queued at
OKX. The hackathon says the listing must be **live** to be eligible.
**Submit anyway**: it may be approved before 23:59 UTC, and not submitting guarantees
nothing. **Do not claim it's live.**

---

## STEP 1 — Get the video off this machine (do FIRST)

`demo-90s.mp4` only exists locally and is **gitignored** (it's 1.5MB of binary; also
it's regenerable). Upload it now to Google Drive / Dropbox / Telegram-to-self so you
can attach it tomorrow from any PC.

> Without this you cannot post, and re-recording needs the CLI + `.env` + funded wallet.

## STEP 2 — Post on X (needs the video)

Post copy: **`docs/X_POST.md`**. Recommended version:

> Anyone can *claim* a price. We sign ours.
>
> Every paid call to **IoMarkets.ai** on **@OKX_AI** returns an ed25519 attestation
> anchored to its x402 settlement tx on X Layer. Forge one and the verifier rejects
> it — watch it happen ↓
>
> Pay per call. Verify without trusting us. #OKXAI

- Attach `demo-90s.mp4`
- **`#OKXAI` is mandatory** (hackathon requirement)
- **Verify the `@OKX_AI` handle first.** If unsure, drop the @ and write it plainly.
- **Do NOT write "live on OKX.AI"** — say "ASP #5774 on OKX.AI". Registered ≠ listed.
- **Copy the post URL** — the form needs it.

## STEP 3 — File the Google form (before 23:59 UTC)

Answers: **`docs/FORM_ANSWERS.md`**. Plus your X post link from step 2.

In any notes/comments field, this is your one legitimate nudge about the listing:

> ASP #5774 "IoMarkets.ai" was submitted for listing on Jul 14 and is still showing
> "Listing under review". The service is deployed and healthy: /health returns 200,
> the priced routes return valid x402 402 challenges (exact, eip155:196, USDT0), and
> paid calls settle on X Layer with independently verifiable ed25519 price proofs.
> Happy to provide anything needed for the review.

---

## Facts (all verified on production, Jul 17)

| | |
|---|---|
| Endpoint | `https://okx.iomarkets.ai` |
| ASP | **#5774** "IoMarkets.ai" — **registered, review pending** |
| Chain | X Layer `eip155:196`, USDT0 `0x779ded0c…3736` |
| Buyer (Account 2) | `0x0b2a11d49c2cd72791987d0bc2203729733fdba0` |
| Seller / payTo (Account 1) | `0x015bfbe816635b173e924688fba8794e30031266` |
| Proof key | `a95fc434…43cf4` — `/v1/proof/pubkey` |
| Repo | https://github.com/SergoVashakmadze/IoMarkets-OKX-ASP |

**Never claim:** listed / approved / live on the marketplace; any traction numbers.

---

## If you need to re-record (you shouldn't)

Needs this machine (or `.env` + the `onchainos` CLI elsewhere):
```bash
onchainos wallet switch f8234c27-f5ad-413b-b935-8f10e0edaa2f   # buyer
bash scripts/record-demo.sh                                     # needs xvfb + xterm
onchainos wallet switch a0ad600d-fba7-407d-a895-90114f25fb85   # back — #5774 lives here
```
Costs ~$0.022 of real USDT0 per run. Buyer holds ~24.9 USDT0.

> **Local gotcha:** this laptop's resolver does DNS64 and its NAT64 gateway is broken,
> so ~20–50% of connections to the endpoint fail from here and look like the server is
> down. **It isn't** — the endpoint is 200 over IPv4 from everywhere, including the
> server's own network, and public DNS publishes only an A record. `demo-pay.sh`
> forces IPv4 and retries to work around it.
