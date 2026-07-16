#!/usr/bin/env bash
# The on-camera script. Paced for a ≤90s screen recording — see docs/DEMO_SCRIPT.md.
# Runs REAL paid calls (~$0.022 of USDT0 per run) against production.
#
#   scripts/record-demo.sh     # records this into demo-terminal.mp4
#   scripts/demo-run.sh        # or just watch it live
#
# Requires the BUYER account to be selected (demo-pay.sh hard-stops otherwise).
set -uo pipefail
cd "$(dirname "$0")/.."
export PATH="$HOME/.local/bin:$(npm config get prefix 2>/dev/null)/bin:$PATH"

C_T='\033[1;32m'; C_S='\033[1;36m'; C_D='\033[0;90m'; C_0='\033[0m'
say() { printf "\n${C_S}%s${C_0}\n" "$1"; }
beat() { sleep "${1:-2}"; }

clear
printf "${C_T}%s${C_0}\n" "IoMarkets.ai — agent-native market data on OKX.AI (ASP #5774)"
printf "${C_D}%s${C_0}\n" "pay per call · x402 on X Layer · USDT0 · every price cryptographically signed"
beat 3

say "① A buyer agent asks for data. No API key, no account — it just pays."
beat 2
./scripts/demo-pay.sh
beat 4

say "② Premium tier: the price comes back with an ed25519 signature,"
say "   anchored to the on-chain settlement tx it was paid for."
beat 2
./scripts/demo-pay.sh /v1/proof/price
beat 4

say "③ The trust anchor — our public key, published for anyone to pin."
beat 1
curl -s https://okx.iomarkets.ai/v1/proof/pubkey | python3 -m json.tool | head -6
beat 3

say "④ Verify the proof we just paid for — against the published key, not ours."
beat 1
pnpm verify attestation.json 2>&1 | grep -v '^>' | grep -v '^$'
beat 4

say "⑤ Now forge one. Same format, attacker's key, claims BTC = \$1."
beat 1
pnpm forge forged.json 2>&1 | grep -v '^>' | grep -v '^$'
beat 2
pnpm verify forged.json 2>&1 | grep -v '^>' | grep -v '^$' | grep -v ELIFECYCLE
beat 4

printf "\n${C_T}%s${C_0}\n" "Pay per call. Verify without trusting us."
printf "${C_D}%s${C_0}\n" "okx.iomarkets.ai · ASP #5774 · #OKXAI"
beat 4
