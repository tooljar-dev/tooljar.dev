// Small line icons (24×24), drawn with the current text color.
import { type Html, raw } from "./html";

function icon(paths: string): Html {
  return raw(
    `<svg class="icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`,
  );
}

export const ICONS = {
  globe: icon(
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/>',
  ),
  mail: icon('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  book: icon(
    '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
  ),
  bulb: icon(
    '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  ),
  user: icon('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/>'),
} as const;

// The same mark as public/favicon.svg, without its <style>: an inline <style> would apply to the
// whole page. The lid and jar take the theme colours from the page CSS (.logo-jar in layout.ts);
// the pointer stays dark ink in both themes. 32 px keeps every edge on a whole pixel.
export const JAR_LOGO = raw(
  '<svg class="logo-jar" viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" focusable="false"><rect class="lid" x="6" y="2" width="20" height="6" rx="3" fill="#0f766e"/><path class="jar" d="M8 10H24V12C24 14 30 13 30 18V24Q30 30 24 30H8Q2 30 2 24V18C2 13 8 14 8 12Z" fill="#f59e0b"/><path d="M12 12L24 24H20L22 28H18L16 24L12 28Z" fill="#1d2433"/></svg>',
);
