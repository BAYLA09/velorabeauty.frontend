import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminMutation, requireAdminSession } from "@/lib/redirectkiller/apiHelpers";
import { getRedirectDestinationOptions } from "@/lib/redirectkiller/constants";
import {
  createAdRedirect,
  getAdRedirectBySlug,
  listAdRedirects,
} from "@/lib/redirectkiller/redirectRepository";
import { normalizeRedirectSlug } from "@/lib/redirectkiller/validateSlug";
import {
  validateInternalDestination,
  wouldRedirectLoop,
} from "@/lib/redirectkiller/validateDestination";
import { getSiteUrl } from "@/lib/siteUrl";

export const runtime = "nodejs";

function serialize(record: ReturnType<typeof listAdRedirects>[number]) {
  const base = getSiteUrl();
  return {
    id: record.id,
    slug: record.slug,
    destinationPath: record.destinationPath,
    enabled: record.enabled,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    publicUrl: `${base}/ads/${encodeURIComponent(record.slug)}`,
  };
}

export async function GET(request: NextRequest) {
  const denied = requireAdminSession(request);
  if (denied) return denied;

  const params = request.nextUrl.searchParams;
  const q = params.get("q") ?? undefined;
  const enabledParam = params.get("enabled");
  const enabled =
    enabledParam === "yes" || enabledParam === "no" ? enabledParam : ("all" as const);

  const rows = listAdRedirects({ q, enabled });
  return NextResponse.json({
    ok: true,
    redirects: rows.map(serialize),
    presets: getRedirectDestinationOptions(),
  });
}

export async function POST(request: NextRequest) {
  const denied = requireAdminMutation(request);
  if (denied) return denied;

  let body: { slug?: string; destinationPath?: string; enabled?: boolean };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const slug = normalizeRedirectSlug(String(body.slug ?? ""));
  if (!slug) {
    return NextResponse.json({ ok: false, error: "invalid_slug" }, { status: 400 });
  }

  const destCheck = validateInternalDestination(String(body.destinationPath ?? ""));
  if (!destCheck.ok) {
    return NextResponse.json({ ok: false, error: destCheck.reason }, { status: 400 });
  }
  if (wouldRedirectLoop(destCheck.path, slug)) {
    return NextResponse.json({ ok: false, error: "redirect_loop" }, { status: 400 });
  }

  if (getAdRedirectBySlug(slug)) {
    return NextResponse.json({ ok: false, error: "slug_exists" }, { status: 409 });
  }

  const record = createAdRedirect({
    id: randomUUID(),
    slug,
    destinationPath: destCheck.path,
    enabled: body.enabled !== false,
  });

  return NextResponse.json({ ok: true, redirect: serialize(record) }, { status: 201 });
}
