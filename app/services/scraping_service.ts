import env from '#start/env'

type Params = {
  URLs: string[]
  selectors: {
    photos: string[]
    content: string[]
  }
}
export async function scrapingService({ URLs, selectors }: Params) {
  await fetch(`${env.get('SCRAPING_SERVICE_URL')}/scrape`, {
    body: JSON.stringify({
      URLs,
      selectors,
    }),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
}
