import type { Metadata } from "next";
import Nav from "@/app/components/Nav";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Album photo voyage personnalisé — L'Instantané",
  description: "Crée ton album photo voyage sur-mesure. Couvertures Italie, Japon, Mexique, Grèce, Maroc… Imprimé en France, livré en 5-7 jours. À partir de 29€.",
  alternates: { canonical: "/album-photo-voyage" },
  openGraph: {
    title: "Album photo voyage personnalisé",
    description: "L'album photo de tes plus beaux voyages, imprimé avec soin. Plus de 30 couvertures de destinations.",
    images: ["/covers/Italie.png"],
  },
};

const DESTINATIONS = [
  { name: "Italie", src: "/covers/Italie.png" },
  { name: "Japon", src: "/covers/japon2.png" },
  { name: "Mexique", src: "/covers/mexique1.png" },
  { name: "Marrakech", src: "/covers/Marrakech.png" },
  { name: "Bali", src: "/covers/bali 1.png" },
  { name: "Grèce", src: "/covers/Grece1.png" },
  { name: "Espagne", src: "/covers/Espagne.png" },
  { name: "Provence", src: "/covers/Provence.png" },
];

const FAQ_ITEMS = [
  { q: "Combien de photos maximum dans un album voyage ?", a: "L'album de base fait 24 pages. Tu peux ajouter des pages supplémentaires facturées à l'unité. Pour un voyage d'une semaine, 24 à 40 pages est un bon compromis." },
  { q: "Mes photos viennent de mon téléphone, est-ce que ça rendra bien ?", a: "Oui, la plupart des smartphones récents prennent des photos suffisamment résolues pour un tirage A4. Évite juste les photos fortement zoomées ou prises en très basse lumière." },
  { q: "Je n'ai pas trouvé ma destination dans les couvertures.", a: "De nouvelles illustrations arrivent chaque mois. En attendant, tu peux choisir une couverture sans thème et ajouter ton propre titre (ex: Portugal 2025)." },
  { q: "Puis-je commander plusieurs exemplaires du même album ?", a: "Oui — pratique pour offrir à la famille ou aux amis avec qui tu es parti. Contacte-nous pour les tarifs volume." },
];

