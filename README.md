# Talif Pathan, portfolio

Single-page portfolio built on the Next.js App Router. Server components by
default, a small motion system, and a content layer that is separate from the UI.

## Stack

| Concern    | Choice                                            |
| ---------- | ------------------------------------------------- |
| Framework  | Next.js 14, App Router                            |
| Language   | TypeScript, strict                                |
| Styling    | Tailwind CSS 3.4 over CSS custom-property tokens  |
| Motion     | CSS first, Motion (`motion/react`) where needed   |
| Icons      | lucide-react                                      |
| Deployment | Vercel                                            |

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
  sections/   Hero, Projects, Experience, Skills, About, Testimonials, Contact
lib/          cn() helper and the motion system
```

## Editing content

Every section reads from `content/`. Nothing in `components/` contains copy.

- `content/profile.ts` — name, positioning, location, status, emails, socials.
  Set `resumeUrl` to a file in `/public` and the resume CTA appears in the hero,
  the contact block and the command menu. It stays hidden while the value is null.
- `content/projects.ts` — each project carries its own architecture nodes. The
  diagram renders whatever is listed, so it can only ever describe components the
  project actually has.
- `content/experience.ts` — add `period: "Mon YYYY - Mon YYYY"` to any entry and
  the timeline column renders it. Omitted entries fall back to the organisation.
- `content/skills.ts`, `content/testimonials.ts`, `content/navigation.ts`.

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

Push to Vercel. Set `NEXT_PUBLIC_SITE_URL` in project settings, otherwise
canonical URLs, `sitemap.xml` and Open Graph tags fall back to localhost.
