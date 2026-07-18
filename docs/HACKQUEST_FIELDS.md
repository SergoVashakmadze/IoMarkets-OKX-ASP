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
**Connect your personal MetaMask.** The Agentic Wallet accounts (`0x015bfbe8…`,
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

Dialog fields: **Type** (Testing / Launch / Other) · **Title** (max **50**) ·
**Description** (max **200**) · **Link** · **Image** (up to 3, 500x300 or 1280x720).

> Everything below is written to fit those limits. Add all four; #4 is the one that
> earns credit. Images are in `submission-images/`.

### Checkpoint 1 · type: **Launch**
**Title** (46)
```
Live ASP: pay-per-call market data behind HTTP 402
```
**Description** (183)
```
Deployed okx.iomarkets.ai. get_vwap ($0.002) and get_price_proof ($0.01) sit behind real x402 challenges, settling USDT0 on X Layer. Prices come from QuestDB fed by a live OKX trade feed.
```
**Link** `https://okx.iomarkets.ai`
**Image** `01-402-challenge.jpg`

### Checkpoint 2 · type: **Launch**
**Title** (33)
```
Registered as ASP #5774 on OKX.AI
```
**Description** (178)
```
Registered on-chain as ASP #5774 and submitted for listing (review pending). The MCP manifest at /mcp/tools lets agents discover our tools and trust anchor before paying anything.
```
**Link** `https://okx.iomarkets.ai/mcp/tools`
**Image** `02-agent-pays.jpg`

### Checkpoint 3 · type: **Launch**
**Title** (43)
```
Signed price proofs + published trust anchor
```
**Description** (180)
```
Every paid proof call returns an ed25519 attestation anchored to its on-chain settlement tx. The public key is published at /v1/proof/pubkey, so anyone can pin it and verify offline.
```
**Link** `https://okx.iomarkets.ai/v1/proof/pubkey`
**Image** `03-proof-accepted.jpg`

### Checkpoint 4 · type: **Testing**  ← the important one
**Title** (41)
```
Real paid calls, and we forged our own proof
```
**Description** (188)
```
Buyer agent pays the ASP per call in USDT0 on X Layer. Testing our own trust model caught 2 bugs: the verifier accepted forgeries, and the proof tier never emitted a proof. Both fixed live.
```
**Link** `https://youtu.be/Yo-TTm6t7Yc`
**Image** `04-forgery-rejected.jpg`

> Why #4 matters: most checkpoints read "built it, it works". Yours says we attacked
> our own trust model, it failed, and we fixed it on production — verifiable in the
> git log and visible in the demo.

---

## 🚫 The rule for every field
**#5774 is registered, NOT listed** — review pending. Never write *live* / *listed* /
*approved* on the marketplace, and claim no traction numbers. It's checkable.
