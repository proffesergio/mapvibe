/**
 * Same-origin avatar proxy so html-to-image can embed OAuth profile
 * photos (Google/FB URLs lack CORS headers → tainted canvas otherwise).
 * Only allows images, capped at ~5MB, cached at the edge.
 */
export async function GET(request) {
  const target = new URL(request.url).searchParams.get("url") ?? "";
  let parsed;
  try {
    parsed = new URL(target);
  } catch {
    return Response.json({ error: "bad url" }, { status: 400 });
  }
  if (parsed.protocol !== "https:") {
    return Response.json({ error: "https only" }, { status: 400 });
  }
  const allowed = ["googleusercontent.com", "fbcdn.net", "facebook.com", "fbsbx.com", "cdninstagram.com"];
  if (!allowed.some((h) => parsed.hostname === h || parsed.hostname.endsWith(`.${h}`))) {
    return Response.json({ error: "host not allowed" }, { status: 403 });
  }

  const upstream = await fetch(parsed.toString(), { redirect: "follow" });
  if (!upstream.ok) return Response.json({ error: "fetch failed" }, { status: 502 });
  const type = upstream.headers.get("content-type") ?? "";
  if (!type.startsWith("image/")) return Response.json({ error: "not an image" }, { status: 415 });

  const buf = await upstream.arrayBuffer();
  if (buf.byteLength > 5 * 1024 * 1024) return Response.json({ error: "too large" }, { status: 413 });

  return new Response(buf, {
    headers: {
      "content-type": type,
      "cache-control": "public, max-age=86400",
    },
  });
}
