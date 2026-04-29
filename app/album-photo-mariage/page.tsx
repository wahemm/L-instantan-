import type { Metadata } from "next";
import Image from "next/image";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Album photo mariage premium — L'Instantané",
  description: "Crée l'album photo de ton mariage. Format A4, papier brillant 170 g/m², couverture rigide. Imprimé en France & Europe, livré en 5-7 jours. Idéal cadeau pour les témoins.",
  alternates: { canonical: "/album-photo-mariage" },
  openGraph: {
    title: "Album photo mariage premium",
    description: "Un beau livre pour immortaliser le plus beau jour de ta vie.",
    images: ["/covers/amor.png"],
  },
};

const FAQ_ITEMS = [
  { q: "Combien de pages pour un album mariage ?", a: "L'album de base fait 24 pages. Pour un mariage, on recommande entre 40 et 60 pages. Tu peux ajouter des pages supplémentaires à tout moment dans l'éditeur, facturées à l'unité." },
  { q: "Mon photographe m'a livré ses photos en RAW/TIFF. Est-ce compatible ?", a: "Notre éditeur accepte les fichiers JPEG et PNG. Si tes photos sont en RAW, demande à ton photographe des exports JPEG haute qualité — ça ne change rien à la qualité d'impression." },
  { q: "Pouvez-vous mettre l'album en page à ma place ?", a: "Notre éditeur est conçu pour être simple : en moyenne, ça prend 30 à 45 minutes pour un album mariage. Si tu veux un service de mise en page sur-mesure, écris-nous." },
  { q: "Commande groupée pour offrir aux témoins ?", a: "Oui, c'est possible. Contacte-nous par email avant de commander pour bénéficier d'un tarif dégressif sur plusieurs exemplaires identiques." },
];

export default function AlbumPhotoMariagePage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map(i => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://linstantane.fr" },
      { "@type": "ListItem", position: 2, name: "Album photo mariage", item: "https://linstantane.fr/album-photo-mariage" },
    ],
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-rose-50/50 via-white to-white" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 pt-16 pb-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:pt-20 lg:pb-20">
          <div className="animate-fade-up">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-500/80">Le plus beau jour de ta vie</p>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-slate-900 leading-[1.1] sm:text-5xl lg:text-6xl">
              L&apos;album photo mariage,
              <br />
              <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent italic">fait pour durer.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
              Un beau livre que tu feuilletteras dans 20 ans, que tu montreras à tes enfants, que tu offriras à tes témoins. Sélectionne tes plus belles photos, choisis ta couverture, reçois ton album sous une semaine.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/create" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-700">
                Créer notre album mariage →
              </Link>
              <Link href="/shop" className="inline-flex items-center justify-center rounded-full border border-slate-300 px-8 py-4 text-sm font-semibold text-slate-900 transition hover:border-slate-900">
                Voir les couvertures
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Dot /> À partir de 29 €
              </span>
              <span className="flex items-center gap-1.5">
                <Dot /> Livraison 5–7 j
              </span>
              <span className="flex items-center gap-1.5">
                <Dot /> Satisfait ou remboursé 14 j
              </span>
            </div>
          </div>

          {/* Visual: album mockup */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-rose-100 via-amber-50 to-white shadow-2xl shadow-slate-900/10">
              <Image
                src="/covers/amor.png"
                alt="Album photo mariage L'Instantané — couverture amor"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 500px"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/20 to-transparent" aria-hidden />
            </div>
            <div className="absolute -bottom-4 -right-4 hidden rounded-2xl bg-white px-5 py-4 shadow-xl ring-1 ring-slate-100 sm:block">
              <p className="text-xs uppercase tracking-widest text-slate-400">Format</p>
              <p className="mt-0.5 font-[family-name:var(--font-playfair)] text-lg text-slate-900">A4 · 21 × 28 cm</p>
            </div>
          </div>
        </div>
      </section>

      {/* Promesse */}
      <section className="bg-[#faf8f4] py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Notre promesse</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
              Un album à la hauteur de ce jour
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: "💎", title: "Finition premium", desc: "Papier photo brillant 170 g/m², couverture rigide personnalisée. Un livre qui a du poids dans la main, fait pour être transmis." },
              { icon: "👰", title: "Couvertures élégantes", desc: "Designs sobres et chic adaptés au mariage, ou une photo plein cadre de vous deux en couverture." },
              { icon: "💝", title: "Idéal pour les témoins", desc: "Commande plusieurs exemplaires — un pour vous, un pour chaque famille, un pour les témoins. Un cadeau plein de sens à un prix accessible." },
              { icon: "✍️", title: "Textes et légendes", desc: "Ajoute vos dates, le nom de vos témoins, une citation qui vous tient à cœur. Le texte se pose librement sur chaque page." },
            ].map(item => (
              <div key={item.title} className="group rounded-2xl border border-slate-200/60 bg-white p-7 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                <p className="text-3xl mb-4">{item.icon}</p>
                <h3 className="mb-2 font-semibold text-slate-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Structure idéale */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Inspiration</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
              Structure idéale d&apos;un album mariage
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-slate-500">
              Une trame éprouvée, libre à toi de l&apos;adapter. Compte environ 40 à 60 pages au total.
            </p>
          </div>
          <ol className="space-y-5">
            {[
              { n: 1, title: "Les préparatifs (4–6 pages)", desc: "Le matin, la robe, les témoins, les détails — alliances, bouquet, chaussures. Ces photos racontent l'attente." },
              { n: 2, title: "La cérémonie (6–8 pages)", desc: "L'arrivée, les vœux, l'échange des alliances, la sortie sous les pétales. Grandes photos pleine page pour ces instants forts." },
              { n: 3, title: "Portraits & famille (4–6 pages)", desc: "Photos posées avec les proches. Grille de 4 photos pour grouper les familles, grande photo seuls pour vous deux." },
              { n: 4, title: "La fête (6–8 pages)", desc: "Vin d'honneur, dîner, discours, première danse, gâteau. Beaucoup d'émotion à capturer — alterne portraits et ambiance." },
            ].map(step => (
              <li key={step.n} className="flex gap-5 rounded-2xl border border-slate-100 bg-white p-5 transition hover:border-slate-200">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                  {step.n}
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#faf8f4] py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">FAQ</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
              Questions fréquentes
            </h2>
          </div>
          <div className="divide-y divide-slate-200/70 overflow-hidden rounded-2xl border border-slate-200/70 bg-white">
            {FAQ_ITEMS.map((it, i) => (
              <details key={i} className="group">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-slate-50/70 [&::-webkit-details-marker]:hidden">
                  <span className="font-medium text-slate-900">{it.q}</span>
                  <span className="shrink-0 text-2xl font-light text-slate-400 transition group-open:rotate-45">+</span>
                </summary>
                <div className="border-t border-slate-100 px-6 pb-6 pt-4 text-sm leading-relaxed text-slate-600">
                  {it.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="relative overflow-hidden bg-slate-900 py-20 text-white">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-rose-500/15 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-5xl">
            <span className="bg-gradient-to-r from-rose-300 to-amber-200 bg-clip-text text-transparent italic">Un souvenir</span>
            <br />
            qui traverse les années.
          </h2>
          <p className="mt-5 text-slate-300">Ça prend 30 minutes. Livré chez toi sous une semaine.</p>
          <Link href="/create" className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
            Créer notre album →
          </Link>
          <p className="mt-4 text-xs text-slate-500">Paiement sécurisé · Satisfait ou remboursé 14 jours</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Dot() {
  return <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />;
}
