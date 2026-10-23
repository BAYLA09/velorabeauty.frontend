import { verifyGithubActionsDeployToken } from "@/lib/deploy/githubActionsOidc";
import { triggerEasypanelRedeploy } from "@/lib/deploy/easypanelRedeploy";

export const runtime = "nodejs";

function readDeployTriggerSecret(): string | null {
  const s = process.env.DEPLOY_TRIGGER_SECRET?.trim();
  return s || null;
}

function authorizeWithSharedSecret(req: Request, secret: string): boolean {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ") && auth.slice(7).trim() === secret) return true;
  const header = req.headers.get("x-deploy-trigger-secret")?.trim();
  return header === secret;
}

async function authorizeDeployRequest(req: Request): Promise<boolean> {
  const shared = readDeployTriggerSecret();
  if (shared && authorizeWithSharedSecret(req, shared)) return true;

  const auth = req.headers.get("authorization");
  const bearer = auth?.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (bearer && (!shared || bearer !== shared)) {
    if (await verifyGithubActionsDeployToken(bearer)) return true;
  }
  return false;
}

/** GitHub Actions → production → Easypanel webhook (webhook URL in Easypanel env only). */
export async function POST(req: Request) {
  if (!(await authorizeDeployRequest(req))) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const result = await triggerEasypanelRedeploy();
  if (!result.ok) {
    const status =
      result.error.includes("EASYPANEL_DEPLOY_WEBHOOK not set") ? 503 : 502;
    return Response.json(
      { ok: false, error: result.error, status: result.status, body: result.body },
      { status: result.status && result.status >= 400 ? result.status : status },
    );
  }

  return Response.json({
    ok: true,
    status: result.status,
    body: result.body,
    message: "Easypanel redeploy triggered",
  });
}
