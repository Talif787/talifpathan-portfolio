# Disaster recovery

## Objectives

| Metric | Target | Why it is achievable |
|---|---|---|
| **RPO** | **0** | Git is the only store of record. There is no runtime state, no database, no uploads, no user data. Anything committed is safe; anything uncommitted was never part of the system. |
| **RTO** | **~15 minutes** | Rebuilding production is: import the repo into a hosting platform, set one environment variable, deploy. |

These numbers are unusually good, and the reason is worth stating plainly: the
system has no state. Most disaster recovery difficulty is data recovery, and
there is no data here. Do not read these figures as evidence of a robust
recovery design; read them as evidence of a small system.

## What is where

| Asset | Primary | Backup | Recoverable? |
|---|---|---|---|
| Source code | GitHub | Every local clone; the delivered ZIP | Yes |
| Content (all copy and data) | `content/` in Git | same | Yes |
| Build output | Vercel | Reproducible from source | Yes, by rebuilding |
| Deployment history | Vercel | none | No, and it does not matter |
| Environment config | Vercel dashboard | Documented in `ENVIRONMENT_VARIABLES.md` | Yes, one variable |
| Secrets | none exist | n/a | n/a |
| DNS | Vercel-managed `.vercel.app` | n/a | Reassigned on redeploy |

**Nothing in this system is irrecoverable from a Git clone.** That is the whole
recovery story.

## Scenarios

### Vercel account lost, suspended or the platform is down long-term

Deploy to Cloudflare Pages. Roughly 15 minutes.

```bash
npm i -D @cloudflare/next-on-pages
npx @cloudflare/next-on-pages@latest
npx wrangler pages deploy .vercel/output/static \
  --project-name talif-pathan-portfolio
```

Then set `NEXT_PUBLIC_SITE_URL` to the new `*.pages.dev` origin and rebuild, so
canonical tags and `sitemap.xml` are correct. Cloudflare Pages has a free tier
with unlimited bandwidth, so this stays at $0.

Caveat worth knowing before you need it: `next-on-pages` is an adapter, and the
`headers()` block may need translating into a `_headers` file. **Test this path
once while nothing is broken.** A recovery procedure you have never executed is
a hypothesis, not a plan.

### GitHub repository deleted or account lost

```bash
cd ~/projects/talif-pathan-portfolio     # your local clone is a full copy
gh repo create <new-name> --public --source=. --push
```

Then reconnect the new repository in the Vercel project settings. Every branch,
tag and commit in your local clone survives.

If you have no local clone either, the delivered ZIP is a full snapshot of the
source. You lose git history, nothing else.

### A bad deployment is live

Not a disaster; see the rollback section of `RUNBOOK.md`. Vercel keeps every
deployment and promotion is a pointer change, so this is seconds, not minutes.

### Content is wrong or was deleted

```bash
git log --oneline -- content/
git checkout <sha> -- content/projects.ts
npm run verify && git commit -m "fix(content): restore projects from <sha>"
```

### Everything is gone at once

1. `git clone` from any surviving copy, or unzip the delivered archive
2. `npm install && npm run build` to confirm it builds
3. Push to a new GitHub repository
4. Import into Vercel, set `NEXT_PUBLIC_SITE_URL`, deploy
5. `npm run smoke <new-url>`

## Backup policy

**No backup job exists, and none is needed.** Every artefact is either in Git or
regenerable from Git. The backup strategy is: keep more than one clone.

```bash
# a second copy, somewhere that is not GitHub and not Cloud Shell
git clone --mirror https://github.com/<you>/<repo>.git ~/backups/portfolio.git
# refresh it occasionally
cd ~/backups/portfolio.git && git remote update
```

That is a real off-platform backup and it costs nothing.

## Test schedule

| Test | Frequency | How |
|---|---|---|
| Restore from clone | quarterly | clone to a temp dir, `npm ci && npm run build` |
| Cloudflare Pages failover | **once, soon** | deploy to Pages, smoke test, delete the project |
| Rollback | whenever you deploy | promote the previous deployment, smoke, promote back |

The Cloudflare failover is the one that matters. Do it while everything is fine.
