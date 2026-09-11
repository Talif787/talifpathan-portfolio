# Deployment

Production deployment of the portfolio at **$0/month**, with the one thing that
cannot be free called out explicitly.

Read `ARCHITECTURE.md` first for why the architecture is this small.

---

## 1. Applicability audit

The brief this was written against covers 30 areas. Sixteen do not apply,
because the component they govern does not exist in this project. Building them
anyway would be inventing infrastructure, which the brief also forbids.

| Area                                       | Status                                                                          |
| ------------------------------------------ | ------------------------------------------------------------------------------- |
| Frontend deployment                        | **Applies.** Vercel Hobby                                                       |
| Environments                               | **Applies.** Local, preview, production                                         |
| DNS and SSL                                | **Applies.** Vercel-managed, automatic TLS                                      |
| CI/CD                                      | **Applies.** Four GitHub Actions workflows                                      |
| Security and headers                       | **Applies.** CSP added, six headers, smoke-tested                               |
| Supply-chain scanning                      | **Applies.** CodeQL, npm audit, Trivy, gitleaks, Dependabot                     |
| Observability                              | **Applies, with a stated limitation.** Synthetic probes at 30-minute resolution |
| Performance                                | **Applies.** Lighthouse budgets enforced per deployment                         |
| Backups and DR                             | **Applies.** RPO 0, RTO ~15 min                                                 |
| Rollback                                   | **Applies.** Vercel promotion, instant                                          |
| Cost                                       | **Applies.** $0, itemised in section 12                                         |
| Smoke testing                              | **Applies.** `scripts/smoke.sh`, 28 assertions                                  |
| Production checklist                       | **Applies.** Section 13                                                         |
| Post-deploy monitoring                     | **Applies.** Section 14                                                         |
| Backend deployment                         | **N/A.** No backend exists                                                      |
| Database                                   | **N/A.** No database, no driver, no query                                       |
| Redis / cache                              | **N/A.** No cache client                                                        |
| Queues and workers                         | **N/A.** No broker, no worker, no cron                                          |
| Object storage                             | **N/A.** No storage SDK, no uploads                                             |
| AI/ML infrastructure                       | **N/A.** No LLM SDK, no vector store, no model call                             |
| Authentication and authorization           | **N/A.** No auth, no sessions, no RBAC                                          |
| WebSockets / realtime                      | **N/A.** No socket code                                                         |
| API gateway                                | **N/A.** No API routes, no route handlers                                       |
| Container registry                         | **N/A.** Nothing is containerised in production                                 |
| Kubernetes / Helm                          | **N/A.** A control plane costs ~$70/month to run one static page                |
| Terraform / IaC                            | **N/A in the usual sense.** See section 9                                       |
| Connection pooling, read replicas, indexes | **N/A.** No database                                                            |
| CORS                                       | **N/A.** Zero cross-origin requests exist                                       |
| Feature flags                              | **N/A.** No runtime configuration                                               |
| Secrets management                         | **N/A.** No secrets exist                                                       |

Every N/A above was verified by grepping the source tree, not assumed. The probe
results are in `ARCHITECTURE.md`.

---

## 2. Prerequisites

| Requirement     | Cost             | Notes                                                                       |
| --------------- | ---------------- | --------------------------------------------------------------------------- |
| GitHub account  | $0               | Repository must be **public** for free CodeQL and unlimited Actions minutes |
| Vercel account  | $0               | Hobby. No card required                                                     |
| Node 22         | $0               | Pinned in `.nvmrc`                                                          |
| A custom domain | **~$10-15/year** | **The only thing that is not free.** See section 3                          |

Nothing else. No cloud account, no registry, no secrets manager, no observability
vendor.

---

## 3. Domain and DNS

### The $0 answer

Use **`talifpathan.vercel.app`**. Vercel assigns it, serves it over HTTPS with a
managed certificate, and it costs nothing. It is already the value in
`.env.example`. Nothing in this section needs doing.

**A custom domain cannot be made free.** Registration is a real annual fee to a
registrar; there is no legitimate $0 path to owning `talifpathan.com`. Closest
free alternatives, in order of how much they are worth:

| Option                                | Cost | Verdict                                                                         |
| ------------------------------------- | ---- | ------------------------------------------------------------------------------- |
| `talifpathan.vercel.app`              | $0   | **Recommended.** Clean, memorable enough, HTTPS included                        |
| `<user>.github.io` via GitHub Pages   | $0   | Would force dropping `headers()`, so no CSP or HSTS. Not worth it               |
| `.js.org` subdomain                   | $0   | Free by PR to the js.org repo, but intended for JS libraries, not portfolios    |
| Free TLDs (`.tk`, `.ml`, and similar) | $0   | **Do not.** Poor deliverability, frequent seizure, reads as spam to a recruiter |

