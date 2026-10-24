-- Fan Hub: a social space for fans of Ewura Abena.
-- Public profiles, posts (photo/video + a chosen song), likes, comments,
-- follows and reports. Run this in the Supabase SQL editor (or `supabase db push`).

-- ── Public fan profiles ───────────────────────────────────────────────
-- Separate from public.profiles on purpose: that table holds the role and is
-- private. This one is safe to read publicly.
create table if not exists public.fan_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  display_name text not null default 'Fan' check (char_length(display_name) between 2 and 50),
  avatar_url text,
  bio text check (bio is null or char_length(bio) <= 300),
  socials jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Backfill existing accounts.
insert into public.fan_profiles (id, display_name)
select p.id, coalesce(nullif(trim(p.full_name), ''), 'Fan')
from public.profiles p
on conflict (id) do nothing;

-- Create a fan profile for every new account.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  name_value text := coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), 'Fan');
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), 'fan')
  on conflict (id) do nothing;

  insert into public.fan_profiles (id, display_name)
  values (new.id, left(name_value, 50))
  on conflict (id) do nothing;
  return new;
end;
$$;

-- ── Posts ─────────────────────────────────────────────────────────────
create table if not exists public.fan_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.fan_profiles(id) on delete cascade,
  track_id uuid references public.tracks(id) on delete set null,
  caption text check (caption is null or char_length(caption) <= 500),
  media_url text,
  media_kind text check (media_kind in ('image', 'video')),
  created_at timestamptz not null default now(),
  check (caption is not null or media_url is not null or track_id is not null),
  check ((media_url is null) = (media_kind is null))
);
create index if not exists fan_posts_created_idx on public.fan_posts (created_at desc);
create index if not exists fan_posts_author_idx on public.fan_posts (author_id, created_at desc);

create table if not exists public.fan_post_likes (
  post_id uuid not null references public.fan_posts(id) on delete cascade,
  user_id uuid not null references public.fan_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists public.fan_post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.fan_posts(id) on delete cascade,
  author_id uuid not null references public.fan_profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 300),
  created_at timestamptz not null default now()
);
create index if not exists fan_post_comments_post_idx on public.fan_post_comments (post_id, created_at);

create table if not exists public.fan_follows (
  follower_id uuid not null references public.fan_profiles(id) on delete cascade,
  following_id uuid not null references public.fan_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

create table if not exists public.fan_post_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.fan_posts(id) on delete cascade,
  reporter_id uuid not null references public.fan_profiles(id) on delete cascade,
  reason text check (reason is null or char_length(reason) <= 300),
  created_at timestamptz not null default now(),
  unique (post_id, reporter_id)
);

-- ── Row level security ────────────────────────────────────────────────
alter table public.fan_profiles enable row level security;
alter table public.fan_posts enable row level security;
alter table public.fan_post_likes enable row level security;
alter table public.fan_post_comments enable row level security;
alter table public.fan_follows enable row level security;
alter table public.fan_post_reports enable row level security;

-- Anyone can read the feed and profiles (the hub is public to read).
drop policy if exists "fan_profiles_public_read" on public.fan_profiles;
create policy "fan_profiles_public_read" on public.fan_profiles for select using (true);
drop policy if exists "fan_profiles_own_update" on public.fan_profiles;
create policy "fan_profiles_own_update" on public.fan_profiles for update
using (id = auth.uid() or public.is_admin(auth.uid()))
with check (id = auth.uid() or public.is_admin(auth.uid()));
drop policy if exists "fan_profiles_own_insert" on public.fan_profiles;
create policy "fan_profiles_own_insert" on public.fan_profiles for insert with check (id = auth.uid());

drop policy if exists "fan_posts_public_read" on public.fan_posts;
create policy "fan_posts_public_read" on public.fan_posts for select using (true);
drop policy if exists "fan_posts_own_insert" on public.fan_posts;
create policy "fan_posts_own_insert" on public.fan_posts for insert with check (author_id = auth.uid());
drop policy if exists "fan_posts_own_delete" on public.fan_posts;
create policy "fan_posts_own_delete" on public.fan_posts for delete
using (author_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "fan_post_likes_public_read" on public.fan_post_likes;
create policy "fan_post_likes_public_read" on public.fan_post_likes for select using (true);
drop policy if exists "fan_post_likes_own_insert" on public.fan_post_likes;
create policy "fan_post_likes_own_insert" on public.fan_post_likes for insert with check (user_id = auth.uid());
drop policy if exists "fan_post_likes_own_delete" on public.fan_post_likes;
create policy "fan_post_likes_own_delete" on public.fan_post_likes for delete using (user_id = auth.uid());

drop policy if exists "fan_post_comments_public_read" on public.fan_post_comments;
create policy "fan_post_comments_public_read" on public.fan_post_comments for select using (true);
drop policy if exists "fan_post_comments_own_insert" on public.fan_post_comments;
create policy "fan_post_comments_own_insert" on public.fan_post_comments for insert with check (author_id = auth.uid());
drop policy if exists "fan_post_comments_own_delete" on public.fan_post_comments;
create policy "fan_post_comments_own_delete" on public.fan_post_comments for delete
using (author_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "fan_follows_public_read" on public.fan_follows;
create policy "fan_follows_public_read" on public.fan_follows for select using (true);
drop policy if exists "fan_follows_own_insert" on public.fan_follows;
create policy "fan_follows_own_insert" on public.fan_follows for insert with check (follower_id = auth.uid());
drop policy if exists "fan_follows_own_delete" on public.fan_follows;
create policy "fan_follows_own_delete" on public.fan_follows for delete using (follower_id = auth.uid());

drop policy if exists "fan_post_reports_own_insert" on public.fan_post_reports;
create policy "fan_post_reports_own_insert" on public.fan_post_reports for insert with check (reporter_id = auth.uid());
drop policy if exists "fan_post_reports_admin_read" on public.fan_post_reports;
create policy "fan_post_reports_admin_read" on public.fan_post_reports for select using (public.is_admin(auth.uid()));
drop policy if exists "fan_post_reports_admin_delete" on public.fan_post_reports;
create policy "fan_post_reports_admin_delete" on public.fan_post_reports for delete using (public.is_admin(auth.uid()));

-- ── Storage: fan photos & videos ──────────────────────────────────────
-- Fans upload straight from the browser into their own folder (<user id>/…).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'fan-media', 'fan-media', true, 52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/quicktime', 'video/webm']
)
on conflict (id) do update
set file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "fan_media_public_read" on storage.objects;
create policy "fan_media_public_read" on storage.objects
for select using (bucket_id = 'fan-media');

drop policy if exists "fan_media_own_insert" on storage.objects;
create policy "fan_media_own_insert" on storage.objects
for insert to authenticated
with check (bucket_id = 'fan-media' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "fan_media_own_delete" on storage.objects;
create policy "fan_media_own_delete" on storage.objects
for delete to authenticated
using (bucket_id = 'fan-media' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin(auth.uid())));
