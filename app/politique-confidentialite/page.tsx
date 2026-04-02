import Nav from "@/app/components/Nav";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Politique de confidentialité" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-3">{title}</h2>
      <div className="text-sm text-slate-600 leading-relaxed space-y-2">{children}</div>
    </section>
  );
}

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="min-h-screen bg-white">
      <Nav />
      <div className="mx-auto max-w-2xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Légal</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 mb-2">Politique de confidentialité</h1>
        <p className="text-xs text-slate-400 mb-10">Dernière mise à jour : avril 2026</p>

        <Section title="1. Responsable du traitement">
          <p>L&apos;Instantané — contact : <a href="mailto:bonjour@linstantane.fr" className="underline">bonjour@linstantane.fr</a></p>
        </Section>

        <Section title="2. Données collectées">
          <p>Nous collectons les données suivantes :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Adresse email (lors de la création de compte ou du paiement)</li>
            <li>Nom et prénom (lors du paiement)</li>
            <li>Adresse de livraison (lors du paiement)</li>
            <li>Photos téléchargées pour la création d&apos;albums (traitées localement, non stockées sur nos serveurs)</li>
          </ul>
        </Section>

        <Section title="3. Utilisation des données">
          <p>Vos données sont utilisées pour :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Traiter et livrer vos commandes</li>
            <li>Envoyer des confirmations de commande</li>
            <li>Gérer votre compte client</li>
            <li>Améliorer nos services</li>
          </ul>
        </Section>

        <Section title="4. Partage des données">
          <p>Vos données sont partagées uniquement avec :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Stripe</strong> — traitement sécurisé du paiement</li>
            <li><strong>Clerk</strong> — gestion de l&apos;authentification</li>
            <li>Notre prestataire d&apos;impression (nom et adresse uniquement, pour la livraison)</li>
          </ul>
          <p>Nous ne vendons jamais vos données à des tiers.</p>
        </Section>

        <Section title="5. Durée de conservation">
          <p>Vos données sont conservées pendant la durée de votre compte, plus 3 ans à des fins légales (obligations comptables).</p>
        </Section>

        <Section title="6. Vos droits (RGPD)">
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Droit d&apos;accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l&apos;effacement (&quot;droit à l&apos;oubli&quot;)</li>
            <li>Droit à la portabilité</li>
            <li>Droit d&apos;opposition</li>
          </ul>
          <p>Pour exercer ces droits, contactez-nous à <a href="mailto:bonjour@linstantane.fr" className="underline">bonjour@linstantane.fr</a>.</p>
        </Section>

        <Section title="7. Cookies">
          <p>Nous utilisons des cookies techniques essentiels au fonctionnement du site (session, authentification). Aucun cookie publicitaire n&apos;est utilisé.</p>
        </Section>

        <Section title="8. Sécurité">
          <p>Vos données sont transmises via HTTPS. Les paiements sont gérés par Stripe (certifié PCI-DSS). Vos photos restent sur votre appareil et ne transitent pas par nos serveurs.</p>
        </Section>

        <Section title="9. Contact">
          <p>Pour toute question relative à vos données : <a href="mailto:bonjour@linstantane.fr" className="underline">bonjour@linstantane.fr</a></p>
        </Section>
      </div>
    </main>
  );
}
