import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

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

// ── Icônes SVG ────────────────────────────────────────────────────────────────

function IconDocument() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );
}
function IconPhoto() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  );
}
function IconBook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  );
}
function IconTruck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect x="1" y="3" width="15" height="13" rx="1"/>
      <path d="M16 8h4l3 3v5h-7V8z"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  );
}
function IconPrinter() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <polyline points="6 9 6 2 18 2 18 9"/>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
      <rect x="6" y="14" width="12" height="8"/>
    </svg>
  );
}
function IconShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  );
}
function IconReturn() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
      <path d="M12 7v5l4 2"/>
    </svg>
  );
}
function IconPlane() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 2c-2-2-4-2-5.5-.5L10 5 1.8 6.2c-.5.1-.9.5-.9 1L3 10l3-1 1 3-2.5 2.5L7 19l3.5-3 2.5 1.5 1 3 3.5 2.5L17 20l.8-.8z"/>
    </svg>
  );
}
function IconHeart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}
function IconStar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

// Book mockup
function BookMockup({ src, alt, rotate = 0, scale = 1, zIndex = 0 }: {
  src: string; alt: string; rotate?: number; scale?: number; zIndex?: number;
}) {
  return (
    <div style={{
      transform: `perspective(800px) rotateY(${rotate}deg) scale(${scale})`,
      zIndex, width: 160, height: 220, borderRadius: 4,
      position: "relative", flexShrink: 0, transformStyle: "preserve-3d",
    }}>
      <div style={{ position:"absolute", left:-6, top:2, bottom:2, width:12, background:"linear-gradient(to right, rgba(0,0,0,0.4), rgba(0,0,0,0.15))", borderRadius:"4px 0 0 4px", transform:"translateZ(-1px)" }}/>
      <div style={{ width:"100%", height:"100%", borderRadius:4, overflow:"hidden", boxShadow:"8px 12px 28px rgba(0,0,0,0.45), 2px 2px 8px rgba(0,0,0,0.2)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} style={{ width:"200%", height:"100%", objectFit:"cover", objectPosition:"100% center", display:"block" }}/>
      </div>
      <div style={{ position:"absolute", right:-3, top:4, bottom:4, width:6, background:"linear-gradient(to right, #e8e4df, #f5f2ed, #e8e4df)", borderRadius:"0 2px 2px 0", zIndex:-1 }}/>
      <div style={{ position:"absolute", left:4, right:4, bottom:-3, height:6, background:"linear-gradient(to bottom, #e8e4df, #f5f2ed, #e8e4df)", borderRadius:"0 0 2px 2px", zIndex:-1 }}/>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Nav />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0c1220] px-6 pt-20 pb-0 text-white sm:pt-28">
        <div className="pointer-events-none absolute inset-0" style={{ background:"radial-gradient(ellipse 70% 50% at 50% -10%, rgba(120,100,255,0.14) 0%, transparent 70%)" }}/>
        <div className="pointer-events-none absolute inset-0" style={{ background:"radial-gradient(ellipse 50% 40% at 50% 80%, rgba(255,180,120,0.08) 0%, transparent 70%)" }}/>

        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center animate-fade-up">
            <span className="mb-5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">
              <span className="text-amber-300">★</span> Album photo premium · Imprimé en France & Europe
            </span>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl italic leading-tight text-white sm:text-5xl lg:text-6xl">
              Tes souvenirs méritent
              <br />
              <span className="bg-gradient-to-r from-white via-slate-200 to-amber-200/80 bg-clip-text text-transparent">un beau livre.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-slate-400">
              Choisis ta couverture, place tes photos, prévisualise chaque page. Imprimé avec soin et livré chez toi en 5 à 7 jours.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <Link href="/create" className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 hover:shadow-[0_8px_30px_rgba(255,255,255,0.18)]">
                Créer mon album
                <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link href="/comment-ca-marche" className="inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-3.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:border-white/30">
                Comment ça marche
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Imprimé en France & Europe</span>
              <span className="text-slate-700">·</span>
              <span className="inline-flex items-center gap-1.5"><span className="text-emerald-400">✓</span> À partir de 29 €</span>
              <span className="text-slate-700">·</span>
              <span className="inline-flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Satisfait ou remboursé 14 j</span>
            </div>
          </div>

          <div className="relative mx-auto mt-14 flex items-end justify-center gap-6 sm:gap-10 pb-0" style={{ minHeight:250 }}>
            <div className="hidden sm:block animate-float-slow" style={{ marginBottom:16, animationDelay:"0.2s" }}>
              <BookMockup src="/covers/Italie.png" alt="Album Italie" rotate={-8} scale={0.82} zIndex={1}/>
            </div>
            <div className="animate-float-slow" style={{ marginBottom:0 }}>
              <BookMockup src="/covers/Espagne.png" alt="Album Espagne" rotate={0} scale={1.1} zIndex={3}/>
            </div>
            <div className="hidden sm:block animate-float-slow" style={{ marginBottom:16, animationDelay:"0.4s" }}>
              <BookMockup src="/covers/Provence.png" alt="Album Provence" rotate={8} scale={0.82} zIndex={1}/>
            </div>
            <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-12 w-80 rounded-full opacity-50" style={{ background:"radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, transparent 70%)", filter:"blur(10px)" }}/>
          </div>
        </div>
      </section>

      {/* ── Barre de qualité ──────────────────────────────────────────────── */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-4xl divide-x divide-gray-100">
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {[
              { icon: <IconDocument />, label: "Format A4",         desc: "21 × 28 cm, portrait"       },
              { icon: <IconPhoto />,    label: "Papier photo",      desc: "170 g/m², finition brillante" },
              { icon: <IconBook />,     label: "Couverture rigide", desc: "Qualité premium"             },
              { icon: <IconTruck />,    label: "Livraison rapide",  desc: "France, 5–7 jours ouvrés"   },
            ].map((p, i) => (
              <div key={p.label} className={`flex items-center gap-4 px-6 py-7 ${i < 3 ? "sm:border-r border-gray-100" : ""} ${i < 2 ? "border-b border-gray-100 sm:border-b-0" : ""}`}>
                <span className="shrink-0 text-slate-400">{p.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{p.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cover templates ───────────────────────────────────────────────── */}
      <section className="bg-[#f8f7f4] py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Styles disponibles</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
              Choisis ta couverture
            </h2>
            <p className="mx-auto mt-4 max-w-md text-slate-500">
              Espagne, Italie, Miami, Paris… de nouvelles illustrations chaque mois.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {COVER_PREVIEWS.map(tpl => (
              <Link key={tpl.id} href="/create" className="group flex flex-col items-center gap-2">
                <div className="w-full overflow-hidden rounded-xl shadow-sm ring-1 ring-black/5 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 group-hover:ring-black/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tpl.src} alt={tpl.name}
                    className="w-full object-cover"
                    style={{ aspectRatio:"210/297", objectPosition:"right center" }}
                    loading="lazy"
                  />
                </div>
                <span className="text-[11px] text-slate-400 group-hover:text-slate-700 transition">{tpl.name}</span>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/create" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700">
              Voir tous les designs →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Showcase ──────────────────────────────────────────────────────── */}
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
          <div className="flex gap-5 overflow-x-auto px-6 pb-4 snap-x snap-mandatory">
            {DEMOS.map((demo) => (
              <div key={demo.alt} className="shrink-0 snap-center overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5 transition hover:shadow-xl hover:-translate-y-1 duration-300" style={{ width:360 }}>
                <Image src={demo.src} alt={demo.alt} width={800} height={560} className="h-auto w-full"/>
              </div>
            ))}
            <div className="shrink-0 w-1" aria-hidden="true"/>
          </div>
        </div>
      </section>

      {/* ── Storytelling ─────────────────────────────────────────────────── */}
      <section className="bg-[#0c1220] py-20 text-white sm:py-28">
        <div className="mx-auto grid max-w-5xl gap-14 px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/80">Pourquoi un album ?</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl italic leading-tight sm:text-4xl">
              Tes photos méritent<br/>
              <span className="text-slate-300">mieux que ton téléphone.</span>
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-400">
              <p>Tu as fait ce voyage incroyable. Ce mariage parfait. Ces premiers pas. Et tout est resté là, perdu dans la pellicule infinie de ton téléphone — qu&apos;on ne rouvre jamais vraiment.</p>
              <p><span className="text-white">Un album, c&apos;est différent.</span> On le tient, on le feuillette, on le pose sur la table basse. On le montre à ses proches, on le transmet. C&apos;est un objet qui traverse le temps.</p>
              <p>On a créé L&apos;Instantané pour ça : transformer tes meilleurs souvenirs en un livre que tu seras fier d&apos;ouvrir, encore et encore.</p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/create" className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                Commencer mon album →
              </Link>
              <Link href="/qui-sommes-nous" className="text-sm text-slate-400 underline-offset-4 transition hover:text-white hover:underline">
                Notre histoire
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {[
                { src:"/covers/Espagne.png",   alt:"Album Espagne" },
                { src:"/covers/Italie.png",    alt:"Album Italie" },
                { src:"/covers/Marrakech.png", alt:"Album Marrakech" },
                { src:"/covers/Miami.png",     alt:"Album Miami" },
              ].map(({ src, alt }) => (
                <div key={src} className="aspect-[3/4] overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10 transition hover:scale-[1.02] duration-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={alt} className="h-full object-cover" style={{ width:"200%", objectPosition:"100% center" }} loading="lazy"/>
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full opacity-40 blur-3xl" style={{ background:"radial-gradient(ellipse, rgba(180,140,255,0.3) 0%, transparent 70%)" }}/>
          </div>
        </div>
      </section>

      {/* ── Pour quelle occasion ─────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Pour quelle occasion ?</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">Un album pour chaque moment</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                href: "/album-photo-voyage",
                icon: <IconPlane />,
                accent: "bg-sky-50 text-sky-600",
                title: "Album voyage",
                desc: "Tes plus beaux voyages, avec une couverture illustrée par destination.",
              },
              {
                href: "/album-photo-mariage",
                icon: <IconHeart />,
                accent: "bg-rose-50 text-rose-600",
                title: "Album mariage",
                desc: "Le plus beau jour dans un livre premium à transmettre aux générations suivantes.",
              },
              {
                href: "/album-photo-naissance",
                icon: <IconStar />,
                accent: "bg-amber-50 text-amber-600",
                title: "Album naissance",
                desc: "Les premiers mois de bébé, cadeau parfait pour les grands-parents.",
              },
            ].map(card => (
              <Link key={card.href} href={card.href} className="group flex flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${card.accent}`}>
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-2">{card.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{card.desc}</p>
                </div>
                <span className="mt-auto text-xs font-semibold text-slate-900 group-hover:underline underline-offset-4">Découvrir →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Promesse fondateur ───────────────────────────────────────────── */}
      <section className="bg-[#f8f7f4] py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100 sm:p-12">
            <div className="flex flex-col items-center text-center">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Promesse fondateur
              </span>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl italic text-slate-900 sm:text-3xl">
                Si l&apos;album n&apos;est pas parfait, on le réimprime ou on te rembourse.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                On démarre L&apos;Instantané avec une obsession : la qualité du livre. Tu prévisualises chaque page avant de payer, et tu disposes de 14 jours après réception pour nous écrire si quelque chose cloche — réimpression ou remboursement intégral, sans discuter.
              </p>
              <div className="mt-8 grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { v: "5–7j",   l: "Livraison France" },
                  { v: "100 %",  l: "Aperçu avant achat" },
                  { v: "14 j",   l: "Remboursé sans condition" },
                  { v: "0 €",    l: "Frais cachés" },
                ].map(s => (
                  <div key={s.l} className="rounded-2xl bg-slate-50 px-3 py-5 text-center">
                    <p className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-slate-900">{s.v}</p>
                    <p className="mt-1.5 text-[11px] leading-snug uppercase tracking-wider text-slate-400">{s.l}</p>
                  </div>
                ))}
              </div>
              <p className="mt-7 text-xs text-slate-500">
                Une question ? Écris à{" "}
                <a href="mailto:linstantane.officiel@gmail.com" className="font-medium text-slate-900 underline-offset-4 hover:underline">linstantane.officiel@gmail.com</a>
                {" "}— réponse sous 24–48 h en semaine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Comment ça marche ─────────────────────────────────────────────── */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Simple et rapide</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">Comment ça marche</h2>
          </div>
          <ol className="grid gap-5 md:grid-cols-4">
            {[
              { num: "01", title: "Choisis ta couverture", desc: "Sélectionne un style parmi nos designs illustrés par destination." },
              { num: "02", title: "Crée ton album",        desc: "Glisse tes photos, choisis les mises en page, ajoute tes textes." },
              { num: "03", title: "Aperçu & commande",     desc: "Prévisualise chaque page dans le détail avant de valider." },
              { num: "04", title: "Reçois ton livre",      desc: "Imprimé à la main et livré chez toi en 5 à 7 jours ouvrés." },
            ].map((step) => (
              <li key={step.num} className="flex flex-col gap-4 rounded-2xl bg-[#f8f7f4] p-7">
                <span className="font-[family-name:var(--font-playfair)] text-5xl font-bold text-slate-200 leading-none">{step.num}</span>
                <h3 className="font-[family-name:var(--font-playfair)] text-lg text-slate-900 leading-snug">{step.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Tarif ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#f8f7f4] py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Tarif</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">Simple et transparent</h2>
            <p className="mx-auto mt-4 max-w-lg text-slate-500">Un seul prix, tout inclus. Aucun abonnement, aucun frais caché.</p>
          </div>
          <div className="mx-auto max-w-sm">
            <article className="relative flex flex-col rounded-3xl bg-slate-900 p-10 text-white text-center shadow-xl">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-amber-400 px-4 py-1 text-xs font-bold text-slate-900 shadow-sm">Album imprimé premium</span>
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl text-slate-300 mt-3">À partir de</h3>
              <div className="my-4 flex items-end justify-center gap-1">
                <span className="font-[family-name:var(--font-playfair)] text-6xl font-bold text-white">29 €</span>
                <span className="mb-2.5 text-xs text-slate-500">paiement unique</span>
              </div>
              <ul className="mb-8 flex flex-col gap-3 text-left">
                {[
                  "Livre imprimé finition premium",
                  "Format A4 · Papier brillant 170 g/m²",
                  "Livraison sous 5–7 jours ouvrés",
                  "Pour offrir ou garder",
                ].map(p => (
                  <li key={p} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-700 text-[10px] text-slate-300">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
              <Link href="/create" className="mt-auto inline-flex items-center justify-center rounded-full bg-white py-3.5 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition">
                Créer mon album →
              </Link>
            </article>
          </div>
          <p className="mt-8 text-center text-sm text-slate-400">Paiement sécurisé Stripe · Satisfait ou remboursé sous 14 jours</p>
        </div>
      </section>

      {/* ── Garanties ─────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Notre promesse</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">Pourquoi nous faire confiance</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: <IconPrinter />,
                accent: "bg-slate-100 text-slate-700",
                title: "Impression professionnelle",
                desc: "Papier photo brillant 170 g/m², impression numérique haute résolution. Couleurs vives et détails nets — du niveau d'un beau livre de librairie.",
              },
              {
                icon: <IconShield />,
                accent: "bg-emerald-50 text-emerald-700",
                title: "Paiement 100 % sécurisé",
                desc: "Paiement traité par Stripe, certifié PCI-DSS niveau 1. Tu vois l'aperçu complet de ton album avant de valider ta commande.",
              },
              {
                icon: <IconReturn />,
                accent: "bg-amber-50 text-amber-700",
                title: "Satisfait ou remboursé",
                desc: "Si ton album présente un défaut ou ne correspond pas à l'aperçu validé, on te rembourse intégralement — sans conditions, sous 14 jours.",
              },
            ].map((g) => (
              <div key={g.title} className="flex flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${g.accent}`}>
                  {g.icon}
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-2">{g.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#f8f7f4] py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Questions fréquentes</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">On répond à tout</h2>
          </div>
          <div className="divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {[
              { q: "Combien de temps pour recevoir mon album ?",   a: "5 à 7 jours ouvrés en France métropolitaine. Fabrication en 2 à 3 jours, puis expédition en 2 à 4 jours." },
              { q: "Puis-je voir mon album avant de payer ?",      a: "Oui, à 100 %. Tu prévisualises chaque page, la couverture, le 4ᵉ de couverture. Aucune commande n'est lancée tant que tu n'as pas validé l'aperçu." },
              { q: "Quelle est la qualité du livre ?",             a: "Format A4 (21×28 cm), couverture rigide, papier photo brillant 170 g/m². Impression haute résolution, finition premium." },
              { q: "Et si l'album ne me plaît pas ?",              a: "Satisfait ou remboursé sous 14 jours. Si l'album présente un défaut ou ne correspond pas à l'aperçu validé, on te rembourse intégralement." },
              { q: "Combien ça coûte vraiment ?",                  a: "29 € pour un album de 24 pages, puis 0,50 € par page supplémentaire. Frais de port calculés au paiement. Aucun abonnement, aucun frais caché." },
            ].map((item, idx) => (
              <details key={idx} className="group px-7 py-5 transition hover:bg-slate-50/60 [&[open]]:bg-slate-50/80">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-slate-900 sm:text-base">{item.q}</span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition group-hover:border-slate-400 group-open:rotate-45 group-open:bg-slate-900 group-open:text-white group-open:border-slate-900">
                    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 1.5v9M1.5 6h9"/></svg>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-slate-500">
            Tu as une autre question ?{" "}
            <Link href="/faq" className="font-medium text-slate-900 underline-offset-4 hover:underline">Voir toute la FAQ</Link>
            {" "}ou écris-nous à{" "}
            <a href="mailto:linstantane.officiel@gmail.com" className="font-medium text-slate-900 underline-offset-4 hover:underline">linstantane.officiel@gmail.com</a>.
          </p>
        </div>
      </section>

      {/* ── CTA final ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0c1220] py-24 text-white sm:py-32">
        <div className="pointer-events-none absolute inset-0" style={{ background:"radial-gradient(ellipse 60% 50% at 50% 50%, rgba(180,140,255,0.18) 0%, transparent 70%)" }}/>
        <div className="pointer-events-none absolute inset-0" style={{ background:"radial-gradient(ellipse 40% 30% at 80% 20%, rgba(255,180,120,0.10) 0%, transparent 70%)" }}/>
        <div className="relative mx-auto max-w-2xl px-6 text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">
            <span className="text-amber-300">★</span> Aucun engagement
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl italic leading-tight sm:text-5xl">
            Et si tu commençais<br/>
            <span className="bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent">ton album ce soir ?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-slate-400">
            Quelques minutes pour le créer. Aucun paiement avant validation. Livré chez toi sous 5 à 7 jours.
          </p>
          <Link href="/create" className="group mt-9 inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-sm font-semibold text-slate-900 shadow-[0_8px_30px_rgba(255,255,255,0.18)] transition hover:bg-slate-100 hover:shadow-[0_12px_40px_rgba(255,255,255,0.25)]">
            Créer mon album
            <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Aperçu avant paiement</span>
            <span className="text-slate-700">·</span>
            <span className="inline-flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Stripe sécurisé</span>
            <span className="text-slate-700">·</span>
            <span className="inline-flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Remboursé 14 j</span>
          </div>
        </div>
      </section>

      {/* ── Sticky mobile CTA ─────────────────────────────────────────────── */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-6px_20px_rgba(0,0,0,0.06)] backdrop-blur md:hidden"
        style={{ paddingBottom:"calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <div className="flex flex-col leading-tight">
          <span className="text-[11px] uppercase tracking-widest text-slate-400">À partir de</span>
          <span className="text-base font-bold text-slate-900">29 €</span>
        </div>
        <Link href="/create" className="inline-flex shrink-0 items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
          Créer mon album →
        </Link>
      </div>
      <div className="h-20 md:hidden" aria-hidden="true"/>

      <Footer />
    </main>
  );
}
