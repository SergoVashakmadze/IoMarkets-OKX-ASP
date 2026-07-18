# Bridge — Arbitrum USDT → X Layer USDT0 (fund the BUYER account)

Goal: move your **USDT on Arbitrum** to **USDT0 on X Layer**, delivered to the
**buyer account (Account 2)** so the demo is a real *buyer pays seller* payment.

> **⚠️ CHANGED Jul 16 — the destination is NOT the ASP wallet.**
> This doc previously said to bridge to `0x015bfbe8…1266` "so the demo can self-pay".
> That was wrong. `0x015bfbe8…1266` is the ASP's own `payTo` in the 402 challenge, and
> the Agentic Wallet signs from the *currently selected account* — so funding it would
> make the wallet pay **itself**. The EIP-3009 settlement may revert on a `from == to`
> transfer, and if it lands, the explorer shows a self-transfer, which reads as wash
> volume (bad for the Revenue Rocket angle). **Account 2 was created to be the buyer.**

## ⚠️ The one thing that must be right: the recipient

| | Address | Role |
|---|---|---|
| MetaMask (source) | *personal wallet — see local notes* | holds the bought USDT + ETH gas |
| **Account 2 — BUYER (destination)** | **`0x0b2a11d49c2cd72791987d0bc2203729733fdba0`** | **bridge here.** Pays for the demo calls |
| Account 1 — ASP (do NOT bridge here) | `0x015bfbe816635b173e924688fba8794e30031266` | the `payTo`; holds the #5774 identity; receives the payments |

The bridge must **send to a custom recipient** = the **buyer** address. Bridging to
the default (your own MetaMask address) leaves funds in the wrong wallet and you'd
need OKB gas to move them again.

**Account IDs** (for `onchainos wallet switch`):
- Account 1 — ASP: `a0ad600d-fba7-407d-a895-90114f25fb85`
- Account 2 — buyer: `f8234c27-f5ad-413b-b935-8f10e0edaa2f`

## Preconditions
- [x] Banxa cool-off cleared → **USDT visible on Arbitrum** in MetaMask (Jul 16)
- [x] **ETH on Arbitrum** for gas (confirmed)
- [ ] Destination copied **char-for-char**: `0x0b2a11d49c2cd72791987d0bc2203729733fdba0`

---

## Steps — OKX Web3 bridge (recommended: guaranteed X Layer + USDT0)

1. Go to **web3.okx.com** → **Bridge** (cross-chain). **Connect Wallet** → MetaMask → approve.
2. **From:** network **Arbitrum**, token **USDT**. Amount: ~**20 USDT** is fine
   (the demo needs ~$5; at $0.002/call that's ~2,500 calls).
3. **To:** network **X Layer**, token **USDT0**.
4. **Recipient / "Send to another address":** enable it and paste
   **`0x0b2a11d49c2cd72791987d0bc2203729733fdba0`** (Account 2, the buyer). ⚠️ Double-check it.
5. Review the quote (route, fee, est. receive, time — usually a few minutes).
6. If prompted, **Approve** USDT spending (first tx, small ETH gas), then **Confirm/Bridge**
   (second tx). Sign both in MetaMask.
7. Wait for "completed". Keep the tx hash.

> If OKX's bridge doesn't expose a custom-recipient field for this route, use the
> **fallback** below — don't bridge to your own address and hope.

## Confirm it landed
```bash
onchainos wallet switch f8234c27-f5ad-413b-b935-8f10e0edaa2f   # buyer
onchainos wallet balance --chain xlayer                        # expect USDT0 > 0
onchainos wallet switch a0ad600d-fba7-407d-a895-90114f25fb85   # back to the ASP identity
```
Or check directly (no CLI, no account switching):
```bash
curl -s -X POST https://rpc.xlayer.tech -H 'Content-Type: application/json' -d '{"jsonrpc":"2.0","id":1,"method":"eth_call","params":[{"to":"0x779ded0c9e1022225f8e0630b35a9b54be713736","data":"0x70a082310000000000000000000000000b2a11d49c2cd72791987d0bc2203729733fdba0"},"latest"]}'
```
Explorer: https://www.okx.com/web3/explorer/xlayer (search the buyer address).

## Then → run the demo

**Switch to the buyer first** — `demo-pay.sh` signs from the selected account, and it
will now hard-stop with `payer == payTo` if you forget.

```bash
onchainos wallet switch f8234c27-f5ad-413b-b935-8f10e0edaa2f   # buyer
onchainos wallet balance --chain xlayer                        # show it's funded (on camera)
./scripts/demo-pay.sh                                          # get_vwap    ($0.002)
./scripts/demo-pay.sh /v1/proof/price                          # signed proof ($0.01)
onchainos wallet switch a0ad600d-fba7-407d-a895-90114f25fb85   # back — #5774 lookups need Account 1
```

The explorer will show `0x0b2a11d4… → 0x015bfbe8…`: a buyer agent paying a seller ASP.
Then verify the proof (`pnpm verify <attestation.json>`) — and consider showing a
forged one getting `PROOF REJECTED`; it's the strongest beat in the demo.

> **Switch back to Account 1 when done.** `#5774` lives on Account 1, so
> `watch-listing.sh` and `onchainos agent *` report nothing while Account 2 is active.

---

## Fallback A — bridge to your MetaMask on X Layer, then send on
Use only if no custom-recipient field:
1. Bridge Arbitrum USDT → X Layer USDT0 to your **own** MetaMask address.
2. Add **X Layer** (chainId 196) to MetaMask if needed; you'll need a little **OKB**
   on X Layer for gas to do step 3 (bridge a tiny bit of ETH→OKB, or use OKX Gas Station).
3. **Send** USDT0 → `0x0b2a11d49c2cd72791987d0bc2203729733fdba0` (the **buyer**).

## Fallback B — alternate bridges
Any bridge supporting **X Layer** as destination **and** a custom recipient works
(Bungee/Jumper etc. if they list X Layer). Same rule: destination = the **buyer**
address, receive token = USDT0.

---

### Notes
- Receiving USDT0 needs **no gas**, and x402 payments are **gasless for the payer**
  (the facilitator relays the EIP-3009 authorization). So the buyer needs USDT0 only —
  no OKB.
- Payments accumulate in Account 1 (the ASP). Both accounts are yours, so nothing is
  lost. Moving USDT0 back to Account 2 would need OKB gas — but at $0.002/call you
  won't need to.
- ~$5–10 of USDT0 is plenty.
