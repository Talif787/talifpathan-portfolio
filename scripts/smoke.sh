#!/usr/bin/env bash
# Production smoke test. Runs against any deployed URL.
#
#   bash scripts/smoke.sh https://talifpathan.vercel.app
#
# Every assertion here checks something a real visitor depends on, and every
# one of them has failed at least once during this project's development.
set -uo pipefail

BASE="${1:-${SMOKE_BASE_URL:-http://localhost:3000}}"
pass=0; fail=0
ok()   { printf '  \033[32mPASS\033[0m  %s\n' "$1"; pass=$((pass+1)); }
bad()  { printf '  \033[31mFAIL\033[0m  %s\n' "$1"; fail=$((fail+1)); }
check(){ if [ "$2" = "$3" ]; then ok "$1 ($2)"; else bad "$1 (got $2, want $3)"; fi; }

echo "Smoke testing $BASE"
echo

HTML=$(curl -sS --max-time 25 "$BASE" || echo "")
HEAD=$(curl -sSI --max-time 25 "$BASE" || echo "")

echo "routes"
for path in "" robots.txt sitemap.xml icon.svg opengraph-image; do
  code=$(curl -sS -o /dev/null -L --max-time 25 -w '%{http_code}' "$BASE/$path")
  check "GET /$path" "$code" "200"
done
code=$(curl -sS -o /dev/null --max-time 25 -w '%{http_code}' "$BASE/this-route-does-not-exist")
check "GET /this-route-does-not-exist" "$code" "404"

echo
echo "transport"
case "$BASE" in
  https://*) ok "served over HTTPS" ;;
  *) bad "not HTTPS" ;;
esac
redirect=$(curl -sS -o /dev/null -w '%{http_code}' "$(echo "$BASE" | sed 's|https://|http://|')" || echo "000")
case "$redirect" in 200|301|302|307|308) ok "plain HTTP answers ($redirect)" ;; *) bad "plain HTTP -> $redirect" ;; esac

echo
echo "security headers"
for h in content-security-policy strict-transport-security x-content-type-options \
         referrer-policy x-frame-options permissions-policy; do
  if grep -qi "^$h:" <<< "$HEAD"; then ok "$h"; else bad "$h missing"; fi
done
if grep -qi '^x-powered-by:' <<< "$HEAD"; then bad "x-powered-by leaked"; else ok "x-powered-by suppressed"; fi

echo
echo "content"
# Count OCCURRENCES, not lines. Next.js ships minified HTML with everything on
# a handful of lines, so `grep -c` reports 1 no matter how many matches there
# are. That made the project-link assertion fail on a healthy page and made the
# h1 assertion pass by luck.
h1=$(grep -o '<h1' <<< "$HTML" | wc -l | tr -d ' ')
check "exactly one h1" "$h1" "1"
grep -qF '<title>Talif Pathan' <<< "$HTML" && ok "title renders" || bad "title missing"
# -F: the '+' in ld+json is literal. In a basic regex, \+ is the repetition
# operator, so the old pattern searched for "ldjson" and never matched.
grep -qF 'application/ld+json' <<< "$HTML" && ok "JSON-LD present" || bad "JSON-LD missing"
projects=$(grep -o 'github\.com/Talif787/[A-Za-z0-9._-]*' <<< "$HTML" | sort -u | wc -l | tr -d ' ')
if [ "$projects" -ge 14 ]; then ok "distinct project repos linked ($projects)"; else bad "only $projects distinct project repos, want >= 14"; fi
demos=$(grep -o 'Open live demo\|>Live<' <<< "$HTML" | wc -l | tr -d ' ')
if [ "$demos" -ge 10 ]; then ok "live demo links rendered ($demos)"; else bad "only $demos live demo links, want >= 10"; fi
for id in projects experience skills education about contact recognition references; do
  grep -qF "id=\"$id\"" <<< "$HTML" && ok "anchor #$id" || bad "anchor #$id missing"
done

echo
echo "layout stability"
# content-visibility on sections once broke in-page navigation: hash offsets
# were computed against placeholder heights, so a nav click landed in the
# previous section. Assert the optimisation has not been reintroduced.
css_url=$(grep -o '/_next/static/css/[^"]*\.css' <<< "$HTML" | head -1)
if [ -n "$css_url" ] && curl -sS --max-time 25 "$BASE$css_url" | grep -qF 'content-visibility'; then
  bad "content-visibility present in shipped CSS (breaks anchor scrolling)"
else
  ok "no content-visibility in shipped CSS${css_url:+ ($css_url)}"
fi

echo
echo "seo artefacts"
grep -q 'og:title' <<< "$HTML" && ok "open graph tags" || bad "open graph tags missing"
curl -sS --max-time 25 "$BASE/robots.txt" | grep -q "$(echo "$BASE" | sed 's|https\?://||')" \
  && ok "robots.txt references this origin" \
  || bad "robots.txt points elsewhere (NEXT_PUBLIC_SITE_URL wrong at build time)"
curl -sS -o /tmp/smoke-og.png --max-time 25 "$BASE/opengraph-image"
if file /tmp/smoke-og.png | grep -q '1200 x 630'; then ok "OG image is 1200x630 PNG"; else bad "OG image wrong: $(file -b /tmp/smoke-og.png)"; fi

echo
echo "performance"
ttfb=$(curl -sS -o /dev/null --max-time 25 -w '%{time_starttransfer}' "$BASE")
awk -v t="$ttfb" 'BEGIN{ if (t < 1.5) exit 0; exit 1 }' \
  && ok "TTFB ${ttfb}s (< 1.5s)" || bad "TTFB ${ttfb}s (>= 1.5s)"
bytes=$(curl -sS -o /dev/null --max-time 25 -w '%{size_download}' "$BASE")
if [ "$bytes" -lt 400000 ]; then ok "HTML $bytes bytes (< 400KB)"; else bad "HTML $bytes bytes"; fi

echo
echo "$pass passed, $fail failed"
[ "$fail" -eq 0 ]
