import Stripe from 'stripe'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

type ProductKey = 'digital' | 'physique' | 'complet'

const PRODUCTS: Record<
  ProductKey,
  { name: string; description: string; unitAmountCents: number }
> = {
  digital: {
    name: "L'Instantané - Offre Digital",
    description: 'BD complete en PDF',
    unitAmountCents: 999,
  },
  physique: {
    name: "L'Instantané - Offre Physique",
    description: 'Livre imprime de ta BD',
    unitAmountCents: 3499,
  },
  complet: {
    name: "L'Instantané - Version Complete",
    description: 'Pack complet Digital + Physique',
    unitAmountCents: 3999,
  },
}

function normalizeProduct(input: string | null): ProductKey | null {
  if (!input) return null
  if (input === 'complete') return 'complet'
  if (input === 'digital' || input === 'physique' || input === 'complet') return input
  return null
}

export async function GET(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json(
      { error: 'Missing STRIPE_SECRET_KEY' },
      { status: 500 }
    )
  }

  const reqUrl = new URL(req.url)
  const productKey = normalizeProduct(reqUrl.searchParams.get('product'))

  if (!productKey) {
    return NextResponse.json(
      { error: 'Invalid product. Use digital, physique, or complet.' },
      { status: 400 }
    )
  }

  const product = PRODUCTS[productKey]
  const stripe = new Stripe(secretKey)

  const origin = reqUrl.origin
  const successUrl = `${origin}/result?checkout=success&session_id={CHECKOUT_SESSION_ID}`
  const cancelUrl = `${origin}/create?checkout=cancelled`

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: product.unitAmountCents,
          product_data: {
            name: product.name,
            description: product.description,
          },
        },
      },
    ],
    metadata: {
      product: productKey,
    },
  })

  if (!session.url) {
    return NextResponse.json(
      { error: 'Unable to create Stripe Checkout session.' },
      { status: 500 }
    )
  }

  return NextResponse.redirect(session.url, { status: 303 })
}

