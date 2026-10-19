-- Local dev seed: mirrors src/lib/sample-data.ts so the local Supabase
-- instance (`supabase start`) has real, editable rows to test the admin
-- dashboard against instead of empty tables. Re-applied by `supabase db reset`.

insert into public.artist_profiles (stage_name, subtitle, bio, dovvsu_ambassador_note, hero_image_url)
values (
  'Ewura Abena',
  'Soul Gospel Singer || Composer & Songwriter || DOVVSU Ambassador || Warrior Queen',
  'Ewura Abena is a Ghanaian soul gospel musician, singer, songwriter, and recording/performing artiste on a mission to tell of the goodness of the Lord to the ends of the earth. With her unique gift, oil, and personality, she is setting the world on fire for God through what she calls SOUL GOSPEL. Her songs are purposed to hit the soul right from the first note to the last. Her present and previous albums have earned her a top spot in the Ghanaian gospel industry and on the international scene.',
  'DOVVSU Ambassador and Worship Warrior Queen, using music and ministry to advocate for dignity, safety, and restoration.',
  '/ea3.jpg'
);

with a1 as (
  insert into public.albums (title, description, cover_image_url, release_date, is_published)
  values ('Grace Overflow', 'A divine pathway to pass through the tests with your eyes on the testimony that lays ahead', '/ep.jpg', '2025-04-12', true)
  returning id
),
a2 as (
  insert into public.albums (title, description, cover_image_url, release_date, is_published)
  values ('Rebirth', 'Songs of healing, prayer, and renewed hope.', '/rebirth.jpg', '2024-09-20', true)
  returning id
)
insert into public.tracks (album_id, title, duration_seconds, track_number, audio_url, embed_url, youtube_url, spotify_url, apple_music_url, audiomack_url, boomplay_url, is_published)
select a1.id, 'Grace Overflow Intro', 242, 1,
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.youtube.com/embed/videoseries?si=i8xJl5-K5IqWH7mw&list=PLX0PJMHFz9wbcpUJ3UpjsZLqbcsdrQZuc',
  'https://www.youtube.com/playlist?list=PLX0PJMHFz9wbcpUJ3UpjsZLqbcsdrQZuc',
  'https://open.spotify.com/artist/66omcxaARiacfGoXuXiHXQ?si=pIX56tJYRWOAl2F6_6wt-Q',
  'https://music.apple.com/gb/artist/ewura-abena/994868905',
  'https://audiomack.com/ewuraabenamusiq',
  'https://www.boomplay.com/share/artist/2829036',
  true
from a1
union all
select a2.id, 'Rebirth Anthem', 275, 1,
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.youtube.com/embed/videoseries?list=PLX0PJMHFz9wbxRLE0Shpx5MKUjoR83q-a',
  'https://youtube.com/playlist?list=PLX0PJMHFz9wbxRLE0Shpx5MKUjoR83q-a&si=3fysHR5vYvrtXD_u',
  'https://open.spotify.com/artist/66omcxaARiacfGoXuXiHXQ?si=pIX56tJYRWOAl2F6_6wt-Q',
  'https://music.apple.com/gb/artist/ewura-abena/994868905',
  'https://audiomack.com/ewuraabenamusiq',
  'https://www.boomplay.com/share/artist/2829036',
  true
from a2
union all
select a1.id, 'Show Them (Live)', 320, 2,
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'https://www.youtube.com/embed/jyp91bsLUkw',
  'https://www.youtube.com/watch?v=jyp91bsLUkw',
  'https://open.spotify.com/artist/66omcxaARiacfGoXuXiHXQ',
  'https://music.apple.com/gb/artist/ewura-abena/994868905',
  'https://audiomack.com/ewuraabenamusiq',
  'https://www.boomplay.com/share/artist/2829036',
  true
from a1
union all
select a2.id, 'All Is Well', 298, 3,
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'https://www.youtube.com/embed/-3pYM4IbUhg',
  'https://www.youtube.com/watch?v=-3pYM4IbUhg',
  'https://open.spotify.com/artist/66omcxaARiacfGoXuXiHXQ',
  'https://music.apple.com/gb/artist/ewura-abena/994868905',
  'https://audiomack.com/ewuraabenamusiq',
  'https://www.boomplay.com/share/artist/2829036',
  true
from a2
union all
select a1.id, 'This Far', 265, 4,
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  null, null, null,
  'https://music.apple.com/gb/artist/ewura-abena/994868905',
  'https://audiomack.com/ewuraabenamusiq',
  'https://www.boomplay.com/share/artist/2829036',
  true
from a1
union all
select a2.id, 'KamaKama Worship', 312, 5,
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  null, null, null,
  'https://music.apple.com/gb/artist/ewura-abena/994868905',
  'https://audiomack.com/ewuraabenamusiq',
  'https://www.boomplay.com/share/artist/2829036',
  true
from a2;

insert into public.official_playlists (title, description, embed_url, cover_image_url, is_published)
values ('KamaKama', 'Curated worship songs for quiet time and devotion.', 'https://open.spotify.com/embed/album/0qBocq9qFLLSWZPdSlqrUI?utm_source=generator', '/ea.jpg', true);

insert into public.media_items (title, kind, url, thumbnail_url, caption, is_published)
values
  ('Show Them', 'video', 'https://www.youtube.com/embed/jyp91bsLUkw', null, 'SHOW THEM is prayer chant song birthed from deep groaning and supplication. It is a call on the Lord to rise to our defense for his own glory''s sake. As you sing and pray with this song, may the God who answered Elijah by fire answer you speedily', true),
  ('All is Well', 'video', 'https://www.youtube.com/embed/-3pYM4IbUhg', null, 'It is a declaration of the truth and our truth, that the God who delights in the prosperity of his children is our God and surely he will prosper everything that concerns me', true);

insert into public.awards (title, description, awarded_on)
values ('Song ''This Far'' Recognition', 'The success of ''This Far'' earned numerous nominations and recognition, including Songwriter of the Year, Female Vocal Performance, and Gospel Song of the Year at Vodafone Ghana Music Awards 2023, Ghana Music Awards UK 2023, and Ghana Music Awards Europe.', '2023-01-01');

insert into public.announcements (title, body, is_published)
values ('MIND, BODY, AND SPIRIT DECLARATION', 'My spirit is willing. My mind is receptive. My heart is prepared. My body is ready. God is in my story. His glory will be seen.', true);

insert into public.donation_links (label, url, is_published)
values
  ('Support Ministry via PayPal', 'https://paypal.com', true),
  ('Mobile Money Support', 'https://example.com/momo', true);

insert into public.social_links (platform, url, is_published)
values
  ('Spotify', 'https://open.spotify.com/artist/66omcxaARiacfGoXuXiHXQ?si=pIX56tJYRWOAl2F6_6wt-Q', true),
  ('Boomplay', 'https://www.boomplay.com/share/artist/2829036?srModel=COPYLINK&srList=IOS', true),
  ('Apple Music', 'https://music.apple.com/gb/artist/ewura-abena/994868905', true),
  ('Audiomack', 'https://audiomack.com/ewuraabenamusiq', true),
  ('Facebook', 'https://www.facebook.com/EwuraAbenaOfficial', true),
  ('Instagram', 'https://www.instagram.com/ewuraabenamusiq?igshid=YmMyMTA2M2Y=', true),
  ('TikTok', 'https://www.tiktok.com/@ewuraabenamusiq?_t=8bQePQjz1fi&_r=1', true);
