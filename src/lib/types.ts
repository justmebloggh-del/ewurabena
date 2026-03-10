export type Profile = {
  id: string;
  full_name: string | null;
  role: "fan" | "admin";
  created_at: string;
  updated_at: string;
};

export type ArtistProfile = {
  id: string;
  stage_name: string;
  subtitle: string;
  bio: string;
  dovvsu_ambassador_note: string;
  hero_image_url: string | null;
  updated_at: string;
};

export type Album = {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  release_date: string | null;
  is_published: boolean;
};

export type Track = {
  id: string;
  album_id: string | null;
  title: string;
  duration_seconds: number | null;
  track_number: number | null;
  audio_url: string | null;
  embed_url: string | null;
  youtube_url: string | null;
  spotify_url: string | null;
  apple_music_url: string | null;
  audiomack_url?: string | null;
  is_published: boolean;
};

export type OfficialPlaylist = {
  id: string;
  title: string;
  description: string | null;
  embed_url: string | null;
  cover_image_url: string | null;
  is_published: boolean;
};

export type FanPlaylist = {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  is_private: boolean;
  created_at: string;
};

export type Favorite = {
  id: string;
  user_id: string;
  track_id: string | null;
  album_id: string | null;
  created_at: string;
};

export type MediaItem = {
  id: string;
  title: string;
  kind: "image" | "video";
  url: string;
  thumbnail_url: string | null;
  caption: string | null;
  is_published: boolean;
};

export type Award = {
  id: string;
  title: string;
  description: string | null;
  awarded_on: string | null;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  message: string;
  organization: string | null;
  event_date: string | null;
  status: "new" | "in_review" | "resolved";
  created_at: string;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  is_published: boolean;
  created_at: string;
};

export type DonationLink = {
  id: string;
  label: string;
  url: string;
  is_published: boolean;
};

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
  is_published: boolean;
};

export type FanNotification = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  read_at: string | null;
  created_at: string;
};

export type PublicContent = {
  profile: ArtistProfile;
  albums: Album[];
  tracks: Track[];
  officialPlaylists: OfficialPlaylist[];
  mediaItems: MediaItem[];
  awards: Award[];
  announcements: Announcement[];
  donationLinks: DonationLink[];
  socialLinks: SocialLink[];
};
