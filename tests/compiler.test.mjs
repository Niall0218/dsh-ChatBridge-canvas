import test from "node:test";
import assert from "node:assert/strict";
import {
  lib, makeApi, sessionEntries, graphWith, chatNode, convNode,
  fileNode, promptNode, edge, sourceHeadings,
} from "./harness.mjs";

const FENCE = String.fromCharCode(96).repeat(3);
const FENCE_LONG = String.fromCharCode(96).repeat(4);

test("normalizeGraph drops duplicate/invalid nodes and edges, clamps viewport", () => {
  const graph = lib.normalizeGraph({
    id: "c",
    name: "t",
    viewport: { x: null, y: "10", scale: 99 },
    nodes: [
      { id: "a", type: "conversation", x: 1, y: 2, data: {} },
      { id: "a", type: "file", x: 9, y: 9, data: {} },
      { id: "b", type: "unknown", data: {} },
      { id: "c", type: "prompt", data: { text: "x" } },
    ],
    edges: [
      { from: "a", to: "c" },
      { from: "a", to: "c" },
      { from: "b", to: "b" },
      { from: "a", to: "missing" },
      { from: "a", to: "b", enabled: false, order: 2 },
    ],
  });
  assert.equal(graph.nodes.length, 3);
  assert.equal(graph.nodes.find((n) => n.id === "b").type, "conversation");
  assert.equal(graph.edges.length, 2);
  assert.equal(graph.edges.find((e) => e.to === "b").enabled, false);
  assert.equal(graph.viewport.x, 48);
  assert.equal(graph.viewport.y, 48);
  assert.equal(graph.viewport.scale, 2.5);
});

test("compileContext respects edge order, disabled sources, file inline, and prompts", async () => {
  const graph = graphWith([
    convNode("c1", "**目标**：A\n**决定**：B", { title: "对话一" }),
    fileNode("f1", {
      path: "F:\\demo\\a.html",
      name: "a.html",
      includeMode: "inline",
      content: "<!DOCTYPE html><html></html>",
    }),
    promptNode("p1", "请输出方案"),
    chatNode("ch"),
  ], [
    edge("e1", "f1", "ch", 1, true),
    edge("e2", "c1", "ch", 2, true),
    edge("e3", "p1", "ch", 3, false),
  ]);
  const api = makeApi({
    sessionsSnapshot: { byId: { "session-c1": { id: "session-c1", title: "对话一", cwd: "F:\\demo", updatedAt: 1 } } },
  });
  const result = await lib.compileContext(api, graph, graph.nodes.find((n) => n.id === "ch"), {});
  assert.equal(result.stats.conversations, 1);
  assert.equal(result.stats.files, 1);
  assert.equal(result.stats.prompts, 0);
  assert.equal(result.stats.disabled, 1);
  assert.ok(result.stats.chars > 0);
  assert.ok(result.stats.tokens > 0);
  const headings = sourceHeadings(result.text);
  assert.equal(headings.length, 2);
  assert.ok(headings[0].includes("文件"));
  assert.ok(headings[1].includes("历史对话"));
  assert.ok(result.text.includes("<!DOCTYPE html>"));
  assert.ok(result.text.includes("**目标**：A"));
  assert.ok(!result.text.includes("请输出方案"));
});

test("compileContext uses path reference when content is absent and keeps prompt order", async () => {
  const graph = graphWith([
    convNode("c1", "digest"),
    fileNode("f1", { includeMode: "reference", content: "", path: "F:\\demo\\notes.md", name: "notes.md" }),
    promptNode("p1", "第一优先任务"),
    chatNode("ch"),
  ], [
    edge("e1", "p1", "ch", 1, true),
    edge("e2", "f1", "ch", 2, true),
    edge("e3", "c1", "ch", 3, true),
  ]);
  const api = makeApi();
  const result = await lib.compileContext(api, graph, graph.nodes.find((n) => n.id === "ch"), {});
  const headings = sourceHeadings(result.text);
  assert.equal(headings.length, 3);
  assert.ok(headings[0].includes("任务要求"));
  assert.ok(headings[1].includes("文件"));
  assert.ok(headings[2].includes("历史对话"));
  assert.ok(result.text.includes('@"F:\\demo\\notes.md"'));
  assert.ok(!result.text.includes("第一优先任务\n\n" + FENCE));
});

test("fenceFor picks a fence longer than the content", () => {
  assert.equal(lib.fenceFor("plain"), FENCE);
  assert.equal(lib.fenceFor("a" + FENCE + "b"), FENCE_LONG);
  assert.equal(lib.fenceFor("a" + FENCE_LONG + "b"), FENCE_LONG + String.fromCharCode(96));
});

test("estimateTokens handles CJK and ASCII", () => {
  assert.ok(lib.estimateTokens("你好世界") >= 4);
  assert.ok(lib.estimateTokens("hello world") > 0);
  assert.equal(lib.estimateTokens(""), 0);
});

test("readSessionMessages filters runtime-context noise", async () => {
  const entries = sessionEntries([
    { role: "user", text: "Current runtime context. This must be ignored." },
    { role: "user", text: "真实问题" },
    { role: "assistant", text: "真实回答" },
  ]);
  const api = makeApi({
    sessionUsing: async (id, run) => run({
      binding: { session: { eventSource: { getSnapshot: () => ({ entries, hasMore: false }) } } },
    }),
  });
  const messages = await lib.readSessionMessages(api.ctx, "s1", undefined);
  assert.equal(messages.length, 2);
  assert.equal(messages[0].text, "真实问题");
  assert.equal(messages[1].role, "assistant");
});

test("pickWorkspace prefers the workspace containing the session cwd", () => {
  const workspace = lib.pickWorkspace(
    { items: [{ workspaceId: "w1", path: "/a" }, { workspaceId: "w2", path: "/b" }] },
    { byId: { s1: { id: "s1", cwd: "/b" } } },
    "s1",
  );
  assert.equal(workspace.workspaceId, "w2");
});
