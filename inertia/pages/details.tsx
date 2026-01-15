import { Button } from '~/components/ui/button'
import { BathIcon, BedIcon, Car, LayoutGrid, RulerIcon } from 'lucide-react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'

import { Card, CardContent } from '~/components/ui/card'
import { Label } from '~/components/ui/label'
import { Gallery } from '~/components/gallery'

import { Share } from '~/components/share'

import Listing from '#models/listing'
import { Head, usePage } from '@inertiajs/react'
import { formatMoney } from '~/lib/utils'

type ListingDetailsProps = {
  listing: Listing
}

export default function Details({ listing }: ListingDetailsProps) {
  const { url } = usePage()

  function handleGoToSite() {
    if (!listing.link) return
    window.open(listing.link, '_blank')
  }

  const name = listing.name || `${listing.type} em ${listing.address}`

  const currentURL = `${import.meta.env.BASE_URL}${new URL(url, window.location.origin).pathname}`

  if (!listing) return null

  return (
    <>
      <Head title={name} />
      <div className="flex flex-col min-h-dvh">
        {/* <MetaTags
        title={metatags.title}
        description={metatags.description}
        image={metatags.image}
        structuredData={metatags.structuredData}
      /> */}

        {/* <AgencyBanner agency={listing.agency} listingURL={listing.link} /> */}
        <section className="bg-white">
          <div className="container pt-0 pb-2 md:px-8 md:py-12">
            <Breadcrumb className="pb-4 hidden md:block">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-muted-foreground  hover:text-black" href="/">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-muted-foreground">
                    Detalhes do imóvel
                  </BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-muted-foreground">
                    <strong>{name}</strong>
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="justify-between items-center mb-4 hidden md:flex">
              <div className="flex items-center gap-2 px-0">
                <h1 className="text-2xl md:text-3xl font-bold">{name}</h1>
              </div>

              <Share url={currentURL} />
            </div>

            <div className="md:hidden">
              <div className="z-9999 absolute right-3 top-3">
                <Share url={currentURL} />
              </div>

              {/* {({ photos }) => <PhotosCarousel photos={photos} showDots />} */}
            </div>

            <div className="hidden md:flex max-h-[420px] gap-2">
              <img
                src={listing.photos![0]}
                className="object-cover h-auto rounded-lg cursor-pointer w-[55%]"
                alt="Imagem da propriedade principal"
              />

              <div className="relative">
                <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[420px] w-full">
                  {listing.photos!.slice(0, 4).map((photo) => (
                    <img
                      key={photo}
                      src={photo}
                      className="object-cover w-full h-full rounded-lg"
                      alt={`Imagem do imovel ${listing.id}`}
                    />
                  ))}
                </div>

                <a href="#gallery" className="hidden md:block absolute bottom-4 right-4">
                  <Button variant="outline" className=" hover:bg-white flex items-center gap-2">
                    <LayoutGrid className="h-5 w-5" />
                    <Label className="cursor-pointer">Mostre todas as fotos</Label>
                  </Button>
                </a>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 md:mt-8 px-4 py-4 md:py-0 rounded-4xl -translate-y-8 md:-translate-y-0 relative bg-white z-50 md:rounded-none">
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold mt-2 md:mt-0 mb-4">{name}</h2>

                <div className="border-t border-b py-4 md:py-6 my-6">
                  <div className="md:grid flex gap-4 justify-around grid-cols-3 md:gap-4">
                    {listing.bedrooms ? (
                      <div className="flex items-center md:gap-4 gap-2">
                        <BedIcon className="w-6 h-6 text-foreground" />
                        <div>
                          <h3 className="hidden md:block font-semibold">Quartos</h3>
                          <div className="text-sm text-foreground flex gap-1">
                            <span> {listing.bedrooms} </span>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {listing.bathrooms ? (
                      <div className="flex items-center md:gap-4 gap-2">
                        <BathIcon className="w-6 h-6 text-foreground" />
                        <div>
                          <h3 className="hidden md:block font-semibold">Banheiros</h3>
                          <div className="text-sm text-foreground flex gap-1">
                            {listing.bathrooms}{' '}
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {listing.parking ? (
                      <div className="flex items-center md:gap-4 gap-2">
                        <Car className="w-6 h-6 text-foreground" />
                        <div>
                          <h3 className="hidden md:block font-semibold">Vagas</h3>
                          <div className="text-sm text-foreground flex gap-1">
                            {listing.parking}{' '}
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {listing.area ? (
                      <div className="flex items-center md:gap-4 gap-1">
                        <RulerIcon className="w-6 h-6 text-foreground" />
                        <div>
                          <h3 className="hidden md:block font-semibold">Area</h3>
                          <p className="text-sm text-foreground">{listing.area}</p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div
                  className="text-sm text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: listing.content!.replace(
                      `<button class="bold button-ler-mais">Ler <!-- -->mais<div class="chevron-ler-mais selected"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform:rotate(270deg)"><path fill-rule="evenodd" clip-rule="evenodd" stroke-width="1" d="M5.64645 2.64645C5.84171 2.45118 6.15829 2.45118 6.35355 2.64645L11.3536 7.64645C11.5488 7.84171 11.5488 8.15829 11.3536 8.35355L6.35355 13.3536C6.15829 13.5488 5.84171 13.5488 5.64645 13.3536C5.45118 13.1583 5.45118 12.8417 5.64645 12.6464L10.2929 8L5.64645 3.35355C5.45118 3.15829 5.45118 2.84171 5.64645 2.64645Z" stroke="currentColor"></path></svg></div></button>`,
                      ''
                    ),
                  }}
                />
              </div>

              <div className="hidden md:block">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-2xl font-bold">{formatMoney(listing.price!)}</div>
                    </div>

                    <Button className="w-full " onClick={handleGoToSite}>
                      {listing.agentId ? 'Falar com corretor' : 'Falar com imobiliaria'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <div className="pb-20">
          <Gallery photos={listing.photos!} />
        </div>

        <Card className="md:hidden fixed bottom-0  rounded-none z-50 right-0 left-0 shadow-lg">
          <CardContent className="pt-6 pb-2 px-4 flex justify-between ">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-muted-foreground">
                  Preço para {listing.forSale ? 'Venda' : 'Locação'}
                </span>
                <p className="text-xl font-bold">R$ {listing.price!.toLocaleString()}</p>
              </div>
            </div>

            <Button className="w-fit" onClick={handleGoToSite}>
              Entrar em contato
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
