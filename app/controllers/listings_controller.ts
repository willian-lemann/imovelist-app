import Listing from '#models/listing'
import type { HttpContext } from '@adonisjs/core/http'

export default class ListingsController {
  /**
   * Display a single listing
   */
  public async show({ params, inertia, response }: HttpContext) {
    const listing = await Listing.find(params.id)

    if (!listing) {
      return response.notFound({ message: 'Listing not found' })
    }

    return inertia.render('listing/show', {
      listing: listing.serialize(),
    })
  }

  /**
   * Display form to create a new listing
   */
  public async create({ inertia }: HttpContext) {
    return inertia.render('listing/create')
  }

  /**
   * Handle creation of a new listing
   */
  public async store({ request, response }: HttpContext) {
    const data = request.only([
      'name',
      'link',
      'image',
      'address',
      'price',
      'area',
      'bedrooms',
      'type',
      'forSale',
      'parking',
      'content',
      'photos',
      'agency',
      'bathrooms',
      'ref',
      'placeholderImage',
      'agentId',
      'published',
    ])

    const listing = await Listing.create(data)

    return response.created({
      message: 'Listing created successfully',
      listing: listing.serialize(),
    })
  }

  /**
   * Display form to edit a listing
   */
  public async edit({ params, inertia, response }: HttpContext) {
    const listing = await Listing.find(params.id)

    if (!listing) {
      return response.notFound({ message: 'Listing not found' })
    }

    return inertia.render('listing/edit', {
      listing: listing.serialize(),
    })
  }

  /**
   * Handle update of a listing
   */
  public async update({ params, request, response }: HttpContext) {
    const listing = await Listing.find(params.id)

    if (!listing) {
      return response.notFound({ message: 'Listing not found' })
    }

    const data = request.only([
      'name',
      'link',
      'image',
      'address',
      'price',
      'area',
      'bedrooms',
      'type',
      'forSale',
      'parking',
      'content',
      'photos',
      'agency',
      'bathrooms',
      'ref',
      'placeholderImage',
      'agentId',
      'published',
    ])

    listing.merge(data)
    await listing.save()

    return response.ok({
      message: 'Listing updated successfully',
      listing: listing.serialize(),
    })
  }

  /**
   * Delete a listing
   */
  public async destroy({ params, response }: HttpContext) {
    const listing = await Listing.find(params.id)

    if (!listing) {
      return response.notFound({ message: 'Listing not found' })
    }

    await listing.delete()

    return response.ok({
      message: 'Listing deleted successfully',
    })
  }
}
