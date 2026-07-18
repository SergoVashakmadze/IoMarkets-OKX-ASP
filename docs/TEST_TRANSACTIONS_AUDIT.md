# Test Transactions — Funds Audit

**Compiled:** 2026-07-18
**Scope:** every on-chain test/demo transaction executed for the IoMarkets OKX ASP hackathon build.

> **Provenance caveat.** This document was reconstructed after the fact from the repo, full git
> history, and prior Claude Code session transcripts. It is not a live ledger export. Every figure
> below is traceable to a cited source file or an on-chain tx hash — verify against a block explorer
> before relying on it for anything financial.

---

## 1. Bottom line

- All test payments moved between **two accounts that both belong to the repo owner** (OKX Agentic
  Wallet Account 1 and Account 2). No third-party or Claude-controlled wallet was ever used.
- **Total spent on test calls: 0.042 USDT0.** That amount landed in the owner's own Account 1, so the
  **net loss is ~0**.
- Gas was paid by the OKX facilitator relayer, not from the owner's balance.
- All activity was on **X Layer mainnet** (`eip155:196`). No testnet transactions were ever executed —
  testnet appears in the docs only as advice that was not followed.

---

## 2. Addresses

| Address | Role | Chain | Owner? | Key references |
|---|---|---|---|---|
| `0x0b2a11d49c2cd72791987d0bc2203729733fdba0` | **Payer / buyer agent.** Agentic Wallet Account 2. Signs EIP-3009 authorisations. | X Layer | Yes | `docs/LINKS.md:42`, `docs/FUNDING.md:17`, `docs/BRIDGE.md:19`, `docs/HANDOVER_OKX.md:71` |
| `0x015bfbe816635b173e924688fba8794e30031266` | **Payee / seller.** Agentic Wallet Account 1 = ASP `X402_PAY_TO`; holds ASP identity #5774. | X Layer | Yes | `docs/LINKS.md:43`, `docs/HANDOVER_OKX.md:54,71-72`, `scripts/record-demo.sh:42` |
| `0x779ded0c9e1022225f8e0630b35a9b54be713736` | USDT0 token contract (6 decimals). Not a wallet. | X Layer | n/a | `.env.example:52`, `docs/LINKS.md:41` |
| `0xe8fa08ba6cf8173c32a918489301dbf08083b908` | OKX facilitator relayer EOA — tx `from`, pays gas, relays EIP-3009. Never a token recipient. | X Layer | No (OKX) | session transcript only |
| `0x9AA49932f4D943f3FD168E3E1b069fe288FA4a3a` | ASP #5774 `communicationAddress` (A2A messaging identity, not a payment wallet). | — | Yes | session transcript only |
| `0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9` | Arbitrum USDT contract, used in one `eth_call` balance check during the aborted bridge. | Arbitrum | n/a | session transcript only |
| *(personal wallet, address not reproduced here)* | Owner's own wallet on Arbitrum. Relevant only to the abandoned bridge route; never a party to any x402 settlement. | Arbitrum | Yes | — |
| `0xYOUR_OKX_AGENTIC_WALLET_ADDRESS` | Placeholder only. | — | n/a | `.env.example:41` |

No Solana / base58 addresses exist in the project. The base58-looking strings in `pnpm-lock.yaml` are
npm `sha512-` integrity hashes.

---

## 3. Money flow

```
fiat on-ramp ──▶ OKX exchange ──withdraw──▶ X Layer
                                               │
                                               ▼
                          Account 2 (payer)  0x0b2a11d4…
                                               │
                             5 paid x402 calls │ 0.042 USDT0 total
                                               ▼
                          Account 1 (ASP payee) 0x015bfbe8…  earned 0.042 USDT0

        gas paid separately by OKX facilitator relayer 0xe8fa08ba…
```

### Amounts

Account balances are deliberately omitted from this document. Only per-call pricing and total
spend are recorded, since those are what the audit needs.

