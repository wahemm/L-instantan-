"""Maquette du livre imprimé à partir d'une couverture 3824×2608.
Usage : python3 maquette.py couverture.png sortie.png"""
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont
src, out = sys.argv[1], sys.argv[2]
cov = Image.open(src).convert("RGB")
# Zones visibles (gabarit Gelato, 8 px/mm, album 32–40 pages)
front = cov.crop((2000, 160, 3664, 2448))          # 208×286 mm
back  = cov.crop((160, 160, 1824, 2448))
flat  = cov.crop((160, 160, 3664, 2448))           # arrière + charnières + dos + avant
S = 0.42
W, H = 2600, 1900
bg = Image.new("RGB", (W, H), (236, 232, 226))
def shadow(img_size, pos, blur=40, off=(28, 34), alpha=110):
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(sh)
    x, y = pos; w, h = img_size
    d.rectangle((x + off[0], y + off[1], x + w + off[0], y + h + off[1]), fill=(40, 30, 20, alpha))
    return sh.filter(ImageFilter.GaussianBlur(blur))
# 1) livre fermé (avant) avec tranche et ombre
fw, fh = int(front.width * S * 1.25), int(front.height * S * 1.25)
fimg = front.resize((fw, fh), Image.LANCZOS)
fx, fy = 120, 140
bg.paste(Image.new("RGB", (1, 1)), (0, 0))
base = bg.convert("RGBA")
base = Image.alpha_composite(base, shadow((fw, fh), (fx, fy)))
base.paste(fimg, (fx, fy))
# charnière (rainure près du dos)
groove = Image.new("RGBA", (fw, fh), (0, 0, 0, 0))
gd = ImageDraw.Draw(groove)
for i in range(18):
    a = int(70 * (1 - i / 18))
    gd.line((i, 0, i, fh), fill=(0, 0, 0, a))
gd.line((int(fw * 0.045), 0, int(fw * 0.045), fh), fill=(0, 0, 0, 45), width=3)
base = Image.alpha_composite(base, Image.new("RGBA", base.size, (0, 0, 0, 0)))
base.alpha_composite(groove, (fx, fy))
# léger reflet mat
gl = Image.new("RGBA", (fw, fh), (255, 255, 255, 0))
gld = ImageDraw.Draw(gl)
for i in range(fw):
    a = int(22 * max(0, 1 - abs(i - fw * 0.35) / (fw * 0.35)))
    gld.line((i, 0, i, fh), fill=(255, 255, 255, a))
base.alpha_composite(gl, (fx, fy))
# 2) couverture dépliée à plat
S2 = 0.36
lw, lh = int(flat.width * S2), int(flat.height * S2)
limg = flat.resize((lw, lh), Image.LANCZOS)
lx, ly = fx + fw + 140, fy + 120
base = Image.alpha_composite(base, shadow((lw, lh), (lx, ly), blur=30, off=(16, 20), alpha=80))
base.paste(limg, (lx, ly))
d = ImageDraw.Draw(base)
def X(px): return lx + int((px - 160) * S2)
ov = Image.new("RGBA", base.size, (0, 0, 0, 0)); od = ImageDraw.Draw(ov)
for px in (1824, 2000):   # rainures des charnières (pli du carton), discrètes
    for y in range(ly, ly + lh, 14):
        od.line((X(px), y, X(px), min(y + 7, ly + lh)), fill=(0, 0, 0, 38), width=2)
base = Image.alpha_composite(base, ov); d = ImageDraw.Draw(base)
try:
    f1 = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 34)
    f2 = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 26)
except Exception:
    f1 = f2 = ImageFont.load_default()
d.text((fx, fy + fh + 50), "Le livre fermé — couverture avant (21 × 28 cm)", fill=(70, 60, 50), font=f1)
d.text((lx, ly - 52), "Extérieur à plat : arrière · dos · avant (tel qu'imprimé, coupé)", fill=(70, 60, 50), font=f1)
d.text((X(160) + 10, ly + lh + 16), "4e de couverture", fill=(110, 100, 90), font=f2)
d.text((X(1880) - 18, ly + lh + 16), "dos", fill=(110, 100, 90), font=f2)
d.text((X(2000) + 10, ly + lh + 16), "couverture avant", fill=(110, 100, 90), font=f2)
base.convert("RGB").crop((0, 0, W, fy + fh + 130)).save(out, quality=92)
print("ok", out)
