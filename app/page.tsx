import Link from "next/link";
import Nav from "@/app/components/Nav";

const PLANS = [
  {
    id: "digital",
    name: "Digital",
    price: "10 €",
    note: "BD complète PDF",
    perks: ["BD complète haute résolution", "PDF prêt à partager", "Téléchargement immédiat"],
    featured: false,
  },
  {
    id: "physique",
    name: "Physique",
    price: "35 €",
    note: "Livre imprimé",
    perks: ["Livre imprimé finition premium", "Livraison en France", "Pour offrir ou garder"],
    featured: true,
  },
  {
    id: "duo",
    name: "Duo",
    price: "40 €",
    note: "Digital + Physique",
    perks: ["Pack Digital inclus", "Livre imprimé inclus", "Meilleure valeur"],
    featured: false,
  },
];

const TESTIMONIALS = [
  {
    name: "Camille",
    role: "Pack Physique",
    quote:
      "On a envoyé les photos du week-end et on a reçu des illustrations magnifiques. Un souvenir inoubliable.",
  },
  {
    name: "Yanis",
    role: "Pack Digital",
    quote:
      "En moins d'une minute j'avais mes illustrations cartoon. Le rendu est bluffant, vraiment premium.",
  },
  {
    name: "Sarah",
    role: "Pack Duo",
    quote:
      "Offrir le livre imprimé à ma mère pour son anniversaire, c'était le cadeau parfait. Elle a adoré.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Nav />

      {/* Hero — fond noir avec gradient */}
      <section className="relative overflow-hidden bg-slate-900 px-6 py-24 text-white sm:py-32">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Photos → Illustrations cartoon
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl italic leading-snug text-white sm:text-5xl lg:text-6xl">
            Tes souvenirs, sublimés<br />en illustrations uniques.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Envoie tes photos et reçois des illustrations cartoon HD en quelques secondes. Parfait pour imprimer, offrir ou partager.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/create"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Créer mes illustrations
            </Link>
            <Link
              href="/comment-ca-marche"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Comment ça marche
            </Link>
          </div>
        </div>
      </section>

      {/* Avant / Après */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            La transformation
          </p>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
            Avant / Après
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            De la photo ordinaire à l&apos;illustration cartoon premium, en quelques secondes.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Avant */}
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-100 bg-[#f8f7f4] p-8 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Avant — Photo originale
            </span>
            <div className="w-full aspect-[4/3] rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-3">📸</div>
                <p className="text-sm font-medium text-slate-500">Ta photo</p>
                <p className="text-xs text-slate-400 mt-1">JPG ou PNG</p>
              </div>
            </div>
          </div>

          {/* Après */}
          <div className="relative flex flex-col items-center gap-4 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="absolute -top-3 right-5">
              <span className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white shadow-sm">
                Cartoon HD
              </span>
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Après — Illustration cartoon
            </span>
            <div className="w-full aspect-[4/3] rounded-xl bg-gradient-to-br from-amber-100 via-rose-100 to-sky-100 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-3">🎨</div>
                <p className="text-sm font-medium text-slate-700">Illustration cartoon</p>
                <p className="text-xs text-slate-400 mt-1">Style premium, haute résolution</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="bg-[#f8f7f4] py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Simple et rapide
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
              Comment ça marche
            </h2>
          </div>

          <ol className="grid gap-6 md:grid-cols-3">
            {[
              {
                num: "01",
                title: "Upload tes photos",
                desc: "Sélectionne tes meilleurs moments depuis ton téléphone ou ordinateur.",
              },
              {
                num: "02",
                title: "Génération IA",
                desc: "Notre IA transforme chaque photo en illustration cartoon en 30 à 60 secondes.",
              },
              {
                num: "03",
                title: "Télécharge ou imprime",
                desc: "Partage tes illustrations sur les réseaux ou commande un livre imprimé premium.",
              },
            ].map((step) => (
              <li key={step.num} className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                <span className="font-[family-name:var(--font-playfair)] text-5xl font-bold text-slate-100">
                  {step.num}
                </span>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Nos offres
          </p>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
            Paiement unique, sans abonnement
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-500">
            Choisis le pack qui correspond à tes souvenirs.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <article
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                plan.featured
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-gray-100 bg-white shadow-sm"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-white px-4 py-1 text-xs font-semibold text-slate-900 shadow-sm">
                    Populaire
                  </span>
                </div>
              )}

              <h3
                className={`font-[family-name:var(--font-playfair)] text-2xl ${
                  plan.featured ? "text-white" : "text-slate-900"
                }`}
              >
                {plan.name}
              </h3>
              <p
                className={`mt-1 text-sm ${
                  plan.featured ? "text-slate-400" : "text-slate-400"
                }`}
              >
                {plan.note}
              </p>

              <div className="my-6 flex items-end gap-1">
                <span
                  className={`font-[family-name:var(--font-playfair)] text-4xl ${
                    plan.featured ? "text-white" : "text-slate-900"
                  }`}
                >
                  {plan.price}
                </span>
                <span className={`mb-1 text-xs ${plan.featured ? "text-slate-400" : "text-slate-400"}`}>
                  one-shot
                </span>
              </div>

              <ul className="mb-8 flex flex-col gap-2.5">
                {plan.perks.map((perk) => (
                  <li
                    key={perk}
                    className={`flex items-start gap-2 text-sm ${
                      plan.featured ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    <span className={`mt-0.5 shrink-0 ${plan.featured ? "text-slate-400" : "text-slate-300"}`}>
                      ✓
                    </span>
                    {perk}
                  </li>
                ))}
              </ul>

              <Link
                href="/create"
                className={`mt-auto inline-flex items-center justify-center rounded-full py-3 text-sm font-medium transition ${
                  plan.featured
                    ? "bg-white text-slate-900 hover:bg-slate-100"
                    : "bg-slate-900 text-white hover:bg-slate-700"
                }`}
              >
                Commencer
              </Link>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-slate-400">
          Paiement sécurisé. Satisfait ou remboursé.
        </p>
      </section>

      {/* Témoignages */}
      <section className="bg-[#f8f7f4] py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Ils ont testé
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
              Témoignages
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <blockquote
                key={t.name}
                className="flex flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
              >
                <p className="flex-1 text-sm leading-relaxed text-slate-600">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.role}</div>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-slate-900 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl italic sm:text-4xl">
            Prêt à sublimer tes souvenirs ?
          </h2>
          <p className="mt-4 text-slate-400">
            Lance-toi maintenant. Tes illustrations prêtes en moins d&apos;une minute.
          </p>
          <Link
            href="/create"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-10 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Créer mes illustrations
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-400 sm:flex-row">
          <span className="font-[family-name:var(--font-playfair)] text-slate-900">
            L&apos;Instantané
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/comment-ca-marche" className="transition hover:text-slate-700">
              Comment ça marche
            </Link>
            <Link href="/shop" className="transition hover:text-slate-700">
              Illustrations
            </Link>
            <Link href="/faq" className="transition hover:text-slate-700">
              FAQ
            </Link>
            <Link href="/qui-sommes-nous" className="transition hover:text-slate-700">
              À propos
            </Link>
          </div>
          <span>© 2026 L&apos;Instantané</span>
        </div>
      </footer>
    </main>
  );
}
