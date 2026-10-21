const TICK = String.fromCharCode(96);
const FENCE = TICK.repeat(3);
const FENCE_LONG = TICK.repeat(4);

function emptyGraph() {
  return {
    version: 1,
    id: uid("canvas"),
    name: "未命名画布",
    nodes: [],
    edges: [],
    viewport: { x: 48, y: 48, scale: 1 },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function normalizeNode(raw) {
  if (!raw || typeof raw !== "object") return undefined;
  const type = Object.prototype.hasOwnProperty.call(SIZES, raw.type) ? raw.type : "conversation";
  const data = raw.data && typeof raw.data === "object" ? raw.data : {};
  const base = {
    id: typeof raw.id === "string" && raw.id !== "" ? raw.id : uid(type),
    type,
    x: Number.isFinite(Number(raw.x)) ? Number(raw.x) : 80,
    y: Number.isFinite(Number(raw.y)) ? Number(raw.y) : 80,
    data: {},
  };
  if (type === "conversation") {
    base.data = {
      sessionId: String(data.sessionId || ""),
      title: String(data.title || "未命名对话"),
      cwd: String(data.cwd || ""),
      includeMode: ["digest", "digest_excerpts", "full"].includes(data.includeMode) ? data.includeMode : "digest",
      digest: String(data.digest || ""),
      digestAt: Number(data.digestAt) || 0,
      digestStatus: String(data.digestStatus || "idle"),
      digestError: String(data.digestError || ""),
      messageCount: Number(data.messageCount) || 0,
    };
  } else if (type === "file") {
    base.data = {
      path: String(data.path || ""),
      name: String(data.name || basename(data.path || "") || "未命名文件"),
      includeMode: ["auto", "inline", "reference"].includes(data.includeMode) ? data.includeMode : "auto",
      content: String(data.content || ""),
      contentAt: Number(data.contentAt) || 0,
      contentStatus: String(data.contentStatus || "idle"),
      contentError: String(data.contentError || ""),
      size: Number(data.size) || 0,
    };
  } else if (type === "prompt") {
    base.data = {
      text: String(data.text || ""),
    };
  } else {
    base.data = {
      title: String(data.title || "新对话"),
      instruction: String(data.instruction || ""),
      workspaceId: String(data.workspaceId || ""),
      status: String(data.status || "idle"),
      resultSessionId: String(data.resultSessionId || ""),
      resultAt: Number(data.resultAt) || 0,
      lastContextChars: Number(data.lastContextChars) || 0,
      lastTokens: Number(data.lastTokens) || 0,
    };
  }
  return base;
}

function normalizeGraph(input) {
  const graph = input && typeof input === "object" ? input : {};
  const seen = new Set();
  const nodes = [];
  if (Array.isArray(graph.nodes)) {
    for (const raw of graph.nodes.slice(0, MAX_NODES)) {
      const node = normalizeNode(raw);
      if (!node || seen.has(node.id)) continue;
      seen.add(node.id);
      nodes.push(node);
    }
  }
  const pairSeen = new Set();
  const edges = [];
  if (Array.isArray(graph.edges)) {
    for (const raw of graph.edges) {
      if (!raw || typeof raw !== "object") continue;
      const from = String(raw.from || raw.source || "");
      const to = String(raw.to || raw.target || "");
      if (!seen.has(from) || !seen.has(to) || from === to) continue;
      const pair = from + "\u0000" + to;
      if (pairSeen.has(pair)) continue;
      pairSeen.add(pair);
      edges.push({
        id: typeof raw.id === "string" && raw.id !== "" ? raw.id : uid("edge"),
        from,
        to,
        kind: "context",
        enabled: raw.enabled !== false,
        order: Number(raw.order) || edges.length + 1,
      });
    }
  }
  const viewport = graph.viewport && typeof graph.viewport === "object" ? graph.viewport : {};
  return {
    version: 1,
    id: typeof graph.id === "string" && graph.id !== "" ? graph.id : uid("canvas"),
    name: String(graph.name || "未命名画布").slice(0, 80),
    nodes,
    edges,
    viewport: {
      x: typeof viewport.x === "number" && Number.isFinite(viewport.x) ? viewport.x : 48,
      y: typeof viewport.y === "number" && Number.isFinite(viewport.y) ? viewport.y : 48,
      scale: typeof viewport.scale === "number" && Number.isFinite(viewport.scale) ? clamp(viewport.scale, MIN_SCALE, MAX_SCALE) : 1,
    },
    createdAt: Number(graph.createdAt) || Date.now(),
    updatedAt: Number(graph.updatedAt) || Date.now(),
  };
}

function loadGraph() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyGraph();
    const parsed = safeParse(raw);
    if (!parsed || !Array.isArray(parsed.nodes)) return emptyGraph();
    return normalizeGraph(parsed);
  } catch (error) {
    return emptyGraph();
  }
}

function saveGraph(graph) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(graph));
    return true;
  } catch (error) {
    console.warn("[context-canvas] save failed:", error);
    return false;
  }
}

function makeChatNode(x, y, patch) {
  return {
    id: uid("chat"),
    type: "chat",
    x: Math.round(x),
    y: Math.round(y),
    data: Object.assign(
      {
        title: "新对话",
        instruction: "",
        workspaceId: "",
        status: "idle",
        resultSessionId: "",
        resultAt: 0,
        lastContextChars: 0,
        lastTokens: 0,
      },
      patch || {},
    ),
  };
}


