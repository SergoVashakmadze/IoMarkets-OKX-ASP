# Demo package — ≤90s recording + X post (#OKXAI)

Everything needed to record and post the moment the listing is LIVE and the wallet is
funded. Two money shots: **(1) an agent paying on-chain**, **(2) anyone verifying the
proof without trusting us**.

**Live facts (verified):**
- Endpoint: `https://okx.iomarkets.ai` — `/health` green
- Services: `get_vwap` ($0.002), `get_price_proof` ($0.01) — both return HTTP 402
- Chain: X Layer `eip155:196`, settlement in USDT0
- Agentic Wallet (payer + payTo): `0x015bfbe816635b173e924688fba8794e30031266`
- Published proof key: `https://okx.iomarkets.ai/v1/proof/pubkey`
  (`a95fc43400976d6f324427765987cd8676e69fddaf0a49b57d309d4db2743cf4`)
- Explorer: https://www.okx.com/web3/explorer/xlayer

---

## ≤90s storyboard (shot-by-shot)

| # | ~Time | On screen | Say / caption |
|---|---|---|---|
| 1 | 0–8s | OKX.AI marketplace listing **#5774 "IoMarkets.ai"** (LIVE) + the landing page `okx.iomarkets.ai` | "An agent-native market-data ASP on OKX.AI — pay per call, verify the truth." |
| 2 | 8–22s | Terminal: `./scripts/demo-pay.sh` → the **HTTP 402** challenge, decoded | "No API key. The agent hits a priced route and gets a 402 x402 challenge — $0.002 in USDT0 on X Layer." |
| 3 | 22–40s | Same run: wallet **signs EIP-3009** (TEE) → replay with `PAYMENT-SIGNATURE` → **200 + VWAP** | "The Agentic Wallet signs the payment, the OKX facilitator settles it gaslessly, data comes back." |
| 4 | 40–55s | `./scripts/demo-pay.sh /v1/proof/price` → signed attestation with `settlement_txid` | "The premium tier returns an ed25519-signed price proof, anchored to the settlement tx." |
| 5 | 55–70s | **X Layer explorer** open on the settlement tx | "Here's that payment — a real settlement, on-chain, on X Layer." |
| 6 | 70–90s | `curl .../v1/proof/pubkey` then `pnpm verify attestation.json` → **"Signature: VALID"** | "And anyone can verify the proof against our published key — trust no one. That's verifiable market truth." |

**Tips**
- Pre-open the explorer tab and the pubkey in a browser so cuts are instant.
- Record terminal at a readable font size; keep it to ~75s of action + a 1s title/end card.
- For the **Revenue Rocket** angle, optionally show a quick loop generating several
  paid calls (visible micro-payment volume) before the explorer shot:
  `for i in $(seq 1 10); do ./scripts/demo-pay.sh >/dev/null; done` then show the wallet's tx list.

## Exact commands to run on camera
```bash
cd /path/to/IoMarkets-OKX-ASP
onchainos wallet balance --chain xlayer         # show USDT0 is funded
./scripts/demo-pay.sh                            # get_vwap  ($0.002): 402 -> sign -> 200
./scripts/demo-pay.sh /v1/proof/price            # get_price_proof ($0.01): signed attestation
# (save the proof route's JSON to attestation.json, then:)
curl -s https://okx.iomarkets.ai/v1/proof/pubkey # the published trust anchor
pnpm verify attestation.json                     # -> Signature: VALID
```

---

## X post (#OKXAI) — copy-paste

**Primary (with video):**
> My ASP **@IoMarkets** is live on **@OKX_AI** 🟢
>
> Autonomous agents pay **per call in USDT0 on X Layer** (x402) and get back
> **verifiable** market truth — an ed25519-signed price proof anchored to the
> settlement tx. No API keys, no accounts. Verify it yourself against our published
> key. Demo ↓ #OKXAI

**Shorter alt:**
> Agents don't need API keys — they need to pay and to verify. **@IoMarkets** on
> **@OKX_AI**: pay-per-call market data + cryptographic price proofs, settled in
> USDT0 on X Layer via x402. Trust no one, verify everything. #OKXAI

**Thread reply 2 (optional, drives the "verifiable" point):**
> Every premium call returns a signed attestation + its on-chain settlement txid.
> Check the signature against `okx.iomarkets.ai/v1/proof/pubkey` and confirm the tx
> on the X Layer explorer. The proof needs zero trust in us. That's the product.

> Confirm the exact handles before posting (@IoMarkets / @OKX_AI) — update if the
> official OKX AI handle differs.
