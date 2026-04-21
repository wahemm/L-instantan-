import Image from "next/image";
import Link from "next/link";
import Nav from "@/app/components/Nav";

const COVER_PREVIEWS = [
  { id: "espagne",   name: "Espagne",   src: "/covers/Espagne.png" },
  { id: "italie",    name: "Italie",    src: "/covers/Italie.png" },
  { id: "provence",  name: "Provence",  src: "/covers/Provence.png" },
  { id: "miami",     name: "Miami",     src: "/covers/Miami.png" },
  { id: "marrakech", name: "Marrakech", src: "/covers/Marrakech.png" },
  { id: "bali",      name: "Bali",      src: "/covers/bali 1.png" },
  { id: "paris",     name: "Paris",     src: "/covers/paris.png" },
  { id: "perou",     name: "Pérou",     src: "/covers/Perou.png" },
];

const DEMOS = [
  { src: "/covers/japon1.png",    alt: "Album Japon Sakura" },
  { src: "/covers/mexique1.png",  alt: "Album Mexique Couleurs" },
  { src: "/demos/italie.png",     alt: "Album Italie Dolce Vita" },
  { src: "/covers/japon2.png",    alt: "Album Japon Tradition" },
  { src: "/covers/mexique2.png",  alt: "Album Mexique Fête" },
];

const GUARANTEES = [
  {
    icon: "🖨️",
    title: "Impression professionnelle",
    desc: "Papier photo brillant 170 g/m², impression offset haute résolution. Le rendu est fidèle à tes photos, avec des couleurs vives et des détails nets.",
  },
  {
    icon: "🔒",
    title: "Paiement 100 % sécurisé",
    desc: "Paiement traité par Stripe, certifié PCI-DSS niveau 1. Tu vois l'aperçu complet de ton album avant de valider ta commande.",
  },
  {
    icon: "↩️",
    title: "Satisfait ou remboursé",
    desc: "Si ton album présente un défaut de fabrication ou ne correspond pas à l'aperçu validé, on te rembourse intégralement — sans conditions, sous 14 jours.",
  },
];

const PERKS = [
  { icon: "📐", label: "Format A4", desc: "21 × 28 cm, portrait" },
  { icon: "✨", label: "Papier photo", desc: "170 g/m², finition brillante" },
  { icon: "📦", label: "Couverture rigide", desc: "Qualité premium" },
  { icon: "🚚", label: "Livraison rapide", desc: "France, 5–7 jours ouvrés" },
];

