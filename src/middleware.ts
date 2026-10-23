import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSnapLpRedirectFromPathname } from "@/lib/redirectkiller/snapLpRedirects";

/** Apex → www so API routes and cookies match SITE_URL. */
export function middleware(request: NextRequest) {
  const snapDest = getSnapLpRedirectFromPathname(request.nextUrl.pathname);
  if (snapDest) {
    const url = request.nextUrl.clone();
    url.pathname = snapDest;
    return NextResponse.redirect(url, 308);
  }

  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();
  if (host === "velorabeauty.world") {
    const url = request.nextUrl.clone();
    url.host = "www.velorabeauty.world";
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
