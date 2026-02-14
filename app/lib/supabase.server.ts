import { redirect } from "react-router";
import { createServerClient, parse, serialize } from "@supabase/ssr";
import type { Database } from "./database.types";

export function createSupabaseServerClient(request: Request) {
  const cookies = parse(request.headers.get("Cookie") ?? "");
  const headers = new Headers();

  const supabase = createServerClient<Database>(
    process.env.SUPABASE_PROJECT_URL!,
    process.env.SUPABASE_API_KEY!,
    {
      cookies: {
        get(key) {
          return cookies[key];
        },
        set(key, value, options) {
          headers.append("Set-Cookie", serialize(key, value, options));
        },
        remove(key, options) {
          headers.append("Set-Cookie", serialize(key, "", options));
        },
      },
    }
  );

  return { supabase, headers };
}

export async function requireAuth(request: Request) {
  const { supabase } = createSupabaseServerClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw redirect("/login");
  }

  return user;
}
