# Funding the wallet for the paid-call demo

Fund the Agentic Wallet with a little **USDT0 on X Layer** so the demo can produce a
real on-chain settlement tx. This wallet is both the payer and the `payTo`, so the
demo self-pays (USDT0 moves wallet → wallet and mostly returns).

## Copy these values

**Address (recipient):**

```
0x015bfbe816635b173e924688fba8794e30031266
```

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
paste the address above → confirm. On X Layer, USDT arrives as **USDT0**.

(Alternatively: bridge USDT to X Layer via OKX's bridge.)

⚠️ Double-check the address character-for-character before sending — transfers are
irreversible.

## After it lands

Tell the agent. It will:
1. `onchainos wallet balance --chain xlayer` — confirm USDT0 arrived.
2. `scripts/demo-pay.sh` — run the full x402 paid call → real X Layer settlement tx
   to screen-record.

## Reference

- Prices: `get_vwap` = $0.002 (`/v1/signal/vwap`), `get_price_proof` = $0.01 (`/v1/proof/price`)
- Explorer: https://www.okx.com/web3/explorer/xlayer
- ASP listing: agent #5774 "IoMarkets.ai" (status: Listing under review)
