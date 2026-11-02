import { describe, expect, it } from "vitest";
import { bare, isNew, monthYear, TOOLS, type Tool } from "../src/tools";
import { countryName, readVisitor } from "../src/visitor";

const TOOL = { added: "2026-10-26" } as Tool;

describe("tool list", () => {
  it("has unique ids, tooljar addresses and real dates", () => {
    const ids = TOOLS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const t of TOOLS) {
      expect(t.url).toBe(`https://${t.id}.tooljar.dev`);
      expect(t.api.startsWith(t.url)).toBe(true);
      expect(Number.isNaN(Date.parse(t.added))).toBe(false);
      for (const g of t.guides) expect(g.url.startsWith(`${t.url}/`)).toBe(true);
    }
  });

  it("labels a tool New for 45 days", () => {
    expect(isNew(TOOL, "2026-10-26")).toBe(true);
    expect(isNew(TOOL, "2026-12-09")).toBe(true);
    expect(isNew(TOOL, "2026-12-10")).toBe(false);
    expect(isNew(TOOL, "2026-10-25")).toBe(false);
  });

  it("formats dates and addresses for people", () => {
    expect(monthYear("2026-10-26")).toBe("Oct 2026");
    expect(bare("https://ip.tooljar.dev")).toBe("ip.tooljar.dev");
  });
});

describe("visitor", () => {
  it("reads the IP and a place line without repeats", () => {
    const request = new Request("https://tooljar.dev/", {
      headers: { "cf-connecting-ip": "203.0.113.7" },
    });
    Object.defineProperty(request, "cf", {
      value: { city: "Tbilisi", region: "Tbilisi", country: "GE" },
    });
    expect(readVisitor(request)).toEqual({
      ip: "203.0.113.7",
      version: 4,
      place: "Tbilisi, Georgia",
    });
  });

  it("falls back when Cloudflare sends nothing", () => {
    expect(readVisitor(new Request("https://tooljar.dev/"))).toEqual({
      ip: "127.0.0.1",
      version: 4,
      place: null,
    });
  });

  it("names countries, and Cloudflare's special codes", () => {
    expect(countryName("DE")).toBe("Germany");
    expect(countryName("T1")).toBe("Tor network");
    expect(countryName("XX")).toBeNull();
    expect(countryName(null)).toBeNull();
  });
});
