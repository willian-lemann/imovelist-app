import type { HttpContext } from '@adonisjs/core/http'
import Listing from '#models/listing'

export default class DetailsController {
  async index({ params, inertia, response }: HttpContext) {
    const listing = await Listing.find(params.id)

    if (!listing) {
      return response.notFound('Listing not found')
    }

    return inertia.render('details', {
      listing: listing.serialize(),
    })
  }
}