function findFreeSpot(nodes, size, start, gap) {
  const pad = Number.isFinite(gap) ? gap : 24;
  const list = Array.isArray(nodes) ? nodes : [];
  const overlaps = (x, y) => list.some((node) => {
    const other = SIZES[node.type] || SIZES.chat;
    return x < node.x + other.w + pad
      && x + size.w + pad > node.x
      && y < node.y + other.h + pad
      && y + size.h + pad > node.y;
  });
  if (!overlaps(start.x, start.y)) return { x: start.x, y: start.y };
  const stepX = size.w + pad;
  const stepY = size.h + pad;
  const spots = [];
  for (let ring = 1; ring <= 7; ring += 1) {
    spots.push(
      [ring, 0], [-ring, 0], [0, ring], [0, -ring],
      [ring, ring], [-ring, ring], [ring, -ring], [-ring, -ring],
      [ring, 1], [-ring, 1], [1, ring], [-1, ring],
    );
  }
  for (const [dx, dy] of spots) {
    const x = start.x + dx * stepX;
    const y = start.y + dy * stepY;
    if (!overlaps(x, y)) return { x, y };
  }
  return { x: start.x + (list.length % 4) * 36, y: start.y + (list.length % 4) * 36 };
}

function incomingEdges(graph, chatId) {
  return graph.edges
    .filter((edge) => edge.to === chatId)
    .slice()
    .sort((left, right) => {
      const order = (Number(left.order) || 0) - (Number(right.order) || 0);
      if (order !== 0) return order;
      const leftNode = graph.nodes.find((node) => node.id === left.from);
      const rightNode = graph.nodes.find((node) => node.id === right.from);
      return (leftNode ? leftNode.y : 0) - (rightNode ? rightNode.y : 0);
    });
}

function sourceOptions(graph, chatId) {
  return incomingEdges(graph, chatId).flatMap((edge) => {
    const node = graph.nodes.find((candidate) => candidate.id === edge.from);
    return node ? [{ edge, node }] : [];
  });
}

function useStore(store) {
  const fallback = useMemo(() => ({ getSnapshot: () => undefined, subscribe: () => () => {} }), []);
  const target = store || fallback;
  return useSyncExternalStore(
    (listener) => target.subscribe(listener),
    () => target.getSnapshot(),
    () => target.getSnapshot(),
  );
}

function entryEvent(entry) {
  if (!entry || typeof entry !== "object") return undefined;
  if (entry.event && typeof entry.event === "object") return entry.event;
  return entry;
}

function contentText(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  const parts = [];
  for (const block of content) {
    if (!block || typeof block !== "object") continue;
    if (block.type === "text" && typeof block.text === "string") parts.push(block.text);
  }
  return parts.join("\n").trim();
}

function isNoiseMessage(text) {
  const head = String(text || "").trimStart();
  return head.startsWith("Current runtime context.")
    || head.startsWith("Time sampled")
    || head.startsWith("<system-reminder>")
    || head.startsWith("<available_skills>");
}

async function readSessionMessages(ctx, sessionId, signal) {
  const result = await ctx.sessions.using(sessionId, { source: "canvasDigest", signal }, async (reference) => {
    const session = reference.binding.session;
    let window = session.eventSource.getSnapshot();
    let pages = 0;
    while (window.hasMore && window.entries.length < 220 && pages < 4 && typeof session.loadOlder === "function") {
      try {
        await session.loadOlder();
        window = session.eventSource.getSnapshot();
        pages += 1;
      } catch (error) {
        break;
      }
    }
    const messages = [];
    let turn = 0;
    for (const entry of window.entries) {
      if (entry && entry.type === "transient") continue;
      const event = entryEvent(entry);
      if (!event || typeof event !== "object") continue;
      if (event.type === "user/message") {
        const text = contentText(event.data && event.data.content);
        if (text && !isNoiseMessage(text) && !isNotification(text)) {
          turn += 1;
          messages.push({ role: "user", text, seq: event.seq, turn });
        }
      } else if (event.type === "assistant/message") {
        const data = event.data || {};
        const message = data.message || {};
        const text = contentText(message.content) || contentText(data.content);
        if (text && !isNoiseMessage(text) && !isNotification(text)) messages.push({ role: "assistant", text, seq: event.seq, turn: Math.max(1, turn) });
      }
    }
    return messages.slice(-160);
  });
  return Array.isArray(result) ? result : [];
}

