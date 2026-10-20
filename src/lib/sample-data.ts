import {
  type Album,
  type Announcement,
  type ArtistProfile,
  type Award,
  type DonationLink,
  type MediaItem,
  type OfficialPlaylist,
  type PublicContent,
  type SocialLink,
  type Track,
} from "@/lib/types";

const profile: ArtistProfile = {
  id: "sample-profile",
  stage_name: "Ewura Abena",
  subtitle: "Soul Gospel Singer || Composer & Songwriter || DOVVSU Ambassador || Warrior Queen",
  bio: "Ewura Abena is a Ghanaian soul gospel musician, singer, songwriter, and recording/performing artiste on a mission to tell of the goodness of the Lord to the ends of the earth. With her unique gift, oil, and personality, she is setting the world on fire for God through what she calls SOUL GOSPEL. Her songs are purposed to hit the soul right from the first note to the last. Her present and previous albums have earned her a top spot in the Ghanaian gospel industry and on the international scene.",
  dovvsu_ambassador_note:
    "DOVVSU Ambassador and Worship Warrior Queen, using music and ministry to advocate for dignity, safety, and restoration.",
  hero_image_url:
    "/ea3.jpg",
  updated_at: new Date().toISOString(),
};

const albums: Album[] = [
  {
    id: "album-1",
    title: "Grace Overflow",
    description: "A divine pathway to pass through the tests with your eyes on the testimony that lays ahead",
    cover_image_url:
      "/ep.jpg",
    release_date: "2025-04-12",
    is_published: true,
  },
  {
    id: "album-2",
    title: "Rebirth",
    description: "Songs of healing, prayer, and renewed hope.",
    cover_image_url:
      "/rebirth.jpg",
    release_date: "2024-09-20",
    is_published: true,
  },
];

// audio_url is intentionally left null across all of these — it previously
// held generic SoundHelix stock-instrumental placeholder files (not real
// Ewura Abena recordings), which meant clicking "Play" silently played
// the wrong audio entirely. With no real hosted master file for these
// tracks, audio_url stays null until the admin uploads a genuine one via
// the dashboard; the Music page's catalog-embed fallback (Spotify/Apple
// Music/Audiomack — all real links to her actual artist profiles) is the
// honest, correct in-site playback source until then.
const tracks: Track[] = [
  {
    id: "track-1",
    album_id: "album-1",
    title: "Grace Overflow Intro",
    duration_seconds: 242,
    track_number: 1,
    audio_url: null,
    embed_url: "https://www.youtube.com/embed/videoseries?si=i8xJl5-K5IqWH7mw&list=PLX0PJMHFz9wbcpUJ3UpjsZLqbcsdrQZuc",
    youtube_url: "https://www.youtube.com/playlist?list=PLX0PJMHFz9wbcpUJ3UpjsZLqbcsdrQZuc",
    spotify_url: "https://open.spotify.com/artist/66omcxaARiacfGoXuXiHXQ?si=pIX56tJYRWOAl2F6_6wt-Q",
    apple_music_url: "https://music.apple.com/gb/artist/ewura-abena/994868905",
    audiomack_url: "https://audiomack.com/ewuraabenamusiq",
    boomplay_url: "https://www.boomplay.com/share/artist/2829036",
    is_published: true,
  },
  {
    id: "track-2",
    album_id: "album-2",
    title: "Rebirth Anthem",
    duration_seconds: 275,
    track_number: 1,
    audio_url: null,
    embed_url: "https://www.youtube.com/embed/videoseries?list=PLX0PJMHFz9wbxRLE0Shpx5MKUjoR83q-a",
    youtube_url: "https://youtube.com/playlist?list=PLX0PJMHFz9wbxRLE0Shpx5MKUjoR83q-a&si=3fysHR5vYvrtXD_u",
    spotify_url: "https://open.spotify.com/artist/66omcxaARiacfGoXuXiHXQ?si=pIX56tJYRWOAl2F6_6wt-Q",
    apple_music_url: "https://music.apple.com/gb/artist/ewura-abena/994868905",
    audiomack_url: "https://audiomack.com/ewuraabenamusiq",
    boomplay_url: "https://www.boomplay.com/share/artist/2829036",
    is_published: true,
  },
  {
    id: "track-3",
    album_id: "album-1",
    title: "Show Them (Live)",
    duration_seconds: 320,
    track_number: 2,
    audio_url: null,
    embed_url: "https://www.youtube.com/embed/jyp91bsLUkw",
    youtube_url: "https://www.youtube.com/watch?v=jyp91bsLUkw",
    spotify_url: "https://open.spotify.com/artist/66omcxaARiacfGoXuXiHXQ",
    apple_music_url: "https://music.apple.com/gb/artist/ewura-abena/994868905",
    audiomack_url: "https://audiomack.com/ewuraabenamusiq",
    boomplay_url: "https://www.boomplay.com/share/artist/2829036",
    is_published: true,
  },
  {
    id: "track-4",
    album_id: "album-2",
    title: "All Is Well",
    duration_seconds: 298,
    track_number: 3,
    audio_url: null,
    embed_url: "https://www.youtube.com/embed/-3pYM4IbUhg",
    youtube_url: "https://www.youtube.com/watch?v=-3pYM4IbUhg",
    spotify_url: "https://open.spotify.com/artist/66omcxaARiacfGoXuXiHXQ",
    apple_music_url: "https://music.apple.com/gb/artist/ewura-abena/994868905",
    audiomack_url: "https://audiomack.com/ewuraabenamusiq",
    boomplay_url: "https://www.boomplay.com/share/artist/2829036",
    is_published: true,
  },
  {
    id: "track-5",
    album_id: "album-1",
    title: "This Far",
    duration_seconds: 265,
    track_number: 4,
    audio_url: null,
    // No verified direct YouTube/Spotify track link found for this song —
    // left blank rather than linking to a generic search-results page,
    // which would look like a broken/dead-end link to fans.
    embed_url: "",
    youtube_url: "",
    spotify_url: "",
    apple_music_url: "https://music.apple.com/gb/artist/ewura-abena/994868905",
    audiomack_url: "https://audiomack.com/ewuraabenamusiq",
    boomplay_url: "https://www.boomplay.com/share/artist/2829036",
    is_published: true,
  },
  {
    id: "track-6",
    album_id: "album-2",
    title: "KamaKama Worship",
    duration_seconds: 312,
    track_number: 5,
    audio_url: null,
    // Same as above — no verified direct track link found.
    embed_url: "",
    youtube_url: "",
    spotify_url: "",
    apple_music_url: "https://music.apple.com/gb/artist/ewura-abena/994868905",
    audiomack_url: "https://audiomack.com/ewuraabenamusiq",
    boomplay_url: "https://www.boomplay.com/share/artist/2829036",
    is_published: true,
  },
];

