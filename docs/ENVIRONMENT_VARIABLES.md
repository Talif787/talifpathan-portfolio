# Environment variables

**One variable. It is public. There are no secrets in this project.**

```bash
grep -rn "process\.env\." --include=*.ts --include=*.tsx --include=*.mjs . | grep -v node_modules
```

Three hits, all the same variable, all with a fallback:

```
app/layout.tsx:31   NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
app/robots.ts:3     NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
app/sitemap.ts:3    NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
```

## PUBLIC / CLIENT-SAFE

| Name                   | Required           | Purpose                                                                                                                                    |
| ---------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL` | No, has a fallback | Absolute origin. Feeds `metadataBase`, the canonical link, Open Graph and Twitter tags, the JSON-LD `url`, `robots.txt` and `sitemap.xml`. |

Inlined into the client bundle by design. Not a secret. Nothing is gained by
hiding it and it appears in the page source either way.

## PRIVATE / SECRET

None. No API keys, no tokens, no database URLs, no auth secrets, no
server-only configuration. There is nothing in this repository that could leak,
which is why `.env.local` protection is a hygiene measure rather than a control.

## Values per environment

| Environment | Value                            | Set where                                                                |
| ----------- | -------------------------------- | ------------------------------------------------------------------------ |
| Local       | `http://localhost:8080`          | `.env.local`, gitignored                                                 |
| Preview     | leave unset                      | Vercel injects `VERCEL_URL`; the fallback is harmless on a throwaway URL |
| Production  | `https://talifpathan.vercel.app` | Vercel project settings, Production scope                                |
| CI          | `https://talifpathan.vercel.app` | GitHub repository **variable** (not a secret)                            |

```bash
# local
cp .env.example .env.local
sed -i 's|^NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=http://localhost:8080|' .env.local
git check-ignore -v .env.local

# CI
gh variable set NEXT_PUBLIC_SITE_URL --body "https://talifpathan.vercel.app"

# production
npx vercel@latest env add NEXT_PUBLIC_SITE_URL production
```

## The one thing that catches people

`NEXT_PUBLIC_*` is **inlined at build time**, not read at runtime. Changing it in
the Vercel dashboard does nothing until you redeploy. Symptom: `robots.txt` and
the canonical tag keep saying `localhost:3000` in production.

```bash
# detect
curl -sS https://talifpathan.vercel.app/robots.txt | grep -q localhost && echo "STALE BUILD"
# fix
npx vercel@latest --prod --force
```

## GitHub secrets required

None for the recommended architecture. `deploy-verify.yml` and `synthetic.yml`
use the built-in `GITHUB_TOKEN` and a public repository variable.

Only if you switch to CLI-based deploys from Actions do you need
`VERCEL_TOKEN`, `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`. That trade is discussed
in `ARCHITECTURE.md`; the recommendation is not to.
