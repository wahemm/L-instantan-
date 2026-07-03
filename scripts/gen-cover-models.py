#!/usr/bin/env python3
"""
Génère 3 modèles de couverture neutres/personnalisables (2000×1389px)
compatibles avec le picker de covers existant.

  - modele-blanc.png  : fond crème, typographie sobre
  - modele-sombre.png : fond marine foncé, texte ivoire
  - modele-encadre.png: fond blanc, cadre noir élégant

Sortie : public/covers/
"""

import math, os
from PIL import Image, ImageDraw, ImageFont

# ── Dimensions (même que les covers existants) ────────────────────────────────
W, H = 2000, 1389
CX = W // 2  # 1000 — séparation dos/avant

# ── Polices ───────────────────────────────────────────────────────────────────
def serif(size):
    for p in [
        "/System/Library/Fonts/Supplemental/Georgia.ttf",
        "/System/Library/Fonts/Times.ttc",
        "/System/Library/Fonts/Supplemental/Times New Roman.ttf",
        "/Library/Fonts/Times New Roman.ttf",
    ]:
        try: return ImageFont.truetype(p, size)
        except: pass
    return ImageFont.load_default()

def sans(size):
    for p in [
        "/System/Library/Fonts/Helvetica.ttc",
        "/Library/Fonts/Arial.ttf",
        "/System/Library/Fonts/HelveticaNeue.ttc",
    ]:
        try: return ImageFont.truetype(p, size)
        except: pass
    return ImageFont.load_default()

def tw(d, txt, f):
    b = d.textbbox((0, 0), txt, font=f)
    return b[2]-b[0], b[3]-b[1]

