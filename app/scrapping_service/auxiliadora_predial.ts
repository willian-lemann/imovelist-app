import { chromium, Browser, Page } from 'playwright'
import logger from '@adonisjs/core/services/logger'

import ScrappedListing from '#models/scrapped_listing'
import Listing from '#models/listing'
import ScrappedInfo from '#models/scrapped_info'

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
  photos: any | null
  agency: string | null
  bathrooms: number | null
  ref: string | null
  placeholderImage: string | null
  agentId: string | null
  published: boolean
}

export async function auxiliadoraPredialScrape() {
  const browser: Browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
      'AppleWebKit/537.36 (KHTML, like Gecko) ' +
      'Chrome/120.0 Safari/537.36',
  })
  const page: Page = await context.newPage()

  const baseUrl = 'https://www.auxiliadorapredial.com.br/comprar/residencial/sc+imbituba'

  // SELETOR CORRETO PARA CADA CARD DE IMÓVEL
  const LISTING_ITEM_SELECTOR = '.CardImoveisVitrine_container__ZZjyw'

  const allListings: ScrapedListing[] = []

  // 1. Carregar a primeira página para descobrir o total de páginas
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector(LISTING_ITEM_SELECTOR, { timeout: 15_000 })

  // 2. Descobrir o número total de páginas pela paginação
  // O último botão numérico antes do botão "next" contém o número total de páginas
  const paginationButtons = page.locator('button[aria-label^="Go to page"]')
  const buttonCount = await paginationButtons.count()
  let totalPages = 1

  for (let i = 0; i < buttonCount; i++) {
    const btnText = await paginationButtons.nth(i).textContent()
    const pageNum = Number.parseInt(btnText || '0', 10)
    if (!Number.isNaN(pageNum) && pageNum > totalPages) {
      totalPages = pageNum
    }
  }

  logger.info(`Total de páginas encontradas: ${totalPages}`)

  // 3. Scrape pages concurrently in batches (limited concurrency)
  const concurrency = 5 // tune this (2-8); higher is faster but more load on target
  const pageUrls = Array.from({ length: totalPages }, (_, i) =>
    i === 0 ? baseUrl : `${baseUrl}?page=${i + 1}`
  )

  for (let i = 0; i < pageUrls.length; i += concurrency) {
    const batch = pageUrls.slice(i, i + concurrency)
    logger.info(
      `Scraping pages ${i + 1}..${i + batch.length} of ${pageUrls.length} (batch size ${batch.length})`
    )

    for (const url of batch) {
      const pageInstance = await context.newPage()
      await pageInstance.goto(url, { waitUntil: 'load' })
      await pageInstance.waitForSelector(LISTING_ITEM_SELECTOR, { timeout: 15_000 })
      await scrapeCurrentPage(pageInstance, baseUrl).then((listings) => {
        allListings.push(...listings)
      })
      await pageInstance.close()
    }

    // small pause between batches to reduce load / avoid rate limits
    if (i + concurrency < pageUrls.length) {
      await new Promise((res) => setTimeout(res, 500))
    }
  }

  await browser.close()
  logger.info(`Scraping finalizado! Total de ${allListings.length} imóveis coletados.`)

  await ScrappedInfo.create({
    agency: 'Auxiliadora Predial',
    total_listings: allListings.length,
    total_pages: totalPages,
  })

  logger.info(`Scraping completed. Processed ${allListings.length} listings.`)

  await ScrappedListing.updateOrCreateMany('ref', allListings)
  await Listing.updateOrCreateMany('ref', allListings)
}

