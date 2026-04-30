import type { Metadata } from "next";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Album photo naissance et bébé — L'Instantané",
  description: "Crée l'album photo de naissance de ton bébé. Premiers mois, premiers sourires, premiers pas. Format A4, papier brillant 170 g/m², livré en 5-7 jours. Cadeau de naissance idéal.",
  alternates: { canonical: "/album-photo-naissance" },
  openGraph: {
    title: "Album photo naissance et bébé",
    description: "Garde précieusement les premiers mois de ton bébé dans un beau livre.",
  },
};

const FAQ_ITEMS = [
  { q: "À partir de quand puis-je faire l'album ?", a: "Quand tu veux ! Beaucoup de parents font un premier album au bout du 1er mois (« Le premier mois de [prénom] »), d'autres attendent le 1er anniversaire. C'est toi qui choisis." },
  { q: "Je veux l'offrir — peut-on livrer directement chez les grands-parents ?", a: "Bien sûr. À la commande, indique simplement l'adresse de livraison souhaitée. C'est un très beau cadeau de naissance." },
  { q: "Mes photos sont un peu sombres (maternité, nuit…). Ça va rendre ?", a: "Les photos en basse lumière des smartphones récents passent bien en général. Évite juste celles qui sont vraiment floues ou très granuleuses." },
  { q: "Combien de pages pour couvrir la première année ?", a: "Pour 12 mois, compte 36 à 48 pages (3 à 4 pages par mois). Tu peux commencer plus court (24 pages) puis faire un 2e album pour la suite." },
];

export default function AlbumPhotoNaissancePage() {
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
      { "@type": "ListItem", position: 2, name: "Album photo naissance", item: "https://linstantane.fr/album-photo-naissance" },
    ],
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-50/60 via-white to-white" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-6 pt-16 pb-16 text-center lg:pt-24 lg:pb-20">
          <div className="animate-fade-up">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sky-500/80">Premiers mois</p>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 leading-[1.1] sm:text-5xl lg:text-6xl">
              L&apos;album photo de naissance,
              <br />
              <span className="bg-gradient-to-r from-sky-500 to-rose-400 bg-clip-text text-transparent italic">premier trésor de ton bébé.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
              Les premières semaines passent vite. Garde précieusement les plus beaux instants — naissance, rencontre avec les frères et sœurs, premiers sourires — dans un album qu&apos;il feuillettera un jour avec toi.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/create" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-700">
                Créer son album →
              </Link>
              <Link href="/shop" className="inline-flex items-center justify-center rounded-full border border-slate-300 px-8 py-4 text-sm font-semibold text-slate-900 transition hover:border-slate-900">
                Voir les couvertures
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><Dot /> À partir de 29 €</span>
              <span className="flex items-center gap-1.5"><Dot /> Livraison 5–7 j</span>
              <span className="flex items-center gap-1.5"><Dot /> Satisfait ou remboursé 14 j</span>
            </div>
          </div>
        </div>
      </section>

      {/* Promesse */}
      <section className="bg-[#faf8f4] py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Pensé pour toi</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
              Un album pensé pour les jeunes parents
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: "🍼", title: "Simple et rapide", desc: "Entre les couches et le manque de sommeil, on n'a pas des heures. Notre éditeur se prend en main en 5 minutes depuis ton téléphone." },
              { icon: "📱", title: "Depuis tes photos de téléphone", desc: "Pas besoin d'appareil photo pro. La plupart des photos de smartphone modernes s'impriment très bien en A4." },
              { icon: "🎁", title: "Cadeau de naissance idéal", desc: "Grands-parents, marraine, parrain — offre un bel objet souvenir plutôt qu'un 10e body. Ça laisse une trace." },
              { icon: "💛", title: "Transmission familiale", desc: "Un album qu'il feuillettera plus tard avec toi. Bien mieux qu'un dossier oublié au fond d'un disque dur." },
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

      {/* Structure */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Inspiration</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
              Que mettre dans un album de naissance ?
            </h2>
          </div>
          <ol className="space-y-5">
            {[
              { n: 1, title: "La grossesse & l'attente", desc: "Une ou deux pages pour poser le contexte — photos de ventre, échographies, préparation de la chambre." },
              { n: 2, title: "La naissance", desc: "Premiers instants à la maternité, le peau-à-peau, la pesée, le bracelet. N'oublie pas de noter le prénom, la date et l'heure sur la page." },
              { n: 3, title: "Les rencontres", desc: "L'arrivée à la maison, la rencontre avec les grands-parents, les frères et sœurs, les amis. Ces premiers câlins prennent une valeur énorme avec le temps." },
              { n: 4, title: "Les premiers mois", desc: "Premier bain, premier sourire, première dent, premiers pas. Idéalement 1 à 2 pages par mois pour garder un vrai récit chronologique." },
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
        <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-500/15 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-5xl">
            <span className="bg-gradient-to-r from-sky-300 to-rose-200 bg-clip-text text-transparent italic">Un souvenir</span>
            <br />
            qui reste, pour la vie.
          </h2>
          <p className="mt-5 text-slate-300">Ça prend 15 minutes depuis ton canapé. Livré chez toi sous une semaine.</p>
          <Link href="/create" className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
            Créer l&apos;album →
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
