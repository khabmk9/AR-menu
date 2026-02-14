import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    window.ENV.SUPABASE_PROJECT_URL,
    window.ENV.SUPABASE_API_KEY
  );
}
