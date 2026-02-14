import { redirect } from "react-router";
import { createSupabaseServerClient } from "./supabase.server";

export async function signUpWithEmail(
  request: Request,
  email: string,
  password: string,
  fullName: string
) {
  const { supabase, headers } = createSupabaseServerClient(request);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { error: error.message, headers };
  }

  return { data, headers };
}

export async function signInWithEmail(request: Request, email: string, password: string) {
  const { supabase, headers } = createSupabaseServerClient(request);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message, headers };
  }

  return { data, headers };
}

export async function signInWithGoogle(request: Request) {
  const { supabase } = createSupabaseServerClient(request);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${new URL(request.url).origin}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return redirect(data.url);
}

export async function signOut(request: Request) {
  const { supabase, headers } = createSupabaseServerClient(request);
  await supabase.auth.signOut();
  return redirect("/login", { headers });
}

export async function getUser(request: Request) {
  const { supabase } = createSupabaseServerClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
