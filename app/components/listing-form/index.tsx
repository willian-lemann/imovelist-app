import { Button } from "app/components/ui/button";
import { Input } from "app/components/ui/input";
import { Label } from "app/components/ui/label";
import { Textarea } from "app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "app/components/ui/select";

import { UploadImages } from "../upload-images";

import { createListingAction } from "./actions";
import { useFormState } from "react-dom";
import { useToast } from "../ui/use-toast";
import { useEffect } from "react";

export function ListingForm() {
  const { toast } = useToast();

  const [state, action, isPending] = useFormState(createListingAction, {
    errors: {},
    success: true,
  });

  const isLoading = isPending && !state?.errors;

  useEffect(() => {
    if (!isPending && state?.errors) {
      Object.values(state.errors).forEach((error) =>
        toast({ title: error as string, variant: "destructive" })
      );
    }
  }, [state?.errors, isPending]);

  return (
    <form
      action={action}
      className="space-y-4 max-w-3xl flex flex-col mx-auto pt-10 pb-20"
    >
      <Button className="ml-auto" type="submit">
        {isLoading ? "Publicando..." : "Publicar anúncio"}
      </Button>

      <div>
        <Label htmlFor="photos">Fotos</Label>
        <UploadImages />
      </div>

      <div>
        <Label htmlFor="name">Código ou Ref do Imóvel</Label>
        <Input
          id="ref"
          name="ref"
          placeholder="Ref ou código do imóvel"
          type="text"
          error={state?.errors.ref!}
        />
      </div>

      <div>
        <Label htmlFor="name">Título do imóvel</Label>
        <Input
          id="name"
          name="name"
          placeholder="Nome do imovel para aparecer na listagem"
          type="text"
          error={state.errors.name}
        />
      </div>

      <div>
        <Label htmlFor="type">Tipo do imóvel</Label>
        <Select name="type">
          <SelectTrigger error={state.errors.type}>
            <SelectValue placeholder="Selecione o tipo do imóvel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Apartamento">Apartamento</SelectItem>
            <SelectItem value="Casa">Casa</SelectItem>
            <SelectItem value="Terreno">Terreno</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          name="address"
          placeholder="eg. Rua manoel araujo"
          type="text"
          error={state.errors.address}
        />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <Label htmlFor="bedrooms">Quartos</Label>
          <Input
            id="bedrooms"
            name="bedrooms"
            placeholder="Número de quartos"
            type="number"
            error={state.errors.bedrooms}
          />
        </div>

        <div className="col-span-4">
          <Label htmlFor="bathrooms">Banheiros</Label>
          <Input
            id="bathrooms"
            name="bathrooms"
            placeholder="Número de banheiros"
            type="number"
            error={state.errors.bathrooms}
          />
        </div>

        <div className="col-span-4">
          <Label htmlFor="area">Area (m²)</Label>
          <Input
            id="area"
            name="area"
            placeholder="Area em metros quadrados"
            type="number"
            error={state.errors.area}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="price">Preço</Label>
        <Input
          id="price"
          name="price"
          placeholder="e.g. 1000000.00"
          type="number"
          error={state.errors.price}
        />
      </div>

      <div>
        <Label htmlFor="content">Descrição do imóvel</Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Coloque uma breve descrição do imóvel"
          className="resize-none"
          error={state.errors.content}
        />
      </div>
    </form>
  );
}
