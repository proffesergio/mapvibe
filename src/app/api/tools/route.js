import { getSql } from "@/lib/db";
import { detectCarbonCopy, encodeCursor, escapeLike, parseListQuery, toPublicTool, validateTool } from "@/lib/directory";

export async function GET(request) {
  let query;
  try { query = parseListQuery(new URL(request.url).searchParams); }
  catch (error) { return Response.json({ error: error.message }, { status: 400 }); }

  const sql = getSql();
  if (!sql) return Response.json({ tools: [], nextCursor: null, db: false, unavailable: true });
  try {
    const { q, category, district, stack, carbonCopy, cursor, limit } = query;
    const pattern = `%${escapeLike(q)}%`;
    const stackPattern = `%${escapeLike(stack)}%`;
    const rows = await sql`
      select id, name, description, url, district_id, category, stack, carbon_copy, carbon_copy_evidence, created_at
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
    const page = rows.slice(0, limit);
    return Response.json({ tools: page.map(toPublicTool), nextCursor: rows.length > limit ? encodeCursor(page.at(-1)) : null, db: true });
  } catch (error) {
    console.error("tools GET failed:", error);
    return Response.json({ tools: [], nextCursor: null, db: false, unavailable: true }, { status: 503 });
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
  const sql = getSql();
  if (!sql) return Response.json({ error: "directory database unavailable" }, { status: 503 });

  try {
    // Bound the comparison to recent projects in the same category. This is a heuristic label.
    const candidates = await sql`
      select id, name, description, url, category from directory_tools
      where category = ${input.category}
      order by created_at desc, id desc limit 200
    `;
    const { carbonCopy, evidence } = detectCarbonCopy(input, candidates);
    const rows = await sql`
      insert into directory_tools (name, description, url, canonical_url, district_id, category, stack, carbon_copy, carbon_copy_evidence)
      values (${input.name}, ${input.description}, ${input.url}, ${input.url}, ${input.district}, ${input.category}, ${input.stack}, ${carbonCopy}, ${JSON.stringify(evidence)}::jsonb)
      returning id, name, description, url, district_id, category, stack, carbon_copy, carbon_copy_evidence, created_at
    `;
    return Response.json({ tool: toPublicTool(rows[0]) }, { status: 201 });
  } catch (error) {
    if (error?.code === "23505") return Response.json({ error: "A project with this URL already exists" }, { status: 409 });
    console.error("tools POST failed:", error);
    return Response.json({ error: "directory save unavailable" }, { status: 503 });
  }
}