def draw_centered(d, txt, f, cx, cy, fill):
    wt, ht = tw(d, txt, f)
    d.text((cx - wt//2, cy - ht//2), txt, font=f, fill=fill)

def hline(d, cx, y, half_w, fill, width=1):
    d.line([(cx - half_w, y), (cx + half_w, y)], fill=fill, width=width)

out_dir = "/Users/hugothomas/Desktop/linstantane/public/covers"
os.makedirs(out_dir, exist_ok=True)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ── 1. BLANC ─────────────────────────────────────────────────────────────────
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
print("Génération modele-blanc.png …")
img = Image.new("RGB", (W, H), (250, 247, 242))  # crème chaud
d = ImageDraw.Draw(img)

# Séparateur dos (très discret, légèrement plus foncé)
d.rectangle([CX-2, 0, CX+2, H], fill=(220, 215, 208))

# — Couverture avant (droite) ——————————————————————————————————————————————
FX = CX  # x de départ de la couverture avant
fw = CX  # largeur = 1000
fcy = H // 2
fcx = FX + fw // 2   # centre horizontal de la face avant

# Cadre intérieur fin
PAD = 60
d.rectangle([FX+PAD, PAD, W-PAD, H-PAD], outline=(40,35,30), width=1)

# "L'INSTANTANÉ" — marque en petites caps légères en haut
brand_y = PAD + 80
draw_centered(d, "L'INSTANTANÉ", sans(22), fcx, brand_y, (100, 95, 88))

# Trait fin haut
hline(d, fcx, brand_y + 50, 120, (160, 155, 148))

# Titre principal
f_title = serif(100)
draw_centered(d, "TITRE", f_title, fcx, H//2 - 40, (30, 25, 20))

# Sous-ligne
hline(d, fcx, H//2 + 60, 80, (30, 25, 20))

# Sous-titre
draw_centered(d, "Destination  ·  Année", sans(28), fcx, H//2 + 105, (110, 105, 98))

# Bas du cadre
draw_centered(d, "Album photo", sans(20), fcx, H - PAD - 55, (140, 135, 128))

# — Couverture arrière (gauche) ————————————————————————————————————————————
bcx = CX // 2   # centre de la face arrière
# Juste un trait discret et le logo discret
hline(d, bcx, H//2, 60, (160, 155, 148))
draw_centered(d, "L'INSTANTANÉ", sans(20), bcx, H//2 + 35, (140, 135, 128))

img.save(os.path.join(out_dir, "modele-blanc.png"), "PNG")
print("  ✓  modele-blanc.png")

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ── 2. SOMBRE ────────────────────────────────────────────────────────────────
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
print("Génération modele-sombre.png …")
BG   = (15, 18, 35)        # marine très foncé
IVRY = (236, 232, 222)     # ivoire
GOLD = (192, 160, 98)      # or doux
MDIM = (90, 95, 115)       # gris bleuté moyen

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# Léger dégradé sur la face avant (simulation) — quelques rectangles alpha
for i in range(20):
    alpha = int(10 - i * 0.3)
    shade = tuple(max(0, c + alpha) for c in BG)
    d.rectangle([CX + i*2, 0, W, H], fill=shade)

# Séparateur dos
d.rectangle([CX-1, 0, CX+1, H], fill=MDIM)

# — Couverture avant ————————————————————————————————————————————————————————
fcx = CX + CX // 2

# Cadre angle coins (L-shapes)
CS = 40  # taille corner
PAD = 70
corners = [
    (CX+PAD, PAD),          # haut gauche
    (W-PAD, PAD),            # haut droit
    (CX+PAD, H-PAD),        # bas gauche
    (W-PAD, H-PAD),          # bas droit
]
for cx2, cy2 in corners:
    dx = 1 if cx2 < fcx else -1
    dy = 1 if cy2 < H//2 else -1
    d.line([(cx2, cy2), (cx2 + dx*CS, cy2)], fill=GOLD, width=1)
    d.line([(cx2, cy2), (cx2, cy2 + dy*CS)], fill=GOLD, width=1)

# Marque
draw_centered(d, "L'INSTANTANÉ", sans(22), fcx, PAD + 75, MDIM)

# Ligne or fine
hline(d, fcx, PAD + 110, 100, GOLD)

# Titre
f_title = serif(108)
draw_centered(d, "TITRE", f_title, fcx, H//2 - 30, IVRY)

# Ligne or fine
hline(d, fcx, H//2 + 70, 70, GOLD)

# Sous-titre
draw_centered(d, "Destination  ·  Année", sans(28), fcx, H//2 + 115, tuple(int(c*0.7) for c in IVRY))

# Album photo bas
draw_centered(d, "Album photo", sans(20), fcx, H - PAD - 55, MDIM)

# — Couverture arrière ——————————————————————————————————————————————————————
bcx = CX // 2
hline(d, bcx, H//2, 50, GOLD)
draw_centered(d, "L'INSTANTANÉ", sans(20), bcx, H//2 + 35, MDIM)

img.save(os.path.join(out_dir, "modele-sombre.png"), "PNG")
print("  ✓  modele-sombre.png")

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ── 3. ENCADRÉ ───────────────────────────────────────────────────────────────
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
print("Génération modele-encadre.png …")
BG2 = (255, 254, 252)       # blanc pur
DRK = (20, 18, 16)          # quasi-noir
MED = (130, 125, 118)       # gris moyen

img = Image.new("RGB", (W, H), BG2)
d = ImageDraw.Draw(img)

d.rectangle([CX-1, 0, CX+1, H], fill=(210, 205, 198))

# — Couverture avant ————————————————————————————————————————————————————————
fcx = CX + CX // 2

# Double cadre
PAD1, PAD2 = 45, 65
d.rectangle([CX+PAD1, PAD1, W-PAD1, H-PAD1], outline=DRK, width=2)
d.rectangle([CX+PAD2, PAD2, W-PAD2, H-PAD2], outline=(170, 165, 158), width=1)

# Petit ornement central (croix simple)
cx3, cy3 = fcx, H//2
R = 18
d.line([(cx3-R, cy3-250), (cx3+R, cy3-250)], fill=DRK, width=1)  # motif haut
d.line([(cx3, cy3-250-R), (cx3, cy3-250+R)], fill=DRK, width=1)

# Marque
draw_centered(d, "L'INSTANTANÉ", sans(22), fcx, PAD2 + 75, MED)
hline(d, fcx, PAD2 + 110, 90, (190, 185, 178))

# Titre
f_title = serif(100)
draw_centered(d, "TITRE", f_title, fcx, H//2 - 35, DRK)

hline(d, fcx, H//2 + 60, 80, DRK)

draw_centered(d, "DESTINATION  ·  ANNÉE", sans(24), fcx, H//2 + 100, MED)

# Numéro bas (style classique)
draw_centered(d, "Album photo personnalisé", sans(18), fcx, H - PAD2 - 50, MED)

# — Couverture arrière ——————————————————————————————————————————————————————
bcx = CX // 2
d.rectangle([PAD1, PAD1, CX-PAD1, H-PAD1], outline=(190, 185, 178), width=1)
hline(d, bcx, H//2, 50, (190, 185, 178))
draw_centered(d, "L'INSTANTANÉ", sans(20), bcx, H//2 + 35, MED)

img.save(os.path.join(out_dir, "modele-encadre.png"), "PNG")
print("  ✓  modele-encadre.png")

print("\nFait. 3 modèles dans public/covers/")