Honest note outside the constraint: a real domain is roughly $12/year and is the
single highest-value paid upgrade for a job-search site. `.vercel.app` is fine;
`talifpathan.dev` is better. Your call, and it does not change anything else in
this document.

### If you do buy one

| Record  | Name  | Value                  | TTL  |
| ------- | ----- | ---------------------- | ---- |
| `A`     | `@`   | `76.76.21.21`          | auto |
| `CNAME` | `www` | `cname.vercel-dns.com` | auto |

Add the domain in Vercel project settings, Domains. Vercel issues and renews the
certificate automatically, redirects `www` to apex (or the reverse), and enforces
HTTPS. Verify the current apex IP in Vercel's dashboard when you add it rather
than trusting the number above; Vercel publishes it per-project.

Then update the origin everywhere it is recorded:

```bash
npx vercel@latest env rm NEXT_PUBLIC_SITE_URL production
npx vercel@latest env add NEXT_PUBLIC_SITE_URL production   # https://<your-domain>
gh variable set NEXT_PUBLIC_SITE_URL --body "https://<your-domain>"
npx vercel@latest --prod --force                            # inlined at build time
npm run smoke https://<your-domain>
```

---

## 4. First deployment

```bash
# 1. repository must be public for free CodeQL and unlimited Actions
gh repo edit --visibility public --accept-visibility-change-consequences

# 2. CI needs the production origin as a repository variable, not a secret
gh variable set NEXT_PUBLIC_SITE_URL --body "https://talifpathan.vercel.app"

# 3. link and deploy
npx vercel@latest login
npx vercel@latest link
npx vercel@latest env add NEXT_PUBLIC_SITE_URL production
npx vercel@latest --prod

# 4. verify
npm run smoke https://talifpathan.vercel.app
```

Then connect the Git integration in the Vercel dashboard: Project, Settings,
Git, connect the GitHub repository. From that point every pull request gets a
preview deployment and every merge to `main` deploys production.

### Branch protection is the deployment gate

```bash
gh api -X PUT "repos/<YOU>/<REPO>/branches/main/protection" \
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
```

Also enable in Settings, Code security: **secret scanning** and **push
protection**. Both are free on public repositories and stop a credential before
it reaches the remote, which is strictly better than finding it afterwards.

---

## 5. Pipeline

```
push / PR
  ├─ ci.yml          format:check → lint → build → typecheck
  └─ security.yml    CodeQL · npm audit · Trivy (vuln, secret, misconfig) · gitleaks
        ↓
  Vercel builds a preview
        ↓
  deploy-verify.yml  smoke.sh (28 assertions) + Lighthouse budgets
        ↓
  branch protection blocks merge until all green
        ↓
  merge to main → Vercel builds production
        ↓
  deploy-verify.yml runs again against production
        ↓
  synthetic.yml probes every 30 minutes
```

Four workflows, all free, all on unlimited public-repo runners.

**Why no `staging.yml`.** Preview deployments are the staging environment: fully
built, publicly reachable, isolated per pull request, and gated by exactly the
same smoke tests and Lighthouse budgets production gets. A long-lived `staging`
branch would add a second permanent deployment and a second merge per change to
duplicate that. If you want one anyway, add `staging` to the Vercel project's
preview branches and set a stable alias:

```bash
npx vercel@latest alias set <deployment-url> staging-talif.vercel.app
```

**Why no `VERCEL_TOKEN`.** Deploying from Actions via the CLI means storing a
broadly-scoped account token in GitHub to reimplement what the Git integration
does for free. Branch protection gives the same gate with one fewer high-value
secret. If you ever need CLI deploys, set `git.deploymentEnabled.main = false` in
`vercel.json` and add a workflow calling `vercel deploy --prod --token=...`.

---

## 6. Security

Added in this pass, verified by `smoke.sh` on every deployment:

| Header                       | Value                                                                                                                             |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `Content-Security-Policy`    | `default-src 'self'`, empty `connect-src`, `frame-ancestors 'none'`, `base-uri 'none'`, `form-action 'none'`, `object-src 'none'` |
| `Strict-Transport-Security`  | `max-age=63072000; includeSubDomains; preload`                                                                                    |
| `X-Content-Type-Options`     | `nosniff`                                                                                                                         |
| `X-Frame-Options`            | `DENY`                                                                                                                            |
| `Referrer-Policy`            | `strict-origin-when-cross-origin`                                                                                                 |
| `Permissions-Policy`         | camera, mic, geolocation, payment, USB, sensors all denied                                                                        |
| `Cross-Origin-Opener-Policy` | `same-origin`                                                                                                                     |
| `X-Powered-By`               | suppressed                                                                                                                        |

