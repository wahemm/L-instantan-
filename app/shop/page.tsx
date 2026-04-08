"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/app/components/Nav";

// ── Illustrated cover templates ───────────────────────────────────────────
interface IllustratedCover {
  id: string;
  name: string;
  src: string;
}

const ILLUSTRATED_COVERS: IllustratedCover[] = [
  { id: "espagne",   name: "Espagne",   src: "/covers/Espagne.png" },
  { id: "italie",    name: "Italie",    src: "/covers/Italie.png" },
  { id: "provence",  name: "Provence",  src: "/covers/Provence.png" },
  { id: "miami",     name: "Miami",     src: "/covers/Miami.png" },
  { id: "marrakech", name: "Marrakech", src: "/covers/Marrakech.png" },
  { id: "bali",      name: "Bali",      src: "/covers/bali 1.png" },
  { id: "paris",     name: "Paris",     src: "/covers/paris.png" },
  { id: "perou",     name: "Pérou",     src: "/covers/Perou.png" },
  { id: "mykonos",   name: "Mykonos",   src: "/covers/mykonos.png" },
  { id: "brazil",    name: "Brésil",    src: "/covers/brazil.png" },
  { id: "mexique",   name: "Mexique",   src: "/covers/mexique.png" },
  { id: "canada",    name: "Canada",    src: "/covers/canada.png" },
  { id: "amor",      name: "Amor",      src: "/covers/amor.png" },
  { id: "grece-1",     name: "Grèce",      src: "/covers/Grece1.png" },
  { id: "grece-2",     name: "Grèce 2",    src: "/covers/Grece2.png" },
  { id: "allemagne",   name: "Allemagne",  src: "/covers/Allemagne.png" },
  { id: "berlin",      name: "Berlin",     src: "/covers/Berlin.png" },
  { id: "germany",     name: "Germany",    src: "/covers/germany.png" },
  { id: "argentine-1", name: "Argentine",  src: "/covers/Argentine1.png" },
  { id: "argentine-2", name: "Argentine 2", src: "/covers/Argentine2.png" },
  { id: "belgique",    name: "Belgique",   src: "/covers/Belgique.png" },
];

