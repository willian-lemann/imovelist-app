import type { HttpContext } from '@adonisjs/core/http'
import Listing from '#models/listing'

export default class DashboardController {
  async index({ inertia, auth }: HttpContext) {
    // Mock premium status - in production this would come from a subscription check
    const isPremium = false

    // Count user's listings
    let listingsCount = 0
    if (auth.user) {
      listingsCount = await Listing.query()
        .where('agent_id', auth.user.id)
        .count('* as total')
        .first()
        .then((result) => Number(result?.$extras.total ?? 0))
    }

    return inertia.render('dashboard/index', {
      isPremium,
      listingsCount,
      user: auth.user ? auth.user.serialize() : null,
    })
  }
}
