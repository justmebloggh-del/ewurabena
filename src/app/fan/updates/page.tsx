import Link from "next/link";

import { getCurrentUser } from "@/lib/auth";
import { getFanDashboardData } from "@/lib/data/fan";
import { getPublicContent } from "@/lib/data/public";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export default async function MinistryUpdatesPage() {
  const user = await getCurrentUser();
  const [content, fanData] = await Promise.all([
    getPublicContent(),
    user ? getFanDashboardData(user.id) : Promise.resolve(null),
  ]);

  return (
    <div className="fh-stack">
      <section className="fh-card">
        <h2 className="fh-subhead">Ministry updates</h2>
        {content.announcements.length === 0 ? (
          <p className="fh-muted">No announcements yet. Check back soon.</p>
        ) : (
          content.announcements.map((item) => (
            <article key={item.id} className="fh-update">
              <small>{formatDate(item.created_at)}</small>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))
        )}
      </section>

      <section className="fh-card">
        <h2 className="fh-subhead">Your notifications</h2>
        {!user ? (
          <p className="fh-muted"><Link href="/auth/sign-in">Sign in</Link> to see notifications just for you.</p>
        ) : fanData && fanData.notifications.length > 0 ? (
          fanData.notifications.map((note) => (
            <article key={note.id} className="fh-update">
              <small>{formatDate(note.created_at)}</small>
              <h3>{note.title}</h3>
              <p>{note.body}</p>
            </article>
          ))
        ) : (
          <p className="fh-muted">No notifications yet.</p>
        )}
      </section>
    </div>
  );
}
