import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the course home page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Build serious projects with AI/i);
  assert.match(html, /Cloudflare/i);
  assert.match(html, /AI school/i);
  assert.match(html, /Start course/i);
  assert.match(html, /starter lesson is ready/i);
  assert.match(html, /signed up/i);
  assert.match(html, /href="\/privacy"/i);
  assert.match(html, /href="\/terms"/i);
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.doesNotMatch(html, /26<\/b><small>lessons/i);
});

test("server-renders the single starter lesson and its full shell", async () => {
  const response = await render("/course/chapter-1/lesson-1");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /A clean starting point/i);
  assert.match(html, /Images should do a job/i);
  assert.match(html, /model-training-cost\.jpg/i);
  assert.match(html, /EXAMPLE IMAGE/i);
  assert.match(html, /aiindex\.stanford\.edu\/report/i);
  assert.match(html, /Tasks should stay with the lesson/i);
  assert.match(html, /EXAMPLE TASK/i);
  assert.match(html, /When does an image earn its place/i);
  assert.match(html, /Check answer/i);
  assert.doesNotMatch(html, /Open task|lesson-task-panel/i);
  assert.match(html, /TEMPLATE REVIEW/i);
  assert.match(html, /Course contents/i);
  assert.doesNotMatch(html, /COURSE RESET/i);
  assert.doesNotMatch(html, /<h1[^>]*>\s*Lesson one/i);
  assert.match(html, /sidebar-toggle/i);
  assert.match(html, /id="course-contents"/i);
  assert.match(html, /lesson-pointer-layer/i);
  assert.match(html, /lesson-save-chip/i);
  assert.match(html, /lesson-bottom/i);
  assert.match(html, /Complete the task above/i);
  assert.match(html, /Return to course/i);
  assert.doesNotMatch(html, /Your project brain/i);
  assert.doesNotMatch(html, /Chapter 02/i);
  assert.doesNotMatch(html, /TASK 01/i);
});

test("retires every route from the previous curriculum", async () => {
  const retiredRoutes = [
    "/course/intro",
    "/course/basics/ai",
    "/course/basics/context-rot",
    "/course/basics/project-brain",
    "/course/basics/files-handovers",
    "/course/basics/clean-workflow",
    "/course/models/what-changes",
    "/course/models/speed-cost-reasoning",
    "/course/models/context-windows",
    "/course/models/simple-model-test",
  ];
  for (const path of retiredRoutes) {
    const response = await render(path);
    assert.equal(response.status, 404, `${path} should be retired`);
  }
});

test("publishes crawl and AI-discovery files for only the live lesson", async () => {
  const robots = await render("/robots.txt");
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /User-agent: OAI-SearchBot/i);

  const sitemap = await render("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  const sitemapText = await sitemap.text();
  assert.match(sitemapText, /http:\/\/localhost\/course\/chapter-1\/lesson-1/);
  assert.doesNotMatch(sitemapText, /course\/basics|course\/models|course\/intro/);

  const llms = await render("/llms.txt");
  assert.equal(llms.status, 200);
  const llmsText = await llms.text();
  assert.match(llmsText, /A free, visual course/i);
  assert.match(llmsText, /Lesson one/i);
  assert.doesNotMatch(llmsText, /What models change|Context rot|six chapters/i);
});

test("server-renders the privacy and terms pages", async () => {
  const privacy = await render("/privacy");
  assert.equal(privacy.status, 200);
  assert.match(await privacy.text(), /What we collect/i);

  const terms = await render("/terms");
  assert.equal(terms.status, 200);
  assert.match(await terms.text(), /Terms of use/i);
});

test("server-renders the notifications inbox", async () => {
  const page = await render("/notifications");
  assert.equal(page.status, 200);
  assert.match(await page.text(), /Notifications/i);
});

test("routes team contact through a non-indexed compose link", async () => {
  const response = await render("/contact");
  assert.equal(response.status, 302);
  assert.match(response.headers.get("location") ?? "", /^https:\/\/mail\.google\.com\/mail\//);
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
});
