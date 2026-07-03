#!/usr/bin/env python3
"""
Génère le template de couverture Lulu :
  471 × 341 mm  →  2782 × 2014 px à 150 DPI

Zones annotées en français :
  Rouge    Fond perdu   3,175 mm (0,125")
  Orange   Zone de sécurité   6,35 mm (0,25") depuis la coupe
  Vert     Zone safe (contenu important)
  Bleu     Dos / tranche (~10 mm pour la lisibilité du template)

Sortie : public/templates/cover-template.png
"""

import math, os
from PIL import Image, ImageDraw, ImageFont

DPI    = 150
W_MM   = 471.0
H_MM   = 341.0

def px(mm: float) -> int:
    return math.ceil(mm / 25.4 * DPI)

W = px(W_MM)   # 2782
H = px(H_MM)   # 2014

# ── Zones ─────────────────────────────────────────────────────────────────────
BLEED  = px(3.175)       # 19 px — fond perdu Lulu (0.125")
SAFETY = px(6.35)        # 38 px — sécurité depuis la coupe (0.25")
M      = BLEED + SAFETY  # 57 px — total depuis le bord extérieur

SPINE_W = px(10)         # 59 px — représentatif (variable selon nb. pages)
SC      = W // 2
SL      = SC - SPINE_W // 2
SR      = SL + SPINE_W

# ── Couleurs ──────────────────────────────────────────────────────────────────
C_BLEED_BG   = (255, 200, 200)
C_SAFETY_BG  = (255, 236, 190)
C_SAFE_BG    = (242, 252, 242)
C_SPINE_BG   = (215, 215, 255)
C_BLEED_LN   = (210,  40,  40)
C_SAFETY_LN  = (195, 100,   0)
C_SAFE_LN    = ( 25, 130,  25)
C_SPINE_LN   = ( 70,  70, 200)
C_GRAY       = (120, 120, 120)
C_DARK       = ( 40,  40,  40)

# ── Police ────────────────────────────────────────────────────────────────────
def fnt(size: int):
    for path in [
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/HelveticaNeue.ttc",
        "/Library/Fonts/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
    ]:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            pass
    return ImageFont.load_default()

def tw(d, txt, f):
    b = d.textbbox((0, 0), txt, font=f)
    return b[2] - b[0], b[3] - b[1]

# ── Image ─────────────────────────────────────────────────────────────────────
img = Image.new("RGB", (W, H), C_BLEED_BG)   # base = fond perdu rouge
d   = ImageDraw.Draw(img)

# Remplissage de l'extérieur vers l'intérieur
d.rectangle([BLEED, BLEED, W-BLEED-1, H-BLEED-1], fill=C_SAFETY_BG)
d.rectangle([M,     M,     W-M-1,     H-M-1    ], fill=C_SAFE_BG)

# Ligne centrale (centre géométrique du spread)
d.line([SC, 0, SC, H-1], fill=(185, 185, 185), width=1)

# Dos
d.rectangle([SL, 0, SR, H-1], fill=C_SPINE_BG)

# ── Lignes de délimitation ────────────────────────────────────────────────────
d.rectangle([0,     0,     W-1,     H-1    ], outline=C_GRAY,       width=3)
d.rectangle([BLEED, BLEED, W-BLEED-1, H-BLEED-1], outline=C_BLEED_LN,  width=3)
d.rectangle([M,     M,     W-M-1,     H-M-1    ], outline=C_SAFETY_LN, width=2)
d.line([SL, 0, SL, H-1], fill=C_SPINE_LN, width=2)
d.line([SR, 0, SR, H-1], fill=C_SPINE_LN, width=2)

# ── Polices ───────────────────────────────────────────────────────────────────
fXL  = fnt(70)
fL   = fnt(38)
fM   = fnt(30)
fS   = fnt(26)
fXS  = fnt(22)

