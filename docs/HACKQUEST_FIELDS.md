# HackQuest — every field, in form order

Project setup: https://hackquest.io/projects/setup/0e8bb5d8-ab02-41d1-b65e-2e8ab64559de

---

## Project Name
```
IoMarkets.ai
```
(if the dot is rejected: `IoMarkets`)

## Tagline / one-liner
```
Agent-native market data: pay per call in USDT0 on X Layer, verify every price against a published key.
```

## Description
```
Agent-native market data with cryptographic receipts. Agents pay per call via x402
($0.002 for a VWAP signal, $0.01 for a signed price proof) in USDT0 on X Layer — no
API key, no account, no invoice, gasless for the payer. Every premium call returns an
ed25519-signed price attestation anchored to the on-chain settlement tx that paid for
it, independently verifiable against our published key. Forge one and the verifier
rejects it. Registered as ASP #5774 on OKX.AI; listing review pending.
```

## Project Intro
```
Agents can't sign up. They have no email, no credit card, no API key — and no way to
know whether the data they just bought is true.

IoMarkets.ai is an agent-native market-data ASP. An agent hits a priced endpoint, gets
an HTTP 402 x402 challenge, signs an EIP-3009 authorisation from its wallet, and gets
the data back. $0.002 per call, settled in USDT0 on X Layer, gasless for the payer.
No key, no account, no invoice, no human in the loop.

The differentiator is verifiable truth. Every premium call ($0.01) returns an
ed25519-signed price attestation anchored to the on-chain settlement tx that paid for
it. Anyone can pin our published key, check the signature, and confirm the tx on the
X Layer explorer — the proof needs zero trust in us. Forge an attestation with your
own key and our verifier rejects it. The demo shows exactly that.

That matters because an agent acting on a price needs to know it wasn't fabricated.
Signed, anchored, and independently checkable is market truth an agent can act on and
a third party can audit after the fact.

Built with: OKX x402 SDK (scheme: exact), X Layer (eip155:196), USDT0, OKX Agentic
Wallet for TEE signing, QuestDB fed by OKX's live trade feed, and an MCP manifest so
agents can discover the tools and the trust anchor before paying.

Status: deployed at https://okx.iomarkets.ai, registered as ASP #5774 on OKX.AI
(listing review pending). Real paid calls settling on X Layer today — buyer agent to
seller ASP, verifiable on-chain.
```

## Progress During Hackathon
```
Built end-to-end during the hackathon:

• Live ASP at https://okx.iomarkets.ai — Docker + Caddy, HTTPS, health green
• x402 v2 paid routes via the OKX SDK: get_vwap ($0.002), get_price_proof ($0.01),
  settling USDT0 on X Layer (eip155:196) through the OKX facilitator
• Market data from QuestDB fed by a live OKX trade-feed ingester (auto-reconnecting)
• The differentiator: ed25519 price attestations anchored to the settlement txid,
  plus a published trust anchor at /v1/proof/pubkey and an MCP manifest that
  advertises it so agents can pin the key before paying
• A standalone verifier (pnpm verify) that pins the published key — it ACCEPTS a real
  attestation and REJECTS a forgery signed with any other key
• Registered on-chain as ASP #5774 and submitted for listing (review pending)
• Real money, not a testnet: a buyer agent pays the seller ASP per call in USDT0,
  settled on X Layer, verifiable on the explorer

Two things we found and fixed by testing rather than assuming:
• The verifier originally checked signatures against the pubkey embedded in the
  payload — circular, and it accepted a forgery claiming BTC = $1. It now pins the
  independently published key.
• The paid proof tier never actually emitted a proof: the settlement extension read an
  AsyncLocalStorage context opened after the payment middleware, so it silently
  returned nothing. Buyers paid and got a placeholder. Fixed and verified live.
```

## Fundraising Status
```
Bootstrapped — no external funding.
```

## Active Hackathon
```
OKX.AI Genesis Hackathon
```

## Sector
**AI** + **Infra**  (add **DeFi** only if 3 picks allowed)

## Tech Tag (max 8)
Presets: `Node`, `Web3`
Then **+ Add New**:
```
TypeScript
x402
X Layer
USDT0
ed25519
MCP
```
**Do NOT tick** Ethers / Python / Solidity / React / Next / Vue — not used.

## Links

| Field | Value | Name |
|---|---|---|
| MVP Link | `https://okx.iomarkets.ai` | Live ASP — try it |
| Project Link | `https://github.com/SergoVashakmadze/IoMarkets-OKX-ASP` | Source code |
| X (Twitter) Link | *your handle, username only* | — |
| Demo video | `https://youtu.be/Yo-TTm6t7Yc` | Demo video (45s) |
| Proof key | `https://okx.iomarkets.ai/v1/proof/pubkey` | Proof public key — verify any price |

## Wallet
**Connect MetaMask** (`0x4580…22376`). The Agentic Wallet accounts (`0x015bfbe8…`,
`0x0b2a11d4…`) are TEE-backed and CLI-only — they cannot do a browser handshake.

