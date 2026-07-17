# Bio & Team intro — Sergo Vashakmadze (solo founder)

Sources: profile supplied by Sergo + public LinkedIn (Chevening/DAAD/Oxford AI).
Everything here is his own material — no invented facts, no invented roles or dates.

---

## Bio — one-liner

```
Founder & CEO, IoMarkets — ex-Bloomberg, ex-World Bank. Building capital markets infrastructure for agents, not humans.
```

## Bio — short (best default)

```
Sergo Vashakmadze — London-based fintech founder, building capital markets
infrastructure for agents rather than humans.

Founder & CEO of IoMarkets (AI-native capital markets infrastructure: tokenization,
secondary markets, digital distribution) and of Rainmaker Partners; also builds
DipBuyer AI, developing AI-native agents for quantitative and systematic trading.
FCA AI Supercharged Sandbox (Cohort 2), Central Bank of Bahrain Regulatory Sandbox,
Barclays Rise alumnus.

Previously Bloomberg L.P., The World Bank and Colliers International. Chevening and
DAAD scholar; Oxford Artificial Intelligence Programme, Saïd Business School.
```

## Bio — long

```
Sergo Vashakmadze is a London-based fintech entrepreneur and solo founder working at
the edge of capital markets infrastructure, merging agentic AI, Web3 and asset
tokenization to reshape how financial platforms function.

He is Founder & CEO of IoMarkets, an AI-native capital markets infrastructure platform
using agentic AI and blockchain for tokenization, secondary markets and digital
distribution across traditional and alternative assets. He is also Founder & CEO of
Rainmaker Partners, focused on venture-building, strategic capital and early-stage
disruptive technology, and builds DipBuyer AI, developing AI-native agents and
algorithms for quantitative, systematic and algorithmic trading.

His ventures sit deliberately at the regulatory frontier: invited to Cohort 2 of the
FCA's AI Supercharged Sandbox, a graduate of the FCA x CFTE AI Lab Supercharged
Academy, an approved participant in the Central Bank of Bahrain's Regulatory Sandbox,
and a Barclays Rise alumnus.

Before building AI- and blockchain-native financial systems full time, he worked
across global financial, data and development institutions: Bloomberg L.P., The World
Bank and Colliers International. He is a Chevening and DAAD scholar and completed the
Oxford Artificial Intelligence Programme at Saïd Business School.

That background is the thesis behind this build. Bloomberg made market data legible to
humans — a terminal, a login, a subscription. None of that works for an agent. Agents
can't sign up, and they can't take a price on faith. IoMarkets.ai on OKX.AI serves
market data an agent can pay for without a human ($0.002–$0.01 per call in USDT0 over
x402, no API key, no account) and verify without trusting the seller — every premium
call returns an ed25519-signed price attestation anchored to the on-chain settlement
tx that paid for it.
```

---

## Team intro — solo founder

```
Solo founder — one person, no team.

I designed, built, deployed and shipped every part of this: the x402 payment
integration on X Layer, the ed25519 proof scheme and its published trust anchor, the
QuestDB market-data pipeline fed by OKX's live trade feed, the MCP manifest, the
standalone verifier, the infrastructure (Docker + Caddy, HTTPS, live at
okx.iomarkets.ai), and the ASP registration as #5774.

The idea comes from having worked at Bloomberg and the World Bank: market data was
built for humans with logins and subscriptions, and none of that survives contact with
an agent. Agents need to pay without a human and verify without trusting the seller.

Being solo shaped the engineering. With no reviewer to catch my mistakes, I attacked
my own work instead — which is how I found the two bugs that mattered: a verifier that
checked signatures against the key embedded in the payload (circular — it accepted a
forgery claiming BTC = $1), and a paid proof tier that had never once emitted a proof
because a settlement hook read an async context opened too late. Both fixed, live, and
visible in the git history.

Elsewhere I'm Founder & CEO of IoMarkets and Rainmaker Partners, and build DipBuyer AI.
FCA AI Supercharged Sandbox (Cohort 2); Central Bank of Bahrain Regulatory Sandbox;
Barclays Rise alumnus. Previously Bloomberg L.P., The World Bank, Colliers International.
```

## Team intro — short

```
Solo founder. One person: payment rail, proof scheme, data pipeline, infra, ASP
registration. Ex-Bloomberg and World Bank — where market data was built for humans
with logins and subscriptions. This is the version agents can pay for and verify.
No team, no external funding — bootstrapped.
```

---

## Why the Bloomberg line leads

It's the strongest sentence available and it's true: **Bloomberg built market data for
humans; this builds it for agents.** It turns the CV into the reason the product
exists, rather than decoration. Judges see a lot of "I built an oracle"; far fewer
from someone who shipped market data at Bloomberg and the World Bank first.

## Leave OUT of any bio

- ❌ **IBM Coursera certificates** (Sep 2024) — public on LinkedIn, but "Intro to
  Software Engineering" next to a working x402 rail with a cryptographic proof layer
  reads as career-changer and undercuts the code. The build is the credential.
- ❌ **RYA sailing certificates** — noise.
- ❌ **Listed / approved / live on the OKX.AI marketplace** — #5774 is queued.
- ❌ Users, revenue or traction — there are none.

## Assets worth using

- **23K LinkedIn followers** — real distribution. Post the demo from the accounts with
  the audience; the Social Buzz track ($10K, 10 winners) is judged on exactly this.
- **Regulatory credibility** (FCA sandbox, Bahrain CBB, Barclays Rise) — rare in a
  hackathon field and directly relevant to the Finance Copilot track.
