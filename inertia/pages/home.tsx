import { Head } from '@inertiajs/react'
import { Header } from '~/components/header'
import { Listings } from '~/components/listings'
import { Search } from '~/components/search'
import { QuickFilters } from '~/components/search/quick-filters'

type HomeProps = {
  listings?: any[]
  currentUser?: any
  filters?: Record<string, string>
  count: number
}

export default function Home({ listings = [], currentUser, filters = {}, count }: HomeProps) {
  return (
    <>
      <Head title="Imovelist - Encontre facilmente seu imóvel dos sonhos" />

      <div className="px-0">
        <div className="container">
          <Header currentUser={currentUser} />
        </div>

        <div className=" px-0">
          <div className="md:container py-4 md:px-0 px-4">
            <Search />
          </div>

          <div
            data-nofilters={Object.keys(filters).length === 0}
            className="data-[nofilters=true]:py-0 data-[nofilters=false]:py-2 px-4 md:px-0"
          >
            <QuickFilters filters={filters} />
          </div>

          <div className="mt-0 flex items-center justify-center md:px-0 px-4 data-[loading=true]:opacity-50 data-[loading=true]:pointer-events-none transition-all duration-200">
            <Listings listings={listings} count={count} />
          </div>
        </div>
      </div>
    </>
  )
}
