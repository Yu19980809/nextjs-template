import { getProduct } from '@/lib/product-service'
import ProductCard from './_components/product-card'

const ProductPage = async () => {
  const product = await getProduct()

  return (
    <div className="p-4">
      <ProductCard data={product} />
    </div>
  )
}

export default ProductPage