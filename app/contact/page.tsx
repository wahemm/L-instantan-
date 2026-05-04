import type { Metadata } from "next";
import Nav from "@/app/components/Nav";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact & SAV",
  description: "Contacte L'Instantané par email ou Instagram. Une équipe réactive pour toute question sur ta commande d'album photo premium.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Nav />
      <article className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl text-slate-900 mb-4">Contact & SAV</h1>
        <p className="text-sm text-slate-500 mb-12">Une question sur ta commande, ton album, ou autre chose ? On est là.</p>

        <section className="mb-10 rounded-2xl border border-slate-200 bg-[#faf8f4] p-6 sm:p-8">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-3">📧 Email</h2>
          <p className="text-sm text-slate-600 mb-3">Le moyen le plus rapide pour nous joindre. Réponse sous <strong>24 à 48h</strong> en semaine.</p>
          <a href="mailto:linstantane.officiel@gmail.com" className="inline-block rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition">
            linstantane.officiel@gmail.com
          </a>
        </section>

        <section className="mb-10 rounded-2xl border border-slate-200 bg-[#faf8f4] p-6 sm:p-8">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-3">📷 Instagram</h2>
          <p className="text-sm text-slate-600 mb-3">Envoie-nous un DM sur Instagram, on répond aussi depuis là.</p>
          <a href="https://instagram.com/linstantane_souvenir" target="_blank" rel="noopener noreferrer" className="inline-block rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 hover:border-slate-900 transition">
            @linstantane_souvenir
          </a>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">Questions fréquentes</h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-4">
            <div>
              <p className="font-semibold text-slate-900">Je n&apos;ai pas reçu mon email de confirmation ?</p>
              <p>Vérifie tes spams. Si toujours rien, écris-nous avec ton nom complet et on retrouve ta commande.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Je veux modifier mon album après commande.</p>
              <p>Une fois la commande validée, l&apos;impression est lancée sous 24h. Si tu nous contactes très rapidement, on peut essayer d&apos;intervenir — sans garantie.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Mon colis est en retard.</p>
              <p>Les délais sont de 5 à 7 jours ouvrés. Au-delà, <Link href="/livraison" className="underline hover:text-slate-900">consulte notre politique de livraison</Link> ou écris-nous.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Mon album a un défaut.</p>
              <p>Envoie-nous une photo du défaut par email sous 14 jours après réception. On te propose un remplacement ou un remboursement — voir notre <Link href="/politique-de-retour" className="underline hover:text-slate-900">politique de retour</Link>.</p>
            </div>
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-slate-200 p-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-lg text-slate-900 mb-3">Avant d&apos;écrire</h2>
          <p className="text-sm text-slate-600 mb-3">Consulte d&apos;abord notre <Link href="/faq" className="underline hover:text-slate-900">FAQ</Link> — on y répond aux questions les plus fréquentes (formats, délais, paiement, retours).</p>
        </section>

        <div className="mt-14 text-center">
          <Link href="/" className="text-slate-500 hover:text-slate-900 transition">Retour à l&apos;accueil</Link>
        </div>
      </article>
    </main>
  );
}
