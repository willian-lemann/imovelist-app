import { BaseCommand } from '@adonisjs/core/ace'

import { auxiliadoraPredialScrape } from '../app/scrapping_service/auxiliadora_predial.js'

import { CommandOptions } from '@adonisjs/core/types/ace'
import ScrappedListing from '#models/scrapped_listing'
import Listing from '#models/listing'

export default class ScrapeListingsCommand extends BaseCommand {
  static commandName = 'scrape:listings'
  static description =
    'Scrape property listings from multiple real estate agencies and save to database'

  static options: CommandOptions = {
    startApp: true, // Ensures the app is booted (needed for database access)
  }

  async run() {
    this.logger.info('Starting scraping process...')

    try {
      await ScrappedListing.truncate()
      await Listing.query().where('name', 'null').delete()

      await auxiliadoraPredialScrape()
    } catch (error) {
      this.logger.error('Scraping failed:', error)
      throw error // Re-throw to mark command as failed
    }
  }
}