## Images (up to 4 — 1280x720)
In `submission-images/`:
```
01-402-challenge.jpg     title banner + decoded HTTP 402 challenge
02-agent-pays.jpg        wallet signs EIP-3009 -> HTTP 200 + live VWAP
03-proof-accepted.jpg    published pubkey + PROOF ACCEPTED
04-forgery-rejected.jpg  PROOF ACCEPTED and forged proof PROOF REJECTED
```
Upload `04` first if only one becomes the cover.

## Deployment Details (confidential — judges only)

**Ecosystem Deployed:** `X Layer` (if absent → `Other`)
**Testnet/Mainnet:** **Mainnet**

**Contract address & deployed link:**
```
Deployed service (the product):  https://okx.iomarkets.ai
  /health                        -> {"ok":true,"questdb":true,"proof":true,"x402":true}
  /v1/signal/vwap    $0.002      -> HTTP 402 x402 challenge
  /v1/proof/price    $0.01       -> HTTP 402; on payment returns a signed attestation
  /v1/proof/pubkey               -> ed25519 trust anchor (public)
  /mcp/tools                     -> MCP manifest

We deployed NO custom contract. This is an x402 HTTP service: payments are EIP-3009
authorisations settled by the OKX facilitator in an existing token.

Network:            X Layer mainnet, eip155:196
Settlement token:   USDT0  0x779ded0c9e1022225f8e0630b35a9b54be713736
Seller / payTo (ASP #5774 wallet):  0x015bfbe816635b173e924688fba8794e30031266
Buyer agent wallet:                 0x0b2a11d49c2cd72791987d0bc2203729733fdba0

Example settlement tx (buyer -> ASP, 0.002 USDT0, X Layer):
  0x10d73229f4067bcb6eb8d2069c04c781fe7d3f799887df2ced804fc25085656b

Example paid proof-tier settlement, anchored inside the attestation:
  0x3b39c153b838ecf8a673dac2ab4b43bfdab0ac372fa2c15458b0441934618b27

Proof public key (pin this to verify any attestation):
  a95fc43400976d6f324427765987cd8676e69fddaf0a49b57d309d4db2743cf4

Explorer: https://www.okx.com/web3/explorer/xlayer
Source:   https://github.com/SergoVashakmadze/IoMarkets-OKX-ASP
```

## Tracks
Primary **Finance Copilot**. Also **Creative Genius** (signed proofs), **Revenue
Rocket** (real per-call micro-payments), **Best Product**.

---

# Checkpoints tab

### Checkpoint 1 — Live ASP, paid routes behind HTTP 402 · Jul 14
```
Deployed the service at https://okx.iomarkets.ai (Docker + Caddy + HTTPS, health
green). Two priced routes live behind real x402 v2 challenges: get_vwap ($0.002) and
get_price_proof ($0.01), scheme "exact", network X Layer eip155:196, settling in
USDT0 via the OKX facilitator. Market data comes from QuestDB fed by a live
auto-reconnecting OKX trade-feed ingester — real prices, not fixtures.
```

### Checkpoint 2 — Registered as ASP #5774 on OKX.AI · Jul 14
```
Registered the agent on-chain as ASP #5774 "IoMarkets.ai" and submitted it for
marketplace listing. Published an MCP manifest at /mcp/tools so agents can discover
the tools — and the trust anchor — before paying. Listing review is still pending at
time of writing.
```

### Checkpoint 3 — Verifiable price proofs + published trust anchor · Jul 15–16
```
Shipped the differentiator: every paid proof call returns an ed25519-signed price
attestation anchored to the on-chain settlement tx that paid for it. Published the
public key at /v1/proof/pubkey (and /.well-known/okx-proof/pubkey.json) so any third
party can pin it and verify offline, with the MCP manifest advertising it as the
trust anchor. Built a standalone verifier (pnpm verify) that needs no trust in us.
```

### Checkpoint 4 — Real paid calls on X Layer + two bugs found by testing · Jul 16–17
```
Funded a separate buyer-agent wallet and ran the full loop end-to-end with real money:
buyer 0x0b2a11d4… pays seller ASP 0x015bfbe8… per call in USDT0, settled on X Layer,
verifiable on the explorer.

Testing the trust model rather than assuming it caught two real bugs:
• The verifier checked signatures against the pubkey embedded in the payload —
  circular. It accepted a forgery claiming BTC = $1. It now pins the independently
  published key, and the forgery is rejected.
• The paid proof tier had never actually emitted a proof: the settlement extension
  read an AsyncLocalStorage context opened after the payment middleware, so it
  silently returned nothing while still charging. Fixed and verified live.

Recorded a 45s demo showing the 402, the payment, a real proof accepted, and a forged
one rejected.
```

> Checkpoint 4 is the one that earns credit: it says we tried to break our own trust
> model and it broke — then fixed it on production, with receipts a judge can check in
> the git log. Most checkpoints read "built it, it works".

---

## 🚫 The rule for every field
**#5774 is registered, NOT listed** — review pending. Never write *live* / *listed* /
*approved* on the marketplace, and claim no traction numbers. It's checkable.
