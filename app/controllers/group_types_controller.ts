import Listing from '#models/listing'
import type { HttpContext } from '@adonisjs/core/http'

export default class GroupTypesController {
  public async index({ response }: HttpContext) {
    const listings = await Listing.query()
      .select(['type'])
      .distinct()
      .orderBy('type', 'asc')
      .then((rows) => {
        return rows.map((row) => row.type!.replace(/para comprar\s*/i, '').trim())
      })

    return response.ok(listings)
  }
}
