import { Skeleton } from '~/components/ui/skeleton'

export function ListingItemSkeleton() {
  return (
    <div className="w-full max-w-md animate-pulse">
      {/* Image skeleton */}
      <div className="relative">
        <Skeleton className="w-36 md:w-full h-32 md:h-[180px] rounded-lg" />
        {/* Badge skeleton */}
        <Skeleton className="absolute top-3 left-3 h-6 w-16 rounded-full" />
      </div>

      {/* Content skeleton */}
      <div className="py-2 space-y-2">
        {/* Title */}
        <Skeleton className="h-4 w-3/4" />
        {/* Price */}
        <Skeleton className="h-5 w-1/2" />
        {/* Details */}
        <div className="flex gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  )
}

export function ListingsGridSkeleton({ count = 7 }: { count?: number }) {
  return (
    <div
      className="grid gap-3 gap-y-6"
      style={{
        gridTemplateColumns: `repeat(${Math.min(7, count)}, minmax(180px, 180px))`,
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <ListingItemSkeleton key={index} />
      ))}
    </div>
  )
}

export function ListingsSectionSkeleton() {
  return (
    <div className="mt-4 space-y-8">
      {/* Simulate 3 type sections */}
      {['Apartamento', 'Casa', 'Terreno'].map((type) => (
        <div key={type}>
          <div className="mb-2 flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
          <ListingsGridSkeleton count={7} />
        </div>
      ))}
    </div>
  )
}

export function ListingsMobileSkeleton() {
  return (
    <div className="mt-4 space-y-4">
      {['Apartamento', 'Casa', 'Terreno'].map((type) => (
        <div key={type}>
          <div className="mb-2 flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-3 pb-4" style={{ width: 'max-content' }}>
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="shrink-0">
                  <ListingItemSkeleton />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
