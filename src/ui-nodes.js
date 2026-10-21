function NodeCard(props) {
  const node = props.node;
  const data = node.data;
  const size = SIZES[node.type] || SIZES.chat;
  const selected = props.selected;
  const isChat = node.type === "chat";
  const incoming = props.incoming || 0;

  const head = h(
    "div",
    {
      className: "dshcv-nodeHead",
      onPointerDown: (event) => {
        event.stopPropagation();
        props.onDragStart(event, node);
      },
    },
    h("span", { className: "dshcv-nodeGlyph" }, h(TypeIcon, { type: node.type, size: 14 })),
    h("div", { className: "dshcv-nodeTitle", title: data.title || data.name || data.text || "" },
      node.type === "prompt" ? "任务要求" : data.title || data.name || "未命名"),
  );

  let body = null;
  let foot = null;
  let actions = null;

  if (node.type === "conversation") {
    const status = data.digestStatus || "idle";
    const stale = data.digestAt > 0 && props.updatedAt > data.digestAt;
    body = h(
      "div",
      { className: "dshcv-nodeBody" },
      h("div", { className: "dshcv-nodeMeta" },
        h("span", { className: "dshcv-dot", "data-tone": status === "error" ? "error" : data.digest ? "ok" : "warn" }),
        h("span", null, data.cwd ? basename(data.cwd) : "会话"),
        h("span", null, "·"),
        h("span", null, data.messageCount ? data.messageCount + " 条消息" : "摘要未提取"),
      ),
      h("div", { className: "dshcv-nodeText", "data-lines": "2", style: { marginTop: 5 } },
        data.digest || (status === "loading" ? "正在读取对话摘要…" : "点击右侧按钮提取摘要，或直接连线使用。")),
    );
    foot = h(
      "div",
      { className: "dshcv-nodeFoot" },
      h("span", { className: "dshcv-chip", "data-tone": stale ? "warn" : undefined },
        stale ? "来源已更新" : INCLUDE_LABEL[data.includeMode] || "摘要"),
      h("span", { className: "dshcv-spacer" }),
      h("button", {
        type: "button",
        className: "dshcv-iconBtn",
        "data-size": "sm",
        title: "刷新摘要",
        "aria-label": "刷新摘要",
        onPointerDown: (event) => event.stopPropagation(),
        onClick: (event) => {
          event.stopPropagation();
          props.onRefresh(node.id);
        },
      }, status === "loading" ? h(Spinner) : h(IconRefresh, { size: 12 })),
    );
  } else if (node.type === "file") {
    const inline = Boolean(data.content);
    body = h(
      "div",
      { className: "dshcv-nodeBody" },
      h("div", { className: "dshcv-nodeMeta", title: data.path },
        h("span", { className: "dshcv-dot", "data-tone": inline ? "ok" : "warn" }),
        h("span", { style: { overflow: "hidden", textOverflow: "ellipsis" } }, data.path || "尚未设置路径"),
      ),
      h("div", { className: "dshcv-nodeText", "data-lines": "2", style: { marginTop: 5 } },
        inline ? truncate(data.content.replace(/\s+/g, " "), 180) : "以路径引用的方式加入上下文；可点击下方按钮读取文本。"),
    );
    foot = h(
      "div",
      { className: "dshcv-nodeFoot" },
      h("span", { className: "dshcv-chip", "data-tone": inline ? "accent" : undefined },
        inline ? "已内联 " + formatNumber(data.content.length) + " 字符" : "路径引用"),
      h("span", { className: "dshcv-spacer" }),
      h("button", {
        type: "button",
        className: "dshcv-btn",
        "data-size": "sm",
        onPointerDown: (event) => event.stopPropagation(),
        onClick: (event) => {
          event.stopPropagation();
          props.onReadFile(node.id);
        },
        disabled: props.reading,
      }, props.reading ? h(Spinner) : null, props.reading ? "读取中" : "读取"),
    );
  } else if (node.type === "prompt") {
    body = h(
      "div",
      { className: "dshcv-nodeBody" },
      h("div", { className: "dshcv-nodeText" }, data.text || "在右侧面板输入任务要求…"),
    );
    foot = h(
      "div",
      { className: "dshcv-nodeFoot" },
      h("span", { className: "dshcv-chip" }, "作为任务要求"),
    );
  } else {
    const status = data.status || "idle";
    const result = data.resultSessionId;
    body = h(
      "div",
      { className: "dshcv-nodeBody" },
      h("div", { className: "dshcv-nodeMeta" },
        h("span", { className: "dshcv-dot", "data-tone": result ? "ok" : incoming > 0 ? "accent" : "warn" }),
        h("span", null, incoming > 0 ? incoming + " 个来源已连接" : "尚未连接来源"),
        h("span", { className: "dshcv-spacer" }),
        h("span", { className: "dshcv-chip", "data-tone": result ? "ok" : undefined },
          result ? "已创建" : status === "creating" ? "创建中" : "待开始"),
      ),
      h("div", { className: "dshcv-nodeText", "data-lines": "2", style: { marginTop: 5 } },
        data.instruction || "把来源节点右侧的圆点拖到这里，然后点击「预览上下文」或「创建」。"),
    );
    actions = h(
      "div",
      { className: "dshcv-nodeActions" },
      h("button", {
        type: "button",
        className: "dshcv-btn",
        "data-kind": "outline",
        onPointerDown: (event) => event.stopPropagation(),
        onClick: (event) => {
          event.stopPropagation();
          props.onPreview(node.id);
        },
        disabled: props.busy,
      }, "预览上下文"),
      result
        ? h("button", {
            type: "button",
            className: "dshcv-btn",
            "data-kind": "primary",
            onPointerDown: (event) => event.stopPropagation(),
            onClick: (event) => {
              event.stopPropagation();
              props.onOpenSession(result);
            },
          }, "打开对话")
        : h("button", {
            type: "button",
            className: "dshcv-btn",
            "data-kind": "primary",
            onPointerDown: (event) => event.stopPropagation(),
            onClick: (event) => {
              event.stopPropagation();
              props.onCreate(node.id, false);
            },
            disabled: props.busy || incoming === 0,
          }, props.busy ? h(Spinner) : h(IconSpark, { size: 13 }), props.busy ? "创建中" : "创建"),
    );
  }

  return h(
    "div",
    {
      className: "dshcv-node",
      "data-node-id": node.id,
      "data-type": node.type,
      "data-selected": selected ? "true" : undefined,
      "data-drop-ok": props.dropOk ? "true" : undefined,
      "data-drop-hover": props.dropHover ? "true" : undefined,
      style: { left: node.x, top: node.y, width: size.w, height: size.h },
      onPointerDown: (event) => {
        if (event.button !== 0) return;
        if (event.target.closest("button, textarea, input, select, .dshcv-port")) return;
        props.onDragStart(event, node);
      },
    },
    head,
    body,
    actions,
    foot,
    !isChat
      ? h("button", {
          type: "button",
          className: "dshcv-port",
          "data-side": "out",
          title: "拖动连线到「新对话」节点",
          "aria-label": "从该节点拖出连线",
          onPointerDown: (event) => {
            event.stopPropagation();
            event.preventDefault();
            props.onPortStart(event, node);
          },
        })
      : h("button", {
          type: "button",
          className: "dshcv-port",
          "data-side": "in",
          title: "把来源节点的连线拖到这里",
          "aria-label": "新对话节点的输入端口",
          tabIndex: -1,
        }),
  );
}

