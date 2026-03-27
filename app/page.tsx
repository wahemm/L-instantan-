export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">
              ⚡
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              L&apos;Instantané
            </span>
          </div>

          <a
            href="#waitlist"
            className="inline-flex items-center justify-center rounded-full bg-yellow-400 px-5 py-2 text-sm font-semibold text-black shadow-sm hover:bg-yellow-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition"
          >
            Rejoindre la liste d&apos;attente
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-240px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl" />
          <div className="absolute bottom-[-260px] right-[-200px] h-[560px] w-[560px] rounded-full bg-yellow-400/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-yellow-300/90">
              SOUVENIRS → BD
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Tes souvenirs en BD, en un instantané
            </h1>
            <p className="mt-5 text-base leading-relaxed text-white/70 sm:text-lg">
              Transforme tes photos et un petit texte en bande dessinée stylée, prête
              à partager ou imprimer.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                id="waitlist"
                href="#"
                className="inline-flex w-full items-center justify-center rounded-full bg-yellow-400 px-8 py-3 text-base font-semibold text-black shadow-lg hover:bg-yellow-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition sm:w-auto"
              >
                Rejoindre la liste d&apos;attente
              </a>
              <a
                href="#comment-ca-marche"
                className="inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-3 text-base font-semibold text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition sm:w-auto"
              >
                Comment ça marche
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="comment-ca-marche"
        className="mx-auto max-w-6xl px-4 py-14 sm:py-16"
      >
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Comment ça marche
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-white/70 sm:text-base">
              Simple, rapide, et pensé pour des souvenirs qui claquent.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Uploade tes photos",
              description:
                "Sélectionne tes meilleurs moments. On s’occupe du reste.",
            },
            {
              step: "2",
              title: "Décris ton souvenir",
              description:
                "Ajoute quelques lignes pour donner le ton et la narration.",
            },
            {
              step: "3",
              title: "Reçois ta BD en 2 minutes",
              description:
                "Une BD prête à partager, télécharger, ou imprimer.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm transition hover:border-yellow-400/30 hover:bg-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-sm font-extrabold text-black">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold">{item.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Pricing
              </h2>
              <p className="mt-2 text-sm text-white/70 sm:text-base">
                Choisis l’offre qui correspond à ton souvenir.
              </p>
            </div>
            <div className="text-xs text-white/60">
              Paiement unique. Pas d’abonnement.
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {[
              {
                name: "Gratuit",
                price: "0€",
                blurb: "Aperçu 3 pages",
                featured: false,
              },
              {
                name: "Digital",
                price: "9.99€",
                blurb: "BD complète PDF",
                featured: true,
              },
              {
                name: "Physique",
                price: "34.99€",
                blurb: "Livre imprimé",
                featured: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={[
                  "rounded-2xl border p-6",
                  plan.featured
                    ? "border-yellow-400/40 bg-yellow-400/10"
                    : "border-white/10 bg-black/30",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                    <p className="mt-1 text-sm text-white/70">{plan.blurb}</p>
                  </div>
                  {plan.featured ? (
                    <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-black">
                      Populaire
                    </span>
                  ) : null}
                </div>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tight">
                    {plan.price}
                  </span>
                </div>

                <a
                  href="#waitlist"
                  className={[
                    "mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                    plan.featured
                      ? "bg-yellow-400 text-black hover:bg-yellow-300"
                      : "border border-white/15 bg-white/5 text-white hover:bg-white/10",
                  ].join(" ")}
                >
                  Rejoindre la liste d&apos;attente
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-center text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div>© {new Date().getFullYear()} L&apos;Instantané</div>
          <div className="text-white/50">Tous droits réservés.</div>
        </div>
      </footer>
    </main>
  )
}