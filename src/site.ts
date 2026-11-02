// Facts about the site, kept in one place.
export const SITE = {
  host: "tooljar.dev",
  origin: "https://tooljar.dev",
  name: "tooljar",
  repo: "https://github.com/tooljar-dev/tooljar.dev",
  org: "https://github.com/tooljar-dev",
  email: "saba@tooljar.dev",
  maker: { name: "Saba Janelidze", url: "https://www.sabajanelidze.com" },
  // The day the page texts or the tool list last changed. Used as <lastmod> in the sitemap
  // and as "updated" in /tools.json, so keep it honest.
  updated: "2026-11-02",
} as const;

/** "Suggest a tool": a GitHub issue form in this repo (.github/ISSUE_TEMPLATE/suggest-a-tool.yml). */
export const SUGGEST_URL = `${SITE.repo}/issues/new?template=suggest-a-tool.yml`;

export interface Env {
  ASSETS: Fetcher;
  ANALYTICS_TOKEN: string;
}
