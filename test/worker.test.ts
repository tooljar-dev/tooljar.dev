import { exports } from "cloudflare:workers";
import { describe, expect, it } from "vitest";
import { PAGE_PATHS } from "../src/seo";
import { SUGGEST_URL } from "../src/site";
import { TOOLS } from "../src/tools";

const BROWSER = {
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  "cf-connecting-ip": "203.0.113.7",
};
const CURL = { accept: "*/*", "user-agent": "curl/8.22.0" };

function call(path: string, headers: Record<string, string> = BROWSER, host = "tooljar.dev") {
  return exports.default.fetch(
    new Request(`https://${host}${path}`, { redirect: "manual", headers }),
  );
}

describe("home page", () => {
  it("lists every tool with its links, and shows the visitor's IP", async () => {
    const res = await call("/");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
    expect(res.headers.get("cache-control")).toBe("no-store");
    const body = await res.text();
    for (const tool of TOOLS) {
      expect(body).toContain(`<h3><a href="${tool.url}">`);
      expect(body).toContain(`href="${tool.api}"`);
      expect(body).toContain(`href="${tool.source}"`);
      for (const guide of tool.guides) expect(body).toContain(`href="${guide.url}"`);
      for (const c of tool.commands) expect(body).toContain(`<code>${c.cmd}</code>`);
    }
    expect(body).toContain("203.0.113.7");
    expect(body).toContain("IPv4");
    expect(body).toContain('href="https://www.npmjs.com/package/is-temp-email"');
  });

  it("has the email box, allowed by the CSP", async () => {
    const res = await call("/");
    const body = await res.text();
    expect(body).toContain('<form class="demo" action="https://email.tooljar.dev/" method="get">');
    expect(body).toContain('name="q"');
    expect(res.headers.get("content-security-policy")).toContain(
      "form-action https://email.tooljar.dev",
    );
  });

  it("lets Cloudflare's analytics beacon report to this host", async () => {
    const csp = (await call("/")).headers.get("content-security-policy") ?? "";
    expect(csp).toContain("script-src https://static.cloudflareinsights.com");
    expect(csp).toMatch(/connect-src 'self' /);
  });

  it("has guides, about, suggest-a-tool and the structured data", async () => {
    const body = await (await call("/")).text();
    expect(body).toContain('id="guides"');
    expect(body).toContain('id="about"');
    expect(body).toContain(SUGGEST_URL.replace(/&/g, "&amp;"));
    expect(body).toContain('"@type":"WebSite"');
    expect(body).toContain('"@type":"Organization"');
    expect(body).toContain('<link rel="canonical" href="https://tooljar.dev/">');
  });

  it("shows an IPv6 address in the smaller style", async () => {
    const body = await (await call("/", { ...BROWSER, "cf-connecting-ip": "2001:db8::1" })).text();
    expect(body).toContain('<p class="ip v6">2001:db8::1</p>');
    expect(body).toContain("IPv6");
  });

  it("escapes a strange IP header instead of printing it as HTML", async () => {
    const body = await (
      await call("/", { ...BROWSER, "cf-connecting-ip": "<script>x</script>" })
    ).text();
    expect(body).not.toContain("<script>x</script>");
    expect(body).toContain("&lt;script&gt;");
  });

  it("gives curl the tool list as plain text, and JSON when asked", async () => {
    const text = await (await call("/", CURL)).text();
    for (const tool of TOOLS) expect(text).toContain(`$ ${tool.commands[0].cmd}`);
    const res = await call("/", { accept: "application/json" });
    expect(res.headers.get("content-type")).toContain("application/json");
    expect((await res.json<{ tools: unknown[] }>()).tools).toHaveLength(TOOLS.length);
  });
});

