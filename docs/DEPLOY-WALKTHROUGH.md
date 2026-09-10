# Deployment walkthrough

Copy-paste sequence from nothing to a verified production deployment. Two
platforms, both $0: GitHub and Vercel.

Set the four variables in Step 0 once. Everything after that references them.

---

## Read this before Step 0

**The Vercel project must be named `talifpathan`, not `talif-pathan-portfolio`.**

Vercel derives the production domain from the project name:
`<project-name>.vercel.app`. Your URL `https://talifpathan.vercel.app` is
printed on all five resume variants, in your LinkedIn contact panel, and in
`.env.example`. Naming the project after the directory would move you to
`talif-pathan-portfolio.vercel.app` and break every link already sent to a
recruiter.

`vercel link` defaults the project name to the **directory name**, so the flag
below is not optional.

---

## Step 0. Set your values

```bash
export GH_USER="Talif787"
export REPO="personal-portfolio"                    # your existing repo name
export VERCEL_PROJECT="talifpathan"                 # must match the domain you want
export PROD_URL="https://talifpathan.vercel.app"

cd ~/projects/talif-pathan-portfolio
echo "$GH_USER / $REPO -> $VERCEL_PROJECT -> $PROD_URL"
```

Confirm `REPO` first:

```bash
gh repo list --limit 100 | grep -i portfolio
```

### Every value, in one table

| Field | Exact value | Where it goes |
|---|---|---|
| Vercel project name | `talifpathan` | Vercel, project creation |
| Framework preset | `Next.js` | Vercel, project settings |
| Root directory | `./` | Vercel, project settings |
| Build command | `npm run build` | Vercel, project settings |
| Install command | `npm ci` | Vercel, project settings |
| Output directory | leave default | Vercel, project settings |
| Node.js version | `22.x` | Vercel, project settings |
| Function region | `iad1` (Washington DC) | `vercel.json`, already set |
| Production branch | `main` | Vercel, Git settings |
| Env var name | `NEXT_PUBLIC_SITE_URL` | Vercel + GitHub |
| Env var value | `https://talifpathan.vercel.app` | Vercel Production, GitHub variable |
| Vercel environments | `production`, `preview`, `development` | Vercel env scopes |
| GitHub repo visibility | `public` | required for free CodeQL and unlimited Actions |
| GitHub variable | `NEXT_PUBLIC_SITE_URL` | repository **variable**, not a secret |
| GitHub secrets | **none** | nothing to add |

**On the region.** `iad1` is set in `vercel.json` and is currently inert: this
project has zero serverless functions, so nothing executes in a region. Static
assets are served from Vercel's global edge regardless. It matters only if you
later add a route handler, at which point `iad1` is the right choice for a
US-East audience.

---

## Step 1. Preflight

```bash
node -v                                  # v22.x
npm -v                                   # no warning
git status -sb                           # clean, on main
gh auth status
npm ci && npm run verify                 # must be fully green before deploying
```

If `npm ci` fails with a missing lockfile, run `npm install` once and commit
`package-lock.json`.

---

## Step 2. GitHub repository

```bash
# 2a. public: required for free CodeQL and unlimited Actions minutes
gh repo edit "$GH_USER/$REPO" --visibility public --accept-visibility-change-consequences

# 2b. the production origin, as a VARIABLE (it is public, not a secret)
gh variable set NEXT_PUBLIC_SITE_URL --repo "$GH_USER/$REPO" --body "$PROD_URL"
gh variable list --repo "$GH_USER/$REPO"

# 2c. native secret scanning and push protection
gh api --method PATCH "repos/$GH_USER/$REPO" --input - <<'JSON'
{
  "security_and_analysis": {
    "secret_scanning": { "status": "enabled" },
    "secret_scanning_push_protection": { "status": "enabled" }
  }
}
JSON

# 2d. push the deployment config so the workflows exist before you gate on them
git add -A
git commit -m "chore(deploy): add CSP, vercel config, security workflows, smoke tests"
git push origin main

# 2e. let the workflows run once so the check names register with GitHub
gh run watch
```

**Step 2e matters.** Branch protection can only require status checks GitHub has
seen at least once. Gate before they have run and the rule silently matches
nothing.

