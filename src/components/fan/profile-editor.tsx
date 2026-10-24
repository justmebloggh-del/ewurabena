"use client";

import { useState } from "react";

import { FanAvatar } from "@/components/fan/fan-avatar";
import { SOCIAL_PLATFORMS, type SocialKey, type Socials } from "@/lib/fan-hub";
import { uploadFanMedia } from "@/lib/fan-upload";

type Props = {
  userId: string;
  initial: { display_name: string; bio: string; avatar_url: string | null; socials: Socials };
};

export function ProfileEditor({ userId, initial }: Props) {
  const [name, setName] = useState(initial.display_name);
  const [bio, setBio] = useState(initial.bio);
  const [avatar, setAvatar] = useState(initial.avatar_url);
  const [socials, setSocials] = useState<Record<string, string>>({ ...initial.socials });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function pickAvatar(file: File | undefined) {
    if (!file) return;
    setMessage(null);
    try {
      if (!file.type.startsWith("image/")) throw new Error("Please choose a photo.");
      const media = await uploadFanMedia(file, userId);
      setAvatar(media.url);
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : "Upload failed." });
    }
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    const response = await fetch("/api/fan/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ display_name: name, bio, avatar_url: avatar ?? "", socials }),
    });
    const data = await response.json().catch(() => ({}));
    setBusy(false);
    setMessage(response.ok ? { ok: true, text: "Profile saved." } : { ok: false, text: data.error || "Could not save your profile." });
  }

  return (
    <form onSubmit={save} className="fh-card fh-form">
      <div className="fh-row fh-row-center">
        <FanAvatar author={{ display_name: name || "Fan", avatar_url: avatar }} size={84} />
        <label className="fh-file">
          Change photo
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => pickAvatar(e.target.files?.[0])} />
        </label>
      </div>

      <label className="fh-field">
        <span>Display name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} minLength={2} maxLength={50} required />
      </label>

      <label className="fh-field">
        <span>Bio</span>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={300} rows={3} placeholder="Tell the community about yourself" />
      </label>

      <h3 className="fh-subhead">Your social accounts</h3>
      <p className="fh-muted">Add your handle or paste a link. These show on your profile so other fans can find you.</p>
      <div className="fh-grid2">
        {SOCIAL_PLATFORMS.map((platform) => (
          <label key={platform.key} className="fh-field">
            <span>{platform.label}</span>
            <input
              value={socials[platform.key as SocialKey] ?? ""}
              onChange={(e) => setSocials((s) => ({ ...s, [platform.key]: e.target.value }))}
              placeholder={`${platform.handlePrefix}yourhandle`}
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
            />
          </label>
        ))}
      </div>

      <div className="fh-row fh-row-center">
        <button type="submit" className="btn-primary" disabled={busy}>{busy ? "Saving…" : "Save profile"}</button>
        {message && <span className={message.ok ? "fh-ok" : "fh-error"} role="status">{message.text}</span>}
      </div>
    </form>
  );
}