const officialPlaylists: OfficialPlaylist[] = [
  {
    id: "playlist",
    title: "KamaKama",
    description: "Curated worship songs for quiet time and devotion.",
    embed_url: "https://open.spotify.com/embed/album/0qBocq9qFLLSWZPdSlqrUI?utm_source=generator",
    cover_image_url: "/ea.jpg",
    is_published: true,
  },
];

const mediaItems: MediaItem[] = [
  {
    id: "media-1",
    title: "Show Them",
    kind: "video",
    url: "https://www.youtube.com/embed/jyp91bsLUkw",
    thumbnail_url: null,
    caption: "SHOW THEM is prayer chant song birthed from deep groaning and supplication. It is a call on the Lord to rise to our defense for his own glory's sake. As you sing and pray with this song, may the God who answered Elijah by fire answer you speedily",
    is_published: true,
  },
  {
    id: "media-2",
    title: "All is Well",
    kind: "video",
    url: "https://www.youtube.com/embed/-3pYM4IbUhg",
    thumbnail_url: null,
    caption: "It is a declaration of the truth and our truth, that the God who delights in the prosperity of his children is our God and surely he will prosper everything that concerns me",
    is_published: true,
  },
];

const awards: Award[] = [
  {
    id: "award-1",
    title: "Song 'This Far' Recognition",
    description:
      "The success of 'This Far' earned numerous nominations and recognition, including Songwriter of the Year, Female Vocal Performance, and Gospel Song of the Year at Vodafone Ghana Music Awards 2023, Ghana Music Awards UK 2023, and Ghana Music Awards Europe.",
    awarded_on: "2023-01-01",
  },
];

const announcements: Announcement[] = [
  {
    id: "announcement-1",
    title: "MIND, BODY, AND SPIRIT DECLARATION",
    body: "My spirit is willing. My mind is receptive. My heart is prepared. My body is ready. God is in my story. His glory will be seen.",
    is_published: true,
    created_at: new Date().toISOString(),
  },
];

const donationLinks: DonationLink[] = [
  {
    id: "donation-1",
    label: "Support Ministry via PayPal",
    url: "https://paypal.com",
    is_published: true,
  },
  {
    id: "donation-2",
    label: "Mobile Money Support",
    url: "https://example.com/momo",
    is_published: true,
  },
];

const socialLinks: SocialLink[] = [
  {
    id: "social-1",
    platform: "Spotify",
    url: "https://open.spotify.com/artist/66omcxaARiacfGoXuXiHXQ?si=pIX56tJYRWOAl2F6_6wt-Q",
    is_published: true,
  },
  {
    id: "social-2",
    platform: "Boomplay",
    url: "https://www.boomplay.com/share/artist/2829036?srModel=COPYLINK&srList=IOS",
    is_published: true,
  },
  {
    id: "social-3",
    platform: "Apple Music",
    url: "https://music.apple.com/gb/artist/ewura-abena/994868905",
    is_published: true,
  },
  {
    id: "social-7",
    platform: "Audiomack",
    url: "https://audiomack.com/ewuraabenamusiq",
    is_published: true,
  },
  {
    id: "social-4",
    platform: "Facebook",
    url: "https://www.facebook.com/EwuraAbenaOfficial",
    is_published: true,
  },
  {
    id: "social-5",
    platform: "Instagram",
    url: "https://www.instagram.com/ewuraabenamusiq?igshid=YmMyMTA2M2Y=",
    is_published: true,
  },
  {
    id: "social-6",
    platform: "TikTok",
    url: "https://www.tiktok.com/@ewuraabenamusiq?_t=8bQePQjz1fi&_r=1",
    is_published: true,
  },
];

export const samplePublicContent: PublicContent = {
  profile,
  albums,
  tracks,
  officialPlaylists,
  mediaItems,
  awards,
  announcements,
  donationLinks,
  socialLinks,
};
