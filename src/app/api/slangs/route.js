import { SLANGS } from "@/data/slangs";
import { getSql } from "@/lib/db";

const FALLBACK = () =>
  SLANGS.map((s, i) => ({
    id: s.id,
    phrase: s.phrase,
    meaning: s.meaning,
    example: "",
    division: "",
    districtId: s.regionId,
    upazila: "",
    contributor: "mapvibe",
    upvotes: 0,
    reports: 0,
    createdAt: null,
    local: true,
    _order: i,
  }));

function toPublic(row) {
  return {
    id: String(row.id),
    phrase: row.phrase,
    meaning: row.meaning,
    example: row.example ?? "",
    division: row.division ?? "",
    districtId: row.district_id ?? "dhaka",
    upazila: row.upazila ?? "",
    contributor: row.contributor ?? "বেনামি",
    upvotes: Number(row.upvotes ?? 0),
    reports: Number(row.reports ?? 0),
    createdAt: row.created_at ?? null,
    local: false,
  };
}

/** GET /api/slangs?q=&district= — public list, hidden/report-buried rows excluded. */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim().slice(0, 60);
  const district = (searchParams.get("district") ?? "").trim().slice(0, 40);
  const sql = getSql();

  if (!sql) return Response.json({ slangs: FALLBACK(), db: false });

  try {
    const rows = await sql`
      select id, phrase, meaning, example, division, district_id, upazila,
             contributor, upvotes, reports, created_at
      from slangs
      where hidden = false and reports < 5
        ${q ? sql`and (phrase ilike ${"%" + q + "%"} or meaning ilike ${"%" + q + "%"} or upazila ilike ${"%" + q + "%"})` : sql``}
        ${district && district !== "all" ? sql`and district_id = ${district}` : sql``}
      order by upvotes desc, created_at desc
      limit 300
    `;
    return Response.json({ slangs: rows.map(toPublic), db: true });
  } catch (e) {
    console.error("slangs GET failed, fallback:", e?.message);
    return Response.json({ slangs: FALLBACK(), db: false });
  }
}

/** POST /api/slangs — instant-publish a new entry (spam-guarded lengths). */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad json" }, { status: 400 });
  }
  const phrase = String(body?.phrase ?? "").trim().slice(0, 80);
  const meaning = String(body?.meaning ?? "").trim().slice(0, 160);
  const example = String(body?.example ?? "").trim().slice(0, 200);
  const division = String(body?.division ?? "").trim().slice(0, 40);
  const districtId = String(body?.districtId ?? body?.regionId ?? "").trim().slice(0, 40) || "dhaka";
  const upazila = String(body?.upazila ?? "").trim().slice(0, 60);
  const contributor = String(body?.contributor ?? "বেনামি").trim().slice(0, 40) || "বেনামি";

  if (!phrase || !meaning) {
    return Response.json({ error: "phrase + meaning required" }, { status: 400 });
  }

  const sql = getSql();
  if (!sql) {
    // No DB configured → echo back a local-only entry so UI still works.
    return Response.json(
      {
        slang: {
          id: `local-${Date.now()}`,
          phrase,
          meaning,
          example,
          division,
          districtId,
          upazila,
          contributor,
          upvotes: 0,
          reports: 0,
          local: true,
        },
        db: false,
      },
      { status: 201 }
    );
  }

  try {
    const rows = await sql`
      insert into slangs (phrase, meaning, example, division, district_id, upazila, contributor)
      values (${phrase}, ${meaning}, ${example}, ${division}, ${districtId}, ${upazila}, ${contributor})
      returning id, phrase, meaning, example, division, district_id, upazila, contributor, upvotes, reports, created_at
    `;
    return Response.json({ slang: toPublic(rows[0]), db: true }, { status: 201 });
  } catch (e) {
    console.error("slangs POST failed:", e?.message);
    return Response.json({ error: "save failed" }, { status: 500 });
  }
}