function EdgeLayer(props) {
  const graph = props.graph;
  const incomingTotals = new Map();
  for (const edge of graph.edges) {
    incomingTotals.set(edge.to, (incomingTotals.get(edge.to) || 0) + 1);
  }
  const incomingSeen = new Map();
  const elements = [];

  for (const edge of graph.edges) {
    const fromNode = graph.nodes.find((node) => node.id === edge.from);
    const toNode = graph.nodes.find((node) => node.id === edge.to);
    if (!fromNode || !toNode) continue;
    const index = incomingSeen.get(edge.to) || 0;
    incomingSeen.set(edge.to, index + 1);
    const total = incomingTotals.get(edge.to) || 1;
    const start = portOut(fromNode);
    const end = portIn(toNode, index, total);
    const path = edgePath(start, end);
    const selected = props.selection && props.selection.kind === "edge" && props.selection.id === edge.id;
    elements.push(
      h(
        "g",
        { key: edge.id, "data-edge-id": edge.id, opacity: edge.enabled === false ? 0.35 : 1 },
        h("path", { d: path, className: "dshcv-edgeHit", onPointerDown: (event) => props.onSelectEdge(event, edge) }),
        h("path", { d: path, className: "dshcv-edge", "data-selected": selected ? "true" : undefined, markerEnd: "url(#dshcv-arrow)" }),
        h("text", { className: "dshcv-edgeLabel", x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 - 6, textAnchor: "middle" },
          edge.enabled === false ? "已禁用" : "上下文"),
      ),
    );
  }

  if (props.connecting) {
    const fromNode = graph.nodes.find((node) => node.id === props.connecting.from);
    if (fromNode) {
      const start = portOut(fromNode);
      const end = props.connecting.world;
      elements.push(h("path", { key: "temp", d: edgePath(start, end), className: "dshcv-edge dshcv-edgeTemp" }));
      elements.push(h("circle", { key: "temp-dot", cx: end.x, cy: end.y, r: 4, fill: "var(--dshcv-accent)" }));
    }
  }

  return h(
    "svg",
    { className: "dshcv-edges", "aria-hidden": "true" },
    h("defs", null,
      h("marker", {
        id: "dshcv-arrow",
        viewBox: "0 0 10 10",
        refX: 8,
        refY: 5,
        markerWidth: 6,
        markerHeight: 6,
        orient: "auto-start-reverse",
      }, h("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: "var(--dshcv-accent)" })),
    ),
    elements,
  );
}

function Dock(props) {
  const [pathInput, setPathInput] = useState("");
  const [promptInput, setPromptInput] = useState("");
  const [dragging, setDragging] = useState(false);
  const tabs = [
    { id: "sessions", label: "对话", count: props.sessionCount },
    { id: "files", label: "文件", count: props.fileCount },
    { id: "prompts", label: "提示词", count: props.promptCount },
  ];

  const sessionList = h(
    "div",
    null,
    h("div", { className: "dshcv-search" },
      h(IconSearch, { size: 13 }),
      h("input", {
        className: "dshcv-searchInput",
        placeholder: "搜索历史对话…",
        value: props.query,
        onChange: (event) => props.onQuery(event.target.value),
        "aria-label": "搜索历史对话",
      }),
    ),
    h("div", { className: "dshcv-dockHint" }, "拖动对话到画布，或点击 + 直接加入。"),
    props.sessions.length === 0
      ? h("div", { className: "dshcv-listEmpty" }, props.sessionsPhase === "loading" ? "正在加载对话…" : "没有匹配的历史对话")
      : props.sessions.slice(0, 80).map((item) =>
          h(
            "div",
            {
              key: item.id,
              className: "dshcv-sessionRow",
              role: "button",
              tabIndex: 0,
              draggable: true,
              title: "拖动到画布",
              onDragStart: (event) => {
                event.dataTransfer.setData("application/x-dsh-canvas-session", item.id);
                event.dataTransfer.setData("text/plain", item.id);
                event.dataTransfer.effectAllowed = "copy";
                setDragging(true);
              },
              onDragEnd: () => setDragging(false),
              onClick: () => props.onAddSession(item.id),
              onKeyDown: (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  props.onAddSession(item.id);
                }
              },
            },
            h("div", { className: "dshcv-sessionTop" },
              h("span", { className: "dshcv-sessionTitle" }, item.title || item.displayTitle || item.id),
              h("span", { className: "dshcv-sessionTime" }, timeAgo(item.updatedAt)),
            ),
            h("div", { className: "dshcv-sessionMeta" },
              (item.cwd ? basename(item.cwd) : "会话") + (item.running ? " · 运行中" : "")),
            h("button", {
              type: "button",
              className: "dshcv-sessionAdd",
              title: "加入画布",
              "aria-label": "把该对话加入画布",
              onClick: (event) => {
                event.stopPropagation();
                props.onAddSession(item.id);
              },
            }, h(IconPlus, { size: 12 })),
          ),
        ),
  );

  const files = h(
    "div",
    null,
    h("div", {
      className: "dshcv-dropZone",
      onDragOver: (event) => {
        event.preventDefault();
        setDragging(true);
      },
      onDragLeave: () => setDragging(false),
      onDrop: (event) => {
        event.preventDefault();
        setDragging(false);
        props.onFiles(event.dataTransfer);
      },
      style: {
        border: "1px dashed " + (dragging ? "var(--dshcv-accent)" : "var(--dshcv-border2)"),
        background: dragging ? "var(--dshcv-accent-soft)" : "transparent",
        borderRadius: 9,
        padding: "16px 12px",
        textAlign: "center",
        fontSize: 11.5,
        color: "var(--dshcv-muted)",
        marginBottom: 10,
        cursor: "pointer",
      },
      onClick: () => props.onPickFiles(),
      role: "button",
      tabIndex: 0,
    }, h(IconUpload, { size: 18 }), h("div", { style: { marginTop: 6 } }, "拖入文件，或点击选择")),
    h("div", { className: "dshcv-row", style: { marginBottom: 10 } },
      h("input", {
        className: "dshcv-input",
        placeholder: "也可以粘贴文件路径…",
        value: pathInput,
        onChange: (event) => setPathInput(event.target.value),
        onKeyDown: (event) => {
          if (event.key === "Enter" && pathInput.trim()) {
            props.onAddPath(pathInput.trim());
            setPathInput("");
          }
        },
        "aria-label": "文件路径",
      }),
      h(Btn, {
        size: "sm",
        kind: "outline",
        onClick: () => {
          if (pathInput.trim()) {
            props.onAddPath(pathInput.trim());
            setPathInput("");
          }
        },
        children: "引用",
      }),
    ),
    h("div", { className: "dshcv-dockHint" }, "文件默认以路径引用进入上下文；读取文本后可内联关键片段。"),
    props.fileNodes.length === 0
      ? h("div", { className: "dshcv-listEmpty" }, "画布中还没有文件")
      : props.fileNodes.map((node) =>
          h("div", { key: node.id, className: "dshcv-sessionRow", onClick: () => props.onLocate(node.id), role: "button", tabIndex: 0 },
            h("div", { className: "dshcv-sessionTop" },
              h("span", { className: "dshcv-sessionTitle" }, node.data.name || basename(node.data.path)),
              h("span", { className: "dshcv-sessionTime" }, node.data.content ? "已读取" : "仅路径"),
            ),
            h("div", { className: "dshcv-sessionMeta" }, node.data.path),
          ),
        ),
  );

  const presets = [
    { label: "综合资料给出方案", text: "请综合以上资料，给出可执行的方案，并说明关键取舍与风险。" },
    { label: "先检查冲突与缺口", text: "请先检查以上资料中的冲突、过期信息与缺口，再决定下一步怎么做。" },
    { label: "继续未完成的工作", text: "请基于以上历史对话，继续上次未完成的工作；先确认当前进度，再接着执行。" },
  ];
  const prompts = h(
    "div",
    null,
    h("div", { className: "dshcv-dockHint" }, "提示词会作为任务要求进入新对话。"),
    presets.map((preset) =>
      h("button", {
        key: preset.label,
        type: "button",
        className: "dshcv-sessionRow",
        onClick: () => props.onAddPrompt(preset.text),
      },
        h("div", { className: "dshcv-sessionTop" }, h("span", { className: "dshcv-sessionTitle" }, preset.label)),
        h("div", { className: "dshcv-sessionMeta" }, truncate(preset.text, 40)),
      ),
    ),
    h("div", { style: { marginTop: 10 } },
      h("textarea", {
        className: "dshcv-textarea",
        placeholder: "写一段任务要求，加入画布…",
        value: promptInput,
        onChange: (event) => setPromptInput(event.target.value),
        rows: 3,
        "aria-label": "新提示词",
      }),
      h("div", { style: { marginTop: 6, display: "flex", justifyContent: "flex-end" } },
        h(Btn, {
          size: "sm",
          kind: "primary",
          disabled: !promptInput.trim(),
          onClick: () => {
            props.onAddPrompt(promptInput.trim());
            setPromptInput("");
          },
          children: "加入画布",
        }),
      ),
    ),
    props.promptNodes.length > 0
      ? h("div", { style: { marginTop: 12 } },
          h("div", { className: "dshcv-fieldLabel", style: { marginBottom: 6 } }, "画布中的提示词"),
          props.promptNodes.map((node) =>
            h("div", { key: node.id, className: "dshcv-sessionRow", onClick: () => props.onLocate(node.id), role: "button", tabIndex: 0 },
              h("div", { className: "dshcv-sessionTop" }, h("span", { className: "dshcv-sessionTitle" }, truncate(node.data.text || "空提示词", 42))),
            ),
          ),
        )
      : null,
  );

  return h(
    "aside",
    { className: "dshcv-dock", "aria-label": "画布素材库" },
    h("div", { className: "dshcv-dockTabs" },
      tabs.map((tab) =>
        h("button", {
          key: tab.id,
          type: "button",
          className: "dshcv-tab",
          "data-active": props.tab === tab.id ? "true" : undefined,
          onClick: () => props.onTab(tab.id),
        }, tab.label, tab.count ? h("span", { className: "dshcv-tabBadge" }, tab.count) : null),
      ),
    ),
    h("div", { className: "dshcv-dockBody" },
      props.tab === "sessions" ? sessionList : props.tab === "files" ? files : prompts,
    ),
  );
}
