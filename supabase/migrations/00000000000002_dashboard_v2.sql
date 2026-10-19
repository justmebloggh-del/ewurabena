-- Dashboard v2: Facebook video support, track play analytics, and a
-- storage bucket so the admin can upload audio/video/image files directly
-- instead of only pasting external links.

alter table public.tracks add column if not exists facebook_url text;
alter table public.tracks add column if not exists play_count integer not null default 0;
-- Direct uploaded video file (self-hosted music video), distinct from
-- embed_url (an iframe src, typically a YouTube embed).
alter table public.tracks add column if not exists video_url text;
alter table public.media_items add column if not exists facebook_url text;

-- Public, unauthenticated visitors can trigger this (anyone playing a
-- track should count), but they must not be able to UPDATE tracks
-- directly (that would also let them rewrite titles/links), so this is
-- a narrow security-definer function instead of a broader RLS policy.
create or replace function public.increment_track_play(p_track_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.tracks set play_count = play_count + 1 where id = p_track_id;
end;
$$;

grant execute on function public.increment_track_play(uuid) to anon, authenticated;

-- Storage bucket for admin-uploaded audio/video/image files.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects
for select using (bucket_id = 'media');

drop policy if exists "media_admin_write" on storage.objects;
create policy "media_admin_write" on storage.objects
for insert with check (bucket_id = 'media' and public.is_admin(auth.uid()));

drop policy if exists "media_admin_update" on storage.objects;
create policy "media_admin_update" on storage.objects
for update using (bucket_id = 'media' and public.is_admin(auth.uid()));

drop policy if exists "media_admin_delete" on storage.objects;
create policy "media_admin_delete" on storage.objects
for delete using (bucket_id = 'media' and public.is_admin(auth.uid()));
