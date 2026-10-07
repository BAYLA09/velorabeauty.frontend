#!/usr/bin/env bash
# Compare live site BUILD_SHA with GitHub main (optional: pass expected short SHA).
set -euo pipefail

URL="${HEALTH_URL:-https://www.velorabeauty.world/api/health}"
EXPECTED="${1:-}"

json="$(curl -fsSL "$URL")"
version="$(node -e "const j=JSON.parse(process.argv[1]); console.log(j.version||'');" "$json")"

echo "Health: $json"
echo "Live version: $version"

if [ -n "$EXPECTED" ]; then
  if echo "$version" | grep -qi "$EXPECTED"; then
    echo "OK — live matches expected $EXPECTED"
    exit 0
  fi
  echo "MISMATCH — expected $EXPECTED in version string"
  exit 1
fi
