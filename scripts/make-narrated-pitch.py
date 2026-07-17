#!/usr/bin/env python3
"""Build pitch-video-narrated.mp4 — the pitch cut with a synthetic voiceover.

Each segment's video duration is driven by its narration length, so audio and
picture can't drift. Stills hold; demo clips are trimmed/held to fit the line.

    python3 scripts/make-pitch-slides.py          # cards first
    python3 scripts/make-narrated-pitch.py        # -> pitch-video-narrated.mp4

Voice is Piper (en_GB-alan-medium) — a synthetic narrator reading Sergo's own
script. It's clearly TTS. A real recording is better; script in docs/PITCH_SCRIPT.md.
"""
import subprocess, shutil, tempfile, json
from pathlib import Path

PIPER = "/tmp/ttsvenv/bin/piper"
MODEL = "/tmp/voices/en_GB-alan-medium.onnx"
SRC = "demo-90s.mp4"
OUT = "pitch-video-narrated.mp4"
W, H, FPS = 1280, 720, 25
PAD = 0.6           # breathing room after each line
BG = "0x0b0d10"

# (kind, source, narration)
#   kind "still" -> pitch-slides/<source>
#   kind "clip"  -> demo-90s.mp4 starting at <source> seconds
SEGMENTS = [
    ("still", "01-hook.jpg",
     "I'm Sergo Vashakmadze. I spent part of my career at Bloomberg and the World Bank, "
     "building market data for humans. A terminal, a login, a subscription. "
     "None of that works for an agent."),
    ("still", "02-problem.jpg",
     "An agent has no email, no credit card, no A P I key. And when it does get a price, "
     "it has no way to know that price wasn't simply made up."),
    ("still", "03-thesis.jpg",
     "Agents need two things humans never had to. Pay without a human. "
     "And verify without trusting the seller."),
    ("still", "04-solution.jpg",
     "Io Markets is market data built for agents. Two tenths of a cent per call, "
     "in U S D T zero, settled on X Layer. No key. No account. No human."),
    ("clip", 2,
     "The agent hits our endpoint and gets an H T T P 4 0 2 — a payment challenge. "
     "It signs from its own wallet, the OKX facilitator settles it gaslessly, "
     "and the data comes back. That's the whole handshake."),
    ("clip", 18,
     "Every premium call comes back signed. An ed 25519 attestation, "
     "anchored to the on-chain transaction that paid for it."),
    ("still", "07-forge-lead.jpg",
     "You don't have to trust me. Check it yourself."),
    ("clip", 30,
     "Here's a real proof, checked against our published key. Accepted. "
     "And here's one I forged with my own key, claiming Bitcoin is one dollar. Rejected. "
     "That's the product. Verifiable market truth."),
    ("still", "08-live.jpg",
     "It's live today at O K X dot io markets dot A I, registered as A S P 5 7 7 4, "
     "with real payments settling on X Layer right now."),
    ("still", "09-who.jpg",
     "I'm a solo founder. F C A A I Sandbox, Central Bank of Bahrain sandbox, Barclays Rise. "
     "I built market data for institutions. This is the version agents can actually use."),
    ("still", "10-close.jpg",
     "Pay per call. Verify without trusting us."),
]


def run(cmd):
    subprocess.run(cmd, check=True, capture_output=True)


def dur(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=nw=1:nk=1", str(path)],
        capture_output=True, text=True, check=True)
    return float(out.stdout.strip())


def main():
    for p in (PIPER, MODEL, SRC):
        if not Path(p).exists():
            raise SystemExit(f"missing: {p}")

    tmp = Path(tempfile.mkdtemp())
    parts = []

    for i, (kind, src, text) in enumerate(SEGMENTS):
        wav = tmp / f"{i:02d}.wav"
        subprocess.run([PIPER, "--model", MODEL, "--output_file", str(wav)],
                       input=text, text=True, check=True, capture_output=True)
        d = round(dur(wav) + PAD, 3)

        seg = tmp / f"{i:02d}.mp4"
        if kind == "still":
            vf = f"scale={W}:{H},format=yuv420p"
            src_args = ["-loop", "1", "-i", f"pitch-slides/{src}"]
        else:
            vf = (f"scale={W}:{H}:force_original_aspect_ratio=decrease,"
                  f"pad={W}:{H}:(ow-iw)/2:(oh-ih)/2:color={BG},format=yuv420p")
            # -stream_loop so a short tail can't run out of footage mid-sentence
            src_args = ["-stream_loop", "-1", "-ss", str(src), "-i", SRC]

        run(["ffmpeg", "-y", "-v", "error", *src_args,
             "-i", str(wav),
             "-t", str(d), "-r", str(FPS), "-vf", vf,
             "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
             "-c:a", "aac", "-b:a", "128k", "-ar", "44100", "-ac", "2",
             "-shortest", "-map", "0:v:0", "-map", "1:a:0", str(seg)])
        parts.append(seg)
        print(f"  [{i:02d}] {kind:5} {d:5.1f}s  {text[:52]}…")

    lst = tmp / "list.txt"
    lst.write_text("".join(f"file '{p}'\n" for p in parts))
    run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0",
         "-i", str(lst), "-c", "copy", OUT])

    print(f"\ndone -> {OUT}  ({dur(OUT):.1f}s)")
    shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
