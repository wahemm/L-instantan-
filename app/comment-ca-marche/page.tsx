import Link from "next/link";
import Nav from "@/app/components/Nav";

export default function CommentCaMarchePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Nav />

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pb-16 pt-20 text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Comment ça marche
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl italic leading-snug text-slate-900 sm:text-5xl lg:text-6xl">
          Tes souvenirs, sublimés<br />en quelques secondes.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-500">
          L&apos;Instantané transforme tes photos en illustrations cartoon uniques grâce à
          l&apos;intelligence artificielle. Un processus simple, rapide, et le résultat est
          saisissant.
        </p>
        <div className="mt-8">
          <Link
            href="/create"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Essayer maintenant
          </Link>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-[#f8f7f4] py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-14 text-center font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
            Trois étapes, une œuvre d&apos;art
          </h2>

          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                num: "01",
                emoji: "📸",
                title: "Upload tes photos",
                desc: "Sélectionne jusqu&apos;à 10 photos depuis ton téléphone ou ordinateur. Vacances, anniversaire, portrait — tous les moments méritent d&apos;être sublimés. Notre système accepte les formats JPG et PNG.",
              },
              {
                num: "02",
                emoji: "✨",
                title: "Génération IA",
                desc: "Notre modèle d&apos;intelligence artificielle analyse tes photos et les transforme en illustrations cartoon au style cohérent et artistique. Le processus prend entre 30 et 60 secondes par image.",
              },
              {
                num: "03",
                emoji: "🎨",
                title: "Télécharge ou imprime",
                desc: "Tes illustrations sont prêtes en haute résolution. Télécharge-les pour les partager sur les réseaux, ou commande une impression premium pour les accrocher chez toi ou les offrir.",
              },
            ].map((step) => (
              <div key={step.num} className="flex flex-col gap-5">
                <div className="flex items-start gap-4">
                  <span className="font-[family-name:var(--font-playfair)] text-5xl font-bold text-slate-200">
                    {step.num}
                  </span>
                  <span className="mt-1 text-3xl">{step.emoji}</span>
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {step.desc.replace(/&apos;/g, "'")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps visual timeline */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { label: "Upload", sub: "Glisse tes photos", icon: "📂" },
            { label: "Génération", sub: "30–60 secondes", icon: "⚡" },
            { label: "Résultat", sub: "Prêt à télécharger", icon: "🖼️" },
          ].map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f8f7f4] text-3xl">
                {s.icon}
              </div>
              <div className="font-[family-name:var(--font-playfair)] text-lg text-slate-900">
                {s.label}
              </div>
              <div className="text-sm text-slate-400">{s.sub}</div>
              <div className="text-xs font-semibold text-slate-300">
                Étape {i + 1}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why L'Instantané */}
      <section className="bg-[#f8f7f4] py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-14 text-center font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
            Pourquoi L&apos;Instantané ?
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: "🎯",
                title: "Qualité premium",
                desc: "Chaque illustration est générée avec un modèle IA spécialement entraîné pour le rendu cartoon artistique. Les détails, les couleurs et le style sont soignés.",
              },
              {
                icon: "⚡",
                title: "Ultra rapide",
                desc: "30 à 60 secondes par illustration. Pas besoin d&apos;attendre des heures — tes souvenirs sont transformés presque en temps réel.",
              },
              {
                icon: "🔒",
                title: "Tes données, protégées",
                desc: "Tes photos ne sont jamais stockées sur nos serveurs après la génération. Nous prenons la confidentialité de tes souvenirs très au sérieux.",
              },
            ].map((item) => (
              <div key={item.title} className="flex flex-col gap-4">
                <div className="text-4xl">{item.icon}</div>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {item.desc.replace(/&apos;/g, "'")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl italic sm:text-4xl">
            Prêt à sublimer tes souvenirs ?
          </h2>
          <p className="mt-4 text-slate-400">
            Lance-toi maintenant. Les premières illustrations sont générées en moins d&apos;une minute.
          </p>
          <Link
            href="/create"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
          >
            Créer mes illustrations
          </Link>
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