# ── Labels sections ───────────────────────────────────────────────────────────
for cx, lbl in [(SL // 2, "COUVERTURE ARRIÈRE"), (SR + (W - SR) // 2, "COUVERTURE AVANT")]:
    wt, ht = tw(d, lbl, fXL)
    d.text((cx - wt // 2, H // 2 - ht // 2), lbl, font=fXL, fill=(185, 185, 185))

# ── Label "DOS" rotatif ───────────────────────────────────────────────────────
dos_img = Image.new("RGB", (H, SPINE_W), C_SPINE_BG)
dos_d   = ImageDraw.Draw(dos_img)
dos_lbl = "DOS"
dwt, dht = tw(dos_d, dos_lbl, fM)
dos_d.text((H // 2 - dwt // 2, SPINE_W // 2 - dht // 2), dos_lbl, font=fM, fill=C_SPINE_LN)
img.paste(dos_img.rotate(90, expand=True), (SL, 0))

# ── Titre du template ─────────────────────────────────────────────────────────
title = f"TEMPLATE COUVERTURE LULU  —  {W_MM:.0f} x {H_MM:.0f} mm  —  {W} x {H} px @ {DPI} dpi"
wt, _ = tw(d, title, fS)
d.text((W // 2 - wt // 2, 5), title, font=fS, fill=(80, 80, 80))

# ── Annotations zones (coin supérieur gauche) ─────────────────────────────────
anns = [
    (BLEED + 4,  BLEED + 4,  "Fond perdu  —  3,175 mm (plié vers l'intérieur de la couverture)", (195, 30, 30)),
    (M + 4,      M + 4,      "Zone de securite  —  6,35 mm depuis la ligne de coupe (eviter textes & logos)", (165, 85, 0)),
    (M + 4,      M + 34,     "Zone safe  v  (placer ici tous les elements importants)", (20, 115, 20)),
]
for ax, ay, txt, col in anns:
    d.text((ax, ay), txt, font=fXS, fill=col)

# ── Légende (coin inférieur droit dans la zone safe) ─────────────────────────
rows = [
    (C_BLEED_BG,  C_BLEED_LN,  "Fond perdu (3,175 mm) — folds to inside cover"),
    (C_SAFETY_BG, C_SAFETY_LN, "Zone de securite (6,35 mm depuis la coupe)"),
    (C_SAFE_BG,   C_SAFE_LN,   "Zone safe — placer le contenu important ici"),
    (C_SPINE_BG,  C_SPINE_LN,  "Dos / tranche (variable selon le nb. de pages)"),
]
BOX = 40; RH = 40; GAP = 8
max_tw = max(tw(d, r[2], fXS)[0] for r in rows)
leg_w  = BOX + GAP + max_tw
leg_h  = len(rows) * (RH + 4) + 30
lx     = W - M - leg_w - 10
ly     = H - M - leg_h - 10

d.rectangle([lx - 6, ly - 28, lx + leg_w + 6, ly + leg_h + 8],
            fill=(255, 255, 255), outline=(150, 150, 150), width=1)
wt, _ = tw(d, "LEGENDE", fS)
d.text((lx + (leg_w - wt) // 2, ly - 24), "LEGENDE", font=fS, fill=C_DARK)

for i, (fill, outline, label) in enumerate(rows):
    ry = ly + i * (RH + 4)
    d.rectangle([lx, ry, lx + BOX, ry + RH - 4], fill=fill, outline=outline, width=2)
    wt2, ht2 = tw(d, label, fXS)
    d.text((lx + BOX + GAP, ry + (RH - 4 - ht2) // 2), label, font=fXS, fill=C_DARK)

# ── Note bas de page ──────────────────────────────────────────────────────────
note = "Dos variable : ~3 mm pour 8 pages  |  ~5 mm pour 24 pages  |  ~8 mm pour 100 pages  |  Exporter en PDF 300 dpi depuis Canva"
wt, _ = tw(d, note, fXS)
d.text((W // 2 - wt // 2, H - BLEED - 28), note, font=fXS, fill=(110, 55, 55))

# ── Sauvegarde ────────────────────────────────────────────────────────────────
out_path = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "public", "templates", "cover-template.png"
)
os.makedirs(os.path.dirname(out_path), exist_ok=True)
img.save(out_path, "PNG", dpi=(DPI, DPI))
print(f"OK   {out_path}")
print(f"     Canvas  : {W} x {H} px  ({W_MM:.0f} x {H_MM:.0f} mm @ {DPI} dpi)")
print(f"     Bleed   : {BLEED} px ({3.175:.3f} mm)")
print(f"     Safety  : {SAFETY} px ({6.35:.3f} mm)")
print(f"     Margin  : {M} px ({3.175+6.35:.3f} mm) total bord → zone safe")
print(f"     Spine   : {SPINE_W} px ({10.0:.1f} mm) — exemple visuel, variable en réalité")
