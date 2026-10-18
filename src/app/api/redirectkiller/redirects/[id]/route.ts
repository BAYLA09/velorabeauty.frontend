import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminMutation } from "@/lib/redirectkiller/apiHelpers";
import {
  deleteAdRedirect,
  getAdRedirectById,
  updateAdRedirect,
} from "@/lib/redirectkiller/redirectRepository";
import {
  validateInternalDestination,
  wouldRedirectLoop,
} from "@/lib/redirectkiller/validateDestination";
import { getSiteUrl } from "@/lib/siteUrl";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

function serialize(record: NonNullable<ReturnType<typeof getAdRedirectById>>) {
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

export async function PATCH(request: NextRequest, context: Ctx) {
  const denied = requireAdminMutation(request);
  if (denied) return denied;

  const { id } = await context.params;
  const existing = getAdRedirectById(id);
  if (!existing) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  let body: { destinationPath?: string; enabled?: boolean };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  let destinationPath = existing.destinationPath;
  if (body.destinationPath !== undefined) {
    const destCheck = validateInternalDestination(String(body.destinationPath));
    if (!destCheck.ok) {
      return NextResponse.json({ ok: false, error: destCheck.reason }, { status: 400 });
    }
    if (wouldRedirectLoop(destCheck.path, existing.slug)) {
      return NextResponse.json({ ok: false, error: "redirect_loop" }, { status: 400 });
    }
    destinationPath = destCheck.path;
  }

  const enabled = body.enabled !== undefined ? Boolean(body.enabled) : existing.enabled;
  const updated = updateAdRedirect(id, { destinationPath, enabled });
  return NextResponse.json({ ok: true, redirect: serialize(updated!) });
}

export async function DELETE(request: NextRequest, context: Ctx) {
  const denied = requireAdminMutation(request);
  if (denied) return denied;

  const { id } = await context.params;
  const ok = deleteAdRedirect(id);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
