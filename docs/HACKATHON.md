# OKX AI Genesis Hackathon — requirements & deadline (don't forget!)

> **⏰ HARD DEADLINE: 2026-07-17, 23:59 UTC** — Google form submission.
> Today is 2026-07-14 → **~3.5 days**. Review takes ~24h, so **submit the ASP for
> listing by the morning of Jul 16** to leave a resubmit buffer.

Organizers: **OKX.AI × HackQuest**. Landing: https://www.hackquest.io/hackathons/OKXAI-Genesis-Hackathon

## The eligibility gate (read this twice)

> Your ASP must **pass OKX AI's internal review AND go live** to remain eligible.
> If the listing is not approved or cannot go live, **the submission is invalid.**

Building it is not enough. Submitting it is not enough. It must be **live on OKX.AI**.

## The 4 required steps

1. **Build your ASP** — an agent-native service solving a real use case (crypto or non-crypto).
2. **Submit for listing on OKX.AI** → pass review → **go live**.
3. **Post on X** with **#OKXAI** — introduce the ASP + a demo/walkthrough (**≤90 seconds**).
4. **Submit the Google form** — ASP details + link to your X post — **before Jul 17, 23:59 UTC**.

## Prize tracks ($100,000 total)

| Track | Prize | Our angle |
|---|---|---|
| Best Product | $20K | polished, working, verifiable |
| Creative Genius | $20K | signed on-chain price proofs (novel) |
| **Revenue Rocket** | $20K | **many micro-payments → visible on-chain volume (agent loop)** |
| **Finance Copilot** (category) | $7.5K | **primary target — market data ASP** |
| Software Utility (category) | $7.5K | secondary |
| Lifestyle / Artistic (category) | $7.5K each | n/a |
| Social Buzz | $10K (10 winners) | strong #OKXAI post + demo |

**Primary target: Finance Copilot + Revenue Rocket.** Judging = OKXAI internal review.

## Our submission = IoMarkets.ai (A2MCP)

- **Mode:** Agent-to-MCP (pay-per-call, x402) — see `docs/ASP_LISTING.md`
- **Chain/rail:** X Layer (`eip155:196`), **USDT0**, x402 via OKX Payment SDK (`@okxweb3/x402-*`)
- **MVP live service:** `get_vwap` ($0.002 / `2000`); `get_price_proof` ($0.01 / `10000`)
- **Differentiator:** ed25519-signed, independently-verifiable price proofs

## Master checklist (details in `docs/DEPLOY.md`)

- [x] Confirm OKX x402 values — done: X Layer `eip155:196`, USDT0 `0x779d…3736`, SDK `@okxweb3/x402-*` (`docs/OKX_X402_REFERENCE.md`)
- [ ] Deploy QuestDB + origin on a stable host with **HTTPS + domain** (not the laptop); `/health` green
- [ ] Attach OKX Payment SDK middleware; `curl -i` unpaid → **402 + PAYMENT-REQUIRED**
- [ ] Register + list A2MCP via agent prompts (`docs/OKX_X402_REFERENCE.md`) — **list by Jul 16 AM**
- [ ] Confirm ASP shows **LIVE** in the OKX.AI marketplace (also reachable via Agent ID pre-review)
- [ ] Record ≤90s demo (agent paying + X Layer explorer tx)
- [ ] Post on X with **#OKXAI** (+ link the demo)
- [ ] File the Google form (ASP details + X post link) **before Jul 17 23:59 UTC**

## Positioning note (from live okx.ai/tasks)

Marketplace is brand-new (total volume ~$899), pays in USDT, and demand skews to
**analysis + on-chain intelligence** (US stock trends, smart-money tracking, wallet
behavior, prediction markets, World Cup) more than raw price feeds. Our unique angle
is **verifiable** market truth — lean into that in the X post, and consider an
analysis/insight wrapper service post-MVP. See `docs/OKX_X402_REFERENCE.md`.