**The CSP keeps `'unsafe-inline'` in `script-src`, and that is a deliberate
compromise.** Next inlines the RSC payload and the JSON-LD block. Eliminating it
requires nonces, nonces require middleware, and middleware forces every request
to render dynamically, trading a CDN-cached static page for a function
invocation per visit on a plan metered by invocations. Against a page with no
user input, no query-param rendering and no third-party script, that is a bad
trade. The directives carrying real weight here are `frame-ancestors`,
`base-uri`, `form-action`, `object-src` and the empty `connect-src`, all strict.

### Audit result

| Check                            | Result                                                   |
| -------------------------------- | -------------------------------------------------------- |
| Secrets in the repository        | None exist to leak. Gitleaks scans full history each run |
| Credentials in the client bundle | None. One public variable, public by design              |
| Third-party scripts              | Zero                                                     |
| Cross-origin requests            | Zero                                                     |
| User input                       | One in-page filter field, no submission, no persistence  |
| Dependency CVEs                  | `npm audit --audit-level=high` gates every PR            |
| SAST                             | CodeQL `security-and-quality` on every PR and weekly     |
| IaC / config scanning            | Trivy `misconfig`                                        |
| Transport                        | HTTPS enforced by the platform, HSTS with preload        |

---

## 7. Observability

$0, and here is exactly what that buys and what it does not.

| Signal                   | Mechanism                                       | Resolution                          |
| ------------------------ | ----------------------------------------------- | ----------------------------------- |
| Uptime and correctness   | `synthetic.yml`, 28 assertions                  | 30 minutes                          |
| Deployment regressions   | `deploy-verify.yml`                             | immediate, per deployment           |
| Core Web Vitals          | Lighthouse CI budgets                           | per deployment                      |
| Latency (TTFB)           | asserted in `smoke.sh` at < 1.5s                | per probe                           |
| Build and runtime logs   | Vercel dashboard                                | real time, short retention on Hobby |
| Dependency and code risk | `security.yml`                                  | per PR, plus weekly                 |
| Alerting                 | GitHub opens one `incident` issue, deduplicated | email                               |

**Stated limitations, since the brief asks for honesty over completeness:**

- A 30-minute cron cannot detect a 4-minute outage. Sub-minute synthetic
  monitoring is a paid product.
- Failed workflows email you. They do not page you.
- No real user monitoring. Vercel Speed Insights and Web Analytics have free
  allowances on Hobby but the quotas change; check the current pricing page
  before relying on either.
- Hobby log retention is short. For a static site with no request-level logic
  this costs almost nothing in practice.
- **No error tracking, deliberately.** Sentry's free tier would work, but it adds
  a vendor and roughly 30KB to a page whose whole design premise is that it ships
  almost no JavaScript. Six tiny client islands with no network calls is a very
  small surface to instrument. Revisit if you add anything with real runtime
  behaviour.

If you want better uptime coverage for free, add an UptimeRobot or Better Stack
free-tier monitor against the production URL. Both have no-cost tiers; verify
the current limits on their pricing pages rather than trusting a number here.

---

## 8. Performance targets

Enforced by `lighthouserc.json` per deployment.

| Metric                   | Target  | Enforcement         |
| ------------------------ | ------- | ------------------- |
| Accessibility            | >= 95   | **fails the check** |
| Best practices           | >= 95   | **fails the check** |
| SEO                      | >= 95   | **fails the check** |
| Cumulative Layout Shift  | < 0.1   | **fails the check** |
| Performance              | >= 90   | warns               |
| First Contentful Paint   | < 2.0s  | warns               |
| Largest Contentful Paint | < 2.5s  | warns               |
| Total Blocking Time      | < 300ms | warns               |
| TTFB                     | < 1.5s  | fails `smoke.sh`    |
| HTML transfer            | < 400KB | fails `smoke.sh`    |

Accessibility and CLS fail rather than warn because both are regressions this
project has actually had, and both are invisible until someone complains.

Already in place: self-hosted fonts with no CDN request, zero raster images,
immutable one-year caching on fingerprinted assets, `content-visibility` on
below-fold sections, six small client islands with everything else
server-rendered, AVIF and WebP configured for the portrait when one is added.