async function scrapeCurrentPage(page: Page, baseUrl: string): Promise<ScrapedListing[]> {
  const LISTING_ITEM_SELECTOR = '.CardImoveisVitrine_container__ZZjyw'

  page.setDefaultTimeout(2000)

  const itemLocators = page.locator(LISTING_ITEM_SELECTOR)
  const totalItems = await itemLocators.count()

  const listingPromises = Array.from({ length: totalItems }, async (_, i) => {
    const item = itemLocators.nth(i)

    // LINK (URL completa)
    const linkEl = item.locator('a[target="_blank"]').first()
    const link = await linkEl.getAttribute('href')

    // PREÇO (3.950.000)
    const priceEl = item.locator('span[style*="color: rgb(106, 161, 86)"]', {}).first()
    let price: string | null = await priceEl.innerText({ timeout: 5000 }).catch(() => null)
    let priceValue = 0

    if (price) {
      price = price.trim().replace(/[^\d]/g, '')
      priceValue = Number(price)
    } else {
      const altPriceEl = item.locator('span[style*="color: rgb(62, 64, 66)"]').first()
      let altPrice: string | null = await altPriceEl.innerText({ timeout: 5000 }).catch(() => null)
      if (altPrice) {
        altPrice = altPrice.trim().replace(/[^\d]/g, '')
        priceValue = Number(altPrice)
      }
    }

    // ENDEREÇO (Barra De Ibiraquera, Imbituba - SC)
    const addressEl = item.locator('.CardImoveisVitrine_location__9c96p span').first()
    let address: string | null = await addressEl.textContent().catch(() => null)
    if (address) address = address.trim()

    const typeEl = item.locator('.CardImoveisVitrine_headContent__J9iqi h4').first()
    let type: string | null = await typeEl.textContent().catch(() => null)
    if (type) {
      type = type.trim()

      if (type.includes('Apartamento')) {
        type = 'Apartamento'
      }

      if (type.includes('Casa')) {
        type = 'Casa'
      }

      if (type.includes('Terreno')) {
        type = 'Terreno'
      }
    }

    // ÁREA (300m²)
    const areaEl = item.locator('img[alt="Metragem"] + span').first()
    let areaText: string | null = await areaEl.textContent().catch(() => null)
    let area: number | null = null
    if (areaText) {
      areaText = areaText.trim()
      if (!areaText.includes('0m²')) {
        const match = areaText.replace(/\D/g, '')
        area = match ? Number(match) : null
      }
    }

    // QUARTOS (4)
    const bedroomsEl = item.locator('img[alt="Quartos"] + span').first()
    const bedroomsText = await bedroomsEl.textContent().catch(() => null)
    const bedrooms = bedroomsText ? Number(bedroomsText.trim()) || null : null

    // BANHEIROS (3)
    const bathroomsEl = item.locator('img[alt="Banheiros"] + span').first()
    const bathroomsText = await bathroomsEl.textContent().catch(() => null)
    const bathrooms = bathroomsText ? Number(bathroomsText.trim()) || null : null

    // VAGAS (3)
    const parkingEl = item.locator('img[alt="Garagens"] + span').first()
    const parkingText = await parkingEl.textContent().catch(() => null)
    const parking = parkingText ? Number(parkingText.trim()) || null : null

    // REFERÊNCIA (ref: 759737)
    const refEl = item
      .locator('.CardImoveisVitrine_cardImovelFooter__ef_ha span:has-text("ref:")')
      .first()
    let reference: string | null = await refEl.textContent().catch(() => null)
    if (reference) reference = reference.replace('ref:', '').trim()

    // Navigate to detail page to get content and photos
    let content: string | null = null
    let photos: string[] = []

    if (link) {
      const fullLink = new URL(link, baseUrl).toString()

      try {
        const detailPage = await page.context().newPage()

        await detailPage.goto(fullLink, { waitUntil: 'load' })

        // Extract description content
        const descriptionEl = detailPage.locator(
          'section.section-sobre-detalhe #descricao div.half-text-hidden'
        )
        content = await descriptionEl.innerText().catch(() => {
          console.log('Content fails to load')
          return null
        })
        if (content) {
          content = content.trim()
        }

        // Extract all photo URLs from the modal
        const photoElements = await detailPage.$$eval(
          'dialog.mosaico-container li.item-mosaico img',
          (els) => els.map((el) => el.getAttribute('src'))
        )

        const photoCount = photoElements.length

        for (let j = 0; j < photoCount; j++) {
          const photoSrc = photoElements[j]

          if (photoSrc) {
            photos.push(photoSrc)
          }
        }

        await detailPage.close({ reason: 'normal' })
      } catch (err) {
        logger.error(`Error scraping detail page ${fullLink}:`, err)
      }
    }

    return {
      name: null,
      link: link ? new URL(link, baseUrl).toString() : null,
      image: null,
      address,
      price: priceValue,
      area,
      bedrooms,
      type,
      forSale: true,
      parking,
      content,
      photos: photos.length > 0 ? JSON.stringify(photos) : null,
      agency: 'Auxiliadora Predial',
      bathrooms,
      ref: reference,
      placeholderImage: null,
      agentId: null,
      published: false,
    }
  })

  const listings = await Promise.all(listingPromises)

  return listings
}
