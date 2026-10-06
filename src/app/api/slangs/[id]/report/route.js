import { getSql } from "@/lib/db";

/**
 * POST /api/slangs/:id/report — flag spam/abuse.
 * Auto-hides at 5 reports (filtered from GET). Admin unhides in Neon directly.
 */
export async function POST(request, { params }) {
  const id = (await params)?.id;
  if (!id || !/^\d+$/.test(String(id))) {
    return Response.json({ ok: true, local: true });
  }
  const sql = getSql();
  if (!sql) return Response.json({ ok: true, db: false });
  try {
    await sql`
      update slangs
      set reports = reports + 1,
          hidden = case when reports + 1 >= 5 then true else hidden end
      where id = ${Number(id)}
    `;
    return Response.json({ ok: true });
  } catch (e) {
    console.error("report failed:", e?.message);
    return Response.json({ error: "report failed" }, { status: 500 });
  }
}
