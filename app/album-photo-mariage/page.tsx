import type { Metadata } from "next";
import Nav from "@/app/components/Nav";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Album photo mariage premium — L'Instantané",
  description: "Crée l'album photo mariage de vos rêves. Format A4, papier brillant, couverture rigide. Livré en 5-7 jours. Idéal cadeau pour les témoins.",
  alternates: { canonical: "/album-photo-mariage" },
  openGraph: {
    title: "Album photo mariage premium",
    description: "Un bel album pour immortaliser le plus beau jour de votre vie.",
    images: ["/covers/amor.png"],
  },
};

export default function AlbumPhotoMariagePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Nav />

      <section className="mx-auto max-w-5xl px-6 pt-16 pb-12 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Le plus beau jour de votre vie</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-5xl text-slate-900 leading-tight">
          L&apos;album photo mariage,<br/>fait pour durer.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-slate-500 leading-relaxed">
          Un beau livre à feuilleter dans 20 ans, à montrer à vos enfants, à offrir à vos témoins. Sélectionnez vos plus belles photos, choisissez une couverture élégante, et recevez votre album chez vous en 5 à 7 jours.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/create" className="rounded-full bg-slate-900 px-8 py-4 text-sm font-semibold text-white hover:bg-slate-700 transition">Créer notre album mariage →</Link>
          <Link href="/shop" className="rounded-full border border-slate-300 px-8 py-4 text-sm font-semibold text-slate-900 hover:border-slate-900 transition">Voir les couvertures</Link>
        </div>
        <p className="mt-4 text-xs text-slate-400">À partir de 29€ · Livraison offerte · Satisfait ou remboursé 14j</p>
      </section>

      <section className="bg-[#faf8f4] py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl text-center text-slate-900 mb-10">Un album à la hauteur de ce jour</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-2xl mb-3">💎</p>
              <h3 className="font-semibold text-slate-900 mb-2">Finition premium</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Papier photo brillant 170 g/m², couverture rigide personnalisée. Un livre qui a du poids dans la main, fait pour être transmis.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-2xl mb-3">👰</p>
              <h3 className="font-semibold text-slate-900 mb-2">Couvertures élégantes</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Des designs sobres et chic adaptés au mariage, ou une photo plein cadre de vous deux en couverture.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-2xl mb-3">💝</p>
              <h3 className="font-semibold text-slate-900 mb-2">Idéal pour les témoins</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Commandez plusieurs exemplaires — un pour vous, un pour chaque famille, un pour les témoins. Un cadeau plein de sens à un prix accessible.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-2xl mb-3">✍️</p>
              <h3 className="font-semibold text-slate-900 mb-2">Textes et légendes</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Ajoutez vos dates, le nom de vos témoins, une citation qui vous tient à cœur. Le texte se pose librement sur chaque page.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl text-center text-slate-900 mb-10">Structure idéale d&apos;un album mariage</h2>
          <div className="space-y-6">
            <div className="flex gap-5">
              <span className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white font-semibold">1</span>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Les préparatifs (4-6 pages)</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Le matin, la robe, les témoins, les détails — alliances, bouquet, chaussures. Ces photos racontent l&apos;attente.</p>
              </div>
            </div>
            <div className="flex gap-5">
              <span className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white font-semibold">2</span>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">La cérémonie (6-8 pages)</h3>
                <p className="text-sm text-slate-600 leading-relaxed">L&apos;arrivée, les vœux, l&apos;échange des alliances, la sortie sous les pétales. Grandes photos en pleine page pour ces instants forts.</p>
              </div>
            </div>
            <div className="flex gap-5">
              <span className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white font-semibold">3</span>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Portraits & famille (4-6 pages)</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Les photos posées avec vos proches. Grille de 4 photos pour grouper les familles, grande photo seuls pour vous deux.</p>
              </div>
            </div>
            <div className="flex gap-5">
              <span className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white font-semibold">4</span>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">La fête (6-8 pages)</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Le vin d&apos;honneur, le dîner, les discours, la première danse, le gâteau. Beaucoup d&apos;émotion à capturer — n&apos;hésitez pas à alterner portraits et ambiance.</p>
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
              <h3 className="font-semibold text-slate-900 mb-2">Combien de pages pour un album mariage ?</h3>
              <p className="text-sm text-slate-600 leading-relaxed">L&apos;album de base fait 24 pages. Pour un mariage, nous recommandons entre 40 et 60 pages. Des pages supplémentaires peuvent être ajoutées à la création.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Mon photographe m&apos;a livré ses photos au format RAW/TIFF. Est-ce compatible ?</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Notre outil accepte les formats JPEG et PNG. Si vos photos sont en RAW, demandez à votre photographe des exports JPEG haute qualité (ça ne change rien à la qualité d&apos;impression).</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Pouvez-vous mettre en page à ma place ?</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Notre éditeur est conçu pour être simple — en moyenne, les mariés mettent 30 minutes à créer leur album. Contactez-nous si vous voulez un service de mise en page sur-mesure.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Commande groupée pour offrir aux témoins ?</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Oui, c&apos;est possible. Contactez-nous par email pour bénéficier d&apos;un tarif dégressif sur plusieurs exemplaires identiques.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-4xl mb-4">Un souvenir qui traverse les années</h2>
          <p className="text-slate-300 mb-8">Ça prend 30 minutes. Livré chez vous en une semaine.</p>
          <Link href="/create" className="inline-block rounded-full bg-white px-8 py-4 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition">Créer notre album →</Link>
          <p className="mt-4 text-xs text-slate-400">Paiement sécurisé · Satisfait ou remboursé 14 jours</p>
        </div>
      </section>
    </main>
  );
}
