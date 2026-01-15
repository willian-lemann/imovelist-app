import { chromium, Browser, Page } from 'playwright'
import logger from '@adonisjs/core/services/logger'
import Listing from '#models/listing'
import ScrappedInfo from '#models/scrapped_info'

import { scrapingService } from '#services/scraping_service'

interface ScrapedListing {
  id?: number
  name: string | null
  link: string | null
  image: string | null
  address: string | null
  price: number | null
  area: number | null
  bedrooms: number | null
  type: string | null
  forSale: boolean | null
  parking: number | null
  content: string | null
  photos: string[] | null
  agency: string | null
  bathrooms: number | null
  ref: string | null
  placeholderImage: string | null
  agentId: number | null
  published: boolean
  fullLink?: string | null
}

const LISTING_ITEM_SELECTOR = '[class*="col-imovel"]'
const LISTING_ITEM_SELECTOR_CARD = '[class*="col-imovel"]'

export async function jefersonAlba() {
  logger.info('Jeferson Alba...')
  const browser: Browser = await chromium.launch({
    headless: true,
    args: ['--disable-dev-shm-usage', '--no-sandbox'],
  })

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
      'AppleWebKit/537.36 (KHTML, like Gecko) ' +
      'Chrome/120.0 Safari/537.36',
  })

  const baseUrl = 'https://imobiliariajefersonealba.com.br/vendas/imoveis'
  const allListings: ScrapedListing[] = []

  // 1. Discover total pages
  const page = await context.newPage()
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector(LISTING_ITEM_SELECTOR, { timeout: 15000 })

  // Find the "Última" button and click it to get the last page number
  const ultimaButton = page.locator('a.page-link[aria-label="Última"]').first()
  let totalPages = 1

  if (await ultimaButton.count()) {
    await ultimaButton.click()
    await page.waitForLoadState('domcontentloaded')
    // After navigation, get the active page number
    const activePage = page.locator('li.page-item.active a.page-link').first()
    const activePageNum = await activePage.textContent()
    if (activePageNum) {
      totalPages = Number.parseInt(activePageNum.trim())
    }
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
  }

  await page.close()

  logger.info(`Total pages found: ${totalPages}`)

  const pageUrls = Array.from({ length: totalPages }, (_, i) =>
    i === 0 ? baseUrl : `${baseUrl}/${i + 1}`
  )

  logger.info(`Scraping...`)

  for (let i = 0; i < totalPages; i++) {
    const url = pageUrls[i]

    const pageInstance = await context.newPage()

    try {
      await pageInstance.goto(url, {
        waitUntil: 'load',
      })

      await pageInstance.waitForSelector(LISTING_ITEM_SELECTOR, { timeout: 5000 })

      const scrapedListings = await scrapeCurrentPage(pageInstance, baseUrl)

      scrapedListings.forEach((listing) => {
        allListings.push(listing)
      })
    } catch (err) {
      logger.error(`Error scraping listing page ${url}:`, err)
      return []
    } finally {
      await pageInstance.close()
    }
  }

  logger.info(`Scraped ${allListings.length} unique listings`)

  await browser.close()

  logger.info(`Scraping finished ${allListings.length} unique listings collected.`)

  const listingsForDb = allListings.map(({ fullLink, ...listing }) => ({
    ...listing,
  }))

  logger.info('Saving in database...')

  await ScrappedInfo.create({
    agency: 'Jeferson Alba',
    total_listings: allListings.length,
    total_pages: totalPages,
  })

  await Listing.createManyQuietly(listingsForDb)

  logger.info(`Database updated with ${allListings.length} listings`)
  logger.info('Sent to scraping details background.')

  await scrapingService({
    name: 'Jeferson Alba',
    URLs: allListings.map((l) => l.fullLink!).filter((l) => l !== null),
    selectors: {
      ref: '/ver/(\\d+)/',
      content: ['.imovel-content-section'],
      photos: ['.tab-content #imovel-fotos .container .img-gallery-magnific .magnific-img a img'],
    },
  })
}

