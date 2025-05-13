import { Outlet, redirect } from "react-router";
import { auth } from "~/lib/auth";
import type { Route } from "./+types/protected";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const session = await auth.api.getSession(request);

  if (!session) {
    return redirect("/login");
  }

  return null;
};

export default function ProtectedLayout() {
  return <Outlet />;
}
