'use server'

import { Product } from '@prisma/client'
import { revalidatePath } from 'next/cache'

import { db } from '@/lib/db'
import { getSelf } from '@/lib/auth-service'

export const updateProduct = async (values: Partial<Product>) => {
  try {
    const self = await getSelf()
    const selfProduct = await db.product.findUnique({
      where: {
        userId: self.id
      }
    })

    if (!selfProduct) {
      throw new Error('Product not found')
    }

    const updatedProduct = await db.product.update({
      where: {
        id: selfProduct.id
      },
      data: {
        imageUrl: values.imageUrl
      }
    })

    revalidatePath('/product')

    return updatedProduct
  } catch (error) {
    console.log('PRODUCT_UPDATE', error)
    throw new Error('Internal Error')
  }
}

export const generateProduct = async () => {
  try {
    const self = await getSelf()

    if (!self) {
      throw new Error('Unauthorized')
    }

    const product = await db.product.create({
      data: {
        userId: self.id,
        name: 'test product',
        price: 9.9
      }
    })

    return product
  } catch (error) {
    console.log('PRODUCT_GENERATE', error)
    throw new Error('Internal Error')
  }
}
