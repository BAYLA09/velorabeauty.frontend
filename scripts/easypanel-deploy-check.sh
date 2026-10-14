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
echo ""
echo "Live version: ${VERSION:-unknown}"
echo "Suggested pin: ${PIN:-ghcr.io/bayla09/velorabeauty.frontend:latest}"
echo ""
echo "Easypanel checklist:"
echo "  Source = Docker Image (NOT Git)"
echo "  Image  = ghcr.io/bayla09/velorabeauty.frontend:latest"
echo "  Port   = 3000"
echo "  Volume = /app/data"
echo "  Deploy should take 1–3 minutes (not 1 second)"
echo "  Guide: docs/EASYPANEL-FRONTEND-FIX-AR.md"
