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
        <p className="text-sm text-slate-400 mb-12">Dernière mise à jour : novembre 2026</p>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">1. Objet</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Les présentes conditions régissent les ventes d&apos;albums photo imprimés réalisées par L&apos;Instantané à ses clients via le site linstantane.fr.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">2. Produit</h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-3">
            <p><strong>Album imprimé</strong> — Livre photo au format A4 (21 × 28 cm), papier photo satiné 170 g/m², couverture rigide personnalisée.</p>
            <p>Les albums comportent au minimum 32 pages. Des pages supplémentaires peuvent être ajoutées et sont facturées selon le tarif en vigueur.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">3. Prix</h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2">
            <p>Les prix sont indiqués en euros TTC. L&apos;Instantané se réserve le droit de modifier ses tarifs à tout moment, sans que cela affecte les commandes en cours.</p>
            <p>Tarif : 44 € pour un album de 32 pages, 0,50 € par page supplémentaire. Livraison offerte en France métropolitaine, Belgique, Suisse et Luxembourg ; pour Monaco, un supplément de livraison est indiqué avant le paiement.</p>
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
            <p>Les commandes sont expédiées en France métropolitaine, en Belgique, en Suisse, au Luxembourg et à Monaco. L&apos;adresse de livraison doit se trouver dans le pays choisi au moment de la commande. Délai de fabrication et livraison : 7 à 12 jours ouvrés à compter de la confirmation du paiement.</p>
            <p>La livraison est offerte en France métropolitaine, Belgique, Suisse et Luxembourg. Pour Monaco, le supplément de livraison est indiqué avant le paiement.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">6. Rétractation, garanties et retours</h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-3">
            <p>Conformément à l&apos;article L221-28 3° du Code de la consommation, le droit de rétractation ne s&apos;applique pas aux produits fabriqués selon les spécifications du consommateur ou nettement personnalisés (albums photo).</p>
            <p><strong>Garantie commerciale « Album Parfait »</strong> : si l&apos;album reçu présente un défaut de fabrication, a été endommagé pendant le transport, n&apos;a pas été livré, ou ne correspond pas à l&apos;aperçu validé lors de la commande, le client peut, dans les 30 jours suivant la réception (ou la date de livraison prévue en cas de perte), obtenir au choix une réimpression gratuite livrée sans frais ou le remboursement intégral de la commande (produit et livraison), sur simple envoi d&apos;une photo du problème. Le retour de l&apos;album n&apos;est pas demandé. Ne sont pas couverts : les éléments figurant dans l&apos;aperçu validé, la faible résolution des fichiers fournis par le client, les légers écarts de couleur entre écran et papier, les dommages postérieurs à la réception et le changement d&apos;avis. Détails : <a href="/politique-de-retour" className="underline hover:text-slate-900">politique de retour</a>.</p>
            <p><strong>Garanties légales</strong> : indépendamment de cette garantie commerciale, le client bénéficie de la garantie légale de conformité (articles L217-3 à L217-20 du Code de la consommation), pendant 2 ans à compter de la livraison, et de la garantie des vices cachés (articles 1641 à 1649 du Code civil).</p>
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
