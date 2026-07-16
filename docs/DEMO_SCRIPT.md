# Demo package — ≤90s recording

Two money shots: **(1) a buyer agent paying a seller ASP on-chain**, **(2) anyone
verifying the proof without trusting us — and a forgery getting rejected.**

> **Rewritten Jul 17** for the **two-account** flow. The previous version listed the
> wallet as "payer + payTo" and self-paid — wrong, and it would have filmed the ASP
> paying itself. It also gated everything on the listing being LIVE; **the demo does
> not depend on the listing**, and #5774 is still queued.
>
> X post copy now lives in [`X_POST.md`](X_POST.md).

**Live facts (all verified on production, Jul 17):**
- Endpoint: `https://okx.iomarkets.ai` — `/health` green
- Services: `get_vwap` ($0.002), `get_price_proof` ($0.01) — both return HTTP 402
- Chain: X Layer `eip155:196`, settlement in **USDT0**
- **Buyer** (Account 2 — pays): `0x0b2a11d49c2cd72791987d0bc2203729733fdba0`
- **Seller / ASP** (Account 1 — `payTo`, holds #5774): `0x015bfbe816635b173e924688fba8794e30031266`
- Published proof key: `https://okx.iomarkets.ai/v1/proof/pubkey`
  (`a95fc43400976d6f324427765987cd8676e69fddaf0a49b57d309d4db2743cf4`)
- Explorer: https://www.okx.com/web3/explorer/xlayer

## ⚠️ Before you record

```bash
onchainos wallet switch f8234c27-f5ad-413b-b935-8f10e0edaa2f   # BUYER
```
`demo-pay.sh` hard-stops with `payer == payTo` if you're still on Account 1 — that
guard exists because a single-account demo pays itself. **Afterwards:**
```bash
onchainos wallet switch a0ad600d-fba7-407d-a895-90114f25fb85   # back — #5774 lives here
```

---

## ≤90s storyboard (shot-by-shot)

| # | ~Time | On screen | Say / caption |
|---|---|---|---|
| 1 | 0–8s | Landing page `okx.iomarkets.ai` (add the #5774 listing **only if** it's live by then) | "An agent-native market-data ASP — pay per call, verify the truth." |
| 2 | 8–22s | Terminal: `./scripts/demo-pay.sh` → the **HTTP 402** challenge, decoded | "No API key, no signup. The agent hits a priced route and gets a 402 — $0.002 in USDT0 on X Layer." |
| 3 | 22–38s | Same run: wallet **signs EIP-3009** (TEE) → replay → **200 + live VWAP** | "The buyer agent signs, the OKX facilitator settles it gaslessly, the data comes back." |
| 4 | 38–55s | `./scripts/demo-pay.sh /v1/proof/price` → **attestation.json** printed, with `settlement_txid` | "The premium tier returns an ed25519-signed price proof, anchored to the settlement tx." |
| 5 | 55–68s | **X Layer explorer** on the settlement tx — `0x0b2a11d4… → 0x015bfbe8…` | "There's the payment. Real settlement on-chain — a buyer agent paying a seller agent." |
| 6 | 68–90s | `pnpm verify attestation.json` → **PROOF ACCEPTED**, then a forged one → **PROOF REJECTED** | "Anyone can verify it against our published key. Forge one, it's rejected. Verifiable market truth." |

**Shot 6 is the differentiator — do not cut it.** Accepting a real proof is table
stakes. *Rejecting a forgery on camera* is what makes the claim credible.

**Shot 5 matters too:** two distinct addresses. That's why the buyer account exists —
a self-transfer would read as wash volume, especially against the Revenue Rocket track.

**Tips**
- Pre-open the explorer tab so the cut is instant.
- Terminal at a readable font (zoom 1.5+ on a hi-dpi screen).
- ~75s of action + a 1s end card ≈ 90s.
- **Revenue Rocket angle:** loop calls before the explorer shot to show micro-payment
  volume — `for i in $(seq 1 10); do ./scripts/demo-pay.sh >/dev/null; done` — then
  show the ASP balance ticking up.

## Exact commands to run on camera

```bash
cd /path/to/IoMarkets-OKX-ASP
onchainos wallet switch f8234c27-f5ad-413b-b935-8f10e0edaa2f   # buyer
onchainos wallet balance --chain xlayer                        # funded

./scripts/demo-pay.sh                     # get_vwap ($0.002): 402 -> sign -> 200 + data
./scripts/demo-pay.sh /v1/proof/price     # get_price_proof ($0.01) -> writes attestation.json

curl -s https://okx.iomarkets.ai/v1/proof/pubkey   # the published trust anchor
pnpm verify attestation.json                       # -> PROOF ACCEPTED
pnpm verify forged.json                            # -> PROOF REJECTED

onchainos wallet switch a0ad600d-fba7-407d-a895-90114f25fb85   # back to the ASP identity
```

`demo-pay.sh` writes `attestation.json` automatically on the proof tier (it decodes
`extensions["iomarkets-proof"]` out of the settlement response).

**Making `forged.json` for shot 6:** sign any payload with a throwaway ed25519 key via
`src/proof/sign.ts`. The verifier pins the *published* key, so a forgery fails on the
key check before the signature is even considered.

## Pre-recorded terminal capture

`scripts/record-demo.sh` records shots 2–4 and 6 unattended — ffmpeg + x11grab, into
its own window, so nothing else on the desktop is captured. Output: `demo-terminal.mp4`.
Re-runnable; each run costs ~$0.022 in real USDT0.
