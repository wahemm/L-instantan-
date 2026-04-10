import Link from "next/link";
import Nav from "@/app/components/Nav";

export default function QuiSommesNousPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Nav />

      <section className="mx-auto max-w-4xl px-6 pb-16 pt-20 text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Notre histoire</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl italic leading-snug text-slate-900 sm:text-5xl lg:text-6xl">
          Chaque souvenir mérite
          <br />
          de durer.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-500">
          L&apos;Instantané est né d&apos;une conviction simple : tes souvenirs méritent mieux
          qu&apos;une galerie photo sur ton téléphone. Ils méritent un beau livre, qu&apos;on
          feuillette, qu&apos;on offre, qu&apos;on garde.
        </p>
      </section>

      <section className="bg-[#f8f7f4] py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900">
            L&apos;histoire du projet
          </h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-slate-500">
            <p>
              Tout a commencé lors d&apos;un voyage. Des centaines de photos, des souvenirs
              plein la tête — mais une fois rentré, plus personne ne les regardait vraiment.
              Noyées dans la galerie du téléphone, oubliées dans un dossier quelque part.
            </p>
            <p>
              L&apos;idée était là : et si on pouvait transformer ces instants en quelque chose
              de tangible ? Un objet qu&apos;on pose sur sa table basse, qu&apos;on offre à ses
              proches, dont on est fier.
            </p>
            <p>
              L&apos;Instantané a été créé pour répondre à ce besoin. Un service simple,
              accessible, qui transforme tes photos en beau livre premium — sans prise de tête,
              sans logiciel à installer, livré directement chez toi.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-14 text-center font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
          Nos valeurs
        </h2>
        <div className="grid gap-10 md:grid-cols-3">
          {[
            {
              icon: "📖",
              title: "L'objet avant tout",
              desc: "Un album photo doit être beau, durable, qu'on a envie de toucher. On ne compromet jamais sur la qualité du papier, de l'impression ou de la reliure.",
            },
            {
              icon: "✦",
              title: "Simplicité radicale",
              desc: "Uploader ses photos, ajouter un titre, voir l'aperçu et commander. Pas d'inscription compliquée, pas de logiciel. Un album prêt en quelques minutes.",
            },
            {
              icon: "💛",
              title: "L'émotion au cœur",
              desc: "Derrière chaque photo, il y a une histoire. Notre mission est de faire de ces instants un objet précieux, qu'on garde et qu'on transmet.",
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

      <section className="bg-[#f8f7f4] py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-14 text-center font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
            Ce qu&apos;on vous garantit
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "A4", label: "Format premium 21×28 cm" },
              { value: "170g", label: "Papier photo brillant" },
              { value: "5–7j", label: "Délai de livraison" },
              { value: "14j", label: "Satisfait ou remboursé" },
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

      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Qualité & fabrication</p>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">Notre promesse</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            { icon:"📐", title:"Format A4, couverture rigide", desc:"21 × 28 cm, reliure cousue, couverture cartonnée. Un objet solide, conçu pour durer des années." },
            { icon:"✨", title:"Papier photo 170g/m²", desc:"Impression offset sur papier brillant premium. Le rendu des couleurs est fidèle à tes photos." },
            { icon:"🎨", title:"Éditeur intuitif", desc:"Place tes photos librement, choisis ta mise en page, ajoute du texte n'importe où. Aucune compétence requise." },
            { icon:"🔒", title:"Paiement sécurisé, sans surprise", desc:"Tu vois l'aperçu complet avant de payer. Remboursé sous 14 jours si tu n'es pas satisfait, sans conditions." },
          ].map(item => (
            <div key={item.title} className="flex gap-4 rounded-2xl border border-gray-100 p-6">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl italic sm:text-4xl">
            Crée ton premier album
          </h2>
          <p className="mt-4 text-slate-400">Tu vois le résultat avant de payer.</p>
          <Link
            href="/shop"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
          >
            Créer mon album →
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
