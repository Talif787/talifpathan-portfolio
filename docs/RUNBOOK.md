# Runbook

Routine operations. For outages see `INCIDENT_RESPONSE.md`; for data loss see
`DISASTER_RECOVERY.md`.

## Ship a change

```bash
pf                                      # cd + nvm use
git checkout main && git pull --rebase origin main
git checkout -b content/<slug>

# edit content/ or components/

npm run verify                          # format:check, lint, build, typecheck
npm run dev -- -p 8080                  # eyeball it

git add -p && git commit -m "content(projects): ..."
git push -u origin content/<slug>
gh pr create --fill
gh pr checks --watch                    # CI, security, and the preview smoke test
```

Open the preview URL from the PR, check the change, then:

```bash
gh pr merge --squash --delete-branch
```

Production deploys automatically. `deploy-verify.yml` smoke tests it within a
couple of minutes. Watch it:

```bash
gh run watch
```

## Verify production by hand

```bash
npm run smoke https://talifpathan.vercel.app
```

Twenty-eight assertions across routes, transport, security headers, content,
SEO artefacts and performance. Exit code 0 means production is healthy.

## Check external links

```bash
npm run links
```

Fourteen source repositories and ten live demos. Free-tier demo hosts sleep, so
run this monthly and before sending the link to anyone. A dead demo link is
worse than no demo link: delete `links.demo` for that project and the "Live"
link disappears on its own.

## Roll back

Vercel keeps every deployment. Rolling back is instant and requires no build.

```bash
npx vercel@latest ls                       # find the last good deployment
npx vercel@latest promote <deployment-url>
npm run smoke https://talifpathan.vercel.app
```

Or in the dashboard: Deployments, find the good one, "Promote to Production".

Then fix forward in Git. A promoted rollback and `main` are now out of sync, so
either revert the bad commit or ship the fix:

```bash
git revert <sha> && git push
```

**There is no database migration to roll back.** This is the whole answer to the
brief's "what happens when deployment succeeds but migration fails" question:
there are no migrations, no schema and no state. A rollback is a pointer change.

## Update dependencies

Dependabot opens PRs weekly, minor and patch grouped into one, majors
individually. Each one runs full CI plus a preview smoke test.

```bash
gh pr list --label dependencies
gh pr checks <n>
gh pr merge <n> --squash --delete-branch
```

For a major bump, open the preview URL and work through the section 9 checklist
in `CLOUD-SHELL-RUNBOOK.md` before merging. Motion and Next are the two where a
major has real blast radius.

## Rotate the deployment link

Nothing to rotate. There are no credentials in this project.

If you later add `VERCEL_TOKEN`, rotate it from the Vercel account settings and
update the GitHub secret in the same sitting.

## Add a custom domain

Costs money, so it is out of scope for the $0 target. When you do buy one, see
the DNS table in `DEPLOYMENT.md`.

## Monthly maintenance

```bash
npm run links            # dead demo links
npm outdated             # dependency drift beyond what Dependabot groups
gh run list --workflow=security.yml --limit 5
npx vercel@latest ls     # confirm nothing unexpected is deployed
```

Ten minutes. Put it in the calendar.
