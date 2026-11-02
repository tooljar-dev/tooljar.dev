import { type Html, html } from "../html";
import { ICONS } from "../icons";
import type { Page } from "../layout";
import { SITE, SUGGEST_URL } from "../site";
import { bare, isNew, monthYear, TOOLS, type Tool } from "../tools";
import type { Visitor } from "../visitor";

/** A live demo inside a tool's card, by tool id. A tool without one just has no demo. */
const DEMOS: Record<string, (v: Visitor) => Html> = {
  ip: (v) => html`<div class="demo">
<p class="label">Your IP address (IPv${v.version})</p>
<p class="ip${v.version === 6 ? " v6" : ""}">${v.ip}</p>
<p class="place">${v.place ?? "Location unknown"}</p>
</div>`,
  // A plain form: the answer shows on email.tooljar.dev. Nothing is checked on this site.
  email: () => html`<form class="demo" action="https://email.tooljar.dev/" method="get">
<label class="label" for="q">Check an email address or domain</label>
<div class="ask"><input id="q" name="q" type="text" inputmode="email" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="320" placeholder="name@example.com" required><button class="btn" type="submit">Check</button></div>
</form>`,
};

function toolCard(tool: Tool, visitor: Visitor, today: string): Html {
  const demo = DEMOS[tool.id];
  return html`<article class="tool" id="${tool.id}">
<div class="tool-head"><span class="pill">${tool.pill}</span><a class="host" href="${tool.url}">${bare(tool.url)}</a>${isNew(tool, today) ? html`<span class="new">New</span>` : ""}<span class="since">Since ${monthYear(tool.added)}</span></div>
<h3><a href="${tool.url}">${tool.title}</a></h3>
<p class="summary">${tool.summary}</p>
${demo ? demo(visitor) : ""}
<div class="uses">
${tool.commands.map((c) => html`<div class="terminal"><code>${c.cmd}</code><span class="out">→ ${c.does}</span></div>`)}
</div>
<div class="actions"><a class="btn" href="${tool.url}">Open the tool</a><span class="more"><a href="${tool.api}">Free API</a>${tool.npm ? html`<a href="${tool.npm.url}">npm package</a>` : ""}<a href="${tool.source}">Source code</a></span></div>
</article>`;
}

function guideLinks(): Html[] {
  return TOOLS.flatMap((tool) =>
    tool.guides.map(
      (g) =>
        html`<a href="${g.url}"><span class="from"><span class="pill">${tool.pill}</span>${bare(tool.url)}</span><b>${g.title}</b><span class="t">${g.text}</span></a>`,
    ),
  );
}

export function structuredData(): unknown[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE.name,
      alternateName: SITE.host,
      url: `${SITE.origin}/`,
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE.name,
      url: `${SITE.origin}/`,
      logo: `${SITE.origin}/logo-512.png`,
      email: SITE.email,
      sameAs: [SITE.org],
      founder: { "@type": "Person", name: SITE.maker.name, url: SITE.maker.url },
    },
  ];
}

export function homePage(visitor: Visitor, today: string): Page {
  const count = TOOLS.length;
  return {
    path: "/",
    title: "tooljar: small, free, open-source web tools and APIs",
    description:
      "Free tools that each do one job well: see your IP address, check if an email address is temp mail, and more. Each comes with a free API. Open source, no sign-up.",
    structuredData: structuredData(),
    body: html`
<h1>Small, free tools that do one job well</h1>
<p class="lead">Each tooljar tool has its own fast page, and a free API for your scripts and apps. The code is open, and there is nothing to sign up for.</p>
<ul class="calm"><li>Free</li><li>Open source (MIT)</li><li>No sign-up</li><li>No cookies or ads</li></ul>

<section id="tools" aria-labelledby="tools-h">
<h2 id="tools-h">Tools</h2>
<p class="section-lead">${count} tools so far. Try them right here, or open each one for the full page.</p>
<div class="tools">
${TOOLS.map((t) => toolCard(t, visitor, today))}
</div>
</section>

<section id="guides" aria-labelledby="guides-h">
<h2 id="guides-h">Guides</h2>
<p class="section-lead">Short, plain-language help pages from the tools.</p>
<div class="links">
${guideLinks()}
</div>
</section>

<div class="split">
<section id="about" class="panel" aria-labelledby="about-h">
<h2 id="about-h"><span class="badge">${ICONS.user}</span>Who makes tooljar</h2>
<p>tooljar is made and run by <a href="${SITE.maker.url}">${SITE.maker.name}</a>, a principal engineer in Tbilisi, Georgia.</p>
<p>Every tool is open source under the MIT license: read the code, run your own copy, or send a fix.</p>
<div class="row"><a href="${SITE.org}">GitHub: tooljar-dev</a><a href="mailto:${SITE.email}">${SITE.email}</a></div>
</section>
<section id="suggest" class="panel" aria-labelledby="suggest-h">
<h2 id="suggest-h"><span class="badge">${ICONS.bulb}</span>Suggest a tool</h2>
<p>Is there a small tool that would save you time? Tell us what it should do. We read every idea.</p>
<div class="row"><a class="btn" href="${SUGGEST_URL}">Suggest a tool on GitHub</a><span>or email <a href="mailto:${SITE.email}">${SITE.email}</a></span></div>
</section>
</div>
`,
  };
}
