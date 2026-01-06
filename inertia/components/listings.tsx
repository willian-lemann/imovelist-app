import { useCallback, useState, useMemo } from 'react'
import { ListingItem } from './listing-item'
import { List } from 'lucide-react'

import { ScrollToTopButton } from '~/components/scroll-top-button'

import { CustomPagination } from '~/components/custom-pagination'
import { isMobile } from '~/helpers/mobile'
import { Link, usePage } from '@inertiajs/react'
import { useListings } from '~/hooks/use-listings'
import type { ListingType, ListingsFilters } from '~/types/listing'
import { ListingsSectionSkeleton, ListingsMobileSkeleton } from './listings/listing-skeleton'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel'

interface ListingsProps {
  initialListings?:
    | {
        [key: string]: ListingType[]
      }
    | ListingType[]
  initialCount?: number
}

export function Listings({ initialCount }: ListingsProps) {
  const { url } = usePage()

  const filters = useMemo<ListingsFilters>(() => {
    const params = new URLSearchParams(url.split('?')[1] || '')
    return {
      q: params.get('q') || undefined,
      filter: params.get('filter') || undefined,
      property_type: params.get('property_type') || undefined,
      bathrooms: params.get('bathrooms') || undefined,
      bedrooms: params.get('bedrooms') || undefined,
      parking: params.get('parking') || undefined,
      price_range: params.get('price_range') || undefined,
      area_range: params.get('area_range') || undefined,
      page: Number(params.get('page')) || 1,
    }
  }, [url])

  const [currentPage, setCurrentPage] = useState(filters.page || 1)

  const { data, isLoading, isFetching } = useListings({
    ...filters,
    page: currentPage,
  })

  const listings = data?.listings ?? []
  const count = data?.count ?? initialCount ?? 0

  const pageSize = 21
  const numberOfPages = Math.ceil(Number(count) / pageSize)
  const maxPagesToShow = isMobile() ? 5 : 10
  const shouldShowPagination = numberOfPages > 1
  const isUserOnMobile = isMobile()

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Update URL without full page reload
    const params = new URLSearchParams(url.split('?')[1] || '')
    params.set('page', String(page))
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`)
  }

  // Show skeleton while loading
  if (isLoading) {
    return <div>{isUserOnMobile ? <ListingsMobileSkeleton /> : <ListingsSectionSkeleton />}</div>
  }

  return (
    <div className={isFetching ? 'opacity-60 pointer-events-none transition-opacity' : ''}>
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
        <MobileView listings={listings} propertyType={filters.property_type} />
      ) : (
        <div className="mt-4 ">
          {!filters.property_type ? (
            Object.entries(listings as Record<string, ListingType[]>).map(([type, group]) => (
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

                {group.length > 7 ? <CarouselView group={group} /> : <NormalView group={group} />}
              </div>
            ))
          ) : (
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              }}
            >
              {(listings as ListingType[]).map((listing) => (
                <ListingItem key={listing.id} listing={listing as any} />
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

function MobileView({
  listings,
  propertyType,
}: {
  listings: Record<string, ListingType[]> | ListingType[]
  propertyType?: string
}) {
  const chunkListings = useCallback((items: ListingType[], size: number) => {
    const chunks: ListingType[][] = []
    for (let i = 0; i < items.length; i += size) {
      chunks.push(items.slice(i, i + size))
    }
    return chunks
  }, [])

  if (Array.isArray(listings) || propertyType) {
    const listingsArray = Array.isArray(listings) ? listings : []
    return (
      <>
        {chunkListings(listingsArray, 7).map((chunk, chunkIndex) => (
          <div key={chunkIndex} className="overflow-x-auto scrollbar-hide">
            <div
              className="flex items-center gap-3 pb-4 md:pb-2 max-w-[300px]"
              style={{ width: 'max-content' }}
            >
              {chunk.map((listing) => (
                <div key={listing.id} className="shrink-0">
                  <ListingItem listing={listing as any} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </>
    )
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
                className="flex items-center gap-3 pb-0 md:pb-2 max-w-[320px]"
                style={{ width: 'max-content' }}
              >
                {chunk.map((listing) => (
                  <div key={listing.id} className="shrink-0">
                    <ListingItem listing={listing as any} />
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

function NormalView({ group }: { group: ListingType[] }) {
  return (
    <div
      className="grid gap-3"
      style={{
        gridTemplateColumns: `repeat(${Math.min(7, group.length)}, minmax(160px, 160px))`,
      }}
    >
      {group.map((listing) => (
        <ListingItem key={listing.id} listing={listing as any} />
      ))}
    </div>
  )
}

function CarouselView({ group }: { group: ListingType[] }) {
  return (
    <Carousel
      opts={{
        align: 'start',
        slidesToScroll: 3,
      }}
      className="w-full"
    >
      <CarouselContent className="ml-0  space-x-3">
        {group.map((listing) => (
          <CarouselItem key={listing.id} className="basis-40 flex w-40 ">
            <ListingItem listing={listing as any} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0 top-[40%]" />
      <CarouselNext className="right-0 top-[40%]" />
    </Carousel>
  )
}
