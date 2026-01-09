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
  photos: string | null
  agency: string | null
  bathrooms: number | null
  ref: string | null
  placeholderImage: string | null
  agentId: number | null
  published: boolean
  fullLink?: string | null
}

const LISTING_ITEM_SELECTOR = '[class*="CardImoveisVitrine"]'
const LISTING_ITEM_SELECTOR_CARD = '[class*="CardImoveisVitrine-module"][class*="container"]'

export async function auxiliadoraPredialScrape() {
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

  const baseUrl = 'https://www.auxiliadorapredial.com.br/comprar/residencial/sc+imbituba'
  const allListings: ScrapedListing[] = []

  // 1. Discover total pages
  const page = await context.newPage()
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector(LISTING_ITEM_SELECTOR, { timeout: 15000 })

  const paginationButtons = page.locator('button[aria-label^="Go to page"]')
  const buttonCount = await paginationButtons.count()
  let totalPages = 1

  for (let i = 0; i < buttonCount; i++) {
    const btnText = await paginationButtons.nth(i).textContent()
    const pageNum = Number.parseInt(btnText!)
    if (!Number.isNaN(pageNum) && pageNum > totalPages) {
      totalPages = pageNum
    }
  }

  await page.close()

  logger.info(`Total de páginas encontradas: ${totalPages}`)

  // 2. Scrape listing pages with controlled concurrency
  const pageUrls = Array.from({ length: totalPages }, (_, i) =>
    i === 0 ? baseUrl : `${baseUrl}?page=${i + 1}`
  )

  for (let i = 0; i < totalPages; i++) {
    const url = pageUrls[i]
    logger.info(`Scraping listing page ${i + 1} of ${pageUrls.length}: ${url}`)

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

  const mappedDetailsScraped = new Map<string, { content: string; photos: string | null }>()

  logger.info('Starting detailed scraping for each listing...')

  const data = await scrapingService({
    URLs: allListings.map((l) => l.fullLink!).filter((l) => l !== null),
    selectors: {
      content: [
        'section.section-sobre-detalhe #descricao div.half-text-hidden',
        'section.section-sobre-detalhe #descricao',
        '[class*="descricao"]',
        '[class*="description"]',
      ],
      photos: [
        'dialog.mosaico-container li.item-mosaico img',
        '[class*="mosaico"] img',
        '[class*="gallery"] img',
        'img[src*="imovel"]',
      ],
    },
  })

  logger.info('Detailed scraping completed.')

  data.results.forEach(({ photos, content, ref }) => {
    mappedDetailsScraped.set(ref, {
      content: content || '',
      photos: photos.length > 0 ? JSON.stringify(photos) : null,
    })
  })

  await browser.close()

  allListings.forEach((listing) => {
    const details = mappedDetailsScraped.get(listing.ref!)
    if (details) {
      listing.content = details.content
      listing.photos = details.photos
    }
  })

  logger.info(`Scraping finalizado! Total de ${allListings.length} imóveis únicos coletados.`)

  const listingsForDb = allListings.map(({ fullLink, ...listing }) => ({
    ...listing,
    image: listing.photos && listing.photos.length > 0 ? listing.photos[0] : null,
  }))

  logger.info('Saving in database...')

  await ScrappedInfo.create({
    agency: 'Auxiliadora Predial',
    total_listings: allListings.length,
    total_pages: totalPages,
  })

  await Listing.createManyQuietly(listingsForDb)

  logger.info(`Database updated with ${allListings.length} listings`)
}

async function scrapeCurrentPage(page: Page, baseUrl: string): Promise<ScrapedListing[]> {
  await page.waitForSelector(`${LISTING_ITEM_SELECTOR} a[target="_blank"][href^="/imovel/"]`, {
    timeout: 5000,
  })

  const visibleLinks = page.locator(
    `${LISTING_ITEM_SELECTOR_CARD} a[target="_blank"][href^="/imovel/"]`
  )

  const linkCount = await visibleLinks.count()
  const links: string[] = []
  const linksSeen = new Set<string>()

  for (let i = 0; i < linkCount; i++) {
    const link = await visibleLinks.nth(i).getAttribute('href')

    // get the ref from each link regex
    const refMatch = link?.match(/\/venda\/([^\/?#]+)/)
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
      const priceEl = cardLocator.locator('span[style*="color: rgb(106, 161, 86)"]').first()
      let price: string | null = await priceEl.innerText({ timeout: 3000 }).catch(() => null)
      let priceValue = 0

      if (price) {
        price = price.trim().replace(/[^\d]/g, '')
        priceValue = Number(price)
      } else {
        const altPriceEl = cardLocator.locator('span[style*="color: rgb(62, 64, 66)"]').first()
        const altPrice = await altPriceEl.innerText({ timeout: 3000 }).catch(() => null)
        if (altPrice) {
          priceValue = Number(altPrice.trim().replace(/[^\d]/g, ''))
        }
      }

      // ENDEREÇO
      const addressEl = cardLocator.locator('[class*="__location"] div span').first()
      let address = await addressEl.textContent({ timeout: 2000 }).catch(() => null)
      if (address) address = address.trim()

      // TIPO
      const typeEl = cardLocator.locator('[class*="__headContent"] h4').first()
      let type = await typeEl.textContent({ timeout: 2000 }).catch(() => null)
      if (type) {
        type = type.trim()
        if (type.includes('Apartamento')) type = 'Apartamento'
        else if (type.includes('Casa')) type = 'Casa'
        else if (type.includes('Terreno')) type = 'Terreno'
      }

      // ÁREA
      const areaEl = cardLocator
        .locator('[class*="__details"] div div')
        .nth(1)
        .locator('span')
        .first()
      const areaText = await areaEl.textContent({ timeout: 2000 }).catch(() => null)
      let area: number | null = null
      if (areaText && !areaText.includes('0m²')) {
        const match = areaText.trim().replace(/\D/g, '')
        area = match ? Number(match) : null
      }

      // QUARTOS
      const bedroomsEl = cardLocator
        .locator('[class*="__details"] div div + div')
        .nth(1)
        .locator('span')
        .first()
      const bedroomsText = await bedroomsEl.textContent({ timeout: 2000 }).catch(() => null)
      const bedrooms = bedroomsText ? Number(bedroomsText.trim()) || null : null

      // BANHEIROS
      const bathroomsEl = cardLocator
        .locator('[class*="__details"] div div + div + div span')
        .first()
      const bathroomsText = await bathroomsEl.textContent({ timeout: 2000 }).catch(() => null)
      const bathrooms = bathroomsText ? Number(bathroomsText.trim()) || null : null

      // VAGAS
      const parkingEl = cardLocator
        .locator('[class*="__details"] div div + div + div + div span')
        .first()
      const parkingText = await parkingEl.textContent({ timeout: 2000 }).catch(() => null)
      const parking = parkingText ? Number(parkingText.trim()) || null : null

      // REFERÊNCIA
      const refEl = cardLocator
        .locator('[class*="__cardImovelFooter"] div div span.text-xs')
        .first()
      let reference = await refEl.textContent({ timeout: 2000 }).catch(() => null)
      if (reference) reference = reference.replace('ref:', '').trim()

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
        agency: 'Auxiliadora Predial',
        bathrooms,
        ref: reference,
        placeholderImage: null,
        agentId: null,
        published: false,
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
