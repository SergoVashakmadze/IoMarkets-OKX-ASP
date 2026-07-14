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
CHALLENGE=$(curl -s -D - -o /dev/null "$URL" | grep -i '^payment-required:' | sed 's/^[Pp]ayment-[Rr]equired:[[:space:]]*//' | tr -d '\r')
if [ -z "$CHALLENGE" ]; then echo "No PAYMENT-REQUIRED header — is the route priced / server up?"; exit 1; fi
echo "402 challenge (decoded):"
echo "$CHALLENGE" | base64 -d 2>/dev/null | (python3 -m json.tool 2>/dev/null || cat)
echo

echo "── 2. sign payment from the Agentic Wallet (TEE) ───────────────────────────"
PAY_JSON=$(onchainos payment pay --payload "$CHALLENGE")
echo "$PAY_JSON" | (python3 -c 'import sys,json;d=json.load(sys.stdin)["data"];print("wallet:",d.get("wallet"));print("header:",d.get("header_name"))' 2>/dev/null || echo "$PAY_JSON")
HDR_NAME=$(echo "$PAY_JSON" | python3 -c 'import sys,json;print(json.load(sys.stdin)["data"]["header_name"])')
HDR_VAL=$(echo "$PAY_JSON"  | python3 -c 'import sys,json;print(json.load(sys.stdin)["data"]["authorization_header"])')
echo

echo "── 3. replay with the payment header → settle + get data ───────────────────"
curl -s -D - -H "$HDR_NAME: $HDR_VAL" "$URL" | sed -n '1,40p'
echo
echo "Done. Check the settlement tx on the X Layer explorer: https://www.okx.com/web3/explorer/xlayer"
