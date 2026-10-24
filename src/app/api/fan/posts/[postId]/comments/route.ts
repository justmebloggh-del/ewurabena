import { NextResponse } from "next/server";

import { requireRouteUser } from "@/lib/api-auth";
import { fanCommentSchema, type FanComment } from "@/lib/fan-hub";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

const COMMENT_SELECT = "id, body, created_at, author:fan_profiles!fan_post_comments_author_id_fkey(id, display_name, avatar_url, is_official)";

export async function GET(_request: Request, { params }: { params: Promise<{ postId: string }> }) {
  if (!isSupabaseConfigured()) return NextResponse.json({ comments: [] });
  const { postId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("fan_post_comments")
    .select(COMMENT_SELECT)
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) return NextResponse.json({ error: "Could not load comments." }, { status: 500 });
  return NextResponse.json({ comments: (data ?? []) as unknown as FanComment[] });
}

export async function POST(request: Request, { params }: { params: Promise<{ postId: string }> }) {
  const authResult = await requireRouteUser();
  if ("error" in authResult) return authResult.error;

  const parsed = fanCommentSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Write a comment (up to 300 characters)." }, { status: 400 });

  const { postId } = await params;
  const { supabase, user } = authResult;

  const since = new Date(Date.now() - 60_000).toISOString();
  const { count } = await supabase
    .from("fan_post_comments")
    .select("*", { count: "exact", head: true })
    .eq("author_id", user.id)
    .gte("created_at", since);
  if ((count ?? 0) >= 10) {
    return NextResponse.json({ error: "You're commenting too fast. Try again in a minute." }, { status: 429 });
  }

  const { data, error } = await supabase
    .from("fan_post_comments")
    .insert({ post_id: postId, author_id: user.id, body: parsed.data.body })
    .select(COMMENT_SELECT)
    .single();

  if (error) return NextResponse.json({ error: "Could not post your comment." }, { status: 400 });
  return NextResponse.json({ comment: data as unknown as FanComment }, { status: 201 });
}
