import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { buildRedirectLocation } from "@/lib/redirectkiller/mergeQueryStrings";
import { getAdRedirectBySlug } from "@/lib/redirectkiller/redirectRepository";
import { normalizeRedirectSlug } from "@/lib/redirectkiller/validateSlug";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, context: Ctx) {
  const { slug: rawSlug } = await context.params;
  const slug = normalizeRedirectSlug(rawSlug);
  if (!slug || slug !== rawSlug.trim().toLowerCase()) {
    return new NextResponse("Not found", { status: 404 });
  }

  const record = getAdRedirectBySlug(slug);
  if (!record || !record.enabled) {
    return new NextResponse("Not found", { status: 404 });
  }

  const location = buildRedirectLocation(record.destinationPath, request.nextUrl.searchParams);
  if (location.startsWith("/ads/")) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.redirect(new URL(location, request.url), 302);
}