describe("addresses", () => {
  it("sends www to the bare domain, keeping the path and query", async () => {
    const res = await call("/privacy?x=1", BROWSER, "www.tooljar.dev");
    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("https://tooljar.dev/privacy?x=1");
  });

  it("sends www files to the bare domain too", async () => {
    const res = await call("/favicon.svg", BROWSER, "www.tooljar.dev");
    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("https://tooljar.dev/favicon.svg");
  });

  it("sends http to https", async () => {
    const res = await call("/", { ...BROWSER, "cf-visitor": '{"scheme":"http"}' });
    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("https://tooljar.dev/");
  });

  it("drops a trailing slash", async () => {
    const res = await call("/privacy/");
    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("https://tooljar.dev/privacy");
  });

  it.each(PAGE_PATHS)("page %s has a canonical link and security headers", async (path) => {
    const res = await call(path);
    expect(res.status).toBe(200);
    expect(await res.text()).toContain(`<link rel="canonical" href="https://tooljar.dev${path}">`);
    expect(res.headers.get("content-security-policy")).toContain("default-src 'none'");
    expect(res.headers.get("strict-transport-security")).toContain("max-age=");
  });

  it("serves the icons and the logo from ./public", async () => {
    for (const path of [
      "/favicon.svg",
      "/favicon-32.png",
      "/apple-touch-icon.png",
      "/logo-512.png",
    ]) {
      const res = await call(path);
      expect(res.status, path).toBe(200);
    }
  });

  it("answers unknown pages with a 404 page that is not indexed", async () => {
    const res = await call("/nope");
    expect(res.status).toBe(404);
    const body = await res.text();
    expect(body).toContain('<meta name="robots" content="noindex">');
    expect(body).toContain(TOOLS[0]?.url);
  });

  it("refuses POST", async () => {
    const res = await exports.default.fetch(
      new Request("https://tooljar.dev/", { method: "POST", body: "x" }),
    );
    expect(res.status).toBe(405);
  });

  it("answers HEAD without a body", async () => {
    const res = await exports.default.fetch(
      new Request("https://tooljar.dev/", { method: "HEAD", headers: BROWSER }),
    );
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("");
  });

  it("marks copies on other hosts as noindex", async () => {
    const res = await call("/", BROWSER, "tooljar-hub.example.workers.dev");
    expect(res.headers.get("x-robots-tag")).toBe("noindex");
    expect((await call("/")).headers.get("x-robots-tag")).toBeNull();
  });
});

describe("files for crawlers and scripts", () => {
  it("tools.json lists every tool, with CORS", async () => {
    const res = await call("/tools.json", CURL);
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
    const data = await res.json<{ tools: { id: string; url: string; guides: unknown[] }[] }>();
    expect(data.tools.map((t) => t.id)).toEqual(TOOLS.map((t) => t.id));
    for (const t of data.tools) expect(t.url).toMatch(/^https:\/\/[a-z]+\.tooljar\.dev$/);
  });

  it("sitemap lists every page, robots names the sitemap", async () => {
    const sitemap = await (await call("/sitemap.xml", CURL)).text();
    for (const path of PAGE_PATHS)
      expect(sitemap).toContain(`<loc>https://tooljar.dev${path}</loc>`);
    const robots = await (await call("/robots.txt", CURL)).text();
    expect(robots).toContain("Sitemap: https://tooljar.dev/sitemap.xml");
  });

  it("llms.txt names every tool and its API", async () => {
    const text = await (await call("/llms.txt", CURL)).text();
    for (const tool of TOOLS) {
      expect(text).toContain(tool.url);
      expect(text).toContain(tool.commands[0].cmd);
    }
  });

  it("security.txt has a contact and an expiry in the future", async () => {
    const text = await (await call("/.well-known/security.txt", CURL)).text();
    expect(text).toContain("Contact: mailto:saba@tooljar.dev");
    const expires = /Expires: (\S+)/.exec(text)?.[1] ?? "";
    expect(Date.parse(expires)).toBeGreaterThan(Date.now());
  });
});
