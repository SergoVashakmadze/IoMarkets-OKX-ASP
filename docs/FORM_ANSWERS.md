# Google form — submission answer sheet (copy-paste)

Fill the OKX AI Genesis Hackathon Google form before **Jul 17, 23:59 UTC**. Field
labels vary; map these to whatever the form asks. Everything here is verified live.

## Core facts
| Field | Value |
|---|---|
| Project / ASP name | **IoMarkets.ai — Verifiable Market-Truth Oracle** |
| OKX.AI Agent ID | **#5774** (role: ASP) |
| Category / track | **Finance Copilot** (primary); also **Revenue Rocket**, **Creative Genius** |
| Live endpoint | `https://okx.iomarkets.ai` |
| MCP manifest | `https://okx.iomarkets.ai/mcp/tools` |
| Chain / rail | X Layer (`eip155:196`), settlement in **USDT0**, x402 via OKX Payment SDK |
| Agentic Wallet (payTo) | `0x015bfbe816635b173e924688fba8794e30031266` |
| Proof public key (verify) | `https://okx.iomarkets.ai/v1/proof/pubkey` |
| X post link | _(paste after posting — see docs/DEMO_SCRIPT.md)_ |
| Demo video link | _(paste after recording)_ |
| Team / contact | _(your name + email: dxp3102@gmail.com or preferred)_ |

## One-liner (≤160 chars)
> Pay-per-call crypto market signals (VWAP) and ed25519-signed price proofs your agent can verify without trusting us. x402 on X Layer.

## Short description
> IoMarkets.ai is an agent-native market-data ASP on OKX.AI. Every call is a single
> x402 micropayment in USDT0 on X Layer — no accounts, no API keys, no subscription.
> A high-volume signals tier (VWAP) gives agents live market state; a premium
> verification tier returns an ed25519-signed price attestation anchored to the
> on-chain settlement tx — independently checkable against our published public key.

## Long description / "what it does"
> Autonomous agents need two things markets don't give them by default: a way to
> **pay** for data without accounts/API keys, and a way to **trust** the data they
> get. IoMarkets.ai solves both. It exposes two A2MCP tools behind x402:
>
> - **`get_vwap`** ($0.002/call) — volume-weighted average price for a pair over a
>   trailing window, served from a QuestDB store fed by OKX's live trade feed.
> - **`get_price_proof`** ($0.01/call) — a point-in-time price attestation, signed
>   with an ed25519 key and anchored to the x402 settlement transaction on X Layer.
>
> Every call is a real USDT0 micropayment settled gaslessly via the OKX facilitator.
> The premium tier's key property: a buyer (or any third party) can verify the proof
> **offline** — check the ed25519 signature against the public key we publish at
> `/v1/proof/pubkey`, then confirm the settlement txid on the X Layer explorer. No
> trust in us required. Machine-payable, machine-verifiable, real-time.

## Why it fits the tracks
- **Finance Copilot:** live, structured market data an agent can act on, priced for
  autonomous per-call consumption.
- **Revenue Rocket:** sub-cent pricing → many micropayments → visible on-chain USDT0
  volume from an agent loop.
- **Creative Genius:** cryptographically **verifiable** price proofs anchored on-chain
  — a novel "trust no one" data primitive, not just another price feed.

## Tech stack
> Node.js/Express · `@okxweb3/x402-*` (OKX Payment SDK) · OKX facilitator · X Layer
> (`eip155:196`) · USDT0 · QuestDB (market store) · OKX public WebSocket ingester ·
> ed25519 (`@noble/ed25519`) signed attestations · deployed behind Caddy/TLS.

## Verify-it-yourself (for judges)
```
curl -s https://okx.iomarkets.ai/health
curl -s https://okx.iomarkets.ai/mcp/tools
curl -s https://okx.iomarkets.ai/v1/proof/pubkey
curl -i  https://okx.iomarkets.ai/v1/signal/vwap   # -> HTTP 402 + PAYMENT-REQUIRED
```

> Reminder: the form needs the **X post link + demo video** — record/post first
> (docs/DEMO_SCRIPT.md), then file this. Listing must show **LIVE** or the
> submission is invalid.
