import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  async index({ inertia }: HttpContext) {
    // Mock premium status - in production this would come from a subscription check
    const isPremium = false

    return inertia.render('dashboard/index', {
      isPremium,
    })
  }
}
