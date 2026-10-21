import test from "node:test";
import assert from "node:assert/strict";
import { lib } from "./harness.mjs";

const messages = [
  { role: "user", text: "旧方案是 24 小时，回源成本大约能降一半。", turn: 1 },
  { role: "assistant", text: "24 小时不满足 P95 ≤ 10 分钟；14:16 补齐 edge-3 的证书链，回滚无法修复。", turn: 1 },
  { role: "user", text: "如果 P95 ≤ 10 分钟，还会坚持 24 小时吗？", turn: 2 },
];

test("AFC digest keeps tier-A anchors and reads like prose", () => {
  const digest = lib.buildDigest(messages, "digest");
  assert.ok(digest.length > 40);
  assert.ok(digest.includes("24"));
  assert.ok(digest.includes("P95"));
  assert.ok(digest.includes("14:16") || digest.includes("edge-3"));
  assert.ok(!digest.includes("undefined"));
});

test("AFC digest does not silently return an empty string", () => {
  assert.equal(lib.buildDigest([], "digest"), "");
  assert.ok(lib.buildDigest([{ role: "user", text: "只有一个目标：把 P95 压到 10 分钟。" }], "digest").includes("P95"));
});

test("full digest keeps the original user wording", () => {
  const full = lib.buildDigest(messages, "full");
  assert.ok(full.includes("旧方案"));
  assert.ok(full.includes("回滚无法修复"));
});

test("digest_excerpts can add key excerpts without losing anchors", () => {
  const long = messages.concat([
    { role: "assistant", text: "这是一段较长的关键原文，用来验证摘要在 excerpt 模式下仍然保留锚点 24 小时与 P95 ≤ 10 分钟，并且不会把原文完全丢掉。".repeat(4) },
  ]);
  const digest = lib.buildDigest(long, "digest_excerpts");
  assert.ok(digest.includes("24"));
  assert.ok(digest.includes("P95"));
});
