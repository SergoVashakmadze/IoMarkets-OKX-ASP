#!/usr/bin/env bash
# Records scripts/demo-run.sh into demo-terminal.mp4 (shots 2-4 + 6 of DEMO_SCRIPT.md).
#
# ── WHY THIS USES A HEADLESS DISPLAY ─────────────────────────────────────────────
# An earlier version grabbed a REGION of the live display (:0) after placing a
# terminal there with wmctrl. The placement silently failed and ffmpeg recorded
# whatever was at those coordinates instead — in practice, an open Gmail window.
# x11grab captures SCREEN COORDINATES, not a window: anything sitting at that
# rectangle (browser, notification, popup) lands in the video.
#
# So this script refuses to touch the real display. It starts its own Xvfb server,
# runs the demo inside it, and records that. Your desktop is not merely avoided —
# it is unreachable from the X server being recorded.
#
# Needs: Xvfb + xterm (sudo apt install xvfb xterm), ffmpeg.
#
#   scripts/record-demo.sh [output.mp4]
#
# Runs REAL paid calls (~$0.022 USDT0 per run) and needs the BUYER account selected.
set -euo pipefail
cd "$(dirname "$0")/.."
export PATH="$HOME/.local/bin:$(npm config get prefix 2>/dev/null)/bin:$PATH"
PROJECT="$PWD"

OUT="${1:-demo-terminal.mp4}"
DISP="${DEMO_DISPLAY:-:99}"
DUR="${DEMO_RECORD_SECONDS:-115}"
W=1600; H=1000

for c in Xvfb xterm ffmpeg; do
  command -v "$c" >/dev/null || { echo "missing: $c   (sudo apt install xvfb xterm ffmpeg)"; exit 1; }
done

# Fail before spending money rather than filming an error.
if [ -f .env ]; then set -a; . ./.env; set +a; fi
PAYER=$(onchainos wallet addresses 2>/dev/null | python3 -c '
import sys,json
try: d=json.load(sys.stdin)["data"]
except Exception: sys.exit(0)
for a in d.get("xlayer",[]): print(a["address"]); break
' || true)
if [ "${PAYER,,}" = "0x015bfbe816635b173e924688fba8794e30031266" ]; then
  echo "STOP: the ASP account is selected — this would film the wallet paying itself."
  echo "      onchainos wallet switch f8234c27-f5ad-413b-b935-8f10e0edaa2f   # buyer"
  exit 1
fi
echo "payer: ${PAYER:-unknown}"

cleanup() {
  [ -n "${XVFB_PID:-}" ] && kill "$XVFB_PID" 2>/dev/null || true
}
trap cleanup EXIT

echo "starting isolated display $DISP (your desktop is not involved)…"
# 2>/dev/null: Xvfb logs harmless amdgpu probe failures on this box.
Xvfb "$DISP" -screen 0 "${W}x${H}x24" -nolisten tcp 2>/dev/null &
XVFB_PID=$!
# Wait for the display to actually accept connections — it can take several
# seconds while Xvfb probes the GPU, and a fixed sleep races it.
for i in $(seq 1 20); do
  DISPLAY="$DISP" xdpyinfo >/dev/null 2>&1 && break
  kill -0 "$XVFB_PID" 2>/dev/null || { echo "Xvfb died on startup"; exit 1; }
  sleep 0.5
done
DISPLAY="$DISP" xdpyinfo >/dev/null 2>&1 || { echo "Xvfb never came up on $DISP"; exit 1; }
echo "display $DISP ready"

DISPLAY="$DISP" xterm -geometry 200x50+0+0 -fa "Monospace" -fs 11 \
  -bg black -fg white -e bash -c "cd '$PROJECT' && ./scripts/demo-run.sh; sleep 2" &
sleep 2

echo "recording ${W}x${H} on $DISP for up to ${DUR}s → $OUT"
ffmpeg -y -loglevel error -f x11grab -framerate 25 -video_size "${W}x${H}" \
  -i "$DISP" -t "$DUR" \
  -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p "$OUT" || true

echo
echo "done → $OUT"
ffprobe -v error -show_entries format=duration,size -of default=nw=1 "$OUT" 2>/dev/null || true
echo "Trim to ≤90s before posting. Storyboard: docs/DEMO_SCRIPT.md"
