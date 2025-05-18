import { db } from "../database";

export async function getListing(id: number) {
  const response = await db
    .from("listings")
    .select("*")
    .filter("id", "eq", id)
    .single();

  return response.data;
}
