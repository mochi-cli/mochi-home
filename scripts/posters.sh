#!/usr/bin/env bash
# Writes the social and marketing images out of the running dev server. The
# route is the source; these files are a build of it, so a reworded claim means
# re-running this rather than editing a PNG.
#
#   npm run dev            # in another terminal
#   ./scripts/posters.sh
set -euo pipefail

ORIGIN="${ORIGIN:-http://localhost:3000}"
OUT="${OUT:-public/social}"
mkdir -p "$OUT"

# variant:sizes — every claim gets the sizes it actually reads well at
COMBOS=(
  "claim:og,x,square,story"
  "numbers:og,x,square,story"
  "agent:og,x,square"
  "limits:x,square"
  "pricing:x,square"
)

for combo in "${COMBOS[@]}"; do
  variant="${combo%%:*}"
  for size in $(echo "${combo#*:}" | tr ',' ' '); do
    file="$OUT/$variant-$size.png"
    code=$(curl -s -o "$file" -w "%{http_code}" "$ORIGIN/api/poster?v=$variant&s=$size")
    if [ "$code" != "200" ]; then
      echo "FAILED $variant/$size -> HTTP $code" >&2
      exit 1
    fi
    printf '%-28s %s\n' "$file" "$(du -h "$file" | cut -f1)"
  done
done
