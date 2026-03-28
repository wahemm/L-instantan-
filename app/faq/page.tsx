"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/app/components/Nav";

const faqs = [
  {
    q: "Quelle est la qualité des illustrations générées ?",
    a: "Nos illustrations sont générées en haute résolution (jusqu'à 1024×1024 px) avec un modèle IA spécialement entraîné pour le rendu cartoon artistique. Chaque image est travaillée pour une cohérence visuelle, des couleurs harmonieuses et un rendu digne d'une illustration professionnelle.",
  },
  {
    q: "Combien coûte le service ?",
    a: "Nous proposons plusieurs packs : un pack découverte pour une illustration, un pack voyage pour 5 illustrations, et un pack souvenir complet pour 10 illustrations. Les prix démarrent à quelques euros par image. Consulte la page Illustrations pour le détail des tarifs.",
  },
  {
    q: "Combien de temps faut-il pour générer une illustration ?",
    a: "La génération prend entre 30 et 60 secondes par photo. Si tu uploades plusieurs photos en même temps, elles sont traitées en parallèle. Tu n'as qu'à patienter sur la page de résultat.",
  },
  {
    q: "Le service reconnaît-il les visages correctement ?",
    a: "Notre modèle est optimisé pour les photos de personnes. Les traits du visage, les expressions et les postures sont faithfully retranscrits dans le style cartoon. Plus la photo est nette et bien éclairée, meilleur sera le résultat.",
  },
  {
    q: "Puis-je faire imprimer mes illustrations ?",
    a: "Oui ! Nos illustrations sont générées en haute résolution, prêtes pour l'impression. Tu peux les télécharger et les faire imprimer où tu veux, ou utiliser notre service d'impression premium avec livraison en France sous 5 à 7 jours ouvrés.",
  },
  {
    q: "Que se passe-t-il si je ne suis pas satisfait du résultat ?",
    a: "Si l'illustration générée ne te convient pas, tu peux régénérer gratuitement une fois. Si après deux tentatives le résultat n'est pas satisfaisant, notre équipe t'offre un avoir valable sur une prochaine commande.",
  },
  {
    q: "Quels formats de fichiers sont acceptés ?",
    a: "Nous acceptons les formats JPG et PNG. Pour un résultat optimal, les photos doivent faire au moins 800×800 pixels. Les photos floues ou très sombres peuvent donner des résultats moins précis.",
  },
  {
    q: "Combien de photos puis-je uploader en une fois ?",
    a: "Tu peux uploader jusqu'à 10 photos par session. Si tu souhaites transformer davantage de photos, il te suffit de relancer une nouvelle session. Il n'y a pas de limite au nombre total d'illustrations que tu peux créer.",
  },
  {
    q: "Mes photos sont-elles stockées sur vos serveurs ?",
    a: "Non. Tes photos sont utilisées uniquement le temps de la génération, puis supprimées automatiquement. Nous ne conservons aucune image personnelle. Tes souvenirs restent les tiens, et tes données de privacité nous tiennent à cœur.",
  },
  {
    q: "Quelle est la différence entre les différents packs ?",
    a: "Le pack découverte te donne accès à 1 illustration, idéal pour tester le service. Le pack voyage inclut 5 illustrations à prix réduit, parfait pour un album de vacances. Le pack souvenir complet comprend 10 illustrations avec un tarif encore plus avantageux — idéal pour un événement ou une série.",
  },
  {
    q: "Les illustrations peuvent-elles être utilisées commercialement ?",
    a: "Les illustrations générées sont pour usage personnel uniquement. Si tu souhaites les utiliser à des fins commerciales (vente, impression à grande échelle, marketing), contacte-nous pour une licence adaptée.",
  },
  {
    q: "Le service fonctionne-t-il sur mobile ?",
    a: "Oui, le site est entièrement responsive et optimisé pour mobile. Tu peux uploader tes photos directement depuis la galerie de ton téléphone et recevoir tes illustrations en quelques secondes.",
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Nav />

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pb-12 pt-20 text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Questions fréquentes
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-slate-900 sm:text-5xl">
          FAQ
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-500">
          Tu as une question sur le service ? Voici les réponses aux questions les
          plus fréquentes. Si tu ne trouves pas ce que tu cherches, écris-nous.
        </p>
      </section>

      {/* Accordion */}
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

      {/* Footer */}
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
