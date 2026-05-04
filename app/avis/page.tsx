import type { Metadata } from "next";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Laisser un avis — L'Instantané",
  description: "Tu as reçu ton album L'Instantané ? Partage ton ressenti. Ton avis aide d'autres parents et couples à se décider.",
  alternates: { canonical: "/avis" },
  robots: { index: true, follow: true },
};

const REVIEW_EMAIL = "linstantane.officiel@gmail.com";
const INSTAGRAM = "linstantane_souvenir";

export default function AvisPage() {
  const mailtoSubject = encodeURIComponent("Mon avis sur mon album L'Instantané");
  const mailtoBody = encodeURIComponent(
    `Bonjour,\n\nVoici mon avis sur mon album :\n\n[Écris ici ton ressenti — qualité d'impression, papier, livraison, ressenti général…]\n\nTu peux aussi partager :\n- Une note sur 5 ⭐\n- Une photo de ton album si tu le souhaites (en pièce jointe)\n- Si on peut publier ton témoignage sur le site (avec ton prénom uniquement)\n\nMerci !\n`
  );

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Nav />

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-10 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-600/80">Merci d&apos;avance ✨</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl italic leading-[1.1] text-slate-900 sm:text-5xl">
          Ton avis compte vraiment.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
          On est une petite équipe — chaque retour nous aide à nous améliorer, et il aide d&apos;autres parents et couples à se décider.
        </p>
      </section>

      {/* Options */}
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Email */}
          <a
            href={`mailto:${REVIEW_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`}
            className="group flex flex-col rounded-2xl border border-slate-200 bg-[#faf8f4] p-6 transition hover:border-slate-900 hover:shadow-md sm:p-8"
          >
            <div className="mb-4 text-3xl">📧</div>
            <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-2">Par email</h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              Le plus simple. Un email pré-rempli s&apos;ouvre, tu écris ton ressenti et tu envoies. Tu peux joindre une photo de ton album si tu veux.
            </p>
            <span className="mt-auto inline-flex items-center text-sm font-semibold text-slate-900 group-hover:translate-x-0.5 transition">
              Écrire mon avis →
            </span>
          </a>

          {/* Instagram */}
          <a
            href={`https://instagram.com/${INSTAGRAM}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-2xl border border-slate-200 bg-gradient-to-br from-rose-50 to-amber-50 p-6 transition hover:border-rose-300 hover:shadow-md sm:p-8"
          >
            <div className="mb-4 text-3xl">📷</div>
            <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-2">Sur Instagram</h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              Tague <strong>@{INSTAGRAM}</strong> sur une story ou un post avec ton album. On te repartage avec plaisir.
            </p>
            <span className="mt-auto inline-flex items-center text-sm font-semibold text-slate-900 group-hover:translate-x-0.5 transition">
              Aller sur Instagram →
            </span>
          </a>
        </div>

        {/* Reassurance */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h3 className="font-[family-name:var(--font-playfair)] text-lg text-slate-900 mb-3">Un souci avec ton album ?</h3>
          <p className="text-sm leading-relaxed text-slate-600 mb-4">
            Défaut d&apos;impression, page abîmée, couverture qui ne correspond pas à ton aperçu validé ? On te rembourse intégralement sous 14 jours, sans conditions.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-900"
          >
            Nous contacter
          </Link>
        </div>

        {/* Quick tips */}
        <div className="mt-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Ce qui nous aide vraiment</p>
          <ul className="mx-auto max-w-md space-y-1.5 text-sm text-slate-500">
            <li>• Une note sur 5 ⭐</li>
            <li>• Ce qui t&apos;a plu (et ce qui peut être amélioré)</li>
            <li>• Une photo de ton album si tu peux</li>
            <li>• Si on peut publier ton avis (avec ton prénom seul)</li>
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  );
}
