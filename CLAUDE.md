@AGENTS.md

# Claude Code — extra notes

The shared rules are in `AGENTS.md` (imported above). This part is only for Claude Code.

- **Browser:** Playwright screenshots go to `~/.cache/playwright-mcp`, never the repo. The Playwright profile `tooljar` is signed in to Cloudflare, Google Search Console and Bing Webmaster Tools.
- **Cloudflare:** the Worker is in the Cloudflare account "tooljar". Deploy by hand with `CLOUDFLARE_API_TOKEN_TOOLJAR` (see `AGENTS.md`).
- **Secrets:** never search or snapshot a page that shows a secret. From Windows, pass secrets to `gh` with `--body $value`, never through a pipe (PowerShell 5.1 adds an invisible U+FEFF).
