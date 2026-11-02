import { html } from "../html";
import type { Page } from "../layout";
import { TOOLS } from "../tools";

export function notFoundPage(path: string): Page {
  return {
    path,
    title: "Page not found | tooljar",
    description: "This page does not exist.",
    status: 404,
    noindex: true,
    body: html`<h1>Page not found</h1>
<p class="lead">There is no page at <code>${path}</code>. Maybe you were looking for one of the tools:</p>
<ul>${TOOLS.map((t) => html`<li><a href="${t.url}">${t.title}</a></li>`)}</ul>
<p><a class="btn" href="/">Go to the home page</a></p>`,
  };
}
