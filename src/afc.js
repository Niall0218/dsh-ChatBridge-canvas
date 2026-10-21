const AFC = (() => {
const CONFIG = {
  CLAUSE_MAX: 72,        // 超过该长度的句子按 ，、： 继续切子句
  DECISION_TH: 0.34,     // decision 锚点存活判定的大元重叠阈值
  CONFLICT_TH: 0.3,      // conflict 锚点存活判定阈值
  GROUP_JOIN_MAX: 180,   // renderLines 同组拼接上限
  MISSED_APPEND_MAX: 12, // strict 模式下追加的未覆盖锚点条数
  FLOOR_MARGIN: 1.15,    // autoBudget 默认余量
  AUTO_ESCALATE_MAX: 4,  // autoBudget 最大升档次数
  AUTO_ESCALATE_STEP: 1.3, // autoBudget 每档最小倍率
  AUTO_MAX_CHARS: 2600,  // 输出字符上限；选择预算可高于此值
  AUTO_MAX_TOKENS: 2200, // 输出 token 上限（仅 budgetTokens 模式生效）
  AUTO_SELECT_RATIO: 1.5 // 选择预算上限 = 输出上限 × 1.5，父句去重后实际输出通常更低
};

const UNITS = "个百分点|百分比|分钟|小时|毫秒|公里|万元|亿元|元|字符|个字|字|行|次|条|个|项|层|台|人|天|周|月|年|秒|倍|min|mins|h|hr|ms|s|d|tok|KB|MB|GB|%"; // 「元」置于万元/亿元之后，保证长单位先匹配
const UNIT_CANON = {
  "分钟": "分钟", min: "分钟", mins: "分钟", "小时": "小时", h: "小时", hr: "小时",
  "毫秒": "毫秒", ms: "毫秒", "秒": "秒", s: "秒", "天": "天", d: "天", "周": "周",
  "月": "月", "年": "年", "%": "%", "个百分点": "%", "百分比": "%", "倍": "倍",
  "个": "个", "条": "条", "次": "次", "项": "项", "人": "人", "行": "行", "字": "字",
  "字符": "字符", "个字": "字", tok: "tok", kb: "KB", mb: "MB", gb: "GB",
  "万元": "万元", "亿元": "亿元", "元": "元", "公里": "公里", "层": "层", "台": "台"
};
// 预排序：长单位优先，避免 "个" 抢在 "个百分点" 前面
const UNIT_KEYS_SORTED = Object.keys(UNIT_CANON).sort((a, b) => b.length - a.length);
const UNIT_FAMILY = {
  "分钟": "分钟|min|mins", "小时": "小时|h|hr", "毫秒": "毫秒|ms", "秒": "秒|s",
  "天": "天|d", "KB": "KB|kb", "MB": "MB|mb", "GB": "GB|gb", "%": "%|％|个百分点|百分比"
};
function unitPattern(unit) { return UNIT_FAMILY[unit] || unit; }

function norm(text) {
  return String(text == null ? "" : text)
    .normalize("NFKC")
    .replace(/[​-‏﻿]/g, "")
    .replace(/[ \t ]+/g, "")
    .replace(/≤/g, "<=").replace(/≥/g, ">=")
    .replace(/[–—−]/g, "-")
    .replace(/％/g, "%")
    .toLowerCase();
}

function num(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return String(n);
  return String(v);
}

// 粗略 token 估算：CJK 一字符≈1 token，ASCII 约 3.6 字符≈1 token（对齐 prelude.js 口径）
function estimateTokens(text) {
  const s = String(text == null ? "" : text);
  let cjk = 0, ascii = 0;
  for (const ch of s) {
    if (ch.codePointAt(0) > 0x2e7f) cjk += 1; else ascii += 1;
  }
  return Math.ceil(cjk + ascii / 3.6);
}

const STRONG_NEG = ["不满足", "不等于", "不能", "不得", "禁止", "无法", "没有", "缺少", "缺", "未能", "尚未", "未定", "未知", "不确定", "未验证", "不计", "排除", "不支持", "不具备", "不建议", "不再", "不做", "不测", "不承诺", "不宣布", "不提供", "不保证"];
const DECISION_LABELS = [
  ["结论", "strong"], ["一句话结论", "strong"], ["建议", "strong"], ["推荐", "strong"],
  ["决定", "strong"], ["根因", "strong"], ["直接原因", "strong"], ["影响范围", "strong"],
  ["判定标准", "strong"], ["判定原则", "strong"], ["验收", "strong"], ["取舍", "strong"],
  ["裁决", "strong"], ["定性", "strong"], ["定位", "medium"], ["门槛", "medium"],
  ["假设", "medium"], ["前提", "medium"], ["必须", "medium"], ["不能", "medium"],
  ["本期做", "medium"], ["本期不做", "medium"], ["收工条件", "strong"], ["硬标准", "strong"],
  ["错价敞口", "strong"], ["风险敞口", "strong"],
  ["验收标准", "strong"], ["回滚条件", "strong"], ["回滚方案", "strong"],
  ["口径定义", "strong"], ["口径", "medium"]
];
// 长度降序，保证「验收标准」先于「验收」命中；循环内命中即 break
const DECISION_LABELS_SORTED = DECISION_LABELS.slice().sort((a, b) => b[0].length - a[0].length);
const CONFLICT_WORDS = ["冲突", "矛盾", "不一致", "互相排斥", "相互排斥", "排斥", "伪二分", "不能同时成立", "无法同时成立", "相悖", "对立", "口径不同", "误导", "不匹配", "对不上", "打架"];
const APPROX_WORDS = /(约|大约|大概|近似|≈|近|左右|量级|粗估|粗略|估算|推算|外推|以上|至少)/;
const CHROME_LINE = /^(用量\s|.*tok\/s|.*缓存命中|v\d+\.\d+|¥|deepseek|Max$|\d+%$|\d+\s*轮\s*\d+\s*步|已完成|发消息或创建任务|角色|小鲸鱼|导入|大小|音效|气泡|避让|宽度|px$|吸附|自定义|隐藏菜单|资源管理|管理$|- = )/;
const ID_PATTERNS = [
  ["session", /session-[0-9a-f]{8}-[0-9a-f-]{8,}/gi],
  ["path", /[A-Za-z]:\\[^\s，。；、）)"']+/g],
  ["url", /https?:\/\/[^\s，。；）)]+/g],
  ["host", /\b(?:edge|node|chat|conv|file|host|lb|cdn)-\d+\b/gi],
  ["tick", /\x60[^\x60\n]{2,60}\x60/g],
  ["snake", /\b[a-z][a-z0-9]*(?:_[a-z0-9]+){1,4}\b/gi],
  ["file", /\b[a-z0-9][a-z0-9-]*\.(?:ya?ml|json|md|pem|log|txt|js|ts|sqlite|db)\b/gi],
  ["errcode", /\b(?:unknown_ca|bad_certificate|upstream_ssl_error|no live upstreams|no healthy upstream|x509:[a-z ]+)\b/gi],
  ["httpcode", /\b(?:495|496|502|503|504)\b/g],
  ["metric", /\b(?:p9[059]|p99|qps|sla|rto|rpo|tps|ttl|swr)\b/gi]
];
const VERSION_PATTERNS = [/\bv\d+(?:\.\d+){1,3}\b/gi, /\bV[123]\b/g, /\bschema\s*v\d+\b/gi, /\bD\d+(?:-\d+)?\b/g];
const DATE_PATTERNS = [
  ["clock", /\b(?:[01]?\d|2[0-3]):[0-5]\d\b/g],
  ["date", /\b\d{1,2}\/\d{1,2}(?:\s+\d{1,2}:\d{2})?\b/g],
  ["isodate", /\b\d{4}-\d{2}-\d{2}\b/g],
  ["day", /第\s*\d+\s*[天周]|\bD\d+(?:[-–]\d+)?\b/g],
  ["weekday", /周[一二三四五六日天]/g],
  ["relative", /本周|上周|下周|今天|当天|次日|下期|本期|当期|月底|季末/g]
];

function overlaps(a, b) { return a.start < b.end && b.start < a.end; }

// maxClause>0 时，超长句继续按 ，、： 切子句（偏移保持全局正确）
// 每个分段都带 sentStart/sentEnd（父句区间），供整句渲染与父句去重
function splitWithOffsets(text, maxClause) {
  const out = [];
  const re = /[^。！？；!?;\n]+[。！？；!?;]?/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const raw = m[0];
    if (!raw.trim()) continue;
    const lead = raw.length - raw.trimStart().length;
    const sent = { text: raw.trim(), start: m.index + lead, end: m.index + raw.length };
    const limit = maxClause || 0;
    if (limit > 0 && sent.text.length > limit) {
      const cre = /[^，,、：:]+[，,、：:]?/g;
      let c;
      while ((c = cre.exec(sent.text)) !== null) {
        const craw = c[0];
        if (!craw.trim()) continue;
        const clead = craw.length - craw.trimStart().length;
        out.push({
          text: craw.trim(),
          start: sent.start + c.index + clead,
          end: sent.start + c.index + craw.length,
          clause: true,
          sentStart: sent.start, sentEnd: sent.end
        });
      }
    } else {
      sent.sentStart = sent.start;
      sent.sentEnd = sent.end;
      out.push(sent);
    }
  }
  return out;
}

function unitOf(raw) {
  const m = String(raw).match(/[a-zA-Z%]+$|[一-鿿]+$/);
  if (!m) return "";
  const tail = m[0].toLowerCase();
  if (UNIT_CANON[tail]) return UNIT_CANON[tail];
  for (const key of UNIT_KEYS_SORTED) { // 长单位优先
    if (tail.endsWith(key.toLowerCase())) return UNIT_CANON[key];
  }
  return "";
}

function makeAnchor(cat, display, start, end, sentence, msg, extra) {
  const a = { cat, display: String(display).trim(), start, end, sentence, msg: msg.index, role: msg.role, turn: msg.turn };
  if (extra) Object.assign(a, extra);
  a.flags = a.flags || [];
  return a;
}

function extractMessageAnchors(msg, opts) {
  // 锚点抽取按整句进行（不用子句切分）——hypothetical / approx / 句首排除等上下文判定需要完整句子
  const out = [];
  const sentences = splitWithOffsets(msg.text, 0);
  for (let si = 0; si < sentences.length; si += 1) {
    const seg = sentences[si];
    const lineStart = msg.text.lastIndexOf("\n", Math.max(0, seg.start - 1)) + 1;
    const lineEndRaw = msg.text.indexOf("\n", seg.start);
    const line = msg.text.slice(lineStart, lineEndRaw === -1 ? msg.text.length : lineEndRaw);
    const chromeLine = line.trim();
    const shortChrome = chromeLine.length <= 40 && /^(\d+%|¥\s*\d+|v\d+\.\d+|\d+\.?\d*\s*K?\s*tok.*|.*tok\/s.*|\d+\s*轮\s*\d+\s*步.*|已完成.*)$/.test(chromeLine);
    if (shortChrome || (CHROME_LINE.test(chromeLine) && /tok|缓存命中|轮\s*\d+\s*步|¥|v\d+\.\d+/.test(line))) {
      out.push(makeAnchor("chrome", seg.text.slice(0, 40), seg.start, seg.end, seg.text, msg, { tier: "C", flags: ["ui_chrome"], confidence: 0.2 }));
      continue;
    }
    const consumed = [];

    for (const pair of ID_PATTERNS) {
      const kind = pair[0], re = pair[1];
      re.lastIndex = 0; let m;
      while ((m = re.exec(seg.text)) !== null) {
        const s = m.index, e = m.index + m[0].length;
        if (consumed.some((c) => overlaps({ start: s, end: e }, c))) continue;
        consumed.push({ start: s, end: e, kind });
        out.push(makeAnchor("id", m[0], seg.start + s, seg.start + e, seg.text, msg, {
          idKind: kind, canon: norm(m[0]), tier: kind === "metric" || kind === "httpcode" ? "B" : "A", confidence: 0.95,
          flags: kind === "httpcode" ? ["status_code"] : []
        }));
      }
    }
    for (const pair of DATE_PATTERNS) {
      const kind = pair[0], re = pair[1];
      re.lastIndex = 0; let m;
      while ((m = re.exec(seg.text)) !== null) {
        const s = m.index, e = m.index + m[0].length;
        if (consumed.some((c) => overlaps({ start: s, end: e }, c))) continue;
        consumed.push({ start: s, end: e });
        const relDay = kind === "day" && /^第/.test(m[0]);
        out.push(makeAnchor("datetime", m[0], seg.start + s, seg.start + e, seg.text, msg, {
          timeKind: kind, canon: norm(m[0]),
          tier: (kind === "relative" || relDay) ? "B" : "A",
          flags: (kind === "relative" || relDay) ? ["relative_time"] : [], confidence: 0.9
        }));
      }
    }
    const boundRe = new RegExp("(?:(P9[059]|P99|QPS|TTL)[^，。；\\n]{0,10})?(<=|>=|≤|≥|<|>|不超过|不低于|不高于|至少|最多|上限为|下限为|上限|下限)\\s*(?:为|是|:|：)?\\s*(\\d+(?:\\.\\d+)?)\\s*(" + UNITS + ")", "gi");
    boundRe.lastIndex = 0; let bm;
    while ((bm = boundRe.exec(seg.text)) !== null) {
      const s = bm.index, e = bm.index + bm[0].length;
      if (consumed.some((c) => overlaps({ start: s, end: e }, c) && c.kind !== "metric" && c.kind !== "httpcode")) continue;
      consumed.push({ start: s, end: e });
      const unit = unitOf(bm[4]);
      const canon = (bm[1] ? bm[1].toLowerCase() : "") + bm[2].replace(/\s/g, "") + num(bm[3]) + unit;
      out.push(makeAnchor("constraint", bm[0], seg.start + s, seg.start + e, seg.text, msg, {
        num: num(bm[3]), unit, canon, comparator: bm[2], metric: bm[1] || "",
        tier: "A", confidence: 1, flags: []
      }));
    }
    // 无单位约束兜底（"不超过 500"），tier-B，避免与有单位版重复
    const boundBareRe = new RegExp("(<=|>=|不超过|不低于|不高于|至少|最多|上限为|下限为|上限|下限)\\s*(?:为|是|:|：)?\\s*(\\d+(?:\\.\\d+)?)(?!\\s*(?:" + UNITS + "))(?!\\s*\\d)", "gi");
    boundBareRe.lastIndex = 0; let bb;
    while ((bb = boundBareRe.exec(seg.text)) !== null) {
      const s = bb.index, e = bb.index + bb[0].length;
      if (consumed.some((c) => overlaps({ start: s, end: e }, c))) continue;
      consumed.push({ start: s, end: e });
      out.push(makeAnchor("constraint", bb[0], seg.start + s, seg.start + e, seg.text, msg, {
        num: num(bb[2]), unit: "", canon: bb[1].replace(/\s/g, "") + num(bb[2]),
        comparator: bb[1], metric: "", tier: "B", confidence: 0.7, flags: ["unitless"]
      }));
    }
    // 后置比较级约束（"200ms 以内"、"95% 以上"），tier-A；需在 numRe 之前消费区间
    const postBoundRe = new RegExp("(\\d+(?:\\.\\d+)?)\\s*(" + UNITS + ")\\s*(以内|之内|以下|以上)", "gi");
    postBoundRe.lastIndex = 0; let pb;
    while ((pb = postBoundRe.exec(seg.text)) !== null) {
      const s = pb.index, e = pb.index + pb[0].length;
      if (consumed.some((c) => overlaps({ start: s, end: e }, c))) continue;
      consumed.push({ start: s, end: e });
      const unit = unitOf(pb[2]);
      out.push(makeAnchor("constraint", pb[0], seg.start + s, seg.start + e, seg.text, msg, {
        num: num(pb[1]), unit, canon: num(pb[1]) + unit + pb[3],
        comparator: pb[3], metric: "", tier: "A", confidence: 0.9, flags: ["post_bound"]
      }));
    }
    const transRe = new RegExp("(?:从|由)?\\s*(\\d+(?:\\.\\d+)?)\\s*(" + UNITS + ")\\s*(?:→|->|降到|降至|改成|改为|变成|提升到|提高到|压缩到|砍到|到)\\s*(\\d+(?:\\.\\d+)?)\\s*(" + UNITS + ")", "gi");
    transRe.lastIndex = 0; let tm;
    while ((tm = transRe.exec(seg.text)) !== null) {
      const s = tm.index, e = tm.index + tm[0].length;
      if (consumed.some((c) => overlaps({ start: s, end: e }, c))) continue;
      consumed.push({ start: s, end: e });
      const u1 = unitOf(tm[2]), u2 = unitOf(tm[4]);
      const hypothetical = /还是|是否|如果|假设|若|要么/.test(seg.text);
      // s/e 本就是相对 seg.text 的偏移，直接 slice(e)
      const seq = /^\s*(?:→|->)/.test(seg.text.slice(e));
      out.push(makeAnchor("transition", tm[0], seg.start + s, seg.start + e, seg.text, msg, {
        num: num(tm[1]), unit: u1, num2: num(tm[3]), unit2: u2, tier: "A", confidence: hypothetical ? 0.6 : 0.95,
        canon: num(tm[1]) + u1 + "->" + num(tm[3]) + u2,
        flags: (u1 !== u2 && u1 !== "个" ? ["mixed_unit"] : []).concat(hypothetical ? ["hypothetical"] : []).concat(seq ? ["sequence_truncated"] : [])
      }));
    }
    const rangeRe = new RegExp("(\\d+(?:\\.\\d+)?)\\s*(?:-|–|—|~|至|到)\\s*(\\d+(?:\\.\\d+)?)\\s*(" + UNITS + ")", "gi");
    rangeRe.lastIndex = 0; let rm;
    while ((rm = rangeRe.exec(seg.text)) !== null) {
      const s = rm.index, e = rm.index + rm[0].length;
      if (consumed.some((c) => overlaps({ start: s, end: e }, c))) continue;
      consumed.push({ start: s, end: e });
      const unit = unitOf(rm[3]);
      out.push(makeAnchor("range", rm[0], seg.start + s, seg.start + e, seg.text, msg, {
        num: num(rm[1]), num2: num(rm[2]), unit, canon: num(rm[1]) + "-" + num(rm[2]) + unit,
        tier: "A", confidence: 0.9, flags: []
      }));
    }
    for (const re of VERSION_PATTERNS) {
      re.lastIndex = 0; let m;
      while ((m = re.exec(seg.text)) !== null) {
        const s = m.index, e = m.index + m[0].length;
        if (consumed.some((c) => overlaps({ start: s, end: e }, c))) continue;
        consumed.push({ start: s, end: e });
        out.push(makeAnchor("version", m[0], seg.start + s, seg.start + e, seg.text, msg, {
          canon: norm(m[0]), tier: "B", confidence: 0.85, flags: ["version_token"]
        }));
      }
    }
    const numRe = new RegExp("(\\d+(?:\\.\\d+)?)\\s*(" + UNITS + ")", "gi");
    numRe.lastIndex = 0; let nm;
    while ((nm = numRe.exec(seg.text)) !== null) {
      const s = nm.index, e = nm.index + nm[0].length;
      if (consumed.some((c) => overlaps({ start: s, end: e }, c))) continue;
      consumed.push({ start: s, end: e });
      const unit = unitOf(nm[2]);
      const approx = APPROX_WORDS.test(seg.text);
      out.push(makeAnchor("number", nm[0], seg.start + s, seg.start + e, seg.text, msg, {
        num: num(nm[1]), unit, canon: num(nm[1]) + unit, tier: "B", confidence: 0.9,
        flags: approx ? ["approx"] : []
      }));
    }
    const symRe = /\b\d+(?:\.\d+)?\s*[-−+]\s*[A-Za-z一-鿿]{1,8}\s*[-−+]\s*[A-Za-z一-鿿]{1,12}/g;
    symRe.lastIndex = 0; let sm;
    while ((sm = symRe.exec(seg.text)) !== null) {
      const s = sm.index, e = sm.index + sm[0].length;
      if (consumed.some((c) => overlaps({ start: s, end: e }, c))) continue;
      consumed.push({ start: s, end: e });
      out.push(makeAnchor("symbolic", sm[0], seg.start + s, seg.start + e, seg.text, msg, {
        canon: norm(sm[0]), tier: "B", confidence: 0.7, flags: ["symbolic_formula"]
      }));
    }
    const cnRe = /([一二两三四五六七八九十百千万半]+)\s*(个工作日|工作日|个月|分钟|小时|天|周|倍|半)|([二三四五六七八九十两]+)\s*(条)/g;
    cnRe.lastIndex = 0; let cm;
    while ((cm = cnRe.exec(seg.text)) !== null) {
      const s = cm.index, e = cm.index + cm[0].length;
      const cnNum = cm[1] || cm[3];
      const cnUnit = cm[2] || cm[4];
      if (!cnNum || !cnUnit) continue;
      if (consumed.some((c) => overlaps({ start: s, end: e }, c))) continue;
      if (/(.)\1/.test(cnNum) && cnNum !== "一半") continue;
      consumed.push({ start: s, end: e });
      const scope = /只有|只做|必须|不能|最多|至少|仅|两周|周内|天内/.test(seg.text) || msg.role === "user";
      const timeUnit = /周|天|个工作日|个月|小时|分钟/.test(cnUnit);
      out.push(makeAnchor("cn_numeral", cm[0], seg.start + s, seg.start + e, seg.text, msg, {
        canon: norm(cm[0]), tier: scope && timeUnit ? "A" : "B", confidence: 0.75,
        flags: ["cn_numeral"].concat(/半/.test(cnNum) ? ["vague_quantity"] : [])
      }));
    }
    for (const pair of DECISION_LABELS_SORTED) { // 长度降序 + 命中即 break，避免「验收」/「验收标准」双发
      const label = pair[0], strength = pair[1];
      let idx = -1;
      const head = seg.text.replace(/^#+\s*/, "").replace(/^\d+[.、]\s*/, "");
      const headOffset = seg.text.length - head.length;
      if (head.startsWith(label)) idx = headOffset;
      if (idx === -1) {
        const bold = seg.text.indexOf("**" + label);
        if (bold !== -1) idx = bold + 2;
      }
      if (idx === -1) {
        const tabbed = seg.text.indexOf("\t" + label + "：");
        if (tabbed !== -1) idx = tabbed + 1;
        else {
          const tabbed2 = seg.text.indexOf("\t" + label + ":");
          if (tabbed2 !== -1) idx = tabbed2 + 1;
        }
      }
      if (idx === -1) continue;
      if (/[？?]\s*$/.test(seg.text)) continue;
      if (msg.role === "user" && /^(请|列|给|说|指|整|按|补|把|如果|我们准备)/.test(seg.text.trim())) continue;
      const before = seg.text.slice(0, idx);
      const atStart = !before.trim() || /[。！？；:：\n]$/.test(before.trim());
      if (!atStart && strength !== "strong") continue;
      const payloadStart = idx + label.length;
      const payload = seg.text.slice(payloadStart).replace(/^[：:\s*]+/, "").slice(0, 44);
      if (payload.length < 4) continue;
      if (/^[和与及、；。，的]/.test(payload)) continue;
      if (/^(哪些|什么|怎么|是否|多少)/.test(payload)) continue;
      const s = idx, e = Math.min(seg.text.length, payloadStart + payload.length);
      const heading = /^(到底|是|在|哪|什么|和|与|还|有|按|这|那)/.test(payload) || payload.length < 8;
      out.push(makeAnchor("decision", label + "：" + payload, seg.start + s, seg.start + e, seg.text, msg, {
        label, strength, canon: norm(label), tier: strength === "strong" && !heading ? "A" : "B",
        confidence: heading ? 0.5 : (strength === "strong" ? 0.95 : 0.7), flags: heading ? ["topic_heading"] : []
      }));
      break; // 每句只取一个决策标签（最长的那个）
    }
    for (const word of CONFLICT_WORDS) {
      const idx = seg.text.indexOf(word);
      if (idx === -1) continue;
      const s = idx, e = idx + word.length;
      if (consumed.some((c) => overlaps({ start: s, end: e }, c))) continue;
      const after = seg.text.slice(e, e + 4);
      const isFeature = word === "冲突" && /^(审阅|检测|清单|面板|列表|裁决|并列)/.test(after);
      consumed.push({ start: s, end: e });
      out.push(makeAnchor("conflict", word, seg.start + s, seg.start + e, seg.text, msg, {
        word, canon: norm(word), tier: isFeature ? "B" : "A", confidence: isFeature ? 0.6 : 0.9,
        flags: isFeature ? ["feature_name"] : []
      }));
      break;
    }
    const negRe = /(不满足|不等于|不能|不得|禁止|无法|没有|缺少|缺|未能|尚未|未定|未知|不确定|未验证|不计|排除|不支持|不具备|不建议|不再|不做|不测|不承诺|不宣布|不提供|不保证|不仅|不但|不只|不过|不得不|不|未|没|无|非)/g;
    negRe.lastIndex = 0; let gm;
    while ((gm = negRe.exec(seg.text)) !== null) {
      const marker = gm[1];
      const s = gm.index, e = s + marker.length;
      if (consumed.some((c) => overlaps({ start: s, end: e }, c))) continue;
      if (/^(不仅|不但|不只|不过|无论|不管)$/.test(marker)) continue;
      // object 在第一个标点处截断——不带尾随标点，避免渲染拼接（；/。）后存活判定失真
      const object = seg.text.slice(e, e + 24).replace(/^[，,、\s：:]+/, "").split(/[，,。；;：:、！？!?]/)[0].slice(0, 16);
      if (object.length < 2) continue;
      if (marker === "不" && /^(同|断|仅|但|过|管|论|如|久|少|得|妨|由|外|光|止|再)/.test(object)) continue;
      if (marker === "无" && /^(论|数|人|需|关|法|限)/.test(object)) continue;
      if (marker === "非" && object.startsWith("常")) continue;
      if (marker === "未" && object.startsWith("来")) continue;
      const near = out.filter((a) => a.msg === msg.index && Math.abs(a.start - (seg.start + s)) <= 14 && a.tier === "A");
      const strong = STRONG_NEG.indexOf(marker) !== -1;
      const keyObject = /证据|基线|归零|修复|确认|数据|迁移|权限|预览|降级|写入|覆盖|回滚|根因|方案|结论/.test(object);
      out.push(makeAnchor("negation", marker + object, seg.start + s, seg.start + e + object.length, seg.text, msg, {
        marker, object, canon: norm(marker + object),
        tier: strong && (near.length > 0 || keyObject) ? "A" : "B",
        confidence: strong ? 0.9 : 0.55,
        flags: near.length ? ["polarity_pair"] : [],
        polarityWith: near.length ? near[0].display : ""
      }));
    }
  }
  return out;
}

function extractAnchors(messages, opts) {
  const all = [];
  for (let i = 0; i < messages.length; i += 1) {
    const msg = { index: i, role: messages[i].role, turn: messages[i].turn, text: messages[i].text };
    for (const a of extractMessageAnchors(msg, opts)) all.push(a);
  }
  return all;
}

function uniqueAnchors(anchors) {
  const map = new Map();
  for (const a of anchors) {
    if (a.cat === "chrome") continue;
    const key = a.cat + "|" + (a.canon || norm(a.display));
    if (!map.has(key)) map.set(key, Object.assign({}, a, { occurrences: 1 }));
    else map.get(key).occurrences += 1;
  }
  return Array.from(map.values());
}

const SPECIAL = ".*+?^$()[]{}|\\";
function escapeRe(s) {
  let out = "";
  for (const ch of String(s)) out += SPECIAL.indexOf(ch) >= 0 ? "\\" + ch : ch;
  return out;
}

function quantityAt(n, unit, d) {
  const re = unit
    ? new RegExp("(?<!\\d)" + escapeRe(n) + "\\s*(?:" + unitPattern(unit) + ")", "i")
    : new RegExp("(?:<=|>=|<|>|不超过|不低于|至少|最多|上限|下限)?\\s*(?<!\\d)" + escapeRe(n) + "(?!\\d)", "i"); // 补左边界，"1500" 不再让 "500" 误判存活
  return re.test(d);
}

// 阈值从 opts 读取，缺省回落到 CONFIG
function survives(a, digestNorm, opts) {
  const d = digestNorm;
  const decisionTh = (opts && opts.decisionTh) || CONFIG.DECISION_TH;
  const conflictTh = (opts && opts.conflictTh) || CONFIG.CONFLICT_TH;
  switch (a.cat) {
    case "constraint": {
      if (!a.unit) return quantityAt(a.num, "", d);
      const u = unitPattern(a.unit);
      const rePre = new RegExp("(?:<=|>=|<|>|不超过|不低于|不高于|至少|最多|上限|下限|降到|降至).{0,10}?(?<!\\d)" + escapeRe(a.num) + "\\s*(?:" + u + ")", "i");
      if (rePre.test(d)) return true;
      // 后置比较级（"200ms 以内"、"95% 以上"）的存活判定
      const rePost = new RegExp("(?<!\\d)" + escapeRe(a.num) + "\\s*(?:" + u + ")\\s*(?:以内|之内|以下|以上)", "i");
      return rePost.test(d);
    }
    case "range": {
      const u = unitPattern(a.unit);
      const re = new RegExp(escapeRe(a.num) + "\\s*(?:-|~|至|到).{0,3}?" + escapeRe(a.num2) + "\\s*(?:" + u + ")", "i");
      return re.test(d);
    }
    case "transition": {
      const q1 = quantityAt(a.num, a.unit, d);
      const q2 = quantityAt(a.num2, a.unit2, d);
      if (!(q1 && q2)) return false;
      if (opts && opts.strictTransitionOrder) { // 可选：要求原顺序出现，防误报
        const i1 = d.search(new RegExp(escapeRe(a.num) + "\\s*(?:" + unitPattern(a.unit) + ")", "i"));
        const i2 = d.search(new RegExp(escapeRe(a.num2) + "\\s*(?:" + unitPattern(a.unit2) + ")", "i"));
        return i1 !== -1 && i2 !== -1 && i1 < i2;
      }
      return true;
    }
    case "number": return quantityAt(a.num, a.unit, d);
    case "datetime": return d.indexOf(norm(a.display)) !== -1;
    case "id": return d.indexOf(norm(a.display)) !== -1;
    case "version": return d.indexOf(norm(a.display)) !== -1;
    case "symbolic": return d.indexOf(norm(a.display).slice(0, 8)) !== -1;
    case "cn_numeral": return d.indexOf(norm(a.display)) !== -1;
    case "conflict": {
      const word = norm(a.word);
      let from = d.indexOf(word);
      while (from !== -1) {
        const win = d.slice(Math.max(0, from - 120), from + 200);
        if (bigramOverlap(a.sentence, win, 260) >= conflictTh) return true;
        from = d.indexOf(word, from + 1);
      }
      return false;
    }
    case "decision": {
      if (d.indexOf(norm(a.label)) === -1) return false;
      const payload = a.display.split("：").slice(1).join("：");
      return bigramOverlap(payload, d, 240) >= decisionTh;
    }
    case "negation": {
      // objHead 剥离标点再取头部：渲染拼接（；/剥离句尾。）不影响存活判定
      const objHead = norm(a.object).replace(/[，,。；;：:、！？!?\s]/g, "").slice(0, 4);
      return d.indexOf(norm(a.marker)) !== -1 && (objHead.length < 2 || d.indexOf(objHead) !== -1);
    }
    default: return d.indexOf(norm(a.display)) !== -1;
  }
}

function bigramOverlap(phrase, digestNorm, windowSize) {
  const p = norm(phrase).replace(/[，,。；;：:、（）()「」“”"'*]/g, "");
  if (p.length < 2) return 0;
  const grams = new Set();
  for (let i = 0; i < p.length - 1; i += 1) grams.add(p.slice(i, i + 2));
  if (grams.size === 0) return 0;
  const size = windowSize || 240;
  let best = 0;
  for (let start = 0; start < Math.max(1, digestNorm.length - 2); start += 6) {
    const win = digestNorm.slice(start, start + size);
    let hit = 0;
    for (const g of grams) if (win.indexOf(g) !== -1) hit += 1;
    best = Math.max(best, hit / grams.size);
    if (best === 1) break;
  }
  return best;
}

function summarize(anchors) {
  const counts = {};
  for (const a of anchors) counts[a.cat] = (counts[a.cat] || 0) + 1;
  return counts;
}

function flagSummary(anchors) {
  const flags = {};
  for (const a of anchors) for (const f of a.flags || []) flags[f] = (flags[f] || 0) + 1;
  return flags;
}

const CAT_WEIGHT = {
  constraint: 9, conflict: 9, decision: 7, transition: 7, range: 6,
  datetime: 6, id: 6, negation: 5, cn_numeral: 4, number: 2, version: 2, symbolic: 3
};

function anchorKey(a) { return a.cat + "|" + (a.canon || norm(a.display)); }

// 父句键：同一句话切出的多个子句共享同一个父句
function parentKey(s) { return s.msg + ":" + (s.sentStart != null ? s.sentStart : s.start); }

// 剥离画布注入的提示词包装（只锚定开头，正文不动）
function stripPromptMeta(t) {
  return String(t == null ? "" : t)
    .replace(/^请只基于下面的上下文回答[，,]?不要调用工具[。.\s]*/u, "")
    .replace(/^请只基于[^\n]{0,80}\n+/u, "")
    .trim();
}

function collectSentences(messages, anchors, opts) {
  const clauseMax = (opts && opts.clauseMax) || CONFIG.CLAUSE_MAX;
  // 按消息预分组锚点，避免 句子×锚点 双重循环
  const byMsg = new Map();
  for (const a of anchors) {
    if (!byMsg.has(a.msg)) byMsg.set(a.msg, []);
    byMsg.get(a.msg).push(a);
  }
  const out = [];
  for (let mi = 0; mi < messages.length; mi += 1) {
    const msg = messages[mi];
    const msgAnchors = byMsg.get(mi) || [];
    if (msgAnchors.length === 0) continue;
    const dnCache = new Map(); // 同一父句的 norm 只算一次
    for (const seg of splitWithOffsets(msg.text, clauseMax)) {
      const inSeg = msgAnchors.filter((a) => a.start >= seg.start && a.start < seg.end);
      if (inSeg.length === 0) continue;
      // 父句全文：子句只用于选句打分，渲染一律回到整句。
      // meta 剥离在这里做一次——记账（survKeys）、计费、渲染看到的必须是同一份文本
      const fullText = stripPromptMeta(msg.text.slice(seg.sentStart, seg.sentEnd)).replace(/\s+/g, " ").trim();
      const item = {
        text: seg.text.replace(/\s+/g, " ").trim(),
        fullText,
        msg: mi, turn: msg.turn, role: msg.role,
        start: seg.start, // 记录偏移，供 renderLines 正确排序
        sentStart: seg.sentStart,
        anchors: inSeg,
        tierA: inSeg.filter((a) => a.tier === "A"),
        score: inSeg.reduce((s, a) => s + (a.tier === "A" ? (CAT_WEIGHT[a.cat] || 2) : 0.5), 0)
      };
      // survKeys：该句「整句渲染后」确实能存活的 tier-A 锚点（key -> 权重）。
      // 记账只认 survKeys，不再只按锚点 key 记账——floor/覆盖与最终渲染对齐。
      let dn = dnCache.get(seg.sentStart);
      if (dn === undefined) { dn = norm(fullText); dnCache.set(seg.sentStart, dn); }
      const surv = new Map();
      for (const a of item.tierA) {
        const k = anchorKey(a);
        if (!surv.has(k) && survives(a, dn, opts)) surv.set(k, CAT_WEIGHT[a.cat] || 2);
      }
      item.survKeys = surv;
      if (fullText) out.push(item); // meta 剥光后为空整句：无渲染价值，直接丢弃（其锚点由终验诚实报为未覆盖）
    }
  }
  // 全文 norm 作为去重键，不再截断 32 字
  const seen = new Set();
  return out.filter((s) => {
    const key = norm(s.text);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function tag(srcKey, s) {
  const prefix = srcKey ? srcKey + "·" : "";
  return "[" + prefix + "轮" + s.turn + "·" + (s.role === "user" ? "用户" : "助手") + "] ";
}

// 贪心核心：greedyCover 与 floorFor 共用
// scoreFn(s) -> 新增收益；costFn(s) -> 成本；withinBudget(total, c) -> 是否还可选
// onPick(s)：选中后的回调（供调用方登记父句计费、覆盖记账等状态）
function pickGreedy(sentences, scoreFn, costFn, withinBudget, maxIter, onPick) {
  const picked = [];
  const used = new Set();
  let total = 0;
  let guard = 0;
  const limit = maxIter || 500;
  while (guard++ < limit) {
    let best = null, bestRatio = 0;
    for (const s of sentences) {
      if (used.has(s)) continue;
      const c = costFn(s);
      if (!withinBudget(total, c)) continue;
      const g = scoreFn(s);
      if (g <= 0) continue;
      const r = g / c;
      if (r > bestRatio) { bestRatio = r; best = s; }
    }
    if (!best) break;
    picked.push(best); used.add(best); total += costFn(best);
    if (onPick) onPick(best);
  }
  return { picked, total };
}

function greedyCover(sentences, budget, srcKey, opts) {
  const useTokens = opts && opts.budgetTokens;
  const limit = useTokens ? opts.budgetTokens : budget;
  const covered = new Set();
  const measure = useTokens ? estimateTokens : (t) => t.length;
  // 成本按父句去重：同一句话的子句第一个计整句成本，其余边际成本≈0
  const claimed = new Set();
  // 注意：fullText 可能为已剥离的空串之外的任何字符串，用 != null 而非 ||（空串是合法值）
  const textOf = (s) => (s.fullText != null ? s.fullText : s.text);
  const fullCost = (s) => measure(textOf(s)) + measure(tag(srcKey, s)) + 3;
  const cost = (s) => claimed.has(parentKey(s)) ? 1 : fullCost(s);
  const claim = (s) => claimed.add(parentKey(s));
  const allA = new Set();
  for (const s of sentences) for (const a of s.tierA) allA.add(anchorKey(a));
  // 收益只认 survKeys（整句渲染后确实存活的锚点），避免「记账覆盖、渲染丢失」
  const keysOf = (s) => s.survKeys ? Array.from(s.survKeys.keys()) : s.tierA.map(anchorKey);
  const gain = (s) => {
    let g = 0;
    if (s.survKeys) {
      for (const pair of s.survKeys) if (!covered.has(pair[0])) g += pair[1];
    } else {
      for (const a of s.tierA) {
        const k = anchorKey(a);
        if (!covered.has(k)) g += (CAT_WEIGHT[a.cat] || 2);
      }
    }
    return g;
  };
  const margin = opts && opts.margin ? opts.margin : 0.95;
  const { picked, total } = pickGreedy(
    sentences, gain, cost,
    (t, c) => t + c <= limit * margin,
    500, claim
  );
  for (const s of picked) for (const k of keysOf(s)) covered.add(k);
  let running = total;
  const usedSet = new Set(picked);
  if (!(opts && opts.fill === false)) {
    // 每轮保底：覆盖阶段后仍无代表句的轮次，先补一句该轮最高分句，再做全局 fill
    if (!(opts && opts.turnFloor === false)) {
      const coveredTurns = new Set(picked.map((s) => s.turn));
      const byTurn = new Map();
      for (const s of sentences) {
        if (usedSet.has(s) || coveredTurns.has(s.turn)) continue;
        const cur = byTurn.get(s.turn);
        if (!cur || s.score > cur.score) byTurn.set(s.turn, s);
      }
      if (byTurn.size <= 24) { // 轮次过多时保底会吃光预算，退回纯全局 fill
        for (const turn of Array.from(byTurn.keys()).sort((a, b) => a - b)) {
          const s = byTurn.get(turn);
          const c = cost(s);
          if (running + c > limit) continue;
          s._fill = true;
          picked.push(s); usedSet.add(s); claim(s); running += c;
          for (const k of keysOf(s)) covered.add(k);
        }
      }
    }
    const fill = sentences
      .filter((s) => !usedSet.has(s))
      .sort((a, b) => b.score - a.score || a.text.length - b.text.length);
    for (const s of fill) {
      const c = cost(s);
      if (running + c > limit) continue;
      s._fill = true; // 标记填充句，超预算时可回退
      picked.push(s); usedSet.add(s); claim(s); running += c;
      for (const k of keysOf(s)) covered.add(k);
    }
  }
  const missed = Array.from(allA).filter((k) => !covered.has(k));
  return { picked, missed, total: running };
}

// 段尾标点清理：剥离 ，、：； 等悬挂标点，防止 "，。"、"、；" 这类粘连
function stripTail(t) { return String(t == null ? "" : t).replace(/[，,、：:；;\s]+$/u, ""); }

function joinParts(texts) {
  let out = "";
  for (const text of texts) {
    if (!out) out = text;
    else out = /[。！？!?]$/.test(out) ? out + text : out + "；" + text;
  }
  return out;
}

function renderLines(srcKey, picked, opts) {
  const joinMax = (opts && opts.groupJoinMax) || CONFIG.GROUP_JOIN_MAX;
  // 按 (msg, start) 排序，恢复对话原始顺序
  const ordered = picked.slice().sort((a, b) => a.msg - b.msg || (a.start || 0) - (b.start || 0));
  // 按父句去重 + 整句渲染：子句只用于选句，不再直接进摘要
  const seenParents = new Set();
  const units = [];
  for (const s of ordered) {
    const k = parentKey(s);
    if (seenParents.has(k)) continue;
    seenParents.add(k);
    units.push(s);
  }
  const groups = [];
  let current = null;
  for (const s of units) {
    const body = stripTail(s.fullText != null ? s.fullText : s.text); // meta 已在 collectSentences 剥离
    if (!body) continue; // 空整句跳过，不产出孤儿标签行
    if (!current || current.turn !== s.turn || current.role !== s.role) {
      current = { turn: s.turn, role: s.role, texts: [body] };
      groups.push(current);
      continue;
    }
    const candidate = joinParts(current.texts.concat([body]));
    if (candidate.length <= joinMax) current.texts.push(body);
    else {
      current = { turn: s.turn, role: s.role, texts: [body] };
      groups.push(current);
    }
  }
  return groups.map((group) => {
    const body = joinParts(group.texts);
    // 句末已有终止标点则不叠加 "。"
    return tag(srcKey, group) + body + (/[。！？!?]$/.test(body) ? "" : "。");
  }).join("\n");
}

function extractiveDigest(srcKey, messages, anchors, opts) {
  const o = opts || {};
  const sentences = collectSentences(messages, anchors, o);
  const cover = greedyCover(sentences, o.budget || 0, srcKey, o);
  let picked = cover.picked;
  let text = renderLines(srcKey, picked, o);
  // 渲染后实测：超预算则从尾部回退填充句，直到达标
  // 支持 token 口径；修剪后用 survives 重算 missed（填充句可能带走 tier-A 覆盖）
  const overshoot = () => (o.budgetTokens ? estimateTokens(text) > o.budgetTokens : (o.budget && text.length > o.budget));
  // 覆盖计数：某句可安全移除 <=> 它贡献的每个存活 key 都还有别的句兜底
  const coverCount = new Map();
  const bump = (s, d) => {
    if (!s.survKeys) return;
    for (const k of s.survKeys.keys()) coverCount.set(k, (coverCount.get(k) || 0) + d);
  };
  for (const s of picked) bump(s, 1);
  const redundant = (s) => {
    if (!s.survKeys) return true;
    for (const k of s.survKeys.keys()) if ((coverCount.get(k) || 0) <= 1) return false;
    return true;
  };
  let guard = 0;
  while (overshoot() && guard++ < 60) {
    let idx = -1;
    for (let i = picked.length - 1; i >= 0; i -= 1) if (picked[i]._fill) { idx = i; break; }
    if (idx === -1) { // 填充句耗尽后，退而移除冗余句（不再直接放弃）
      for (let i = picked.length - 1; i >= 0; i -= 1) if (redundant(picked[i])) { idx = i; break; }
    }
    if (idx === -1) break;
    bump(picked[idx], -1);
    picked.splice(idx, 1);
    text = renderLines(srcKey, picked, o);
  }
  const dn = norm(text);
  const repByKey = new Map();
  for (const a of anchors) {
    if (a.tier !== "A") continue;
    const k = anchorKey(a);
    if (!repByKey.has(k)) repByKey.set(k, a);
  }
  const seenK = new Set();
  const missed = [];
  for (const a of anchors) {
    if (a.tier !== "A") continue;
    const k = anchorKey(a);
    if (seenK.has(k)) continue;
    seenK.add(k);
    if (!survives(a, dn, o)) missed.push(k);
  }
  // missedDetail：机器 key + 人类可读信息（原文、出处）
  const missedDetail = missed.map((k) => {
    const a = repByKey.get(k);
    return a ? { key: k, cat: a.cat, display: a.display, turn: a.turn, role: a.role } : { key: k };
  });
  if (missed.length > 0 && o.strict) {
    // 人类可读追加：锚点原文 + 轮次 + 角色，不再是机器 key 列表
    const parts = missedDetail.slice(0, CONFIG.MISSED_APPEND_MAX).map((d) =>
      "「" + (d.display || d.key) + "」（轮" + d.turn + "·" + (d.role === "user" ? "用户" : "助手") + "）"
    );
    text += "\n**未覆盖锚点**（共 " + missed.length + " 项，建议人工补录）：" + parts.join("；") +
      (missed.length > CONFIG.MISSED_APPEND_MAX ? "；……" : "");
  }
  return { text, chars: text.length, tokens: estimateTokens(text), sentences: picked.length, missed, missedDetail };
}

const SECTIONS = [
  { key: "约束/区间", cats: ["constraint", "range", "transition"], weight: 9 },
  { key: "冲突", cats: ["conflict"], weight: 9 },
  { key: "决定/根因", cats: ["decision", "symbolic"], weight: 7 },
  { key: "否定/缺口", cats: ["negation"], weight: 5 },
  { key: "时间", cats: ["datetime"], weight: 6 },
  { key: "标识/版本", cats: ["id", "version"], weight: 6 },
  { key: "其他数字", cats: ["number", "cn_numeral"], weight: 3 }
];

function sectionedDigest(srcKey, messages, anchors, opts) {
  const o = opts || {};
  const budget = o.budget || 0;
  const sentences = collectSentences(messages, anchors, o);
  const bySection = new Map();
  for (const s of sentences) {
    let best = null, bestW = 0;
    for (const sec of SECTIONS) {
      const w = s.anchors.filter((a) => sec.cats.indexOf(a.cat) !== -1).reduce((x, a) => x + (a.tier === "A" ? CAT_WEIGHT[a.cat] || 2 : 0.5), 0);
      if (w > bestW) { bestW = w; best = sec; }
    }
    if (!best) continue;
    if (!bySection.has(best.key)) bySection.set(best.key, []);
    bySection.get(best.key).push({ s, w: bestW });
  }
  const order = SECTIONS.filter((sec) => bySection.has(sec.key));
  // 小节预算按锚点权重之和分配，而非句子条数
  const weightOf = (sec) => bySection.get(sec.key).reduce((n, x) => n + x.w, 0);
  const totalW = order.reduce((n, sec) => n + weightOf(sec), 0) || 1;
  const lines = [];
  let total = 0;
  const seenParents = new Set(); // 同一父句跨小节只渲染一次
  for (const sec of order) {
    const list = bySection.get(sec.key).sort((a, b) => b.w - a.w || a.s.text.length - b.s.text.length);
    const share = Math.min(budget, Math.max(120, Math.floor(budget * (weightOf(sec) / totalW))));
    let secUsed = 0;
    const secLines = [];
    for (const item of list) {
      const pk = parentKey(item.s);
      if (seenParents.has(pk)) continue;
      // 小节摘要同样整句渲染，不再输出子句片段；空句跳过
      const body = stripTail(item.s.fullText != null ? item.s.fullText : item.s.text);
      if (!body) continue;
      const line = tag(srcKey, item.s) + body;
      if (secUsed + line.length > share + 60) continue;
      if (total + line.length > budget) break;
      seenParents.add(pk);
      secLines.push(line); secUsed += line.length; total += line.length + 1;
    }
    if (secLines.length) {
      lines.push("**" + sec.key + "**");
      lines.push(secLines.join("\n"));
    }
    if (total >= budget) break;
  }
  const text = lines.join("\n");
  const dn = norm(text);
  const present = new Set();
  for (const a of anchors) {
    if (a.tier !== "A") continue;
    if (survives(a, dn, o)) present.add(anchorKey(a));
  }
  const allA = new Set(anchors.filter((a) => a.tier === "A").map(anchorKey));
  const missed = Array.from(allA).filter((k) => !present.has(k));
  return { text, chars: text.length, tokens: estimateTokens(text), missed };
}

function floorFor(messages, anchors, srcKey, opts) {
  const o = opts || {};
  const sentences = collectSentences(messages, anchors, o);
  const need = new Map();
  for (const a of anchors) {
    if (a.tier !== "A") continue;
    const k = anchorKey(a);
    if (!need.has(k)) need.set(k, a);
  }
  const uncovered = new Set(need.keys());
  // 记账只认 survKeys（整句渲染后确实存活），不再只按锚点 key 记账
  const gainFn = (s) => {
    let g = 0;
    if (!s.survKeys) return 0;
    for (const k of s.survKeys.keys()) if (uncovered.has(k)) g += 1;
    return g;
  };
  // 成本按父句去重：渲染的是整句，同一句子的子句只计一次
  const claimed = new Set();
  const textOf = (s) => (s.fullText != null ? s.fullText : s.text);
  const costFn = (s) => claimed.has(parentKey(s)) ? 1 : textOf(s).length + tag(srcKey, s).length + 1;
  // 复用贪心核心：无预算上限，覆盖完即止
  const { picked } = pickGreedy(sentences, gainFn, costFn, () => true, 500, (s) => {
    claimed.add(parentKey(s));
    if (s.survKeys) for (const k of s.survKeys.keys()) uncovered.delete(k);
  });
  const seenParents = new Set();
  let chars = 0;
  for (const s of picked) {
    const pk = parentKey(s);
    if (seenParents.has(pk)) continue;
    seenParents.add(pk);
    chars += textOf(s).length + tag(srcKey, s).length + 1;
  }
  // 终验：按最终渲染文本用 survives 复核，渲染丢失的 key 回填为未覆盖
  const text = renderLines(srcKey, picked, o);
  const dn = norm(text);
  for (const pair of need) {
    const k = pair[0], a = pair[1];
    if (uncovered.has(k)) continue;
    if (!survives(a, dn, o)) uncovered.add(k);
  }
  const uncoveredList = Array.from(uncovered);
  return {
    floorPerSource: chars,
    floorTokens: estimateTokens(text), // 按实际渲染文本估算，而非拼接近似
    sentences: picked.length,
    uncovered: uncoveredList,
    uncoveredCount: uncoveredList.length, // 兼容旧调用方的数字口径
    // 人类可读明细
    uncoveredDetail: uncoveredList.map((k) => {
      const a = need.get(k);
      return a ? { key: k, cat: a.cat, display: a.display, turn: a.turn, role: a.role } : { key: k };
    })
  };
}

// 建议预算 = 全覆盖下限 × 余量；透传 opts，保证子句切分口径与 digest 一致
// 升档循环：floor×margin 起步，实测 digest 后 missed 非空则按「比例 × 遗漏句数」升档
function autoBudget(messages, anchors, srcKey, margin, opts) {
  const o = opts || {};
  const m = margin || CONFIG.FLOOR_MARGIN;
  const floor = floorFor(messages, anchors, srcKey, o);
  const useTokens = !!o.budgetTokens;
  const tokRatio = floor.floorPerSource > 0 ? floor.floorTokens / floor.floorPerSource : 0.6;
  const avgSent = floor.sentences > 0 ? floor.floorPerSource / floor.sentences : 80;
  const totalChars = messages.reduce((n, msg) => n + String(msg.text || "").length, 0);
  // 输出帽与选择预算分离：父句去重会让实际输出低于选择预算，
  // 因此允许选择预算到输出帽的 1.5 倍；不要用输出帽直接卡 greedy
  const outputCap = useTokens
    ? (o.maxTokens != null ? o.maxTokens : CONFIG.AUTO_MAX_TOKENS)
    : (o.maxChars != null ? o.maxChars : CONFIG.AUTO_MAX_CHARS);
  const ratio = o.selectRatio != null ? o.selectRatio : CONFIG.AUTO_SELECT_RATIO;
  const charCap = Math.max(Math.ceil(totalChars * 1.2) + 200, Math.ceil(floor.floorPerSource * 3));
  const cap = useTokens
    ? Math.ceil(outputCap * ratio)
    : Math.min(charCap, Math.ceil(outputCap * ratio));
  let budget = useTokens ? Math.ceil(floor.floorTokens * m) : Math.ceil(floor.floorPerSource * m);
  budget = Math.min(budget, cap);
  const maxEsc = o.autoEscalate === false
    ? 0
    : (o.autoEscalateMax != null ? o.autoEscalateMax : CONFIG.AUTO_ESCALATE_MAX);
  let escalated = 0;
  let check = null;
  let lastMissed = null;
  let stalled = false;
  while (true) {
    const probe = Object.assign({}, o, { strict: false });
    if (useTokens) { probe.budgetTokens = budget; probe.budget = 0; }
    else { probe.budget = budget; probe.budgetTokens = undefined; }
    check = extractiveDigest(srcKey, messages, anchors, probe);
    if (check.missed.length === 0 || escalated >= maxEsc) break;
    // 死锚点/升档无收益：missed 没有减少就停止，不要用预算硬堆
    if (lastMissed !== null && check.missed.length >= lastMissed) { stalled = true; break; }
    lastMissed = check.missed.length;
    const next = Math.max(
      Math.ceil(budget * CONFIG.AUTO_ESCALATE_STEP),
      budget + check.missed.length * Math.ceil(avgSent)
    );
    const nb = Math.min(next, cap);
    if (nb <= budget) { stalled = true; break; } // 已封顶
    budget = nb;
    escalated += 1;
  }
  return {
    budgetChars: useTokens ? Math.ceil(budget / Math.max(tokRatio, 0.01)) : budget,
    budgetTokens: useTokens ? budget : Math.ceil(budget * tokRatio),
    outputCapChars: useTokens ? Math.ceil(outputCap / Math.max(tokRatio, 0.01)) : outputCap,
    outputCapTokens: useTokens ? outputCap : Math.ceil(outputCap * tokRatio),
    outputChars: check ? check.chars : 0,
    outputTokens: check ? check.tokens : 0,
    uncoveredAtFloor: floor.uncovered,
    uncoveredAtFloorDetail: floor.uncoveredDetail,
    escalated, // 实际升档次数
    capped: budget >= cap,
    stalled,   // 升档无收益/已封顶
    finalMissed: check ? check.missed : floor.uncovered, // 升档后实测仍未覆盖
    finalMissedDetail: check ? check.missedDetail : floor.uncoveredDetail
  };
}

return {
  CONFIG, CAT_WEIGHT, SECTIONS,
  extractAnchors, extractiveDigest, sectionedDigest, floorFor, autoBudget,
  uniqueAnchors, collectSentences, greedyCover, renderLines,
  norm, splitWithOffsets, survives, bigramOverlap, estimateTokens,
  summarize, flagSummary, unitOf, stripPromptMeta
};
})();
