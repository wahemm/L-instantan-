"""Galerie des livres fermés (face avant, coupe Gelato) pour des couvertures 3824×2608.
Usage : python3 galerie.py sortie.png 'Nom=chemin.png' ..."""
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont
out=sys.argv[1]; items=[a.split("=",1) for a in sys.argv[2:]]
bw,bh=420,int(420*2288/1664); gap=90; cols=len(items) if len(items)<=5 else 4
rows=(len(items)+cols-1)//cols
W=gap+cols*(bw+gap); H=70+rows*(bh+150)
base=Image.new("RGBA",(W,H),(236,232,226,255))
try: f=ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf",30)
except Exception: f=ImageFont.load_default()
for i,(name,path) in enumerate(items):
    c,r=i%cols,i//cols; x=gap+c*(bw+gap); y=60+r*(bh+150)
    cov=Image.open(path).convert("RGB")
    front=cov.crop((2000,160,3664,2448)).resize((bw,bh),Image.LANCZOS)
    sh=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(sh).rectangle((x+16,y+22,x+bw+16,y+bh+22),fill=(40,30,20,110))
    base=Image.alpha_composite(base,sh.filter(ImageFilter.GaussianBlur(22)))
    base.paste(front,(x,y))
    g=Image.new("RGBA",(bw,bh),(0,0,0,0)); gd=ImageDraw.Draw(g)
    for k in range(10): gd.line((k,0,k,bh),fill=(0,0,0,int(60*(1-k/10))))
    gd.line((int(bw*.045),0,int(bw*.045),bh),fill=(0,0,0,40),width=2)
    for k in range(bw):
        a=int(18*max(0,1-abs(k-bw*.35)/(bw*.35))); gd.line((k,0,k,bh),fill=(255,255,255,a))
    base.alpha_composite(g,(x,y))
    d=ImageDraw.Draw(base); tw=d.textlength(name,font=f); d.text((x+(bw-tw)/2,y+bh+40),name,fill=(70,60,50),font=f)
base.convert("RGB").save(out,quality=92); print("ok",out)
