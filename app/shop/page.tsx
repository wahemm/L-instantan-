"use client";

import { useState } from "react";

const packs = [
  {
    id: "digital",
    label: "Digital",
    discount: "-50%",
    price: 10,
    originalPrice: 20,
    description: "Illustrations HD à télécharger",
  },
  {
    id: "physique",
    label: "Physique",
    discount: "-40%",
    price: 35,
    originalPrice: 59,
    description: "Livre imprimé livré chez toi",
  },
  {
    id: "duo",
    label: "Duo",
    discount: "-50% + 🎁 OFFERT",
    price: 40,
    originalPrice: 79,
    description: "Digital + Livre imprimé",
  },
];

const accordions = [
  {
    title: "Format & Qualité",
    content: "Illustrations générées en 1024x1024px, exportées en PNG haute résolution. Le livre imprimé est au format A4, papier brillant photo premium, de 24 à 200 pages selon le nombre de photos.",
  },
  {
    title: "Livraison & Retours",
    content: "Livraison en France sous 5 à 7 jours ouvrés. Livraison offerte dès 35€. Satisfait ou remboursé sous 14 jours si le rendu ne vous convient pas.",
  },
];

export default function ShopPage() {
  const [selectedPack, setSelectedPack] = useState("physique");
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const pack = packs.find((p) => p.id === selectedPack)!;

  return (
    <main className="bg-white text-[#121212]">

      {/* NAV */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-sm font-semibold text-black border-b-2 border-black">Illustrations</a>
            <a href="#" className="text-sm text-gray-500 hover:text-black transition">Comment ça marche</a>
            <a href="#" className="text-sm text-gray-500 hover:text-black transition">FAQ</a>
          </nav>
          <a href="/" className="font-[family-name:var(--font-playfair)] text-2xl font-bold tracking-tight absolute left-1/2 -translate-x-1/2">
            L&apos;Instantané
          </a>
          <div className="flex items-center gap-4">
            <a href="/create" className="rounded-full bg-black text-white text-sm px-5 py-2 hover:bg-gray-800 transition">
              Commencer
            </a>
          </div>
        </div>
      </header>

      {/* PRODUCT */}
      <section className="mx-auto max-w-6xl px-6 py-12 grid md:grid-cols-2 gap-12 items-start">

        {/* IMAGE */}
        <div className="relative">
          <div className="absolute top-4 left-4 z-10 bg-[#FFE55C] text-black text-sm font-bold px-4 py-2 rounded-full">
            {pack.discount} CETTE SEMAINE
          </div>
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center text-gray-400 text-sm">
            {/* Remplace par une vraie image */}
            <div className="text-center p-8">
              <p className="text-6xl mb-4">🎨</p>
              <p>Exemple d&apos;illustration cartoon</p>
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div>
          {/* Trustpilot */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-semibold text-gray-700">Excellent</span>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <span key={s} className="text-green-500 text-lg">★</span>
              ))}
            </div>
            <span className="text-sm text-gray-500">Trustpilot</span>
          </div>

          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold">
            Illustration Cartoon de Voyage
          </h1>

          <div className="flex items-center gap-3 mt-3">
            <span className="text-2xl font-bold">{pack.price},00 EUR</span>
            <span className="text-gray-400 line-through text-lg">{pack.originalPrice},00 EUR</span>
          </div>

          <ul className="mt-4 space-y-1 text-sm text-gray-600">
            <li>• Style cartoon hyper réaliste et professionnel</li>
            <li>• Visages fidèles à vos photos</li>
            <li>• Généré en 30 secondes</li>
          </ul>

          {/* Packs */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {packs.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPack(p.id)}
                className={`rounded-xl border-2 p-3 text-center transition ${
                  selectedPack === p.id ? "border-black" : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <div className="text-xs font-bold text-[#FFE55C] bg-black rounded-full px-2 py-0.5 inline-block mb-1">
                  {p.discount}
                </div>
                <div className="font-[family-name:var(--font-playfair)] font-bold text-base">{p.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{p.price}€</div>
              </button>
            ))}
          </div>

          {/* CTA */}
          <a
            href="/create"
            className="mt-6 block w-full text-center rounded-xl bg-black text-white font-semibold py-4 text-base hover:bg-gray-800 transition"
          >
            Créer mon illustration
          </a>

          <p className="mt-3 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
            <span>🔒</span> Satisfait ou remboursé sous 14 jours
          </p>

          {/* Accordéons */}
          <div className="mt-8 space-y-0 border-t border-gray-200">
            {accordions.map((acc) => (
              <div key={acc.title} className="border-b border-gray-200">
                <button
                  onClick={() => setOpenAccordion(openAccordion === acc.title ? null : acc.title)}
                  className="w-full flex items-center justify-between py-4 text-sm font-semibold text-left"
                >
                  {acc.title}
                  <span className="text-gray-400 text-xl">{openAccordion === acc.title ? "−" : "+"}</span>
                </button>
                {openAccordion === acc.title && (
                  <p className="pb-4 text-sm text-gray-600 leading-relaxed">{acc.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION PAGES */}
      <section className="bg-[#f8f7f4] py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-center mb-12">
            Combien de photos ?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { n: "1", label: "Photo unique", h: "h-16" },
              { n: "5", label: "Petit album", h: "h-24" },
              { n: "10", label: "Album voyage", h: "h-32" },
              { n: "20+", label: "Album complet", h: "h-40" },
            ].map((item) => (
              <div key={item.n} className="flex flex-col items-center gap-3">
                <div className={`w-16 ${item.h} bg-black rounded-lg`} />
                <p className="font-[family-name:var(--font-playfair)] text-3xl font-bold">{item.n}</p>
                <p className="text-sm text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-gray-500">
          <span>© 2026 L&apos;Instantané</span>
          <div className="flex gap-6">
            <a href="/" className="hover:text-black transition">Accueil</a>
            <a href="/create" className="hover:text-black transition">Créer</a>
          </div>
        </div>
      </footer>

    </main>
  );
}
