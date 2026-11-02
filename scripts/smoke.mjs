// Live checks against the running site. Usage: npm run smoke [-- https://tooljar.dev]
const BASE = (process.argv[2] ?? "https://tooljar.dev").replace(/\/$/, "");
const host = new URL(BASE).hostname;
const BROWSER = {
  accept: "text/html,application/xhtml+xml",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/141.0 Safari/537.36",
};
const CURL = { accept: "*/*", "user-agent": "curl/8.22.0" };

let failed = 0;
async function expect(name, fn) {
  try {
    const problem = await fn();
    if (problem) throw new Error(problem);
    console.log(`ok   ${name}`);
  } catch (error) {
    failed++;
    console.log(`FAIL ${name}: ${error.message}`);
  }
}

const get = (path, headers = CURL, base = BASE) =>
  fetch(`${base}${path}`, { headers, redirect: "manual", signal: AbortSignal.timeout(15000) });

await expect("home page lists both tools and shows an IP", async () => {
  const res = await get("/", BROWSER);
  const body = await res.text();
  if (res.status !== 200) return `status ${res.status}`;
  for (const needle of [
    'href="https://ip.tooljar.dev"',
    'href="https://email.tooljar.dev"',
    'action="https://email.tooljar.dev/"',
    `<link rel="canonical" href="https://${host}/">`,
    '"@type":"Organization"',
  ]) {
    if (!body.includes(needle)) return `missing ${needle}`;
  }
  if (!/<p class="ip( v6)?">[0-9a-f.:]+<\/p>/.test(body)) return "no IP shown";
  return res.headers.get("content-security-policy")?.includes("connect-src 'self'")
    ? null
    : "CSP lacks connect-src 'self' (analytics beacon)";
});
await expect("curl gets the tool list as text, over https and plain http", async () => {
  const text = await (await get("/")).text();
  if (!text.includes("$ curl ip.tooljar.dev")) return text.slice(0, 80);
  if (!BASE.startsWith("https://")) return null;
  const plain = await (await get("/", CURL, BASE.replace("https://", "http://"))).text();
  return plain.includes("$ curl ip.tooljar.dev") ? null : `http: ${plain.slice(0, 80)}`;
});
await expect("tools.json lists the tools, with CORS", async () => {
  const res = await get("/tools.json");
  const data = await res.json();
  if (res.headers.get("access-control-allow-origin") !== "*") return "no CORS header";
  return data.tools?.length >= 2 ? null : JSON.stringify(data).slice(0, 80);
});
await expect("page /privacy", async () => {
  const res = await get("/privacy", BROWSER);
  return res.status === 200 ? null : `status ${res.status}`;
});
for (const path of [
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
  "/.well-known/security.txt",
  "/favicon.svg",
  "/logo-512.png",
]) {
  await expect(path, async () => {
    const res = await get(path);
    return res.status === 200 ? null : `status ${res.status}`;
  });
}
await expect("unknown page is 404", async () => {
  const res = await get("/nope", BROWSER);
  return res.status === 404 ? null : `status ${res.status}`;
});
if (host === "tooljar.dev") {
  await expect("www redirects to the bare domain (301)", async () => {
    const res = await get("/privacy", BROWSER, "https://www.tooljar.dev");
    const to = res.headers.get("location");
    return res.status === 301 && to === "https://tooljar.dev/privacy"
      ? null
      : `${res.status} ${to}`;
  });
}

console.log(failed ? `\n${failed} check(s) failed` : "\nall checks passed");
process.exit(failed ? 1 : 0);
