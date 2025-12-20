import Listing from '#models/listing'
import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  public async index({ inertia, request, auth }: HttpContext) {
    const currentUser = auth.getUserOrFail()

    const page = request.input('page', 1)
    const limit = 21

    // Get filter parameters from query string
    const search = request.input('q')
    const filter = request.input('filter') // 'aluguel' or 'venda'
    const propertyType = request.input('property_type')
    const bathrooms = request.input('bathrooms')
    const parking = request.input('parking')
    const bedrooms = request.input('bedrooms')
    const priceRangeStr = request.input('price_range')
    const areaRangeStr = request.input('area_range')

    // Build the query
    const query = Listing.query()

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

    // Filter by bathrooms
    if (bathrooms !== undefined && bathrooms !== '') {
      query.where('bathrooms', Number(bathrooms))
    }

    // Filter by bedrooms
    if (bedrooms !== undefined && bedrooms !== '') {
      query.where('bedrooms', Number(bedrooms))
    }

    // Filter by parking
    if (parking !== undefined && parking !== '') {
      query.where('parking', Number(parking))
    }

    // Filter by price range
    if (priceRangeStr) {
      const priceRange = priceRangeStr.split(',').map(Number)
      if (priceRange.length === 2) {
        const [minPrice, maxPrice] = priceRange
        query.whereBetween('price', [minPrice, maxPrice])
      }
    }

    // Filter by area range
    if (areaRangeStr) {
      const areaRange = areaRangeStr.split(',').map(Number)
      if (areaRange.length === 2) {
        const [minArea, maxArea] = areaRange
        // Convert area string to numeric for comparison
        query.whereRaw('CAST(area AS DECIMAL) >= ?', [minArea])
        query.whereRaw('CAST(area AS DECIMAL) <= ?', [maxArea])
      }
    }

    // Get total count for pagination
    const countQuery = query.clone()

    const [{ $extras }] = await countQuery.count('* as total')
    const total = $extras.total

    const listings = await query
      .orderBy('created_at', 'desc')
      .orderBy('agent_id', 'desc')
      .offset((page - 1) * limit)
      .limit(limit)

    return inertia.render('home', {
      listings: listings.map((listing) => {
        const listingItem = listing.serialize()
        return listingItem
      }),
      filters: request.qs(),
      count: Number(total),
      isAuthenticated: auth.isAuthenticated,
      currentUser: currentUser.serialize(),
    })
  }
}
