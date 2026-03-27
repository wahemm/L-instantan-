"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Panel = {
  image: string; // base64
  narration: string;
};

export default function ResultPage() {
  const [panels, setPanels] = useState<Panel[]>([]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("bd_result");
      if (raw) setPanels(JSON.parse(raw));
    } catch {
      // nothing to show
    }
  }, []);

  if (panels.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FFF9EC] p-8 text-slate-900">
        <p className="text-lg font-semibold">Aucune image à afficher.</p>
        <Link
          href="/"
          className="rounded-full border-[3px] border-black bg-[#FFE55C] px-6 py-2 text-sm font-semibold shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#000] transition-transform"
        >
          Retour à l&apos;accueil
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF9EC] px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-10 text-3xl font-black tracking-tight">
          Ta BD est prête ⚡
        </h1>

        <div className="flex flex-col gap-12">
          {panels.map((panel, idx) => (
            <div key={idx}>
              <img
                src={`data:image/png;base64,${panel.image}`}
                alt={`Case ${idx + 1}`}
                className="w-full rounded-2xl border-[3px] border-black shadow-[4px_4px_0_0_#000]"
              />
              {panel.narration && (
                <p className="mt-4 text-base leading-relaxed text-slate-800">
                  {panel.narration}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-14">
          <Link
            href="/"
            className="inline-flex rounded-full border-[3px] border-black bg-white px-6 py-2.5 text-sm font-semibold shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#000] transition-transform"
          >
            ← Recommencer
          </Link>
        </div>
      </div>
    </main>
  );
}
