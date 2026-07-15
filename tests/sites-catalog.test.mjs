import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const catalog = await readFile(new URL("../public/catalog.html", import.meta.url), "utf8");
const report = JSON.parse(
  await readFile(new URL("../public/sites-assets-report.json", import.meta.url), "utf8"),
);

test("cloud catalog contains the complete dataset", () => {
  assert.match(catalog, /const ITEMS=\[/);
  assert.match(catalog, /"total":1699/);
  assert.match(catalog, /const I18N=/);
});

test("cloud catalog has Chinese and English controls", () => {
  assert.match(catalog, /Codex 插件与应用中文导航/);
  assert.match(catalog, /Codex Plugins & Apps Directory/);
  assert.match(catalog, /id="languageToggle"/);
});

test("embedded images were extracted into static assets", () => {
  assert.doesNotMatch(catalog, /data:image\//);
  assert.ok(report.uniqueDataImages > 1400);
  assert.ok(report.optimizedImageBytes < report.originalImageBytes);
});

test("deployment entry point exists", async () => {
  const worker = await stat(new URL("../dist/server/index.js", import.meta.url));
  assert.ok(worker.size > 0);
});