export default function ShopPage() {
  const [selectedCoverId, setSelectedCoverId] = useState("espagne");
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const cover = ILLUSTRATED_COVERS.find(c => c.id === selectedCoverId)!;

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Nav />

      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">

          {/* ── Left: visual ── */}
          <div className="flex flex-col gap-5">
            <div className="mx-auto w-full max-w-[340px]">
              <div className="relative overflow-hidden rounded-lg shadow-xl" style={{ aspectRatio: "210/297" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cover.src} alt={cover.name} className="h-full w-full object-cover" />
                {/* Book spine effect */}
                <div className="absolute inset-y-0 left-0 w-3" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.35), transparent)" }} />
              </div>
            </div>

            <div>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Couvertures illustrées</p>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                {ILLUSTRATED_COVERS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCoverId(c.id)}
                    title={c.name}
                    className={`overflow-hidden rounded-md transition-all ${
                      selectedCoverId === c.id
                        ? "ring-2 ring-slate-900 ring-offset-2 scale-105"
                        : "hover:ring-1 hover:ring-slate-300 hover:ring-offset-1"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.src} alt={c.name} className="w-full h-auto object-cover" style={{ aspectRatio: "210/297" }} />
                  </button>
                ))}
              </div>
              <p className="mt-3 text-center text-[11px] text-slate-400">
                De nouvelles couvertures chaque mois
              </p>
            </div>
          </div>

          {/* ── Right: product info ── */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">L&apos;Instantané</p>
              <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
                Album Photo Premium
              </h1>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-amber-400 tracking-wide">★★★★★</span>
                <span className="text-xs text-slate-400">4,9 / 5 — avis vérifiés</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Format A4 · Papier photo 170g/m² · Couverture rigide · De 24 à 200 pages
              </p>
            </div>

            {/* Price */}
            <div className="rounded-2xl border border-gray-200 bg-[#f8f7f4] p-6">
              <div className="flex items-baseline gap-2">
                <span className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-slate-900">29 €</span>
                <span className="text-sm text-slate-400">livraison incluse</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">24 pages incluses · 0,50 € par page supplémentaire</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span>Livre imprimé finition premium</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span>Papier brillant 170g/m²</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span>Couverture rigide personnalisée</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span>Livraison offerte en France</li>
              </ul>
            </div>

            {/* Template indicator */}
            <div>
              <p className="mb-2.5 text-sm font-medium text-slate-700">Couverture sélectionnée</p>
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
                <div className="h-11 w-8 shrink-0 overflow-hidden rounded" style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cover.src} alt={cover.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{cover.name}</p>
                  <p className="text-xs text-slate-400">Personnalisable dans l&apos;éditeur</p>
                </div>
                <button
                  onClick={() => document.querySelector<HTMLElement>(".grid-cols-7")?.scrollIntoView({ behavior: "smooth", block: "center" })}
                  className="text-xs font-medium text-slate-500 underline underline-offset-2 hover:text-slate-900 transition"
                >
                  Changer
                </button>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/create"
              className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 py-4 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Créer mon album — 29 € →
            </Link>

            {/* Trust */}
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs text-slate-400">
              <span>🔒 Paiement sécurisé Stripe</span>
              <span>↩️ Satisfait ou remboursé</span>
              <span>📦 Livraison offerte</span>
            </div>

            {/* Accordions */}
            <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100">
              {[
                {
                  key: "format",
                  title: "Format & Qualité",
                  content: "Album au format A4 (21 × 28 cm), papier photo brillant 170g/m², couverture rigide personnalisée. De 24 à 200 pages selon le nombre de photos.",
                },
                {
                  key: "livraison",
                  title: "Livraison & Retours",
                  content: "Livraison en France, Belgique, Suisse, Luxembourg et Monaco sous 5 à 7 jours ouvrés. Livraison offerte. Satisfait ou remboursé sous 14 jours.",
                },
              ].map(item => (
                <div key={item.key}>
                  <button
                    onClick={() => setOpenAccordion(openAccordion === item.key ? null : item.key)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-[#f8f7f4]"
                    aria-expanded={openAccordion === item.key}
                  >
                    <span className="text-sm font-medium text-slate-900">{item.title}</span>
                    <span className={`text-lg text-slate-400 transition-transform duration-200 ${openAccordion === item.key ? "rotate-45" : ""}`}>+</span>
                  </button>
                  {openAccordion === item.key && (
                    <div className="px-5 pb-5 pt-1 text-sm leading-relaxed text-slate-500">{item.content}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#f8f7f4] py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Ils ont testé</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-slate-900">Ce que disent nos clients</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { name:"Camille Dupont", city:"Lyon", date:"Mars 2025", detail:"Album Vacances Grèce, 32 pages", quote:"On a envoyé les photos du week-end et le livre est magnifique. La qualité du papier est bluffante, un souvenir inoubliable à feuilleter en famille." },
              { name:"Yanis Belkacem", city:"Paris", date:"Février 2025", detail:"Album Famille Noël, 48 pages", quote:"En quelques minutes j'avais mon album prêt. La mise en page est top, vraiment premium. Ma femme a pleuré en le feuilletant." },
              { name:"Sarah Martin",   city:"Bordeaux", date:"Janvier 2025", detail:"Album Cadeau Anniversaire, 24 pages", quote:"Offrir le livre imprimé à ma mère pour ses 60 ans, c'était le cadeau parfait. Elle l'a montré à toute la famille." },
            ].map(t => (
              <blockquote key={t.name} className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-3 text-amber-400 text-sm">★★★★★</div>
                <p className="flex-1 text-sm leading-relaxed text-slate-600">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-5 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">{t.name.charAt(0)}</div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900">{t.name}</div>
                    <div className="text-[11px] text-slate-400">{t.city} · {t.date} · {t.detail}</div>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-400 sm:flex-row">
          <span className="font-[family-name:var(--font-playfair)] text-slate-900">L&apos;Instantané</span>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/comment-ca-marche" className="transition hover:text-slate-700">Comment ça marche</Link>
            <Link href="/faq" className="transition hover:text-slate-700">FAQ</Link>
            <Link href="/qui-sommes-nous" className="transition hover:text-slate-700">À propos</Link>
          </div>
          <span>© 2026 L&apos;Instantané</span>
        </div>
      </footer>
    </main>
  );
}
