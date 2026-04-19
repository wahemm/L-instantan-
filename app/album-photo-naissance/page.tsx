import type { Metadata } from "next";
import Nav from "@/app/components/Nav";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Album photo naissance et bébé — L'Instantané",
  description: "Crée l'album photo de naissance de votre bébé. Premiers mois, premières dents, premiers pas. Format A4, livré en 5-7 jours. Cadeau de naissance idéal.",
  alternates: { canonical: "/album-photo-naissance" },
  openGraph: {
    title: "Album photo naissance et bébé",
    description: "Gardez précieusement les premiers mois de votre bébé dans un bel album.",
  },
};

const FAQ_ITEMS = [
  { q: "À partir de quand puis-je faire l'album ?", a: "Quand vous voulez ! Beaucoup de parents font un premier album au bout du 1er mois, d'autres attendent le 1er anniversaire. C'est vous qui choisissez." },
  { q: "Je veux l'offrir — puis-je le faire livrer directement chez les grands-parents ?", a: "Bien sûr. À la commande, indiquez simplement l'adresse de livraison que vous souhaitez. C'est un très beau cadeau de naissance." },
  { q: "Mes photos sont un peu sombres (maternité, nuit…). Ça va rendre ?", a: "Les photos en basse lumière des smartphones récents passent bien en général. Évitez juste celles qui sont vraiment floues ou très granuleuses." },
  { q: "Combien de pages pour couvrir la première année ?", a: "Pour 12 mois, comptez 36 à 48 pages (3-4 pages par mois). Vous pouvez commencer plus court (24 pages) et faire un 2e album pour la suite." },
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

      <section className="mx-auto max-w-5xl px-6 pt-16 pb-12 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Premiers mois</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-5xl text-slate-900 leading-tight">
          L&apos;album photo de naissance,<br/>premier trésor de votre bébé.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-slate-500 leading-relaxed">
          Les premières semaines passent vite. Gardez précieusement les plus beaux instants — naissance, rencontre avec les frères et sœurs, premiers sourires — dans un album photo qu&apos;il feuillettera un jour.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/create" className="rounded-full bg-slate-900 px-8 py-4 text-sm font-semibold text-white hover:bg-slate-700 transition">Créer son album →</Link>
          <Link href="/shop" className="rounded-full border border-slate-300 px-8 py-4 text-sm font-semibold text-slate-900 hover:border-slate-900 transition">Voir les couvertures</Link>
        </div>
        <p className="mt-4 text-xs text-slate-400">À partir de 29€ · Livraison offerte · Satisfait ou remboursé 14j</p>
      </section>

      <section className="bg-[#faf8f4] py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl text-center text-slate-900 mb-10">Un album pensé pour les jeunes parents</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-2xl mb-3">🍼</p>
              <h3 className="font-semibold text-slate-900 mb-2">Simple et rapide</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Entre les couches et le manque de sommeil, on n&apos;a pas des heures. Notre éditeur se prend en main en 5 minutes depuis un téléphone.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-2xl mb-3">📱</p>
              <h3 className="font-semibold text-slate-900 mb-2">Depuis vos photos de téléphone</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Pas besoin d&apos;appareil photo pro. La plupart des photos de téléphone modernes s&apos;impriment très bien en A4.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-2xl mb-3">🎁</p>
              <h3 className="font-semibold text-slate-900 mb-2">Cadeau de naissance idéal</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Grands-parents, marraines, parrains — offrez un bel objet souvenir plutôt qu&apos;un 10e body. Ça laisse une trace.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-2xl mb-3">💛</p>
              <h3 className="font-semibold text-slate-900 mb-2">Transmission familiale</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Un album qu&apos;il feuillettera plus tard avec vous. Bien mieux qu&apos;un dossier oublié au fond d&apos;un disque dur.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl text-center text-slate-900 mb-10">Que mettre dans un album de naissance ?</h2>
          <div className="space-y-6">
            <div className="flex gap-5">
              <span className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white font-semibold">1</span>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">La grossesse & l&apos;attente</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Une ou deux pages pour poser le contexte — photos de ventre, échographies, préparation de la chambre.</p>
              </div>
            </div>
            <div className="flex gap-5">
              <span className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white font-semibold">2</span>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">La naissance</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Premiers instants à la maternité, le peau-à-peau, la pesée, le bracelet. N&apos;oubliez pas de noter le prénom, la date et l&apos;heure sur la page.</p>
              </div>
            </div>
            <div className="flex gap-5">
              <span className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white font-semibold">3</span>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Les rencontres</h3>
                <p className="text-sm text-slate-600 leading-relaxed">L&apos;arrivée à la maison, la rencontre avec les grands-parents, les frères et sœurs, les amis. Ces premiers câlins ont une valeur énorme avec le temps.</p>
              </div>
            </div>
            <div className="flex gap-5">
              <span className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white font-semibold">4</span>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Les premiers mois</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Premier bain, premier sourire, première dent, premiers pas. Idéalement, 1 à 2 pages par mois pour garder un vrai récit chronologique.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#faf8f4] py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl text-center text-slate-900 mb-10">Questions fréquentes</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">À partir de quand puis-je faire l&apos;album ?</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Quand vous voulez ! Beaucoup de parents font un premier album au bout du 1er mois (&quot;Le premier mois de [prénom]&quot;), d&apos;autres attendent le 1er anniversaire. C&apos;est vous qui choisissez.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Je veux l&apos;offrir — puis-je le faire livrer directement chez les grands-parents ?</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Bien sûr. À la commande, indiquez simplement l&apos;adresse de livraison que vous souhaitez. C&apos;est un très beau cadeau de naissance.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Mes photos sont un peu sombres (maternité, nuit…). Ça va rendre ?</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Les photos en basse lumière des smartphones récents passent bien en général. Évitez juste celles qui sont vraiment floues ou très granuleuses.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Combien de pages pour couvrir la première année ?</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Pour 12 mois, comptez 36 à 48 pages (3-4 pages par mois). Vous pouvez commencer plus court (24 pages) et faire un 2e album pour la suite.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-4xl mb-4">Un souvenir qui reste</h2>
          <p className="text-slate-300 mb-8">Ça prend 15 minutes depuis votre canapé. Livré chez vous en une semaine.</p>
          <Link href="/create" className="inline-block rounded-full bg-white px-8 py-4 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition">Créer l&apos;album →</Link>
          <p className="mt-4 text-xs text-slate-400">Paiement sécurisé · Satisfait ou remboursé 14 jours</p>
        </div>
      </section>
    </main>
  );
}
