// The shared page frame: <head> with all SEO tags, the header, the footer and the styles.
// Same look as ip.tooljar.dev and email.tooljar.dev (their src/layout.ts); keep them in step.
import { type Html, html, jsonLd, raw } from "./html";
import { JAR_LOGO } from "./icons";
import { SITE, SUGGEST_URL } from "./site";
import { TOOLS } from "./tools";

export interface Page {
  path: string;
  /** The <title>: what shows in search results and the browser tab. */
  title: string;
  /** The meta description: the grey text under the title in search results. */
  description: string;
  body: Html;
  structuredData?: unknown[];
  status?: number;
  /** Pages that must stay out of search results (the 404 page). */
  noindex?: boolean;
}

const NAV: [string, string][] = [
  ["/#tools", "Tools"],
  ["/#guides", "Guides"],
  ["/#about", "About"],
  [SITE.org, "GitHub"],
];

const STYLES = raw(`
:root{--bg:#fdf8f1;--surface:#fff;--surface-2:#fff4e3;--text:#1d2433;--muted:#566072;--border:#ecdfcb;--accent:#0f766e;--accent-ink:#fff;--accent-soft:#d7f3ee;--honey:#f59e0b;--honey-soft:#fde8bf;--ok:#15803d;--code-bg:#1d2433;--code-text:#f6efe4;--radius:20px;--shadow:0 1px 2px rgb(80 50 10/6%),0 10px 30px rgb(80 50 10/7%);color-scheme:light dark}
@media (prefers-color-scheme:dark){:root{--bg:#14161b;--surface:#1d2027;--surface-2:#252a33;--text:#eeebe6;--muted:#a7adb9;--border:#323844;--accent:#5eead4;--accent-ink:#082d29;--accent-soft:#113a35;--honey:#fbbf24;--honey-soft:#3b2e10;--ok:#4ade80;--code-bg:#0e1014;--shadow:none}}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
body{margin:0;background:var(--bg);color:var(--text);font:17px/1.6 ui-rounded,"SF Pro Rounded","Segoe UI Variable Text","Segoe UI",system-ui,-apple-system,Roboto,"Helvetica Neue",Arial,sans-serif}
a{color:var(--accent);text-underline-offset:3px}
a:hover{text-decoration-thickness:2px}
:focus-visible{outline:3px solid var(--honey);outline-offset:2px;border-radius:6px}
.wrap{max-width:1040px;margin:0 auto;padding:0 16px}
.skip{position:absolute;left:-999px}.skip:focus{left:16px;top:8px;background:var(--surface);padding:8px 12px;z-index:9}
header.top{padding:18px 0 8px}
.bar{display:flex;flex-wrap:wrap;align-items:center;gap:10px 22px;justify-content:space-between}
.brand{display:flex;align-items:center;gap:9px;color:var(--text);text-decoration:none;font-weight:800;font-size:1.2rem;letter-spacing:-.01em}
.pill{display:inline-block;background:var(--accent);color:var(--accent-ink);border-radius:999px;padding:1px 10px;font-size:.85rem;font-weight:800;line-height:1.5}
.logo-jar{flex:none}.logo-jar .lid{fill:var(--accent)}.logo-jar .jar{fill:var(--honey)}
nav ul{display:flex;flex-wrap:wrap;gap:4px;margin:0;padding:0;list-style:none}
nav a{display:block;padding:6px 12px;border-radius:999px;color:var(--muted);text-decoration:none;font-weight:600;font-size:.95rem}
nav a:hover{background:var(--surface-2);color:var(--text)}
main.wrap{padding-top:12px;padding-bottom:56px}
section{scroll-margin-top:16px}
h1{font-size:clamp(1.9rem,6vw,3rem);line-height:1.15;letter-spacing:-.025em;margin:22px 0 10px;max-width:18em}
h2{font-size:1.5rem;line-height:1.3;margin:52px 0 6px;letter-spacing:-.01em}
h3{font-size:1.1rem;margin:22px 0 4px}
.lead{color:var(--muted);font-size:1.15rem;margin:0 0 18px;max-width:40em}
.section-lead{color:var(--muted);margin:0 0 18px;max-width:46em}
.calm{display:flex;flex-wrap:wrap;gap:4px 18px;margin:0 0 26px;color:var(--muted);font-size:.95rem;font-weight:600;padding:0;list-style:none}
.calm li::before{content:"✓ ";color:var(--ok)}
.btn{display:inline-flex;align-items:center;gap:8px;border:0;border-radius:999px;padding:10px 20px;font:inherit;font-weight:700;background:var(--accent);color:var(--accent-ink);cursor:pointer;text-decoration:none}
.btn:hover{filter:brightness(1.08)}
.btn.ghost{background:var(--surface);color:var(--text);border:1px solid var(--border)}
.tools{display:grid;gap:18px}
@media (min-width:860px){.tools{grid-template-columns:repeat(2,minmax(0,1fr))}}
.tool{display:flex;flex-direction:column;gap:14px;background:var(--surface);border:1px solid var(--border);border-radius:24px;padding:clamp(18px,4vw,26px);box-shadow:var(--shadow);min-width:0}
.tool-head{display:flex;flex-wrap:wrap;align-items:center;gap:8px 10px;color:var(--muted);font-weight:700;font-size:.92rem}
.tool-head .host{color:var(--muted);text-decoration:none}
.tool-head .host:hover{color:var(--text)}
.new{background:var(--honey-soft);color:var(--text);border-radius:999px;padding:1px 10px;font-size:.8rem;font-weight:800}
.since{margin-left:auto;font-weight:600;font-size:.85rem}
.tool h3{font-size:clamp(1.3rem,3.6vw,1.6rem);line-height:1.25;letter-spacing:-.015em;margin:0}
.tool h3 a{color:var(--text);text-decoration:none}
.tool h3 a:hover{color:var(--accent)}
.tool p{margin:0}
.tool .summary{color:var(--muted)}
.demo{background:linear-gradient(135deg,var(--honey-soft),var(--surface-2));border:1px solid var(--border);border-radius:18px;padding:16px 18px;min-width:0}
.demo .label{display:block;margin:0;color:var(--muted);font-weight:700;font-size:.9rem}
.demo .ip{font-size:clamp(1.6rem,6vw,2.3rem);font-weight:800;line-height:1.15;letter-spacing:-.02em;margin:2px 0 2px;font-variant-numeric:tabular-nums;overflow-wrap:anywhere}
.demo .ip.v6{font-size:clamp(1.05rem,3.6vw,1.35rem)}
.demo .place{color:var(--muted);margin:0;font-weight:600}
.ask{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 0}
.ask input{flex:1 1 200px;min-width:0;font:inherit;padding:10px 16px;border-radius:999px;border:1px solid var(--border);background:var(--surface);color:var(--text)}
.ask input:focus{outline:3px solid var(--honey);outline-offset:1px}
.terminal{background:var(--code-bg);color:var(--code-text);border-radius:14px;padding:12px 16px;min-width:0}
.terminal code{display:block;font:600 .95rem/1.5 ui-monospace,"Cascadia Code","SF Mono",Menlo,Consolas,monospace;white-space:pre;overflow-x:auto;scrollbar-width:thin;scrollbar-color:rgb(246 239 228/35%) transparent}
.terminal code::before{content:"$ ";opacity:.55}
.terminal .out{display:block;margin-top:2px;font-size:.85rem;opacity:.75}
.uses{display:grid;gap:8px}
.tool .actions{display:flex;flex-wrap:wrap;align-items:center;gap:8px 16px;margin-top:auto;padding-top:4px}
.tool .actions .more{display:flex;flex-wrap:wrap;gap:4px 14px;font-weight:600;font-size:.95rem}
code{font-family:ui-monospace,"Cascadia Code","SF Mono",Menlo,Consolas,monospace;font-size:.92em}
p code,li code{background:var(--surface-2);border-radius:6px;padding:1px 6px}
.links{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;margin:14px 0}
.links a{display:flex;flex-direction:column;gap:2px;background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:14px 16px;color:var(--text);text-decoration:none;min-width:0}
.links a:hover{border-color:var(--accent)}
.links .from{display:flex;align-items:center;gap:6px;color:var(--muted);font-size:.82rem;font-weight:700}
.links .from .pill{font-size:.75rem;padding:0 8px}
.links b{display:block;line-height:1.35}
.links span.t{color:var(--muted);font-size:.92rem}
.split{display:grid;gap:18px;margin-top:52px}
@media (min-width:860px){.split{grid-template-columns:repeat(2,minmax(0,1fr))}}
.panel{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:22px 24px;box-shadow:var(--shadow);min-width:0}
.panel h2{margin:0 0 8px;font-size:1.3rem;display:flex;align-items:center;gap:10px}
.panel p{margin:0 0 12px}
.panel .badge{display:inline-grid;place-items:center;width:38px;height:38px;border-radius:12px;background:var(--accent-soft);color:var(--accent);flex:none}
.row{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center}
article{max-width:46em}
footer{border-top:1px solid var(--border);padding:24px 0 40px;color:var(--muted);font-size:.93rem}
footer .cols{display:flex;flex-wrap:wrap;gap:8px 28px;justify-content:space-between}
footer ul{list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:4px 16px}
footer p{margin:4px 0}
@media (max-width:560px){body{font-size:16px}nav a{padding:5px 10px}.since{margin-left:0}.terminal code{font-size:.84rem}}
`);

