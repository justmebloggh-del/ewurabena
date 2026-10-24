"use client";

import { useState } from "react";

export function FollowButton({ userId, initialFollowing }: { userId: string; initialFollowing: boolean }) {
  const [following, setFollowing] = useState(initialFollowing);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    const response = await fetch("/api/fan/follows", {
      method: following ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });
    if (response.ok) setFollowing(!following);
    setBusy(false);
  }

  return (
    <button type="button" onClick={toggle} disabled={busy} className={following ? "btn-gold" : "btn-primary"}>
      {following ? "Following" : "Follow"}
    </button>
  );
}
