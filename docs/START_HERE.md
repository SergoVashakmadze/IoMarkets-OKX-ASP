# START HERE — everything, one page (Jul 17)

**Deadline: Jul 17, 23:59 UTC.** HackQuest's register countdown implied a gate nearer
**23:00 UTC** — treat that as the real deadline.

---

## The only 3 things left

1. **YouTube — unlisted is fine** (verified: resolves with no login). Private is not.
   invisible submission).
2. **Post on X** with **#OKXAI** + the demo → **copy the post URL**.
3. **HackQuest → Submit** using [`FINAL_SUBMISSION_FORM.md`](FINAL_SUBMISSION_FORM.md).

> The X post gates everything: `X Participation Post (Link)` is a required field on the
> submission form. No post → no submission.

## Which doc for which field

| You're filling… | Open |
|---|---|
| **The submit form** (tracks, ASP name, Agent ID, description, links) | [`FINAL_SUBMISSION_FORM.md`](FINAL_SUBMISSION_FORM.md) |
| HackQuest **project setup** (sector, tech tags, images, deployment, checkpoints) | [`HACKQUEST_FIELDS.md`](HACKQUEST_FIELDS.md) |
| **X post** copy | [`X_POST.md`](X_POST.md) |
| **YouTube** title/description/visibility | [`SUBMISSION_ANSWERS.md`](SUBMISSION_ANSWERS.md) §1 |
| **Team intro** (200-char field) | [`TEAM_INTRO.md`](TEAM_INTRO.md) |
| **Bio** | [`BIO_AND_TEAM.md`](BIO_AND_TEAM.md) |
| **Any URL or address** | [`LINKS.md`](LINKS.md) |
| Pitch video script / rebuild | [`PITCH_SCRIPT.md`](PITCH_SCRIPT.md) |
| Google form (if there is one) | [`FORM_ANSWERS.md`](FORM_ANSWERS.md) |

## Videos & images — LOCAL ONLY, not on GitHub

| File | What | Where |
|---|---|---|
| `demo-90s.mp4` | 45s demo — the ≤90s deliverable | project root · **also** https://youtu.be/Yo-TTm6t7Yc |
| `pitch-video-narrated.mp4` | 1:52 pitch **with voiceover** | project root |
| `pitch-video.mp4` | 87s pitch, silent | project root |
| `submission-images/` | 4 × 1280x720 (upload `04` first) | project root |
| `pitch-slides/` | the 10 pitch cards | project root |

> **⚠️ Back these up before you lose this machine.** They're gitignored. Only
> `demo-90s.mp4` is safe (on YouTube). Rebuild commands are in `PITCH_SCRIPT.md`, but
> they need `.env` + the funded wallet.

## The rule for every field

**#5774 is REGISTERED, not listed** — review pending, and it's checkable.
Never write *live* / *listed* / *approved* on the marketplace. Never claim traction.
Say **"ASP #5774 on OKX.AI"**.

## Copy-paste, fastest path

```
ASP Name         IoMarkets.ai
Agent ID         5774
Tracks           Finance Copilot · Creative Genius · Revenue Rocket · Best Product · Social Buzz
MVP Link         https://okx.iomarkets.ai
Project Link     https://github.com/SergoVashakmadze/IoMarkets-OKX-ASP
Demo             https://youtu.be/Yo-TTm6t7Yc
Proof key        https://okx.iomarkets.ai/v1/proof/pubkey
Wallet           connect MetaMask (0x4580…22376) — NOT the Agentic Wallet
```

**ASP Description** (292/300)
```
Agent-native market data with cryptographic receipts. Agents pay per call via x402 in USDT0 on X Layer — no API key, no account. Every premium call returns an ed25519 price attestation anchored to its settlement tx, verifiable against our published key. Forge one and the verifier rejects it.
```

**Team intro** (191/200)
```
Solo founder, ex-Bloomberg and World Bank — I built market data for humans there. Agents can't use it. Built all of this myself: x402 rail, ed25519 proofs, data pipeline, infra. Bootstrapped.
```

---

## State of the build (all verified on production)

- Live: `https://okx.iomarkets.ai` — health green, `get_vwap` $0.002, `get_price_proof` $0.01
- Real paid calls settling USDT0 on X Layer: buyer `0x0b2a11d4…` → ASP `0x015bfbe8…`
- Signed proofs work; forgeries rejected (`pnpm verify`)
- Buyer wallet holds ~24.9 USDT0 (~12,000 more calls)
- **#5774: still "Listing under review" / not listed** — out of our hands

## Background / ops docs

[`HANDOVER_OKX.md`](HANDOVER_OKX.md) (full state + history) ·
[`DEPLOY.md`](DEPLOY.md) · [`OKX_X402_REFERENCE.md`](OKX_X402_REFERENCE.md) ·
[`FUNDING.md`](FUNDING.md) · [`BRIDGE.md`](BRIDGE.md) (funding — done, kept for record) ·
[`DEMO_SCRIPT.md`](DEMO_SCRIPT.md) · [`HACKATHON.md`](HACKATHON.md) ·
[`CHASE_ORGANISERS.md`](CHASE_ORGANISERS.md) (**⛔ do not chase — 2 accounts lost**)

## Local gotcha worth knowing

This laptop's resolver does DNS64 and its NAT64 gateway is broken, so ~20–50% of
requests to the endpoint fail **from here** and look like the server is down. It isn't
— public DNS publishes only an A record and the endpoint is 200 from everywhere else.
`demo-pay.sh` forces IPv4 and retries.
