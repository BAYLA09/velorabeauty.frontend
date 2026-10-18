import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getRedirectOrigin } from "@/lib/requestOrigin";
import { getBuiltinAdDestination } from "@/lib/redirectkiller/builtinAdRedirects";
import { buildRedirectLocation } from "@/lib/redirectkiller/mergeQueryStrings";
import { getAdRedirectBySlug } from "@/lib/redirectkiller/redirectRepository";
import { normalizeRedirectSlug } from "@/lib/redirectkiller/validateSlug";
import { validateInternalDestination } from "@/lib/redirectkiller/validateDestination";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, context: Ctx) {
  const { slug: rawSlug } = await context.params;
  const slug = normalizeRedirectSlug(rawSlug);
  if (!slug || slug !== rawSlug.trim().toLowerCase()) {
    return new NextResponse("Not found", { status: 404 });
  }

  const record = getAdRedirectBySlug(slug);
  let destinationPath: string | null = null;
  if (record?.enabled) {
    destinationPath = record.destinationPath;
  } else if (record && !record.enabled) {
    return new NextResponse("Not found", { status: 404 });
  } else {
    const builtin = getBuiltinAdDestination(slug);
    if (builtin && validateInternalDestination(builtin).ok) {
      destinationPath = builtin;
    }
  }
  if (!destinationPath) {
    return new NextResponse("Not found", { status: 404 });
  }

  const location = buildRedirectLocation(destinationPath, request.nextUrl.searchParams);
  if (location.startsWith("/ads/")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const origin = getRedirectOrigin(request);
  return NextResponse.redirect(new URL(location, origin), 302);
}
