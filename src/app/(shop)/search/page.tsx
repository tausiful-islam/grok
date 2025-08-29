import { Metadata } from 'next'
import { Suspense } from 'react'
import { SearchResults } from './components/search-results'
import { LoadingSpinner } from '@/components/common/loading-spinner'

export const metadata: Metadata = {
  title: 'Search - It\'s Your Choice',
  description: 'Search for products in our store',
}

interface SearchPageProps {
  searchParams: {
    q?: string
    category?: string
    sortBy?: string
    sortOrder?: string
    page?: string
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {query ? `Search Results for "${query}"` : 'Search Products'}
        </h1>
        <p className="text-muted-foreground">
          {query ? 'Find what you\'re looking for' : 'Enter a search term to find products'}
        </p>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
