# Pitch video — script & build

**Built and ready: `pitch-video.mp4` (87s, 1280x720, no audio).** Title cards cut with
real demo footage. Submittable as-is.

> **A narrated version is stronger.** Silent cards make the argument; *you* saying "I
> built market data at Bloomberg, and agents can't use any of it" makes it land. If
> you have 3 minutes tomorrow, read the script below over the same cut and swap it.
> Rough and honest beats polished and late.

## Rebuild

```bash
python3 scripts/make-pitch-slides.py    # -> pitch-slides/*.jpg  (1280x720)
scripts/make-pitch-video.sh             # -> pitch-video.mp4     (~87s)
```
Edit the card text in `scripts/make-pitch-slides.py`; edit timings/cuts in
`scripts/make-pitch-video.sh`.

---

## Narration script (~90s, matches the cut)

**[0–5s · "Bloomberg built market data for humans"]**
> I'm Sergo Vashakmadze. I spent part of my career at Bloomberg and the World Bank,
> building market data for humans — a terminal, a login, a subscription.
> None of that works for an agent.

**[5–10s · "An agent can't sign up"]**
> An AI agent has no email, no credit card, no API key. And when it does get a price,
> it has no way to know the price wasn't simply made up.

**[10–15s · "Pay without a human / Verify without trusting the seller"]**
> Agents need two things humans never had to: pay without a human, and verify without
> trusting the seller.

**[15–20s · "IoMarkets.ai"]**
> IoMarkets.ai is market data built for agents. Two-tenths of a cent per call, in
> USDT0, settled on X Layer. No key. No account. No human.

**[20–39s · demo: 402 → sign → 200]**
> The agent hits our endpoint and gets an HTTP 402 — a payment challenge. It signs
> from its own wallet, the OKX facilitator settles it gaslessly, and the data comes
> back. That's the whole handshake.

**[39–53s · proof tier]**
> Every premium call comes back signed — an ed25519 attestation, anchored to the
> on-chain transaction that paid for it.

**[53–71s · ACCEPTED then REJECTED]**
> You don't have to trust me. Here's a real proof, checked against our published key —
> accepted. And here's one I forged with my own key, claiming Bitcoin is one dollar —
> rejected. That's the product: verifiable market truth.

**[71–76s · live]**
> It's live today at okx dot iomarkets dot ai, registered as ASP #5774, with real
> payments settling on X Layer right now.

**[76–82s · who]**
> I'm a solo founder. FCA AI Sandbox, Central Bank of Bahrain sandbox, Barclays Rise.
> I built market data for institutions. This is the version agents can actually use.

**[82–87s · close]**
> Pay per call. Verify without trusting us.

## If the pitch allows 3 minutes

Add ~30s after the forgery beat — it's the strongest credibility material you have:

> Building this solo meant no reviewer to catch my mistakes, so I attacked my own work
> instead. Two things fell over. My verifier was checking signatures against the key
> carried inside the proof itself — circular. It happily accepted a forgery claiming
> Bitcoin was a dollar. And the paid proof tier had never once emitted a proof:
> buyers paid, and a bug silently returned a placeholder. Both are fixed, live, and in
> the git history. I'd rather show you that than a slide.

## Card list

```
01-hook        Bloomberg built market data for humans / None of it works for an agent
02-problem     An agent can't sign up / can't tell if the price was made up
03-thesis      Pay without a human. Verify without trusting the seller.
04-solution    IoMarkets.ai — $0.002/call · USDT0 on X Layer · x402
05-demo-lead   Watch an agent pay        -> 16s demo footage
06-proof-lead  Every premium call signed -> 10s demo footage
07-forge-lead  Don't trust us. Check it. -> 14s demo footage (ACCEPTED / REJECTED)
08-live        Live today · ASP #5774
09-who         Solo founder · ex-Bloomberg · ex-World Bank · FCA · Barclays Rise
10-close       Pay per call. Verify without trusting us.
```

## Claims on screen — all verified

Every line is checkable: the endpoint is live, #5774 is registered (**not listed** —
no card says otherwise), payments settle on X Layer, the forgery really is rejected.
