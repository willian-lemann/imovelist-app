import { BathIcon, BedIcon, RulerIcon } from 'lucide-react'

import { Card } from '~/components/ui/card'
import { formatMoney, createSlug } from '../lib/utils'

import { Label } from '~/components/ui/label'
import { Badge } from '~/components/ui/badge'

import { PhotosCarousel } from '~/components/photos-carousel'
import { Button } from '~/components/ui/button'

import React, { useCallback } from 'react'
import Listing from '#models/listing'

type ListingItemProps = {
  listing: Listing
}

export function ListingItem({ listing }: ListingItemProps) {
  const getListingURL = useCallback(
    (listingItem: Listing) => {
      const name = listingItem.name || `${listingItem.type} em ${listingItem.address}`
      return `/imoveis/${listingItem.id}/${createSlug(name)}`
    },
    [listing]
  )

  const detailsUrl = getListingURL(listing)

  function handleGoDetails(listing: Listing) {
    window.open(getListingURL(listing), '_blank')
  }

  const isOwner = listing.agentId
  const name = listing.name || listing.address?.split(',')[0]

  return (
    <React.Fragment key={listing.id}>
      <Card
        onMouseDown={(e) => {
          const element = e.target as HTMLElement

          if (
            element.tagName.toLowerCase() === 'svg' ||
            element.tagName.toLowerCase() === 'button' ||
            element.tagName.toLowerCase() === 'path'
          ) {
            return
          }

          handleGoDetails(listing)
        }}
        className="w-full cursor-pointer max-w-md animate-fadeIn relative shadow-none overflow-hidden rounded-lg border-none transition-all"
      >
        <div>
          {isOwner ? (
            <Badge className="absolute rounded-full hover:bg-white top-3 left-2 z-50 bg-white">
              <Label className="text-sm text-primary font-bold">Meu anúncio</Label>
            </Badge>
          ) : null}

          <div className="relative">
            <PhotosCarousel photos={listing.photos} />

            <div className="absolute top-3 left-3 z-40 inline-block px-4 py-1 text-xs font-medium rounded-full bg-primary-foreground/90  text-primary">
              {listing.forSale ? 'Venda' : 'Aluguel'}
            </div>
          </div>
        </div>

        <div className="py-0 bg-background">
          <div className="flex mb-2 flex-col">
            <h3
              title={name!}
              className="truncate font-semibold pr-4 text-[13px] text-foreground/70"
            >
              {listing.type} - {name}
            </h3>

            <div className="flex items-center gap-1">
              <p className="text-[13px] font-sans font-medium text-muted-foreground flex items-center">
                {formatMoney(listing.price!)}

                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  role="presentation"
                  className="ml-1.5"
                  focusable="false"
                  style={{ display: 'block', height: '8px', width: '8px', fill: 'currentcolor' }}
                >
                  <path
                    fill-rule="evenodd"
                    d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1 0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"
                  ></path>
                </svg> */}
              </p>

              {/* <div className="flex items-center gap-0 text-muted-foreground ">
                {listing.bedrooms ? (
                  <div className="flex items-center text-[13px]">
                    <BedIcon className="w-4 h-4 " />
                    {listing.bedrooms}
                  </div>
                ) : null}

                {listing.bathrooms ? (
                  <div className="flex items-center text-[13px] ">
                    <BathIcon className="w-4 h-4 " />
                    {listing.bathrooms}
                  </div>
                ) : null}

                {listing.area ? (
                  <div className="flex items-center text-[13px]">
                    <RulerIcon className="w-4 h-4 mr-0.5" />
                    {listing.area}
                  </div>
                ) : null}
              </div> */}
            </div>
          </div>

          <div className="flex items-center justify-between">
            {isOwner ? (
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  // goEdit(id)
                }}
                variant="secondary"
                className="h-6 hover:brightness-90 py-4 transition-all duration-200 font-semibold"
              >
                Editar
              </Button>
            ) : null}
          </div>
        </div>
      </Card>
    </React.Fragment>
  )
}
