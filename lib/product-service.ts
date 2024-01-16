import { getSelf } from '@/lib/auth-service'
import { db } from '@/lib/db'

export const getProduct = async () => {
  const self = await getSelf()

  if (!self) {
    throw new Error('Unauthorized')
  }

  const product = await db.product.findUnique({
    where: {
      userId: self.id
    }
  })

  return product
}
