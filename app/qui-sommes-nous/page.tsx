import Link from "next/link";
import Nav from "@/app/components/Nav";

export default function QuiSommesNousPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Nav />

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pb-16 pt-20 text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Notre histoire
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl italic leading-snug text-slate-900 sm:text-5xl lg:text-6xl">
          Transformer chaque souvenir<br />en œuvre d&apos;art unique.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-500">
          L&apos;Instantané est né d&apos;une conviction simple : tes souvenirs méritent
          mieux qu&apos;une galerie photo sur ton téléphone. Ils méritent d&apos;être
          sublimés, encadrés, partagés.
        </p>
      </section>

      {/* Story */}
      <section className="bg-[#f8f7f4] py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900">
            L&apos;histoire du projet
          </h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-slate-500">
            <p>
              Tout a commencé lors d&apos;un voyage au Japon. Des centaines de photos,
              des souvenirs plein la tête — mais une fois rentré, plus personne ne
              les regardait vraiment. Noyées dans le flux des réseaux, perdues dans
              un dossier intitulé &quot;Vacances 2024&quot;.
            </p>
            <p>
              L&apos;idée était là : et si on pouvait transformer ces instants en
              quelque chose de visuel, de personnel, d&apos;artistique ? Quelque chose
              qu&apos;on voudrait accrocher au mur ou offrir à ses proches ?
            </p>
            <p>
              L&apos;Instantané a été créé pour répondre à ce besoin. En combinant
              des modèles d&apos;intelligence artificielle de dernière génération
              avec un sens aigu de l&apos;esthétique, on a construit un outil qui
              transforme tes photos ordinaires en illustrations cartoon dignes
              des plus beaux albums.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-14 text-center font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
          Nos valeurs
        </h2>
        <div className="grid gap-10 md:grid-cols-3">
          {[
            {
              icon: "🎨",
              title: "Qualité avant tout",
              desc: "Chaque illustration est le résultat d'un modèle IA soigneusement entraîné. On ne compromet jamais sur la qualité du rendu — parce que tes souvenirs le méritent.",
            },
            {
              icon: "✦",
              title: "Simplicité radicale",
              desc: "Uploader une photo et recevoir une illustration en 60 secondes. Pas d'inscription compliquée, pas de logiciel à installer. La magie accessible à tous.",
            },
            {
              icon: "💛",
              title: "L'émotion au cœur",
              desc: "Derrière chaque photo, il y a une histoire. Notre mission est de faire ressortir cette émotion, de la sublimer, de la rendre visible et partageable.",
            },
          ].map((v) => (
            <div key={v.title} className="flex flex-col gap-4">
              <div className="text-4xl">{v.icon}</div>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900">
                {v.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-500">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Numbers */}
      <section className="bg-[#f8f7f4] py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-14 text-center font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
            L&apos;Instantané en chiffres
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "30 sec", label: "Temps de génération moyen" },
              { value: "3 packs", label: "Pour tous les besoins" },
              { value: "10 photos", label: "Maximum par session" },
              { value: "France", label: "Livraison impression premium" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm"
              >
                <span className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900">
                  {stat.value}
                </span>
                <span className="text-sm text-slate-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl italic sm:text-4xl">
            Rejoins l&apos;aventure
          </h2>
          <p className="mt-4 text-slate-400">
            Donne une nouvelle vie à tes souvenirs. En quelques secondes.
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
