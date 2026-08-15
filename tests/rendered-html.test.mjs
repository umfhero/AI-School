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
  assert.match(html, /CONTEXT PRESSURE/i);
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
  assert.match(html, /An assistant that works at speed/i);
  assert.match(html, /AI WORKBENCH/i);
  assert.match(html, /created-vs-used\.png/i);
  assert.match(html, /href="https:\/\/chatgpt\.com\//i);
  assert.match(html, /href="https:\/\/claude\.ai\//i);
  assert.match(html, /href="https:\/\/gemini\.google\.com\//i);
  assert.match(html, /href="https:\/\/code\.visualstudio\.com\//i);
  assert.match(html, /href="https:\/\/www\.cursor\.com\//i);
  assert.match(html, /TASK 01 · MATCH THE SETUPS/i);
  assert.match(html, /TASK 02 · ORDER THE SETUPS/i);
  assert.match(html, /lesson-save-chip/i);
  assert.doesNotMatch(html, /progress-save-state/i);
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
  assert.match(html, /COURSE MAP/i);
  assert.match(html, /lesson-save-chip/i);
  assert.doesNotMatch(html, /progress-save-state/i);
  assert.match(html, /Complete introduction/i);
  assert.match(html, /500 XP/i);
  assert.doesNotMatch(html, /TASK 01/i);
});

test("server-renders the project brain lesson", async () => {
  const response = await render("/course/basics/project-brain");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Your project brain/i);
  assert.match(html, /Six questions the file has to answer/i);
  assert.match(html, /PROJECT MEMORY/i);
  assert.match(html, /TASK 01 · PICK THE FACTS/i);
  assert.match(html, /TASK 03 · CHECK YOUR FILE/i);
  assert.match(html, /not saved to your account/i);
  assert.match(html, /Read your own file the way a stranger would/i);
});

test("server-renders the files and handovers lesson", async () => {
  const response = await render("/course/basics/files-handovers");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Files and handovers/i);
  assert.match(html, /Give each kind of information a home/i);
  assert.match(html, /HANDOVER VIEWER/i);
  assert.match(html, /TASK 03 · WRITE A HANDOVER/i);
  assert.match(html, /not sent to your account/i);
  assert.match(html, /Next lesson/i);
});

test("server-renders the clean first workflow lesson", async () => {
  const response = await render("/course/basics/clean-workflow");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /A clean first workflow/i);
  assert.match(html, /Lesson 01\.5/i);
  assert.match(html, /Define, give context, change, check, record/i);
  assert.match(html, /CLEAN WORKFLOW/i);
  assert.match(html, /Slower at the start, faster than a repair/i);
  assert.match(html, /CHAPTER QUIZ · TRUE OR FALSE/i);
  assert.match(html, /Course contents/i);
  assert.doesNotMatch(html, /Chapter 2 is ready when you are/i);
});

test("server-renders the first models lesson", async () => {
  const response = await render("/course/models/what-changes");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /What models change/i);
  assert.match(html, /Lesson 02\.1/i);
  assert.match(html, /A model is the engine inside an AI tool/i);
  assert.match(html, /MODEL FACTORS/i);
  assert.match(html, /Artificial Analysis/i);
  assert.match(html, /LLM Stats/i);
  assert.match(html, /TASK 01 · MATCH THE STRENGTH/i);
  assert.match(html, /Open and closed models/i);
  assert.match(html, /LIVE MODEL DATA/i);
  assert.match(html, /Loading current model measurements/i);
  assert.match(html, /Open task/i);
  assert.match(html, /Connect each request to the first strength/i);
  assert.match(html, /Next lesson/i);
});

test("server-renders the model decision lessons", async () => {
  const speed = await render("/course/models/speed-cost-reasoning");
  assert.equal(speed.status, 200);
  const speedHtml = await speed.text();
  assert.match(speedHtml, /02\.2/i);
  assert.match(speedHtml, /DECISION CONSOLE/i);
  assert.match(speedHtml, /model-training-cost\.jpg/i);
  assert.match(speedHtml, /TASK 03 · MATCH THE CONSEQUENCE/i);
  assert.match(speedHtml, /href="\/course\/models\/context-windows"/i);

  const context = await render("/course/models/context-windows");
  assert.equal(context.status, 200);
  const contextHtml = await context.text();
  assert.match(contextHtml, /02\.3/i);
  assert.match(contextHtml, /CONTEXT VIEWER/i);
  assert.match(contextHtml, /transformer-attention\.jpg/i);
  assert.match(contextHtml, /TASK 03 · CLEAR AND RELOAD/i);
  assert.match(contextHtml, /href="\/course\/models\/simple-model-test"/i);

  const modelTest = await render("/course/models/simple-model-test");
  assert.equal(modelTest.status, 200);
  const modelTestHtml = await modelTest.text();
  assert.match(modelTestHtml, /02\.4/i);
  assert.match(modelTestHtml, /MODEL TEST BENCH/i);
  assert.match(modelTestHtml, /ai-benchmark-performance\.png/i);
  assert.match(modelTestHtml, /TASK 03 · RECORD THE DECISION/i);
  assert.match(modelTestHtml, /Return to course/i);
});

test("publishes crawl and AI-discovery files for the active host", async () => {
  const robots = await render("/robots.txt");
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /User-agent: OAI-SearchBot/i);

  const sitemap = await render("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  const sitemapText = await sitemap.text();
  assert.match(sitemapText, /http:\/\/localhost\/course\/basics\/context-rot/);
  assert.match(sitemapText, /http:\/\/localhost\/course\/models\/what-changes/);
  assert.match(sitemapText, /http:\/\/localhost\/course\/models\/speed-cost-reasoning/);
  assert.match(sitemapText, /http:\/\/localhost\/course\/models\/context-windows/);
  assert.match(sitemapText, /http:\/\/localhost\/course\/models\/simple-model-test/);

  const llms = await render("/llms.txt");
  assert.equal(llms.status, 200);
  const llmsText = await llms.text();
  assert.match(llmsText, /A free, visual course/i);
  assert.match(llmsText, /What models change/i);
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
