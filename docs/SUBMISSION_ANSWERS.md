# Submission answers — copy-paste everything (Jul 17)

Every field for **YouTube**, **HackQuest**, **X**, and the **form**, in one place.
Deadline: **Jul 17, 23:59 UTC** — but HackQuest's *Register Countdown* showed ~23h at
00:55 local (≈23:00 UTC Jul 17), so **registration may close ~1h earlier**. Register first.

## Live links

| | |
|---|---|
| **Demo video** | https://youtu.be/Yo-TTm6t7Yc |
| Local file | `demo-90s.mp4` (45s, 1.5MB, project root — gitignored, not on GitHub) |
| Endpoint | https://okx.iomarkets.ai |
| Public key | https://okx.iomarkets.ai/v1/proof/pubkey |
| MCP tools | https://okx.iomarkets.ai/mcp/tools |
| Repo | https://github.com/SergoVashakmadze/IoMarkets-OKX-ASP |
| Explorer | https://www.okx.com/web3/explorer/xlayer |
| YouTube channel | IoMarkets TV |

## 🚫 The rule that applies to every field

**#5774 is "Listing under review" / NOT listed.** Never write *live*, *listed* or
*approved* on the marketplace. Write **"ASP #5774 on OKX.AI"** or **"registered as ASP
#5774, listing review pending"**. It's checkable, and a false claim is a worse failure
than a pending queue. Also claim no traction numbers — there are none.

---

# 1. YouTube

**Title** (≤100)
```
Pay per call. Verify without trusting us. — IoMarkets.ai ASP #5774 #OKXAI
```
Alt:
```
Agents pay $0.002 in USDT0 per call and verify the price proof — x402 on X Layer #OKXAI
```

**Description**
```
IoMarkets.ai is an agent-native market-data ASP on OKX.AI (ASP #5774).
No API key. No account. An agent just pays — and can verify what it bought.

In this 45s walkthrough:
• A buyer agent hits a priced route and gets an HTTP 402 x402 challenge
• It signs an EIP-3009 authorisation from its OKX Agentic Wallet (TEE)
• The OKX facilitator settles $0.002 USDT0 on X Layer — gaslessly — and the data returns
• The premium tier ($0.01) returns an ed25519-signed price attestation, anchored to the
  on-chain settlement tx it was paid for
• We verify that proof against our PUBLISHED key — then forge one with an attacker's key
  claiming BTC = $1, and the verifier rejects it

That last part is the point: the proof needs zero trust in us. Pin our public key,
check the signature, confirm the settlement tx on the X Layer explorer.

Endpoint:    https://okx.iomarkets.ai
Public key:  https://okx.iomarkets.ai/v1/proof/pubkey
MCP tools:   https://okx.iomarkets.ai/mcp/tools
Explorer:    https://www.okx.com/web3/explorer/xlayer
Code:        https://github.com/SergoVashakmadze/IoMarkets-OKX-ASP

Chain: X Layer (eip155:196) · Settlement: USDT0 · Protocol: x402 v2 (scheme: exact)

Built for the OKX.AI Genesis Hackathon.
#OKXAI #XLayer #x402
```

**Other fields**
- Thumbnail: skip / Auto-generated
- Playlists: none
- Audience: **No, it's not made for kids**
- **Visibility:** **Unlisted is fine** (verified: the link resolves with no login, HTTP 200). Public only adds YouTube-search discoverability. **Private is NOT ok.**

---

# 2. HackQuest

**Project name**
```
IoMarkets.ai
```
(if the dot is rejected: `IoMarkets`)

**Tagline / one-liner**
```
Agent-native market data: pay per call in USDT0 on X Layer, verify every price against a published key.
```

**Short description**
```
An agent-native market-data ASP on OKX.AI. Agents pay per call via x402 (USDT0 on X
Layer) with no API key or account, and every premium call returns an ed25519-signed
price attestation anchored to its on-chain settlement tx — independently verifiable
against our published key. Forge a proof and the verifier rejects it. ASP #5774 on OKX.AI.
```

**Project intro (long)**
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

**Tracks** — primary **Finance Copilot**; also **Creative Genius** (signed proofs),
**Revenue Rocket** (real per-call micro-payments), **Best Product**.

### Project Setup page (hackquest.io/projects/setup/…)

