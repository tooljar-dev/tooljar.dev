// THE list of tooljar tools. The home page, sitemap.xml, /tools.json and /llms.txt are all
// built from it, so adding a tool here updates every one of them. Keep each text short and
// plain: it shows on the page as written.

export interface Guide {
  title: string;
  /** One short line under the title. */
  text: string;
  url: string;
}

export interface Command {
  cmd: string;
  /** What it prints or does, shown under it after an arrow. */
  does: string;
}

export interface Tool {
  /** Short id, also the subdomain: "ip" → ip.tooljar.dev. */
  id: string;
  /** The word in the pill next to the logo on the tool's own site. */
  pill: string;
  /** What it does, as a question or a task: the card's heading. */
  title: string;
  /** One sentence for the card, tools.json and llms.txt. */
  summary: string;
  url: string;
  /** The day it went live (YYYY-MM-DD). Tools newer than NEW_DAYS get a "New" label. */
  added: string;
  /** The API documentation page. */
  api: string;
  /** Commands people can paste into a terminal, with what each one does. The first one is
   *  the API example used in tools.json, llms.txt and `curl tooljar.dev`. */
  commands: [Command, ...Command[]];
  npm: { name: string; url: string } | null;
  source: string;
  guides: Guide[];
}

export const NEW_DAYS = 45;

export const TOOLS: Tool[] = [
  {
    id: "ip",
    pill: "IP",
    title: "What is my IP address?",
    summary:
      "See your public IP address, rough location and internet provider at once, plus a free IP API for scripts.",
    url: "https://ip.tooljar.dev",
    added: "2026-10-26",
    api: "https://ip.tooljar.dev/api",
    commands: [
      { cmd: "curl ip.tooljar.dev", does: "your IP address as plain text" },
      { cmd: "curl ip.tooljar.dev/json", does: "IP, location and network as JSON" },
    ],
    npm: null,
    source: "https://github.com/tooljar-dev/ip",
    guides: [
      {
        title: "Why is my IP location wrong?",
        text: "Six reasons a website puts you in the wrong city, and how to fix it.",
        url: "https://ip.tooljar.dev/why-is-my-location-wrong",
      },
      {
        title: "Public vs private IP address",
        text: "What websites see, what only your home network sees.",
        url: "https://ip.tooljar.dev/public-vs-private-ip",
      },
      {
        title: "Am I using a VPN?",
        text: "Check that your VPN works, and test for WebRTC leaks.",
        url: "https://ip.tooljar.dev/vpn-check",
      },
      {
        title: "Do I have IPv6?",
        text: "Your IPv6 address, and why you might not have one.",
        url: "https://ip.tooljar.dev/ipv6",
      },
      {
        title: "Where does my IP point?",
        text: "City, region and time zone, and how exact that is.",
        url: "https://ip.tooljar.dev/location",
      },
      {
        title: "What headers does my browser send?",
        text: "Every header your browser sends to each website.",
        url: "https://ip.tooljar.dev/headers",
      },
    ],
  },
  {
    id: "email",
    pill: "Email",
    title: "Is this email address temp mail?",
    summary:
      "Check an email address or domain against 78,000+ disposable email domains and its mail server, and see why. Free API and npm package.",
    url: "https://email.tooljar.dev",
    added: "2026-11-01",
    api: "https://email.tooljar.dev/api",
    commands: [
      {
        cmd: "curl email.tooljar.dev/mailinator.com",
        does: "one word: disposable, suspicious, undeliverable or ok",
      },
      { cmd: "npm install is-temp-email", does: "the same check offline, in your own code" },
    ],
    npm: { name: "is-temp-email", url: "https://www.npmjs.com/package/is-temp-email" },
    source: "https://github.com/tooljar-dev/email",
    guides: [
      {
        title: "Should you block temp mail at sign-up?",
        text: "When blocking helps, when it hurts, and a gentler way.",
        url: "https://email.tooljar.dev/should-i-block-temp-mail",
      },
      {
        title: "How the temp mail checker works",
        text: "Where the data comes from, and how often it is wrong.",
        url: "https://email.tooljar.dev/how-it-works",
      },
    ],
  },
];

/** true while a tool is younger than NEW_DAYS. `today` is YYYY-MM-DD. */
export function isNew(tool: Tool, today: string): boolean {
  const age = (Date.parse(today) - Date.parse(tool.added)) / 86_400_000;
  return age >= 0 && age < NEW_DAYS;
}

/** "Oct 2026" from "2026-10-26". */
export function monthYear(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** The address without "https://", for link text: "ip.tooljar.dev". */
export function bare(url: string): string {
  return url.replace(/^https:\/\//, "").replace(/\/$/, "");
}
