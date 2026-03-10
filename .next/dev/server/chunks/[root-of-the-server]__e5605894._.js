module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/sample-data.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "samplePublicContent",
    ()=>samplePublicContent
]);
const profile = {
    id: "sample-profile",
    stage_name: "Ewura Abena",
    subtitle: "Soul Gospel Singer || Composer & Songwriter || DOVVSU Ambassador || Warrior Queen",
    bio: "Ewura Abena is a Ghanaian soul gospel musician, singer, songwriter, and recording/performing artiste on a mission to tell of the goodness of the Lord to the ends of the earth. With her unique gift, oil, and personality, she is setting the world on fire for God through what she calls SOUL GOSPEL. Her songs are purposed to hit the soul right from the first note to the last. Her present and previous albums have earned her a top spot in the Ghanaian gospel industry and on the international scene.",
    dovvsu_ambassador_note: "DOVVSU Ambassador and Worship Warrior Queen, using music and ministry to advocate for dignity, safety, and restoration.",
    hero_image_url: "/ea3.jpg",
    updated_at: new Date().toISOString()
};
const albums = [
    {
        id: "album-1",
        title: "Grace Overflow",
        description: "A divine pathway to pass through the tests with your eyes on the testimony that lays ahead",
        cover_image_url: "/ep.jpg",
        release_date: "2025-04-12",
        is_published: true
    },
    {
        id: "album-2",
        title: "Rebirth",
        description: "Songs of healing, prayer, and renewed hope.",
        cover_image_url: "/rebirth.jpg",
        release_date: "2024-09-20",
        is_published: true
    }
];
const tracks = [
    {
        id: "track-1",
        album_id: "album-1",
        title: "Featured Playlist",
        duration_seconds: 242,
        track_number: 1,
        audio_url: "",
        embed_url: "https://www.youtube.com/embed/videoseries?si=i8xJl5-K5IqWH7mw&list=PLX0PJMHFz9wbcpUJ3UpjsZLqbcsdrQZuc",
        youtube_url: "https://www.youtube.com/playlist?list=PLX0PJMHFz9wbcpUJ3UpjsZLqbcsdrQZuc",
        spotify_url: "https://open.spotify.com/artist/66omcxaARiacfGoXuXiHXQ?si=pIX56tJYRWOAl2F6_6wt-Q",
        apple_music_url: "https://music.apple.com/gb/artist/ewura-abena/994868905",
        audiomack_url: "https://audiomack.com/ewuraabenamusiq",
        is_published: true
    },
    {
        id: "track-2",
        album_id: "album-2",
        title: "Featured Playlist",
        duration_seconds: 275,
        track_number: 2,
        audio_url: "",
        embed_url: "https://www.youtube.com/embed/videoseries?list=PLX0PJMHFz9wbxRLE0Shpx5MKUjoR83q-a",
        youtube_url: "https://youtube.com/playlist?list=PLX0PJMHFz9wbxRLE0Shpx5MKUjoR83q-a&si=3fysHR5vYvrtXD_u",
        spotify_url: "https://open.spotify.com/artist/66omcxaARiacfGoXuXiHXQ?si=pIX56tJYRWOAl2F6_6wt-Q",
        apple_music_url: "https://music.apple.com/gb/artist/ewura-abena/994868905",
        audiomack_url: "https://audiomack.com/ewuraabenamusiq",
        is_published: true
    }
];
const officialPlaylists = [
    {
        id: "playlist",
        title: "KamaKama",
        description: "Curated worship songs for quiet time and devotion.",
        embed_url: "https://open.spotify.com/embed/album/0qBocq9qFLLSWZPdSlqrUI?utm_source=generator",
        cover_image_url: "/ea.jpg",
        is_published: true
    }
];
const mediaItems = [
    {
        id: "media-1",
        title: "Show Them",
        kind: "video",
        url: "https://www.youtube.com/embed/jyp91bsLUkw",
        thumbnail_url: null,
        caption: "SHOW THEM is prayer chant song birthed from deep groaning and supplication. It is a call on the Lord to rise to our defense for his own glory's sake. As you sing and pray with this song, may the God who answered Elijah by fire answer you speedily",
        is_published: true
    },
    {
        id: "media-2",
        title: "All is Well",
        kind: "video",
        url: "https://www.youtube.com/embed/-3pYM4IbUhg",
        thumbnail_url: null,
        caption: "It is a declaration of the truth and our truth, that the God who delights in the prosperity of his children is our God and surely he will prosper everything that concerns me",
        is_published: true
    }
];
const awards = [
    {
        id: "award-1",
        title: "Song 'This Far' Recognition",
        description: "The success of 'This Far' earned numerous nominations and recognition, including Songwriter of the Year, Female Vocal Performance, and Gospel Song of the Year at Vodafone Ghana Music Awards 2023, Ghana Music Awards UK 2023, and Ghana Music Awards Europe.",
        awarded_on: "2023-01-01"
    }
];
const announcements = [
    {
        id: "announcement-1",
        title: "MIND, BODY, AND SPIRIT DECLARATION",
        body: "My spirit is willing. My mind is receptive. My heart is prepared. My body is ready. God is in my story. His glory will be seen.",
        is_published: true,
        created_at: new Date().toISOString()
    }
];
const donationLinks = [
    {
        id: "donation-1",
        label: "Support Ministry via PayPal",
        url: "https://paypal.com",
        is_published: true
    },
    {
        id: "donation-2",
        label: "Mobile Money Support",
        url: "https://example.com/momo",
        is_published: true
    }
];
const socialLinks = [
    {
        id: "social-1",
        platform: "Spotify",
        url: "https://open.spotify.com/artist/66omcxaARiacfGoXuXiHXQ?si=pIX56tJYRWOAl2F6_6wt-Q",
        is_published: true
    },
    {
        id: "social-2",
        platform: "Boomplay",
        url: "https://www.boomplay.com/share/artist/2829036?srModel=COPYLINK&srList=IOS",
        is_published: true
    },
    {
        id: "social-3",
        platform: "Apple Music",
        url: "https://music.apple.com/gb/artist/ewura-abena/994868905",
        is_published: true
    },
    {
        id: "social-7",
        platform: "Audiomack",
        url: "https://audiomack.com/ewuraabenamusiq",
        is_published: true
    },
    {
        id: "social-4",
        platform: "Facebook",
        url: "https://www.facebook.com/EwuraAbenaOfficial",
        is_published: true
    },
    {
        id: "social-5",
        platform: "Instagram",
        url: "https://www.instagram.com/ewuraabenamusiq?igshid=YmMyMTA2M2Y=",
        is_published: true
    },
    {
        id: "social-6",
        platform: "TikTok",
        url: "https://www.tiktok.com/@ewuraabenamusiq?_t=8bQePQjz1fi&_r=1",
        is_published: true
    }
];
const samplePublicContent = {
    profile,
    albums,
    tracks,
    officialPlaylists,
    mediaItems,
    awards,
    announcements,
    donationLinks,
    socialLinks
};
}),
"[project]/src/lib/supabase/env.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSupabasePublicKey",
    ()=>getSupabasePublicKey,
    "getSupabaseSecretKey",
    ()=>getSupabaseSecretKey,
    "getSupabaseUrl",
    ()=>getSupabaseUrl,
    "isSupabaseConfigured",
    ()=>isSupabaseConfigured
]);
function getSupabaseUrl() {
    return ("TURBOPACK compile-time value", "https://minepjcgcwadvurftuaf.supabase.co") || "";
}
function getSupabasePublicKey() {
    return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ("TURBOPACK compile-time value", "sb_publishable_xOvQ6yGQE3ahxobko0Up2g_Qc8JiAqy") || "";
}
function getSupabaseSecretKey() {
    return process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}