```bash
# 2f. branch protection, using the exact job display names
gh api -X PUT "repos/$GH_USER/$REPO/branches/main/protection" \
  -H "Accept: application/vnd.github+json" \
  -F "required_status_checks[strict]=true" \
  -F "required_status_checks[contexts][]=Verify" \
  -F "required_status_checks[contexts][]=CodeQL (SAST)" \
  -F "required_status_checks[contexts][]=Dependency audit" \
  -F "required_status_checks[contexts][]=Trivy (filesystem and config)" \
  -F "required_status_checks[contexts][]=Gitleaks (full history)" \
  -F "enforce_admins=false" \
  -F "required_pull_request_reviews=null" \
  -F "restrictions=null"

gh api "repos/$GH_USER/$REPO/branches/main/protection" \
  --jq '.required_status_checks.contexts'
```

Expect all five names back. A 404 means the repo is private on a plan without
protected branches; make it public first.

**Do not require "Smoke test" or "Lighthouse budgets".** Those run on the
`deployment_status` event, not on the pull request head, so requiring them
deadlocks every merge.

---

## Step 3. Vercel project

```bash
npx vercel@latest login
npx vercel@latest project ls
```

### 3a. If `talifpathan` already exists (most likely, it serves your current site)

```bash
npx vercel@latest link --yes --project "$VERCEL_PROJECT"
cat .vercel/project.json     # confirms projectId and orgId
```

### 3b. If it does not exist

```bash
npx vercel@latest link --yes --project "$VERCEL_PROJECT"
```

`link` creates the project when the name is free. Confirm the name took:

```bash
npx vercel@latest project ls | grep "$VERCEL_PROJECT"
```

If it created `talif-pathan-portfolio` instead, stop and fix it:

```bash
rm -rf .vercel
npx vercel@latest project rm talif-pathan-portfolio
npx vercel@latest link --yes --project "$VERCEL_PROJECT"
```

`.vercel/` is already gitignored. Do not commit it.

---

## Step 4. Environment variables

Three Vercel scopes. Only Production needs a value.

```bash
# production
printf '%s' "$PROD_URL" | npx vercel@latest env add NEXT_PUBLIC_SITE_URL production

# preview: intentionally left unset. Vercel injects VERCEL_URL and the code's
# localhost fallback is harmless on a throwaway preview URL.

# development: for `vercel dev` only; local work uses .env.local
printf '%s' "http://localhost:8080" | npx vercel@latest env add NEXT_PUBLIC_SITE_URL development

npx vercel@latest env ls
```

Expect one `production` entry and one `development` entry.

If a value already exists and is wrong:

```bash
npx vercel@latest env rm NEXT_PUBLIC_SITE_URL production --yes
printf '%s' "$PROD_URL" | npx vercel@latest env add NEXT_PUBLIC_SITE_URL production
```

**This variable is inlined at build time.** Changing it changes nothing until
you rebuild.

---

## Step 5. Project settings

The CLI cannot set these. Vercel dashboard, Project `talifpathan`, Settings:

| Setting | Section | Exact value |
|---|---|---|
| Framework Preset | General | `Next.js` |
| Root Directory | General | `./` |
| Build Command | General | `npm run build` |
| Install Command | General | `npm ci` |
| Output Directory | General | leave default (override off) |
| Node.js Version | General | `22.x` |
| Production Branch | Git | `main` |
| Deployment Protection | Deployment Protection | **Disabled** for production |

**Install Command matters.** Vercel defaults to `npm install`, which can resolve
differently from your lockfile. `npm ci` makes the production build byte-for-byte
reproducible from `package-lock.json`.

**Deployment Protection matters.** Leave it on and `synthetic.yml` gets a 401
every 30 minutes and opens an incident issue against a healthy site.

---

## Step 6. First production deploy

```bash
npx vercel@latest --prod
```

Watch for `Production: https://talifpathan.vercel.app`. If the domain differs,
the project name is wrong; go back to Step 3.

```bash
npx vercel@latest ls
npx vercel@latest inspect "$PROD_URL"
```

---

## Step 7. Connect the Git integration

Dashboard, Project `talifpathan`, Settings, Git, Connect `GH_USER/REPO`.

From then on: every pull request gets a preview deployment, every merge to
`main` deploys production, and `deploy-verify.yml` smoke tests both.

```bash
# confirm the integration is reporting deployment statuses
gh api "repos/$GH_USER/$REPO/deployments" --jq '.[0] | {environment, created_at}'
```

---

