import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductGallery } from '@/components/product/product-gallery'
import { ProductInfo } from '@/components/product/product-info'
import { RelatedProducts } from '@/components/product/related-products'
import { Breadcrumb } from '@/components/common/breadcrumb'
import { getProductBySlug } from '@/lib/supabase/products'

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const product = await getProductBySlug(params.slug)

    if (!product) {
      return {
        title: 'Product Not Found - It\'s Your Choice'
      }
    }

    return {
      title: `${product.name} - It\'s Your Choice`,
      description: product.description || `Buy ${product.name} at It\'s Your Choice`,
    }
  } catch (error) {
    return {
      title: 'Product - It\'s Your Choice'
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const product = await getProductBySlug(params.slug)

    if (!product) {
      notFound()
    }

    const breadcrumbItems = [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: product.name, href: `/products/${product.slug}` }
    ]

    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Product Gallery */}
          <ProductGallery product={product} />

          {/* Product Info */}
          <ProductInfo product={product} />
        </div>

        {/* Related Products */}
        <RelatedProducts currentProductId={product.id} />
      </div>
    )
  } catch (error) {
    console.error('Error loading product:', error)
    notFound()
  }
}