**Sector:** **AI** + **Infra**. (AI = agent-native, matches the Finance Copilot track;
Infra = a paid data/settlement rail agents build on, not an end-user app. Add **DeFi**
only if 3 picks are allowed — defensible via stablecoin settlement + market data, but
it isn't a DeFi protocol and a wrong tag routes you to the wrong judges.)

**Tech Tag (max 8)** — presets: `Node`, `Web3`. Then **+ Add New** ×6:
```
TypeScript
x402
X Layer
USDT0
ed25519
MCP
```
> **Do NOT tick Ethers / Python / Solidity / React / Next / Vue** — not used. Verified
> against package.json: `@okxweb3/x402-core|evm|express`, `@noble/ed25519`,
> `@noble/hashes`, `@questdb/nodejs-client`, `express`, `pg`, `ws`, `tsx`, `typescript`.
> A judge who opens the repo and finds a tag you don't use is a bad first impression.

**MVP Link:** `https://okx.iomarkets.ai`

**Project Link:** `https://github.com/SergoVashakmadze/IoMarkets-OKX-ASP`

**X (Twitter) Link:** your own handle (username only) — **use the account that posts
the #OKXAI video**, so the entry and the post match.

**Wallet → Connect Wallet:** connect your personal **MetaMask**. It's for prize
payout and it's the wallet that can do a browser wallet-connect handshake. The Agentic
Wallet accounts (`0x015bfbe8…` ASP, `0x0b2a11d4…` buyer) are TEE-backed and driven via
the `onchainos` CLI — they **cannot** connect in a browser. Don't try.

### Images (up to 4 — 500x300 or 1280x720)

**Ready to upload** — generated from the demo, all **1280x720**, in `submission-images/`:

| File | Shows |
|---|---|
| `01-402-challenge.jpg` | title banner + the decoded HTTP 402 x402 challenge |
| `02-agent-pays.jpg` | wallet signs EIP-3009 → HTTP 200 + live VWAP |
| `03-proof-accepted.jpg` | published pubkey + **PROOF ACCEPTED** |
| `04-forgery-rejected.jpg` | **PROOF ACCEPTED** and forged proof **PROOF REJECTED** |

> Upload `04` first if only one is shown as the cover — the forgery rejection is the
> differentiator. Regenerate any time:
> `ffmpeg -ss <t> -i demo-90s.mp4 -frames:v 1 -vf "scale=1280:-1:flags=lanczos,crop=1280:720:0:0" out.jpg`

### Description

```
Agent-native market data with cryptographic receipts. Agents pay per call via x402
($0.002 for a VWAP signal, $0.01 for a signed price proof) in USDT0 on X Layer — no
API key, no account, no invoice, gasless for the payer. Every premium call returns an
ed25519-signed price attestation anchored to the on-chain settlement tx that paid for
it, independently verifiable against our published key. Forge one and the verifier
rejects it. Registered as ASP #5774 on OKX.AI; listing review pending.
```

### Progress During Hackathon

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

### Fundraising Status

```
Bootstrapped — no external funding.
```

### Active Hackathon

```
OKX.AI Genesis Hackathon
```

### Deployment Details (confidential — judges only)

**Ecosystem Deployed:** **X Layer** (if absent from the dropdown, pick `Other` and say
"X Layer (OKX L2), eip155:196")

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

**Full tech stack (for any free-text stack field)**
```
TypeScript · Node · Express · @okxweb3/x402-core|evm|express (x402 v2, scheme: exact)
X Layer (eip155:196) · USDT0 · EIP-3009 via OKX Agentic Wallet (TEE) · OKX facilitator
ed25519 (@noble/ed25519) attestations · QuestDB (OKX live trade feed) · MCP manifest
Docker + Caddy on Hetzner · https://okx.iomarkets.ai
```

---

# 3. X post (required: #OKXAI + demo ≤90s)

**Attach `demo-90s.mp4` directly** (native video autoplays in-feed — better for Social
Buzz) and/or link the YouTube URL. **Verify the @okx handle before posting**; if
unsure, drop the @ and write it plainly. **Save the post URL — the form needs it.**

```
Anyone can claim a price. We sign ours.

Every paid call to IoMarkets.ai on @okx returns an ed25519 attestation anchored to
its x402 settlement tx on X Layer. Forge one and the verifier rejects it — watch it
happen ↓

Pay per call. Verify without trusting us. #OKXAI
```

**Reply 2**
```
Every premium call returns a signed attestation + its on-chain settlement txid.

Check the signature against okx.iomarkets.ai/v1/proof/pubkey, confirm the tx on the
X Layer explorer. The proof needs zero trust in us.

That's the product.
```

**Reply 3 (economics)**
```
Real money, not a testnet. A buyer agent (0x0b2a11d4…) pays the ASP (0x015bfbe8…)
$0.002–$0.01 in USDT0 per call, gaslessly, settled on X Layer. Micro-payments an agent
can actually afford.
```

---

# 4. The form

Answers in [`FORM_ANSWERS.md`](FORM_ANSWERS.md) + the X post URL + the YouTube link.

**Notes/comments field** — your one legitimate nudge about the listing:
```
ASP #5774 "IoMarkets.ai" was submitted for listing on Jul 14 and is still showing
"Listing under review". The service is deployed and healthy: /health returns 200, the
priced routes return valid x402 402 challenges (exact, eip155:196, USDT0), and paid
calls settle on X Layer with independently verifiable ed25519 price proofs. Happy to
provide anything needed for the review.
```

---

# Verified facts (safe to claim)

- Live endpoint `https://okx.iomarkets.ai`, `/health` 200 (`questdb:true, proof:true, x402:true`)
- `get_vwap` $0.002 · `get_price_proof` $0.01 — both gated by real **HTTP 402**
- x402 v2, scheme `exact`, network **X Layer** `eip155:196`, asset **USDT0** `0x779ded0c…3736`
- Settlement **gasless for the payer** (OKX facilitator relays EIP-3009)
- Signed attestation anchored to the settlement txid; key `a95fc434…43cf4` at `/v1/proof/pubkey`
- Forged attestations **rejected** (the verifier pins the published key)
- Buyer `0x0b2a11d49c2cd72791987d0bc2203729733fdba0` → ASP `0x015bfbe816635b173e924688fba8794e30031266`
- ASP **#5774** registered on OKX.AI — **review pending, NOT listed**
