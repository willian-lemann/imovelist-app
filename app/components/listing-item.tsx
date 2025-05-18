import { BathIcon, BedIcon, RulerIcon } from "lucide-react";
import { Separator } from "../components/ui/separator";
import { Card } from "../components/ui/card";
import { createSlug } from "../lib/utils";

import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Button } from "./ui/button";
import { Link } from "react-router";

import { PhotosCarousel } from "./photos-carousel";

export function ListingItem({ listing }) {
  function getListingURL(listingItem) {
    return `/imoveis/${listingItem.id}-${createSlug(listingItem.address)}`;
  }

  function goEdit(listingId) {
    // router.push({
    //   url: `/${listingId}/editar`,
    // });
  }

  return (
    <Link to={getListingURL(listing)} key={listing.id}>
      <Card className="w-full max-w-md animate-fadeIn relative shadow-none overflow-hidden rounded-lg border-none transition-all">
        <div>
          {listing.isOnwer ? (
            <Badge className="absolute rounded-full hover:bg-white top-3 left-2 z-50 bg-white">
              <Label className="text-sm text-primary font-bold">
                Meu anúncio
              </Label>
            </Badge>
          ) : null}

          <PhotosCarousel photos={listing.photos} />
        </div>

        <div className="py-4 bg-background">
          <div className="flex items-center justify-between mb-2">
            <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground">
              {listing.type}
            </div>
            <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary text-primary-foreground">
              {listing.forSale ? "Venda" : "Aluguel"}
            </div>
          </div>
          <h3 className="text-base font-semibold mb-2 text-muted-foreground">
            {listing.name || listing.address}
          </h3>
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <BedIcon className="w-4 h-4 mr-0.5" />
            {listing.bedrooms}
            <Separator orientation="vertical" className="mx-2" />
            <BathIcon className="w-4 h-4 mr-0.5" />
            {listing.bathrooms}
            <Separator orientation="vertical" className="mx-2" />
            {listing.area ? (
              <>
                <RulerIcon className="w-4 h-4 mr-0.5" />
                {listing.area}
              </>
            ) : null}
          </div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">R$ {listing.price}</div>

            {listing.isOnwer ? (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // goEdit(id)
                }}
                variant="secondary"
                className="h-6 hover:brightness-90 py-4 transition-all duration-200 font-semibold"
              >
                Editar
              </Button>
            ) : null}
          </div>
        </div>
      </Card>
    </Link>
  );
}
