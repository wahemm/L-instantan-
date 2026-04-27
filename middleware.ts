import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// /panier doit rester public : le panier est en IndexedDB côté client,
// pas besoin de login pour l'afficher (et Google doit pouvoir le crawler).
const isProtected = createRouteMatcher(["/mon-compte(.*)", "/commandes(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
