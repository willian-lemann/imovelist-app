// eslint-disable-next-line @unicorn/filename-case
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listingsApi } from '~/services/listings-api'
import type {
  ListingsFilters,
  ListingsResponse,
  ListingType,
  CreateListingPayload,
  UpdateListingPayload,
} from '~/types/listing'

// Query keys factory for consistent cache management
export const listingsKeys = {
  all: ['listings'] as const,
  lists: () => [...listingsKeys.all, 'list'] as const,
  list: (filters: ListingsFilters) => [...listingsKeys.lists(), filters] as const,
  details: () => [...listingsKeys.all, 'detail'] as const,
  detail: (id: number) => [...listingsKeys.details(), id] as const,
}

export function useListings(filters: ListingsFilters = {}) {
  return useQuery<ListingsResponse>({
    queryKey: listingsKeys.list(filters),
    queryFn: () => listingsApi.getListings(filters),
  })
}

/**
 * Hook to fetch a single listing by ID
 */
export function useListing(id: number) {
  return useQuery<ListingType>({
    queryKey: listingsKeys.detail(id),
    queryFn: () => listingsApi.getListing(id),
    enabled: !!id,
  })
}

/**
 * Hook to create a new listing
 */
export function useCreateListing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateListingPayload) => listingsApi.createListing(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingsKeys.lists() })
    },
  })
}

/**
 * Hook to update an existing listing
 */
export function useUpdateListing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateListingPayload) => listingsApi.updateListing(payload),
    onSuccess: (data) => {
      // Update the specific listing in cache
      queryClient.setQueryData(listingsKeys.detail(data.id), data)
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: listingsKeys.lists() })
    },
  })
}

/**
 * Hook to delete a listing
 */
export function useDeleteListing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => listingsApi.deleteListing(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: listingsKeys.detail(id) })
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: listingsKeys.lists() })
    },
  })
}

export function useGroupTypes() {
  return useQuery<string[]>({
    queryKey: [...listingsKeys.all, 'groupTypes'],
    queryFn: async () => {
      const data = await listingsApi.getGroupTypes()
      return data
    },
  })
}
