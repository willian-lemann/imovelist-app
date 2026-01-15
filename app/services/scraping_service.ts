import env from '#start/env'

type Params = {
  name: string
  URLs: string[]
  selectors: {
    ref: string
    photos: string[]
    content: string[]
  }
}
export async function scrapingService({ name, URLs, selectors }: Params) {
  await fetch(`${env.get('SCRAPING_SERVICE_URL')}/scrape`, {
    body: JSON.stringify({
      name,
      URLs,
      selectors,
    }),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
}
