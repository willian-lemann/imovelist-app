export interface ListingType {
  id: number
  name: string | null
  link: string | null
  image: string | null
  address: string | null
  price: number | null
  area: string | null
  bedrooms: number | null
  type: string | null
  forSale: boolean | null
  parking: number | null
  content: string | null
  photos: string[] | null
  agency: string | null
  bathrooms: number | null
  ref: string | null
  placeholderImage: string | null
  agent_id: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface ListingsFilters {
  q?: string
  filter?: string
  property_type?: string
  bathrooms?: string
  bedrooms?: string
  parking?: string
  price_range?: string
  area_range?: string
  page?: number
}

export interface ListingsResponse {
  listings: ListingType[] | Record<string, ListingType[]>
  count: number
  meta: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}

export interface CreateListingPayload {
  name?: string
  link?: string
  image?: string
  address?: string
  price?: number
  area?: string
  bedrooms?: number
  type?: string
  forSale?: boolean
  parking?: number
  content?: string
  photos?: string[]
  agency?: string
  bathrooms?: number
  ref?: string
  published?: boolean
}

export interface UpdateListingPayload extends Partial<CreateListingPayload> {
  id: number
}
