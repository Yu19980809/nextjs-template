import { headers } from 'next/headers'
import  { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/nextjs/server'

import { db } from '@/lib/db'

export async function POST(req: Request) {
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!CLERK_WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', { status: 400 })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance
  const wh = new Webhook(CLERK_WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature
    }) as WebhookEvent
  } catch (error) {
    console.error('Error verifying webhook:', error)
    return new Response('Error occured', { status: 400 })
  }

  // Get the type
  const eventType = evt.type

  if (eventType === 'user.created') {
    await db.user.create({
      data: {
        externalUserId: payload.data.id,
        username: payload.data.username,
        imageUrl: payload.data.image_url,
        email: payload.data.email_addresses[0].email_address
      }
    })
  }

  if (eventType === 'user.updated') {
    await db.user.update({
      where: {
        externalUserId: payload.data.id
      },
      data: {
        username: payload.data.username,
        imageUrl: payload.data.imageUrl
      }
    })
  }

  if (eventType === 'user.deleted') {
    await db.user.delete({
      where: {
        externalUserId: payload.data.id
      }
    })
  }

  return new Response('', { status: 200 })
}
