import { NextResponse } from "next/server";

import { getPublicContent } from "@/lib/data/public";

export async function GET() {
  const content = await getPublicContent();
  return NextResponse.json(content);
}
