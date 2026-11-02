// Files for search engines, AI tools and scripts: robots.txt, sitemap.xml, llms.txt,
// security.txt and tools.json. All tool data comes from TOOLS (src/tools.ts).
import { SITE, SUGGEST_URL } from "./site";
import { TOOLS } from "./tools";

/** Every public page of this site, in the order the sitemap lists them. */
export const PAGE_PATHS = ["/", "/privacy"] as const;

export function robotsTxt(): string {
  return `# tooljar: every crawler is welcome, AI crawlers included.
# Each tool (ip.tooljar.dev, email.tooljar.dev, …) has its own robots.txt and sitemap.
User-agent: *
Allow: /

Sitemap: ${SITE.origin}/sitemap.xml
`;
}

export function sitemapXml(): string {
  const urls = PAGE_PATHS.map(
    (path) => `  <url><loc>${SITE.origin}${path}</loc><lastmod>${SITE.updated}</lastmod></url>`,
  ).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

/** The public list of tools, for scripts and for the tools' own sites. Fields only get added. */
export function toolsJson(): unknown {
  return {
    name: SITE.name,
    url: SITE.origin,
    updated: SITE.updated,
    suggest: SUGGEST_URL,
    tools: TOOLS.map((t) => ({
      id: t.id,
      title: t.title,
      summary: t.summary,
      url: t.url,
      added: t.added,
      api: { docs: t.api, example: t.commands[0].cmd },
      commands: t.commands,
      npm: t.npm,
      source: t.source,
      guides: t.guides.map((g) => ({ title: g.title, url: g.url })),
    })),
  };
}

export function llmsTxt(): string {
  const tools = TOOLS.map((t) => {
    const lines = [
      `### ${t.title}`,
      "",
      `${t.summary}`,
      "",
      `- [Website](${t.url})`,
      `- [Free API documentation](${t.api})`,
      ...t.commands.map((c) => `- \`${c.cmd}\`: ${c.does}`),
    ];
    if (t.npm) lines.push(`- [npm package \`${t.npm.name}\`](${t.npm.url})`);
    lines.push(`- [Source code (MIT)](${t.source})`);
    for (const g of t.guides) lines.push(`- [${g.title}](${g.url}): ${g.text}`);
    lines.push(`- More detail: ${t.url}/llms.txt`);
    return lines.join("\n");
  }).join("\n\n");
  return `# tooljar

> Small, free, open-source web tools, each on its own subdomain of tooljar.dev, each with a free API (no key, no sign-up, CORS enabled). Made by ${SITE.maker.name}.

## Tools

${tools}

## About

- [All tools as JSON](${SITE.origin}/tools.json)
- [Source code of this site](${SITE.repo})
- [Suggest a tool](${SUGGEST_URL})
- [Privacy](${SITE.origin}/privacy): no cookies, no ads, IP addresses are not stored.
- Contact: ${SITE.email}
`;
}

export function securityTxt(): string {
  return `Contact: ${SITE.repo}/security/advisories/new
Contact: mailto:${SITE.email}
Expires: 2027-11-01T00:00:00.000Z
Preferred-Languages: en
Canonical: ${SITE.origin}/.well-known/security.txt
`;
}
