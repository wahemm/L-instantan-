import { clerkMiddleware } from "@clerk/nextjs/server";

// Pour activer la protection, décommenter les lignes ci-dessous
// const isProtectedRoute = createRouteMatcher(["/create(.*)", "/result(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
