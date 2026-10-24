import { getCurrentUser, isCurrentUserAdmin } from "@/lib/auth";
import { NavClient } from "./nav-client";

export async function SiteHeader() {
  const user = await getCurrentUser();
  // Only real admins get the Admin button; fans see a link to their profile instead.
  const isAdmin = user ? await isCurrentUserAdmin() : false;
  return <NavClient isAuthenticated={Boolean(user)} isAdmin={isAdmin} />;
}
