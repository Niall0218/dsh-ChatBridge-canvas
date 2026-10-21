const React = require("react");
const { useState, useEffect, useRef, useMemo, useCallback, useSyncExternalStore } = React;
const h = React.createElement;

const NS = "contextCanvas";
const PANEL_ID = "canvas";
const STORAGE_KEY = "dsh-context-canvas:v1";
const MAX_NODES = 160;
const MIN_SCALE = 0.2;
const MAX_SCALE = 2.5;
const GRID = 24;
const DROP_CREATE_MIN = 160;

const SIZES = {
  conversation: { w: 268, h: 136 },
  file: { w: 268, h: 118 },
  prompt: { w: 268, h: 150 },
  chat: { w: 328, h: 202 },
};

const TYPE_LABEL = {
  conversation: "历史对话",
  file: "文件",
  prompt: "提示词",
  chat: "新对话",
};

const INCLUDE_LABEL = {
  digest: "锚点保真摘要",
  digest_excerpts: "锚点摘要 + 原文片段",
  full: "完整文本",
};

const DEFAULT_INSTRUCTION =
  "请综合以上画布资料，继续接下来的工作。开始前先用几句话复述：目标、已确认的事实与决定、仍然存在的冲突或未知；然后再给出计划并执行。";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function uid(prefix) {
  const random = Math.random().toString(36).slice(2, 8);
  return (prefix || "id") + "-" + Date.now().toString(36) + "-" + random;
}

function cx() {
  return Array.prototype.filter.call(arguments, Boolean).join(" ");
}

function basename(value) {
  const text = String(value == null ? "" : value).replace(/[/\\]+$/, "");
  const at = Math.max(text.lastIndexOf("/"), text.lastIndexOf("\\"));
  return at >= 0 ? text.slice(at + 1) : text;
}

function timeAgo(timestamp) {
  if (!timestamp) return "";
  const delta = Date.now() - Number(timestamp);
  if (!Number.isFinite(delta)) return "";
  if (delta < 60 * 1000) return "刚刚";
  if (delta < 60 * 60 * 1000) return Math.floor(delta / 60000) + " 分钟前";
  if (delta < 24 * 60 * 60 * 1000) return Math.floor(delta / 3600000) + " 小时前";
  if (delta < 7 * 24 * 60 * 60 * 1000) return Math.floor(delta / 86400000) + " 天前";
  return new Date(Number(timestamp)).toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" });
}

function formatDateTime(timestamp) {
  if (!timestamp) return "";
  return new Date(Number(timestamp)).toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatNumber(value) {
  return new Intl.NumberFormat("zh-CN").format(Math.round(Number(value) || 0));
}

function estimateTokens(text) {
  const source = String(text || "");
  let cjk = 0;
  let other = 0;
  for (const char of source) {
    if (/[\u3400-\u9fff\uf900-\ufaff\u3000-\u303f\uff00-\uffef]/.test(char)) cjk += 1;
    else other += 1;
  }
  return Math.ceil(cjk + other / 3.6);
}

function truncate(text, limit, tail) {
  const source = String(text == null ? "" : text);
  if (source.length <= limit) return source;
  const cut = Math.max(0, limit - 1);
  return source.slice(0, cut) + (tail === false ? "" : "…");
}

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    return undefined;
  }
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(String(text));
    return true;
  } catch (error) {
    try {
      const area = document.createElement("textarea");
      area.value = String(text);
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    } catch (fallbackError) {
      return false;
    }
  }
}

function isTextName(name) {
  return /\.(md|markdown|txt|json|jsonc|js|mjs|cjs|ts|tsx|jsx|css|scss|less|html|htm|xml|yaml|yml|toml|ini|cfg|conf|log|csv|tsv|py|rb|go|rs|java|kt|swift|php|sh|bash|ps1|sql|vue|svelte|astro|tex|gitignore)$/i.test(String(name || ""));
}

function hostPathOf(file) {
  try {
    const bridge = globalThis.__DSH_HOST_PATHS__;
    if (bridge && typeof bridge.pathFor === "function") {
      const value = bridge.pathFor(file);
      return typeof value === "string" && value !== "" ? value : "";
    }
  } catch (error) {
    /* optional desktop bridge */
  }
  return "";
}

function readBrowserFile(file, limit) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => resolve("");
    reader.readAsText(file.slice(0, limit));
  });
}

function isEditableTarget(target) {
  if (!target || typeof target !== "object") return false;
  const tag = String(target.tagName || "").toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  return Boolean(target.isContentEditable);
}

function edgePath(from, to) {
  const dx = Math.max(48, Math.abs(to.x - from.x) * 0.46);
  return "M " + from.x + " " + from.y + " C " + (from.x + dx) + " " + from.y + ", " + (to.x - dx) + " " + to.y + ", " + to.x + " " + to.y;
}

function portOut(node) {
  const size = SIZES[node.type] || SIZES.chat;
  return { x: node.x + size.w, y: node.y + size.h / 2 };
}

function portIn(node, index, total) {
  const size = SIZES[node.type] || SIZES.chat;
  const spread = Math.min(80, Math.max(0, (total - 1) * 14));
  const offset = total <= 1 ? 0 : (index / (total - 1) - 0.5) * spread;
  return { x: node.x, y: node.y + size.h / 2 + offset };
}
