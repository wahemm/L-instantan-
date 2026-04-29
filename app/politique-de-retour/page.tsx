import type { Metadata } from "next";
import Nav from "@/app/components/Nav";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de retour et remboursement",
  description: "Politique de retour et remboursement L'Instantané — 14 jours satisfait ou remboursé en cas de défaut de fabrication. Retour gratuit.",
};

export default function PolitiqueRetourPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Nav />
      <article className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl text-slate-900 mb-2">Politique de retour et remboursement</h1>
        <p className="text-sm text-slate-400 mb-12">Dernière mise à jour : avril 2026</p>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">1. Nos produits sont personnalisés</h2>
          <p className="text-sm leading-relaxed text-slate-600 mb-3">
            Chaque album L&apos;Instantané est <strong>fabriqué sur-mesure</strong> à partir des photos et du design que tu as validés avant paiement.
            Conformément à l&apos;<strong>article L221-28 3° du Code de la consommation</strong>, les biens confectionnés selon les spécifications du consommateur ou nettement personnalisés ne sont pas soumis au droit de rétractation de 14 jours.
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            Cela dit, on garantit ta satisfaction. Lis ce qui suit.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">2. Garantie "Satisfait ou remboursé" — 14 jours</h2>
          <p className="text-sm leading-relaxed text-slate-600 mb-3">
            Si ton album présente <strong>un défaut de fabrication</strong> (impression abîmée, pages collées, couverture endommagée, page manquante…) ou s&apos;il <strong>ne correspond pas à l&apos;aperçu que tu as validé</strong>, on te propose :
          </p>
          <ul className="list-disc pl-6 text-sm leading-relaxed text-slate-600 space-y-2 mb-3">
            <li>Un <strong>remplacement gratuit</strong> de l&apos;album, ou</li>
            <li>Un <strong>remboursement intégral</strong> de ta commande (produit + livraison).</li>
          </ul>
          <p className="text-sm leading-relaxed text-slate-600">
            Tu dois nous contacter dans les <strong>14 jours</strong> suivant la réception du colis, à{" "}
            <a href="mailto:linstantane.officiel@gmail.com" className="underline hover:text-slate-900">linstantane.officiel@gmail.com</a>,
            en joignant une photo claire du défaut.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">3. Procédure</h2>
          <ol className="list-decimal pl-6 text-sm leading-relaxed text-slate-600 space-y-2">
            <li>Envoie un email à <a href="mailto:linstantane.officiel@gmail.com" className="underline hover:text-slate-900">linstantane.officiel@gmail.com</a> avec : ton nom, numéro de commande et photos du défaut.</li>
            <li>On te répond sous 24-48h avec la solution retenue (remplacement ou remboursement).</li>
            <li>Si remplacement : un nouvel album est fabriqué et expédié gratuitement, sous 5 à 7 jours ouvrés.</li>
            <li>Si remboursement : le montant est recrédité sur ta carte bancaire sous 5 à 10 jours ouvrés après validation.</li>
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">4. Frais de retour</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Si on te demande de retourner l&apos;album défectueux, <strong>les frais de retour sont à notre charge</strong>. Une étiquette pré-payée te sera envoyée par email.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">5. Ce qui n&apos;est pas couvert</h2>
          <ul className="list-disc pl-6 text-sm leading-relaxed text-slate-600 space-y-2">
            <li>Erreurs présentes dans l&apos;aperçu que tu as validé (fautes de frappe, mauvaise photo, cadrage incorrect…). <strong>Vérifie bien ton aperçu avant de payer.</strong></li>
            <li>Photos de mauvaise qualité que tu as toi-même importées (photos floues, pixelisées, trop petites).</li>
            <li>Dommages causés après réception (choc, humidité, usure normale).</li>
            <li>Changement d&apos;avis (un album personnalisé ne peut être ni revendu ni réutilisé).</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">6. Litige</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            En cas de désaccord persistant, tu peux saisir gratuitement le médiateur de la consommation via la plateforme européenne de règlement en ligne des litiges : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-900">ec.europa.eu/consumers/odr</a>.
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
