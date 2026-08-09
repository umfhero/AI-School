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
  assert.match(html, /signed up/i);
  assert.match(html, /href="\/privacy"/i);
  assert.match(html, /href="\/terms"/i);
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.doesNotMatch(html, /Your route/i);
});

test("server-renders the context rot lesson workspace", async () => {
  const response = await render("/course/basics/context-rot");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Context rot\./i);
  assert.match(html, /Lesson 01\.2/i);
  assert.match(html, /One topic slowly becomes one crowded chat/i);
  assert.match(html, /Repeated Words/i);
  assert.match(html, /context-rot-repeated-words\.png/i);
  assert.match(html, /href="https:\/\/chatgpt\.com\//i);
  assert.match(html, /href="https:\/\/claude\.ai\//i);
  assert.match(html, /href="https:\/\/gemini\.google\.com\//i);
  assert.match(html, /Open original figure/i);
  assert.match(html, /overview\.md/i);
  assert.match(html, /Course contents/i);
  assert.match(html, /TASK 01 · FIND THE DRIFT/i);
  assert.match(html, /Open task/i);
  assert.match(html, /please suggest a recipe/i);
  assert.match(html, /Next lesson/i);
  assert.match(html, /(?:class="lesson-home-back"[^>]*href="\/"|href="\/"[^>]*class="lesson-home-back")/i);
  assert.doesNotMatch(html, /KEEP THIS STRAIGHT/i);
  assert.doesNotMatch(html, /LESSON 01\.1/i);
  assert.doesNotMatch(html, /Illustrative conversation/i);
});

test("server-renders the AI introduction lesson", async () => {
  const response = await render("/course/basics/ai");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /AI\?/i);
  assert.match(html, /Lesson 01\.1/i);
  assert.match(html, /A helpful assistant, not a magic box/i);
  assert.match(html, /created-vs-used\.png/i);
  assert.match(html, /href="https:\/\/chatgpt\.com\//i);
  assert.match(html, /href="https:\/\/claude\.ai\//i);
  assert.match(html, /href="https:\/\/gemini\.google\.com\//i);
  assert.match(html, /href="https:\/\/code\.visualstudio\.com\//i);
  assert.match(html, /href="https:\/\/www\.cursor\.com\//i);
  assert.match(html, /TASK 01 · MATCH THE SETUPS/i);
  assert.match(html, /TASK 02 · ORDER THE SETUPS/i);
  assert.match(html, /Context rot/i);
});

test("server-renders the course introduction", async () => {
  const response = await render("/course/intro");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Learn to work with AI, without losing the thread/i);
  assert.match(html, /For curious beginners who want a calmer way to build/i);
  assert.match(html, /AI is stupid, even when it sounds confident/i);
  assert.match(html, /five trillion searches a year/i);
  assert.match(html, /Six chapters, one connected workflow/i);
  assert.match(html, /Complete introduction/i);
  assert.match(html, /500 XP/i);
  assert.doesNotMatch(html, /TASK 01/i);
});

test("publishes crawl and AI-discovery files for the active host", async () => {
  const robots = await render("/robots.txt");
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /User-agent: OAI-SearchBot/i);

  const sitemap = await render("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  assert.match(await sitemap.text(), /http:\/\/localhost\/course\/basics\/context-rot/);

  const llms = await render("/llms.txt");
  assert.equal(llms.status, 200);
  assert.match(await llms.text(), /A free, visual course/i);
});

test("server-renders the privacy and terms pages", async () => {
  const privacy = await render("/privacy");
  assert.equal(privacy.status, 200);
  assert.match(await privacy.text(), /What we collect/i);

  const terms = await render("/terms");
  assert.equal(terms.status, 200);
  assert.match(await terms.text(), /Terms of use/i);
});

test("routes team contact through a non-indexed compose link", async () => {
  const response = await render("/contact");
  assert.equal(response.status, 302);
  assert.match(response.headers.get("location") ?? "", /^https:\/\/mail\.google\.com\/mail\//);
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
});
