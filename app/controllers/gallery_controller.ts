import Gallery from '#models/gallery'
import Listing from '#models/listing'
import { storageService } from '#services/storage_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class GalleryController {
  /**
   * GET /api/gallery/:listingId - Get all photos for a listing
   */
  async index({ params, response }: HttpContext) {
    const listingId = params.listingId

    const photos = await Gallery.query()
      .where('listingId', listingId)
      .orderBy('order', 'asc')
      .orderBy('createdAt', 'asc')

    return response.ok(photos.map((photo) => photo.serialize()))
  }

  /**
   * POST /api/gallery/:listingId - Upload photos for a listing
   */
  async store({ params, request, response, auth }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Unauthorized' })
    }

    const listingId = params.listingId

    // Verify listing exists
    const listing = await Listing.find(listingId)
    if (!listing) {
      return response.notFound({ message: 'Listing not found' })
    }

    const photos = request.files('photos', {
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif'],
    })

    if (!photos || photos.length === 0) {
      return response.badRequest({ message: 'No photos provided' })
    }

    const maxOrderResult = await Gallery.query()
      .where('listingId', listingId)
      .max('order as maxOrder')
      .first()

    let currentOrder = (maxOrderResult?.$extras?.maxOrder || 0) + 1

    try {
      const fs = await import('node:fs/promises')
      const filesToUpload = await Promise.all(
        photos.map(async (photo) => {
          if (!photo.tmpPath) {
            throw new Error('Temporary file path not found for uploaded photo')
          }
          const buffer = await fs.readFile(photo.tmpPath)
          return {
            buffer,
            originalName: photo.clientName,
            mimeType: photo.type || 'image/jpeg',
          }
        })
      )

      const uploadedPhotos = await storageService.uploadMultipleFiles(
        filesToUpload,
        `listings/${listingId}`
      )

      const galleryEntries = await Promise.all(
        uploadedPhotos.map(async (photo) => {
          const gallery = await Gallery.create({
            listingId: Number(listingId),
            url: photo.url,
            filename: photo.filename,
            mimeType: photo.mimeType,
            size: photo.size,
            order: currentOrder++,
          })
          return gallery
        })
      )

      const existingPhotos = listing.photos || []
      const newPhotoUrls = uploadedPhotos.map((p) => p.url)
      listing.photos = JSON.stringify([...existingPhotos, ...newPhotoUrls])

      await listing.save()

      return response.created({
        message: 'Photos uploaded successfully',
        photos: galleryEntries.map((g) => g.serialize()),
      })
    } catch (error) {
      console.error('Error uploading photos:', error)
      return response.internalServerError({ message: 'Failed to upload photos' })
    }
  }

  /**
   * DELETE /api/gallery/:id - Delete a single photo
   */
  async destroy({ params, response, auth }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Unauthorized' })
    }

    const galleryId = params.id

    const gallery = await Gallery.find(galleryId)
    if (!gallery) {
      return response.notFound({ message: 'Photo not found' })
    }

    try {
      // Delete from S3 storage
      if (gallery.filename) {
        await storageService.delete(gallery.filename)
      }

      // Update listing photos array
      const listing = await Listing.find(gallery.listingId)
      if (listing && listing.photos) {
        listing.photos = listing.photos.filter((p: string) => p !== gallery.url)
        await listing.save()
      }

      // Delete from database
      await gallery.delete()

      return response.ok({ message: 'Photo deleted successfully' })
    } catch (error) {
      console.error('Error deleting photo:', error)
      return response.internalServerError({ message: 'Failed to delete photo' })
    }
  }

  /**
   * PUT /api/gallery/:listingId/reorder - Reorder photos for a listing
   */
  async reorder({ params, request, response, auth }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Unauthorized' })
    }

    const listingId = params.listingId
    const { photoIds } = request.only(['photoIds']) as { photoIds: number[] }

    if (!photoIds || !Array.isArray(photoIds)) {
      return response.badRequest({ message: 'Invalid photo order' })
    }

    try {
      // Update order for each photo
      await Promise.all(
        photoIds.map((photoId, index) =>
          Gallery.query()
            .where('id', photoId)
            .where('listingId', listingId)
            .update({ order: index })
        )
      )

      // Also update listing photos array order
      const photos = await Gallery.query().where('listingId', listingId).orderBy('order', 'asc')

      const listing = await Listing.find(listingId)
      if (listing) {
        listing.photos = photos.map((p) => p.url)
        await listing.save()
      }

      return response.ok({ message: 'Photos reordered successfully' })
    } catch (error) {
      console.error('Error reordering photos:', error)
      return response.internalServerError({ message: 'Failed to reorder photos' })
    }
  }
}
