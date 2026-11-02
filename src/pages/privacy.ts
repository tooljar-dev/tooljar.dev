import { html } from "../html";
import type { Page } from "../layout";
import { SITE } from "../site";

export function privacyPage(): Page {
  return {
    path: "/privacy",
    title: "Privacy | tooljar",
    description:
      "What tooljar.dev does with your visit: your IP address is shown to you and then forgotten. No cookies, no ads, no request logs.",
    body: html`
<article>
<h1>Privacy</h1>
<p class="lead">Short version: we show you your IP address and then forget it. No cookies, no ads.</p>
<h2>What happens when you open tooljar.dev</h2>
<ul>
<li>Our code runs on Cloudflare Workers. Cloudflare tells it your IP address and a rough place (city and country), so the IP card can show them to you. Nothing is stored, and we keep no request logs.</li>
<li>The email box is a plain form. When you press “Check”, your browser opens <a href="https://email.tooljar.dev">email.tooljar.dev</a> with what you typed. That site has its own <a href="https://email.tooljar.dev/privacy">privacy page</a>: it doesn't store or log the addresses either.</li>
<li>Each tool lives on its own address (like ip.tooljar.dev) and has its own privacy page.</li>
</ul>
<h2>Counting visits</h2>
<p>We count page views with Cloudflare Web Analytics. It sets no cookies, doesn't follow you to other websites and shows us only totals, never who visited.</p>
<h2>Who runs this</h2>
<p>tooljar is made and run by ${SITE.maker.name} (<a href="${SITE.maker.url}">sabajanelidze.com</a>). Contact: <a href="mailto:${SITE.email}">${SITE.email}</a>. The code is open source: <a href="${SITE.repo}">${SITE.repo.replace("https://", "")}</a>.</p>
</article>
`,
  };
}
