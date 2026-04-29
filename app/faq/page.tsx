"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";

const FAQS = [
  {
    category: "L'album",
    items: [
      {
        q: "Combien de photos peut-on mettre ?",
        a: "Autant que tu veux. L'album va de 24 à 200 pages selon le contenu. En mode éditeur, tu crées autant de pages que nécessaire avec 1 à 4 photos par page — il n'y a pas de limite stricte au nombre de photos.",
      },
      {
        q: "Quel est le format de l'album ?",
        a: "Le format est A4 (21 × 28 cm), imprimé sur papier photo brillant 170 g/m² avec une couverture rigide personnalisée. Un rendu premium, digne des meilleurs albums professionnels.",
      },
      {
        q: "Quels formats d'images sont acceptés ?",
        a: "Nous acceptons les formats JPG et PNG. Pour un résultat optimal à l'impression, tes photos doivent faire au minimum 800 × 800 pixels. Elles sont automatiquement optimisées lors de l'upload.",
      },
      {
        q: "Puis-je modifier mon album après avoir passé commande ?",
        a: "Non. Une fois la commande validée, l'album part immédiatement en impression et ne peut plus être modifié. Prends bien le temps de vérifier ton aperçu complet avant de confirmer.",
      },
    ],
  },
  {
    category: "Livraison",
    items: [
      {
        q: "Quel est le délai de livraison ?",
        a: "Ton album est imprimé et livré sous 5 à 7 jours ouvrés après confirmation de ta commande. Les frais de port sont calculés au moment du paiement selon la destination.",
      },
      {
        q: "Livrez-vous en dehors de France ?",
        a: "Oui — nous livrons en France métropolitaine, Belgique, Suisse, Luxembourg et Monaco. Si tu habites ailleurs, écris-nous : on étudie chaque demande au cas par cas.",
      },
    ],
  },
  {
    category: "Tarifs & paiement",
    items: [
      {
        q: "Combien coûte un album ?",
        a: "À partir de 29 € pour un album de 24 pages. Chaque page supplémentaire est à 0,50 €. Pas de frais cachés, pas d'abonnement.",
      },
      {
        q: "Comment fonctionne le paiement ?",
        a: "Le paiement est géré par Stripe, la référence mondiale en matière de paiement sécurisé en ligne. Nous acceptons Visa, Mastercard et Apple Pay. Aucune donnée bancaire n'est stockée sur nos serveurs.",
      },
    ],
  },
  {
    category: "Garanties",
    items: [
      {
        q: "Satisfait ou remboursé ?",
        a: "Oui. Si le rendu ne te convient pas, tu disposes de 14 jours après réception pour nous contacter. On te rembourse intégralement, sans condition ni question.",
      },
      {
        q: "Mes photos sont-elles stockées sur vos serveurs ?",
        a: "Non. Tes photos sont traitées localement dans ton navigateur et ne sont jamais envoyées ni stockées sur nos serveurs. Tes souvenirs restent les tiens, en toute confidentialité.",
      },
      {
        q: "Puis-je offrir un album en cadeau ?",
        a: "Absolument. Tu peux indiquer une adresse de livraison différente lors de la commande. L'album arrive dans un emballage soigné, prêt à offrir.",
      },
    ],
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState<string | null>(null);

  // FAQPage JSON-LD for Google rich results
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.flatMap(section =>
      section.items.map(item => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      }))
    ),
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Nav />

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pb-12 pt-20 text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Questions fréquentes
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl italic text-slate-900 sm:text-5xl">
          Tout ce que tu veux savoir
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-500">
          Une question sur tes photos, l&apos;impression ou la livraison ? Les réponses sont là.
        </p>
      </section>

      {/* FAQ by category */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <div className="flex flex-col gap-10">
          {FAQS.map((section) => (
            <div key={section.category}>
              <h2 className="mb-4 font-[family-name:var(--font-playfair)] text-xl text-slate-900">
                {section.category}
              </h2>
              <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                {section.items.map((item, idx) => {
                  const id = `${section.category}-${idx}`;
                  const isOpen = open === id;
                  return (
                    <div key={id}>
                      <button
                        onClick={() => setOpen(isOpen ? null : id)}
                        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-[#f8f7f4]"
                        aria-expanded={isOpen}
                      >
                        <span className="font-medium text-slate-900">{item.q}</span>
                        <span
                          className={`shrink-0 text-xl font-light text-slate-400 transition-transform duration-200 ${
                            isOpen ? "rotate-45" : ""
                          }`}
                        >
                          +
                        </span>
                      </button>
                      {isOpen && (
                        <div className="border-t border-gray-50 px-6 pb-6 pt-4 text-sm leading-relaxed text-slate-500">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-12 rounded-2xl bg-[#f8f7f4] p-8 text-center">
          <p className="font-[family-name:var(--font-playfair)] text-xl text-slate-900">
            Tu n&apos;as pas trouvé la réponse ?
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Écris-nous à{" "}
            <a
              href="mailto:linstantane.officiel@gmail.com"
              className="text-slate-900 underline underline-offset-2 hover:text-slate-600"
            >
              linstantane.officiel@gmail.com
            </a>{" "}
            — on répond sous 24–48 h en semaine.
          </p>
          <div className="mt-6">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Créer mon album →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
