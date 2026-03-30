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
  { src: "/demos/provence.png", alt: "Album Provence Lavande" },
  { src: "/demos/italie.png", alt: "Album Italie Dolce Vita" },
  { src: "/demos/miami.png", alt: "Album Miami Plage" },
  { src: "/demos/espagne.png", alt: "Album Espagne Soleil" },
  { src: "/demos/marrakech.png", alt: "Album Marrakech Soleil" },
];

const TESTIMONIALS = [
  {
    name: "Camille",
    role: "Pack Physique",
    stars: 5,
    quote: "On a envoyé les photos du week-end et le livre est magnifique. Un souvenir inoubliable à feuilleter.",
  },
  {
    name: "Yanis",
    role: "Pack Digital",
    stars: 5,
    quote: "En quelques minutes j'avais mon album prêt. La mise en page est top, vraiment premium.",
  },
  {
    name: "Sarah",
    role: "Pack Duo",
    stars: 5,
    quote: "Offrir le livre imprimé à ma mère pour son anniversaire, c'était le cadeau parfait. Elle a adoré.",
  },
];

const PERKS = [
  { icon: "📐", label: "Format A4", desc: "21 × 28 cm, portrait" },
  { icon: "✨", label: "Papier photo", desc: "170 g/m², finition brillante" },
  { icon: "📦", label: "Couverture rigide", desc: "Qualité premium" },
  { icon: "🚚", label: "Livraison offerte", desc: "France, 5–7 jours" },
];

