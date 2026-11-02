# tooljar Hub — Agent Instructions

The home page at **https://tooljar.dev**: one Cloudflare Worker (TypeScript, no framework) that lists every tooljar tool with a live demo, plus guides, a line about the maker and "Suggest a tool". The tools themselves live in their own repos (`../ip`, `../email`). Public, MIT-licensed repo `tooljar-dev/tooljar.dev`.

**This file is shared by every AI agent.** Claude Code reads it through `CLAUDE.md`. Codex reads it directly.

**Shared rules for all projects (maintainer's workspace):** `../../_shared/README.md`. 🔒 Locks there can't be overridden here.

## Start of every session

1. Read `../STATUS-hub.md` (this site's tracker; it lives outside this public repo on purpose).
2. Run `git status` and `git log -3`.

## End of every session

1. Update `../STATUS-hub.md` (log, open problems, next steps).
2. Commit with the repo's commit style (see "Rules").
3. Ask Saba before pushing and before every deploy.

## Where things live

| Path                                        | What it is                                                                                                |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `src/tools.ts`                              | **The list of tools.** Page, sitemap, `/tools.json`, `/llms.txt` and `curl tooljar.dev` are built from it |
| `src/index.ts`                              | Router: www → apex redirect, pages, crawler files, static files, headers (CSP)                            |
| `src/pages/home.ts`                         | The home page; `DEMOS` holds each tool's live demo (IP card, email box)                                   |
| `src/layout.ts`                             | `<head>`, header, footer, all CSS (same look as `../ip` and `../email`)                                   |
| `src/seo.ts`                                | `PAGE_PATHS`, robots.txt, sitemap.xml, llms.txt, security.txt, tools.json                                 |
| `src/visitor.ts`                            | The visitor's IP and rough place from Cloudflare (a cut-down copy of `../ip/src/visitor.ts`)              |
| `public/`                                   | Icons and `logo-512.png` (from `../brand/logo/final/`)                                                    |
| `scripts/smoke.mjs`                         | Live checks against a running copy                                                                        |
| `.github/ISSUE_TEMPLATE/suggest-a-tool.yml` | The "Suggest a tool" form the site links to                                                               |

## Run, check, deploy

- `npm install`: once per machine.
- `npm run dev`: local copy. `npm run check`: Biome, TypeScript, tests, deploy dry run. Run it before saying a code task is done.
- **Deploy by hand** (only with Saba's OK): `npm run cf:dry`, then `npx wrangler deploy --config wrangler.jsonc`, then `npm run smoke`. Auth: `CLOUDFLARE_API_TOKEN` from the tooljar token. PowerShell: `$env:CLOUDFLARE_API_TOKEN = [Environment]::GetEnvironmentVariable('CLOUDFLARE_API_TOKEN_TOOLJAR','User')`.
- The Worker owns two custom domains: `tooljar.dev` and `www.tooljar.dev`. The apex also has Email Routing (MX, SPF, DKIM, DMARC for `saba@tooljar.dev`); never delete DNS records on the apex.

## Adding a tool

1. Add an entry to `TOOLS` in `src/tools.ts` (id = subdomain, commands, guides). Add a live demo in `DEMOS` (`src/pages/home.ts`) only if it needs no JavaScript and no new third party; if it posts a form to the tool, add the tool to `form-action` in the CSP (`src/index.ts`).
2. Bump `SITE.updated` in `src/site.ts`.
3. In the new tool's repo: link back to `https://tooljar.dev` ("All tooljar tools") in the footer and `llms.txt`, and add the other tools to its footer.
4. Add the new host to the zone's rate-limit rule if it has an API (see `../STATUS-email.md`).

## Rules

- **Commits:** one line `type(scope): summary` (`feature`, `bugfix`, `refactor`, `docs`, `chore`), no body.
- **`/tools.json` is a public API:** add fields, never rename or remove them.
- **Every value in a page goes through the `html` template tag** (auto-escaped). Use `raw()` only for strings we wrote ourselves.
- **No fake "coming soon" cards.** A tool goes on the page when it is live.
- **Structured data:** `WebSite` + `Organization` only. No `SoftwareApplication` (needs real ratings) and no `ItemList`.
- **Privacy:** the page shows the visitor's IP and forgets it. No logging, no cookies. If that changes, update `/privacy` first and ask Saba.
- **Analytics:** Cloudflare's automatic Web Analytics injects the beacon; keep `ANALYTICS_TOKEN` empty and keep `connect-src 'self'` in the CSP (the beacon reports to `/cdn-cgi/rum`).
- **Plain, simple words** in all docs and page texts.

## Overrides of the shared rules

- **Sentry: not used.** A tiny stateless Worker; errors show in `wrangler tail`.
- **The status file lives outside the repo** (`../STATUS-hub.md`), because this repo is public.
