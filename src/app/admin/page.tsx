import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { requireAdmin } from "@/lib/auth";
import { getAdminContactSubmissions, getAdminFans } from "@/lib/data/admin";
import { getPublicContent } from "@/lib/data/public";

export default async function AdminPage() {
  await requireAdmin();

  const [content, contacts, fans] = await Promise.all([
    getPublicContent(),
    getAdminContactSubmissions(),
    getAdminFans(),
  ]);

  return <AdminDashboard content={content} contacts={contacts} fans={fans} />;
}
