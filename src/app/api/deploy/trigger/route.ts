import { triggerEasypanelRedeploy } from "@/lib/deploy/easypanelRedeploy";

export const runtime = "nodejs";

function readDeployTriggerSecret(): string | null {
  const s = process.env.DEPLOY_TRIGGER_SECRET?.trim();
  return s || null;
}

function authorizeRequest(req: Request, secret: string): boolean {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ") && auth.slice(7).trim() === secret) return true;
  const header = req.headers.get("x-deploy-trigger-secret")?.trim();
  return header === secret;
}

/** GitHub Actions → production → Easypanel webhook (webhook URL stays in Easypanel env only). */
export async function POST(req: Request) {
  const secret = readDeployTriggerSecret();
  if (!secret) {
    return Response.json(
      {
        ok: false,
        error:
          "DEPLOY_TRIGGER_SECRET not configured on server. Set same value in Easypanel env + GitHub Actions secret.",
      },
      { status: 503 },
    );
  }

  if (!authorizeRequest(req, secret)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const result = await triggerEasypanelRedeploy();
  if (!result.ok) {
    return Response.json(
      { ok: false, error: result.error, status: result.status, body: result.body },
      { status: result.status && result.status >= 400 ? result.status : 502 },
    );
  }

  return Response.json({
    ok: true,
    status: result.status,
    body: result.body,
    message: "Easypanel redeploy triggered",
  });
}
