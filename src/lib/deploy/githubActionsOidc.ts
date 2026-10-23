import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

export const GITHUB_ACTIONS_OIDC_ISSUER = "https://token.actions.githubusercontent.com";
export const DEPLOY_OIDC_AUDIENCE = "velorabeauty-easypanel-deploy";
const ALLOWED_REPO = "BAYLA09/velorabeauty.frontend";

const jwks = createRemoteJWKSet(new URL(`${GITHUB_ACTIONS_OIDC_ISSUER}/.well-known/jwks`));

function subjectAllowsDeploy(sub: string): boolean {
  if (!sub.includes(`repo:${ALLOWED_REPO}`)) return false;
  if (sub.includes(":environment:")) return true;
  if (sub.includes(":ref:refs/heads/main")) return true;
  return false;
}

export function deployOidcAllowedFromPayload(payload: JWTPayload): boolean {
  const sub = typeof payload.sub === "string" ? payload.sub : "";
  return subjectAllowsDeploy(sub);
}

/** Validates GitHub Actions OIDC JWT (no shared secret in GitHub). */
export async function verifyGithubActionsDeployToken(token: string): Promise<boolean> {
  const trimmed = token.trim();
  if (!trimmed) return false;
  try {
    const { payload } = await jwtVerify(trimmed, jwks, {
      issuer: GITHUB_ACTIONS_OIDC_ISSUER,
      audience: DEPLOY_OIDC_AUDIENCE,
    });
    return deployOidcAllowedFromPayload(payload);
  } catch {
    return false;
  }
}
