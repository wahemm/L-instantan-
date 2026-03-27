export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#FFF9EC] text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,_#FFEE9A,_transparent_60%)]" />
        <div className="absolute left-[-80px] top-40 h-40 w-40 rotate-2 border-[3px] border-black bg-[#FFE7EC]" />
        <div className="absolute right-[-60px] top-72 h-32 w-32 -rotate-3 border-[3px] border-black bg-[#D8EEFF]" />
      </div>

      <header className="sticky top-0 z-20 border-b-[3px] border-black bg-[#FFF5D9]/95 backdrop-blur shadow-[0_4px_0_0_#000]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a
            href="#top"
            className="flex items-center gap-3 rounded-xl border-[3px] border-black bg-white px-3 py-1.5 shadow-[3px_3px_0_0_#000] focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-black bg-[#FFE55C] text-lg"
              aria-hidden="true"
            >
              ⚡
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              L&apos;Instantané
            </span>
          </a>

          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#avant-apres"
              className="text-sm font-semibold text-slate-800 hover:text-red-500 transition"
            >
              Avant/Après
            </a>
            <a
              href="#comment-ca-marche"
              className="text-sm font-semibold text-slate-800 hover:text-blue-500 transition"
            >
              Comment ça marche
            </a>
            <a
              href="#pricing"
              className="text-sm font-semibold text-slate-800 hover:text-yellow-500 transition"
            >
              Prix
            </a>
            <a
              href="#temoignages"
              className="text-sm font-semibold text-slate-800 hover:text-emerald-500 transition"
            >
              Témoignages
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#waitlist"
              className="inline-flex items-center justify-center rounded-full border-[3px] border-black bg-[#FFE55C] px-5 py-2 text-sm font-semibold text-black shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#000] transition-transform"
            >
              Rejoindre la liste d&apos;attente
            </a>
          </div>
        </div>
      </header>

      <section id="top" className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:pt-16 sm:pb-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative">
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] text-red-500">
              <span aria-hidden="true">⚡</span>
              SOUVENIRS → BD
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Tes souvenirs en BD,
              <span className="text-yellow-500"> en un instantané</span>.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-800 sm:text-lg">
              Envoie tes photos, ajoute une description et reçois une histoire en cases,
              bulles et onomatopées, prête à partager ou imprimer en
              <span className="font-semibold"> 2 minutes</span>.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                id="waitlist"
                href="#waitlist"
                className="inline-flex items-center justify-center rounded-full border-[3px] border-black bg-[#FFE55C] px-8 py-3 text-base font-semibold text-black shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] transition-transform"
              >
                Rejoindre la liste d&apos;attente
              </a>
              <a
                href="#comment-ca-marche"
                className="inline-flex items-center justify-center rounded-full border-[3px] border-black bg-white px-8 py-3 text-base font-semibold text-slate-900 shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] transition-transform"
              >
                Voir comment ça marche
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { label: "2 min", value: "Rapide" },
                { label: "BD", value: "Stylée" },
                { label: "PDF", value: "Prêt à partager" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border-[3px] border-black bg-white px-4 py-3 shadow-[3px_3px_0_0_#000]"
                >
                  <div className="text-xs font-semibold text-red-500">
                    {item.label}
                  </div>
                  <div className="mt-1 text-sm text-slate-800">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-2 -z-10 rounded-[2.5rem] border-[3px] border-black bg-[#FFF] shadow-[6px_6px_0_0_#000]" />
            <div className="rounded-[2rem] border-[3px] border-black bg-[#FFFBF0] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-slate-700">
                    PLAN CHE BD
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    Avant → Après, en un instantané
                  </p>
                </div>
                <span className="rounded-full border-[2px] border-black bg-[#FF4B4B] px-3 py-1 text-xs font-semibold text-white shadow-[2px_2px_0_0_#000]">
                  BD
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="aspect-square rounded-2xl border-[3px] border-black bg-gradient-to-br from-[#FFE7EC] via-[#FFF5D9] to-[#D8EEFF]"
                  >
                    <div className="flex h-full items-end p-2">
                      <div className="rounded-lg border-[2px] border-black bg-white/70 px-2 py-1 text-[11px] font-semibold text-slate-900 shadow-[2px_2px_0_0_#000]">
                        {idx % 2 === 0 ? "PHOTO" : "BD"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border-[3px] border-black bg-white p-4 shadow-[3px_3px_0_0_#000]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Narration prête</p>
                    <p className="mt-1 text-sm text-slate-700">
                      Ajoute une description, on s&apos;occupe du rendu.
                    </p>
                  </div>
                  <span className="text-2xl" aria-hidden="true">
                    ✍️
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="avant-apres"
        className="mx-auto max-w-6xl px-4 py-12 sm:py-16"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Avant / Après
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base">
              Passe de la photo à une planche BD moderne, avec un style cohérent et une
              mise en scène prête à imprimer.
            </p>
          </div>
          <div className="rounded-2xl border-[3px] border-black bg-white px-4 py-3 text-sm text-slate-800 shadow-[3px_3px_0_0_#000]">
            De tes souvenirs à la BD,{" "}
            <span className="font-semibold text-red-500">en 2 minutes</span>.
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <figure className="relative overflow-hidden rounded-[2rem] border-[3px] border-black bg-white p-5 shadow-[5px_5px_0_0_#000]">
            <figcaption className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                <span className="text-xl" aria-hidden="true">
                  📸
                </span>
                Avant (photo)
              </span>
              <span className="text-xs text-slate-500">Entrée</span>
            </figcaption>
            <div className="mt-4 aspect-[4/3] rounded-[1.6rem] border-[3px] border-black bg-gradient-to-br from-[#FFF5D9] to-white p-4">
              <div className="h-full rounded-[1.2rem] border-[3px] border-black bg-[#FFF9EC] p-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-400" aria-hidden="true" />
                  <span className="text-xs font-semibold text-slate-800">
                    Tes meilleurs moments
                  </span>
                </div>
                <div className="mt-auto rounded-2xl border-[2px] border-black bg-white p-3">
                  <p className="text-sm font-semibold text-slate-900">
                    Voyage • Week-end • Amis
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    (remplace par tes photos)
                  </p>
                </div>
              </div>
            </div>
          </figure>

          <figure className="relative overflow-hidden rounded-[2rem] border-[3px] border-black bg-[#FFE55C] p-5 shadow-[5px_5px_0_0_#000]">
            <div className="absolute right-6 top-6 rounded-full border-[2px] border-black bg-[#FF4B4B] px-3 py-1 text-xs font-semibold text-white shadow-[2px_2px_0_0_#000]">
              Après
            </div>
            <figcaption className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                <span className="text-xl" aria-hidden="true">
                  🖍️
                </span>
                Après (BD)
              </span>
              <span className="text-xs text-slate-800">Sortie</span>
            </figcaption>
            <div className="mt-4 aspect-[4/3] rounded-[1.6rem] border-[3px] border-black bg-gradient-to-br from-[#FFE7EC] to-[#D8EEFF] p-4">
              <div className="relative h-full rounded-[1.2rem] border-[3px] border-black bg-white p-4">
                <div className="absolute left-4 top-4 rounded-xl border-[2px] border-black bg-[#FFFBF0] px-3 py-2">
                  <p className="text-xs font-semibold text-slate-900">Planche BD</p>
                </div>
                <div className="grid h-full grid-cols-2 gap-3">
                  <div className="rounded-xl border-[2px] border-black bg-[#FFF5D9] p-3">
                    <p className="text-xs font-semibold text-slate-900">Case 1</p>
                    <p className="mt-2 text-[11px] leading-relaxed text-slate-700">
                      Une narration qui donne le rythme
                    </p>
                  </div>
                  <div className="rounded-xl border-[2px] border-black bg-[#D8EEFF] p-3">
                    <p className="text-xs font-semibold text-slate-900">Case 2</p>
                    <p className="mt-2 text-[11px] leading-relaxed text-slate-700">
                      Un style uniforme et moderne
                    </p>
                  </div>
                  <div className="col-span-2 rounded-xl border-[2px] border-black bg-white p-3">
                    <p className="text-xs font-semibold text-slate-900">Case 3</p>
                    <p className="mt-2 text-[11px] leading-relaxed text-slate-700">
                      Prêt à partager ou imprimer
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </figure>
        </div>
      </section>

      <section id="comment-ca-marche" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Comment ça marche
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base">
              3 étapes simples pour transformer tes souvenirs en BD, sans friction.
            </p>
          </div>
        </div>

        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              emoji: "📸",
              title: "Uploade tes photos",
              description: "Sélectionne tes meilleurs moments. On s’occupe du reste.",
            },
            {
              emoji: "✍️",
              title: "Décris ton souvenir",
              description: "Ajoute quelques lignes pour donner le ton et la narration.",
            },
            {
              emoji: "⚡",
              title: "Reçois ta BD en 2 minutes",
              description: "Une BD prête à partager, télécharger, ou imprimer.",
            },
          ].map((item, idx) => (
            <li
              key={item.title}
              className="group rounded-[2rem] border-[3px] border-black bg-white p-6 shadow-[4px_4px_0_0_#000] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-[3px] border-black bg-[#FFE55C] text-2xl">
                    {item.emoji}
                  </div>
                  <div>
                    <div className="text-xs font-semibold tracking-[0.18em] text-red-500">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                      {item.title}
                    </h3>
                  </div>
                </div>
                <span
                  className="text-3xl opacity-0 transition group-hover:opacity-100"
                  aria-hidden="true"
                >
                  ✦
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-700">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-4 pb-14 pt-6 sm:pb-16">
        <div className="rounded-[2.5rem] border-[3px] border-black bg-[#FFFBF0] px-5 py-8 shadow-[5px_5px_0_0_#000] sm:px-10 sm:py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Pricing
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base">
                Paiement unique. Choisis l&apos;offre qui correspond à ton souvenir.
              </p>
            </div>
            <div className="rounded-2xl border-[3px] border-black bg-white px-4 py-3 text-sm text-slate-800 shadow-[3px_3px_0_0_#000]">
              Offre la plus demandée :{" "}
              <span className="font-semibold text-red-500">Digital</span>
            </div>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {[
              {
                name: "Gratuit",
                price: "0€",
                note: "Aperçu 3 pages",
                featured: false,
                perks: ["Aperçu BD", "Style cohérent", "Parfait pour tester"],
              },
              {
                name: "Digital",
                price: "9.99€",
                note: "BD complète PDF",
                featured: true,
                perks: ["BD complète", "PDF prêt à partager", "Téléchargement immédiat"],
              },
              {
                name: "Physique",
                price: "34.99€",
                note: "Livre imprimé",
                featured: false,
                perks: ["Livre imprimé", "Finition premium", "Pour offrir (ou garder)"],
              },
            ].map((plan) => (
              <article
                key={plan.name}
                className={[
                  "relative overflow-hidden rounded-[2rem] border-[3px] p-6 shadow-[4px_4px_0_0_#000]",
                  plan.featured
                    ? "border-black bg-[#FFE55C]"
                    : "border-black bg-white",
                ].join(" ")}
              >
                {plan.featured ? (
                  <div className="absolute right-4 top-4 rounded-full border-[2px] border-black bg-[#FF4B4B] px-3 py-1 text-xs font-semibold text-white shadow-[2px_2px_0_0_#000]">
                    Populaire
                  </div>
                ) : null}

                <div className="mt-2 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                    <p className="mt-1 text-sm text-slate-700">{plan.note}</p>
                  </div>
                </div>

                <div className="mt-6 flex items-end gap-2">
                  <div className="text-4xl font-extrabold tracking-tight text-slate-900">
                    {plan.price}
                  </div>
                  <div className="pb-1 text-xs font-semibold text-slate-600">
                    one-shot
                  </div>
                </div>

                <ul className="mt-6 space-y-2 text-sm text-slate-800">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border-[2px] border-black bg-[#FFE55C] text-[11px] font-bold">
                        ✓
                      </span>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#waitlist"
                  className={[
                    "mt-7 inline-flex w-full items-center justify-center rounded-full border-[3px] px-6 py-2.5 text-sm font-semibold shadow-[3px_3px_0_0_#000] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#000] focus:outline-none",
                    plan.featured
                      ? "border-black bg-[#FF4B4B] text-white"
                      : "border-black bg-white text-slate-900",
                  ].join(" ")}
                >
                  Rejoindre la liste d&apos;attente
                </a>

                <p className="mt-4 text-center text-xs text-slate-600">
                  Sans abonnement.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="temoignages" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Témoignages
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base">
              Des avis fictifs, mais des souvenirs bien réels.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              name: "Camille",
              role: "BD Digital",
              quote:
                "On a envoyé les photos du week-end et on a reçu une BD hyper stylée. La narration rend tout vivant.",
            },
            {
              name: "Yanis",
              role: "Aperçu Gratuit",
              quote:
                "J’ai testé pour voir… et en 2 minutes j’avais un aperçu propre et drôle. J’y retourne direct pour la version complète.",
            },
            {
              name: "Sarah",
              role: "Livre Physique",
              quote:
                "Offrir la BD imprimée, c’est top. Le rendu est beau, et ça devient vraiment un objet souvenir.",
            },
          ].map((t) => (
            <blockquote
              key={t.name}
              className="rounded-[2rem] border-[3px] border-black bg-white p-6 shadow-[4px_4px_0_0_#000]"
            >
              <p className="text-sm leading-relaxed text-slate-800">
                “{t.quote}”
              </p>
              <footer className="mt-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-[2px] border-black bg-[#FFE55C] text-sm font-extrabold text-slate-900">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-600">{t.role}</div>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <footer className="border-t-[3px] border-black bg-[#FFF5D9]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between">
          <div>© 2026 L&apos;Instantané</div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href="#comment-ca-marche"
              className="font-semibold hover:text-red-500 transition"
            >
              Comment ça marche
            </a>
            <a
              href="#pricing"
              className="font-semibold hover:text-blue-500 transition"
            >
              Prix
            </a>
            <a
              href="#temoignages"
              className="font-semibold hover:text-yellow-500 transition"
            >
              Témoignages
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}