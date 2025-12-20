import { useCallback, useState } from 'react'
import { ListingItem } from './listing-item'
import { List } from 'lucide-react'

import { ScrollToTopButton } from '~/components/scroll-top-button'

import { CustomPagination } from '~/components/custom-pagination'
import { isMobile } from '~/helpers/mobile'
import { usePage } from '@inertiajs/react'
import Listing from '#models/listing'

interface ListingsProps {
  listings: Listing[]
  count: number
}

export function Listings({ listings, count }: ListingsProps) {
  const { url } = usePage()
  // Extract page param from Inertia's url (e.g., /?page=2)
  const pageMatch = url.match(/[?&]page=(\d+)/)
  const initialPage = pageMatch ? Number(pageMatch[1]) : 1
  const [currentPage, setCurrentPage] = useState(initialPage)

  const pageSize = 21

  const numberOfPages = Math.ceil(Number(count) / pageSize)

  const maxPagesToShow = isMobile() ? 5 : 10
  const shouldShowPagination = listings.length > 0
  const isUserOnMobile = isMobile()

  // Group listings into chunks of 7 for mobile horizontal scrolling
  const chunkListings = useCallback((items: Listing[], size: number) => {
    const chunks: Listing[][] = []
    for (let i = 0; i < items.length; i += size) {
      chunks.push(items.slice(i, i + size))
    }

    return chunks
  }, [])

  const listingGroups = isUserOnMobile ? chunkListings(listings, 7) : [listings]

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div>
      {count === 0 ? (
        <div className="group-data-[loading=true]:bg-black flex flex-col items-center justify-center gap-6 py-16 md:py-24 lg:py-32">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <List className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Nenhum resultado encontrado
            </h2>
            <p className="text-muted-foreground">
              Não encontramos nenhum anúncio com os filtros aplicados.
            </p>
          </div>
        </div>
      ) : isUserOnMobile ? (
        <div className="mt-4 space-y-4">
          {listingGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="overflow-x-auto  scrollbar-hide">
              <div
                className="flex items-center gap-3 pb-4 md:pb-2  max-w-[300px]"
                style={{ width: 'max-content' }}
              >
                {group.map((listing) => (
                  <div key={listing.id} className="shrink-0 ">
                    <ListingItem listing={listing} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 sm:grid sm:grid-cols-2 lg:grid-cols-[180px_180px_180px_180px_180px_180px_180px] gap-3 gap-y-6">
          {listings.map((listing) => (
            <ListingItem key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {shouldShowPagination && (
        <div className="pt-10 pb-4">
          <CustomPagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalPages={numberOfPages}
            maxPageToShow={maxPagesToShow}
          />
        </div>
      )}

      <ScrollToTopButton />
    </div>
  )
}
