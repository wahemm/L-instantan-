"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Doubles pages d'exemple, montées avec les VRAIES mises en page de l'éditeur
// (/create : photos bord à bord, filet de 2 px, légende seulement en
// « Photo + texte »). Photos : public/inside (issues des démos de couvertures).
type Spread = { id: string; name: string; accent: string; left: React.ReactNode; right: React.ReactNode };

function P({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`relative h-full min-h-0 overflow-hidden ${className}`}>
      <Image src={src} alt={alt} fill sizes="(max-width: 640px) 45vw, 340px" className="object-cover" />
    </div>
  );
}

// Équivalents des layouts de l'éditeur (gap-0.5 sur fond blanc)
const full = (src: string, alt: string) => <P src={src} alt={alt} />;
const twoH = (a: [string, string], b: [string, string]) => (
  <div className="grid h-full grid-rows-2 gap-0.5 bg-white"><P src={a[0]} alt={a[1]} /><P src={b[0]} alt={b[1]} /></div>
);
const threeLeft = (a: [string, string], b: [string, string], c: [string, string]) => (
  <div className="grid h-full grid-cols-2 grid-rows-2 gap-0.5 bg-white"><P src={a[0]} alt={a[1]} className="row-span-2" /><P src={b[0]} alt={b[1]} /><P src={c[0]} alt={c[1]} /></div>
);
const photoText = (src: string, alt: string, caption: string) => (
  <div className="flex h-full flex-col bg-white">
    <div className="min-h-0 flex-1"><P src={src} alt={alt} /></div>
    <p className="shrink-0 px-4 py-[4%] text-center font-[family-name:var(--font-playfair)] text-[clamp(10px,1.6vw,15px)] italic text-slate-600">{caption}</p>
  </div>
);

const SPREADS: Spread[] = [
  {
    id: "marrakech", name: "Marrakech", accent: "#B4622D",
    left: full("/inside/marrakech-d.jpg", "Dunes du désert marocain"),
    right: twoH(["/inside/marrakech-a.jpg", "Dromadaires au coucher du soleil"], ["/inside/marrakech-b.jpg", "Cour d'une médersa"]),
  },
  {
    id: "italie", name: "Italie", accent: "#2F7D3A",
    left: threeLeft(["/inside/italie-a.jpg", "Fontaine de Trevi, Rome"], ["/inside/italie-c.jpg", "Coupole baroque"], ["/inside/italie-d.jpg", "Canal à Venise"]),
    right: photoText("/inside/italie-b.jpg", "Le Grand Canal à Venise", "Dolce vita, de Rome à Venise"),
  },
  {
    id: "miami", name: "Miami", accent: "#E0512E",
    left: twoH(["/inside/miami-c.jpg", "Palmiers et parasols"], ["/inside/miami-a.jpg", "Cadillac décapotable"]),
    right: full("/inside/miami-d.jpg", "Hamac entre les palmiers"),
  },
  {
    id: "provence", name: "Provence", accent: "#4B2BD6",
    left: full("/inside/provence-c.jpg", "Champ de lavande"),
    right: threeLeft(["/inside/provence-a.jpg", "Ruelle de village provençal"], ["/inside/provence-b.jpg", "Lavande séchée"], ["/inside/provence-d.jpg", "Fromage et baguette"]),
  },
];

export default function InsideSpreads() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx(i => (i + 1) % SPREADS.length), 4500);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {/* Album ouvert : 2 pages 21×28 côte à côte */}
      <div className="relative mx-auto w-full max-w-3xl" style={{ perspective: "1800px" }}>
        <div className="relative mx-auto aspect-[42/28] w-full [transform:rotateX(8deg)]">
          {SPREADS.map((s, i) => (
            <div
              key={s.id}
              aria-hidden={i !== idx}
              className={`absolute inset-0 grid grid-cols-2 transition-opacity duration-700 ${i === idx ? "opacity-100" : "pointer-events-none opacity-0"}`}
            >
              <div className="relative overflow-hidden rounded-l-[6px] bg-[#fbf8f3] shadow-[0_30px_60px_-20px_rgba(60,20,10,0.45)]">
                {s.left}
                {/* ombre de la reliure */}
                <div className="pointer-events-none absolute inset-y-0 right-0 w-[14%] bg-gradient-to-l from-black/20 to-transparent" />
              </div>
              <div className="relative overflow-hidden rounded-r-[6px] bg-[#fbf8f3] shadow-[0_30px_60px_-20px_rgba(60,20,10,0.45)]">
                {s.right}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-[14%] bg-gradient-to-r from-black/25 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Destinations */}
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {SPREADS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => { setIdx(i); setPaused(true); }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${i === idx ? "text-white shadow-md" : "bg-white/70 text-slate-600 hover:bg-white"}`}
            style={i === idx ? { background: s.accent } : undefined}
          >
            {s.name}
          </button>
        ))}
      </div>
    </div>
  );
}
