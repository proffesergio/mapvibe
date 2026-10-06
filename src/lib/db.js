import { neon } from "@neondatabase/serverless";

let cached = null;

/** Lazy Neon client — returns null when DATABASE_URL is missing (local fallback mode). */
export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!cached) cached = neon(url);
  return cached;
}

/** True when Neon is configured. */
export function hasDb() {
  return Boolean(process.env.DATABASE_URL);
}