function splitSentences(text) {
  return String(text || "")
    .split(/(?<=[。！？；!?;])|\n+/u)
    .map((part) => part.replace(/\s+/g, " ").trim())
    .filter((part) => part.length > 0)
    .filter((part) => part.length >= 12 || /^#+\s*\S+$/.test(part) || /^(结论|建议|推荐|摘要|判断|根因|影响范围|风险|缺口)/.test(part) || extractAnchors(part).length > 0);
}

function sentenceScore(sentence) {
  const strong = /(结论|建议|必须|不能|不建议|风险|冲突|待确认|未知|不满足|未定|决定|取舍|推荐|根因|影响范围|缺口|阻塞)/;
  const numeric = /(\d+(?:\.\d+)?\s*(?:%|分钟|小时|min|h|倍|天|万|亿)|P9\d|24h|2h|10min)/i;
  const negative = /(不|未|没有|缺|无法|不能)/;
  let score = 0;
  if (strong.test(sentence)) score += 3;
  if (numeric.test(sentence)) score += 2;
  if (numeric.test(sentence) && /(相差|不满足|无解|超过|不足|高于|低于|倍|未定|风险|缺口)/.test(sentence)) score += 2;
  if (negative.test(sentence)) score += 1;
  if (/^(结论|建议|推荐|摘要|判断|根因|影响范围|风险|缺口)/.test(sentence)) score += 3;
  if (/^([0-9]+[.、]|#+\s|[-*]\s)/.test(sentence)) score += 1;
  return score;
}

function pickKeySentences(text, limit, maxChars) {
  const sentences = splitSentences(text);
  const candidates = [];
  const seen = new Set();
  for (let index = 0; index < sentences.length; index += 1) {
    const sentence = sentences[index];
    let score = sentenceScore(sentence);
    const previous = index > 0 ? sentences[index - 1] : "";
    const isHeadline = /^(结论|建议|推荐|摘要|一句话|判断|根因|影响范围|风险|缺口)/.test(sentence);
    if (isHeadline) score += 4;
    if (!isHeadline && /^(结论|建议|推荐|判断|根因|影响范围)/.test(previous)) score += 3;
    if (score < 3) continue;
    const key = sentence.slice(0, 40);
    if (seen.has(key)) continue;
    seen.add(key);
    const headlineOnly = /^#*\s*(结论|建议|推荐|摘要|一句话|判断|根因|影响范围|风险|缺口)\s*$/.test(sentence);
    if (headlineOnly) {
      const next = sentences[index + 1];
      if (next && next.length >= 12) {
        const merged = "**" + sentence.replace(/^#+\s*/, "").trim() + "**：" + next;
        if (!seen.has(merged.slice(0, 40))) {
          seen.add(merged.slice(0, 40));
          seen.add(next.slice(0, 24));
          candidates.push({ sentence: merged, score: score + 2, index });
        }
        continue;
      }
    }
    if (seen.has(sentence.slice(0, 24))) continue;
    seen.add(sentence.slice(0, 24));
    candidates.push({ sentence: sentence.replace(/^#+\s*/, ""), score, index });
  }
  candidates.sort((left, right) => right.score - left.score || left.index - right.index);
  const picked = [];
  let used = 0;
  for (const item of candidates) {
    if (picked.length >= limit) break;
    if (used + item.sentence.length > maxChars) continue;
    picked.push(item);
    used += item.sentence.length;
  }
  picked.sort((left, right) => left.index - right.index);
  return picked.map((item) => item.sentence);
}

function questionOf(text) {
  const compact = String(text || "").replace(/\s+/g, " ").trim();
  if (!compact) return "";
  const lines = compact.split(/(?<=[？?])/).map((part) => part.trim()).filter(Boolean);
  const question = lines.find((line) => line.length <= 160 && /[？?]/.test(line));
  return truncate(question || compact, 220, true);
}

const ANCHOR_RULES = [
  ["metric", /\b(?:P\d{2}|QPS|TTL|SLA|RTO|RPO|TPS)\b/gi],
  ["number", /\d+(?:\.\d+)?\s*(?:%|分钟|小时|天|秒|毫秒|min|ms|h|倍|万|亿)/gi],
  ["bound", /(?:≤|≥|不超过|至少|最多|上限|下限|必须|不得|禁止)/g],
  ["datetime", /\b\d{1,2}\/\d{1,2}\b|\b\d{1,2}:\d{2}\b/g],
  ["id", /\b(?:session-[0-9a-f-]{8,}|(?:edge|node|chat|conv|file)-[0-9a-z-]{4,})\b/gi],
];

function canonicalAnchor(value) {
  return String(value || "")
    .replace(/\s+/g, "")
    .toLowerCase()
    .replace(/^(\d+(?:\.\d+)?)h$/u, "$1小时")
    .replace(/^(\d+(?:\.\d+)?)min$/u, "$1分钟")
    .replace(/^(\d+(?:\.\d+)?)ms$/u, "$1毫秒");
}

function extractAnchors(text) {
  const source = String(text || "");
  const found = [];
  const seen = new Set();
  for (const [kind, pattern] of ANCHOR_RULES) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(source)) !== null) {
      const raw = match[0].trim();
      if (raw) {
        const key = kind + ":" + canonicalAnchor(raw);
        if (!seen.has(key)) {
          seen.add(key);
          found.push({ kind, value: raw });
        }
      }
      if (match.index === pattern.lastIndex) pattern.lastIndex += 1;
    }
  }
  return found;
}


function isNotification(text) {
  const value = String(text || "").trim();
  return value.startsWith("Background subagent")
    || /sent a message:|background job|pwsh-|subagent .* finished/i.test(value)
    || /^\[model changed:/.test(value);
}

function isCodeLike(text) {
  const value = String(text || "").trim();
  if (!value) return true;
  if (/undefined|<\/?[a-z-]+>|data-[a-z-]+=|=>|\bconst\b|\bimport\s|\bfunction\s|\{\s*"/i.test(value)) return true;
  const symbols = (value.match(/[{}[\]<>'=;|\\]/g) || []).length;
  return symbols / value.length > 0.12;
}

function cleanSentence(text) {
  return String(text || "")
    .replace(/^\s*(?:[-*#>]+|\d+[.、])\s*/u, "")
    .trim();
}

function isProcessText(text) {
  const value = String(text || "").trim();
  return /^(?:Update |The first edit|Let me|I'll |Now I|Checking |Reading |Running |All clean|Done[.!]?$)/i.test(value)
    || /^(?:已完成|已编辑|已创建|已清理|已写入|已保存)/.test(value)
    || value.startsWith(FENCE);
}

function stripMeta(text) {
  return String(text || "")
    .replace(/^请只基于下面的上下文回答[，,]?不要调用工具[。.\s]*/u, "")
    .replace(/^请只基于[^\n]{0,80}\n+/u, "")
    .replace(/^Current runtime context[\s\S]{0,240}$/u, "")
    .replace(/\s*请给出[\s\S]*$/u, "")
    .replace(/\s*请用简短[\s\S]*$/u, "")
    .replace(/\s+/g, " ")
    .trim();
}


function bigramsOf(text) {
  const normalized = String(text || "").replace(/[^\u4e00-\u9fa5A-Za-z0-9]/g, "");
  const set = new Set();
  for (let index = 0; index < normalized.length - 1; index += 1) set.add(normalized.slice(index, index + 2));
  return set;
}

function similarSentence(left, right) {
  const a = bigramsOf(left);
  const b = bigramsOf(right);
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  for (const gram of a) if (b.has(gram)) shared += 1;
  return shared / (a.size + b.size - shared);
}

function trimAtPunctuation(text, limit) {
  const value = String(text || "");
  if (value.length <= limit) return value;
  const head = value.slice(0, limit);
  const cut = Math.max(head.lastIndexOf("。"), head.lastIndexOf("；"), head.lastIndexOf("！"), head.lastIndexOf("？"), head.lastIndexOf(";"));
  return (cut >= Math.floor(limit * 0.5) ? head.slice(0, cut + 1) : head) + "…";
}

function uniqueSentences(list) {
  const out = [];
  const seen = new Set();
  for (const item of list) {
    const key = item.s.replace(/\s+/g, "").slice(0, 26);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}


const DECISION_KEYS = ["不坚持", "放弃", "保留", "移除", "改为", "分层", "不构成", "缓解", "自动裁决", "迁移", "预览", "砍掉", "根因", "结论"];

function pickDecisionSentences(pool, limit, maxLen) {
  const candidates = pool
    .filter((item) => /(结论|建议|推荐|决定|取舍|根因|影响范围|方案|必须|不要|不能|不会|坚持|放弃|保留|移除|改为|采用|选择|分层|不构成|缓解|自动裁决|迁移|预览|砍掉)/.test(item.s))
    .sort((left, right) => right.score - left.score || left.s.length - right.s.length);
  const selected = [];
  const texts = [];
  const add = (item) => {
    if (!item || selected.length >= limit) return;
    if (texts.some((existing) => similarSentence(existing, item.s) > 0.72)) return;
    selected.push(trimAtPunctuation(item.s, maxLen));
    texts.push(item.s);
  };
  for (const key of DECISION_KEYS) {
    if (!candidates.some((item) => item.s.includes(key))) continue;
    add(candidates.find((item) => item.s.includes(key)));
  }
  for (const item of candidates) add(item);
  return { selected, texts };
}

function apcDigest(messages, mode) {
  const maxChars = mode === "digest_excerpts" ? 900 : 760;
  const firstUser = messages.find((message) => message.role === "user" && !isNotification(message.text) && !isNoiseMessage(message.text));
  const goal = firstUser ? truncate(stripMeta(firstUser.text), 180, true) : "";

  const allAnchors = [];
  const allAnchorSeen = new Set();
  for (const message of messages) {
    for (const anchor of extractAnchors(message.text)) {
      const key = canonicalAnchor(anchor.value);
      if (allAnchorSeen.has(key)) continue;
      allAnchorSeen.add(key);
      allAnchors.push(anchor);
    }
  }

  const questions = [];
  let seenFirst = false;
  for (const message of messages) {
    if (message === firstUser) {
      seenFirst = true;
      continue;
    }
    if (!seenFirst || message.role !== "user") continue;
    if (isNotification(message.text) || isCodeLike(message.text)) continue;
    const question = questionOf(message.text).replace(/^请/, "").trim();
    if (question.length >= 6 && !isCodeLike(question)) questions.push(truncate(question, 30, true));
    if (questions.length >= 3) break;
  }

  const assistantSentences = [];
  for (const message of messages) {
    if (message.role !== "assistant") continue;
    for (const sentence of splitSentences(message.text)) {
      if (isProcessText(sentence) || isCodeLike(sentence)) continue;
      const anchors = extractAnchors(sentence);
      assistantSentences.push({ s: sentence, anchors, score: sentenceScore(sentence) + anchors.length * 2 });
    }
  }
  const deduped = uniqueSentences(assistantSentences);
  const used = new Set();
  const pickedSentences = [];
  const take = (predicate, limit, maxLen) => {
    const picked = [];
    const pool = deduped
      .filter((item) => !used.has(item.s) && predicate(item))
      .sort((left, right) => right.score - left.score || left.s.length - right.s.length);
    for (const item of pool) {
      if (picked.length >= limit) break;
      if (pickedSentences.some((existing) => similarSentence(existing, item.s) > 0.72)) continue;
      const sentence = trimAtPunctuation(item.s, maxLen);
      picked.push(sentence);
      pickedSentences.push(item.s);
      used.add(item.s);
    }
    return picked;
  };

  const anchorSentences = take((item) => item.anchors.length > 0 && item.s.length >= 20 && !/^(?:\d+[.、]|#|[-*])\s*/.test(item.s), 2, 92);
  const decisionResult = pickDecisionSentences(deduped.filter((item) => !used.has(item.s)), 4, 100);
  for (const sentence of decisionResult.texts) used.add(sentence);
  const decisions = decisionResult.selected;
  const risks = take((item) => /(风险|冲突|未知|缺口|不满足|未定|无法|阻塞|矛盾|缓解)/.test(item.s), 3, 90);

  const anchorValues = [];
  const anchorSeen = new Set();
  const priority = { metric: 5, bound: 5, number: 4, id: 3, datetime: 2 };
  const orderedAnchors = allAnchors
    .slice()
    .sort((left, right) => (priority[right.kind] || 0) - (priority[left.kind] || 0));
  for (const anchor of orderedAnchors) {
    const key = canonicalAnchor(anchor.value);
    if (anchorSeen.has(key)) continue;
    anchorSeen.add(key);
    anchorValues.push(anchor.value);
    if (anchorValues.length >= 14) break;
  }

  const lines = [];
  if (goal) lines.push("**目标**：" + goal);
  if (questions.length > 0) lines.push("**追问**：" + questions.join("；"));
  if (anchorValues.length > 0) lines.push("**硬锚点**：" + truncate(anchorValues.slice(0, 24).join("；"), 220, true));
  const anchorContext = anchorSentences.map(cleanSentence).filter(Boolean);
  if (anchorContext.length > 0) {
    lines.push("**锚点上下文**：");
    for (const sentence of anchorContext) lines.push("- " + sentence);
  }
  if (decisions.length > 0) {
    lines.push("**结论/决定**：");
    for (const sentence of decisions) lines.push("- " + cleanSentence(sentence));
  }
  if (risks.length > 0) {
    lines.push("**冲突/未知**：");
    for (const sentence of risks) lines.push("- " + cleanSentence(sentence));
  }

  if (mode === "digest_excerpts") {
    const excerpt = messages
      .filter((message) => message.role === "assistant")
      .sort((left, right) => right.text.length - left.text.length)[0];
    if (excerpt) {
      lines.push("**关键原文**：");
      lines.push("> " + truncate(excerpt.text.replace(/\s+/g, " "), 420, true));
    }
  }

  let text = lines.join("\n");
  text = text.replace(/^\*\*(锚点上下文|结论\/决定|冲突\/未知)\*\*：\n(?=\*\*|$)/gm, "");
  while (text.length > maxChars && lines.length > 2) {
    const removable = lines.findIndex((line) => line.startsWith("- ") && !line.includes("硬锚点"));
    if (removable < 0) break;
    lines.splice(removable, 1);
    text = lines.join("\n");
  }
  if (text.length > maxChars) text = truncate(text, maxChars, true);

  const present = new Set(extractAnchors(text).map((anchor) => canonicalAnchor(anchor.value)));
  const missing = anchorValues.filter((value) => !present.has(canonicalAnchor(value)));
  if (missing.length > 0) {
    text += "\n**补齐锚点**：" + truncate(missing.join("；"), 260, true);
  }
  if (text.length < 260 && deduped.length > 0) {
    const extra = deduped
      .filter((item) => !used.has(item.s))
      .sort((left, right) => right.score - left.score)
      .slice(0, 2)
      .map((item) => "- " + truncate(item.s, 100, true));
    if (extra.length > 0) text += "\n**补充**：\n" + extra.join("\n");
  }
  return text;
}


function cutSentence(text, limit) {
  const value = String(text || "").trim();
  if (value.length <= limit) return value;
  const head = value.slice(0, limit);
  const cut = Math.max(head.lastIndexOf("。"), head.lastIndexOf("；"), head.lastIndexOf("！"), head.lastIndexOf("？"));
  return (cut >= Math.floor(limit * 0.5) ? head.slice(0, cut + 1) : head).trim();
}

function afcHeader(messages) {
  const firstUser = messages.find((message) => message.role === "user" && !isNotification(message.text) && !isNoiseMessage(message.text));
  const lines = [];
  if (firstUser) lines.push("**目标**：" + cutSentence(stripMeta(firstUser.text), 200));
  const questions = [];
  let seenFirst = false;
  for (const message of messages) {
    if (message === firstUser) { seenFirst = true; continue; }
    if (!seenFirst || message.role !== "user" || isNotification(message.text) || isCodeLike(message.text)) continue;
    const question = cutSentence(questionOf(message.text).replace(/^请/, "").trim(), 60).replace(/[，,；;]\s*$/, "");
    if (question.length >= 6 && !isCodeLike(question)) questions.push(question);
    if (questions.length >= 3) break;
  }
  if (questions.length > 0) lines.push("**追问**：" + questions.join("；"));

  const decisionItems = [];
  for (const message of messages) {
    if (message.role !== "assistant") continue;
    for (const sentence of splitSentences(message.text)) {
      if (isCodeLike(sentence)) continue;
      decisionItems.push({ s: sentence, score: sentenceScore(sentence), turn: message.turn });
    }
  }
  const deduped = uniqueSentences(decisionItems);
  const result = pickDecisionSentences(deduped, 3, 120);
  const coreLines = new Set(String(arguments[1] || "").split("\n").map((line) => line.replace(/^\[[^\]]+\]\s*/, "").replace(/[。；;]\s*$/u, "").trim()));
  for (const sentence of result.selected) {
    const cleaned = cleanSentence(sentence);
    if (cleaned.length < 12 || /^(结论|建议|决定|风险|冲突|未知|摘要)[：:]?$/.test(cleaned)) continue;
    if (coreLines.has(cleaned.replace(/[。；;]\s*$/u, ""))) continue;
    const source = decisionItems.find((item) => item.s === sentence)
      || decisionItems.find((item) => item.s.indexOf(sentence.slice(0, 16)) !== -1);
    const turn = source ? source.turn : (firstUser ? firstUser.turn : 1);
    lines.push("**决定**：[轮" + turn + "·助手] " + cutSentence(cleaned, 150));
  }
  return { text: lines.join("\n"), decisions: result.texts };
}


function repairCoverage(text, messages, anchors) {
  let out = text;
  let normalized = AFC.norm(out);
  const added = [];
  for (const anchor of anchors) {
    if (anchor.tier !== "A") continue;
    if (AFC.survives(anchor, normalized)) continue;
    const message = messages[anchor.msg];
    if (!message) continue;
    const segments = AFC.splitWithOffsets(message.text);
    const segment = segments.find((item) => anchor.start >= item.start && anchor.start < item.end)
      || segments.find((item) => item.text.indexOf(anchor.display) !== -1);
    if (!segment) continue;
    const sentence = segment.text.replace(/\s+/g, " ").trim();
    if (sentence.length < 8) continue;
    if (added.some((existing) => similarSentence(existing, sentence) > 0.8)) continue;
    const line = "[轮" + message.turn + "·" + (message.role === "user" ? "用户" : "助手") + "] " + sentence;
    if (out.length + line.length > 2400) break;
    out += "\n" + line;
    normalized = AFC.norm(out);
    added.push(sentence);
    if (added.length >= 8) break;
  }
  return out;
}

function afcDigest(messages, mode) {
  const anchors = AFC.extractAnchors(messages);
  const floor = AFC.floorFor(messages, anchors, "");
  /* 预算阶梯（实测标定，口径：strict:false，只看正文本体）
     500/800/1100/1400   -> avg 1,061  丢失 7.7%   太紧
     800/1200/1600/2000  -> avg 1,318  丢失 1.8%   ← 采用（与旧版体积持平，标点/重复更好）
     800/1600/2000/2400  -> avg 1,499  丢失 1.1%
     1000/1800/2400/3000 -> avg 1,636  丢失 0%     体积过大，画布不用
     注意：strict:true 会把「未覆盖锚点」写进正文，导致存活判定误判为全中，
     因此这里必须用 strict:false，缺失数由下面的保真提示单独呈现。 */
  const minBudget = Math.min(1200, Math.max(800, floor.floorPerSource + 120));
  const budgets = mode === "digest_excerpts" ? [1400, 1800, 2200] : [minBudget, 1200, 1600, 2000];
  let best = null;
  for (const budget of budgets) {
    /* strict:false —— strict 会把「**未覆盖锚点**」清单塞进正文，污染上下文；
       缺失数量由下面的保真提示统一呈现。 */
    const out = AFC.extractiveDigest("", messages, anchors, { budget, strict: false });
    best = out;
    if (out.missed.length === 0) break;
  }
  let core = best ? best.text : "";
  const parts = afcHeader(messages, core);
  const headerText = parts.text.replace(/\n/g, " ");
  const decisionsText = parts.text
    .split("\n")
    .filter((line) => line.indexOf("**决定**") === 0)
    .join(" ");
  core = core.split("\n").filter((line) => {
    const plain = line.replace(/^\[[^\]]+\]\s*/, "").replace(/[。；;]\s*$/u, "").trim();
    if (plain.length < 6) return true;
    /* 用户原句已在「目标/追问」里出现 —— 丢掉 */
    if (/^\[轮\d+·用户\]/.test(line)) {
      if (headerText.includes(plain)) return false;
      const clauses = plain.split(/[；;]/).map((clause) => clause.replace(/[。；;]\s*$/u, "").trim()).filter((clause) => clause.length >= 4);
      if (clauses.length > 0 && clauses.every((clause) => headerText.includes(clause))) return false;
    }
    /* 助手句与头部「决定」重复 —— 丢掉（父句常被整句重复一次） */
    if (decisionsText && decisionsText.includes(plain.slice(0, 18))) return false;
    return true;
  }).join("\n");
  let text = parts.text && core ? parts.text + "\n" + core : (parts.text || core);
  /* 回退策略：只在"大面积丢失"时回退全文。
     以前是"任何 miss 就回退"，S3-B 在 2400 预算下只缺 3 个锚点却触发全文回退，
     把 1,977 字符放大到 5,583。现在按锚点总量设阈值，缺少量时保留压缩结果并给出提示。 */
  const tierATotal = anchors.filter((anchor) => anchor.tier === "A").length || anchors.length || 1;
  const allowedMissing = Math.max(6, Math.round(tierATotal * 0.1));
  const missing = best ? best.missed.length : tierATotal;
  const overBudget = !best || missing > allowedMissing;
  if (overBudget) {
    const full = messages
      .map((message) => "**" + (message.role === "user" ? "用户" : "助手") + "**：" + message.text)
      .join("\n\n");
    text = "**保真压缩未达标（缺 " + missing + " 个锚点），以下保留全文**\n" + truncate(full, 12000, true);
  } else if (missing > 0) {
    text += "\n\n> 保真提示：本段有 " + missing + " 个次级锚点未覆盖（共 " + tierATotal + " 个），其余已保留原文整句。";
  }
  if (mode === "digest_excerpts") {
    const excerpt = messages
      .filter((message) => message.role === "assistant")
      .sort((left, right) => right.text.length - left.text.length)[0];
    if (excerpt) {
      text += "\n\n**关键原文**：\n> " + truncate(excerpt.text.replace(/\s+/g, " "), 420, true);
    }
  }
  return text;
}

function buildDigest(messages, mode) {
  if (!messages || messages.length === 0) return "";
  if (mode === "full") {
    const label = (role) => (role === "user" ? "用户" : "助手");
    const blocks = [];
    let budget = 26000;
    for (const message of messages.slice(-80)) {
      if (budget <= 0) break;
      const text = truncate(message.text, Math.min(4200, budget), true);
      budget -= text.length;
      blocks.push("**" + label(message.role) + "**：" + text);
    }
    return blocks.join("\n\n");
  }
  return afcDigest(messages, mode);
}
function fenceFor(text) {
  const source = String(text || "");
  if (!source.includes(FENCE)) return FENCE;
  if (!source.includes(FENCE_LONG)) return FENCE_LONG;
  return FENCE_LONG + TICK;
}

function sessionSummaryMap(snapshot) {
  const map = new Map();
  if (!snapshot) return map;
  if (snapshot.byId && typeof snapshot.byId === "object") {
    for (const id of Object.keys(snapshot.byId)) map.set(id, snapshot.byId[id]);
  } else if (Array.isArray(snapshot.items)) {
    for (const item of snapshot.items) {
      if (item && (item.id || item.sessionId)) map.set(item.id || item.sessionId, item);
    }
  }
  return map;
}

function pickWorkspace(workspacesSnapshot, sessionsSnapshot, preferredSessionId) {
  const workspaces = workspacesSnapshot && Array.isArray(workspacesSnapshot.items) ? workspacesSnapshot.items : [];
  if (workspaces.length === 0) return undefined;
  const summaries = sessionSummaryMap(sessionsSnapshot);
  const summary = preferredSessionId ? summaries.get(preferredSessionId) : undefined;
  if (summary && summary.cwd) {
    const match = workspaces.find((workspace) => workspace.path === summary.cwd);
    if (match) return match;
  }
  return workspaces[0];
}

function workspaceLabel(workspace) {
  if (!workspace) return "";
  return String(workspace.title || basename(workspace.path || "") || workspace.path || "工作区");
}

async function compileContext(api, graph, chatNode, options) {
  const opts = options || {};
  const chat = chatNode || graph.nodes.find((node) => node.id === opts.chatId);
  if (!chat || chat.type !== "chat") throw new Error("找不到新对话节点");
  const sessionsSnapshot = api.sessionsSnapshot();
  const summaries = sessionSummaryMap(sessionsSnapshot);
  const pairs = sourceOptions(graph, chat.id);
  const stats = { conversations: 0, files: 0, prompts: 0, disabled: 0, chars: 0, tokens: 0 };
  const warnings = [];
  const blocks = [];
  let index = 0;

  for (const pair of pairs) {
    const edge = pair.edge;
    const node = pair.node;
    if (edge.enabled === false) {
      stats.disabled += 1;
      continue;
    }
    index += 1;
    if (node.type === "conversation") {
      const summary = summaries.get(node.data.sessionId);
      const title = (summary && (summary.title || summary.displayTitle)) || node.data.title || node.data.sessionId;
      const cwd = (summary && summary.cwd) || node.data.cwd || "";
      let digest = node.data.digest || "";
      let messageCount = node.data.messageCount || 0;
      if (!digest || opts.refresh) {
        try {
          const messages = await readSessionMessages(api.ctx, node.data.sessionId, opts.signal);
          messageCount = messages.length;
          digest = buildDigest(messages, node.data.includeMode || "digest");
          if (!digest) warnings.push("对话「" + title + "」没有可读取的文本消息。");
        } catch (error) {
          warnings.push("读取对话「" + title + "」失败：" + String(error && error.message ? error.message : error));
          digest = node.data.digest || "";
        }
      }
      stats.conversations += 1;
      const heading = "### 来源 " + index + " · 历史对话：" + title;
      const meta = [
        "- 会话 ID：" + TICK + (node.data.sessionId || "") + TICK,
        cwd ? "- 工作区：" + TICK + cwd + TICK : "",
        summary && summary.updatedAt ? "- 最近活动：" + formatDateTime(summary.updatedAt) : "",
        "- 提取方式：" + (INCLUDE_LABEL[node.data.includeMode] || "摘要") + (messageCount ? "（" + messageCount + " 条消息）" : ""),
      ].filter(Boolean);
      blocks.push([heading, ...meta, "", digest || "（摘要暂不可用）"].join("\n"));
    } else if (node.type === "file") {
      const path = node.data.path || node.data.name;
      const mode = node.data.includeMode || "auto";
      const inline = mode === "inline" || (mode === "auto" && Boolean(node.data.content));
      stats.files += 1;
      const heading = "### 来源 " + index + " · 文件：" + (node.data.name || basename(path));
      const meta = [
        "- 路径：" + TICK + path + TICK,
        "- 使用方式：" + (inline ? "已内联文本片段" : "路径引用，按需读取"),
      ];
      if (inline && node.data.content) {
        const fence = fenceFor(node.data.content);
        blocks.push([heading, ...meta, "", fence + "text", truncate(node.data.content, 16000, true), fence].join("\n"));
      } else {
        blocks.push([heading, ...meta, "", "@\"" + path + "\"", "", "（请在新对话中使用文件读取工具打开该路径。）"].join("\n"));
      }
    } else if (node.type === "prompt") {
      const text = String(node.data.text || "").trim();
      if (!text) {
        index -= 1;
        continue;
      }
      stats.prompts += 1;
      blocks.push(["### 来源 " + index + " · 任务要求", "", text].join("\n"));
    } else {
      index -= 1;
      continue;
    }
  }

  if (pairs.length === 0) warnings.push("这个新对话节点还没有连接任何来源。");
  else if (index === 0) warnings.push("所有来源都被禁用了。");

  const instruction = String(chat.data.instruction || "").trim() || DEFAULT_INSTRUCTION;
  const header = [
    "# 画布上下文 · " + (graph.name || "未命名画布"),
    "",
    "> 本对话由 DSH 画布创建。画布把 " + stats.conversations + " 个历史对话、" + stats.files + " 个文件、" + stats.prompts + " 条任务要求整理成这次工作的起点。",
    "> 生成时间：" + formatDateTime(Date.now()),
    "",
    "## 本次任务指令",
    "",
    instruction,
    "",
    "## 画布资料来源",
    "",
  ].join("\n");

  const footer = [
    "",
    "## 给新对话的工作约定",
    "",
    "1. 开始前先用几句话复述你对目标、已确认事实、已做决定和未解决问题的理解。",
    "2. 如果不同来源相互冲突，请并列列出冲突双方及其来源，不要静默选择其中一个。",
    "3. 引用历史对话时标注上面的来源编号；引用文件时给出路径。",
    "4. 未内联的文件请使用文件读取工具按需读取，不要凭空猜测文件内容。",
    "5. 如果资料不足，请明确说明缺口并提问，而不是编造。",
    "6. 除非任务明确要求产出文件，否则只在对话正文回答，不要创建或修改工作区文件。",
    "7. 篇幅从紧：先给结论与冲突，再给依据；过程叙述、工具流水和重复铺陈不要写进正文。",
  ].join("\n");

  const body = blocks.length > 0 ? blocks.join("\n\n---\n\n") : "（暂无可用来源。）";
  const text = header + body + "\n" + footer;
  stats.chars = text.length;
  stats.tokens = estimateTokens(text);
  return { text, stats, warnings, generatedAt: Date.now(), chatId: chat.id };
}

function createCanvasApi(ctx) {
  const getRemote = () => {
    try {
      return ctx.remote;
    } catch (error) {
      return undefined;
    }
  };

  return {
    ctx,
    sessionsSnapshot() {
      try {
        return ctx.sessions.list.getSnapshot();
      } catch (error) {
        return { ids: [], byId: {}, phase: "error" };
      }
    },
    workspacesSnapshot() {
      try {
        return ctx.workspaces.list.getSnapshot();
      } catch (error) {
        return { items: [], phase: "error" };
      }
    },
    async readDigest(sessionId, mode, signal) {
      const messages = await readSessionMessages(ctx, sessionId, signal);
      return { digest: buildDigest(messages, mode || "digest"), messageCount: messages.length };
    },
    async readWorkspaceFile(sessionId, path) {
      const remote = getRemote();
      if (!remote || !remote.workspaceFiles || typeof remote.workspaceFiles.read !== "function") {
        throw new Error("当前环境没有文件读取服务");
      }
      const result = await remote.workspaceFiles.read(sessionId, path, { offset: 1 });
      if (!result || result.ok !== true) {
        const message = result && result.error && result.error.message ? result.error.message : "读取失败";
        throw new Error(message);
      }
      const value = result.value || {};
      return { text: String(value.text || ""), eof: value.eof !== false, lines: value.lines || 0 };
    },
    async createConversation(input) {
      const workspaceId = input.workspaceId;
      if (!workspaceId) throw new Error("请先选择一个目标工作区");
      const sessionId = await ctx.sessions.create({ workspaceId });
      ctx.uiWorkspace.openSession(sessionId);
      try {
        await ctx.sessions.using(sessionId, { source: "canvasCreate" }, async (reference) => {
          if (input.autoSend) {
            const conversation = reference.binding.ctx.get("conversation");
            if (!conversation) throw new Error("对话服务不可用");
            await conversation.send(input.prompt);
            return;
          }
          const conversation = ctx.get("conversation");
          const hub = conversation && conversation.input;
          if (!hub) throw new Error("对话输入服务不可用");
          const outcome = hub.requestDraftInitialization(reference.binding, {
            prompt: input.prompt,
            clearPreviousDraft: true,
          });
          if (outcome === "blocked") throw new Error("输入框正忙，无法预填上下文");
          if (outcome !== "applied") throw new Error("未能把上下文填入输入框");
        });
      } catch (error) {
        return { sessionId, ok: false, error: String(error && error.message ? error.message : error) };
      }
      return { sessionId, ok: true };
    },
    openSession(sessionId) {
      if (!sessionId) return;
      ctx.uiWorkspace.openSession(sessionId);
    },
    openPanel() {
      try {
        ctx.layout.selectPanel(PANEL_ID);
      } catch (error) {
        /* the panel is already open */
      }
    },
    platformPath(file) {
      return hostPathOf(file);
    },
    async readDroppedFile(file, limit) {
      return readBrowserFile(file, limit || 40000);
    },
  };
}
