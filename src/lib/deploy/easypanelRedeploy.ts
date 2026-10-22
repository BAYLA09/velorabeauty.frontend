export function readEasypanelDeployWebhookUrl(): string | null {
  const url = process.env.EASYPANEL_DEPLOY_WEBHOOK?.trim();
  return url && url.startsWith("http") ? url : null;
}

export type EasypanelRedeployResult =
  | { ok: true; status: number; body: string }
  | { ok: false; error: string; status?: number; body?: string };

/** POST Easypanel deployment webhook (URL stored in server env, not GitHub). */
export async function triggerEasypanelRedeploy(): Promise<EasypanelRedeployResult> {
  const webhook = readEasypanelDeployWebhookUrl();
  if (!webhook) {
    return {
      ok: false,
      error:
        "EASYPANEL_DEPLOY_WEBHOOK not set on server (Easypanel → Environment — copy Deployments → Webhook URL).",
    };
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      signal: AbortSignal.timeout(45_000),
    });
    const body = (await res.text()).slice(0, 500);
    if (!res.ok) {
      return {
        ok: false,
        error: `Easypanel webhook HTTP ${res.status}`,
        status: res.status,
        body,
      };
    }
    return { ok: true, status: res.status, body };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg };
  }
}
