# Talif Pathan, portfolio

Single-page portfolio built on the Next.js App Router. Server components by
default, a small motion system, and a content layer that is separate from the UI.

## Stack

| Concern    | Choice                                           |
| ---------- | ------------------------------------------------ |
| Framework  | Next.js 14, App Router                           |
| Language   | TypeScript, strict                               |
| Styling    | Tailwind CSS 3.4 over CSS custom-property tokens |
| Motion     | CSS first, Motion (`motion/react`) where needed  |
| Icons      | lucide-react                                     |
| Deployment | Vercel                                           |

## Run it

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL
npm run dev                  # http://localhost:3000
```

`npm run verify` runs lint, typecheck and a production build. CI runs the same
four checks plus a Prettier check on every push and pull request.

## Layout

```
app/          route shell, metadata, robots, sitemap, OG image, error states
content/      all copy and data, strongly typed. Edit here, not in JSX
components/
  primitives/ Container, Section, Button, Chip, StatusDot
  motion/     Reveal, Disclosure, ArchitectureFlow, ScrollProgress
  nav/        SiteHeader, CommandMenu, SiteFooter
  sections/   Hero, Projects, Experience, Skills, Education, About, Contact
              plus two nested subsections: Recognition (inside Education)
              and References (inside About)
lib/          cn() helper and the motion system
```

## Editing content

Every section reads from `content/`. Nothing in `components/` contains copy.

- `content/profile.ts` — name, positioning, summary, location, status, what
  you are looking for, emails, socials, headline metrics.
  Set `resumeUrl` to a file in `/public` and the resume CTA appears in the hero,
  the contact block and the command menu. It stays hidden while the value is null.
- `content/projects.ts` — each project carries its own architecture nodes. The
  diagram renders whatever is listed, so it can only ever describe components the
  project actually has.
- `content/experience.ts` — add `period: "Mon YYYY - Mon YYYY"` to any entry and
  the timeline column renders it. Omitted entries fall back to the organisation.
- `content/profile.ts` also carries `portrait`. Set it to a real photograph in
  `/public` with its true pixel dimensions and the About section renders it;
  leave it `null` and nothing renders. It is the only raster image on the site.
  Use an actual photograph: generated portraits carry signed Content Credentials
  that anyone can read, and a fabricated face devalues every verified claim
  around it.
- `content/education.ts` — degrees and coursework. Grades come from the
  transcript. Omit `grade` on a course and it renders as in progress.
- `content/credentials.ts` — certifications, awards, publications. Set
  `primary: false` on a certification to move it behind the disclosure.
- `content/experience.ts` — roles nest under an organisation, and contributions
  are grouped by theme so a long tenure stays scannable.
- `content/skills.ts`, `content/testimonials.ts`, `content/navigation.ts`.

`navItems` drives the header row and has one entry per top-level section, which
is what keeps the active indicator honest: there is no unlisted top-level
section for it to land on. `secondaryNavItems` deep-links to the two nested
subsections (`#recognition`, `#references`) from the footer and command menu.

If you add a section, add a nav item for it, or nest it inside an existing one.
A top-level section with no nav link will make the indicator appear stuck on the
preceding item.

Adding a nav item requires a matching section `id`; `SiteHeader` observes those
ids to drive the active indicator, and `CommandMenu` builds its Navigate group
from the same list.

## Motion system

The rule is in `lib/motion.ts`: CSS owns anything that depends only on the
element (hover, focus, press, the section reveal, the architecture pulse, the
scroll progress bar). Motion owns what CSS cannot express: animated layout
(disclosure height), shared-element transitions (the nav indicator), and
presence (the command menu).

Durations are graded by interaction class in `app/globals.css` as `--dur-*`
tokens and mirrored in `lib/motion.ts`, so a CSS transition and a Motion
transition of the same class take the same time. Entrance and exit use different
curves. `prefers-reduced-motion: reduce` collapses every duration to 1ms, stops
the decorative pulse, and freezes the progress bar without hiding anything.

## Accessibility

One `h1` per document, sections labelled by their headings, a skip link, visible
`:focus-visible` rings on the accent colour, a modal command palette with focus
capture and restore, and no functionality that depends on hover.

## Deployment

Vercel Hobby, $0/month. Pull requests get preview deployments; merging to `main`
deploys production. Branch protection is the gate, so there is no Vercel token
in GitHub.

```bash
npx vercel@latest link
npx vercel@latest env add NEXT_PUBLIC_SITE_URL production
npx vercel@latest --prod
npm run smoke https://talifpathan.vercel.app
```

`NEXT_PUBLIC_SITE_URL` is inlined at build time. Set it before building, not
after, or canonical URLs, `sitemap.xml` and Open Graph tags will say localhost.

Full detail in `docs/`:

| Document                   | Covers                                                               |
| -------------------------- | -------------------------------------------------------------------- |
| `DEPLOY-WALKTHROUGH.md`    | **Start here.** Copy-paste sequence with every exact value           |
| `DEPLOYMENT.md`            | Platform choice, pipeline, security, cost, checklist, first 24 hours |
| `ARCHITECTURE.md`          | Dependency map, request path, why Vercel, failure behaviour          |
| `ENVIRONMENT_VARIABLES.md` | The one variable, per environment                                    |
| `RUNBOOK.md`               | Ship, verify, roll back, update dependencies                         |
| `INCIDENT_RESPONSE.md`     | Severity, detection, playbooks                                       |
| `DISASTER_RECOVERY.md`     | RPO 0, RTO ~15 min, Cloudflare Pages failover                        |

## Operational scripts

```bash
npm run verify    # format:check, lint, build, typecheck
npm run smoke     # 28 assertions against a deployed URL
npm run links     # all 24 external project and profile URLs
```
