#!/usr/bin/env bash
# Quick checks when Easypanel Deploy fails (Git vs GHCR vs stale image).
set -euo pipefail

IMAGE="${EASYPANEL_IMAGE:-ghcr.io/bayla09/velorabeauty.frontend:latest}"
HEALTH_URL="${HEALTH_URL:-https://www.velorabeauty.world/api/health}"
MAIN_SHA="$(git rev-parse origin/main 2>/dev/null || git rev-parse HEAD)"
MAIN_SHORT="${MAIN_SHA:0:7}"

echo "=== Velora Easypanel diagnose ==="
echo "Expected main SHA: ${MAIN_SHA} (${MAIN_SHORT})"
echo "Image: ${IMAGE}"
echo ""

echo "--- Live site ---"
if json="$(curl -fsSL "$HEALTH_URL" 2>/dev/null)"; then
  echo "$json" | node -e "
    const j=JSON.parse(require('fs').readFileSync(0,'utf8'));
    const v=(j.version||'').slice(0,7);
    const pin=j.deploy?.pinImageTag||'';
    console.log('health.ok:', j.ok);
    console.log('live version (short):', v);
    console.log('pinImageTag:', pin);
    console.log('easypanel.source hint:', j.deploy?.easypanel?.source);
    console.log('deployTooFastHint:', j.deploy?.easypanel?.deployTooFastHint);
  "
  live_short="$(echo "$json" | node -e "const j=JSON.parse(require('fs').readFileSync(0,'utf8')); console.log((j.version||'').slice(0,7));")"
  if [ "$live_short" = "$MAIN_SHORT" ]; then
    echo "OK — live matches origin/main"
  else
    echo "STALE — live ($live_short) != main ($MAIN_SHORT)"
    echo "  → GitHub Actions → Publish container ✅ on main, then Easypanel Deploy (1–3 min)"
    echo "  → Or pin: ghcr.io/bayla09/velorabeauty.frontend:${MAIN_SHORT}"
  fi
else
  echo "FAIL — cannot reach $HEALTH_URL (502 / DNS / service down)"
fi
echo ""

echo "--- GitHub Actions (Publish container) ---"
if command -v gh >/dev/null 2>&1; then
  gh run list --repo BAYLA09/velorabeauty.frontend --workflow "Publish container" --limit 3 || true
else
  echo "(install gh CLI to list workflow runs)"
fi
echo ""

echo "--- Easypanel checklist ---"
cat <<'EOF'
1. Source = Docker Image (NOT GitHub / Git / Dockerfile on server)
2. Image exactly: ghcr.io/bayla09/velorabeauty.frontend:latest
3. Registry user/password = empty (package is public)
4. HTTP port = 3000 · Volume = /app/data
5. Deploy must take 1–3 minutes (pull layers). If ~1 second → Git/webhook failed
6. Env: deploy/easypanel.env.example (Stripe + STORE_API_KEY)
7. Optional auto-deploy: GitHub secret EASYPANEL_DEPLOY_WEBHOOK = Deployment Trigger URL
   (from Docker Image service — NOT the old Git service webhook)
EOF

echo ""
echo "Guide: docs/EASYPANEL-DEPLOY-NOW-AR.md"
