import { redirect } from "react-router";
import type { Route } from "./+types/logout";
import { signOut } from "~/lib/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  return await signOut(request);
}

export async function action({ request }: Route.ActionArgs) {
  return await signOut(request);
}

export default function Logout() {
  return null;
}
