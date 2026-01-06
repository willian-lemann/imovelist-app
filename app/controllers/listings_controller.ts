import Listing from '#models/listing'
import type { HttpContext } from '@adonisjs/core/http'

export default class ListingsController {
  private static readonly LIMIT = 21
  private static readonly ORDERED_TYPES = ['Apartamento', 'Casa', 'Terreno']

  /**
   * GET /api/listings - Fetch paginated listings with filters
   */
  public async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)

    const userId = request.input('userId')
    const search = request.input('q')
    const filter = request.input('filter')
    const propertyType = request.input('property_type')
    const bathrooms = request.input('bathrooms')
    const parking = request.input('parking')
    const bedrooms = request.input('bedrooms')
    const priceRangeStr = request.input('price_range')
    const areaRangeStr = request.input('area_range')

    const query = Listing.query().select([
      'id',
      'name',
      'link',
      'image',
      'address',
      'price',
      'photos',
      'area',
      'bedrooms',
      'type',
      'forSale',
      'parking',
      'bathrooms',
      'ref',
      'placeholderImage',
      'agent_id',
      'published',
      'createdAt',
    ])

    query.preload('gallery')

    if (userId) {
      query.where('agent_id', String(userId))
    }

    if (search) {
      query.where((builder) => {
        builder.whereILike('address', `%${search}%`).orWhereILike('ref', `%${search}%`)
      })
    }

    // Filter by sale/rent
    if (filter) {
      query.where('forSale', filter !== 'aluguel')
    }

    // Filter by property type
    if (propertyType) {
      const capitalizedType = propertyType.charAt(0).toUpperCase() + propertyType.slice(1)
      query.where('type', capitalizedType)
    }

    // Filter by bathrooms
    if (bathrooms) {
      query.where('bathrooms', Number(bathrooms))
    }

    // Filter by bedrooms
    if (bedrooms) {
      query.where('bedrooms', Number(bedrooms))
    }

    // Filter by parking
    if (parking) {
      query.where('parking', Number(parking))
    }

    // Filter by price range
    if (priceRangeStr) {
      const [minPrice, maxPrice] = priceRangeStr.split(',').map(Number)
      if (minPrice && maxPrice) {
        query.whereBetween('price', [minPrice, maxPrice])
      }
    }

    // Filter by area range
    if (areaRangeStr) {
      const [minArea, maxArea] = areaRangeStr.split(',').map(Number)
      if (minArea && maxArea) {
        query.whereRaw('CAST(area AS DECIMAL) BETWEEN ? AND ?', [minArea, maxArea])
      }
    }

    const paginatedListings = await query
      .orderBy('created_at', 'desc')
      .paginate(page, ListingsController.LIMIT)

    const serialized = paginatedListings.serialize()
    const listings = serialized.data as Listing[]

    const shouldShowNormalListings = propertyType || userId

    const formattedListings = shouldShowNormalListings
      ? listings.map((listing) => {
          listing.photos = listing.photos ? listing.photos : []
          return listing
        })
      : this.groupListingsByType(listings).listingsGroupedByType

    return response.ok({
      listings: formattedListings,
      groupTypes: this.groupListingsByType(listings).types,
      count: serialized.meta.total,
      meta: serialized.meta,
    })
  }

  /**
   * GET /api/listings/:id - Fetch a single listing
   */
  public async show({ params, response }: HttpContext) {
    const listing = await Listing.find(params.id)

    if (!listing) {
      return response.notFound({ message: 'Listing not found' })
    }

    return response.ok(listing.serialize())
  }

  /**
   * POST /api/listings - Create a new listing
   */
  public async store({ request, response, auth }: HttpContext) {
    const user = auth.user

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
      'published',
    ])

    const listing = await Listing.create({
      ...data,
      agentId: user?.id || null,
    })

    return response.created(listing.serialize())
  }

  /**
   * PUT /api/listings/:id - Update a listing
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
      'published',
    ])

    listing.merge(data)
    await listing.save()

    return response.ok(listing.serialize())
  }

  /**
   * DELETE /api/listings/:id - Delete a listing
   */
  public async destroy({ params, response }: HttpContext) {
    const listing = await Listing.find(params.id)

    if (!listing) {
      return response.notFound({ message: 'Listing not found' })
    }

    await listing.delete()

    return response.ok({ message: 'Listing deleted successfully' })
  }

  private groupListingsByType(listings: Listing[]): {
    types: string[]
    listingsGroupedByType: Record<string, Listing[]>
  } {
    const grouped: Record<string, Listing[]> = {}

    for (const type of ListingsController.ORDERED_TYPES) {
      grouped[type] = []
    }

    // Single pass grouping
    for (const listing of listings) {
      const type = listing.type || 'Unknown'
      if (!grouped[type]) {
        grouped[type] = []
      }
      grouped[type].push(listing)
    }

    // Remove empty groups and collect types
    const types: string[] = []
    for (const type of Object.keys(grouped)) {
      if (grouped[type].length === 0) {
        delete grouped[type]
      } else {
        types.push(type)
      }
    }

    return {
      types,
      listingsGroupedByType: grouped,
    }
  }
}