// Realistic book mockup using actual cover images
function BookMockup({ src, alt, rotate = 0, scale = 1, zIndex = 0 }: {
  src: string; alt: string; rotate?: number; scale?: number; zIndex?: number;
}) {
  return (
    <div
      style={{
        transform: `perspective(800px) rotateY(${rotate}deg) scale(${scale})`,
        zIndex,
        width: 160,
        height: 220,
        borderRadius: 4,
        position: "relative",
        flexShrink: 0,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Book spine */}
      <div style={{
        position: "absolute",
        left: -6,
        top: 2,
        bottom: 2,
        width: 12,
        background: "linear-gradient(to right, rgba(0,0,0,0.4), rgba(0,0,0,0.15))",
        borderRadius: "4px 0 0 4px",
        transform: "translateZ(-1px)",
      }} />
      {/* Cover image — show only right half (front cover) */}
      <div style={{
        width: "100%",
        height: "100%",
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: "8px 12px 28px rgba(0,0,0,0.45), 2px 2px 8px rgba(0,0,0,0.2)",
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} style={{ width: "200%", height: "100%", objectFit: "cover", objectPosition: "100% center", display: "block" }} />
      </div>
      {/* Page edges (right side) */}
      <div style={{
        position: "absolute",
        right: -3,
        top: 4,
        bottom: 4,
        width: 6,
        background: "linear-gradient(to right, #e8e4df, #f5f2ed, #e8e4df)",
        borderRadius: "0 2px 2px 0",
        zIndex: -1,
      }} />
      {/* Bottom page edges */}
      <div style={{
        position: "absolute",
        left: 4,
        right: 4,
        bottom: -3,
        height: 6,
        background: "linear-gradient(to bottom, #e8e4df, #f5f2ed, #e8e4df)",
        borderRadius: "0 0 2px 2px",
        zIndex: -1,
      }} />
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Nav />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0c1220] px-6 pt-20 pb-0 text-white sm:pt-28">
        {/* Subtle radial glow */}
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(120,100,255,0.12) 0%, transparent 70%)" }} />

        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center">
            <span className="mb-5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Album photo premium · A4 · Papier brillant
            </span>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl italic leading-tight text-white sm:text-5xl lg:text-6xl">
              Tes souvenirs méritent
              <br />
              <span className="text-slate-300">un beau livre.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-slate-400">
              Choisis ta couverture, place tes photos, personnalise chaque page. Imprimé et livré chez toi en 5 jours.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <Link
                href="/create"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Créer mon album →
              </Link>
              <Link
                href="/comment-ca-marche"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-3.5 text-sm font-medium text-slate-300 transition hover:bg-white/8"
              >
                Comment ça marche
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
              <span>✓ Imprimé en Europe</span>
              <span>·</span>
              <span>À partir de 29 €</span>
              <span>·</span>
              <span>Satisfait ou remboursé 14 jours</span>
            </div>
          </div>

          {/* Floating book mockups with real covers */}
          <div className="relative mx-auto mt-14 flex items-end justify-center gap-6 sm:gap-10 pb-0" style={{ minHeight: 250 }}>
            <div className="hidden sm:block" style={{ marginBottom: 16 }}>
              <BookMockup src="/covers/Italie.png" alt="Album Italie" rotate={-8} scale={0.82} zIndex={1} />
            </div>
            <div style={{ marginBottom: 0 }}>
              <BookMockup src="/covers/Espagne.png" alt="Album Espagne" rotate={0} scale={1.1} zIndex={3} />
            </div>
            <div className="hidden sm:block" style={{ marginBottom: 16 }}>
              <BookMockup src="/covers/Provence.png" alt="Album Provence" rotate={8} scale={0.82} zIndex={1} />
            </div>
            {/* Shadow under books */}
            <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-12 w-80 rounded-full opacity-50" style={{ background: "radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, transparent 70%)", filter: "blur(10px)" }} />
          </div>
        </div>
      </section>

      {/* ── Quality bar ───────────────────────────────────────────────────── */}
      <section className="border-b border-gray-100 bg-white py-10">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 px-6 sm:grid-cols-4">
          {PERKS.map(p => (
            <div key={p.label} className="flex flex-col items-center gap-1.5 text-center">
              <span className="text-2xl">{p.icon}</span>
              <p className="text-sm font-semibold text-slate-900">{p.label}</p>
              <p className="text-xs text-slate-400">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Cover templates ───────────────────────────────────────────────── */}
      <section className="bg-[#f8f7f4] py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Styles disponibles</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
              Choisis ta couverture
            </h2>
            <p className="mx-auto mt-4 max-w-md text-slate-500">
              Espagne, Italie, Miami, Paris… et de nouvelles illustrations arrivent chaque mois.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {COVER_PREVIEWS.map(tpl => (
              <Link
                key={tpl.id}
                href="/create"
                className="group flex flex-col items-center gap-2"
              >
                <div className="w-full overflow-hidden rounded-lg shadow-md transition-all duration-200 group-hover:shadow-xl group-hover:-translate-y-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tpl.src}
                    alt={tpl.name}
                    className="w-full object-cover"
                    style={{ aspectRatio: "210/297", objectPosition: "right center" }}
                    loading="lazy"
                  />
                </div>
                <span className="text-[11px] text-slate-400 group-hover:text-slate-700 transition">{tpl.name}</span>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/create"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Voir tous les templates →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Showcase albums ───────────────────────────────────────────────── */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Nos créations</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
              Des albums pour chaque destination
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500">
              Japon, Mexique, Italie, Provence, Marrakech… Chaque voyage mérite son beau livre.
            </p>
          </div>
          <div className="flex gap-6 overflow-x-auto px-6 pb-4 snap-x snap-mandatory">
            {DEMOS.map((demo) => (
              <div
                key={demo.alt}
                className="shrink-0 snap-center overflow-hidden rounded-2xl shadow-lg transition hover:shadow-2xl"
                style={{ width: 380 }}
              >
                <Image src={demo.src} alt={demo.alt} width={800} height={560} className="h-auto w-full" />
              </div>
            ))}
            <div className="shrink-0 w-1" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* ── Cas d'usage / Pages destination SEO ─────────────────────────── */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Pour quelle occasion ?</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">Un album pour chaque moment</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <Link href="/album-photo-voyage" className="group rounded-2xl border border-slate-200 p-6 hover:border-slate-900 hover:shadow-md transition">
              <p className="text-3xl mb-3">✈️</p>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-2">Album voyage</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">Tes plus beaux voyages, avec une couverture illustrée par destination.</p>
              <span className="text-xs font-semibold text-slate-900 group-hover:underline">Découvrir →</span>
            </Link>
            <Link href="/album-photo-mariage" className="group rounded-2xl border border-slate-200 p-6 hover:border-slate-900 hover:shadow-md transition">
              <p className="text-3xl mb-3">💒</p>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-2">Album mariage</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">Le plus beau jour dans un livre premium à transmettre.</p>
              <span className="text-xs font-semibold text-slate-900 group-hover:underline">Découvrir →</span>
            </Link>
            <Link href="/album-photo-naissance" className="group rounded-2xl border border-slate-200 p-6 hover:border-slate-900 hover:shadow-md transition">
              <p className="text-3xl mb-3">🍼</p>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-2">Album naissance</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">Les premiers mois de bébé, cadeau parfait pour les grands-parents.</p>
              <span className="text-xs font-semibold text-slate-900 group-hover:underline">Découvrir →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Comment ça marche ─────────────────────────────────────────────── */}
      <section className="bg-[#f8f7f4] py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Simple et rapide</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">Comment ça marche</h2>
          </div>
          <ol className="grid gap-5 md:grid-cols-4">
            {[
              { num: "01", emoji: "📚", title: "Choisis ta couverture", desc: "Sélectionne un style parmi nos templates et ton pack." },
              { num: "02", emoji: "🎨", title: "Crée ton album", desc: "Glisse tes photos, choisis les mises en page, ajoute du texte." },
              { num: "03", emoji: "🛒", title: "Aperçu & commande", desc: "Prévisualise chaque page et valide ta commande." },
              { num: "04", emoji: "🚚", title: "Reçois ton livre", desc: "Imprimé et livré chez toi en 5 à 7 jours ouvrés." },
            ].map((step) => (
              <li key={step.num} className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <span className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-slate-100">{step.num}</span>
                <span className="text-2xl">{step.emoji}</span>
                <h3 className="font-[family-name:var(--font-playfair)] text-lg text-slate-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Tarif</p>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
            Simple et transparent
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-500">Un seul prix, tout inclus.</p>
        </div>
        <div className="mx-auto max-w-sm">
          <article className="relative flex flex-col rounded-2xl border border-slate-900 bg-slate-900 p-10 text-white text-center">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-white px-4 py-1 text-xs font-semibold text-slate-900 shadow-sm">Album imprimé</span>
            </div>
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-white mt-2">À partir de</h3>
            <div className="my-4 flex items-end justify-center gap-1">
              <span className="font-[family-name:var(--font-playfair)] text-5xl font-bold text-white">29 €</span>
              <span className="mb-2 text-xs text-slate-400">paiement unique</span>
            </div>
            <ul className="mb-8 flex flex-col gap-3 text-left">
              {["Livre imprimé finition premium","Format A4 · Papier brillant 170g/m²","Livraison sous 5–7 jours ouvrés","Pour offrir ou garder"].map(p => (
                <li key={p} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="text-slate-400">✓</span>{p}
                </li>
              ))}
            </ul>
            <Link href="/create" className="mt-auto inline-flex items-center justify-center rounded-full bg-white py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition">
              Créer mon album →
            </Link>
          </article>
        </div>
        <p className="mt-8 text-center text-sm text-slate-400">Paiement sécurisé Stripe · Satisfait ou remboursé sous 14 jours</p>
      </section>

      {/* ── Guarantees ────────────────────────────────────────────────────── */}
      <section className="bg-[#f8f7f4] py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Notre promesse</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">Pourquoi nous faire confiance</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {GUARANTEES.map((g) => (
              <div key={g.title} className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                <div className="text-4xl">{g.icon}</div>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900">{g.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ─────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl italic sm:text-4xl">
            Prêt à sublimer tes souvenirs ?
          </h2>
          <p className="mt-4 text-slate-400">Crée ton album en quelques minutes. Tu vois le résultat avant de payer.</p>
          <Link
            href="/create"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-10 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Créer mon album →
          </Link>
        </div>
      </section>

      {/* ── Sticky mobile CTA ──────────────────────────────────────────── */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-6px_20px_rgba(0,0,0,0.06)] backdrop-blur md:hidden"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <div className="flex flex-col leading-tight">
          <span className="text-[11px] uppercase tracking-widest text-slate-400">À partir de</span>
          <span className="text-base font-semibold text-slate-900">À partir de 29€</span>
        </div>
        <Link
          href="/create"
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Créer mon album →
        </Link>
      </div>
      <div className="h-20 md:hidden" aria-hidden="true" />

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0c1220] text-white">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-10">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="flex flex-col gap-4">
              <span className="font-[family-name:var(--font-playfair)] text-xl">L&apos;Instantané</span>
              <p className="text-sm leading-relaxed text-slate-400">
                Tes souvenirs méritent un beau livre. Albums photo premium imprimés et livrés chez toi.
              </p>
              {/* Social */}
              <div className="flex items-center gap-4 mt-2">
                <a href="https://instagram.com/linstantane_souvenir" target="_blank" rel="noopener noreferrer" className="text-slate-400 transition hover:text-white" aria-label="Instagram">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C16.67.014 16.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="https://tiktok.com/@linstantane_souvenir" target="_blank" rel="noopener noreferrer" className="text-slate-400 transition hover:text-white" aria-label="TikTok">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                </a>
              </div>
            </div>

            {/* Pages */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-500">Pages</h4>
              <ul className="flex flex-col gap-3 text-sm text-slate-400">
                <li><Link href="/" className="transition hover:text-white">Accueil</Link></li>
                <li><Link href="/create" className="transition hover:text-white">Créer un album</Link></li>
                <li><Link href="/album-photo-voyage" className="transition hover:text-white">Album voyage</Link></li>
                <li><Link href="/album-photo-mariage" className="transition hover:text-white">Album mariage</Link></li>
                <li><Link href="/album-photo-naissance" className="transition hover:text-white">Album naissance</Link></li>
                <li><Link href="/comment-ca-marche" className="transition hover:text-white">Comment ça marche</Link></li>
                <li><Link href="/faq" className="transition hover:text-white">FAQ</Link></li>
                <li><Link href="/qui-sommes-nous" className="transition hover:text-white">À propos</Link></li>
              </ul>
            </div>

            {/* Infos pratiques */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-500">Infos pratiques</h4>
              <ul className="flex flex-col gap-3 text-sm text-slate-400">
                <li><Link href="/livraison" className="transition hover:text-white">Livraison</Link></li>
                <li><Link href="/politique-de-retour" className="transition hover:text-white">Retours & remboursement</Link></li>
                <li><Link href="/contact" className="transition hover:text-white">Contact & SAV</Link></li>
                <li><Link href="/commandes" className="transition hover:text-white">Suivre ma commande</Link></li>
              </ul>
            </div>

            {/* Légal */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-500">Légal</h4>
              <ul className="flex flex-col gap-3 text-sm text-slate-400">
                <li><Link href="/cgv" className="transition hover:text-white">CGV</Link></li>
                <li><Link href="/mentions-legales" className="transition hover:text-white">Mentions légales</Link></li>
                <li><Link href="/politique-confidentialite" className="transition hover:text-white">Politique de confidentialité</Link></li>
                <li><a href="mailto:linstantane.officiel@gmail.com" className="transition hover:text-white">linstantane.officiel@gmail.com</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-500 sm:flex-row">
            <span>© 2026 L&apos;Instantané · Tous droits réservés</span>
            <div className="flex items-center gap-4">
              <span>Paiement sécurisé</span>
              <span>·</span>
              <span>Satisfait ou remboursé</span>
              <span>·</span>
              <span>Livraison rapide 5–7j</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
