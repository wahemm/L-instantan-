import type { Metadata } from "next";
import Nav from "@/app/components/Nav";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions Légales",
  description: "Mentions légales de L'Instantané.",
  robots: { index: false, follow: false },
};

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Nav />
      <article className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 mb-2">Mentions légales</h1>
        <p className="text-sm text-slate-400 mb-12">Dernière mise à jour : mars 2026</p>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">Éditeur du site</h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-1">
            <p><strong>L&apos;Instantané</strong></p>
            <p>Entreprise individuelle / auto-entrepreneur</p>
            <p>Siège social : France</p>
            <p>Email : linstantane.officiel@gmail.com</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">Hébergement</h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-1">
            <p><strong>Vercel Inc.</strong></p>
            <p>340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</p>
            <p>Site : vercel.com</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">Propriété intellectuelle</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            L&apos;ensemble du contenu de ce site (textes, images, graphismes, logo) est la propriété exclusive de L&apos;Instantané, sauf mention contraire. Toute reproduction, même partielle, est interdite sans autorisation préalable.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">Données personnelles</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Les données collectées lors de la commande (nom, adresse, email) sont utilisées uniquement pour le traitement et la livraison de votre commande. Elles ne sont pas transmises à des tiers à des fins commerciales. Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données en nous contactant à linstantane.officiel@gmail.com.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">Cookies</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Ce site utilise des cookies techniques nécessaires à son fonctionnement (authentification, panier). Aucun cookie publicitaire ou de tracking n&apos;est utilisé sans votre consentement.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">Paiement</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Les paiements sont traités de manière sécurisée par <strong>Stripe Inc.</strong> L&apos;Instantané ne stocke aucune donnée bancaire. Stripe est certifié PCI-DSS niveau 1.
          </p>
        </section>

        <div className="mt-12 border-t border-gray-100 pt-8 flex gap-6 text-sm">
          <Link href="/cgv" className="text-slate-500 hover:text-slate-900 transition">Conditions générales de vente →</Link>
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
