import {
  createBackendCheckout,
  createBackendOrder,
  recoverBackendCheckout,
  type BackendCallResult,
} from "@/lib/backendCheckout/client";
import { readBackendCheckoutConfig } from "@/lib/backendCheckout/config";
import {
  backoffMs,
  nextRemoteAction,
  readStoredCheckoutJob,
  redactEmail,
  type StoredCheckoutJob,
} from "@/lib/backendCheckout/contract";
import {
  listDueBackendCheckoutLinks,
  saveBackendCheckoutProgress,
  type BackendCheckoutLink,
} from "@/lib/backendCheckout/store";

const MAX_ATTEMPTS = 8;

type EnabledConfig = Extract<ReturnType<typeof readBackendCheckoutConfig>, { enabled: true }>;

const globalState = globalThis as typeof globalThis & {
  __veloraBackendCheckoutWorker?: { started: boolean };
};

let draining = false;
let kickAgain = false;

function logLink(message: string, link: BackendCheckoutLink, extra?: Record<string, unknown>): void {
  console.error("[backend-checkout]", message, {
    externalCheckoutId: link.externalCheckoutId,
    email: redactEmail(link.email),
    ...extra,
  });
}

function scheduleRetry(link: BackendCheckoutLink, result: BackendCallResult, now: Date): void {
  const attempts = link.attempts + 1;
  const nowIso = now.toISOString();
  if (attempts >= MAX_ATTEMPTS) {
    saveBackendCheckoutProgress(link.externalCheckoutId, {
      syncStatus: "failed",
      attempts,
      lastError: `gave_up_${result.status}`,
      updatedAt: nowIso,
    });
    logLink("gave up after retries", link, { status: result.status, attempts });
    return;
  }
  const nextAttemptAt = new Date(now.getTime() + backoffMs(attempts)).toISOString();
  saveBackendCheckoutProgress(link.externalCheckoutId, {
    syncStatus: "pending",
    attempts,
    nextAttemptAt,
    lastError: `retry_${result.status}`,
    updatedAt: nowIso,
  });
  logLink("will retry", link, { status: result.status, attempts, nextAttemptAt });
}

function fail(link: BackendCheckoutLink, reason: string, now: Date): void {
  saveBackendCheckoutProgress(link.externalCheckoutId, {
    syncStatus: "failed",
    lastError: reason,
    attempts: link.attempts + 1,
    updatedAt: now.toISOString(),
  });
  logLink("stopped", link, { reason });
}

async function processLink(link: BackendCheckoutLink, config: EnabledConfig, now: Date): Promise<void> {
  let job: StoredCheckoutJob;
  try {
    const parsed = readStoredCheckoutJob(JSON.parse(link.requestJson) as unknown);
    if (!parsed) {
      fail(link, "invalid_payload", now);
      return;
    }
    job = parsed;
  } catch {
    fail(link, "invalid_payload", now);
    return;
  }
  const body = job.checkout;

  let backendId = link.backendCheckoutId;
  let remote = link.remoteStatus;
  const nowIso = now.toISOString();

  if (remote !== "recovered") {
    const created = await createBackendCheckout(config, body);
    if (created.action === "retry") {
      scheduleRetry(link, created, now);
      return;
    }
    if (created.action !== "success") {
      fail(link, created.action === "stop" ? created.reason : "create_failed", now);
      return;
    }
    backendId = created.checkoutId ?? backendId;
    if (!backendId) {
      fail(link, "missing_checkout_id", now);
      return;
    }
    if (remote === "none") remote = "active";
    link = { ...link, backendCheckoutId: backendId, remoteStatus: remote, attempts: 0 };
    saveBackendCheckoutProgress(link.externalCheckoutId, {
      backendCheckoutId: backendId,
      remoteStatus: remote,
      attempts: 0,
      lastError: null,
      updatedAt: nowIso,
    });
  }

  if (job.order) {
    const ordered = await createBackendOrder(config, job.order);
    if (ordered.action === "retry") {
      scheduleRetry(link, ordered, now);
      return;
    }
    if (ordered.action !== "success") {
      fail(link, ordered.action === "stop" ? ordered.reason : "order_failed", now);
      return;
    }
  }

  const action = nextRemoteAction({
    desired: link.desiredStatus,
    remoteStatus: remote,
  });

  if (action === "done") {
    saveBackendCheckoutProgress(link.externalCheckoutId, {
      backendCheckoutId: backendId,
      syncStatus: "settled",
      updatedAt: nowIso,
    });
    return;
  }

  if (!backendId) {
    fail(link, "missing_checkout_id", now);
    return;
  }

  const recovered = await recoverBackendCheckout(config, backendId);
  if (recovered.action === "retry") {
    if (recovered.status === 404) {
      saveBackendCheckoutProgress(link.externalCheckoutId, {
        backendCheckoutId: null,
        remoteStatus: "none",
        syncStatus: "pending",
        updatedAt: nowIso,
      });
    }
    scheduleRetry({ ...link, attempts: link.attempts }, recovered, now);
    return;
  }
  if (recovered.action === "stop") {
    fail(link, recovered.reason, now);
    return;
  }
  saveBackendCheckoutProgress(link.externalCheckoutId, {
    backendCheckoutId: backendId,
    remoteStatus: "recovered",
    desiredStatus: "recovered",
    syncStatus: "settled",
    lastError: null,
    abandonAfter: null,
    updatedAt: nowIso,
  });
}

async function drain(): Promise<void> {
  const config = readBackendCheckoutConfig();
  if (!config.enabled) return;
  const now = new Date();
  const due = listDueBackendCheckoutLinks(now.toISOString());
  for (const link of due) {
    try {
      await processLink(link, config, now);
    } catch (err) {
      logLink("worker error", link, {
        error: err instanceof Error ? err.message : "unknown",
      });
      scheduleRetry(link, { action: "retry", status: 0 }, now);
    }
  }
}

export function kickBackendCheckoutWorker(): void {
  kickAgain = true;
  if (draining) return;
  draining = true;
  void (async () => {
    try {
      while (kickAgain) {
        kickAgain = false;
        await drain();
      }
    } catch (err) {
      console.error("[backend-checkout] drain failed", err instanceof Error ? err.message : err);
    } finally {
      draining = false;
      if (kickAgain) kickBackendCheckoutWorker();
    }
  })();
}

export function startBackendCheckoutWorker(): void {
  if (globalState.__veloraBackendCheckoutWorker?.started) return;
  globalState.__veloraBackendCheckoutWorker = { started: true };
  const config = readBackendCheckoutConfig();
  if (!config.enabled) {
    console.info("[backend-checkout] worker idle:", config.reason);
    return;
  }
  kickBackendCheckoutWorker();
  // Retries pending HTTP jobs. Abandonment is a backend sweep, not this interval.
  const timer = setInterval(() => kickBackendCheckoutWorker(), 30_000);
  timer.unref?.();
}