function analytics(token: string): Html {
  if (!token) return html``;
  return html`<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon="${JSON.stringify({ token })}"></script>`;
}

export function renderPage(page: Page, analyticsToken: string): string {
  const url = `${SITE.origin}${page.path}`;
  const nav = NAV.map(([href, label]) => html`<li><a href="${href}">${label}</a></li>`);
  const toolLinks = TOOLS.map((t) => html`<li><a href="${t.url}">${t.title}</a></li>`);
  return html`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${page.title}</title>
<meta name="description" content="${page.description}">
${page.noindex ? raw('<meta name="robots" content="noindex">') : html`<link rel="canonical" href="${url}">`}
<meta name="theme-color" content="#fdf8f1" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#14161b" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png?v=2" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2">
<link rel="alternate" type="application/json" href="/tools.json" title="All tooljar tools as JSON">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${page.title}">
<meta property="og:description" content="${page.description}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE.origin}/logo-512.png">
<meta name="twitter:card" content="summary">
<style>${STYLES}</style>
${(page.structuredData ?? []).map(jsonLd)}
${analytics(analyticsToken)}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="top"><div class="wrap bar">
<a class="brand" href="/" aria-label="tooljar, home">${JAR_LOGO}<span>tooljar</span></a>
<nav aria-label="Main"><ul>${nav}</ul></nav>
</div></header>
<main id="main" class="wrap">
${page.body}
</main>
<footer><div class="wrap">
<div class="cols">
<div>
<p><strong>tooljar</strong>: small, free, open-source tools. Made by <a href="${SITE.maker.url}">${SITE.maker.name}</a>.</p>
<p>No cookies, no ads, no sign-up. We don't store IP addresses.</p>
</div>
<ul>
${toolLinks}
<li><a href="${SUGGEST_URL}">Suggest a tool</a></li>
<li><a href="/privacy">Privacy</a></li>
<li><a href="${SITE.repo}">Source code on GitHub</a></li>
</ul>
</div>
</div></footer>
</body>
</html>
`.value;
}
