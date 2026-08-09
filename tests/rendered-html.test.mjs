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
  assert.match(html, /Start chapter one/i);
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
