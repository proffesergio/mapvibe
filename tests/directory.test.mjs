import test from "node:test";
import assert from "node:assert/strict";
import { canonicalUrl, detectCarbonCopy, encodeCursor, parseListQuery, validateTool } from "../src/lib/directory.js";

const project = {
  name: "Bangla Notes", description: "A shared note workspace for Bengali study groups.",
  url: "https://notes.example.org/", district: "dhaka", category: "Education", stack: ["React", "Postgres"],
};

test("validates a project using known district IDs and category", () => {
  assert.deepEqual(validateTool(project), project);
  assert.throws(() => validateTool({ ...project, district: "made-up" }), /district/);
  assert.throws(() => validateTool({ ...project, category: "Games" }), /category/);
  assert.throws(() => validateTool({ ...project, stack: ["React", "react"] }), /unique/);
});

test("canonicalizes URLs and rejects local or credentialed targets", () => {
  assert.equal(canonicalUrl("HTTPS://Example.COM/path/?utm_source=x&b=2&a=1#team"), "https://example.com/path?a=1&b=2");
  for (const url of ["http://localhost:3000", "http://127.0.0.1", "https://user:pass@example.com", "file:///tmp/tool", "https://service.local"]) {
    assert.throws(() => canonicalUrl(url), /public HTTP/);
  }
});

test("carbon copy hint requires same category and meaningful token similarity", () => {
  const candidate = { id: 9, name: "Bangla Notes", description: project.description, url: "https://other.org", category: "Education" };
  const result = detectCarbonCopy({ ...project, url: "https://new.org" }, [candidate]);
  assert.equal(result.carbonCopy, true);
  assert.equal(result.evidence.matchedToolId, "9");
  assert.ok(result.evidence.sharedNameTokens.includes("bangla"));
  assert.equal(detectCarbonCopy({ ...project, category: "Design" }, [candidate]).carbonCopy, false);
  assert.equal(detectCarbonCopy({ ...project, name: "Physics Tutor", description: "Interactive lessons for undergraduate physics learners." }, [candidate]).carbonCopy, false);
});

test("pagination cursors round trip and invalid filters fail", () => {
  const cursor = encodeCursor({ id: 42, created_at: "2026-01-01T00:00:00.000Z" });
  const parsed = parseListQuery(new URLSearchParams({ cursor, category: "Education", district: "dhaka", limit: "10" }));
  assert.deepEqual(parsed.cursor, { id: "42", createdAt: "2026-01-01T00:00:00.000Z" });
  assert.equal(parsed.limit, 10);
  assert.throws(() => parseListQuery(new URLSearchParams({ cursor: "broken" })), /cursor/);
  assert.throws(() => parseListQuery(new URLSearchParams({ limit: "500" })), /limit/);
});

test("stack and Carbon Copy filters are validated before pagination", () => {
  const result = parseListQuery(new URLSearchParams({ stack: "React", carbonCopy: "true" }));
  assert.equal(result.stack, "React");
  assert.equal(result.carbonCopy, true);
  assert.throws(() => parseListQuery(new URLSearchParams({ stack: "x".repeat(41) })), /stack/);
});

test("similar descriptions can flag a renamed concept", () => {
  const candidate = { ...project, id: 5, name: "Study Together", url: "https://another.org/" };
  assert.equal(detectCarbonCopy(project, [candidate]).carbonCopy, true);
});
