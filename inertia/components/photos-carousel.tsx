import { useEffect, useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '../components/ui/carousel'

import { PhotoCarouselItem } from './photo-carousel-item'

type PhotosCarouselProps = {
  showDots?: boolean
  photos: string[]
}

export function PhotosCarousel({ photos, showDots }: PhotosCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <Carousel setApi={setApi} className="group relative z-40 w-36 md:w-[180px] h-32 md:h-[190px]">
      <CarouselPrevious className="absolute md:group-hover:flex-initial left-2 top-[calc(128px-50%)] z-50 -translate-y-1/2 rounded-full bg-white p-0 " />

      <CarouselContent>
        {photos.map((photo) => {
          return (
            <CarouselItem key={photo}>
              <div className="w-36 md:w-auto h-32 md:h-[180px] brightness-100 transition-all duration-300 md:rounded-xl overflow-hidden">
                <PhotoCarouselItem href={photo} blurImage={photo} isFirst={current === 1} />
              </div>
            </CarouselItem>
          )
        })}
      </CarouselContent>
      {showDots && (
        <div className="bg-foreground rounded-xl px-2 flex items-center py-1 z-9999 absolute bottom-10 right-4">
          {photos.length > 1 && (
            <span className="text-xs text-white">
              {current} de {count > 0 ? count : 1}
            </span>
          )}
        </div>
      )}
      <CarouselNext className="absolute md:hidden md:group-hover:flex animate-fadeIn right-2 top-[calc(128px-50%)] z-50 -translate-y-1/2 rounded-full bg-white/80 p-0 hover:bg-white" />
    </Carousel>
  )
}
