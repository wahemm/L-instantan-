"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/app/components/Nav";

type PackId = "digital" | "physique" | "duo";

const PACKS: {
  id: PackId;
  name: string;
  price: string;
  desc: string;
  perks: string[];
  badge?: string;
}[] = [
  {
    id: "digital",
    name: "Digital",
    price: "10 €",
    desc: "Album photo HD en PDF, prêt à partager ou conserver.",
    perks: [
      "Album haute résolution",
      "PDF prêt à partager",
      "Téléchargement immédiat",
    ],
  },
  {
    id: "physique",
    name: "Physique",
    price: "35 €",
    desc: "Ton album imprimé sur papier premium, livré chez toi.",
    perks: [
      "Livre imprimé finition premium",
      "Papier photo 170g/m²",
      "Livraison en France sous 5–7 jours",
      "Couverture rigide personnalisée",
    ],
    badge: "Plus demandé",
  },
  {
    id: "duo",
    name: "Duo",
    price: "40 €",
    desc: "Le meilleur des deux : version digitale + livre imprimé.",
    perks: [
      "Pack Digital inclus",
      "Livre imprimé inclus",
      "Téléchargement immédiat",
      "Livraison en France",
    ],
    badge: "Meilleure valeur",
  },
];

export default function ShopPage() {
  const [selectedPack, setSelectedPack] = useState<PackId>("physique");
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pack = PACKS.find((p) => p.id === selectedPack)!;

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack: selectedPack }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Nav />

      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — Mockup */}
          <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-2xl bg-[#f8f7f4] p-10">
              <div className="space-y-4">
                {PACKS.map((p) => (
                  <div
                    key={p.id}
                    className={`rounded-xl border p-4 transition cursor-pointer ${
                      selectedPack === p.id
                        ? "border-slate-900 bg-white shadow-md"
                        : "border-gray-200 bg-white/60"
                    }`}
                    onClick={() => setSelectedPack(p.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900 text-2xl text-white">
                        {p.id === "digital" ? "📄" : p.id === "physique" ? "📚" : "✨"}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Pack {p.name}</p>
                        <p className="text-xs text-slate-400">
                          {p.id === "digital"
                            ? "PDF haute résolution"
                            : p.id === "physique"
                            ? "Livre imprimé, livraison France"
                            : "Digital + Livre imprimé"}
                        </p>
                      </div>
                      <span className="ml-auto font-[family-name:var(--font-playfair)] font-bold text-slate-900">
                        {p.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 px-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span>🔒</span> Paiement sécurisé Stripe
              </span>
              <span className="flex items-center gap-1.5">
                <span>↩️</span> Satisfait ou remboursé
              </span>
              <span className="flex items-center gap-1.5">
                <span>📦</span> Livraison offerte
              </span>
            </div>
          </div>

          {/* Right — Product info */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                L&apos;Instantané
              </p>
              <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
                Album photo premium
              </h1>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex text-amber-400">
                  {"★★★★★".split("").map((s, i) => (
                    <span key={i}>{s}</span>
                  ))}
                </div>
                <span className="text-xs text-slate-400">4,9 / 5 — avis vérifiés</span>
              </div>
            </div>

            <div className="flex items-end gap-3">
              <span className="font-[family-name:var(--font-playfair)] text-4xl text-slate-900">
                {pack.price}
              </span>
              <span className="mb-1 text-sm text-slate-400">paiement unique</span>
            </div>

            <p className="text-sm leading-relaxed text-slate-500">{pack.desc}</p>

            <div>
              <p className="mb-3 text-sm font-medium text-slate-700">Choisir un pack</p>
              <div className="flex flex-wrap gap-2">
                {PACKS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPack(p.id)}
                    className={`relative rounded-full border px-4 py-2 text-sm font-medium transition ${
                      selectedPack === p.id
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-gray-200 bg-white text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    {p.name} — {p.price}
                    {p.badge && selectedPack !== p.id && (
                      <span className="absolute -right-1 -top-2 rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        ★
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <ul className="flex flex-col gap-2">
              {pack.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="mt-0.5 shrink-0 text-slate-300">✓</span>
                  {perk}
                </li>
              ))}
            </ul>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 py-4 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
            >
              {loading ? "Redirection vers le paiement…" : `Commander — ${pack.price} →`}
            </button>

            <p className="text-center text-xs text-slate-400">
              Paiement sécurisé via Stripe. Satisfait ou remboursé sous 14 jours.
            </p>

            <div className="mt-2 divide-y divide-gray-100 rounded-2xl border border-gray-100">
              {[
                {
                  key: "format",
                  title: "Format & Qualité",
                  content:
                    "Album au format A4 (21 × 28 cm), papier photo brillant 170g/m², couverture rigide personnalisée. De 24 à 200 pages selon le nombre de photos.",
                },
                {
                  key: "livraison",
                  title: "Livraison & Retours",
                  content:
                    "Livraison en France métropolitaine sous 5 à 7 jours ouvrés. Livraison offerte. Satisfait ou remboursé sous 14 jours.",
                },
              ].map((item) => (
                <div key={item.key}>
                  <button
                    onClick={() =>
                      setOpenAccordion(openAccordion === item.key ? null : item.key)
                    }
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-[#f8f7f4]"
                    aria-expanded={openAccordion === item.key}
                  >
                    <span className="text-sm font-medium text-slate-900">{item.title}</span>
                    <span
                      className={`text-lg text-slate-400 transition-transform duration-200 ${
                        openAccordion === item.key ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                  {openAccordion === item.key && (
                    <div className="px-5 pb-5 pt-1 text-sm leading-relaxed text-slate-500">
                      {item.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-400 sm:flex-row">
          <span className="font-[family-name:var(--font-playfair)] text-slate-900">
            L&apos;Instantané
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/comment-ca-marche" className="transition hover:text-slate-700">
              Comment ça marche
            </Link>
            <Link href="/faq" className="transition hover:text-slate-700">
              FAQ
            </Link>
            <Link href="/qui-sommes-nous" className="transition hover:text-slate-700">
              À propos
            </Link>
          </div>
          <span>© 2026 L&apos;Instantané</span>
        </div>
      </footer>
    </main>
  );
}
