"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface Cover {
  id: string;
  name: string;
  src: string;
}

export default function Coverflow({ covers }: { covers: Cover[] }) {
  const n = covers.length;
  const [active, setActive] = useState(Math.floor(n / 2));
  const [paused, setPaused] = useState(false);
  const [cw, setCw] = useState(160);
  const sceneRef = useRef<HTMLDivElement>(null);

  const go = useCallback((dir: number) => setActive(a => (a + dir + n) % n), [n]);

  // Largeur réelle d'une carte → écartement responsive (mobile/desktop)
  useEffect(() => {
    const measure = () => {
      const el = sceneRef.current?.querySelector<HTMLElement>("[data-cf-card]");
      if (el) setCw(el.offsetWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Défilement auto (sauf survol ou "reduced motion")
  useEffect(() => {
    if (paused) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setActive(a => (a + 1) % n), 2400);
    return () => clearInterval(t);
  }, [paused, n]);

  return (
    <div className="flex flex-col items-center">
      <div
        ref={sceneRef}
        className="cf-scene"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {covers.map((cov, i) => {
          let off = i - active;
          if (off > n / 2) off -= n;
          if (off < -n / 2) off += n;
          const ax = Math.abs(off);
          const x = off * cw * 0.72;
          const z = -ax * cw * 0.8;
          const ry = off * -40;
          const sc = Math.max(0.62, 1 - ax * 0.13);
          const visible = ax <= 2.6;
          const isActive = i === active;
          return (
            <Link
              key={cov.id}
              href="/create"
              data-cf-card
              aria-label={`Créer un album — couverture ${cov.name}`}
              aria-hidden={!visible}
              tabIndex={visible ? 0 : -1}
              className="cf-card"
              style={{
                transform: `translate(-50%,-50%) translateX(${x}px) translateZ(${z}px) rotateY(${ry}deg) scale(${sc})`,
                zIndex: 100 - Math.round(ax),
                opacity: visible ? 1 : 0,
                filter: `brightness(${(1 - ax * 0.16).toFixed(2)})`,
                pointerEvents: visible ? "auto" : "none",
              }}
              onClick={(e) => {
                if (!isActive) {
                  e.preventDefault();
                  setActive(i);
                }
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cov.src} alt={cov.name} loading="lazy" style={{ objectPosition: "right center" }} />
            </Link>
          );
        })}
      </div>

      {/* Contrôles + nom de la couverture active */}
      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Couverture précédente"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition hover:border-slate-500 hover:text-slate-900"
        >
          ←
        </button>
        <span className="min-w-[130px] text-center text-sm font-medium text-slate-700">{covers[active].name}</span>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Couverture suivante"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition hover:border-slate-500 hover:text-slate-900"
        >
          →
        </button>
      </div>
    </div>
  );
}
