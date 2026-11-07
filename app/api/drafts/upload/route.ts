import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@clerk/nextjs/server";

/**
 * POST /api/drafts/upload — jeton d'envoi direct vers Vercel Blob pour la
 * sauvegarde d'un album dans le compte (contourne la limite de 4,5 Mo des
 * routes). Réservé aux comptes connectés, et uniquement dans LEUR dossier :
 *   drafts/<userId>/<albumId>/(data|meta).json
 * Le stockage Blob est public : le suffixe aléatoire rend l'adresse
 * introuvable, et seule cette app (jeton serveur) sait lister le dossier.
 */
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await req.json()) as HandleUploadBody;
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        const prefix = `drafts/${userId}/`;
        const rest = pathname.startsWith(prefix) ? pathname.slice(prefix.length) : "";
        if (!/^alb-[a-z0-9-]{6,40}\/(data|meta)\.json$/.test(rest)) {
          throw new Error("Invalid pathname");
        }
        return {
          allowedContentTypes: ["application/json"],
          maximumSizeInBytes: 300 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(json);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
