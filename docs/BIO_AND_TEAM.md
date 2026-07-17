# Bio & Team intro — Sergo Vashakmadze (solo founder)

> **⚠️ Read before pasting.** Everything below is grounded in what this repo and the
> on-chain record actually prove. Anything about career history, education or prior
> companies is marked `[FILL]` — **I don't know those facts and did not invent them.**
> Judges can check a bio. Fill the blanks yourself or delete the sentence entirely;
> the versions here read fine without them.

---

## Bio — short (safe as-is, no blanks)

```
Sergo Vashakmadze — solo founder, IoMarkets.ai.

Building market infrastructure for agents rather than humans: pay-per-call data with
cryptographic receipts, settled on-chain. Previously shipped IoMarkets.ai's x402
market-data API settled on Algorand; the OKX.AI build (ASP #5774) extends that to
X Layer and adds independently verifiable price proofs.
```

## Bio — one-liner (for a tight field)

```
Solo founder, IoMarkets.ai — agent-native market data with cryptographic receipts, settled on X Layer.
```

## Bio — longer (has blanks)

```
Sergo Vashakmadze — solo founder, IoMarkets.ai.

[FILL: 1–2 sentences of background — e.g. "X years in <field>", prior roles/companies,
what led you to build this. Delete this paragraph if you'd rather not say.]

I build market infrastructure for agents instead of humans. IoMarkets.ai serves
pay-per-call market data with cryptographic receipts: an agent pays $0.002–$0.01 in
USDT0 per call over x402 — no API key, no account — and every premium call returns an
ed25519-signed price attestation anchored to the on-chain settlement tx that paid for
it. Anyone can verify it against a published key without trusting me.

Previously shipped IoMarkets.ai's x402 market-data API settled on Algorand. The OKX.AI
build (ASP #5774) is the same conviction on X Layer, with the proof layer added.

The thesis: agents can't sign up, and they can't take a price on faith. They need to
pay without a human, and verify without trusting the seller.
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

Being solo shaped the engineering: I couldn't rely on a reviewer catching my mistakes,
so I attacked my own work instead. That's how I found the two bugs that mattered — a
verifier that checked signatures against the key embedded in the payload (circular:
it accepted a forgery claiming BTC = $1), and a paid proof tier that had never once
emitted a proof because a settlement hook read an async context opened too late.
Both are fixed, live, and visible in the git history.
```

## Team intro — short

```
Solo founder. One person: payment rail, proof scheme, data pipeline, infra and the
ASP registration. No team, no external funding — bootstrapped.
```

---

## What's safe to claim (verifiable)

- Solo founder; **bootstrapped**, no external funding
- Built and deployed `https://okx.iomarkets.ai` — live, health green
- Registered **ASP #5774** on OKX.AI — **review pending, NOT listed**
- Real paid calls settling USDT0 on X Layer, buyer wallet → seller ASP
- Signed price proofs verifiable against a published key; forgeries rejected
- Also runs the sibling Algorand-settled `api.iomarkets.ai` (pre-existing product)
- Repo: https://github.com/SergoVashakmadze/IoMarkets-OKX-ASP

## Do NOT claim

- ❌ Listed / approved / live **on the OKX.AI marketplace** — #5774 is queued
- ❌ Users, revenue or traction — there are none (0.05 USDT0 of demo calls is not traction)
- ❌ Any background fact left as `[FILL]` above
