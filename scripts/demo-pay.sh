#!/usr/bin/env bash
# ── IoMarkets.ai — OKX.AI A2MCP paid-call demo ────────────────────────────────
# Drives the full x402 flow end-to-end so you can screen-record "an agent paying":
#   1. hit a priced route  -> HTTP 402 + PAYMENT-REQUIRED challenge
#   2. onchainos payment pay -> sign an EIP-3009 authorization from the Agentic
#      Wallet (via TEE); the CLI returns the PAYMENT-SIGNATURE header
#   3. replay the request with that header -> OKX facilitator verifies + settles
#      USDT0 on X Layer -> 200 + data (+ settlement tx on the X Layer explorer)
#
# Requires: the Agentic Wallet logged in (`onchainos wallet login`) AND funded with
# a little USDT0 on X Layer (eip155:196). x402 settlement is gasless for the payer.
#
# Usage:  scripts/demo-pay.sh [path]
#   path defaults to /v1/signal/vwap ($0.002). Use /v1/proof/price ($0.01) for the
#   signed-attestation tier (surfaces the settlement txid inside the proof).
set -euo pipefail

BASE="${DEMO_BASE_URL:-https://okx.iomarkets.ai}"
PATH_="${1:-/v1/signal/vwap}"
URL="$BASE$PATH_"

# Load OKX creds so the onchainos CLI can auth (values never printed).
if [ -f .env ]; then set -a; . ./.env; set +a; fi

echo "── 1. unpaid request → expect HTTP 402 ─────────────────────────────────────"
# `|| true`: grep exits 1 when the header is absent, and under `set -euo pipefail`
# that kills the script here — the friendly message below would never print.
CHALLENGE=$(curl -s -D - -o /dev/null "$URL" | grep -i '^payment-required:' | sed 's/^[Pp]ayment-[Rr]equired:[[:space:]]*//' | tr -d '\r' || true)
if [ -z "$CHALLENGE" ]; then echo "No PAYMENT-REQUIRED header — is the route priced / server up?"; exit 1; fi
echo "402 challenge (decoded):"
echo "$CHALLENGE" | base64 -d 2>/dev/null | (python3 -m json.tool 2>/dev/null || cat)
PAYTO=$(echo "$CHALLENGE" | base64 -d 2>/dev/null | python3 -c 'import sys,json;print(json.load(sys.stdin)["accepts"][0]["payTo"])' 2>/dev/null || true)
echo

echo "── 2. sign payment from the Agentic Wallet (TEE) ───────────────────────────"
PAY_JSON=$(onchainos payment pay --payload "$CHALLENGE")
echo "$PAY_JSON" | (python3 -c 'import sys,json;d=json.load(sys.stdin)["data"];print("wallet:",d.get("wallet"));print("header:",d.get("header_name"))' 2>/dev/null || echo "$PAY_JSON")
HDR_NAME=$(echo "$PAY_JSON" | python3 -c 'import sys,json;print(json.load(sys.stdin)["data"]["header_name"])')
HDR_VAL=$(echo "$PAY_JSON"  | python3 -c 'import sys,json;print(json.load(sys.stdin)["data"]["authorization_header"])')

# The Agentic Wallet signs from the *currently selected* account. Account 1 IS the
# ASP's payTo, so demoing on it makes the wallet pay itself: the settlement may
# revert, and if it lands the explorer shows a self-transfer (reads as wash volume).
PAYER=$(echo "$PAY_JSON" | python3 -c 'import sys,json;print(json.load(sys.stdin)["data"].get("wallet",""))' 2>/dev/null || true)
if [ -n "$PAYER" ] && [ -n "${PAYTO:-}" ] && [ "${PAYER,,}" = "${PAYTO,,}" ]; then
  echo "STOP: payer == payTo ($PAYER) — this wallet would be paying itself."
  echo "      Switch to the buyer account, then re-run:"
  echo "        onchainos wallet switch <buyer-account-id>   # Account 2"
  echo "      Afterwards switch back so #5774 lookups keep working:"
  echo "        onchainos wallet switch <asp-account-id>     # Account 1"
  exit 1
fi
echo

echo "── 3. replay with the payment header → settle + get data ───────────────────"
curl -s -D - -H "$HDR_NAME: $HDR_VAL" "$URL" | sed -n '1,40p'
echo
echo "Done. Check the settlement tx on the X Layer explorer: https://www.okx.com/web3/explorer/xlayer"
