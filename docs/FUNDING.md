# Funding the wallet for the paid-call demo

Fund the **buyer account** with a little **USDT0 on X Layer** so the demo produces a
real on-chain settlement tx: buyer agent → seller ASP.

> **⚠️ CHANGED Jul 16 — send to the BUYER, not the ASP wallet.**
> This doc used to say the wallet "self-pays". It doesn't and mustn't:
> `0x015bfbe8…1266` is the ASP's `payTo`, so funding it makes the wallet pay itself —
> the settlement may revert, and if it lands it looks like wash volume. **Account 2
> (buyer) was created for this.** See [`BRIDGE.md`](BRIDGE.md).

## Copy these values

**Address (recipient) — Account 2, the BUYER:**

```
0x0b2a11d49c2cd72791987d0bc2203729733fdba0
```

> Do **NOT** send to `0x015bfbe816635b173e924688fba8794e30031266` — that's the ASP
> (`payTo`), which *receives* the demo payments.

**Network:** X Layer (OKX L2) — chain ID `196`
⚠️ Must be **X Layer**. Do NOT send on Ethereum, Arbitrum, BSC, etc.

**Token:** USDT0 (USD₮0)

```
0x779ded0c9e1022225f8e0630b35a9b54be713736
```

**Amount:** ~$5 USDT0 (a buffer; each call costs only $0.002–$0.01)

**Gas (OKB):** not needed — x402 settlement is gasless for the payer (the OKX
facilitator relays and pays gas).

## How to send

OKX app / exchange → **Withdraw** → **USDT** → choose network **X Layer** →
paste the buyer address above → confirm. On X Layer, USDT arrives as **USDT0**.

**This is the fastest route IF it works** — no bridge, no Arbitrum gas, no approve tx.

> **⚠️ Abort immediately if OKX imposes a hold on the new withdrawal address.**
> Exchanges commonly lock withdrawals to a newly-added address for 24h. With the
> deadline at Jul 17 23:59 UTC that is fatal, and you'd have burned time discovering
> it. If you see any whitelist/cooling notice, stop and use the MetaMask → Arbitrum
> bridge in [`BRIDGE.md`](BRIDGE.md) instead — it has no such delay.

(Alternatively: bridge USDT to X Layer via OKX's bridge.)

⚠️ Double-check the address character-for-character before sending — transfers are
irreversible.

## After it lands

**Switch to the buyer account first** — `demo-pay.sh` signs from whichever account is
selected, and it hard-stops with `payer == payTo` if you're still on Account 1.

```bash
onchainos wallet switch f8234c27-f5ad-413b-b935-8f10e0edaa2f   # Account 2 (buyer)
onchainos wallet balance --chain xlayer                        # confirm USDT0 arrived
./scripts/demo-pay.sh                                          # x402 paid call → real settlement tx
onchainos wallet switch a0ad600d-fba7-407d-a895-90114f25fb85   # back — #5774 lives on Account 1
```

## Reference

- Prices: `get_vwap` = $0.002 (`/v1/signal/vwap`), `get_price_proof` = $0.01 (`/v1/proof/price`)
- Explorer: https://www.okx.com/web3/explorer/xlayer
- ASP listing: agent #5774 "IoMarkets.ai" (status: Listing under review)
