// One-off: GADM level-2 (districts) GeoJSON -> simplified projected SVG paths.
// Run: node scripts/build-geo.mjs
import { readFileSync, writeFileSync } from "node:fs";

const NAME_TO_ID = {
  Barguna: "barguna", Barisal: "barishal", Bhola: "bhola", Jhalokati: "jhalokathi",
  Patuakhali: "patuakhali", Pirojpur: "pirojpur", Bandarban: "bandarban",
  Brahamanbaria: "brahmanbaria", Chandpur: "chandpur", Chittagong: "chattogram",
  Comilla: "cumilla", "Cox'SBazar": "coxsbazar", Feni: "feni", Khagrachhari: "khagrachhari",
  Lakshmipur: "lakshmipur", Noakhali: "noakhali", Rangamati: "rangamati", Dhaka: "dhaka",
  Faridpur: "faridpur", Gazipur: "gazipur", Gopalganj: "gopalganj", Kishoreganj: "kishoreganj",
  Madaripur: "madaripur", Manikganj: "manikganj", Munshiganj: "munshiganj",
  Narayanganj: "narayanganj", Narsingdi: "narsingdi", Rajbari: "rajbari",
  Shariatpur: "shariatpur", Tangail: "tangail", Bagerhat: "bagerhat", Chuadanga: "chuadanga",
  Jessore: "jashore", Jhenaidah: "jhenaidah", Khulna: "khulna", Kushtia: "kushtia",
  Magura: "magura", Meherpur: "meherpur", Narail: "narail", Satkhira: "satkhira",
  Jamalpur: "jamalpur", Mymensingh: "mymensingh", Netrakona: "netrokona", Sherpur: "sherpur",
  Bogra: "bogura", Joypurhat: "joypurhat", Naogaon: "naogaon", Natore: "natore",
  Nawabganj: "chapainawabganj", Pabna: "pabna", Rajshahi: "rajshahi", Sirajganj: "sirajganj",
  Dinajpur: "dinajpur", Gaibandha: "gaibandha", Kurigram: "kurigram",
  Lalmonirhat: "lalmonirhat", Nilphamari: "nilphamari", Panchagarh: "panchagarh",
  Rangpur: "rangpur", Thakurgaon: "thakurgaon", Habiganj: "habiganj",
  Maulvibazar: "moulvibazar", Sunamganj: "sunamganj", Sylhet: "sylhet",
};

// Equirectangular-ish projection tuned for Bangladesh
const K = 100;
const LON0 = 88.0;
const LAT0 = 26.8;
const KX = Math.cos(23.7 * (Math.PI / 180));
const px = (lon) => (lon - LON0) * KX * K;
const py = (lat) => (LAT0 - lat) * K;

const r1 = (n) => Math.round(n * 10) / 10;

// Douglas-Peucker on [x,y] points
function dp(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Array(pts.length).fill(false);
  keep[0] = keep[pts.length - 1] = true;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let maxD = 0;
    let idx = -1;
    const [ax, ay] = pts[a];
    const [bx, by] = pts[b];
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy) || 1;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs((pts[i][0] - ax) * dy - (pts[i][1] - ay) * dx) / len;
      if (d > maxD) {
        maxD = d;
        idx = i;
      }
    }
    if (maxD > tol) {
      keep[idx] = true;
      stack.push([a, idx], [idx, b]);
    }
  }
  return pts.filter((_, i) => keep[i]);
}

function ringPath(ring, tol) {
  let pts = ring.map(([lon, lat]) => [px(lon), py(lat)]);
  // Closed ring: drop the duplicate closing point so DP has a real chord.
  if (pts.length > 1) {
    const [fx, fy] = pts[0];
    const [lx, ly] = pts[pts.length - 1];
    if (Math.hypot(lx - fx, ly - fy) < 1e-9) pts = pts.slice(0, -1);
  }
  const s = dp(pts, tol);
  if (s.length < 3) return "";
  return "M" + s.map(([x, y]) => `${r1(x)},${r1(y)}`).join("L") + "Z";
}

const geo = JSON.parse(readFileSync("C:/Users/bhnbi/AppData/Local/Temp/opencode/bgd2.json", "utf8"));

const out = { width: 0, height: 0, districts: [] };
let maxX = 0;
let maxY = 0;

for (const f of geo.features) {
  const id = NAME_TO_ID[f.properties.NAME_2];
  if (!id) {
    console.error("UNMAPPED:", f.properties.NAME_2);
    continue;
  }
  const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  // keep rings with >= 4 points after simplification; drop tiny specks
  const parts = [];
  let best = null;
  let bestArea = 0;
  for (const poly of polys) {
    for (const ring of poly) {
      if (ring.length < 4) continue;
      const d = ringPath(ring, 0.35);
      if (!d) continue;
      // rough area via bbox to find main ring for centroid
      let x0 = 1e9;
      let y0 = 1e9;
      let x1 = -1e9;
      let y1 = -1e9;
      for (const [lon, lat] of ring) {
        const x = px(lon);
        const y = py(lat);
        if (x < x0) x0 = x;
        if (y < y0) y0 = y;
        if (x > x1) x1 = x;
        if (y > y1) y1 = y;
      }
      const area = (x1 - x0) * (y1 - y0);
      if (area > bestArea) {
        bestArea = area;
        best = [(x0 + x1) / 2, (y0 + y1) / 2];
      }
      if (area > 4) parts.push(d); // drop sub-pixel islands
      if (x1 > maxX) maxX = x1;
      if (y1 > maxY) maxY = y1;
    }
  }
  out.districts.push({ id, d: parts.join(""), cx: r1(best[0]), cy: r1(best[1]) });
}

out.width = Math.ceil(maxX);
out.height = Math.ceil(maxY);
out.districts.sort((a, b) => a.id.localeCompare(b.id));

const json = JSON.stringify(out);
writeFileSync("src/data/bd-geo.json", json);
console.log("districts:", out.districts.length, "size:", json.length, "viewBox: 0 0", out.width, out.height);
