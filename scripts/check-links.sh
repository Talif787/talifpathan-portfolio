#!/usr/bin/env bash
# Verifies every external URL in the content layer still resolves.
#
# This exists because the portfolio now links 14 source repositories and 10
# live deployments, and a dead demo link is worse than no demo link. Free-tier
# hosts sleep or expire, so this needs re-running periodically rather than once.
#
# Usage: npm run links
set -uo pipefail

urls=$(grep -rhoE 'https://[^"]+' content/*.ts | sort -u)
total=0
failed=0

printf '%-8s %s\n' "STATUS" "URL"
while IFS= read -r url; do
  [ -z "$url" ] && continue
  total=$((total + 1))
  code=$(curl -sS -o /dev/null -L --max-time 20 -w '%{http_code}' "$url" 2>/dev/null || echo "000")
  case "$code" in
    2*|3*) printf '\033[32m%-8s\033[0m %s\n' "$code" "$url" ;;
    401|403) printf '\033[33m%-8s\033[0m %s (blocks bots, check by hand)\n' "$code" "$url" ;;
    *) printf '\033[31m%-8s\033[0m %s\n' "$code" "$url"; failed=$((failed + 1)) ;;
  esac
done <<< "$urls"

echo
echo "$total checked, $failed failed"
[ "$failed" -eq 0 ]
