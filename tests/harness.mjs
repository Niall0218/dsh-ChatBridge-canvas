// 在 Node 里加载 src/prelude.js + src/model.js，直接调用编译器。
// 这两个文件本来是拼进 client.js 的模块工厂片段，没有 import/export，
// 所以这里用 new Function 复现同样的作用域，并把内部函数返回出来。
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(here, "..", "src");
const read = (name) => fs.readFileSync(path.join(srcDir, name), "utf8");

const noop = () => {};
const ReactStub = {
  createElement: () => null,
  useState: (value) => [value, noop],
  useEffect: noop,
  useRef: (value) => ({ current: value }),
  useMemo: (factory) => factory(),
  useCallback: (fn) => fn,
  useSyncExternalStore: () => undefined,
};

const chunks = ["prelude.js", "afc.js", "model.js"].map(read).join("\n");
const factory = new Function(
  "require",
  `${chunks}
return {
  normalizeGraph, normalizeNode, buildDigest, buildDigestRaw: buildDigest,
  compileContext, estimateTokens, fenceFor, sourceOptions, incomingEdges,
  readSessionMessages, truncate, isNoiseMessage, pickWorkspace, sessionSummaryMap,
};`,
);

export const lib = factory((name) => (name === "react" ? ReactStub : undefined));

export function makeApi(options) {
  const opts = options || {};
  return {
    ctx: {
      sessions: {
        using: async (sessionId, _opts, run) => {
          if (typeof opts.sessionUsing === "function") return opts.sessionUsing(sessionId, run);
          throw new Error("会话不可用：" + sessionId);
        },
      },
    },
    sessionsSnapshot: () => opts.sessionsSnapshot || { ids: [], byId: {} },
    workspacesSnapshot: () => opts.workspacesSnapshot || { items: [] },
    async readDigest() {
      throw new Error("not used");
    },
    async readWorkspaceFile() {
      throw new Error("not used");
    },
  };
}

// 把一串消息包成 readSessionMessages 期望的 eventSource 快照。
export function sessionEntries(messages) {
  return messages.map((message, index) => ({
    type: "event",
    event: {
      type: message.role === "user" ? "user/message" : "assistant/message",
      seq: index + 1,
      data: message.role === "user"
        ? { content: [{ type: "text", text: message.text }] }
        : { message: { content: [{ type: "text", text: message.text }] } },
    },
  }));
}

export function graphWith(nodes, edges) {
  return lib.normalizeGraph({
    version: 1,
    id: "canvas-test",
    name: "测试画布",
    nodes: nodes || [],
    edges: edges || [],
    viewport: { x: 0, y: 0, scale: 1 },
  });
}

export function chatNode(id) {
  return {
    id: id || "chat-1",
    type: "chat",
    x: 800,
    y: 100,
    data: { title: "新对话", instruction: "", workspaceId: "", status: "idle", resultSessionId: "" },
  };
}

export function convNode(id, digest, extra) {
  return {
    id,
    type: "conversation",
    x: 60,
    y: 100,
    data: Object.assign({
      sessionId: "session-" + id,
      title: "对话 " + id,
      cwd: "F:\\demo",
      includeMode: "digest",
      digest,
      digestAt: 1790000000000,
      messageCount: 6,
    }, extra || {}),
  };
}

export function fileNode(id, options) {
  return {
    id,
    type: "file",
    x: 60,
    y: 300,
    data: Object.assign({
      path: "F:\\demo\\notes.md",
      name: "notes.md",
      includeMode: "inline",
      content: "",
      contentAt: 1790000000000,
      size: 0,
    }, options || {}),
  };
}

export function promptNode(id, text) {
  return { id, type: "prompt", x: 60, y: 500, data: { text } };
}

export function edge(id, from, to, order, enabled) {
  return { id, from, to, kind: "context", enabled: enabled !== false, order };
}

// 提取编译结果里的来源标题顺序。
export function sourceHeadings(text) {
  return String(text)
    .split("\n")
    .filter((line) => line.startsWith("### 来源 "))
    .map((line) => line.trim());
}