async function scrapeCurrentPage(page: Page, baseUrl: string): Promise<ScrapedListing[]> {
  await page.waitForSelector(`${LISTING_ITEM_SELECTOR}`, {
    timeout: 5000,
  })

  const visibleLinks = page.locator(LISTING_ITEM_SELECTOR_CARD)

  const linkCount = await visibleLinks.count()

  const links: string[] = []
  const linksSeen = new Set<string>()

  for (let i = 0; i < linkCount; i++) {
    const link = await visibleLinks.nth(i).locator('a').getAttribute('href')

    // get the ref from each link regex
    const refMatch = link?.match(/\/ver\/([^\/?#]+)/)
    const ref = refMatch ? refMatch[1] : null

    if (link && ref && !linksSeen.has(ref)) {
      links.push(link!)
      linksSeen.add(ref)
    }
  }

  const listingPromises = links.map(async (link) => {
    const fullLink = new URL(link, baseUrl).toString()
    try {
      const cardLocator = page.locator(`${LISTING_ITEM_SELECTOR}:has(a[href="${link}"])`).first()

      // PREÇO
      // PREÇO
      const priceEl = cardLocator.locator('span.--price').first()
      await priceEl.evaluate((el: any) => {
        const off = el.querySelector('small.--off')
        if (off) off.remove()
      })
      let price: string | null = await priceEl.innerText({ timeout: 3000 }).catch(() => null)
      let priceValue = 0

      if (price) {
        price = price.trim().replace(/[^\d]/g, '')
        priceValue = Number(price)
      }

      // ENDEREÇO
      const addressEl = cardLocator.locator('span.--location').first()
      let address = await addressEl.textContent({ timeout: 2000 }).catch(() => null)
      if (address) address = address.trim()

      // TIPO
      const typeEl = cardLocator.locator('span.--type').first()
      let type = await typeEl.textContent({ timeout: 2000 }).catch(() => null)
      if (type) {
        type = type.trim()
        if (type.includes('Apartamento')) type = 'Apartamento'
        else if (type.includes('Casa')) type = 'Casa'
        else if (type.includes('Terreno')) type = 'Terreno'
      }

      // ÁREA
      const areaEl = cardLocator
        .locator('ul.box-imovel-items.--lg li.--item')
        .nth(3)
        .locator('strong')
        .first()
      const areaText = await areaEl.textContent({ timeout: 2000 }).catch(() => null)
      let area: number | null = null
      if (areaText && !areaText.includes('0m²')) {
        const match = areaText.trim().replace(/\D/g, '')
        area = match ? Number(match) : null
      }

      // QUARTOS
      const bedroomsEl = cardLocator
        .locator('ul.box-imovel-items.--lg li.--item')
        .nth(0)
        .locator('strong')
        .first()
      const bedroomsText = await bedroomsEl.textContent({ timeout: 2000 }).catch(() => null)

      const bedrooms = Number(bedroomsText!.trim())

      // BANHEIROS
      const bathroomsEl = cardLocator.locator('ul.box-imovel-items.--lg li.--item strong').nth(1)
      const bathroomsText = await bathroomsEl.textContent({ timeout: 2000 }).catch(() => null)
      const bathrooms = Number(bathroomsText!.trim())

      // VAGAS
      const parkingEl = cardLocator
        .locator('ul.box-imovel-items.--lg li.--item')
        .nth(2)
        .locator('strong')
        .first()
      const parkingText = await parkingEl.textContent({ timeout: 2000 }).catch(() => null)
      const parking = Number(parkingText!.trim())

      // REFERÊNCIA
      const refEl = cardLocator.locator('span.--code').first()
      let reference = await refEl.textContent({ timeout: 2000 }).catch(() => null)
      if (reference) reference = reference.replace('Cód.', '').trim()

      return {
        name: null,
        link: fullLink,
        image: null,
        address,
        price: priceValue,
        area,
        bedrooms,
        type,
        forSale: true,
        parking,
        content: '',
        photos: null,
        agency: 'Jeferson Alba',
        bathrooms,
        ref: reference,
        placeholderImage: null,
        agentId: null,
        published: true,
        fullLink,
      }
    } catch (err: any) {
      logger.error(`Error scraping link ${link}: ${err.message || err.toString()}`)
      return null
    }
  })

  const listings = (await Promise.all(listingPromises)).filter((l) => l !== null)

  return listings as ScrapedListing[]
}
