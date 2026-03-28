export default function Home() {
  return (
    <main className="bg-white text-[#121212]">

      {/* NAV */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <nav className="hidden md:flex items-center gap-8">
            <a href="#comment-ca-marche" className="text-sm text-gray-700 hover:text-black transition">Comment ça marche</a>
            <a href="#pricing" className="text-sm text-gray-700 hover:text-black transition">Tarifs</a>
            <a href="#temoignages" className="text-sm text-gray-700 hover:text-black transition">Témoignages</a>
            <a href="#faq" className="text-sm text-gray-700 hover:text-black transition">FAQ</a>
          </nav>

          <a href="/" className="font-[family-name:var(--font-playfair)] text-2xl font-bold tracking-tight absolute left-1/2 -translate-x-1/2">
            L&apos;Instantané
          </a>

          <div className="flex items-center gap-4">
            <a
              href="/create"
              className="rounded-full bg-black text-white text-sm px-5 py-2 hover:bg-gray-800 transition"
            >
              Commencer
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-[url('/hero.jpg')] bg-cover bg-center opacity-60" />
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl sm:text-6xl lg:text-7xl font-bold italic text-white leading-tight">
            Chaque souvenir mérite<br />son illustration unique.
          </h1>
          <a
            href="/create"
            className="mt-10 inline-block rounded-full bg-white text-black text-sm font-medium px-8 py-3 hover:bg-gray-100 transition"
          >
            Créer mon illustration
          </a>
        </div>
      </section>

      {/* SECTION 1 */}
      <section className="mx-auto max-w-6xl px-6 py-20 grid gap-16 md:grid-cols-2 items-center">
        <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center text-gray-400 text-sm">
            Exemple avant / après
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Le concept</p>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-bold mt-3 leading-snug">
            La qualité compte.
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            On transforme tes photos de voyage en illustrations cartoon hyper réalistes et professionnelles. Garde les visages, le décor, l&apos;ambiance — tout y est, en version cartoon.
          </p>
        </div>
      </section>

      {/* COMMENT CA MARCHE */}
      <section id="comment-ca-marche" className="bg-[#f8f7f4] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase text-center">Simple</p>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-bold mt-3 text-center">
            Comment ça marche
          </h2>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              { num: "01", title: "Upload tes photos", desc: "Sélectionne les photos de ton voyage ou de ton événement." },
              { num: "02", title: "On génère l'illustration", desc: "Notre IA transforme chaque photo en cartoon professionnel en quelques secondes." },
              { num: "03", title: "Télécharge ou imprime", desc: "Reçois tes illustrations en digital ou commande un livre imprimé premium." },
            ].map((step) => (
              <div key={step.num}>
                <p className="font-[family-name:var(--font-playfair)] text-5xl font-bold text-gray-200">{step.num}</p>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold mt-2">{step.title}</h3>
                <p className="mt-2 text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase text-center">Tarifs</p>
        <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-bold mt-3 text-center">
          Paiement unique, sans abonnement.
        </h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            {
              name: "Digital",
              price: "10€",
              desc: "Illustrations en haute résolution à télécharger.",
              perks: ["Illustrations HD", "Téléchargement immédiat", "Format PNG & PDF"],
              featured: false,
            },
            {
              name: "Physique",
              price: "35€",
              desc: "Livre photo imprimé et livré chez toi.",
              perks: ["Livre imprimé premium", "Livraison incluse", "Finition soignée"],
              featured: true,
            },
            {
              name: "Duo",
              price: "40€",
              desc: "Le digital et le physique réunis.",
              perks: ["Illustrations HD", "Livre imprimé premium", "Livraison incluse"],
              featured: false,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 border ${plan.featured ? "border-black bg-black text-white" : "border-gray-200 bg-white"}`}
            >
              {plan.featured && (
                <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">Populaire</p>
              )}
              <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold">{plan.name}</h3>
              <p className={`mt-2 text-sm ${plan.featured ? "text-gray-400" : "text-gray-500"}`}>{plan.desc}</p>
              <p className="font-[family-name:var(--font-playfair)] text-5xl font-bold mt-6">{plan.price}</p>
              <ul className="mt-6 space-y-3">
                {plan.perks.map((perk) => (
                  <li key={perk} className={`text-sm flex items-center gap-2 ${plan.featured ? "text-gray-300" : "text-gray-600"}`}>
                    <span>✓</span> {perk}
                  </li>
                ))}
              </ul>
              <a
                href="/create"
                className={`mt-8 inline-block w-full text-center rounded-full text-sm font-medium px-6 py-3 transition ${plan.featured ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-gray-800"}`}
              >
                Commencer
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* TEMOIGNAGES */}
      <section id="temoignages" className="bg-[#f8f7f4] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase text-center">Avis</p>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-bold mt-3 text-center">
            Ils ont adoré.
          </h2>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { name: "Camille", quote: "Le rendu est bluffant. On reconnaît vraiment les personnes, c'est magique." },
              { name: "Yanis", quote: "J'ai commandé le livre physique pour offrir à ma mère. Elle a adoré, un vrai objet souvenir." },
              { name: "Sarah", quote: "Rapide, simple et le résultat est vraiment professionnel. Je recommande." },
            ].map((t) => (
              <blockquote key={t.name} className="bg-white rounded-2xl p-8 border border-gray-100">
                <p className="text-gray-700 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                    {t.name[0]}
                  </div>
                  <span className="font-semibold text-sm">{t.name}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase text-center">FAQ</p>
        <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-bold mt-3 text-center mb-12">
          Questions fréquentes
        </h2>
        {[
          { q: "Combien de temps ça prend ?", r: "Environ 30 à 60 secondes par photo." },
          { q: "Les visages ressemblent vraiment à la photo ?", r: "Oui, notre IA analyse précisément chaque visage pour le reproduire fidèlement en style cartoon." },
          { q: "Puis-je commander un livre imprimé ?", r: "Oui, avec le pack Physique ou Duo, on imprime et livre ton livre directement chez toi." },
          { q: "Est-ce que mes photos sont stockées ?", r: "Non, tes photos sont supprimées après génération." },
        ].map((item) => (
          <div key={item.q} className="border-b border-gray-200 py-6">
            <h3 className="font-semibold text-base">{item.q}</h3>
            <p className="mt-2 text-gray-600 text-sm leading-relaxed">{item.r}</p>
          </div>
        ))}
      </section>

      {/* CTA FINAL */}
      <section className="bg-black text-white py-24 text-center px-6">
        <h2 className="font-[family-name:var(--font-playfair)] text-5xl font-bold italic leading-tight">
          Prêt à immortaliser<br />tes souvenirs ?
        </h2>
        <a
          href="/create"
          className="mt-10 inline-block rounded-full bg-white text-black text-sm font-medium px-8 py-3 hover:bg-gray-100 transition"
        >
          Créer mon illustration
        </a>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-gray-500">
          <span>© 2026 L&apos;Instantané</span>
          <div className="flex gap-6">
            <a href="#comment-ca-marche" className="hover:text-black transition">Comment ça marche</a>
            <a href="#pricing" className="hover:text-black transition">Tarifs</a>
            <a href="#temoignages" className="hover:text-black transition">Témoignages</a>
          </div>
        </div>
      </footer>

    </main>
  );
}
