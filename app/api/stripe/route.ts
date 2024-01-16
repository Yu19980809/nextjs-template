import Stripe from 'stripe'

import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'

export async function POST(req: Request) {
  const {productId} = await req.json()

  if (!productId) {
    throw new Error('Product id is required')
  }

  const product = await db.product.findUnique({
    where: {
      id: productId
    }
  })

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []

  line_items.push({
    quantity: 1,
    price_data: {
      currency: 'USD',
      product_data: {
        name: product?.name!
      },
      unit_amount: product?.price.toNumber()! * 100
    }
  })

  // create order record in db
  // const order = await db.order.create(...)

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    billing_address_collection: 'required',
    phone_number_collection: {
      enabled: true
    },
    success_url: `${process.env.NEXT_PUBLIC_URL}/product?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/product?canceled=1`,
    metadata: {
      productId,
      // orderId: order.id
    }
  })

  return new Response(JSON.stringify({ url: session.url }), { status: 200 })
}