function isSupabaseConfigured() {
    return Boolean(getSupabaseUrl() && getSupabasePublicKey());
}
}),
"[project]/src/lib/supabase/server.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSupabaseServerClient",
    ()=>createSupabaseServerClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/env.ts [app-route] (ecmascript)");
;
;
;
async function createSupabaseServerClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSupabaseUrl"])();
    const key = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSupabasePublicKey"])();
    if (!url || !key) {
        throw new Error("Data service is unavailable.");
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])(url, key, {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // Called in a Server Component where setting cookies is not supported.
                }
            }
        }
    });
}
;
}),
"[project]/src/lib/data/public.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getPublicContent",
    ()=>getPublicContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sample$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/sample-data.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/supabase/server.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/env.ts [app-route] (ecmascript)");
;
;
async function getPublicContent() {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isSupabaseConfigured"])()) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sample$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["samplePublicContent"];
    }
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSupabaseServerClient"])();
        const [profileRes, albumsRes, tracksRes, playlistsRes, mediaRes, awardsRes, announcementsRes, donationRes, socialRes] = await Promise.all([
            supabase.from("artist_profiles").select("*").order("updated_at", {
                ascending: false
            }).limit(1).maybeSingle(),
            supabase.from("albums").select("*").eq("is_published", true).order("release_date", {
                ascending: false
            }),
            supabase.from("tracks").select("*").eq("is_published", true).order("track_number", {
                ascending: true
            }),
            supabase.from("official_playlists").select("*").eq("is_published", true).order("created_at", {
                ascending: false
            }),
            supabase.from("media_items").select("*").eq("is_published", true).order("created_at", {
                ascending: false
            }),
            supabase.from("awards").select("*").order("awarded_on", {
                ascending: false
            }),
            supabase.from("announcements").select("*").eq("is_published", true).order("created_at", {
                ascending: false
            }),
            supabase.from("donation_links").select("*").eq("is_published", true).order("created_at", {
                ascending: false
            }),
            supabase.from("social_links").select("*").eq("is_published", true).order("created_at", {
                ascending: false
            })
        ]);
        // Check if any response has an error (e.g., table doesn't exist)
        const hasError = [
            profileRes.error,
            albumsRes.error,
            tracksRes.error,
            playlistsRes.error,
            mediaRes.error,
            awardsRes.error,
            announcementsRes.error,
            donationRes.error,
            socialRes.error
        ].some(Boolean);
        // Fall back to sample data if there's any error (e.g., tables don't exist)
        if (hasError) {
            console.warn("Supabase database not ready, falling back to sample data");
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sample$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["samplePublicContent"];
        }
        const profile = profileRes.data ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sample$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["samplePublicContent"].profile;
        return {
            profile,
            albums: albumsRes.data ?? [],
            tracks: tracksRes.data ?? [],
            officialPlaylists: playlistsRes.data ?? [],
            mediaItems: mediaRes.data ?? [],
            awards: awardsRes.data ?? [],
            announcements: announcementsRes.data ?? [],
            donationLinks: donationRes.data ?? [],
            socialLinks: socialRes.data ?? []
        };
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sample$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["samplePublicContent"];
    }
}
}),
"[project]/src/app/api/public/content/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$public$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data/public.ts [app-route] (ecmascript)");
;
;
async function GET() {
    const content = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$public$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPublicContent"])();
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(content);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e5605894._.js.map