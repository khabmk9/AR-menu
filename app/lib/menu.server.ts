import { createSupabaseServerClient } from "./supabase.server";
import type { Database } from "./database.types";

type Menu = Database["public"]["Tables"]["menus"]["Row"];
type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];
type ArSession = Database["public"]["Tables"]["ar_sessions"]["Row"];

export type MenuWithItems = Menu & { menu_items: MenuItem[] };

export async function getMenus(request: Request, restaurantId: string): Promise<MenuWithItems[]> {
  const { supabase } = createSupabaseServerClient(request);
  const { data, error } = await supabase
    .from("menus")
    .select("*, menu_items(*)")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as unknown as MenuWithItems[];
}

export async function getMenu(request: Request, menuId: string): Promise<MenuWithItems | null> {
  const { supabase } = createSupabaseServerClient(request);
  const { data, error } = await supabase
    .from("menus")
    .select("*, menu_items(*)")
    .eq("id", menuId)
    .single();

  if (error || !data) return null;
  return data as unknown as MenuWithItems;
}

export async function createMenu(
  request: Request,
  restaurantId: string,
  name: string,
  description?: string
) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const { data, error } = await supabase
    .from("menus")
    .insert({ restaurant_id: restaurantId, name, description } as never)
    .select()
    .single();

  return { data: data as Menu | null, error: error?.message, headers };
}

export async function updateMenu(
  request: Request,
  menuId: string,
  updates: Partial<Omit<Menu, "id" | "restaurant_id" | "created_at" | "updated_at">>
) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const { data, error } = await supabase
    .from("menus")
    .update(updates as never)
    .eq("id", menuId)
    .select()
    .single();

  return { data: data as Menu | null, error: error?.message, headers };
}

export async function deleteMenu(request: Request, menuId: string) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const { error } = await supabase.from("menus").delete().eq("id", menuId);
  return { error: error?.message, headers };
}

export async function duplicateMenu(request: Request, menuId: string) {
  const { supabase, headers } = createSupabaseServerClient(request);

  const original = await getMenu(request, menuId);
  if (!original) return { error: "Menu not found", headers };

  const { data: newMenu, error: menuError } = await supabase
    .from("menus")
    .insert({
      restaurant_id: original.restaurant_id,
      name: `${original.name} (Copy)`,
      description: original.description,
      design_theme: original.design_theme,
    } as never)
    .select()
    .single();

  if (menuError || !newMenu) return { error: menuError?.message, headers };

  const typedNewMenu = newMenu as unknown as Menu;

  if (original.menu_items && original.menu_items.length > 0) {
    const items = original.menu_items.map((item) => ({
      menu_id: typedNewMenu.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image_url: item.image_url,
      is_available: item.is_available,
      is_popular: item.is_popular,
      dietary_info: item.dietary_info,
      allergens: item.allergens,
      spicy_level: item.spicy_level,
      position: item.position,
    }));

    await supabase.from("menu_items").insert(items as never);
  }

  return { data: typedNewMenu, headers };
}

export async function addMenuItem(
  request: Request,
  menuId: string,
  item: {
    name: string;
    description?: string;
    price: number;
    category: string;
    image_url?: string;
    is_popular?: boolean;
    dietary_info?: string[];
    allergens?: string[];
    spicy_level?: number;
    position?: number;
  }
) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const { data, error } = await supabase
    .from("menu_items")
    .insert({ menu_id: menuId, ...item } as never)
    .select()
    .single();

  return { data: data as MenuItem | null, error: error?.message, headers };
}

export async function removeMenuItem(request: Request, itemId: string) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const { error } = await supabase.from("menu_items").delete().eq("id", itemId);
  return { error: error?.message, headers };
}

export async function getMenuAnalytics(request: Request, restaurantId: string) {
  const { supabase } = createSupabaseServerClient(request);

  const { data: menus } = await supabase
    .from("menus")
    .select("id")
    .eq("restaurant_id", restaurantId);

  if (!menus || menus.length === 0) return { totalScans: 0, sessions: [] as ArSession[] };

  const menuIds = (menus as unknown as Array<{ id: string }>).map((m) => m.id);

  const { data: sessions, count } = await supabase
    .from("ar_sessions")
    .select("*", { count: "exact" })
    .in("menu_id", menuIds)
    .order("created_at", { ascending: false })
    .limit(20);

  return { totalScans: count || 0, sessions: (sessions || []) as unknown as ArSession[] };
}
