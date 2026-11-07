import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// /panier doit rester public : le panier est en IndexedDB côté client,
// pas besoin de login pour l'afficher (et Google doit pouvoir le crawler).
const isProtected = createRouteMatcher(["/mon-compte(.*)", "/commandes(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Non connecté → NOTRE page /connexion (pas la page hébergée par Clerk),
  // puis retour sur la page demandée.
  if (isProtected(req)) {
    const signIn = new URL("/connexion", req.url);
    signIn.searchParams.set("redirect_url", req.nextUrl.pathname + req.nextUrl.search);
    await auth.protect({ unauthenticatedUrl: signIn.toString() });
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
