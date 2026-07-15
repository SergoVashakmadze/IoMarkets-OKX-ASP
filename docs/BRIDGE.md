# Bridge — Arbitrum USDT → X Layer USDT0 (fund the Agentic Wallet)

Tomorrow's first move once the Banxa USDT clears. Goal: move your **USDT on Arbitrum**
to **USDT0 on X Layer**, delivered to the **Agentic Wallet** so the demo can self-pay.

## ⚠️ The one thing that must be right: the recipient
Your MetaMask address and the Agentic Wallet are **different wallets**:

| | Address | Role |
|---|---|---|
| MetaMask (source) | `0x4580…322376` | holds the bought USDT + ETH gas |
| **Agentic Wallet (destination)** | **`0x015bfbe816635b173e924688fba8794e30031266`** | payer/payTo for the x402 demo |

So the bridge must **send to a custom recipient** = the Agentic Wallet. If you bridge
to the default (your own MetaMask address), the funds land in the wrong wallet and
you'd need OKB gas to move them again. **Set the recipient explicitly.**

## Preconditions (check first)
- [ ] Banxa cool-off cleared → **USDT visible on Arbitrum** in MetaMask
- [ ] **ETH on Arbitrum** for gas (✅ already have ~$17 — confirmed)
- [ ] You know the destination address (copy it from the table above, verify char-for-char)

---

## Steps — OKX Web3 bridge (recommended: guaranteed X Layer + USDT0)

1. Go to **web3.okx.com** → **Bridge** (cross-chain). Click **Connect Wallet** → MetaMask → approve.
2. **From:** network **Arbitrum**, token **USDT**. Enter the amount (e.g. ~**20 USDT**;
   you only need ~$5 for the demo, but bridging more is fine — it self-pays back).
3. **To:** network **X Layer**, token **USDT0**.
4. **Recipient / "Send to another address":** enable it and paste
   **`0x015bfbe816635b173e924688fba8794e30031266`**. ⚠️ Double-check it.
5. Review the quote (route, fee, est. receive, time — usually a few minutes).
6. If prompted, **Approve** USDT spending (first tx, small ETH gas), then **Confirm/Bridge**
   (second tx). Sign both in MetaMask.
7. Wait for "completed". Keep the tx hash.

> If OKX's bridge doesn't expose a custom-recipient field for this route, use the
> **fallback** below instead — don't bridge to your own address and hope.

## Confirm it landed
```bash
cd /path/to/IoMarkets-OKX-ASP
onchainos wallet balance --chain xlayer      # expect USDT0 > 0 at the Agentic Wallet
```
Also viewable on the explorer: https://www.okx.com/web3/explorer/xlayer (search the wallet address).

## Then → run the demo
Once USDT0 shows on X Layer, follow **docs/DEMO_SCRIPT.md**:
```bash
onchainos wallet balance --chain xlayer         # show it's funded (on camera)
./scripts/demo-pay.sh                            # get_vwap  ($0.002)
./scripts/demo-pay.sh /v1/proof/price            # signed proof ($0.01)
```

---

## Fallback A — bridge to your MetaMask on X Layer, then send on
Use only if no custom-recipient field:
1. Bridge Arbitrum USDT → X Layer USDT0 to your **own** MetaMask address.
2. Add **X Layer** network to MetaMask (chainId 196) if needed; you'll need a little
   **OKB** on X Layer for gas to do step 3 (bridge a tiny bit of ETH→OKB, or use OKX
   Gas Station). 
3. **Send** USDT0 → `0x015bfbe816635b173e924688fba8794e30031266`.
   > Adds a step + needs OKB gas — that's why direct custom-recipient is preferred.

## Fallback B — alternate bridges
Any bridge that supports **X Layer** as a destination **and** a custom recipient works
(e.g. an aggregator like Bungee/Jumper if it lists X Layer). Same rule: destination =
the Agentic Wallet address, receive token = USDT0.

---

### Notes
- Receiving USDT0 needs **no gas** for the recipient — the demo's x402 payments are
  also gasless for the payer (facilitator relays). So the Agentic Wallet doesn't need
  OKB just to be funded and run the demo.
- Bridge only what you're comfortable with; the demo self-pays (payer == payTo), so a
  small amount cycles through many calls. ~$5–10 of USDT0 is plenty.
