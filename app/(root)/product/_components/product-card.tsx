'use client'

import { useEffect, useState, useTransition } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Product } from '@prisma/client'
import { toast } from 'sonner'
import axios from 'axios'
import { Trash } from 'lucide-react'

import { generateProduct, updateProduct } from '@/actions/product'
import { UploadDropzone } from '@/lib/uploadthing'
import { Button } from '@/components/ui/button'
import { Hint } from '@/components/hint'

const ProductCard = ({
  data
}: {
  data: Product | null
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(false)
  const [isPurchased, setIsPurchased] = useState(false)

  useEffect(() => {
    if (searchParams.get('success')) {
      setIsPurchased(true)
      toast.success('Payment completed')
      // clear cart
    }

    if (searchParams.get('canceled')) {
      toast.error('Something went wrong')
    }
  }, [searchParams])

  const onGenerate = () => {
    startTransition(() => {
      generateProduct()
        .then(() => {
          router.refresh()
          toast.success('Product generated')
        })
        .catch(() => toast.error('Something went wrong'))
    })
  }

  const onRemove = () => {
    startTransition(() => {
      updateProduct({ imageUrl: null })
        .then(() => {
          router.refresh()
          toast.success('Image uploaded')
        })
        .catch(() => toast.error('Something went wrong'))
    })
  }

  const onUpload = (imageUrl: string) => {
    startTransition(() => {
      updateProduct({ imageUrl })
        .then(() => {
          router.refresh()
          toast.success('Image uploaded')
        })
        .catch(() => toast.error('Something went wrong'))
    })
  }

  const onPurchase = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post('/api/stripe', { productId: data!.id })
      window.location.href = response.data.url
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {!data && (
        <Button
          onClick={onGenerate}
          disabled={isPending}
        >
          Generate
        </Button>
      )}

      {data && !data.imageUrl && (
        <div className="w-[300px] rounded-xl border outline-dashed outline-muted">
          <UploadDropzone
            endpoint="productImage"
            appearance={{
              label: {
                color: "#FFFFFF"
              },
              allowedContent: {
                color: "#FFFFFF"
              }
            }}
            onClientUploadComplete={(res) => onUpload(res?.[0]?.url)}
          />
        </div>
      )}

      {data && data.imageUrl && (
        <div className="flex flex-col gap-y-4">
          <div className="relative group aspect-video rounded-xl overflow-hidden border border-white/10">
            <div className="absolute top-2 right-2 opacity-0 transition z-[10] group-hover:opacity-100">
              <Hint label="Remove image" side="left" asChild>
                <Button
                  type="button"
                  onClick={onRemove}
                  disabled={isPending}
                  className="h-auto w-auto p-1.5"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </Hint>
            </div>

            <Image
              alt="Image"
              src={data.imageUrl}
              fill
              className="object-cover"
            />
          </div>

          <Button
            onClick={onPurchase}
            disabled={isLoading || isPurchased}
            variant="primary"
          >
            Purchase
          </Button>
        </div>
      )}
    </>
  )
}

export default ProductCard
