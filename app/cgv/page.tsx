import Nav from "@/app/components/Nav";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Conditions Générales de Vente" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-3">{title}</h2>
      <div className="text-sm text-slate-600 leading-relaxed space-y-2">{children}</div>
    </section>
  );
}

export default function CGVPage() {
  return (
    <main className="min-h-screen bg-white">
      <Nav />
      <div className="mx-auto max-w-2xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Légal</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 mb-2">Conditions Générales de Vente</h1>
        <p className="text-xs text-slate-400 mb-10">Dernière mise à jour : avril 2026</p>

        <Section title="1. Identité du vendeur">
          <p>L&apos;Instantané est une entreprise proposant des services de création et d&apos;impression d&apos;albums photo personnalisés.</p>
          <p>Contact : <a href="mailto:bonjour@linstantane.fr" className="underline">bonjour@linstantane.fr</a></p>
        </Section>

        <Section title="2. Produits et services">
          <p>L&apos;Instantané propose la création d&apos;albums photo personnalisés imprimés sur papier brillant 170g/m², format A4, reliés.</p>
          <p>Les prix affichés sont en euros TTC. Le prix de base est de 29 € pour un album jusqu&apos;à 24 pages. Chaque page supplémentaire est facturée 0,50 €.</p>
          <p>La livraison en France métropolitaine est incluse dans le prix.</p>
        </Section>

        <Section title="3. Commande">
          <p>La commande est validée après confirmation du paiement via Stripe. Un email de confirmation est envoyé à l&apos;adresse fournie lors du paiement.</p>
          <p>L&apos;Instantané se réserve le droit d&apos;annuler toute commande en cas de problème technique ou de contenu illicite.</p>
        </Section>

        <Section title="4. Paiement">
          <p>Le paiement est sécurisé via Stripe. Les données bancaires ne sont jamais stockées par L&apos;Instantané.</p>
          <p>Les moyens de paiement acceptés sont : carte bancaire (Visa, Mastercard, American Express) et Apple Pay / Google Pay selon disponibilité.</p>
        </Section>

        <Section title="5. Livraison">
          <p>Les albums sont produits et expédiés sous 5 à 7 jours ouvrés après validation de la commande.</p>
          <p>La livraison est effectuée en France métropolitaine. Pour toute livraison hors France, contactez-nous.</p>
        </Section>

        <Section title="6. Droit de rétractation">
          <p>Conformément à l&apos;article L221-28 du Code de la consommation, le droit de rétractation ne s&apos;applique pas aux biens confectionnés selon les spécifications du consommateur (albums photo sur-mesure).</p>
          <p>En cas de défaut de fabrication avéré, L&apos;Instantané s&apos;engage à refabriquer ou rembourser l&apos;album dans un délai de 14 jours.</p>
        </Section>

        <Section title="7. Réclamations">
          <p>En cas de problème (défaut d&apos;impression, colis endommagé), contactez-nous dans les 14 jours suivant la livraison à <a href="mailto:bonjour@linstantane.fr" className="underline">bonjour@linstantane.fr</a>.</p>
        </Section>

        <Section title="8. Propriété intellectuelle">
          <p>Le client garantit être propriétaire des droits sur les photos téléchargées. L&apos;Instantané n&apos;utilise pas les photos à des fins commerciales sans consentement explicite.</p>
        </Section>

        <Section title="9. Protection des données">
          <p>Les données personnelles sont utilisées uniquement pour le traitement des commandes. Voir notre <a href="/politique-confidentialite" className="underline">Politique de confidentialité</a>.</p>
        </Section>

        <Section title="10. Droit applicable">
          <p>Les présentes CGV sont soumises au droit français. En cas de litige, les tribunaux français sont compétents.</p>
        </Section>
      </div>
    </main>
  );
}
