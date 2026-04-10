import type { Metadata } from "next";
import Nav from "@/app/components/Nav";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de Confidentialité",
  description: "Politique de confidentialité et gestion des données personnelles de L'Instantané.",
  robots: { index: false, follow: false },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Nav />
      <article className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 mb-2">Politique de confidentialit&eacute;</h1>
        <p className="text-sm text-slate-400 mb-12">Derni&egrave;re mise &agrave; jour : avril 2026</p>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">1. Responsable du traitement</h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-1">
            <p><strong>L&apos;Instantan&eacute;</strong></p>
            <p>Entreprise individuelle / auto-entrepreneur</p>
            <p>Si&egrave;ge social : France</p>
            <p>Email : linstantane.officiel@gmail.com</p>
            <p>Site : https://linstantane.vercel.app</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">2. Donn&eacute;es collect&eacute;es</h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-3">
            <p><strong>Donn&eacute;es de compte</strong> &mdash; Nom, pr&eacute;nom, adresse email, mot de passe (g&eacute;r&eacute; par Clerk). Ces donn&eacute;es sont collect&eacute;es lors de la cr&eacute;ation de votre compte.</p>
            <p><strong>Donn&eacute;es de paiement</strong> &mdash; Informations de carte bancaire trait&eacute;es exclusivement par Stripe. L&apos;Instantan&eacute; ne stocke aucune donn&eacute;e bancaire sur ses serveurs.</p>
            <p><strong>Donn&eacute;es de livraison</strong> &mdash; Adresse postale, num&eacute;ro de t&eacute;l&eacute;phone, transmises &agrave; notre partenaire d&apos;impression pour l&apos;exp&eacute;dition de votre commande.</p>
            <p><strong>Photos et contenus</strong> &mdash; Images t&eacute;l&eacute;charg&eacute;es pour la cr&eacute;ation de votre album, stock&eacute;es temporairement sur Vercel Blob Storage.</p>
            <p><strong>Donn&eacute;es techniques</strong> &mdash; Adresse IP, type de navigateur, pages visit&eacute;es, collect&eacute;es automatiquement &agrave; des fins de s&eacute;curit&eacute; et d&apos;am&eacute;lioration du service.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">3. Finalit&eacute;s du traitement</h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2">
            <p>Vos donn&eacute;es sont utilis&eacute;es pour :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>La cr&eacute;ation et la gestion de votre compte utilisateur</li>
              <li>Le traitement et la livraison de vos commandes</li>
              <li>Le paiement s&eacute;curis&eacute; via Stripe</li>
              <li>L&apos;envoi d&apos;emails transactionnels (confirmation de commande, suivi de livraison)</li>
              <li>La g&eacute;n&eacute;ration de couvertures par intelligence artificielle (fonctionnalit&eacute; optionnelle via Replicate)</li>
              <li>L&apos;am&eacute;lioration de nos services et la r&eacute;solution de probl&egrave;mes techniques</li>
              <li>Le respect de nos obligations l&eacute;gales et comptables</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">4. Base l&eacute;gale du traitement</h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2">
            <p><strong>Ex&eacute;cution du contrat</strong> &mdash; Le traitement de vos donn&eacute;es est n&eacute;cessaire &agrave; l&apos;ex&eacute;cution de votre commande (compte, paiement, livraison, cr&eacute;ation d&apos;album).</p>
            <p><strong>Obligation l&eacute;gale</strong> &mdash; Conservation des donn&eacute;es de facturation conform&eacute;ment au Code de commerce et au Code g&eacute;n&eacute;ral des imp&ocirc;ts.</p>
            <p><strong>Int&eacute;r&ecirc;t l&eacute;gitime</strong> &mdash; Am&eacute;lioration du service, s&eacute;curit&eacute; du site, pr&eacute;vention de la fraude.</p>
            <p><strong>Consentement</strong> &mdash; Utilisation de la fonctionnalit&eacute; optionnelle de g&eacute;n&eacute;ration IA, cookies non essentiels.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">5. Dur&eacute;e de conservation</h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2">
            <p><strong>Donn&eacute;es de compte</strong> &mdash; Conserv&eacute;es tant que votre compte est actif, puis supprim&eacute;es dans un d&eacute;lai de 30 jours apr&egrave;s la cl&ocirc;ture du compte.</p>
            <p><strong>Donn&eacute;es de commande et facturation</strong> &mdash; Conserv&eacute;es 10 ans conform&eacute;ment aux obligations comptables l&eacute;gales.</p>
            <p><strong>Photos t&eacute;l&eacute;charg&eacute;es</strong> &mdash; Conserv&eacute;es 30 jours apr&egrave;s la finalisation de la commande, puis supprim&eacute;es automatiquement.</p>
            <p><strong>Donn&eacute;es techniques (logs)</strong> &mdash; Conserv&eacute;es 12 mois maximum.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">6. Sous-traitants et destinataires</h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-3">
            <p>Vos donn&eacute;es peuvent &ecirc;tre transmises aux sous-traitants suivants, strictement dans le cadre des finalit&eacute;s d&eacute;crites ci-dessus :</p>
            <div className="space-y-2">
              <p><strong>Clerk</strong> (authentification) &mdash; Gestion des comptes utilisateurs, connexion s&eacute;curis&eacute;e. Clerk Inc., &Eacute;tats-Unis. Conforme au RGPD via clauses contractuelles types (SCC).</p>
              <p><strong>Stripe</strong> (paiement) &mdash; Traitement s&eacute;curis&eacute; des paiements. Stripe Inc., &Eacute;tats-Unis. Certifi&eacute; PCI-DSS niveau 1, conforme au RGPD.</p>
              <p><strong>Lulu</strong> (impression) &mdash; Fabrication et exp&eacute;dition des albums physiques. Lulu Press Inc., &Eacute;tats-Unis.</p>
              <p><strong>Resend</strong> (emails transactionnels) &mdash; Envoi des emails de confirmation et de suivi. Resend Inc., &Eacute;tats-Unis.</p>
              <p><strong>Vercel</strong> (h&eacute;bergement et stockage) &mdash; H&eacute;bergement du site et stockage temporaire des fichiers. Vercel Inc., &Eacute;tats-Unis.</p>
              <p><strong>Replicate</strong> (IA, optionnel) &mdash; G&eacute;n&eacute;ration de couvertures par intelligence artificielle. Replicate Inc., &Eacute;tats-Unis. Les images transmises ne sont pas conserv&eacute;es par Replicate apr&egrave;s traitement.</p>
            </div>
            <p>Ces sous-traitants sont situ&eacute;s aux &Eacute;tats-Unis et offrent des garanties ad&eacute;quates de protection des donn&eacute;es (clauses contractuelles types, Data Privacy Framework).</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">7. Vos droits</h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-3">
            <p>Conform&eacute;ment au R&egrave;glement G&eacute;n&eacute;ral sur la Protection des Donn&eacute;es (RGPD), vous disposez des droits suivants :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Droit d&apos;acc&egrave;s</strong> &mdash; Obtenir une copie de vos donn&eacute;es personnelles</li>
              <li><strong>Droit de rectification</strong> &mdash; Corriger des donn&eacute;es inexactes ou incompl&egrave;tes</li>
              <li><strong>Droit de suppression</strong> &mdash; Demander l&apos;effacement de vos donn&eacute;es</li>
              <li><strong>Droit &agrave; la portabilit&eacute;</strong> &mdash; Recevoir vos donn&eacute;es dans un format structur&eacute; et lisible</li>
              <li><strong>Droit d&apos;opposition</strong> &mdash; Vous opposer au traitement de vos donn&eacute;es</li>
              <li><strong>Droit &agrave; la limitation</strong> &mdash; Limiter le traitement de vos donn&eacute;es dans certains cas</li>
              <li><strong>Droit de retirer votre consentement</strong> &mdash; &Agrave; tout moment, sans affecter la lic&eacute;it&eacute; du traitement ant&eacute;rieur</li>
            </ul>
            <p>Pour exercer vos droits, contactez-nous &agrave; <strong>linstantane.officiel@gmail.com</strong>. Nous r&eacute;pondrons dans un d&eacute;lai maximum de 30 jours.</p>
            <p>Vous pouvez &eacute;galement introduire une r&eacute;clamation aupr&egrave;s de la CNIL (Commission Nationale de l&apos;Informatique et des Libert&eacute;s) : <strong>www.cnil.fr</strong>.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">8. Cookies</h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-2">
            <p>Ce site utilise des cookies techniques strictement n&eacute;cessaires &agrave; son fonctionnement (authentification via Clerk, session utilisateur). Aucun cookie publicitaire ou de suivi n&apos;est d&eacute;pos&eacute; sans votre consentement.</p>
            <p>Pour en savoir plus, consultez notre <Link href="/mentions-legales" className="underline hover:text-slate-900 transition">page mentions l&eacute;gales</Link>.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">9. S&eacute;curit&eacute; des donn&eacute;es</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            L&apos;Instantan&eacute; met en oeuvre des mesures techniques et organisationnelles appropri&eacute;es pour prot&eacute;ger vos donn&eacute;es personnelles contre tout acc&egrave;s non autoris&eacute;, perte ou destruction : chiffrement HTTPS, authentification s&eacute;curis&eacute;e, acc&egrave;s restreint aux donn&eacute;es, h&eacute;bergement s&eacute;curis&eacute;.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">10. Contact d&eacute;l&eacute;gu&eacute; &agrave; la protection des donn&eacute;es</h2>
          <div className="text-sm leading-relaxed text-slate-600 space-y-1">
            <p>Pour toute question relative &agrave; la protection de vos donn&eacute;es personnelles :</p>
            <p><strong>Email :</strong> linstantane.officiel@gmail.com</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-4">11. Modifications de la politique</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            L&apos;Instantan&eacute; se r&eacute;serve le droit de modifier la pr&eacute;sente politique de confidentialit&eacute; &agrave; tout moment. Toute modification sera publi&eacute;e sur cette page avec la date de mise &agrave; jour. Nous vous invitons &agrave; consulter r&eacute;guli&egrave;rement cette page.
          </p>
        </section>

        <div className="mt-12 border-t border-gray-100 pt-8 flex gap-6 text-sm">
          <Link href="/mentions-legales" className="text-slate-500 hover:text-slate-900 transition">Mentions l&eacute;gales &rarr;</Link>
          <Link href="/cgv" className="text-slate-500 hover:text-slate-900 transition">CGV &rarr;</Link>
          <Link href="/" className="text-slate-500 hover:text-slate-900 transition">Retour &agrave; l&apos;accueil</Link>
        </div>
      </article>

      <footer className="border-t border-gray-100 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-400 sm:flex-row">
          <span className="font-[family-name:var(--font-playfair)] text-slate-900">L&apos;Instantan&eacute;</span>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/mentions-legales" className="transition hover:text-slate-700">Mentions l&eacute;gales</Link>
            <Link href="/cgv" className="transition hover:text-slate-700">CGV</Link>
            <Link href="/politique-de-confidentialite" className="transition hover:text-slate-700">Confidentialit&eacute;</Link>
            <Link href="/faq" className="transition hover:text-slate-700">FAQ</Link>
          </div>
          <span>&copy; 2026 L&apos;Instantan&eacute;</span>
        </div>
      </footer>
    </main>
  );
}
