import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";

import { PhotoCarouselItem } from "./photo-carousel-item";

export function PhotosCarousel({ photos }) {
  return (
    <Carousel className="group relative z-40 w-full">
      <CarouselPrevious className="absolute md:group-hover:flex-initial  left-2 top-1/2 z-50  -translate-y-1/2 rounded-full bg-white/80 p-0 hover:bg-white" />
      <CarouselContent>
        {photos.map(({ href }) => {
          return (
            <CarouselItem key={href}>
              <div className="w-auto h-[300px] brightness-90 hover:brightness-100 transition-all duration-300 relative rounded-lg overflow-hidden">
                <PhotoCarouselItem href={href} />
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselNext className="absolute md:hidden md:group-hover:flex animate-fadeIn right-2 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/80 p-0 hover:bg-white" />
    </Carousel>
  );
}
