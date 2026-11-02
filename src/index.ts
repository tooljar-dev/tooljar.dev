// tooljar Hub: the Worker behind https://tooljar.dev (and www.tooljar.dev, which redirects).
// The Worker runs before static files (run_worker_first), so it can redirect www first;
// paths it doesn't know go to ./public (icons, logo), and then to the 404 page.
import { type Page, renderPage } from "./layout";
import { pickFormat } from "./negotiate";
import { homePage } from "./pages/home";
import { notFoundPage } from "./pages/notfound";
import { privacyPage } from "./pages/privacy";
import { llmsTxt, robotsTxt, securityTxt, sitemapXml, toolsJson } from "./seo";
import { type Env, SITE } from "./site";
import { TOOLS } from "./tools";
import { readVisitor } from "./visitor";

const CSP = [
  "default-src 'none'",
  "script-src https://static.cloudflareinsights.com",
  "style-src 'unsafe-inline'",
  "img-src 'self' data:",
  // 'self': Cloudflare's automatic Web Analytics beacon reports to /cdn-cgi/rum on this host.
  "connect-src 'self' https://cloudflareinsights.com",
  "base-uri 'none'",
  // The email box in the Email card sends the visitor to the checker.
  "form-action https://email.tooljar.dev",
  "frame-ancestors 'none'",
].join("; ");

const WWW = `www.${SITE.host}`;

function page(p: Page, env: Env): Response {
  return new Response(renderPage(p, env.ANALYTICS_TOKEN), {
    status: p.status ?? 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      // The home page shows each visitor their own IP, so no shared cache may keep it.
      "cache-control": "no-store",
      "content-security-policy": CSP,
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "permissions-policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
      "strict-transport-security": "max-age=63072000; includeSubDomains",
    },
  });
}

function file(body: string, type: string, extra: Record<string, string> = {}): Response {
  return new Response(body, {
    headers: {
      "content-type": `${type}; charset=utf-8`,
      "cache-control": "public, max-age=3600",
      "x-content-type-options": "nosniff",
      ...extra,
    },
  });
}

/** What `curl tooljar.dev` prints: every tool with a command to try. */
export function toolsText(): string {
  const blocks = TOOLS.map((t) =>
    [t.title, `  ${t.url}`, ...t.commands.map((c) => `  $ ${c.cmd}\n    → ${c.does}`)].join("\n"),
  );
  return `tooljar: small, free, open-source tools (${SITE.origin})

${blocks.join("\n\n")}

All tools as JSON: curl ${SITE.host}/tools.json
`;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

async function route(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  // One address per page, as Google asks: www.tooljar.dev/… → tooljar.dev/…
  if (url.hostname === WWW) {
    url.protocol = "https:";
    url.hostname = SITE.host;
    url.port = "";
    return Response.redirect(url.toString(), 301);
  }
  // Browsers never use http:// here (.dev forces HTTPS), but old links and crawlers might.
  // Scripts keep plain http: `curl tooljar.dev` uses it, and "Always Use HTTPS" is off on
  // purpose in this zone (the same as ip and email).
  const format = pickFormat(request);
  if (format === "html" && /"scheme":"http"/.test(request.headers.get("cf-visitor") ?? "")) {
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }

  const path = url.pathname;
  if (path.length > 1 && path.endsWith("/")) {
    url.pathname = path.replace(/\/+$/, "") || "/";
    return Response.redirect(url.toString(), 301);
  }
  if (path === "/index.html") return Response.redirect(new URL("/", url).toString(), 301);

  switch (path) {
    case "/": {
      if (format === "json")
        return file(`${JSON.stringify(toolsJson(), null, 2)}\n`, "application/json", {
          "cache-control": "no-store",
        });
      if (format === "text")
        return file(toolsText(), "text/plain", { "cache-control": "no-store" });
      return page(homePage(readVisitor(request), today()), env);
    }
    case "/privacy":
      return page(privacyPage(), env);
    case "/tools.json":
      return file(`${JSON.stringify(toolsJson(), null, 2)}\n`, "application/json", {
        "access-control-allow-origin": "*",
      });
    case "/robots.txt":
      return file(robotsTxt(), "text/plain");
    case "/sitemap.xml":
      return file(sitemapXml(), "application/xml");
    case "/llms.txt":
      return file(llmsTxt(), "text/plain");
    case "/.well-known/security.txt":
      return file(securityTxt(), "text/plain");
  }

  // Static files from ./public (icons, logo).
  const asset = await env.ASSETS.fetch(request);
  if (asset.status !== 404) return asset;
  return page(notFoundPage(path), env);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed\n", {
        status: 405,
        headers: { allow: "GET, HEAD", "content-type": "text/plain; charset=utf-8" },
      });
    }

    const response = await route(request, env);

    // Copies of the site on other addresses (local dev, previews) stay out of search results.
    const headers = new Headers(response.headers);
    const host = new URL(request.url).hostname;
    if (host !== SITE.host && host !== WWW) headers.set("x-robots-tag", "noindex");
    return new Response(request.method === "HEAD" ? null : response.body, {
      status: response.status,
      headers,
    });
  },
} satisfies ExportedHandler<Env>;
