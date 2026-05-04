import type { Metadata } from "next";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente",
  description: "Conditions générales de vente de L'Instantané — album photo premium livré en France et Europe.",
  alternates: { canonical: "/cgv" },
};

export default function CgvPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Nav />
      <article className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 mb-2">Conditions Générales de Vente</h1>
        <p className="text-sm text-slate-400 mb-12">Dernière mise à jour : mars 2026</p>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">1. Objet</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Les présentes conditions régissent les ventes d&apos;albums photo imprimés réalisées par L&apos;Instantané à ses clients via le site linstantane.fr.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">2. Produit</h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-3">
            <p><strong>Album imprimé</strong> — Livre photo au format A4 (21 × 28 cm), papier photo brillant 170 g/m², couverture rigide personnalisée.</p>
            <p>Les albums comportent au minimum 24 pages. Des pages supplémentaires peuvent être ajoutées et sont facturées selon le tarif en vigueur.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">3. Prix</h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2">
            <p>Les prix sont indiqués en euros TTC. L&apos;Instantané se réserve le droit de modifier ses tarifs à tout moment, sans que cela affecte les commandes en cours.</p>
            <p>Tarif indicatif : 29 € pour un album de 24 pages, 0,50 € par page supplémentaire. Frais de port calculés au moment du paiement selon la destination.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">4. Commande et paiement</h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-3">
            <p>La commande est définitive dès validation du paiement. Le paiement est sécurisé et traité par Stripe (carte bancaire, Apple Pay, Google Pay).</p>
            <p>Une fois la commande confirmée, il n&apos;est plus possible de modifier l&apos;album. Vérifiez attentivement votre aperçu avant de valider.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">5. Livraison</h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2">
            <p>Les commandes sont expédiées en France métropolitaine uniquement. Délai de fabrication et livraison : 5 à 7 jours ouvrés à compter de la confirmation du paiement.</p>
            <p>Les frais de port sont indiqués au moment du paiement en fonction de la destination.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">6. Droit de rétractation et retours</h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-3">
            <p>Conformément à l&apos;article L221-28 du Code de la consommation, le droit de rétractation ne s&apos;applique pas aux produits fabriqués selon les spécifications du consommateur (albums personnalisés).</p>
            <p>Cependant, L&apos;Instantané garantit la satisfaction de ses clients. Si l&apos;album reçu présente un défaut de fabrication ou ne correspond pas à l&apos;aperçu validé, nous vous proposerons soit un remplacement, soit un remboursement intégral, dans un délai de 14 jours après réception.</p>
            <p>Pour toute réclamation : linstantane.officiel@gmail.com</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">7. Responsabilité</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Le client est seul responsable du contenu des photos téléchargées (droits d&apos;auteur, droit à l&apos;image). L&apos;Instantané ne peut être tenu responsable d&apos;un usage illicite des images soumises.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">8. Loi applicable</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Les présentes CGV sont soumises au droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux français seront compétents.
          </p>
        </section>

        <div className="mt-12 border-t border-gray-100 pt-8 flex gap-6 text-sm">
          <Link href="/mentions-legales" className="text-slate-500 hover:text-slate-900 transition">Mentions légales →</Link>
          <Link href="/" className="text-slate-500 hover:text-slate-900 transition">Retour à l&apos;accueil</Link>
        </div>
      </article>

      <Footer />
    </main>
  );
}
