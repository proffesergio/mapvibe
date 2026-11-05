import { getSql } from "@/lib/db";
import { detectCarbonCopy, encodeCursor, escapeLike, parseListQuery, toPublicTool, validateTool } from "@/lib/directory";
import { TOOL_CATEGORIES } from "@/data/tool-options";

function dbDiagnostic(error) {
  const code = error?.code;
  if (code === "42P01") return "schema_missing";
  if (code === "42703" || code === "23514") return "schema_outdated";
  if (code === "28P01" || code === "28000") return "database_auth_failed";
  return "database_error";
}

function unavailable(error, payload) {
  console.error("tools API database failure:", error);
  return Response.json({ ...payload, diagnostic: dbDiagnostic(error) }, { status: 503 });
}

export async function GET(request) {
  let query;
  try { query = parseListQuery(new URL(request.url).searchParams); }
  catch (error) { return Response.json({ error: error.message }, { status: 400 }); }

  let sql;
  try { sql = getSql(); }
  catch (error) { return unavailable(error, { tools: [], nextCursor: null, categories: TOOL_CATEGORIES, db: false, unavailable: true }); }
  if (!sql) return Response.json({ tools: [], nextCursor: null, categories: TOOL_CATEGORIES, db: false, unavailable: true, diagnostic: "database_not_configured" }, { status: 503 });
  try {
    const { q, category, district, stack, carbonCopy, cursor, limit } = query;
    const pattern = `%${escapeLike(q)}%`;
    const stackPattern = `%${escapeLike(stack)}%`;
    const rows = await sql`
      select id, name, description, url, district_id, category, stack, screenshot_url, carbon_copy, carbon_copy_evidence, created_at
      from directory_tools
      where true
        ${q ? sql`and (name ilike ${pattern} escape '!' or description ilike ${pattern} escape '!' or exists (select 1 from unnest(stack) entry where entry ilike ${pattern} escape '!'))` : sql``}
        ${category ? sql`and category = ${category}` : sql``}
        ${district ? sql`and district_id = ${district}` : sql``}
        ${stack ? sql`and exists (select 1 from unnest(stack) entry where entry ilike ${stackPattern} escape '!')` : sql``}
        ${carbonCopy ? sql`and carbon_copy = true` : sql``}
        ${cursor ? sql`and (created_at, id) < (${cursor.createdAt}::timestamptz, ${cursor.id}::bigint)` : sql``}
      order by created_at desc, id desc
      limit ${limit + 1}
    `;
    const categoryRows = await sql`select distinct category from directory_tools order by category limit 100`;
    const categories = [...new Set([...TOOL_CATEGORIES, ...categoryRows.map((row) => row.category)])];
    const page = rows.slice(0, limit);
    return Response.json({ tools: page.map(toPublicTool), nextCursor: rows.length > limit ? encodeCursor(page.at(-1)) : null, categories, db: true });
  } catch (error) {
    return unavailable(error, { tools: [], nextCursor: null, categories: TOOL_CATEGORIES, db: false, unavailable: true });
  }
}

export async function POST(request) {
  let input;
  try {
    const body = await request.json();
    input = validateTool(body);
  } catch (error) {
    return Response.json({ error: error instanceof SyntaxError ? "invalid JSON" : error.message }, { status: 400 });
  }
  let sql;
  try { sql = getSql(); }
  catch (error) { return unavailable(error, { error: "directory database unavailable" }); }
  if (!sql) return Response.json({ error: "directory database unavailable", diagnostic: "database_not_configured" }, { status: 503 });

  try {
    // Bound the comparison to recent projects in the same category. This is a heuristic label.
    const candidates = await sql`
      select id, name, description, url, category from directory_tools
      where category = ${input.category}
      order by created_at desc, id desc limit 200
    `;
    const { carbonCopy, evidence } = detectCarbonCopy(input, candidates);
    const rows = await sql`
      insert into directory_tools (name, description, url, canonical_url, district_id, category, stack, screenshot_url, carbon_copy, carbon_copy_evidence)
      values (${input.name}, ${input.description}, ${input.url}, ${input.url}, ${input.district}, ${input.category}, ${input.stack}, ${input.screenshotUrl}, ${carbonCopy}, ${JSON.stringify(evidence)}::jsonb)
      returning id, name, description, url, district_id, category, stack, screenshot_url, carbon_copy, carbon_copy_evidence, created_at
    `;
    return Response.json({ tool: toPublicTool(rows[0]) }, { status: 201 });
  } catch (error) {
    if (error?.code === "23505") return Response.json({ error: "A project with this URL already exists" }, { status: 409 });
    return unavailable(error, { error: "directory save unavailable" });
  }
}
