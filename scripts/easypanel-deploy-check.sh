#!/usr/bin/env bash
# Quick check: live health + hint if Easypanel deploy likely misconfigured.
set -euo pipefail
HEALTH_URL="${HEALTH_URL:-https://www.velorabeauty.world/api/health}"
echo "→ GET $HEALTH_URL"
BODY="$(curl -sf "$HEALTH_URL")"
echo "$BODY" | head -c 2000
echo ""
VERSION="$(echo "$BODY" | sed -n 's/.*"version":"\([^"]*\)".*/\1/p')"
PIN="$(echo "$BODY" | sed -n 's/.*"pinImageTag":"\([^"]*\)".*/\1/p')"
MSG="$(echo "$BODY" | sed -n 's/.*"statusMessageDarija":"\([^"]*\)".*/\1/p')"
MAIN_PREFIX=""
if command -v gh >/dev/null 2>&1; then
  MAIN_PREFIX="$(gh api repos/BAYLA09/velorabeauty.frontend/commits/main -q .sha 2>/dev/null | head -c 7 || true)"
fi
LIVE7="${VERSION:0:7}"
echo ""
echo "Live version: ${VERSION:-unknown} (prefix ${LIVE7:-?})"
echo "GitHub main:  ${MAIN_PREFIX:-unknown}"
if [ -n "$MAIN_PREFIX" ] && [ -n "$LIVE7" ] && [ "$LIVE7" != "$MAIN_PREFIX" ]; then
  echo "⚠️  STALE — Easypanel → Docker Image → latest → Deploy (1–3 min)"
fi
echo "Status: ${MSG:-see /api/health deploy.statusMessageDarija}"
echo "Suggested pin: ${PIN:-ghcr.io/bayla09/velorabeauty.frontend:latest}"
echo ""
echo "Easypanel checklist:"
echo "  Source = Docker Image (NOT Git)"
echo "  Image  = ghcr.io/bayla09/velorabeauty.frontend:latest"
echo "  Port   = 3000"
echo "  Volume = /app/data"
echo "  Deploy should take 1–3 minutes (not 1 second)"
echo "  Guide: docs/EASYPANEL-FRONTEND-FIX-AR.md"
