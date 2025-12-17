import { chromium } from 'playwright'

async function getImovelDetails(page, url) {
  await page.goto(url, { waitUntil: 'networkidle' })

  function extractNumber(str) {
    const match = str.match(/\d+/)
    return match ? Number(match[0]) : null
  }

  const photos = await page
    .locator('.fotorama__nav__frame .fotorama__img')
    .evaluateAll((imgs) => imgs.map((img) => img.src.trim()))

  let allPhotos = photos
  if (!allPhotos.length) {
    allPhotos = await page
      .locator('.fotorama__img')
      .evaluateAll((imgs) => imgs.map((img) => img.src.trim()))
  }

  const content = await page
    .locator('#WID11780_Block_1_central_left_2 .TextBox')
    .innerText()
    .then((text) => text.trim())
    .catch(() => '')

  const area = await page
    .locator('tr.area_total td.Value')
    .innerText()
    .then((text) => text.trim())
    .catch(() => '')

  const type = await page
    .locator('tr.category td.Value')
    .innerText()
    .then((text) => text.trim())
    .catch(() => '')

  const bedrooms = await page
    .locator('tr.bedroom td.Value')
    .innerText()
    .then((text) => text.trim())
    .catch(() => '')

  const parking = await page
    .locator('tr.garage td.Value')
    .innerText()
    .then((text) => text.trim())
    .catch(() => '')

  return {
    photos: allPhotos,
    content,
    area,
    type,
    bedrooms: extractNumber(bedrooms),
    parking: +parking,
  }
}

const defaultConfig = {
  headless: true,
}

const config =
  process.env.NODE_ENV === 'development'
    ? defaultConfig
    : {
        ...defaultConfig,
        executablePath: '/usr/bin/chromium-browser',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      }

export async function execute(url) {
  const browser = await chromium.launch({
    timeout: 180000 * 2,
    ...config,
  })

  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })

  while ((await page.locator('button.BtnShowMoreImovel').count()) > 0) {
    await page.locator('button.BtnShowMoreImovel').click()
    await page.waitForTimeout(2000)
    await page.locator('div.LI_Imovel').first().waitFor({ timeout: 5000 })
  }

  const imoveis = await page.locator('div.LI_Imovel').evaluateAll((nodes) =>
    nodes.map((node) => {
      const getText = (selector) => node.querySelector(selector)?.innerText.trim() || ''
      const getAttr = (selector, attr) => node.querySelector(selector)?.getAttribute(attr) || ''

      const findText = (regex) =>
        Array.from(node.querySelectorAll('span, div'))
          .map((e) => e.innerText)
          .find((t) => t && regex.test(t)) || ''

      function formatPrice(priceStr) {
        if (!priceStr) return null
        let cleaned = priceStr.replace(/[^\d,.-]/g, '')
        cleaned = cleaned.replace(/\./g, '').replace(',', '.')
        const value = Number.parseFloat(cleaned)
        return Number.isNaN(value) ? null : value
      }

      function extractNumber(str) {
        const match = str.match(/\d+/)
        return match ? Number.parseInt(match[0], 10) : null
      }

      return {
        name: getText('.Title, .title'),
        address: getText('.Endereco'),
        price: formatPrice(getText('.Valor .value, .value')),
        link: getAttr('a', 'href'),
        image: getAttr('img', 'src'),
        forSale: node.innerText.includes('Venda') ? true : false,
        parking: findText(/(\d+).*(Vaga)/i).replace(/\D/g, ''),
        bathrooms: extractNumber(getText('.BATHROOM')),
        ref: getText('.ImovelId'),
      }
    })
  )

  for (const imovel of imoveis) {
    const link = imovel.link

    const detailPage = await browser.newPage()
    const { photos, content, area, type, bedrooms, parking } = await getImovelDetails(
      detailPage,
      link
    )
    await detailPage.close()

    imovel.photos = photos
    imovel.content = content
    imovel.area = area
    imovel.agency = 'casa_imoveis'
    imovel.type = type
    imovel.bedrooms = bedrooms
    imovel.parking = parking
  }

  await browser.close()

  return imoveis
}
