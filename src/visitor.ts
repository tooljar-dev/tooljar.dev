// The visitor's IP and rough place, read from Cloudflare at the edge. Nothing is stored.
// The same reading as ip.tooljar.dev (ip/src/visitor.ts), cut down to what the IP card shows.

export interface Visitor {
  ip: string;
  version: 4 | 6;
  /** "Tbilisi, Georgia": the place parts we have, without repeats, or null. */
  place: string | null;
}

type CfData = Partial<Record<string, unknown>>;

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

let regionNames: Intl.DisplayNames | null = null;

export function countryName(code: string | null): string | null {
  if (!code) return null;
  // Cloudflare's special codes: T1 = Tor network, XX = unknown.
  if (code === "T1") return "Tor network";
  if (!/^[A-Z]{2}$/.test(code) || code === "XX") return null;
  try {
    regionNames ??= new Intl.DisplayNames(["en"], { type: "region" });
    const name = regionNames.of(code);
    return name && name !== code ? name : null;
  } catch {
    return null;
  }
}

export function readVisitor(request: Request): Visitor {
  const cf = (request.cf ?? {}) as CfData;
  const ip = request.headers.get("cf-connecting-ip")?.trim() || "127.0.0.1";
  const country = str(cf.country)?.toUpperCase() ?? null;
  const parts: string[] = [];
  for (const part of [str(cf.city), str(cf.region), countryName(country)]) {
    if (part && !parts.includes(part)) parts.push(part);
  }
  return {
    ip,
    version: ip.includes(":") ? 6 : 4,
    place: parts.length > 0 ? parts.join(", ") : null,
  };
}
