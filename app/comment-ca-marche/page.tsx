import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Comment ça marche ?",
  description: "Créer ton album photo L'Instantané en 3 étapes : importe tes photos, personnalise ta couverture, et reçois ton livre imprimé chez toi en 5–7 jours.",
  openGraph: {
    title: "Comment ça marche ? — L'Instantané",
    description: "3 étapes simples pour créer et recevoir ton album photo premium.",
    url: "https://linstantane.fr/comment-ca-marche",
  },
};

const STEPS = [
  {
    num: "01",
    emoji: "📚",
    title: "Choisis ta couverture",
    desc: "Rends-toi sur la boutique, sélectionne un modèle de couverture parmi nos thèmes soigneusement conçus pour donner du caractère à ton livre.",
    detail: "Sur /shop — quelques secondes suffisent.",
  },
  {
    num: "02",
    emoji: "🎨",
    title: "Crée ton album",
    desc: "Glisse tes photos dans l'éditeur, choisis le layout de chaque page (1, 2 ou 4 photos), change les fonds, et ajoute des textes ou légendes à ta guise.",
    detail: "Éditeur intuitif — aucun logiciel à installer.",
  },
  {
    num: "03",
    emoji: "🛒",
    title: "Aperçu & commande",
    desc: "Visualise ton album page par page avant de valider. Une fois satisfait, règle en toute sécurité via Stripe. Ton album part en impression dès confirmation.",
    detail: "Paiement sécurisé — Visa, Mastercard, Apple Pay.",
  },
  {
    num: "04",
    emoji: "🚚",
    title: "Reçois ton livre",
    desc: "Ton album est imprimé sur papier photo brillant 170 g/m², relié couverture rigide, et livré en France en 5 à 7 jours ouvrés.",
    detail: "Emballage soigné, prêt à offrir.",
  },
];

const PERKS = [
  {
    icon: "✨",
    title: "Qualité premium",
    desc: "Papier 170 g/m² brillant, couverture rigide, couleurs fidèles. Un album digne des meilleurs imprimeurs professionnels.",
  },
  {
    icon: "🔒",
    title: "Tes photos restent les tiennes",
    desc: "Les photos sont traitées localement dans ton navigateur. Rien n'est stocké sur nos serveurs.",
  },
  {
    icon: "↩️",
    title: "Satisfait ou remboursé",
    desc: "Tu as 14 jours pour changer d'avis. On te rembourse intégralement, sans question.",
  },
];

export default function CommentCaMarchePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Nav />

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pb-16 pt-20 text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Comment ça marche
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl italic leading-snug text-slate-900 sm:text-5xl lg:text-6xl">
          De tes photos
          <br />à ton livre, en 4 étapes.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-500">
          L&apos;Instantané transforme tes souvenirs en un album premium imprimé.
          Simple, rapide, et d&apos;une qualité que tu peux tenir dans les mains.
        </p>
        <div className="mt-8">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Commencer mon album →
          </Link>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-[#f8f7f4] py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-16 text-center font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
            Quatre étapes, un bel album
          </h2>

          <div className="grid gap-12 md:grid-cols-2">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <span className="font-[family-name:var(--font-playfair)] text-6xl font-bold leading-none text-slate-100">
                    {step.num}
                  </span>
                  <span className="text-4xl">{step.emoji}</span>
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">{step.desc}</p>
                <p className="text-xs font-medium text-slate-400">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connector line visual */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="relative flex flex-col items-center gap-0 md:flex-row md:justify-between">
          {/* line */}
          <div className="absolute left-1/2 top-6 hidden h-0.5 w-4/5 -translate-x-1/2 bg-gray-100 md:block" />
          {STEPS.map((step, i) => (
            <div key={step.num} className="relative z-10 flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-xl text-white shadow-md">
                {step.emoji}
              </div>
              <span className="text-xs font-semibold text-slate-400">Étape {i + 1}</span>
              <span className="font-[family-name:var(--font-playfair)] text-sm font-medium text-slate-700">
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Perks */}
      <section className="bg-[#f8f7f4] py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-12 text-center font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
            Pourquoi L&apos;Instantané ?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {PERKS.map((perk) => (
              <div key={perk.title} className="flex flex-col gap-4 rounded-2xl bg-white p-8 shadow-sm">
                <div className="text-4xl">{perk.icon}</div>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900">
                  {perk.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl italic sm:text-4xl">
            Prêt à créer ton album ?
          </h2>
          <p className="mt-4 text-slate-400">
            Tu vois l&apos;aperçu complet avant de payer. Lance-toi maintenant.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
          >
            Choisir ma couverture →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
