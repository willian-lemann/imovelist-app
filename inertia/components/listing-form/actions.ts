"use server";

import { createListing, Input } from "@/data-access/listings/create-listing";
import { getUser } from "@/data-access/user/get-user";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const listingSchema = z.object({
  photos: z
    .array(z.string())
    .min(1, { message: "Pelo menos uma foto é obrigatória" }),
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  type: z.string().min(1, { message: "Selecione um tipo de imóvel válido" }),
  address: z.string().min(1, { message: "Endereço é obrigatório" }),
  bedrooms: z
    .number()
    .int()
    .min(0, { message: "O número de quartos deve ser 0 ou mais" }),
  bathrooms: z
    .number()
    .int()
    .min(0, { message: "O número de banheiros deve ser 0 ou mais" }),
  area: z.coerce
    .number()
    .min(1, { message: "A área deve ser um número positivo" }),
  ref: z
    .string()
    .min(1, { message: "Referência ou código do imóvel não pode ser vazio." }),
  price: z.coerce.number().min(1, { message: "Preço não pode ser vazio." }),
  content: z
    .string()
    .min(1, { message: "Descrição não pode ser um número vazio." })
    .max(1000, { message: "A descrição deve ter no máximo 1000 caracteres" }),
  forSale: z.boolean().default(false),
});

export type ListingData = z.infer<typeof listingSchema>;

export async function createListingAction(prevState: any, formData: FormData) {
  const { userId } = await auth();
  const loggedUser = await getUser({ id: userId! });

  const rawData = Object.fromEntries(formData.entries());

  const photosString = formData.get("photos") as string;
  const photos = JSON.parse(photosString);

  const data = { ...rawData, photos };

  const validationResult = listingSchema.safeParse(data);

  if (!validationResult.success) {
    let errorMap: any = {};
    validationResult.error.errors.forEach((error) => {
      const errorKey = String(error.path[0]);
      errorMap[errorKey] = error.message;
    });

    return {
      success: false,
      errors: errorMap,
    };
  }

  const result = validationResult.data;

  const image = photos[0];

  const createListingInput: Input = {
    ...result,
    agent_id: loggedUser.agent.id,
    area: String(result.area),
    image,
    placeholderImage: "",
  };

  try {
    await createListing(createListingInput);

    return { success: true, errors: null };
  } catch (error) {
    return {
      success: false,
      errors: {
        server: "Failed to save listing. Please try again.",
      },
    };
  }
}
