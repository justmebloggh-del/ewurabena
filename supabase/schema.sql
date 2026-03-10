create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'fan' check (role in ('fan', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.artist_profiles (
  id uuid primary key default gen_random_uuid(),
  stage_name text not null,
  subtitle text not null,
  bio text not null,
  dovvsu_ambassador_note text not null,
  hero_image_url text,
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id)
);

create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  cover_image_url text,
  release_date date,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id)
);

create table if not exists public.tracks (
  id uuid primary key default gen_random_uuid(),
  album_id uuid references public.albums(id) on delete set null,
  title text not null,
  duration_seconds integer,
  track_number integer,
  audio_url text,
  embed_url text,
  youtube_url text,
  spotify_url text,
  apple_music_url text,
  audiomack_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id)
);

create table if not exists public.official_playlists (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  embed_url text,
  cover_image_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id)
);

create table if not exists public.official_playlist_tracks (
  playlist_id uuid not null references public.official_playlists(id) on delete cascade,
  track_id uuid not null references public.tracks(id) on delete cascade,
  position integer not null,
  primary key (playlist_id, track_id)
);

create table if not exists public.fan_playlists (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  is_private boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fan_playlist_tracks (
  playlist_id uuid not null references public.fan_playlists(id) on delete cascade,
  track_id uuid not null references public.tracks(id) on delete cascade,
  position integer not null,
  primary key (playlist_id, track_id)
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  track_id uuid references public.tracks(id) on delete cascade,
  album_id uuid references public.albums(id) on delete cascade,
  created_at timestamptz not null default now(),
  check ((track_id is not null and album_id is null) or (track_id is null and album_id is not null))
);

create unique index if not exists favorites_unique_track on public.favorites (user_id, track_id) where track_id is not null;
create unique index if not exists favorites_unique_album on public.favorites (user_id, album_id) where album_id is not null;

create table if not exists public.media_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  kind text not null check (kind in ('image', 'video')),
  url text not null,
  thumbnail_url text,
  caption text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id)
);

create table if not exists public.awards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  awarded_on date,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id)
);

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  organization text,
  event_date date,
  status text not null default 'new' check (status in ('new', 'in_review', 'resolved')),
  created_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id)
);

create table if not exists public.fan_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.donation_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id)
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id)
);

create or replace function public.is_admin(user_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = user_id and p.role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), 'fan')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.artist_profiles enable row level security;
alter table public.albums enable row level security;
alter table public.tracks enable row level security;
alter table public.official_playlists enable row level security;
alter table public.official_playlist_tracks enable row level security;
alter table public.fan_playlists enable row level security;
alter table public.fan_playlist_tracks enable row level security;
alter table public.favorites enable row level security;
alter table public.media_items enable row level security;
alter table public.awards enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.announcements enable row level security;
alter table public.fan_notifications enable row level security;
alter table public.donation_links enable row level security;
alter table public.social_links enable row level security;

drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles
for select using (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
for update using (auth.uid() = id or public.is_admin(auth.uid()))
with check (auth.uid() = id or public.is_admin(auth.uid()));

create policy "public_artist_profile_read" on public.artist_profiles for select using (true);
create policy "public_albums_read" on public.albums for select using (is_published = true);
create policy "public_tracks_read" on public.tracks for select using (is_published = true);
create policy "public_playlists_read" on public.official_playlists for select using (is_published = true);
create policy "public_playlist_tracks_read" on public.official_playlist_tracks for select using (true);
create policy "public_media_read" on public.media_items for select using (is_published = true);
create policy "public_awards_read" on public.awards for select using (true);
create policy "public_announcements_read" on public.announcements for select using (is_published = true);
create policy "public_donation_links_read" on public.donation_links for select using (is_published = true);
create policy "public_social_links_read" on public.social_links for select using (is_published = true);

create policy "contact_insert_public" on public.contact_submissions for insert with check (true);
create policy "fan_own_playlists" on public.fan_playlists for all
using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "fan_own_playlist_tracks" on public.fan_playlist_tracks for all
using (exists (select 1 from public.fan_playlists fp where fp.id = playlist_id and fp.owner_id = auth.uid()))
with check (exists (select 1 from public.fan_playlists fp where fp.id = playlist_id and fp.owner_id = auth.uid()));

create policy "fan_own_favorites" on public.favorites for all
using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "fan_own_notifications_read" on public.fan_notifications for select using (user_id = auth.uid());
create policy "fan_own_notifications_update" on public.fan_notifications for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "admin_artist_profiles_manage" on public.artist_profiles for all
using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "admin_albums_manage" on public.albums for all
using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "admin_tracks_manage" on public.tracks for all
using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "admin_playlists_manage" on public.official_playlists for all
using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "admin_playlist_tracks_manage" on public.official_playlist_tracks for all
using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "admin_media_manage" on public.media_items for all
using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "admin_awards_manage" on public.awards for all
using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "admin_contact_manage" on public.contact_submissions for select
using (public.is_admin(auth.uid()));
create policy "admin_contact_update" on public.contact_submissions for update
using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "admin_announcements_manage" on public.announcements for all
using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "admin_donation_manage" on public.donation_links for all
using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "admin_social_manage" on public.social_links for all
using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "admin_notifications_insert" on public.fan_notifications for insert
with check (public.is_admin(auth.uid()));
