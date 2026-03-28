"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/app/components/Nav";

const faqs = [
  {
    q: "Quelle est la qualité de l'album ?",
    a: "Nos albums sont imprimés sur papier photo brillant 170g/m² avec couverture rigide personnalisée. Le format est A4 (21 × 28 cm), de 24 à 200 pages selon le nombre de photos. Un rendu premium, digne des meilleurs albums professionnels.",
  },
  {
    q: "Combien coûte un album ?",
    a: "Nous proposons trois packs : Digital à 10€ (album PDF HD), Physique à 35€ (livre imprimé livré chez toi), et Duo à 40€ (digital + physique). Paiement unique, sans abonnement.",
  },
  {
    q: "Combien de temps prend la livraison ?",
    a: "Ton album est imprimé et livré en France sous 5 à 7 jours ouvrés. La livraison est offerte pour tous les packs physiques.",
  },
  {
    q: "Puis-je personnaliser la mise en page ?",
    a: "Oui ! Tu as deux options : la mise en page automatique (on s'occupe de tout) ou l'éditeur manuel où tu choisis le layout de chaque page, places tes photos et ajoutes des légendes.",
  },
  {
    q: "Combien de photos puis-je mettre dans un album ?",
    a: "Il n'y a pas de limite stricte. Tu peux ajouter autant de photos que tu veux. En mode manuel, tu crées autant de pages que nécessaire avec 1 à 4 photos par page.",
  },
  {
    q: "Quels formats de photos sont acceptés ?",
    a: "Nous acceptons les formats JPG et PNG. Pour un résultat optimal, les photos doivent faire au moins 800×800 pixels. Les photos sont automatiquement optimisées lors de l'upload.",
  },
  {
    q: "Mes photos sont-elles stockées sur vos serveurs ?",
    a: "Non. Tes photos sont traitées localement dans ton navigateur et ne sont jamais envoyées sur nos serveurs. Tes souvenirs restent les tiens.",
  },
  {
    q: "Que se passe-t-il si je ne suis pas satisfait ?",
    a: "Satisfait ou remboursé sous 14 jours. Si le rendu ne te convient pas, contacte-nous et on te rembourse intégralement.",
  },
  {
    q: "Puis-je offrir un album en cadeau ?",
    a: "Bien sûr ! Tu peux indiquer une adresse de livraison différente lors de la commande. L'album arrive dans un packaging soigné, prêt à offrir.",
  },
  {
    q: "Le site fonctionne-t-il sur mobile ?",
    a: "Oui, le site est entièrement responsive. Tu peux uploader tes photos directement depuis la galerie de ton téléphone et créer ton album en quelques minutes.",
  },
  {
    q: "Puis-je modifier mon album après l'avoir créé ?",
    a: "Oui, tant que tu n'as pas passé commande. Tu peux retourner sur l'éditeur et modifier la mise en page, les photos ou les légendes autant que tu veux.",
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Nav />

      <section className="mx-auto max-w-3xl px-6 pb-12 pt-20 text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Questions fréquentes
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-slate-900 sm:text-5xl">
          FAQ
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-500">
          Tu as une question sur nos albums ? Voici les réponses aux questions les plus fréquentes.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20">
        <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white shadow-sm">
          {faqs.map((item, idx) => (
            <div key={idx}>
              <button
                onClick={() => setOpen(open === idx ? null : idx)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-[#f8f7f4]"
                aria-expanded={open === idx}
              >
                <span className="font-medium text-slate-900">{item.q}</span>
                <span
                  className={`shrink-0 text-xl text-slate-400 transition-transform duration-200 ${
                    open === idx ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              {open === idx && (
                <div className="px-6 pb-6 pt-1 text-sm leading-relaxed text-slate-500">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-[#f8f7f4] p-8 text-center">
          <p className="font-[family-name:var(--font-playfair)] text-xl text-slate-900">
            Tu n&apos;as pas trouvé la réponse ?
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Contacte-nous à{" "}
            <a
              href="mailto:hello@linstantane.fr"
              className="text-slate-900 underline underline-offset-2 hover:text-slate-600"
            >
              hello@linstantane.fr
            </a>{" "}
            — on répond sous 24h.
          </p>
        </div>
      </section>

      <footer className="border-t border-gray-100 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-400 sm:flex-row">
          <span className="font-[family-name:var(--font-playfair)]">L&apos;Instantané</span>
          <div className="flex gap-6">
            <Link href="/comment-ca-marche" className="hover:text-slate-700 transition">Comment ça marche</Link>
            <Link href="/faq" className="hover:text-slate-700 transition">FAQ</Link>
            <Link href="/qui-sommes-nous" className="hover:text-slate-700 transition">À propos</Link>
          </div>
          <span>© 2026 L&apos;Instantané</span>
        </div>
      </footer>
    </main>
  );
}
