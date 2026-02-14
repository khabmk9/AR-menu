import { createSupabaseServerClient } from "./supabase.server";
import type { Database } from "./database.types";

type Restaurant = Database["public"]["Tables"]["restaurants"]["Row"];

export async function getRestaurant(request: Request, userId: string): Promise<Restaurant | null> {
  const { supabase } = createSupabaseServerClient(request);
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) return null;
  return data as Restaurant;
}

export async function updateRestaurant(
  request: Request,
  restaurantId: string,
  updates: Partial<Omit<Restaurant, "id" | "user_id" | "created_at" | "updated_at">>
) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const { data, error } = await supabase
    .from("restaurants")
    .update(updates as never)
    .eq("id", restaurantId)
    .select()
    .single();

  return { data: data as Restaurant | null, error: error?.message, headers };
}