## Step 8. Verify

```bash
npm run smoke "$PROD_URL"
```

28 assertions across routes, transport, security headers, content, SEO artefacts
and performance. Exit code 0 means production is healthy.

Spot checks:

```bash
# the eight security headers
curl -sSI "$PROD_URL" | grep -iE 'content-security-policy|strict-transport|x-content-type|x-frame|referrer-policy|permissions-policy|cross-origin-opener'

# x-powered-by must be absent
curl -sSI "$PROD_URL" | grep -i 'x-powered-by' && echo "LEAK" || echo "suppressed, correct"

# the env var actually made it into the build
curl -sS "$PROD_URL/robots.txt"          # must reference talifpathan.vercel.app, not localhost

# the OG image renders
curl -sS -o /tmp/og.png "$PROD_URL/opengraph-image" && file /tmp/og.png
# expect: PNG image data, 1200 x 630

# all 14 projects rendered
curl -sS "$PROD_URL" | grep -c 'github.com/Talif787'    # >= 14

# external links alive
npm run links
```

If `robots.txt` says `localhost`, the build ran without the variable:

```bash
npx vercel@latest --prod --force
```

Then the browser pass: work through section 9 of `CLOUD-SHELL-RUNBOOK.md`,
especially the responsive sweep at 1440, 1280, 768, 390 and 320, and the
reduced-motion check.

---

## Step 9. Prove rollback works before you need it

```bash
npx vercel@latest ls                            # note the second-newest URL
npx vercel@latest promote <second-newest-url>
npm run smoke "$PROD_URL"                       # still green: rollback works
npx vercel@latest promote <newest-url>          # back to current
npm run smoke "$PROD_URL"
```

Two minutes, and it converts your rollback procedure from a hypothesis into a
rehearsed one.

---

## Step 10. Post-deployment checks

| When | Check | Command |
|---|---|---|
| T+0 | Smoke passes | `npm run smoke "$PROD_URL"` |
| T+0 | Lighthouse budgets green | `gh run list --workflow=deploy-verify.yml --limit 1` |
| T+15m | Real phone on cellular | open `$PROD_URL` |
| T+30m | First synthetic run passed | `gh run list --workflow=synthetic.yml --limit 1` |
| T+1h | No build or runtime errors | Vercel dashboard, Logs |
| T+2h | OG card renders when shared | paste `$PROD_URL` into LinkedIn or Slack |
| T+24h | No incident issues | `gh issue list --label incident` |
| T+24h | Usage far below Hobby caps | Vercel dashboard, Usage |

### One-command re-verification

```bash
cat > ~/bin/pf-verify <<'EOF'
#!/usr/bin/env bash
PROD="${1:-https://talifpathan.vercel.app}"
cd ~/projects/talif-pathan-portfolio || exit 1
echo "== local =="; npm run verify || exit 1
echo "== production =="; npm run smoke "$PROD" || exit 1
echo "== external links =="; npm run links
echo "== workflows =="; gh run list --limit 5
echo "== open incidents =="; gh issue list --label incident
EOF
chmod +x ~/bin/pf-verify
pf-verify
```

---

## Rollback, in one line

```bash
npx vercel@latest promote "$(npx vercel@latest ls | awk 'NR==3{print $2}')" \
  && npm run smoke "$PROD_URL"
```

Instant, no rebuild. There are no database migrations to unwind.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Production URL is `talif-pathan-portfolio.vercel.app` | `vercel link` used the directory name | Step 3, delete the wrong project and relink with `--project talifpathan` |
| `robots.txt` says `localhost:3000` | Built without `NEXT_PUBLIC_SITE_URL` | `npx vercel@latest --prod --force` |
| Branch protection rejects the contexts | Workflows have not run once | Push, `gh run watch`, then Step 2f |
| Merges deadlock waiting on "Smoke test" | It was added as a required check | Remove it; it runs on `deployment_status`, not the PR head |
| `synthetic.yml` 401s every 30 minutes | Deployment Protection is on | Step 5, disable it for production |
| CodeQL does not run | Repository is private | Step 2a |
| CI fails on `format:check` | Files not Prettier-formatted | `npm run format`, commit |
| Build queued for minutes | Hobby allows one concurrent build | Wait, or push less often |
| Project paused | A Hobby limit was exceeded | Wait for the 30-day reset; Hobby cannot be billed |
