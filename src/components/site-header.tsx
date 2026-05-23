import { getCurrentUser } from "@/lib/auth";
import { NavClient } from "./nav-client";

export async function SiteHeader() {
  const user = await getCurrentUser();
  return <NavClient isAuthenticated={Boolean(user)} />;
}
