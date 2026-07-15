#!/usr/bin/env bash
# Watch OKX.AI ASP listing status for agent #5774 "IoMarkets.ai".
#
#   scripts/watch-listing.sh          # print current status once
#   scripts/watch-listing.sh --watch  # poll every 20 min until it goes LIVE, then exit 0
#
# LIVE = approvalLabel no longer "under review" AND statusLabel no longer "not listed".
# Needs the onchainos CLI on PATH and OKX_* creds (loaded from .env).
set -euo pipefail

cd "$(dirname "$0")/.."
export PATH="$HOME/.local/bin:$(npm config get prefix 2>/dev/null)/bin:$PATH"
if [ -f .env ]; then set -a; . ./.env; set +a; fi

AGENT="5774"

status_line() {
  onchainos agent get-my-agents 2>/dev/null | python3 -c '
import sys, json
try:
    d = json.load(sys.stdin)
except Exception:
    print("ERR|could not parse CLI output"); sys.exit(0)
found = None
for acct in d.get("data", {}).get("list", []):
    for a in acct.get("agentList", []):
        if str(a.get("agentId")) == "'"$AGENT"'":
            found = a
if not found:
    print("ERR|agent '"$AGENT"' not found"); sys.exit(0)
appr = (found.get("approvalLabel") or "").strip()
stat = (found.get("statusLabel") or "").strip()
live = ("under review" not in appr.lower()) and (stat.lower() != "not listed")
print(("LIVE" if live else "PENDING") + "|approval=" + repr(appr) + " status=" + repr(stat))
'
}

check() {
  local out; out="$(status_line)"
  local state="${out%%|*}"; local detail="${out#*|}"
  echo "[$(date -u +%H:%M:%SZ)] $state — $detail"
  [ "$state" = "LIVE" ]
}

if [ "${1:-}" = "--watch" ]; then
  echo "Watching #$AGENT every 20 min until LIVE (Ctrl-C to stop)…"
  while true; do
    if check; then echo "🎉 Listing is LIVE — go record the demo + file the form."; exit 0; fi
    sleep 1200
  done
else
  check || true
fi
