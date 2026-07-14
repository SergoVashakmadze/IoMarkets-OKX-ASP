# OKX.AI A2MCP Listing — IoMarkets.ai

Copy-paste source for the OKX.AI ASP registration form (name, description, service
list, default pricing). Register as **Agent-to-MCP (A2MCP)**.

> Values marked `<confirm>` come from OKX onboarding and can't be guessed:
> your Agentic Wallet 0x address, the X Layer USDC contract, and the broker/facilitator URL.

## Identity

- **Name:** IoMarkets.ai — Verifiable Market-Truth Oracle
- **Category:** Finance Copilot
- **Tagline:** Agent-native, pay-per-call market data with cryptographically verifiable price proofs — settled on X Layer via x402.

**Short description (≤160 chars):**
> Pay-per-call crypto market signals (VWAP) and ed25519-signed price proofs your agent can verify without trusting us. x402 on X Layer.

**Long description:**
> IoMarkets.ai is a QuestDB-backed market-data service for autonomous agents. Every call is a single x402 micropayment in USDC on X Layer — no accounts, no API keys, no subscription. A cheap high-volume **signals** tier (VWAP) gives agents live market state; a premium **verification** tier returns an ed25519-signed attestation anchored to the on-chain settlement tx — an independently checkable proof of market truth (verify the signature against our published public key, confirm the tx settled on X Layer). Machine-payable, machine-verifiable, real-time.

## Service list (A2MCP tools)

| Service (MCP tool) | Input | Returns | Price/call | Status at submission |
|---|---|---|---|---|
| `get_vwap` | `pair`, `window_min?` | Volume-weighted average price | **$0.002** | ✅ live (MVP) |
| `get_price_proof` | `pair`, `at?` | Signed point-in-time price attestation | $0.01 | verification tier |

_Roadmap (add to same ASP later): `get_imbalance` ($0.003), `get_candles` ($0.005), `audit_execution` ($0.05, A2A candidate)._

## Default pricing

- **Default per-call price:** $0.002 USDC (`get_vwap`).
- **Rationale:** data tier priced for high-volume agent traffic (sub-cent); verification tier 5× because a signed, on-chain-anchored proof is the defensible product. Fits **Revenue Rocket** — many tiny settlements, visible on-chain volume.

## x402 endpoint config

| Field | Value |
|---|---|
| Scheme | `exact` (EIP-3009) |
| Network | X Layer — `eip155:196` (mainnet) / `eip155:195` (testnet) |
| Settlement token | USDC on X Layer — `<confirm contract>` |
| payTo | OKX Agentic Wallet 0x address — `<confirm>` |
| Facilitator / Broker | OKX OnchainOS — `<confirm URL>` |
| Public endpoints | `https://<vps>/v1/signal/vwap`, `https://<vps>/v1/proof/price` |
| MCP manifest | `https://<vps>/mcp/tools` |

## Step 3 — X post (#OKXAI)

> My ASP @IoMarkets is live on @OKX_AI: autonomous agents pay per call in USDC on X Layer and get back **verifiable** market truth — an ed25519-signed price proof anchored to the settlement tx. No API keys, no accounts, just x402. Demo ↓ #OKXAI

Pair with a ≤90s screen recording: the agent firing paid calls + the settlement tx on the X Layer explorer.
