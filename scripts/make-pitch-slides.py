#!/usr/bin/env python3
"""Render the pitch-video title cards (1280x720) into pitch-slides/.

Text-only cards; scripts/make-pitch-video.sh cuts them together with real demo
footage. No voiceover — a founder-narrated version is stronger, but this is
submittable as-is and the claims are the ones we can actually prove.
"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

W, H = 1280, 720
BG = (11, 13, 16)
FG = (238, 240, 243)
DIM = (140, 148, 158)
ACC = (57, 224, 160)   # green — matches the demo terminal
WARN = (255, 122, 122)

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_B = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"

out = Path("pitch-slides")
out.mkdir(exist_ok=True)


def f(path, size):
    return ImageFont.truetype(path, size)


def wrap(draw, text, font, max_w):
    words, lines, cur = text.split(), [], ""
    for w_ in words:
        trial = (cur + " " + w_).strip()
        if draw.textlength(trial, font=font) <= max_w:
            cur = trial
        else:
            lines.append(cur)
            cur = w_
    if cur:
        lines.append(cur)
    return lines


def card(name, lines):
    """lines: list of (text, font, colour, gap_after)"""
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    blocks = []
    for text, font, colour, gap in lines:
        wrapped = wrap(d, text, font, W - 160) if text else [""]
        for i, ln in enumerate(wrapped):
            blocks.append((ln, font, colour, gap if i == len(wrapped) - 1 else 8))
    total = sum(font.size + gap for _, font, _, gap in blocks)
    y = (H - total) // 2
    for text, font, colour, gap in blocks:
        x = (W - d.textlength(text, font=font)) // 2
        d.text((x, y), text, font=font, fill=colour)
        y += font.size + gap
    img.save(out / name, quality=95)
    print("  ", name)


card("01-hook.jpg", [
    ("Bloomberg built market data", f(FONT_B, 62), FG, 14),
    ("for humans.", f(FONT_B, 62), FG, 40),
    ("A terminal. A login. A subscription.", f(FONT, 34), DIM, 34),
    ("None of it works for an agent.", f(FONT_B, 42), ACC, 0),
])

card("02-problem.jpg", [
    ("An agent can't sign up.", f(FONT_B, 56), FG, 18),
    ("No email. No card. No API key.", f(FONT, 34), DIM, 44),
    ("And it can't tell whether", f(FONT_B, 46), FG, 12),
    ("the price was just made up.", f(FONT_B, 46), FG, 0),
])

card("03-thesis.jpg", [
    ("Agents need two things", f(FONT, 38), DIM, 24),
    ("humans never did:", f(FONT, 38), DIM, 46),
    ("Pay without a human.", f(FONT_B, 54), ACC, 14),
    ("Verify without trusting the seller.", f(FONT_B, 54), ACC, 0),
])

card("04-solution.jpg", [
    ("IoMarkets.ai", f(FONT_B, 72), FG, 18),
    ("agent-native market data on OKX.AI", f(FONT, 34), DIM, 46),
    ("$0.002 per call · USDT0 on X Layer · x402", f(MONO, 32), FG, 16),
    ("No API key. No account. No human.", f(FONT, 32), DIM, 0),
])

card("05-demo-lead.jpg", [
    ("Watch an agent pay", f(FONT_B, 58), FG, 16),
    ("and get the data.", f(FONT_B, 58), FG, 40),
    ("402 → sign → settle → 200", f(MONO, 34), ACC, 0),
])

card("06-proof-lead.jpg", [
    ("Every premium call", f(FONT_B, 54), FG, 12),
    ("comes back signed.", f(FONT_B, 54), FG, 40),
    ("An ed25519 attestation, anchored to the", f(FONT, 32), DIM, 8),
    ("on-chain tx that paid for it.", f(FONT, 32), DIM, 0),
])

card("07-forge-lead.jpg", [
    ("Don't trust us. Check it.", f(FONT_B, 56), FG, 40),
    ("A real proof →  ACCEPTED", f(MONO, 36), ACC, 16),
    ("One we forged  →  REJECTED", f(MONO, 36), WARN, 30),
    ("(our own key, claiming BTC = $1)", f(FONT, 28), DIM, 0),
])

card("08-live.jpg", [
    ("Live today", f(FONT_B, 62), FG, 34),
    ("okx.iomarkets.ai", f(MONO, 40), ACC, 14),
    ("ASP #5774 on OKX.AI", f(MONO, 32), FG, 14),
    ("Real payments settling on X Layer", f(FONT, 30), DIM, 0),
])

card("09-who.jpg", [
    ("Solo founder", f(FONT_B, 58), FG, 24),
    ("ex-Bloomberg · ex-World Bank", f(FONT, 36), FG, 14),
    ("FCA AI Sandbox · Barclays Rise", f(FONT, 30), DIM, 40),
    ("I built market data for institutions.", f(FONT, 32), DIM, 8),
    ("This is the version agents can use.", f(FONT_B, 38), ACC, 0),
])

card("10-close.jpg", [
    ("Pay per call.", f(FONT_B, 66), FG, 14),
    ("Verify without trusting us.", f(FONT_B, 66), ACC, 44),
    ("okx.iomarkets.ai  ·  ASP #5774  ·  #OKXAI", f(MONO, 30), DIM, 0),
])

print("done ->", out.resolve())
