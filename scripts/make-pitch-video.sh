#!/usr/bin/env bash
# Cut pitch-video.mp4 (~90s) = rendered title cards + real demo footage.
#
#   python3 scripts/make-pitch-slides.py     # render the cards first
#   scripts/make-pitch-video.sh              # -> pitch-video.mp4
#
# No voiceover. A founder-narrated version is stronger — script in
# docs/PITCH_SCRIPT.md — but this is submittable as-is and every claim on screen
# is one we can prove. Re-record with narration and swap it whenever.
set -euo pipefail
cd "$(dirname "$0")/.."

SRC="demo-90s.mp4"
OUT="${1:-pitch-video.mp4}"
W=1280; H=720; FPS=25
T="$(mktemp -d)"; trap 'rm -rf "$T"' EXIT

[ -f "$SRC" ] || { echo "missing $SRC — record the demo first"; exit 1; }
[ -d pitch-slides ] || { echo "missing pitch-slides/ — run: python3 scripts/make-pitch-slides.py"; exit 1; }

still() { # file, seconds -> clip
  ffmpeg -y -v error -loop 1 -i "pitch-slides/$1" -t "$2" -r $FPS \
    -vf "scale=$W:$H,format=yuv420p" -c:v libx264 -preset veryfast -crf 20 "$T/$3"
}
clip() { # start, dur -> demo clip
  # The demo is 1600x1000 (aspect 1.6) and the target is 1280x720 (1.78), so scale to
  # FIT (force_original_aspect_ratio=decrease -> 1152x720) then pillarbox. Scaling to
  # width first gives 1280x800, which pad can't shrink to 720 — that's an error, not a crop.
  ffmpeg -y -v error -ss "$1" -i "$SRC" -t "$2" -r $FPS \
    -vf "scale=$W:$H:force_original_aspect_ratio=decrease,pad=$W:$H:(ow-iw)/2:(oh-ih)/2:color=0x0b0d10,format=yuv420p" \
    -c:v libx264 -preset veryfast -crf 20 "$T/$3"
}

echo "cutting…"
still 01-hook.jpg        5   a01.mp4
still 02-problem.jpg     5   a02.mp4
still 03-thesis.jpg      5   a03.mp4
still 04-solution.jpg    5   a04.mp4
still 05-demo-lead.jpg   3   a05.mp4
clip  2  16                  a06.mp4   # 402 challenge -> sign -> 200 + data
still 06-proof-lead.jpg  4   a07.mp4
clip  18 10                  a08.mp4   # proof tier: signed attestation
still 07-forge-lead.jpg  4   a09.mp4
clip  30 14                  a10.mp4   # PROOF ACCEPTED then PROOF REJECTED
still 08-live.jpg        5   a11.mp4
still 09-who.jpg         6   a12.mp4
still 10-close.jpg       5   a13.mp4

for f in a01 a02 a03 a04 a05 a06 a07 a08 a09 a10 a11 a12 a13; do
  echo "file '$T/$f.mp4'" >> "$T/list.txt"
done

ffmpeg -y -v error -f concat -safe 0 -i "$T/list.txt" -c copy "$OUT"
echo "done -> $OUT"
ffprobe -v error -show_entries format=duration,size -of default=nw=1 "$OUT"
