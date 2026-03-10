import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { requireAdmin } from "@/lib/auth";
import { getAdminContactSubmissions } from "@/lib/data/admin";
import { getPublicContent } from "@/lib/data/public";

export default async function AdminPage() {
  await requireAdmin();

  const [content, contacts] = await Promise.all([getPublicContent(), getAdminContactSubmissions()]);

  return <AdminDashboard content={content} contacts={contacts} />;
}
