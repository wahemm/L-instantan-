"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import { COVER_TEMPLATES, CoverTemplate } from "@/app/lib/templates";

type PackId = "digital" | "physique" | "duo";

const PACKS: { id: PackId; name: string; price: string; desc: string; badge?: string }[] = [
  { id: "digital",  name: "Digital",  price: "10 €", desc: "PDF HD"          },
  { id: "physique", name: "Physique", price: "29 €", desc: "Livre imprimé", badge: "Populaire"       },
  { id: "duo",      name: "Duo",      price: "35 €", desc: "Digital + Livre", badge: "Meilleure valeur" },
];

// ── Book cover preview ────────────────────────────────────────────────────
function BookCover({ tpl, title = "MON ALBUM", large = false }: { tpl: CoverTemplate; title?: string; large?: boolean }) {
  const isElegant = tpl.style === "elegant";
  const isBold    = tpl.style === "bold";

  return (
    <div
      className="relative overflow-hidden rounded-lg shadow-lg"
      style={{ backgroundColor: tpl.bgColor, aspectRatio: "210/297", width: "100%" }}
    >
      {/* Spine shadow */}
      <div className="absolute inset-y-0 left-0 w-2 opacity-20" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.4), transparent)" }} />

      {/* Decorative lines */}
      <div className="absolute inset-x-5 top-5 h-px opacity-30" style={{ backgroundColor: tpl.accentColor }} />
      <div className="absolute inset-x-5 bottom-5 h-px opacity-30" style={{ backgroundColor: tpl.accentColor }} />

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
        {large && (
          <p
            className="font-semibold uppercase tracking-[0.25em]"
            style={{ color: tpl.textColor, opacity: 0.4, fontSize: "clamp(7px, 1vw, 10px)" }}
          >
            L&apos;Instantané
          </p>
        )}
        <h2
          className={isBold ? "font-black uppercase tracking-tight leading-none" : "font-[family-name:var(--font-playfair)] italic leading-tight"}
          style={{
            color: tpl.textColor,
            fontSize: large ? "clamp(18px, 4vw, 36px)" : "clamp(7px, 1.8vw, 13px)",
          }}
        >
          {title}
        </h2>
        {isElegant && large && (
          <div className="mt-1 h-px w-10" style={{ backgroundColor: tpl.accentColor, opacity: 0.6 }} />
        )}
      </div>

      {/* Bottom label for large preview */}
      {large && (
        <div className="absolute bottom-6 inset-x-0 text-center">
          <p className="font-semibold uppercase tracking-[0.22em]" style={{ color: tpl.textColor, opacity: 0.35, fontSize: "clamp(6px, 0.8vw, 9px)" }}>
            {tpl.name}
          </p>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  const router = useRouter();
  const [selectedPack, setSelectedPack] = useState<PackId>("physique");
  const [selectedTemplateId, setSelectedTemplateId] = useState("noir");
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const tpl = COVER_TEMPLATES.find(t => t.id === selectedTemplateId)!;
  const pack = PACKS.find(p => p.id === selectedPack)!;

  function handleCreate() {
    sessionStorage.setItem("linstantane:template", selectedTemplateId);
    sessionStorage.setItem("linstantane:pack", selectedPack);
    router.push("/create?mode=manual");
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Nav />

      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">

          {/* ── Left: visual ── */}
          <div className="flex flex-col gap-5">
            {/* Large preview */}
            <div className="mx-auto w-full max-w-[320px]">
              <BookCover tpl={tpl} title="MON ALBUM" large />
            </div>

            {/* Template thumbnails */}
            <div>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Couvertures disponibles</p>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                {COVER_TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplateId(t.id)}
                    title={t.name}
                    className={`overflow-hidden rounded-md transition-all ${
                      selectedTemplateId === t.id
                        ? "ring-2 ring-slate-900 ring-offset-2 scale-105"
                        : "hover:ring-1 hover:ring-slate-300 hover:ring-offset-1"
                    }`}
                  >
                    <BookCover tpl={t} title="M" />
                  </button>
                ))}
              </div>
              <p className="mt-3 text-center text-[11px] text-slate-400">
                D&apos;autres couvertures bientôt disponibles
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

            {/* Pack selector */}
            <div>
              <p className="mb-3 text-sm font-medium text-slate-700">Choisir un pack</p>
              <div className="grid grid-cols-3 gap-2">
                {PACKS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPack(p.id)}
                    className={`relative flex flex-col items-center gap-1.5 rounded-xl border py-5 text-center transition ${
                      selectedPack === p.id
                        ? "border-slate-900 bg-slate-900 text-white shadow-md"
                        : "border-gray-200 bg-white text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    {p.badge && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                        {p.badge}
                      </span>
                    )}
                    <span className="text-sm font-semibold">{p.name}</span>
                    <span className={`text-[11px] ${selectedPack === p.id ? "text-slate-300" : "text-slate-400"}`}>
                      {p.desc}
                    </span>
                    <span className={`font-[family-name:var(--font-playfair)] text-xl font-bold ${selectedPack === p.id ? "text-white" : "text-slate-900"}`}>
                      {p.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Template indicator */}
            <div>
              <p className="mb-2.5 text-sm font-medium text-slate-700">Couverture sélectionnée</p>
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
                <div
                  className="h-11 w-8 shrink-0 overflow-hidden rounded"
                  style={{ backgroundColor: tpl.bgColor, border: "1px solid rgba(0,0,0,0.07)" }}
                >
                  <BookCover tpl={tpl} title="M" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{tpl.name}</p>
                  <p className="text-xs text-slate-400">Personnalisable dans l&apos;éditeur</p>
                </div>
                <button
                  onClick={() => document.querySelector<HTMLElement>(".grid-cols-8")?.scrollIntoView({ behavior: "smooth", block: "center" })}
                  className="text-xs font-medium text-slate-500 underline underline-offset-2 hover:text-slate-900 transition"
                >
                  Changer
                </button>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleCreate}
              className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 py-4 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Créer mon album — {pack.price} →
            </button>

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
                  content: "Livraison en France métropolitaine sous 5 à 7 jours ouvrés. Livraison offerte. Satisfait ou remboursé sous 14 jours.",
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
              { name:"Camille", role:"Pack Physique", quote:"On a envoyé les photos du week-end et le livre est magnifique. Un souvenir inoubliable à feuilleter." },
              { name:"Yanis",   role:"Pack Digital",  quote:"En quelques minutes j'avais mon album prêt. La mise en page est top, vraiment premium." },
              { name:"Sarah",   role:"Pack Duo",      quote:"Offrir le livre imprimé à ma mère pour son anniversaire, c'était le cadeau parfait. Elle a adoré." },
            ].map(t => (
              <blockquote key={t.name} className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-3 text-amber-400 text-sm">★★★★★</div>
                <p className="flex-1 text-sm leading-relaxed text-slate-600">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-5 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">{t.name.charAt(0)}</div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900">{t.name}</div>
                    <div className="text-[11px] text-slate-400">{t.role}</div>
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
