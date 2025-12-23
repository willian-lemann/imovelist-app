import Listing from '#models/listing'
import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  private static readonly LIMIT = 21
  private static readonly ORDERED_TYPES = ['Apartamento', 'Casa', 'Terreno']

  public async index({ inertia, request, auth }: HttpContext) {
    const page = request.input('page', 1)

    // Get filter parameters from query string
    const search = request.input('q')
    const filter = request.input('filter') // 'aluguel' or 'venda'
    const propertyType = request.input('property_type')
    const bathrooms = request.input('bathrooms')
    const parking = request.input('parking')
    const bedrooms = request.input('bedrooms')
    const priceRangeStr = request.input('price_range')
    const areaRangeStr = request.input('area_range')

    // Build the query with only needed columns for list view
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
      'createdAt',
    ])

    // Search filter - search in address or ref
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

    // Filter by bathrooms (simplified check)
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

    // Filter by area range (consider adding a numeric area_sqm column for better performance)
    if (areaRangeStr) {
      const [minArea, maxArea] = areaRangeStr.split(',').map(Number)
      if (minArea && maxArea) {
        query.whereRaw('CAST(area AS DECIMAL) BETWEEN ? AND ?', [minArea, maxArea])
      }
    }

    // Use paginate() - handles count and pagination in optimized queries
    const paginatedListings = await query
      .orderBy('created_at', 'desc')
      .orderBy('type', 'desc')
      .paginate(page, HomeController.LIMIT)

    const serialized = paginatedListings.serialize()
    const listings = serialized.data

    // Group listings by type (only when not filtering by property type)
    const formattedListings = propertyType ? listings : this.groupListingsByType(listings)

    return inertia.render('home', {
      listings: formattedListings,
      filters: request.qs(),
      count: serialized.meta.total,
      isAuthenticated: auth.isAuthenticated,
      currentUser: auth.user?.serialize() ?? null,
    })
  }

  /**
   * Groups listings by type in a predefined order
   */
  private groupListingsByType(listings: Record<string, any>[]): Record<string, any[]> {
    const grouped: Record<string, any[]> = {}

    // Initialize ordered types first to maintain order
    for (const type of HomeController.ORDERED_TYPES) {
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

    // Remove empty groups
    for (const type of Object.keys(grouped)) {
      if (grouped[type].length === 0) {
        delete grouped[type]
      }
    }

    return grouped
  }
}
