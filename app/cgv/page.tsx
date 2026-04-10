import type { Metadata } from "next";
import Nav from "@/app/components/Nav";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente",
  description: "Conditions générales de vente de L'Instantané — album photo premium livré en France et Europe.",
  robots: { index: false, follow: false },
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
            Les présentes conditions régissent les ventes de produits (albums photo imprimés et fichiers numériques) réalisées par L&apos;Instantané à ses clients via le site linstantane.fr.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">2. Produits</h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-3">
            <p><strong>Pack Digital</strong> — Fichier PDF haute résolution de l&apos;album, disponible en téléchargement immédiat après confirmation du paiement.</p>
            <p><strong>Pack Physique</strong> — Album imprimé au format A4 (21 × 28 cm), papier photo brillant 170 g/m², couverture rigide personnalisée.</p>
            <p><strong>Pack Duo</strong> — Combinaison du Pack Digital et du Pack Physique.</p>
            <p>Les albums comportent au minimum 24 pages. Des pages supplémentaires peuvent être facturées selon le tarif en vigueur.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">3. Prix</h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2">
            <p>Les prix sont indiqués en euros TTC. L&apos;Instantané se réserve le droit de modifier ses tarifs à tout moment, sans que cela affecte les commandes en cours.</p>
            <p>Tarifs indicatifs : Digital 10 €, Physique à partir de 29 €, Duo à partir de 35 €.</p>
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
            <p>La livraison est offerte pour toutes les commandes incluant un album physique.</p>
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

      <footer className="border-t border-gray-100 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-400 sm:flex-row">
          <span className="font-[family-name:var(--font-playfair)] text-slate-900">L&apos;Instantané</span>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/mentions-legales" className="transition hover:text-slate-700">Mentions légales</Link>
            <Link href="/cgv" className="transition hover:text-slate-700">CGV</Link>
            <Link href="/faq" className="transition hover:text-slate-700">FAQ</Link>
          </div>
          <span>© 2026 L&apos;Instantané</span>
        </div>
      </footer>
    </main>
  );
}
