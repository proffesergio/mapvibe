import { getSql } from "@/lib/db";

/** POST /api/slangs/:id/vote — +1 upvote. Client dedupes via localStorage. */
export async function POST(request, { params }) {
  const id = (await params)?.id;
  if (!id || !/^\d+$/.test(String(id))) {
    return Response.json({ error: "local entry — vote stored on device only" }, { status: 202 });
  }
  const sql = getSql();
  if (!sql) return Response.json({ error: "no db" }, { status: 202 });
  try {
    const rows = await sql`
      update slangs set upvotes = upvotes + 1 where id = ${Number(id)}
      returning upvotes
    `;
    if (!rows.length) return Response.json({ error: "not found" }, { status: 404 });
    return Response.json({ upvotes: Number(rows[0].upvotes) });
  } catch (e) {
    console.error("vote failed:", e?.message);
    return Response.json({ error: "vote failed" }, { status: 500 });
  }
}