---

## 9. Infrastructure as code

**There is no cloud infrastructure to provision.** No VPC, compute instance,
database, cache, bucket, queue, IAM role or registry exists in this
architecture. Writing Terraform to manage one Vercel project and zero DNS
records would add a state file, a provider and a workflow to describe something
a single dashboard toggle already expresses.

What is codified instead, all in the repository and all reviewable:

| Concern                                | File                           |
| -------------------------------------- | ------------------------------ |
| Platform and build configuration       | `vercel.json`                  |
| Runtime headers, CSP, caching          | `next.config.mjs`              |
| Node version                           | `.nvmrc`                       |
| CI, security, verification, synthetics | `.github/workflows/*.yml`      |
| Dependency policy                      | `.github/dependabot.yml`       |
| Performance budgets                    | `lighthouserc.json`            |
| Production assertions                  | `scripts/smoke.sh`             |
| Branch protection                      | the `gh api` call in section 4 |

Every one of those is version-controlled, code-reviewed and reproducible, which
is the actual goal. If a custom domain and real DNS records are added later, the
`vercel/vercel` and `cloudflare/cloudflare` Terraform providers are both free and
that is the point at which IaC starts earning its keep.

---

## 10. Rollback

Instant, and no build required.

```bash
npx vercel@latest ls
npx vercel@latest promote <last-good-deployment-url>
npm run smoke https://talifpathan.vercel.app
```

Vercel retains every deployment, so promotion is a pointer change measured in
seconds. Roll back first and diagnose second.

**"What if the deployment succeeds but the database migration fails?"** There are
no migrations, no schema and no persistent state. This entire failure class is
absent by construction, which is one of the few genuine advantages of a system
this small.

Blue/green and canary are not implemented: Vercel's atomic deployments plus
instant promotion already give the property those patterns exist to provide, and
traffic splitting is a Pro feature.

---

## 11. Backups and DR

Full detail in `DISASTER_RECOVERY.md`.

- **RPO 0.** Git is the only store of record. No runtime state exists.
- **RTO ~15 minutes.** Import repository, set one variable, deploy.
- No backup job, because every artefact is in Git or regenerable from it.
- Off-platform copy: `git clone --mirror` somewhere that is not GitHub.
- **Test the Cloudflare Pages failover once while nothing is broken.** An
  untested recovery procedure is a hypothesis.

---

## 12. Cost

| Component                           | Service                      | Dev    | Staging       | Production                     |
| ----------------------------------- | ---------------------------- | ------ | ------------- | ------------------------------ |
| Hosting, CDN, TLS, WAF, DDoS        | Vercel Hobby                 | $0     | $0 (previews) | $0                             |
| Source control                      | GitHub public                | $0     | $0            | $0                             |
| CI/CD                               | GitHub Actions               | $0     | $0            | $0 (unlimited on public repos) |
| SAST                                | CodeQL                       | $0     | $0            | $0 (free on public repos)      |
| Dependency, secret, config scanning | Dependabot, Trivy, gitleaks  | $0     | $0            | $0                             |
| Synthetic monitoring                | GitHub Actions cron          | $0     | $0            | $0                             |
| Performance budgets                 | Lighthouse CI                | $0     | $0            | $0                             |
| DNS and certificate                 | Vercel-managed `.vercel.app` | $0     | $0            | $0                             |
| Database, cache, queue, storage, AI | none exist                   | $0     | $0            | $0                             |
| **Total**                           |                              | **$0** | **$0**        | **$0/month**                   |

### Growth

Hobby caps at 100 GB transfer, 1M edge requests and 1M function invocations per
month. This site serves static assets, so function invocations stay near zero and
the binding limit is transfer. At roughly 300 KB per full page load that is on
the order of 300,000 monthly visits before the cap. A personal portfolio will not
approach it. Exceeding a limit pauses the project until the window resets; it
never generates a bill, because Hobby cannot be charged.

### The two things that would end $0

1. **A custom domain**, ~$12/year. Not free by any legitimate route.
2. **Commercial use.** Vercel restricts Hobby to personal, non-commercial
   projects and defines commercial broadly enough to include accepting
   donations. A portfolio used to find employment is inside that. A freelance
   rate card, a checkout, ads or a donate button would not be, and would require
   Pro at $20/month or a move to Cloudflare Pages.

### Unnecessary spending identified

None to cut, but three things were kept out that a default enterprise template
would have added: Sentry (a vendor and 30KB for six tiny client islands),
Terraform state hosting (no resources to manage), and a container registry
(nothing is containerised).

---

