import { apiClient } from '~/lib/api-client'
import type {
  ListingsFilters,
  ListingsResponse,
  ListingType,
  CreateListingPayload,
  UpdateListingPayload,
} from '~/types/listing'

export const listingsApi = {
  async getListings(filters: ListingsFilters = {}): Promise<ListingsResponse> {
    const params = new URLSearchParams()

    if (filters.q) params.set('q', filters.q)
    if (filters.filter) params.set('filter', filters.filter)
    if (filters.property_type) params.set('property_type', filters.property_type)
    if (filters.bathrooms) params.set('bathrooms', filters.bathrooms)
    if (filters.bedrooms) params.set('bedrooms', filters.bedrooms)
    if (filters.parking) params.set('parking', filters.parking)
    if (filters.price_range) params.set('price_range', filters.price_range)
    if (filters.area_range) params.set('area_range', filters.area_range)
    if (filters.page) params.set('page', String(filters.page))
    if (filters.userId) params.set('userId', String(filters.userId))

    const { data } = await apiClient.get<ListingsResponse>(`/listings?${params.toString()}`)
    return data
  },

  /**
   * Fetch a single listing by ID
   */
  async getListing(id: number): Promise<ListingType> {
    const { data } = await apiClient.get<ListingType>(`/listings/${id}`)
    return data
  },

  /**
   * Create a new listing
   */
  async createListing(payload: CreateListingPayload): Promise<ListingType> {
    const { data } = await apiClient.post<ListingType>('/listings', payload)
    return data
  },

  /**
   * Update an existing listing
   */
  async updateListing({ id, ...payload }: UpdateListingPayload): Promise<ListingType> {
    const { data } = await apiClient.put<ListingType>(`/listings/${id}`, payload)
    return data
  },

  /**
   * Delete a listing
   */
  async deleteListing(id: number): Promise<void> {
    await apiClient.delete(`/listings/${id}`)
  },

  async getGroupTypes(): Promise<string[]> {
    const { data } = await apiClient.get<string[]>('/group-types')
    return data
  },
}
