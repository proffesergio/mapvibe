import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  if (process.env.VERCEL_ENV === "production") throw new Error("DATABASE_URL is required for production directory migrations");
  console.log("Directory migration skipped: DATABASE_URL is not configured.");
} else {
  const sql = neon(url);
  const source = await readFile(new URL("./neon-tools-schema.sql", import.meta.url), "utf8");
  const statements = source.split(";").map(s => s.trim()).filter(Boolean);
  await sql.transaction(statements.map(statement => sql.query(statement, [])));
  const [result] = await sql`select count(*)::int as count from information_schema.columns where table_schema = 'public' and table_name = 'directory_tools' and column_name = 'screenshot_url'`;
  if (result.count !== 1) throw new Error("Directory migration verification failed");
  console.log("Directory schema ready, including categories and screenshots.");
}
