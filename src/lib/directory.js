import { DISTRICTS } from "../data/districts.js";
import { TOOL_CATEGORIES } from "../data/tool-options.js";

export { TOOL_CATEGORIES };
const districtSet = new Set(DISTRICTS.map(({ id }) => id));
const stopWords = new Set(["a", "an", "and", "app", "application", "by", "for", "in", "is", "of", "on", "or", "platform", "the", "to", "tool", "tools", "with"]);

function requiredText(value, field, min, max) {
  if (typeof value !== "string") throw new Error(`${field} must be text`);
  const text = value.trim().replace(/\s+/g, " ");
  if (text.length < min || text.length > max) throw new Error(`${field} must be ${min}–${max} characters`);
  return text;
}

function categoryText(value) {
  if (typeof value === "string" && /[\p{Cc}\p{Cf}]/u.test(value)) throw new Error("category contains invalid characters");
  const category = requiredText(value, "category", 2, 60);
  return category;
}

/** Accept a public HTTPS image or a small embedded PNG, JPEG, or WebP screenshot. */
export function screenshotUrl(value) {
  if (value == null || value === "") return null;
  if (typeof value !== "string") throw new Error("screenshotUrl must be a public HTTPS image URL or image data");
  if (value.startsWith("data:")) {
    const match = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
    if (!match || match[2].length % 4 !== 0) throw new Error("screenshotUrl must be PNG, JPEG, or WebP image data");
    const bytes = Buffer.from(match[2], "base64");
    if (!bytes.length || bytes.length > 200 * 1024 || bytes.toString("base64") !== match[2]) {
      throw new Error("screenshotUrl image data must be at most 200 KB");
    }
    return value;
  }
  if (!value.trim().toLowerCase().startsWith("https://")) throw new Error("screenshotUrl must be a public HTTPS image URL");
  try { return canonicalUrl(value); }
  catch { throw new Error("screenshotUrl must be a public HTTPS image URL"); }
}

/** Normalize a public website URL before storing or comparing it. No network request is made. */
export function canonicalUrl(value) {
  if (typeof value !== "string" || value.length > 2048) throw new Error("url must be a public HTTP(S) URL");
  let url;
  try { url = new URL(value.trim()); } catch { throw new Error("url must be a public HTTP(S) URL"); }
  const host = url.hostname.toLowerCase();
  // Hostnames only: IP literals, local names, credentials, and reserved domains are rejected.
  if (!(["http:", "https:"].includes(url.protocol)) || url.username || url.password ||
      !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(host) ||
      /(?:^|\.)(?:localhost|local|internal|test|invalid|example)$/.test(host)) {
    throw new Error("url must be a public HTTP(S) URL");
  }
  url.hash = "";
  url.pathname = url.pathname.replace(/\/+$/, "") || "/";
  for (const key of [...url.searchParams.keys()]) {
    if (/^utm_/i.test(key) || /^(?:fbclid|gclid)$/i.test(key)) url.searchParams.delete(key);
  }
  url.searchParams.sort();
  return url.toString();
}

export function validateTool(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("tool must be an object");
  const name = requiredText(input.name, "name", 2, 100);
  const description = requiredText(input.description, "description", 10, 1000);
  const url = canonicalUrl(input.url);
  if (!districtSet.has(input.district)) throw new Error("district must be a known district id");
  const category = categoryText(input.category);
  if (input.stack != null && (!Array.isArray(input.stack) || input.stack.length > 12)) {
    throw new Error("stack must be an array of up to 12 technologies");
  }
  const stack = (input.stack ?? []).map((item) => requiredText(item, "stack item", 1, 40));
  if (new Set(stack.map((item) => item.toLowerCase())).size !== stack.length) throw new Error("stack entries must be unique");
  return { name, description, url, district: input.district, category, stack, screenshotUrl: screenshotUrl(input.screenshotUrl) };
}

function tokens(value) {
  return new Set(String(value).normalize("NFKC").toLowerCase().match(/[\p{L}\p{N}]+/gu)?.filter((token) => token.length > 2 && !stopWords.has(token)) ?? []);
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  const common = [...a].filter((token) => b.has(token)).length;
  return common / (a.size + b.size - common);
}

/** Editorial hint only: shared category plus a strongly similar name or description. */
export function detectCarbonCopy(tool, candidates) {
  const name = tokens(tool.name);
  const description = tokens(tool.description);
  let best = null;
  for (const candidate of candidates) {
    if (candidate.category !== tool.category || candidate.url === tool.url) continue;
    const candidateName = tokens(candidate.name);
    const nameScore = jaccard(name, candidateName);
    const descriptionScore = jaccard(description, tokens(candidate.description));
    const sharedName = [...name].filter((token) => candidateName.has(token));
    const flagged = nameScore >= 0.8 && name.size >= 1 ||
      nameScore >= 0.5 && descriptionScore >= 0.55 && sharedName.length >= 1 || descriptionScore >= 0.8 && description.size >= 5;
    if (!flagged) continue;
    const score = Math.round((nameScore * 0.6 + descriptionScore * 0.4) * 100);
    if (!best || score > best.score) {
      best = { score, matchedToolId: String(candidate.id), matchedName: candidate.name,
        sharedNameTokens: sharedName, nameSimilarity: Number(nameScore.toFixed(2)),
        descriptionSimilarity: Number(descriptionScore.toFixed(2)) };
    }
  }
  return { carbonCopy: Boolean(best), evidence: best };
}

export function parseListQuery(params) {
  const q = (params.get("q") ?? "").trim();
  const category = params.get("category") ?? "";
  const district = params.get("district") ?? "";
  const stack = (params.get("stack") ?? "").trim();
  const carbonCopy = params.get("carbonCopy") === "true";
  if (stack.length > 40) throw new Error("stack must be at most 40 characters");
  const limitRaw = params.get("limit") ?? "10";
  if (q.length > 100) throw new Error("q must be at most 100 characters");
  const normalizedCategory = category && category !== "all" ? categoryText(category) : "";
  if (district && district !== "all" && !districtSet.has(district)) throw new Error("invalid district");
  if (!/^\d+$/.test(limitRaw) || Number(limitRaw) < 1 || Number(limitRaw) > 10) throw new Error("limit must be 1–10");
  const cursorRaw = params.get("cursor");
  let cursor = null;
  if (cursorRaw) {
    try {
      const value = JSON.parse(Buffer.from(cursorRaw, "base64url").toString("utf8"));
      if (!/^\d+$/.test(String(value.id)) || !Number.isSafeInteger(Date.parse(value.createdAt)) ||
          new Date(value.createdAt).toISOString() !== value.createdAt) throw new Error();
      cursor = { id: String(value.id), createdAt: value.createdAt };
    } catch { throw new Error("invalid cursor"); }
  }
  return { q, stack, carbonCopy, category: normalizedCategory, district: district === "all" ? "" : district,
    limit: Number(limitRaw), cursor };
}

export function encodeCursor(row) {
  return Buffer.from(JSON.stringify({ id: String(row.id), createdAt: new Date(row.created_at).toISOString() })).toString("base64url");
}

export function toPublicTool(row) {
  return { id: String(row.id), name: row.name, description: row.description, url: row.url,
    district: row.district_id, category: row.category, stack: row.stack ?? [], screenshotUrl: row.screenshot_url ?? null,
    carbonCopy: Boolean(row.carbon_copy), carbonCopyEvidence: row.carbon_copy_evidence ?? null,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at };
}

export function escapeLike(value) {
  return value.replace(/[!%_]/g, "!$&");
}
