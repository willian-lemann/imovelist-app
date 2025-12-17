import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "../components/ui/carousel";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function Gallery({ photos }: { photos: string[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    if (api) {
      api.scrollTo(current);
    }
  }, [api, current]);

  return (
    <section id="gallery" className="container px-4 md:px-8">
      <h2 className="text-2xl font-bold mb-6">Galeria</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-8">
        {photos.map((photo) => (
          <div
            key={photo}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
          >
            <Dialog>
              <DialogTrigger
                onClick={() => {
                  setCurrent(photos.indexOf(photo));
                }}
                asChild
              >
                <img
                  src={photo}
                  className="object-cover rounded-lg w-full h-full"
                  alt={`Imagem do apartamento ${photo}`}
                />
              </DialogTrigger>

              <DialogContent className="h-full max-w-3xl bg-transparent flex flex-col justify-center  outline-none shadow-none border-none">
                <DialogClose className="bg-white bottom-0  rounded h-fit w-fit z-50 ml-auto">
                  <XIcon />
                </DialogClose>

                <DialogTitle hidden />

                <Carousel
                  setApi={setApi}
                  className="group relative z-40 w-full h-[400px] md:h-[600px]"
                >
                  <CarouselPrevious className="absolute left-2 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/80 p-0 hover:bg-white" />
                  <CarouselContent>
                    {photos.map((carouselPhoto) => (
                      <CarouselItem key={carouselPhoto}>
                        <img
                          src={carouselPhoto}
                          className="object-cover w-full h-[400px] md:h-[600px] rounded-lg "
                          alt={`Imagem do apartamento ${carouselPhoto}`}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselNext className="absolute right-2 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/80 p-0 hover:bg-white" />
                </Carousel>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </section>
  );
}