## 13. Production checklist

**Security**

- [ ] Repository public, secret scanning and push protection on
- [ ] Branch protection requires all five checks
- [ ] CSP and all six security headers present in production (`npm run smoke`)
- [ ] `x-powered-by` suppressed
- [ ] Gitleaks clean across full history
- [ ] `npm audit --audit-level=high` clean
- [ ] CodeQL clean
- [ ] No `.env.local` committed (`git check-ignore -v .env.local`)

**Build and correctness**

- [ ] `npm run verify` green locally
- [ ] `package-lock.json` committed, `npm ci` succeeds from clean
- [ ] All 8 routes return their expected status
- [ ] OG image renders 1200x630
- [ ] `robots.txt` and canonical reference the production origin, not localhost
- [ ] All 8 in-page anchors present
- [ ] At least 14 project links rendered

**Performance and accessibility**

- [ ] Lighthouse: accessibility, best-practices and SEO all >= 95
- [ ] CLS < 0.1
- [ ] TTFB < 1.5s
- [ ] Manual sweep at 1440, 1280, 768, 390, 320 with no horizontal overflow
- [ ] Reduced-motion pass: nothing hidden

**Operations**

- [ ] `NEXT_PUBLIC_SITE_URL` set in Vercel production **and** as a GitHub variable
- [ ] `synthetic.yml` has run at least once and passed
- [ ] Rollback rehearsed: promote previous, smoke, promote back
- [ ] Cloudflare Pages failover rehearsed once
- [ ] Off-platform mirror clone exists
- [ ] `npm run links` clean, all 24 external URLs alive

**Content**

- [ ] Graduation date reconciled between LinkedIn and the site
- [ ] Resume PDF added and `profile.resumeUrl` set, or deliberately left null
- [ ] Portrait added and `profile.portrait` set, or deliberately left null

---

## 14. First 24 hours

| When  | Check                                                            | Action if it fails                       |
| ----- | ---------------------------------------------------------------- | ---------------------------------------- |
| T+0   | `npm run smoke <prod-url>`                                       | Roll back                                |
| T+0   | Lighthouse budgets in `deploy-verify.yml`                        | Investigate; do not roll back for a warn |
| T+15m | Open the site on a real phone on cellular                        | Check the responsive sweep               |
| T+30m | First `synthetic.yml` run passed                                 | `INCIDENT_RESPONSE.md`                   |
| T+1h  | Vercel dashboard: no build or runtime errors                     | Read the logs                            |
| T+2h  | Share the URL, confirm the OG card renders on LinkedIn and Slack | Rebuild with the correct origin          |
| T+6h  | Synthetic runs still green                                       |                                          |
| T+24h | No `incident` issues opened; usage well under Hobby caps         |                                          |

Critical metrics for the window: availability from the probe, TTFB under 1.5s,
zero failed workflow runs, zero open `incident` issues, Hobby transfer far below
100 GB.

Alert policy is deliberately thin: one deduplicated GitHub issue for a failed
production probe. Nothing else pages. On a system where the worst realistic
outcome is a portfolio being briefly unreachable, more alerting would train you
to ignore alerts.

---

## 15. Troubleshooting

| Symptom                                     | Cause                                                       | Fix                                                        |
| ------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------- |
| `robots.txt` says `localhost:3000`          | `NEXT_PUBLIC_SITE_URL` absent at build                      | `npx vercel@latest --prod --force`                         |
| Security headers missing                    | Deployment predates the `headers()` change                  | Redeploy, then `npm run smoke`                             |
| CodeQL not running                          | Repository is private; CodeQL needs Advanced Security there | Make it public                                             |
| CI fails on `format:check`                  | Files not Prettier-formatted                                | `npm run format`, commit                                   |
| CI fails on `typecheck` only                | Ran before build; `next-env.d.ts` absent                    | Shipped `ci.yml` already builds first                      |
| `npm ci` fails                              | No lockfile committed                                       | `npm install`, commit `package-lock.json`                  |
| Build queued for minutes                    | Hobby allows one concurrent build                           | Wait, or push less often                                   |
| Project paused                              | A Hobby limit was exceeded                                  | Wait for the 30-day window; no charge is possible          |
| Preview URL 404s                            | Deployment protection is on                                 | Vercel Settings, Deployment Protection                     |
| A client island silently broke              | CSP is blocking something new                               | Console shows `Refused to ...`; see `INCIDENT_RESPONSE.md` |
| Synthetic opened an issue and keeps failing | Real production problem                                     | `INCIDENT_RESPONSE.md`, close the issue once green         |
