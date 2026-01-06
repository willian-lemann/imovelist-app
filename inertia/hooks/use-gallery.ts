import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '~/lib/api-client'

export type GalleryPhoto = {
  id: number
  listingId: number
  url: string
  filename: string
  mimeType: string | null
  size: number | null
  order: number
  createdAt: string
  updatedAt: string
}

const galleryKeys = {
  all: ['gallery'] as const,
  listing: (listingId: number) => [...galleryKeys.all, 'listing', listingId] as const,
}

/**
 * Fetch gallery photos for a listing
 */
export function useGalleryPhotos(listingId: number | null) {
  return useQuery({
    queryKey: listingId ? galleryKeys.listing(listingId) : ['gallery', 'empty'],
    queryFn: async () => {
      if (!listingId) return []
      const response = await apiClient.get<GalleryPhoto[]>(`/gallery/${listingId}`)
      return response.data
    },
    enabled: !!listingId,
  })
}

/**
 * Upload photos to gallery
 */
export function useUploadGalleryPhotos() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ listingId, files }: { listingId: number; files: File[] }) => {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append('photos', file)
      })

      const response = await apiClient.post<{ message: string; photos: GalleryPhoto[] }>(
        `/gallery/${listingId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.listing(variables.listingId) })
      // Also invalidate listings to update photos array
      queryClient.invalidateQueries({ queryKey: ['listings'] })
    },
  })
}

/**
 * Delete a gallery photo
 */
export function useDeleteGalleryPhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ photoId, listingId }: { photoId: number; listingId: number }) => {
      const response = await apiClient.delete<{ message: string }>(`/api/gallery/${photoId}`)
      return { ...response.data, listingId }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.listing(data.listingId) })
      queryClient.invalidateQueries({ queryKey: ['listings'] })
    },
  })
}

/**
 * Reorder gallery photos
 */
export function useReorderGalleryPhotos() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ listingId, photoIds }: { listingId: number; photoIds: number[] }) => {
      const response = await apiClient.put<{ message: string }>(
        `/api/gallery/${listingId}/reorder`,
        { photoIds }
      )
      return { ...response.data, listingId }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.listing(data.listingId) })
      queryClient.invalidateQueries({ queryKey: ['listings'] })
    },
  })
}
