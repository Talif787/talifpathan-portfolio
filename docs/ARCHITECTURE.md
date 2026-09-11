# Architecture

## What this system is

A single-page Next.js 14 App Router site. Static content, no persistence, no
external calls at runtime.

The deployment brief this was written against assumes a backend, APIs,
databases, auth, AI services, queues, workers, object storage and WebSockets.
This project has none of them. That is not a gap to be filled; it is the
architecture. The correct production design here is the smallest one that meets
the requirements, and adding infrastructure that no code path touches would be
cost and attack surface with no return.

## Deployment dependency map

| Component                         | Runtime                                    | Dependencies | Infrastructure            | Platform                   |
| --------------------------------- | ------------------------------------------ | ------------ | ------------------------- | -------------------------- |
| Next.js app                       | Node 22 at build, static assets at runtime | none         | CDN + build               | **Vercel Hobby**           |
| Fonts                             | none at runtime                            | none         | served from origin        | self-hosted by `next/font` |
| Icons                             | none at runtime                            | none         | inlined SVG in the bundle | in-bundle                  |
| OG image                          | build-time only (`next/og`)                | none         | prerendered PNG           | build output               |
| Content                           | build-time only                            | none         | TypeScript in `content/`  | in-repo                    |
| Source of truth                   | n/a                                        | n/a          | Git                       | **GitHub**                 |
| CI, security scanning, synthetics | Node 22                                    | GitHub       | Actions runners           | **GitHub Actions**         |

### Verified absent

Probed by grep across the entire source tree:

| Assumed component           | Result                                              |
| --------------------------- | --------------------------------------------------- |
| HTTP client or external API | none                                                |
| Database driver             | none                                                |
| Cache client                | none                                                |
| Queue or broker             | none                                                |
| Object storage SDK          | none                                                |
| Authentication              | none                                                |
| WebSockets or realtime      | none                                                |
| AI or LLM SDK               | none                                                |
| Background jobs or cron     | none                                                |
| Server actions              | none                                                |
| API route handlers          | none                                                |
| Middleware                  | none                                                |
| Runtime env reads           | none. Three build-time reads of one public variable |

## Request path

```
Visitor
  └─ DNS: talifpathan.vercel.app  (Vercel-managed)
       └─ Vercel Edge Network (global CDN, TLS terminated, DDoS mitigation, WAF)
            ├─ cache HIT   → static HTML/CSS/JS/PNG. No compute.
            └─ cache MISS  → origin static asset. Still no compute.
```

There is no second hop. No function invocation is required to serve any route,
including `/opengraph-image`, which is prerendered at build time. The site is
CDN-resident.

## Platform choice: Vercel Hobby

**Chosen because** it is the native target for Next.js App Router, it is $0 with
no card and no overage billing, and this project uses two features that
constrain the choice: `headers()` in `next.config.mjs`, and `next/og`. Both rule
out a naive static export.

Hobby includes the global CDN, automatic TLS, DDoS mitigation, a WAF, preview
deployments per pull request, and unlimited deployments.

**Rejected alternatives**

| Platform                                                    | Why not                                                                                                                                                                                                                                                                                        |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cloudflare Pages                                            | Works via `@cloudflare/next-on-pages`, but that adds an adapter, a second build path and a class of App Router incompatibilities to track. The generosity of its free tier is not needed by a site this small. Genuine second choice, and the migration path if Hobby ever becomes unsuitable. |
| GitHub Pages                                                | Static only. Cannot serve `headers()`, so the CSP and HSTS would have to be dropped. Disqualifying.                                                                                                                                                                                            |
| Netlify                                                     | Capable, but the Next.js runtime is an adapter rather than the first-party target, and the free tier is tighter on build minutes.                                                                                                                                                              |
| AWS Amplify / S3+CloudFront                                 | Free tier is 12 months, then billed. Fails the $0 constraint outright.                                                                                                                                                                                                                         |
| Any container platform (Cloud Run, Fly.io, Render, Railway) | Puts a server in the path of a site that needs none. More cost, more cold starts, more to operate, no benefit.                                                                                                                                                                                 |
| Kubernetes (EKS/GKE/AKS)                                    | A control plane costs roughly $70 a month to run one static page. Would be an unserious recommendation.                                                                                                                                                                                        |

**The real constraint on Hobby is not a quota, it is the licence.** Vercel
restricts Hobby to personal, non-commercial use, and defines commercial broadly
enough to include accepting donations. A portfolio used to find employment sits
inside that. A freelance rate card, a "hire me" checkout, ads or a donate button
would not. If any of those are ever added, this moves to Pro at $20/month or to
Cloudflare Pages.

## Environments

| Environment | Trigger            | URL                           | Purpose                             |
| ----------- | ------------------ | ----------------------------- | ----------------------------------- |
| Local       | `npm run dev`      | `localhost:8080`              | development                         |
| Preview     | every pull request | `<hash>-<project>.vercel.app` | **this is the staging environment** |
| Production  | merge to `main`    | `talifpathan.vercel.app`      | live                                |

**No long-lived `staging` branch.** Vercel creates an isolated, fully built,
publicly reachable deployment for every pull request, and `deploy-verify.yml`
runs the same smoke tests and Lighthouse budgets against it that production
gets. A `staging` branch would add a second permanent deployment, a second merge
per change and a second thing to keep in sync, to duplicate what previews
already do. If you ever want one anyway, `docs/DEPLOYMENT.md` has the five-line
addition.

## Deployment gate

Vercel's Git integration deploys; GitHub branch protection is the gate.

```
PR opened
  → CI: format, lint, build, typecheck
  → Security: CodeQL, npm audit, Trivy, gitleaks
  → Vercel builds a preview
  → deploy-verify: smoke tests + Lighthouse against the preview URL
  → branch protection blocks merge until all of the above are green
  → merge to main
  → Vercel builds production
  → deploy-verify: smoke tests + Lighthouse against production
  → synthetic.yml probes every 30 minutes thereafter
```

**Deliberately no `VERCEL_TOKEN` in GitHub.** Deploying from Actions via the
Vercel CLI would require storing a token with broad account scope in order to
reimplement what the Git integration already does. Branch protection provides
the same gate with one fewer high-value secret. The CLI variant is documented in
`DEPLOYMENT.md` if you ever need it.

## Failure behaviour

| Dependency down                                                  | Effect                                                                   | Mitigation                                                                                                       |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Vercel Edge                                                      | Site unreachable                                                         | None at $0. Documented in `DISASTER_RECOVERY.md`; recovery is a redeploy to Cloudflare Pages, roughly 15 minutes |
| Vercel build pipeline                                            | Cannot ship; **live site unaffected**, the last deployment keeps serving | Wait, or deploy from the CLI                                                                                     |
| GitHub                                                           | Cannot ship or run CI; live site unaffected                              | Wait                                                                                                             |
| A linked demo host                                               | One "Live" link 404s                                                     | `npm run links` detects it; remove `links.demo` for that project                                                 |
| Reader's browser lacks `animation-timeline` or container queries | Reveals and progress bar do not run; diagrams stack                      | Designed fallbacks, not failures                                                                                 |

There is no partial-failure mode where the site serves wrong data, because there
is no data path. It either serves the last successful build or it does not
resolve.
