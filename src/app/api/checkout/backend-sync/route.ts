import { NextResponse } from "next/server";
import { enqueueStorefrontCheckout } from "@/lib/backendCheckout/capture";
import { redactEmail } from "@/lib/backendCheckout/contract";
import { evaluateBackendSyncRequest } from "@/lib/backendCheckout/evaluateSyncRequest";
import { flushBackendCheckoutWorker } from "@/lib/backendCheckout/worker";

export const runtime = "nodejs";

/**
 * Browser-facing capture. The store API key stays on the server.
 * Backend failures are swallowed; this route awaits the worker flush so the
 * backend POST runs before the response is sent.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const evaluated = evaluateBackendSyncRequest(body);
    if (evaluated.action === "skip") {
      console.info("[backend-checkout] sync skipped", { reason: evaluated.reason });
      return NextResponse.json({ ok: true, skipped: evaluated.reason });
    }

    enqueueStorefrontCheckout(evaluated.input);
    const processed = await flushBackendCheckoutWorker();
    console.info("[backend-checkout] sync flushed", {
      externalCheckoutId: evaluated.input.externalCheckoutId,
      email: redactEmail(evaluated.input.email),
      processed,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(
      "[backend-checkout] sync route failed",
      err instanceof Error ? err.message : "unknown",
    );
    return NextResponse.json({ ok: true, skipped: "unavailable" });
  }
}
