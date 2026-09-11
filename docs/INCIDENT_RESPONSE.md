# Incident response

This document is short on purpose. The blast radius of this system is one static
page with no users, no data and no money moving through it. A thirty-page
incident process here would be theatre, and theatre is worse than nothing
because nobody reads it during an actual incident.

## Severity

| Sev | Definition | Response | Example |
|---|---|---|---|
| **SEV1** | Site unreachable or serving the wrong content | Same day | Vercel edge outage, a deployment that renders blank |
| **SEV2** | Site up, something material broken | Within a few days | All project links 404, OG image stopped rendering, CSP breaking a client island |
| **SEV3** | Cosmetic or partial | Next change | One dead demo link, a filter count wrong, an animation not running on one browser |

There is no SEV0. Nothing here can lose customer data or money, because there is
neither.

## Detection

| Source | Latency | Covers |
|---|---|---|
| `synthetic.yml`, every 30 min | up to 30 min | routes, headers, content, SEO, TTFB |
| `deploy-verify.yml`, per deployment | immediate | regressions at the moment they ship |
| Vercel dashboard and status page | manual | platform-level outages |
| A person telling you | unbounded | everything else |

**The honest limitation:** a 30-minute cron cannot see a 4-minute outage, and a
failed workflow emails you rather than paging you. Sub-minute detection with
real alerting costs money. For a portfolio, 30 minutes is the right trade. If
you want better for free, add an UptimeRobot or Better Stack free-tier monitor
pointed at the production URL; both offer a no-cost tier, though the specific
limits change, so check their current pricing page rather than trusting a number
written here.

## First five minutes

```bash
# 1. Is it actually down, or is it you?
curl -sS -o /dev/null -w "%{http_code} in %{time_total}s\n" https://talifpathan.vercel.app

# 2. Is it the platform or the deployment?
open https://www.vercel-status.com

# 3. What is currently promoted, and when did it change?
npx vercel@latest ls

# 4. Full diagnosis
npm run smoke https://talifpathan.vercel.app
```

The smoke output tells you which layer broke. Routes failing means the
deployment; headers failing means `next.config.mjs`; content assertions failing
means the build succeeded with wrong content.

## Playbooks

### Site returns 5xx or does not resolve

1. Check the Vercel status page. If it is a platform incident, there is nothing
   to do at $0 except wait, or execute the Cloudflare Pages failover in
   `DISASTER_RECOVERY.md` if the outage is long enough to matter.
2. If the platform is healthy, the last deployment is the suspect. Roll back:
   `npx vercel@latest promote <last-good-url>`, then smoke test.
3. Only then investigate the cause.

**Roll back first, diagnose second.** Restoring service and understanding the
failure are separate jobs, and doing them in that order is what keeps the
outage short.

### Site is up but blank

Almost always a client island throwing during hydration. Check the browser
console, then Vercel's runtime logs. Roll back, then reproduce locally with
`npm run build && npm start`.

### Security headers missing

`next.config.mjs` changed, or the deployment did not pick it up. `curl -sSI` the
production URL, compare against the `headers()` block, redeploy with `--force`.

### CSP is blocking something

Symptom: a client island silently stops working, and the console shows
`Refused to ...`. The CSP is in `next.config.mjs` with a comment explaining every
directive. Do not reach for `'unsafe-eval'` or a wildcard. Work out what the new
code is loading, then decide whether it belongs in this project at all, given
that today the site loads nothing from anywhere else.

### `robots.txt` or canonical says `localhost`

The build ran without `NEXT_PUBLIC_SITE_URL`. It is inlined at build time, so
setting it now changes nothing until you rebuild: `npx vercel@latest --prod --force`.

### Synthetic probe opened an incident issue

`synthetic.yml` opens one issue labelled `incident` and will not open a second
while it is open. Fix the underlying problem, confirm with `npm run smoke`, then
close the issue by hand. Closing it is what re-arms the alert.

## After an incident

For SEV1 or SEV2, add an assertion to `scripts/smoke.sh` that would have caught
it. That file has grown out of real failures in this project: an OG route that
would not prerender, a nav anchor with no target, a stale `NEXT_PUBLIC_SITE_URL`
baked into a build. Each one is now a line in the smoke test. Keep that habit.

No blameless postmortem process. It is one person.