| Item | Value | Source |
|---|---|---|
| Price — `get_vwap` | 0.002 USDT0 / call | `docs/ASP_LISTING.md:33`, `src/config.ts` |
| Price — `get_price_proof` | 0.01 USDT0 / call | `docs/ASP_LISTING.md:33`, `src/config.ts` |
| **Total spent, 5 paid calls** | **0.042 USDT0** | `docs/HANDOVER_OKX.md:17,72` |
| Same figure, rounded elsewhere | "~0.05 USDT0" | `docs/SUBMIT_NOW.md:11` |
| Cost per full demo run | ~0.022 USDT0 | `scripts/record-demo.sh:19`, `scripts/demo-run.sh:3` |

---

## 4. Transaction hashes

| Tx hash | Meaning | Source |
|---|---|---|
| `0x10d73229f4067bcb6eb8d2069c04c781fe7d3f799887df2ced804fc25085656b` | Settlement, 0.002 USDT0, payer → ASP. Receipt verified: block 65472724, gasUsed 104530, status SUCCESS. Cited as the example settlement tx in the submission. | `docs/HACKQUEST_FIELDS.md:156`, `docs/SUBMISSION_ANSWERS.md:253` |
| `0x3b39c153b838ecf8a673dac2ab4b43bfdab0ac372fa2c15458b0441934618b27` | Second cited settlement tx (the $0.01 proof-tier call). | `docs/HACKQUEST_FIELDS.md:159`, `docs/SUBMISSION_ANSWERS.md:256` |
| `0x71d7d7052b22a836207ef041314dacace91c5c2f221d23055cce41ed49261186` | `settlement_txid` inside the signed attestation (BTC-USDC @ 63791.9, 2026-07-16T23:50Z). | `attestation.json` (gitignored, working tree only) |
| `0xbf8e341e55041b694f7a789429e3dd1a8ac2c38c9387ab0fffc8ef472af739b8` | Settlement txid of a paid proof call (price 63954.3), seen in server logs. | session transcript |
| `0x4d4322ca3990f7ad69116bad63b04eda0174de8c3421169d0d418fa991c31f21` | Settlement txid in `[proof-ext] enrichSettlementResponse` debug output. | session transcript |
| `0xbfdd0102dcaa788514c3a9d51f0c328c8c4f1653ebac7c924e1c45ac7dbb2f62` | $0.01 call that settled but returned no attestation — the bug fixed in commit `e109852`. | session transcript |
| `0xdeadbeef` | **Fake**, forgery-test fixture. Not a real tx. | `forged.json`, `docs/HANDOVER_OKX.md:107` |

Not transactions (do not mistake for hashes): `0x70a08231…` = ERC-20 `balanceOf` selector
(`docs/BRIDGE.md:61`); `0xddf252ad…` = `Transfer` event topic0.

---

## 5. Why two accounts and not one

x402 settlement is a real ERC-20 transfer authorised by an EIP-3009 signature from the payer. If
payer == payee the transfer is a self-send no-op: it proves nothing on-chain, and the demo is paying
itself — worthless as submission evidence.

This was an actual near-miss. Earlier docs instructed funding `0x015bfbe8…` (the ASP's own `payTo`),
which would have produced exactly that. Fixed in commits `f672fcd` and `d4cc948`; retractions are
explicit at `docs/BRIDGE.md:7-8` and `docs/FUNDING.md:8`. `scripts/record-demo.sh:42` now hard-aborts
if the active payer equals the ASP address.

---

## 6. Secrets — locations only, values never recorded here

- `.env` (gitignored, confirmed absent from all git history) holds populated `PROOF_PRIVATE_KEY`,
  `OKX_API_KEY`, `OKX_SECRET_KEY`, `OKX_PASSPHRASE`.
- No mnemonic exists anywhere in the project.
- The proof **public** key `a95fc434…43cf4` is intentionally published. `forged.json` contains only
  the public half of an attacker keypair.

---

## 7. Open items

Residual-balance figures, the personal Arbitrum wallet, and the sweep checklist are kept out of this
public file. They live in `docs/TEST_TRANSACTIONS_AUDIT.local.md`, which is gitignored and never
pushed.
