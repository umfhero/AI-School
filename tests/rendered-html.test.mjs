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
  assert.match(html, /AI Free Course/i);
  assert.match(html, /Start chapter one/i);
  assert.doesNotMatch(html, /Your route/i);
});

test("server-renders the context rot lesson workspace", async () => {
  const response = await render("/course/basics/context-rot");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Your AI did not get worse/i);
  assert.match(html, /NO SOURCE OF TRUTH/i);
  assert.match(html, /Useful attention/i);
  assert.match(html, /overview\.md/i);
  assert.match(html, /Course contents/i);
  assert.match(html, /Learning objectives/i);
  assert.match(html, /TASK 01/i);
  assert.match(html, /Next lesson/i);
});
