"""Déplace des éléments sur fond uni, au pixel près, dans une COPIE.
Usage : aligne.py src out 'nom:x0,y0,x1,y1:cibleX:cibleY' ...
cibleX : nombre = centre x ; R3560 = bord droit ; - = inchangé
cibleY : nombre = centre y ; B2300 = bas ; - = inchangé
Repères (3824×2608) : avant centre x 2832, arrière centre x 992, dos x 1912,
centre vertical 1304, logo bas y 2300."""
import sys
from PIL import Image
src,out=sys.argv[1],sys.argv[2]
im=Image.open(src).convert("RGB"); W,H=im.size; px=im.load(); BG=px[5,5]
def exact(x0,y0,x1,y1,thr=40):
    xs=[];ys=[]
    for y in range(max(0,y0),min(H,y1)):
        for x in range(max(0,x0),min(W,x1)):
            p=px[x,y]
            if abs(p[0]-BG[0])+abs(p[1]-BG[1])+abs(p[2]-BG[2])>thr: xs.append(x); ys.append(y)
    return min(xs),min(ys),max(xs)+1,max(ys)+1
P=10; res=im.copy(); jobs=[]
for spec in sys.argv[3:]:
    name,box,tx,ty=spec.split(":"); a,b,c,d=exact(*map(int,box.split(",")))
    dx=0 if tx=="-" else (int(tx[1:])-c if tx[0]=="R" else round(int(tx)-(a+c)/2))
    dy=0 if ty=="-" else (int(ty[1:])-d if ty[0]=="B" else round(int(ty)-(b+d)/2))
    pbox=(a-P,b-P,c+P,d+P); jobs.append((name,im.crop(pbox),pbox,dx,dy,(a,b,c,d)))
for j in jobs: res.paste(BG,j[2])
for name,patch,pbox,dx,dy,(a,b,c,d) in jobs:
    res.paste(patch,(pbox[0]+dx,pbox[1]+dy))
    print(f"{name:9} déplacé dx={dx:+d} dy={dy:+d} → x {a+dx}-{c+dx} (centre {(a+c)/2+dx:.1f}) y {b+dy}-{d+dy} (centre {(b+d)/2+dy:.1f})")
res.save(out)
