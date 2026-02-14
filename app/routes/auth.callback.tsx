import { redirect } from "react-router";
import type { Route } from "./+types/auth.callback";
import { createSupabaseServerClient } from "~/lib/supabase.server";

export async function loader({ request }: Route.LoaderArgs) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const { supabase, headers } = createSupabaseServerClient(request);
    await supabase.auth.exchangeCodeForSession(code);
    return redirect("/dashboard", { headers });
  }

  return redirect("/login");
}