// Inline CSS book mockup component
function BookMockup({ bgColor, textColor, title, rotate = 0, scale = 1, zIndex = 0 }: {
  bgColor: string; textColor: string; title: string; rotate?: number; scale?: number; zIndex?: number;
}) {
  return (
    <div
      style={{
        backgroundColor: bgColor,
        transform: `rotate(${rotate}deg) scale(${scale})`,
        zIndex,
        width: 140,
        height: 190,
        borderRadius: 6,
        position: "relative",
        flexShrink: 0,
        boxShadow: "8px 8px 24px rgba(0,0,0,0.35), inset -3px 0 8px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px 10px",
        overflow: "hidden",
      }}
    >
      {/* Spine */}
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:8, background:"rgba(0,0,0,0.2)", borderRadius:"6px 0 0 6px" }} />
      {/* Top line */}
      <div style={{ position:"absolute", top:12, left:16, right:12, height:1, backgroundColor:textColor, opacity:0.25 }} />
      {/* Bottom line */}
      <div style={{ position:"absolute", bottom:12, left:16, right:12, height:1, backgroundColor:textColor, opacity:0.25 }} />
      {/* Title */}
      <p style={{ color:textColor, fontFamily:"Georgia, serif", fontSize:15, fontStyle:"italic", textAlign:"center", lineHeight:1.3, padding:"0 4px", opacity:0.9 }}>
        {title}
      </p>
      {/* Branding */}
      <p style={{ position:"absolute", bottom:18, color:textColor, opacity:0.35, fontSize:7, letterSpacing:"0.15em", textTransform:"uppercase" }}>
        L&apos;Instantané
      </p>
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
                href="/shop"
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
              <span className="flex items-center gap-1.5"><span className="text-amber-400">★★★★★</span> 4,9 / 5</span>
              <span>·</span>
              <span>500+ albums créés</span>
              <span>·</span>
              <span>Satisfait ou remboursé</span>
            </div>
          </div>

          {/* Floating book mockups */}
          <div className="relative mt-14 flex items-end justify-center gap-4 pb-0" style={{ minHeight: 220 }}>
            <div className="hidden sm:block" style={{ marginBottom: 8 }}>
              <BookMockup bgColor="#0d9488" textColor="#ffffff" title="Italie 2024" rotate={-8} scale={0.88} zIndex={1} />
            </div>
            <BookMockup bgColor="#0f172a" textColor="#ffffff" title="Mon Album" rotate={0} scale={1.1} zIndex={3} />
            <div className="hidden sm:block" style={{ marginBottom: 8 }}>
              <BookMockup bgColor="#f5e6d3" textColor="#3d2b1f" title="Voyage en Provence" rotate={8} scale={0.88} zIndex={1} />
            </div>
            {/* Shadow under books */}
            <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-10 w-64 rounded-full opacity-40" style={{ background: "radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, transparent 70%)", filter: "blur(8px)" }} />
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
                  <img
                    src={tpl.src}
                    alt={tpl.name}
                    className="w-full h-auto object-cover"
                    loading="eager"
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
              Provence, Italie, Miami, Espagne, Marrakech… Chaque voyage mérite son beau livre.
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
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Nos offres</p>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
            Paiement unique, sans abonnement
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-500">Choisis le pack qui correspond à tes souvenirs.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { id:"digital",  name:"Digital",  price:"10 €", note:"Album PDF HD",       perks:["Haute résolution","PDF prêt à partager","Téléchargement immédiat"],        featured:false },
            { id:"physique", name:"Physique", price:"29 €", note:"Livre imprimé",       perks:["Livre finition premium","Livraison France offerte","Pour offrir ou garder"], featured:true  },
            { id:"duo",      name:"Duo",      price:"35 €", note:"Digital + Physique",  perks:["Pack Digital inclus","Livre imprimé inclus","Meilleure valeur"],             featured:false },
          ].map((plan) => (
            <article
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border p-8 ${plan.featured ? "border-slate-900 bg-slate-900 text-white" : "border-gray-100 bg-white shadow-sm"}`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-white px-4 py-1 text-xs font-semibold text-slate-900 shadow-sm">Populaire</span>
                </div>
              )}
              <h3 className={`font-[family-name:var(--font-playfair)] text-2xl ${plan.featured ? "text-white" : "text-slate-900"}`}>{plan.name}</h3>
              <p className={`mt-1 text-sm ${plan.featured ? "text-slate-400" : "text-slate-400"}`}>{plan.note}</p>
              <div className="my-6 flex items-end gap-1">
                <span className={`font-[family-name:var(--font-playfair)] text-4xl ${plan.featured ? "text-white" : "text-slate-900"}`}>{plan.price}</span>
                <span className={`mb-1 text-xs ${plan.featured ? "text-slate-400" : "text-slate-400"}`}>paiement unique</span>
              </div>
              <ul className="mb-8 flex flex-col gap-2.5">
                {plan.perks.map((perk) => (
                  <li key={perk} className={`flex items-start gap-2 text-sm ${plan.featured ? "text-slate-300" : "text-slate-600"}`}>
                    <span className={`mt-0.5 shrink-0 ${plan.featured ? "text-slate-400" : "text-slate-300"}`}>✓</span>
                    {perk}
                  </li>
                ))}
              </ul>
              <Link
                href="/shop"
                className={`mt-auto inline-flex items-center justify-center rounded-full py-3 text-sm font-medium transition ${plan.featured ? "bg-white text-slate-900 hover:bg-slate-100" : "bg-slate-900 text-white hover:bg-slate-700"}`}
              >
                Commencer
              </Link>
            </article>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-slate-400">Paiement sécurisé Stripe. Satisfait ou remboursé sous 14 jours.</p>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section className="bg-[#f8f7f4] py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Ils ont testé</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">Témoignages</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <blockquote key={t.name} className="flex flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                <div className="mb-4 flex text-amber-400">{"★★★★★".split("").map((s,i)=><span key={i}>{s}</span>)}</div>
                <p className="flex-1 text-sm leading-relaxed text-slate-600">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-6 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">{t.name.charAt(0)}</div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.role}</div>
                  </div>
                </footer>
              </blockquote>
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
            href="/shop"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-10 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Créer mon album →
          </Link>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-400 sm:flex-row">
          <span className="font-[family-name:var(--font-playfair)] text-slate-900">L&apos;Instantané</span>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/comment-ca-marche" className="transition hover:text-slate-700">Comment ça marche</Link>
            <Link href="/shop" className="transition hover:text-slate-700">Albums</Link>
            <Link href="/faq" className="transition hover:text-slate-700">FAQ</Link>
            <Link href="/qui-sommes-nous" className="transition hover:text-slate-700">À propos</Link>
            <Link href="/mentions-legales" className="transition hover:text-slate-700">Mentions légales</Link>
            <Link href="/cgv" className="transition hover:text-slate-700">CGV</Link>
          </div>
          <span>© 2026 L&apos;Instantané</span>
        </div>
      </footer>
    </main>
  );
}
