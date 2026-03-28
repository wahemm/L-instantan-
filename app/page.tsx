import Image from "next/image";
import Link from "next/link";
import Nav from "@/app/components/Nav";

const DEMOS = [
  { src: "/demos/provence.png", alt: "Album Provence Lavande" },
  { src: "/demos/italie.png", alt: "Album Italie Dolce Vita" },
  { src: "/demos/miami.png", alt: "Album Miami Plage" },
  { src: "/demos/espagne.png", alt: "Album Espagne Soleil" },
  { src: "/demos/marrakech.png", alt: "Album Marrakech Soleil" },
];

const PLANS = [
  {
    id: "digital",
    name: "Digital",
    price: "10 €",
    note: "Album PDF HD",
    perks: ["Album haute résolution", "PDF prêt à partager", "Téléchargement immédiat"],
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
      "On a envoyé les photos du week-end et le livre est magnifique. Un souvenir inoubliable à feuilleter.",
  },
  {
    name: "Yanis",
    role: "Pack Digital",
    quote:
      "En quelques minutes j'avais mon album prêt. La mise en page est top, vraiment premium.",
  },
  {
    name: "Sarah",
    role: "Pack Duo",
    quote:
      "Offrir le livre imprimé à ma mère pour son anniversaire, c'était le cadeau parfait. Elle a adoré.",
  },
];

const ALBUM_TYPES = [
  { title: "Voyage", desc: "Rassemble tes plus beaux moments de voyage dans un album élégant." },
  { title: "Famille", desc: "Réunions, fêtes, moments du quotidien — un livre pour toute la famille." },
  { title: "Couple", desc: "Vos souvenirs à deux dans un bel objet à garder ou à offrir." },
  { title: "Événement", desc: "Mariage, anniversaire, soirée — immortalise chaque moment important." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Nav />

      {/* Hero */}
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
            Photos → Album premium
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl italic leading-snug text-white sm:text-5xl lg:text-6xl">
            Tes souvenirs méritent
            <br />
            un beau livre.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Uploade tes photos et crée un album premium en quelques minutes. Papier photo brillant, couverture rigide, livré chez toi.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/create"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Créer mon album
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

      {/* Showcase albums */}
      <section className="bg-[#f8f7f4] py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Nos créations
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
              Des albums pour chaque destination
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500">
              Provence, Italie, Miami, Espagne, Marrakech… Chaque voyage mérite son beau livre.
            </p>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {DEMOS.map((demo) => (
              <div
                key={demo.alt}
                className="shrink-0 snap-center overflow-hidden rounded-2xl shadow-lg transition hover:shadow-2xl"
                style={{ width: 400 }}
              >
                <Image
                  src={demo.src}
                  alt={demo.alt}
                  width={800}
                  height={560}
                  className="h-auto w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Types d'albums */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Pour chaque occasion
          </p>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
            Un album pour chaque moment
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            Quel que soit le souvenir, on en fait un beau livre.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ALBUM_TYPES.map((t) => (
            <div
              key={t.title}
              className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-[#f8f7f4] p-6 shadow-sm"
            >
              <h3 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900">
                {t.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-500">{t.desc}</p>
            </div>
          ))}
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
                title: "Personnalise ton album",
                desc: "Choisis ta mise en page automatique ou personnalise chaque page toi-même.",
              },
              {
                num: "03",
                title: "Reçois ton livre",
                desc: "Commande ton album imprimé premium, livré chez toi en 5 à 7 jours.",
              },
            ].map((step) => (
              <li
                key={step.num}
                className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
              >
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
              <p className={`mt-1 text-sm ${plan.featured ? "text-slate-400" : "text-slate-400"}`}>
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
                  paiement unique
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
                    <span
                      className={`mt-0.5 shrink-0 ${plan.featured ? "text-slate-400" : "text-slate-300"}`}
                    >
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
          Paiement sécurisé. Satisfait ou remboursé sous 14 jours.
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
            Crée ton album en quelques minutes. Tu vois le résultat avant de payer.
          </p>
          <Link
            href="/create"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-10 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Créer mon album
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
              Albums
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