export default function AlbumPhotoVoyagePage() {
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
      { "@type": "ListItem", position: 2, name: "Album photo voyage", item: "https://linstantane.fr/album-photo-voyage" },
    ],
  };
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Nav />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-12 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Spécialité voyage</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-5xl text-slate-900 leading-tight">
          Ton album photo voyage,<br/>imprimé avec soin.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-slate-500 leading-relaxed">
          Tes souvenirs de vacances méritent mieux que ton téléphone. Crée en quelques minutes un beau livre photo personnalisé, avec une couverture illustrée à l&apos;image de ta destination.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/create" className="rounded-full bg-slate-900 px-8 py-4 text-sm font-semibold text-white hover:bg-slate-700 transition">Créer mon album de voyage →</Link>
          <Link href="/shop" className="rounded-full border border-slate-300 px-8 py-4 text-sm font-semibold text-slate-900 hover:border-slate-900 transition">Voir les couvertures</Link>
        </div>
        <p className="mt-4 text-xs text-slate-400">À partir de 29€ · Livraison offerte · Satisfait ou remboursé 14j</p>
      </section>

      {/* Destinations grid */}
      <section className="bg-[#faf8f4] py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl text-center text-slate-900 mb-2">Une couverture pour chaque destination</h2>
          <p className="text-center text-sm text-slate-500 mb-10 max-w-xl mx-auto">Plus de 30 illustrations exclusives. Italie, Japon, Mexique, Bali, Grèce, Marrakech… et bien d&apos;autres.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {DESTINATIONS.map(d => (
              <div key={d.name} className="overflow-hidden rounded-2xl shadow-md bg-white">
                <Image src={d.src} alt={`Album photo ${d.name}`} width={400} height={280} className="w-full h-auto" />
                <p className="text-center py-2 text-xs font-semibold text-slate-700">{d.name}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/shop" className="text-sm text-slate-600 underline hover:text-slate-900">Voir toutes les destinations →</Link>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl text-center text-slate-900 mb-10">Pourquoi choisir L&apos;Instantané pour ton album voyage</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-6">
              <p className="text-2xl mb-3">🎨</p>
              <h3 className="font-semibold text-slate-900 mb-2">Des couvertures uniques par destination</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Contrairement aux albums génériques, nos couvertures sont illustrées pour coller à l&apos;esprit de ta destination — citron pour l&apos;Italie, cerisier pour le Japon, cactus pour le Mexique.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6">
              <p className="text-2xl mb-3">✨</p>
              <h3 className="font-semibold text-slate-900 mb-2">Papier photo brillant 170g/m²</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Rendu couleur fidèle à ce que tu vois sur ton écran. Les paysages, couchers de soleil et plats locaux ressortent magnifiquement.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6">
              <p className="text-2xl mb-3">📖</p>
              <h3 className="font-semibold text-slate-900 mb-2">Format A4 qui tient bien en main</h3>
              <p className="text-sm text-slate-600 leading-relaxed">21×28 cm, couverture rigide. Assez grand pour valoriser tes photos, assez compact pour aller sur une étagère ou offrir facilement.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6">
              <p className="text-2xl mb-3">🚚</p>
              <h3 className="font-semibold text-slate-900 mb-2">Livré chez toi en 5-7 jours</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Impression à la demande, livraison offerte en France, Belgique, Suisse, Luxembourg et Monaco. Pas de stock, zéro gaspillage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="bg-[#faf8f4] py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl text-center text-slate-900 mb-10">3 conseils pour un bel album voyage</h2>
          <div className="space-y-6">
            <div className="flex gap-5">
              <span className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white font-semibold">1</span>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Trie avant de commencer</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Mieux vaut 40 belles photos que 200 moyennes. Fais le tri par journée, garde les moments forts : paysages, rencontres, plats, détails.</p>
              </div>
            </div>
            <div className="flex gap-5">
              <span className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white font-semibold">2</span>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Alterne les formats</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Une grande photo pleine page pour un paysage marquant, puis une grille de 4 photos pour les détails d&apos;une même journée. Ça donne du rythme au livre.</p>
              </div>
            </div>
            <div className="flex gap-5">
              <span className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white font-semibold">3</span>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Ajoute quelques légendes courtes</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Le nom d&apos;un lieu, une date, une anecdote en 5 mots. Pas besoin de long texte — ce sont tes photos qui racontent l&apos;histoire.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl text-center text-slate-900 mb-10">Questions fréquentes</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Combien de photos maximum dans un album voyage ?</h3>
              <p className="text-sm text-slate-600 leading-relaxed">L&apos;album de base fait 24 pages. Tu peux ajouter des pages supplémentaires facturées à l&apos;unité. Pour un voyage d&apos;une semaine, 24 à 40 pages est un bon compromis.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Mes photos viennent de mon téléphone, est-ce que ça rendra bien ?</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Oui, la plupart des smartphones récents prennent des photos suffisamment résolues pour un tirage A4. Évite juste les photos fortement zoomées ou prises en très basse lumière.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Je n&apos;ai pas trouvé ma destination dans les couvertures.</h3>
              <p className="text-sm text-slate-600 leading-relaxed">De nouvelles illustrations arrivent chaque mois. En attendant, tu peux choisir une couverture sans thème et ajouter ton propre titre (ex: &quot;Portugal 2025&quot;).</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Puis-je commander plusieurs exemplaires du même album ?</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Oui — pratique pour offrir à la famille ou aux amis avec qui tu es parti. Contacte-nous pour les tarifs volume.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-slate-900 text-white py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-4xl mb-4">Prêt à immortaliser ton voyage ?</h2>
          <p className="text-slate-300 mb-8">Ça prend 10 minutes. Livré chez toi en une semaine.</p>
          <Link href="/create" className="inline-block rounded-full bg-white px-8 py-4 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition">Créer mon album →</Link>
          <p className="mt-4 text-xs text-slate-400">Paiement sécurisé · Satisfait ou remboursé 14 jours</p>
        </div>
      </section>
    </main>
  );
}
