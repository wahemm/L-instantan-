import { currentUser } from "@clerk/nextjs/server";

// Comptes autorisés sur les outils d'admin (secours des commandes…)
const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS ?? "hbbhugo.thomas@gmail.com,linstantane.officiel@gmail.com")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
);

/**
 * Adresse email principale ET vérifiée de l'utilisateur connecté, sinon null.
 *
 * Ne jamais se fier à `emailAddresses[0]` : un compte peut contenir une
 * adresse ajoutée mais jamais vérifiée (celle de quelqu'un d'autre), qui
 * donnerait accès à ses commandes ou aux outils d'admin.
 */
export function verifiedEmailOf(user: Awaited<ReturnType<typeof currentUser>>): string | null {
  const primary = user?.primaryEmailAddress;
  if (!primary || primary.verification?.status !== "verified") return null;
  return primary.emailAddress;
}

export async function currentVerifiedEmail(): Promise<string | null> {
  return verifiedEmailOf(await currentUser());
}

/** Email de l'admin connecté, ou null si la personne n'est pas admin. */
export async function currentAdminEmail(): Promise<string | null> {
  const email = (await currentVerifiedEmail())?.toLowerCase();
  return email && ADMIN_EMAILS.has(email) ? email : null;
}
