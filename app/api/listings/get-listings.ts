import { db } from "../database";
import type { Listing } from "../types";

export async function getListings({
  page = 1,
  limit = 10,
  search = "",
  filter = "",
  type = "",
}) {
  const offset = (page - 1) * limit;

  const query = db
    .from("listings")
    .select("*", { count: "exact" })
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: true });

  if (search) {
    query.ilike("address", `%${search}%`); // Replace 'address' with your search column
  }

  if (filter) {
    query.eq("forSale", filter !== "aluguel");
  }

  if (type) {
    query.eq("type", type);
  }

  const { data, error, count } = await query;

  return {
    data: data as Listing[],
    error,
    count: count || 0,
  };
}
