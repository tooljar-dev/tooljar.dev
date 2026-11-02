# tooljar.dev

The home page of **[tooljar](https://tooljar.dev)**: small, free, open-source web tools that each do one job well. Every tool has its own fast page and a free API, with no key and no sign-up.

| Tool                                           | What it does                                                                                                                                                       | Try it                                  |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------- |
| [ip.tooljar.dev](https://ip.tooljar.dev)       | Your public IP address, rough location and network ([source](https://github.com/tooljar-dev/ip))                                                                   | `curl ip.tooljar.dev`                   |
| [email.tooljar.dev](https://email.tooljar.dev) | Is this email address temp mail (disposable)? ([source](https://github.com/tooljar-dev/email), npm [`is-temp-email`](https://www.npmjs.com/package/is-temp-email)) | `curl email.tooljar.dev/mailinator.com` |

From a terminal, `curl tooljar.dev` prints the same list.

**Want a tool that doesn't exist yet?** [Suggest a tool](https://github.com/tooljar-dev/tooljar.dev/issues/new?template=suggest-a-tool.yml).

## For scripts

- [`/tools.json`](https://tooljar.dev/tools.json): every tool with its address, API docs, commands, npm package, source and guides. CORS is on. Fields only get added, never renamed or removed.
- [`/llms.txt`](https://tooljar.dev/llms.txt): the same list for AI tools.

## How it works

One Cloudflare Worker (TypeScript, no framework) renders every page on the server:

- `src/tools.ts`: **the list of tools.** The home page, `sitemap.xml`, `/tools.json` and `/llms.txt` are all built from it. Adding a tool is one entry there.
- The IP card shows the visitor's IP from Cloudflare (`CF-Connecting-IP`), and nothing is stored. The email box is a plain form that opens email.tooljar.dev.
- `www.tooljar.dev` redirects to `tooljar.dev` (301).
- No JavaScript of our own, no cookies, no ads. Visits are counted with Cloudflare Web Analytics (no cookies).

```sh
npm install
npm run dev     # local copy at http://localhost:8787
npm run check   # Biome, TypeScript, tests, deploy dry run
npm run smoke   # live checks against https://tooljar.dev
```

## License

MIT. Made by [Saba Janelidze](https://www.sabajanelidze.com).
