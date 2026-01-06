import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  async index({ inertia, auth }: HttpContext) {
    // Mock premium status - in production this would come from a subscription check
    const isPremium = true

    return inertia.render('dashboard/index', {
      isPremium,
      isAuthenticated: auth.isAuthenticated,
      currentUser: auth.user ? auth.user.serialize() : null,
    })
  }
}
