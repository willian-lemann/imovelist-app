import { Head } from '@inertiajs/react'
import { Header } from '~/components/header'
import { Listings } from '~/components/listings'
import { Search } from '~/components/search'
import { QuickFilters } from '~/components/search/quick-filters'
import type { ListingType } from '~/types/listing'

type HomeProps = {
  listings?: ListingType[] | Record<string, ListingType[]>
  filters: Record<string, string>
  count?: number
}

export default function Home({ listings, filters = {}, count }: HomeProps) {
  return (
    <>
      <Head title="Imovelist - Encontre facilmente seu imóvel dos sonhos" />

      <div className="px-0">
        <div>
          <Header />
        </div>

        <div className="mx-auto max-w-[1350px]">
          <div className="py-4 md:px-0 px-4">
            <Search />
          </div>

          {Object.keys(filters).length > 0 && count !== undefined && (
            <div className="px-4 md:px-0 pb-2 text-muted-foreground text-sm">
              {count} resultado{count === 1 ? '' : 's'} encontrado{count === 1 ? '' : 's'} para sua
              pesquisa
            </div>
          )}

          <div
            data-nofilters={Object.keys(filters).length === 0}
            className="data-[nofilters=true]:py-0 data-[nofilters=false]:py-2 px-4 md:px-0"
          >
            <QuickFilters filters={filters} />
          </div>

          <div className="w-full mt-0 md:px-0 px-4">
            <Listings initialListings={listings} initialCount={count} />
          </div>
        </div>
      </div>
    </>
  )
}
