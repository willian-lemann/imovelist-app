import { useCallback, useState } from 'react'
import { ListingItem } from './listing-item'
import { List } from 'lucide-react'

import { ScrollToTopButton } from '~/components/scroll-top-button'

import { CustomPagination } from '~/components/custom-pagination'
import { isMobile } from '~/helpers/mobile'
import { Link, usePage } from '@inertiajs/react'
import Listing from '#models/listing'
import { Button } from './ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel'

interface ListingsProps {
  listings:
    | {
        [key: string]: Listing[]
      }
    | Listing[]
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
  const shouldShowPagination = true
  const isUserOnMobile = isMobile()

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
        renderMobileView(listings)
      ) : (
        <div className="mt-4 space-y-8">
          {!url.includes('property_type=') ? (
            Object.entries(listings).map(([type, group]) => (
              <div key={type}>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-semibold capitalize">{type}</h3>

                  <Link
                    href={`/?property_type=${type.toLowerCase()}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Ver mais
                  </Link>
                </div>

                {group.length > 7 ? renderCarouselView(group) : renderNormalView(group)}
              </div>
            ))
          ) : (
            <div className="grid grid-cols-[auto_auto_auto_auto_auto_auto_auto] gap-3 ">
              {(listings as Listing[]).map((listing) => (
                <ListingItem key={listing.id} listing={listing} />
              ))}
            </div>
          )}
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

function renderMobileView(listings: { [key: string]: Listing[] } | Listing[]) {
  const chunkListings = useCallback((items: Listing[], size: number) => {
    const chunks: Listing[][] = []
    for (let i = 0; i < items.length; i += size) {
      chunks.push(items.slice(i, i + size))
    }

    return chunks
  }, [])

  if (Array.isArray(listings)) {
    return chunkListings(listings, 7).map((chunk, chunkIndex) => (
      <div key={chunkIndex} className="overflow-x-auto scrollbar-hide">
        <div
          className="flex items-center gap-3 pb-4 md:pb-2 max-w-[300px]"
          style={{ width: 'max-content' }}
        >
          {chunk.map((listing) => (
            <div key={listing.id} className="shrink-0">
              <ListingItem listing={listing} />
            </div>
          ))}
        </div>
      </div>
    ))
  }

  return (
    <div className="mt-4 space-y-4">
      {Object.entries(listings).map(([type, group]) => (
        <div key={type}>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold capitalize">{type}</h3>
            <Link
              href={`/?property_type=${type}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              Ver mais
            </Link>
          </div>
          {chunkListings(group, 7).map((chunk, chunkIndex) => (
            <div key={chunkIndex} className="overflow-x-auto scrollbar-hide">
              <div
                className="flex items-center gap-3 pb-4 md:pb-2 max-w-[300px]"
                style={{ width: 'max-content' }}
              >
                {chunk.map((listing) => (
                  <div key={listing.id} className="shrink-0">
                    <ListingItem listing={listing} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function renderNormalView(group: Listing[]) {
  return (
    <div
      className="grid gap-3 gap-y-6 "
      style={{
        gridTemplateColumns: `repeat(${Math.min(7, group.length)}, minmax(180px, 180px))`,
      }}
    >
      {group.map((listing) => (
        <ListingItem key={listing.id} listing={listing} />
      ))}
    </div>
  )
}

function renderCarouselView(group: Listing[]) {
  return (
    <Carousel
      opts={{
        align: 'start',
        slidesToScroll: 3,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-3">
        {group.map((listing) => (
          <CarouselItem key={listing.id} className="pl-3 basis-[180px] flex">
            <ListingItem listing={listing} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0 top-[40%]" />
      <CarouselNext className="right-0 top-[40%]" />
    </Carousel>
  )
}
