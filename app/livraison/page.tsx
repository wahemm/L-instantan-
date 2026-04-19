import type { Metadata } from "next";
import Nav from "@/app/components/Nav";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Livraison",
  description: "Livraison L'Instantané — gratuite en France, Belgique, Suisse, Luxembourg, Monaco. Délai 5 à 7 jours ouvrés, impression à la demande.",
};

export default function LivraisonPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Nav />
      <article className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl text-slate-900 mb-2">Livraison</h1>
        <p className="text-sm text-slate-400 mb-12">Tout ce qu&apos;il faut savoir sur l&apos;envoi de ton album.</p>

        <section className="mb-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-[#faf8f4] p-5 text-center">
            <p className="text-2xl mb-2">🚚</p>
            <p className="text-sm font-semibold text-slate-900 mb-1">Livraison gratuite</p>
            <p className="text-xs text-slate-500">Toutes les commandes Pack Physique ou Duo.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-[#faf8f4] p-5 text-center">
            <p className="text-2xl mb-2">⏱️</p>
            <p className="text-sm font-semibold text-slate-900 mb-1">5 à 7 jours ouvrés</p>
            <p className="text-xs text-slate-500">Fabrication + envoi inclus.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-[#faf8f4] p-5 text-center">
            <p className="text-2xl mb-2">🌍</p>
            <p className="text-sm font-semibold text-slate-900 mb-1">Europe francophone</p>
            <p className="text-xs text-slate-500">FR · BE · CH · LU · MC</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">1. Pays desservis</h2>
          <p className="text-sm leading-relaxed text-slate-600 mb-3">
            Nous expédions actuellement vers :
          </p>
          <ul className="list-disc pl-6 text-sm leading-relaxed text-slate-600 space-y-1">
            <li>🇫🇷 <strong>France métropolitaine</strong> et Corse</li>
            <li>🇧🇪 <strong>Belgique</strong></li>
            <li>🇨🇭 <strong>Suisse</strong></li>
            <li>🇱🇺 <strong>Luxembourg</strong></li>
            <li>🇲🇨 <strong>Monaco</strong></li>
          </ul>
          <p className="text-sm leading-relaxed text-slate-600 mt-3">
            Les DOM-TOM et autres pays ne sont pas encore disponibles. Pour une demande spécifique, contacte-nous à{" "}
            <a href="mailto:linstantane.officiel@gmail.com" className="underline hover:text-slate-900">linstantane.officiel@gmail.com</a>.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">2. Délais</h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-3">
            <p><strong>Fabrication :</strong> 2 à 3 jours ouvrés. Chaque album est imprimé à la demande, à l&apos;unité — pas de stock.</p>
            <p><strong>Expédition :</strong> 2 à 4 jours ouvrés selon le pays.</p>
            <p><strong>Total :</strong> 5 à 7 jours ouvrés entre le paiement et la réception.</p>
            <p className="text-xs text-slate-500">Les délais peuvent être légèrement rallongés en période de forte demande (Noël, Saint-Valentin, fête des mères).</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">3. Frais de port</h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2">
            <p><strong>Pack Physique & Pack Duo :</strong> livraison <strong>offerte</strong>.</p>
            <p><strong>Pack Digital (PDF) :</strong> livraison immédiate par email après paiement — pas de frais.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">4. Suivi de commande</h2>
          <p className="text-sm leading-relaxed text-slate-600 mb-3">
            Dès que ton colis est expédié, tu reçois un email avec un <strong>numéro de suivi</strong> et un lien direct vers le transporteur.
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            Tu peux aussi consulter le statut de tes commandes depuis ton espace{" "}
            <Link href="/commandes" className="underline hover:text-slate-900">Mes commandes</Link> (connexion requise).
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">5. Impression responsable</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Nous travaillons avec un réseau d&apos;imprimeurs locaux qui produisent au plus près de chez toi. Cela réduit les distances de transport et l&apos;empreinte carbone des livraisons.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">6. Colis perdu ou endommagé</h2>
          <p className="text-sm leading-relaxed text-slate-600 mb-3">
            Si ton colis n&apos;est pas arrivé au bout de <strong>10 jours ouvrés</strong>, ou s&apos;il est endommagé à l&apos;ouverture, contacte-nous immédiatement avec photos à l&apos;appui.
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            On lance une enquête avec le transporteur et on te renvoie un nouvel album gratuitement si nécessaire — voir notre{" "}
            <Link href="/politique-de-retour" className="underline hover:text-slate-900">politique de retour</Link>.
          </p>
        </section>

        <div className="mt-14 flex items-center justify-between text-sm">
          <Link href="/politique-de-retour" className="text-slate-500 hover:text-slate-900 transition">← Politique de retour</Link>
          <Link href="/" className="text-slate-500 hover:text-slate-900 transition">Retour à l&apos;accueil</Link>
        </div>
      </article>
    </main>
  );
}
