"""Mesure une couverture 3824×2608 : fond, lignes parasites, éléments (boîtes).
Usage : python3 mesure.py fichier.png"""
import sys, collections
from PIL import Image
f=sys.argv[1]; im=Image.open(f).convert("RGB"); W,H=im.size; px=im.load()
print(f"{f} : {W}×{H}")
bg=collections.Counter(im.resize((200,136)).getdata()).most_common(1)[0][0]
zones=[(1300,100,1800,600),(1300,2000,1800,2500),(50,50,400,400)]
uni=all(len(set(im.crop(z).getdata()))==1 for z in zones)
print("fond",bg,"uni" if uni else "PAS UNI (dégradé/texture : déplacement risqué)")
# lignes parasites près du dos
bad=[]
for x in range(int(W*.4),int(W*.6)):
    ys=range(int(H*.02),int(H*.98),max(1,H//80)); n=0
    for y in ys:
        a=px[x,y];l=px[x-3,y];r=px[x+3,y]
        if sum(abs(l[i]-r[i]) for i in range(3))<=6 and sum(abs(a[i]-l[i]) for i in range(3))>4: n+=1
    if n>=len(ys)*.5: bad.append(x)
print("lignes parasites:", bad or "aucune")
step=4; cols=W//step; rows=H//step
mask=[[sum(abs(px[c*step,r*step][i]-bg[i]) for i in range(3))>60 for c in range(cols)] for r in range(rows)]
seen=[[False]*cols for _ in range(rows)]; comps=[]
for r in range(rows):
    for c in range(cols):
        if mask[r][c] and not seen[r][c]:
            st=[(r,c)]; seen[r][c]=True; x0=x1=c; y0=y1=r; n=0
            while st:
                y,x=st.pop(); n+=1; x0=min(x0,x);x1=max(x1,x);y0=min(y0,y);y1=max(y1,y)
                for dy in range(-6,7):
                    for dx in range(-6,7):
                        yy,xx=y+dy,x+dx
                        if 0<=yy<rows and 0<=xx<cols and mask[yy][xx] and not seen[yy][xx]:
                            seen[yy][xx]=True; st.append((yy,xx))
            comps.append((x0*step,y0*step,(x1+1)*step,(y1+1)*step,n))
for x0,y0,x1,y1,n in sorted(comps,key=lambda c:(c[1],c[0])):
    if n<2: continue
    print(f"  x {x0}-{x1} (centre {(x0+x1)//2}, larg {x1-x0})  y {y0}-{y1} (centre {(y0+y1)//2}, haut {y1-y0})")
