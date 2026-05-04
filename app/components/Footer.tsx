import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0c1220] text-white">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <span className="font-[family-name:var(--font-playfair)] text-xl">L&apos;Instantané</span>
            <p className="text-sm leading-relaxed text-slate-400">
              Tes souvenirs méritent un beau livre. Albums photo premium imprimés et livrés chez toi.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a
                href="https://instagram.com/linstantane_souvenir"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 transition hover:text-white"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C16.67.014 16.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com/@linstantane_souvenir"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 transition hover:text-white"
                aria-label="TikTok"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Pages */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-500">Pages</h4>
            <ul className="flex flex-col gap-3 text-sm text-slate-400">
              <li><Link href="/" className="transition hover:text-white">Accueil</Link></li>
              <li><Link href="/create" className="transition hover:text-white">Créer un album</Link></li>
              <li><Link href="/album-photo-voyage" className="transition hover:text-white">Album voyage</Link></li>
              <li><Link href="/album-photo-mariage" className="transition hover:text-white">Album mariage</Link></li>
              <li><Link href="/album-photo-naissance" className="transition hover:text-white">Album naissance</Link></li>
              <li><Link href="/comment-ca-marche" className="transition hover:text-white">Comment ça marche</Link></li>
              <li><Link href="/faq" className="transition hover:text-white">FAQ</Link></li>
              <li><Link href="/qui-sommes-nous" className="transition hover:text-white">À propos</Link></li>
            </ul>
          </div>

          {/* Infos pratiques */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-500">Infos pratiques</h4>
            <ul className="flex flex-col gap-3 text-sm text-slate-400">
              <li><Link href="/livraison" className="transition hover:text-white">Livraison</Link></li>
              <li><Link href="/politique-de-retour" className="transition hover:text-white">Retours & remboursement</Link></li>
              <li><Link href="/contact" className="transition hover:text-white">Contact & SAV</Link></li>
              <li><Link href="/commandes" className="transition hover:text-white">Suivre ma commande</Link></li>
              <li><Link href="/avis" className="transition hover:text-white">Laisser un avis</Link></li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-500">Légal</h4>
            <ul className="flex flex-col gap-3 text-sm text-slate-400">
              <li><Link href="/cgv" className="transition hover:text-white">CGV</Link></li>
              <li><Link href="/mentions-legales" className="transition hover:text-white">Mentions légales</Link></li>
              <li><Link href="/politique-de-confidentialite" className="transition hover:text-white">Politique de confidentialité</Link></li>
              <li><a href="mailto:linstantane.officiel@gmail.com" className="transition hover:text-white">linstantane.officiel@gmail.com</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-500 sm:flex-row">
          <span>© 2026 L&apos;Instantané · Tous droits réservés</span>
          <div className="flex items-center gap-4">
            <span>Paiement sécurisé</span>
            <span>·</span>
            <span>Satisfait ou remboursé</span>
            <span>·</span>
            <span>Livraison rapide 5–7j</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
