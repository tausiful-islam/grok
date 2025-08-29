import { Suspense } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/home/hero-section'
import { FeaturedProducts } from '@/components/home/featured-products'
import { Categories } from '@/components/home/categories'
import { Newsletter } from '@/components/home/newsletter'
import { LoadingSpinner } from '@/components/common/loading-spinner'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <Suspense fallback={<LoadingSpinner />}>
          <Categories />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <FeaturedProducts />
        </Suspense>
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
