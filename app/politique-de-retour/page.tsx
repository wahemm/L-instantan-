import type { Metadata } from "next";
import Nav from "@/app/components/Nav";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de retour et remboursement",
  description: "Garantie Album Parfait : défaut, colis abîmé ou perdu, rendu différent de l'aperçu → réimprimé ou remboursé, au choix, pendant 30 jours. Rien à renvoyer.",
  alternates: { canonical: "/politique-de-retour" },
};

export default function PolitiqueRetourPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Nav />
      <article className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl text-slate-900 mb-2">Politique de retour et remboursement</h1>
        <p className="text-sm text-slate-400 mb-12">Dernière mise à jour : novembre 2026</p>

        <section className="mb-10 rounded-2xl bg-[#f8f7f4] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E0512E] mb-2">En résumé</p>
          <p className="text-sm leading-relaxed text-slate-700">
            Ton album a un défaut, arrive abîmé, se perd en route ou ne ressemble pas à l&apos;aperçu que tu as validé ?
            Tu as <strong>30 jours</strong> après réception pour nous écrire avec une photo. On le <strong>réimprime gratuitement</strong> ou on te <strong>rembourse intégralement</strong>, au choix. <strong>Rien à renvoyer.</strong>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">1. Garantie Album Parfait — 30 jours</h2>
          <p className="text-sm leading-relaxed text-slate-600 mb-3">Elle couvre :</p>
          <ul className="list-disc pl-6 text-sm leading-relaxed text-slate-600 space-y-2 mb-3">
            <li>Un <strong>défaut de fabrication</strong> : impression ratée ou décalée, couleurs nettement altérées, pages collées, déchirées ou manquantes, reliure qui se défait, couverture endommagée.</li>
            <li>Un album <strong>abîmé pendant le transport</strong>.</li>
            <li>Un colis <strong>perdu</strong> : s&apos;il n&apos;est pas arrivé 20 jours ouvrés après l&apos;expédition, on lance une enquête et, en attendant sa conclusion, on peut réimprimer ton album.</li>
            <li>Un album <strong>différent de l&apos;aperçu que tu as validé</strong> (photo manquante ou déplacée, texte modifié, mauvaise couverture…).</li>
          </ul>
          <p className="text-sm leading-relaxed text-slate-600">Tu choisis la solution :</p>
          <ul className="list-disc pl-6 text-sm leading-relaxed text-slate-600 space-y-2 mt-3">
            <li>une <strong>réimpression gratuite</strong>, livrée gratuitement à la même adresse, ou</li>
            <li>un <strong>remboursement intégral</strong> (album + livraison).</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">2. Comment faire</h2>
          <ol className="list-decimal pl-6 text-sm leading-relaxed text-slate-600 space-y-2">
            <li>Écris-nous à <a href="mailto:linstantane.officiel@gmail.com" className="underline hover:text-slate-900">linstantane.officiel@gmail.com</a> dans les 30 jours suivant la réception, avec ton nom, ton numéro de commande (dans l&apos;email de confirmation) et une ou deux photos du problème.</li>
            <li>On te répond sous 48 h ouvrées.</li>
            <li>Réimpression : ton nouvel album est fabriqué en priorité et expédié sous 7 à 12 jours ouvrés.</li>
            <li>Remboursement : le montant est recrédité sur ta carte sous 5 à 10 jours ouvrés.</li>
          </ol>
          <p className="text-sm leading-relaxed text-slate-600 mt-3">Pas besoin de nous renvoyer l&apos;album : garde-le ou recycle-le.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">3. Ce qui n&apos;est pas couvert</h2>
          <p className="text-sm leading-relaxed text-slate-600 mb-3">Chaque album est unique et fabriqué uniquement pour toi : il ne peut être ni revendu ni réutilisé. C&apos;est pourquoi ne sont pas couverts :</p>
          <ul className="list-disc pl-6 text-sm leading-relaxed text-slate-600 space-y-2">
            <li>Les éléments présents dans l&apos;aperçu que tu as validé : faute de frappe, photo choisie, cadrage, ordre des pages. <strong>Vérifie bien ton aperçu avant de payer.</strong></li>
            <li>Une photo floue ou pixelisée parce que le fichier importé était de trop basse résolution.</li>
            <li>Les légères différences de couleur entre un écran et le papier, inévitables en impression.</li>
            <li>Les dommages survenus après la réception (choc, humidité, usure).</li>
            <li>Un simple changement d&apos;avis.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">4. Droit de rétractation</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Conformément à l&apos;<strong>article L221-28 3° du Code de la consommation</strong>, le droit de rétractation de 14 jours ne s&apos;applique pas aux biens confectionnés selon les spécifications du consommateur ou nettement personnalisés, comme un album photo.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">5. Garanties légales</h2>
          <p className="text-sm leading-relaxed text-slate-600 mb-3">
            La Garantie Album Parfait s&apos;ajoute à tes droits légaux, sans les remplacer :
          </p>
          <ul className="list-disc pl-6 text-sm leading-relaxed text-slate-600 space-y-2">
            <li>la <strong>garantie légale de conformité</strong> (articles L217-3 et suivants du Code de la consommation), pendant 2 ans à compter de la livraison ;</li>
            <li>la <strong>garantie des vices cachés</strong> (articles 1641 et suivants du Code civil), pendant 2 ans à compter de leur découverte.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">6. Litige</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Écris-nous d&apos;abord : on trouve presque toujours une solution. En cas de désaccord persistant, tu peux recourir gratuitement à un médiateur de la consommation.
          </p>
        </section>

        <div className="mt-14 flex items-center justify-between text-sm">
          <Link href="/cgv" className="text-slate-500 hover:text-slate-900 transition">← CGV complètes</Link>
          <Link href="/" className="text-slate-500 hover:text-slate-900 transition">Retour à l&apos;accueil</Link>
        </div>
      </article>
    </main>
  );
}
