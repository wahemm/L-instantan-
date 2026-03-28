import Link from "next/link";
import Nav from "@/app/components/Nav";

export default function CommentCaMarchePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Nav />

      <section className="mx-auto max-w-4xl px-6 pb-16 pt-20 text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Comment ça marche
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl italic leading-snug text-slate-900 sm:text-5xl lg:text-6xl">
          Tes souvenirs méritent
          <br />
          un beau livre.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-500">
          L&apos;Instantané transforme tes photos en un album premium imprimé. Uploade tes
          photos, personnalise la mise en page, et reçois ton livre chez toi.
        </p>
        <div className="mt-8">
          <Link
            href="/create"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Créer mon album
          </Link>
        </div>
      </section>

      <section className="bg-[#f8f7f4] py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-14 text-center font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
            Trois étapes, un bel album
          </h2>

          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                num: "01",
                emoji: "📸",
                title: "Upload tes photos",
                desc: "Sélectionne tes meilleurs moments depuis ton téléphone ou ordinateur. Vacances, anniversaire, portrait — tous les moments comptent.",
              },
              {
                num: "02",
                emoji: "🎨",
                title: "Personnalise ton album",
                desc: "Choisis la mise en page automatique ou crée toi-même : place tes photos, choisis le layout de chaque page, ajoute des légendes.",
              },
              {
                num: "03",
                emoji: "📖",
                title: "Reçois ton livre",
                desc: "Commande ton album imprimé sur papier photo premium 170g/m², couverture rigide. Livraison en France sous 5 à 7 jours.",
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
                <p className="text-sm leading-relaxed text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { label: "Upload", sub: "Glisse tes photos", icon: "📂" },
            { label: "Mise en page", sub: "Auto ou manuelle", icon: "🎨" },
            { label: "Livraison", sub: "5 à 7 jours", icon: "📦" },
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
              <div className="text-xs font-semibold text-slate-300">Étape {i + 1}</div>
            </div>
          ))}
        </div>
      </section>

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
                desc: "Papier photo 170g/m² brillant, couverture rigide, finition soignée. Un album digne des meilleurs imprimeurs professionnels.",
              },
              {
                icon: "✨",
                title: "Simple et rapide",
                desc: "Uploade tes photos, choisis ta mise en page et commande. Ton album est prêt en quelques minutes, livré en quelques jours.",
              },
              {
                icon: "🔒",
                title: "Tes données, protégées",
                desc: "Tes photos sont traitées localement dans ton navigateur. Rien n'est envoyé ni stocké sur nos serveurs.",
              },
            ].map((item) => (
              <div key={item.title} className="flex flex-col gap-4">
                <div className="text-4xl">{item.icon}</div>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl italic sm:text-4xl">
            Prêt à créer ton album ?
          </h2>
          <p className="mt-4 text-slate-400">
            Tu vois le résultat avant de payer. Lance-toi maintenant.
          </p>
          <Link
            href="/create"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
          >
            Créer mon album
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-100 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-400 sm:flex-row">
          <span className="font-[family-name:var(--font-playfair)]">L&apos;Instantané</span>
          <div className="flex gap-6">
            <Link href="/comment-ca-marche" className="transition hover:text-slate-700">
              Comment ça marche
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
