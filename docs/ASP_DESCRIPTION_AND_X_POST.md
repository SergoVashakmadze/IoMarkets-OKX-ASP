# ASP Description + X Post — copy-paste

---

# 1. ASP Description  (292/300 ✅)

```
Agent-native market data with cryptographic receipts. Agents pay per call via x402 in USDT0 on X Layer — no API key, no account. Every premium call returns an ed25519 price attestation anchored to its settlement tx, verifiable against our published key. Forge one and the verifier rejects it.
```

**Shorter (189)** — if a field is tighter:
```
Agent-native market data with cryptographic receipts. Agents pay per call in USDT0 on X Layer via x402 — no API key, no account. Every price is signed and independently verifiable. ASP #5774.
```

**Longer (for a free-text field with no limit):**
```
Agent-native market data with cryptographic receipts. Agents pay per call via x402
($0.002 for a VWAP signal, $0.01 for a signed price proof) in USDT0 on X Layer — no
API key, no account, no invoice, gasless for the payer. Every premium call returns an
ed25519-signed price attestation anchored to the on-chain settlement tx that paid for
it, independently verifiable against our published key. Forge one and the verifier
rejects it. Registered as ASP #5774 on OKX.AI; listing review pending.
```

---

# 2. X Post

**Required:** `#OKXAI` + the demo (≤90s). **Attach `demo-90s.mp4`** (native video
autoplays in-feed — better for Social Buzz) or link https://youtu.be/Yo-TTm6t7Yc.
**Verify the @okx handle before posting** — if unsure, drop the @ and write it
plainly. **Copy the post URL** — the submission form requires it.

## ✅ Recommended — the forgery angle

```
Anyone can claim a price. We sign ours.

Every paid call to IoMarkets.ai on @okx returns an ed25519 attestation anchored to
its x402 settlement tx on X Layer. Forge one and the verifier rejects it — watch it
happen ↓

Pay per call. Verify without trusting us. #OKXAI
```

## Alt — the Bloomberg angle

```
I spent years building market data for humans at Bloomberg. A terminal, a login, a
subscription. None of it works for an agent.

So I built the version agents can use: pay per call in USDT0 on X Layer via x402, and
verify every price against a published key. No API key. No account.

IoMarkets.ai on @okx ↓ #OKXAI
```

## Alt — the plain one

```
Agents don't need API keys — they need to pay and to verify.

IoMarkets.ai on @okx: pay-per-call market data + cryptographic price proofs,
settled in USDT0 on X Layer via x402.

Trust no one. Verify everything. #OKXAI
```

## Thread reply 2

```
Every premium call returns a signed attestation + its on-chain settlement txid.

Check the signature against okx.iomarkets.ai/v1/proof/pubkey, confirm the tx on the
X Layer explorer. The proof needs zero trust in us.

That's the product.
```

## Thread reply 3 — economics

```
Real money, not a testnet. A buyer agent (0x0b2a11d4…) pays the ASP (0x015bfbe8…)
$0.002–$0.01 in USDT0 per call, gaslessly, settled on X Layer. Micro-payments an agent
can actually afford.
```

---

## 🚫 Do not write

- ❌ **"live on OKX.AI"** / "listed" / "approved" — **#5774 is registered, review
  pending.** It's checkable, and a false claim is a worse failure than a pending queue.
- ❌ Users, revenue, traction — there are none.

## ✅ Safe to claim

Live endpoint · real HTTP 402 challenges · x402 v2 `exact` on X Layer `eip155:196` ·
USDT0 settlement, gasless for the payer · ed25519 proof anchored to the settlement tx ·
published key `a95fc434…43cf4` · forgeries rejected · **ASP #5774 registered on OKX.AI**
