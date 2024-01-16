import { headers } from 'next/headers'
import type Stripe from 'stripe'

import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('Stripe-Signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    throw new Error(`Webhook Error: ${error.message}`)
  }

  const session = event.data.object as Stripe.Checkout.Session
  const address = session?.customer_details?.address
  const phone = session?.customer_details?.phone || ''

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country
  ]

  const addressString = addressComponents.filter(item => item !== null).join(', ')

  if (event.type === 'checkout.session.completed') {
    // 1. update order record in db
    // const order = await db.order.update({
    //   where: {
    //     id: session?.metadata?.orderId
    //   },
    //   data: {
    //     isPaid: true,
    //     address: addressString,
    //     phone
    //   }
    // })

    // 2. update product status
    // ...
    console.log('checkout.session.completed')
  }

  return new Response(null, { status: 200 })
}
