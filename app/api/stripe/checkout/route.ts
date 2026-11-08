import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getGelatoShippingQuote } from "@/app/lib/gelato";
import { calculatePrice as albumPrice, INCLUDED_PAGES, shippingCharge } from "@/app/lib/pricing";

const stripeKey = (process.env.STRIPE_SECRET_KEY ?? "").trim();
const stripe = new Stripe(stripeKey, {
  timeout: 20000,
  maxNetworkRetries: 0,
  httpClient: Stripe.createNodeHttpClient(),
});

// Prix et livraison : mêmes règles que /result (app/lib/pricing.ts).
// Tarif Gelato de secours par pays si le devis est indisponible.
const FALLBACK_GELATO_SHIPPING: Record<string, number> = { FR: 9.27, BE: 7.38, LU: 9.15, CH: 10.09, MC: 25.12 };

/** PDF d'album déposé sur notre Vercel Blob (cf. /api/upload-pdf). */
function isStoredAlbumPdf(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:"
      && u.hostname.endsWith(".public.blob.vercel-storage.com")
      && u.pathname.startsWith("/albums/")
      && u.pathname.endsWith(".pdf");
  } catch {
    return false;
  }
}

// Pays livrables (= sélecteur de /result)
const SHIP_COUNTRIES = ["FR", "BE", "CH", "LU", "MC"] as const;
type ShipCountry = (typeof SHIP_COUNTRIES)[number];

function calculatePrice(pageCount: number): number {
  return Math.round(albumPrice("physique", pageCount) * 100);
}

/** Recompute shipping server-side instead of trusting the client. Returns both
 *  the cents to charge and the Gelato shipment method to pin on the order, so
 *  the customer pays for exactly the method that will be shipped. Falls back to
 *  a sane default (8.60€, no pinned method) if the quote is unreachable so
 *  checkout never blocks on a transient outage. */
async function calculateShipping(
  pageCount: number,
  countryCode: string
): Promise<{ cents: number; methodUid: string | null }> {
  try {
    const quote = await getGelatoShippingQuote(pageCount, countryCode);
    if (quote && quote.price > 0 && quote.price < 100) {
      return { cents: Math.round(shippingCharge(quote.price) * 100), methodUid: quote.shipmentMethodUid };
    }
  } catch (err) {
    console.error("[Checkout] Shipping recalc failed, using fallback:", err);
  }
  const fallback = FALLBACK_GELATO_SHIPPING[countryCode] ?? FALLBACK_GELATO_SHIPPING.FR;
  return { cents: Math.round(shippingCharge(fallback) * 100), methodUid: null };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawPageCount = typeof body.pageCount === "number" ? body.pageCount : INCLUDED_PAGES;
    // Mirror Gelato's real limits (even count, floor 32, ceiling 200) so the
    // charge is based on the exact page count that gets printed — and therefore
    // equals the price shown to the customer on /result (same flooring there).
    const clampedPages = Math.min(Math.max(Math.round(rawPageCount), 2), 200);
    const pageCount = Math.max(
      INCLUDED_PAGES,
      clampedPages % 2 === 0 ? clampedPages : clampedPages + 1
    );
    const albumTitle = (body.albumTitle as string)?.slice(0, 200) || "Mon Album";
    const interiorUrl = (body.interiorUrl as string) || "";
    const coverUrl = (body.coverUrl as string) || "";
    // Pays chiffré sur /result. Stripe n'acceptera qu'une adresse dans CE pays :
    // sinon un client pourrait payer la livraison France et se faire livrer en
    // Suisse (prix faux + méthode Gelato épinglée inadaptée).
    const requestedCountry = (body.shippingCountry as string)?.slice(0, 2).toUpperCase();
    const shippingCountry: ShipCountry = SHIP_COUNTRIES.includes(requestedCountry as ShipCountry)
      ? (requestedCountry as ShipCountry)
      : "FR";

    // Fichiers d'impression OBLIGATOIRES et hébergés sur notre stockage : on ne
    // crée jamais un paiement qui ne pourrait pas être imprimé.
    if (!isStoredAlbumPdf(interiorUrl) || !isStoredAlbumPdf(coverUrl)) {
      return NextResponse.json({ error: "Fichiers d'impression manquants ou invalides" }, { status: 400 });
    }

    // Recompute shipping cost server-side. Never trust the client value: a
    // tampered request could send shippingCents=0 for an expensive country.
    const { cents: shippingCents, methodUid: shipmentMethodUid } =
      await calculateShipping(pageCount, shippingCountry);

    const origin = req.headers.get("origin") ?? "http://localhost:3000";
    const albumCents = calculatePrice(pageCount);
    const pageDesc = pageCount > INCLUDED_PAGES ? ` (${pageCount} pages)` : "";

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: albumCents,
          product_data: {
            name: `Album Photo — L'Instantané${pageDesc}`,
            description: `Album "${albumTitle}" · Hardcover 21×28 cm · Papier satiné premium 170 g/m²`,
          },
        },
      },
    ];

    if (shippingCents > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: shippingCents,
          product_data: {
            name: "Supplément livraison",
            description: `Livraison suivie vers ${shippingCountry} (au-delà de la livraison offerte)`,
          },
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_creation: "always",
      shipping_address_collection: {
        allowed_countries: [shippingCountry],
      },
      // Téléphone : utilisé par le transporteur (avis de passage, souci de
      // livraison). Sans lui, Gelato reçoit un numéro factice.
      phone_number_collection: { enabled: true },
      line_items: lineItems,
      metadata: {
        pack: "physique",
        pageCount: String(pageCount),
        albumTitle,
        interiorUrl,
        coverUrl,
        shippingCountry,
        shipmentMethodUid: shipmentMethodUid ?? "",
      },
      success_url: `${origin}/result?success=true`,
      cancel_url: `${origin}/result`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
