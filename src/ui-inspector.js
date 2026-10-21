function InspectorShell(props) {
  return h(
    "aside",
    { className: "dshcv-inspector", "aria-label": props.title },
    h("div", { className: "dshcv-inspectorHead" },
      props.icon ? h(props.icon, { size: 15 }) : null,
      h("div", { className: "dshcv-inspectorTitle" }, props.title),
      props.extra || null,
      h(IconButton, { icon: IconClose, title: "关闭面板", onClick: props.onClose }),
    ),
    h("div", { className: "dshcv-inspectorBody" }, props.children),
  );
}

function SourceRow(props) {
  const node = props.node;
  const edge = props.edge;
  const label = node.type === "conversation"
    ? node.data.title || node.data.sessionId
    : node.type === "file"
      ? node.data.name || basename(node.data.path)
      : truncate(node.data.text || "空提示词", 34);
  return h(
    "div",
    { className: "dshcv-source", title: label },
    h("div", { className: "dshcv-sourceOrder" },
      h("button", {
        type: "button",
        title: "上移",
        "aria-label": "上移来源",
        disabled: props.first,
        onClick: () => props.onMove(-1),
      }, h(IconArrowUp, { size: 11 })),
      h("button", {
        type: "button",
        title: "下移",
        "aria-label": "下移来源",
        disabled: props.last,
        onClick: () => props.onMove(1),
      }, h(IconArrowDown, { size: 11 })),
    ),
    h("input", {
      type: "checkbox",
      checked: edge.enabled !== false,
      title: edge.enabled === false ? "启用该来源" : "禁用该来源",
      "aria-label": "启用来源",
      onChange: (event) => props.onToggle(event.target.checked),
      style: { accentColor: "var(--dshcv-accent)", margin: 0, flex: "none" },
    }),
    h(TypeIcon, { type: node.type, size: 13 }),
    h("span", { className: "dshcv-sourceTitle" }, label),
    h("button", {
      type: "button",
      className: "dshcv-iconBtn",
      "data-size": "sm",
      title: "移除来源",
      "aria-label": "移除来源",
      onClick: props.onRemove,
    }, h(IconClose, { size: 11 })),
  );
}

function Inspector(props) {
  const graph = props.graph;
  const selection = props.selection;
  if (!selection) return null;

  if (selection.kind === "edge") {
    const edge = graph.edges.find((candidate) => candidate.id === selection.id);
    if (!edge) return null;
    const from = graph.nodes.find((node) => node.id === edge.from);
    const to = graph.nodes.find((node) => node.id === edge.to);
    return h(InspectorShell, {
      title: "连线",
      icon: IconLink,
      onClose: props.onClose,
    },
      h("div", { className: "dshcv-section" },
        h("div", { className: "dshcv-field" },
          h("div", { className: "dshcv-fieldLabel" }, "来源"),
          h("div", { className: "dshcv-code" }, from ? (from.data.title || from.data.name || from.id) : edge.from),
        ),
        h("div", { className: "dshcv-field" },
          h("div", { className: "dshcv-fieldLabel" }, "目标"),
          h("div", { className: "dshcv-code" }, to ? (to.data.title || to.id) : edge.to),
        ),
        h("label", { className: "dshcv-check", style: { marginBottom: 8 } },
          h("input", {
            type: "checkbox",
            checked: edge.enabled !== false,
            onChange: (event) => props.onUpdateEdge(edge.id, { enabled: event.target.checked }),
          }),
          "启用这条连线",
        ),
        h("div", { className: "dshcv-fieldHint" }, "连线类型：context（作为上下文进入新对话）。"),
      ),
      h("div", { className: "dshcv-inlineActions" },
        h(Btn, { kind: "danger", size: "sm", icon: IconTrash, onClick: props.onDelete, children: "删除连线" }),
      ),
    );
  }

  const node = graph.nodes.find((candidate) => candidate.id === selection.id);
  if (!node) return null;

  let content = null;
  let title = "";
  let icon = TypeIcon;

  if (node.type === "conversation") {
    title = "历史对话";
    icon = IconChat;
    const summary = props.sessionsById.get(node.data.sessionId);
    content = h("div", null,
      h("div", { className: "dshcv-section" },
        h(Field, { label: "标题" },
          h("input", {
            className: "dshcv-input",
            value: node.data.title || "",
            onChange: (event) => props.onUpdateNode(node.id, { title: event.target.value }),
          }),
        ),
        h(Field, { label: "来源会话", hint: summary && summary.updatedAt ? "最近活动：" + formatDateTime(summary.updatedAt) : "会话不可用时会使用已缓存的摘要。" },
          h("div", { className: "dshcv-code" }, node.data.sessionId || "（空）"),
        ),
        h(Field, { label: "进入上下文的方式" },
          h("select", {
            className: "dshcv-select",
            value: node.data.includeMode,
            onChange: (event) => props.onUpdateNode(node.id, { includeMode: event.target.value, digest: "" }),
          },
            h("option", { value: "digest" }, "锚点保真摘要（推荐）"),
            h("option", { value: "digest_excerpts" }, "锚点摘要 + 原文片段"),
            h("option", { value: "full" }, "完整文本（上限 26k 字符）"),
          ),
        ),
        h("div", { className: "dshcv-inlineActions" },
          h(Btn, { size: "sm", kind: "outline", icon: IconExternal, onClick: () => props.onOpenSession(node.data.sessionId), children: "打开对话" }),
          h(Btn, { size: "sm", icon: IconCopy, onClick: () => props.onCopy(node.data.sessionId), children: "复制 ID" }),
        ),
      ),
      h("div", { className: "dshcv-section" },
        h("div", { className: "dshcv-sectionTitle" },
          h("span", null, "摘要"),
          h(Btn, {
            size: "sm",
            icon: IconRefresh,
            busy: node.data.digestStatus === "loading",
            disabled: node.data.digestStatus === "loading",
            onClick: () => props.onRefreshDigest(node.id),
            children: "刷新",
          }),
        ),
        node.data.digestError ? h("div", { className: "dshcv-notice", "data-tone": "error" }, node.data.digestError) : null,
        h("div", { className: "dshcv-code" }, node.data.digest || "尚未提取摘要。连线和预览时会自动提取。"),
        node.data.digestAt ? h("div", { className: "dshcv-statusLine" }, h(IconClock, { size: 11 }), "提取于 " + formatDateTime(node.data.digestAt)) : null,
      ),
      h("div", { className: "dshcv-section" },
        h("div", { className: "dshcv-inlineActions" },
          h(Btn, { kind: "danger", size: "sm", icon: IconTrash, onClick: props.onDelete, children: "删除节点" }),
        ),
      ),
    );
  } else if (node.type === "file") {
    title = "文件";
    icon = IconFile;
    content = h("div", null,
      h("div", { className: "dshcv-section" },
        h(Field, { label: "文件名" },
          h("input", {
            className: "dshcv-input",
            value: node.data.name || "",
            onChange: (event) => props.onUpdateNode(node.id, { name: event.target.value }),
          }),
        ),
        h(Field, { label: "路径", hint: "支持绝对路径或相对工作区的路径。" },
          h("input", {
            className: "dshcv-input",
            value: node.data.path || "",
            onChange: (event) => {
              const path = event.target.value;
              props.onUpdateNode(node.id, { path, name: node.data.name || basename(path) });
            },
          }),
        ),
        h(Field, { label: "进入上下文的方式" },
          h("select", {
            className: "dshcv-select",
            value: node.data.includeMode,
            onChange: (event) => props.onUpdateNode(node.id, { includeMode: event.target.value }),
          },
            h("option", { value: "auto" }, "自动：有内容则内联，否则引用路径"),
            h("option", { value: "inline" }, "内联文本片段"),
            h("option", { value: "reference" }, "只引用路径"),
          ),
        ),
        h("div", { className: "dshcv-inlineActions" },
          h(Btn, {
            size: "sm",
            kind: "outline",
            icon: IconFile,
            busy: node.data.contentStatus === "loading",
            disabled: node.data.contentStatus === "loading" || !node.data.path,
            onClick: () => props.onReadFile(node.id),
            children: "读取内容",
          }),
          h(Btn, { size: "sm", icon: IconCopy, onClick: () => props.onCopy(node.data.path), children: "复制路径" }),
        ),
      ),
      h("div", { className: "dshcv-section" },
        h("div", { className: "dshcv-sectionTitle" }, "内容预览"),
        node.data.contentError ? h("div", { className: "dshcv-notice", "data-tone": "error" }, node.data.contentError) : null,
        h("div", { className: "dshcv-code" }, node.data.content ? truncate(node.data.content, 8000, true) : "尚未读取内容。新对话仍可以通过路径读取该文件。"),
        node.data.contentAt ? h("div", { className: "dshcv-statusLine" }, h(IconCheck, { size: 11 }), "读取于 " + formatDateTime(node.data.contentAt)) : null,
      ),
      h("div", { className: "dshcv-section" },
        h(Btn, { kind: "danger", size: "sm", icon: IconTrash, onClick: props.onDelete, children: "删除节点" }),
      ),
    );
  } else if (node.type === "prompt") {
    title = "任务要求";
    icon = IconPrompt;
    content = h("div", null,
      h("div", { className: "dshcv-section" },
        h(Field, { label: "提示词", hint: "会作为任务要求进入新对话，位置按来源顺序排列。" },
          h("textarea", {
            className: "dshcv-textarea",
            rows: 8,
            value: node.data.text || "",
            onChange: (event) => props.onUpdateNode(node.id, { text: event.target.value }),
            placeholder: "例如：请综合以上资料，给出第一版实现方案。",
          }),
        ),
      ),
      h("div", { className: "dshcv-section" },
        h(Btn, { kind: "danger", size: "sm", icon: IconTrash, onClick: props.onDelete, children: "删除节点" }),
      ),
    );
  } else {
    title = "新对话";
    icon = IconSpark;
    const sources = sourceOptions(graph, node.id);
    const workspaceValue = node.data.workspaceId || "";
    content = h("div", null,
      h("div", { className: "dshcv-section" },
        h(Field, { label: "标题" },
          h("input", {
            className: "dshcv-input",
            value: node.data.title || "",
            onChange: (event) => props.onUpdateNode(node.id, { title: event.target.value }),
          }),
        ),
        h(Field, { label: "目标工作区", hint: "新对话会在该工作区创建；留空则跟随第一个来源对话。" },
          h("select", {
            className: "dshcv-select",
            value: workspaceValue,
            onChange: (event) => props.onUpdateNode(node.id, { workspaceId: event.target.value }),
          },
            h("option", { value: "" }, "自动选择"),
            props.workspaces.map((workspace) =>
              h("option", { key: workspace.workspaceId, value: workspace.workspaceId }, workspaceLabel(workspace)),
            ),
          ),
        ),
        h(Field, { label: "任务指令", hint: "会放在上下文包最前面；留空使用默认指令。" },
          h("textarea", {
            className: "dshcv-textarea",
            rows: 4,
            value: node.data.instruction || "",
            placeholder: DEFAULT_INSTRUCTION,
            onChange: (event) => props.onUpdateNode(node.id, { instruction: event.target.value }),
          }),
        ),
      ),
      h("div", { className: "dshcv-section" },
        h("div", { className: "dshcv-sectionTitle" }, h("span", null, "已连接的来源（" + sources.length + "）")),
        sources.length === 0
          ? h("div", { className: "dshcv-fieldHint" }, "把左侧对话/文件拖入画布，再从节点右侧圆点拖一条线到本节点。")
          : sources.map((pair, index) =>
              h(SourceRow, {
                key: pair.edge.id,
                edge: pair.edge,
                node: pair.node,
                first: index === 0,
                last: index === sources.length - 1,
                onMove: (direction) => props.onReorderSource(node.id, pair.edge.id, direction),
                onToggle: (enabled) => props.onUpdateEdge(pair.edge.id, { enabled }),
                onRemove: () => props.onRemoveEdge(pair.edge.id),
              }),
            ),
        h("div", { className: "dshcv-fieldHint", style: { marginTop: 8 } },
          "提示：取消勾选可以临时禁用来源；顺序决定进入上下文的先后。"),
      ),
      h("div", { className: "dshcv-section" },
        h("div", { className: "dshcv-sectionTitle" }, "执行"),
        h("div", { className: "dshcv-inlineActions" },
          h(Btn, {
            size: "sm",
            kind: "outline",
            icon: IconPlay,
            disabled: props.busy || sources.length === 0,
            onClick: () => props.onPreview(node.id),
            children: "预览上下文",
          }),
          h(Btn, {
            size: "sm",
            kind: "primary",
            icon: IconSpark,
            disabled: props.busy || sources.length === 0,
            onClick: () => props.onCreate(node.id, false),
            children: "创建并预填",
          }),
          h(Btn, {
            size: "sm",
            kind: "outline",
            icon: IconSend,
            disabled: props.busy || sources.length === 0,
            onClick: () => props.onCreate(node.id, true),
            children: "创建并发送",
          }),
        ),
        props.busy ? h("div", { className: "dshcv-statusLine" }, h(Spinner), "正在创建对话…") : null,
        node.data.resultSessionId
          ? h("div", { className: "dshcv-field", style: { marginTop: 10 } },
              h("div", { className: "dshcv-fieldLabel" }, "已创建的对话"),
              h("div", { className: "dshcv-row" },
                h("div", { className: "dshcv-code", style: { flex: 1 } }, node.data.resultSessionId),
                h(Btn, { size: "sm", kind: "outline", onClick: () => props.onOpenSession(node.data.resultSessionId), children: "打开" }),
              ),
            )
          : null,
      ),
      h("div", { className: "dshcv-section" },
        h(Btn, { kind: "danger", size: "sm", icon: IconTrash, onClick: props.onDelete, children: "删除节点" }),
      ),
    );
  }

  return h(InspectorShell, {
    title,
    icon,
    onClose: props.onClose,
    extra: h("span", { className: "dshcv-chip" }, node.type === "chat" ? (node.data.resultSessionId ? "已创建" : "待开始") : "来源"),
  }, content);
}

function PreviewModal(props) {
  const preview = props.preview;
  const [draft, setDraft] = useState("");
  useEffect(() => {
    setDraft(preview && preview.result ? preview.result.text : "");
  }, [preview && preview.result ? preview.result.generatedAt : preview && preview.loading]);
  const result = preview && preview.result;
  const stats = result ? result.stats : null;

  return h(Modal, {
    title: "上下文预览",
    icon: IconCanvas,
    onClose: props.onClose,
    footer: h(React.Fragment, null,
      h(Btn, { size: "sm", icon: IconCopy, onClick: () => props.onCopy(draft), children: "复制" }),
      h(Btn, {
        size: "sm",
        icon: IconRefresh,
        onClick: props.onRefresh,
        disabled: preview && preview.loading,
        children: "重新生成",
      }),
      h("span", { className: "dshcv-spacer", style: { flex: 1 } }),
      h(Btn, { size: "sm", onClick: props.onClose, children: "关闭" }),
      h(Btn, {
        size: "sm",
        kind: "outline",
        icon: IconSpark,
        disabled: !result || !draft.trim() || !props.workspaceReady,
        onClick: () => props.onCreate(draft, false),
        children: "创建并预填",
      }),
      h(Btn, {
        size: "sm",
        kind: "primary",
        icon: IconSend,
        disabled: !result || !draft.trim() || !props.workspaceReady,
        onClick: () => props.onCreate(draft, true),
        children: "创建并发送",
      }),
    ),
    children: preview && preview.loading
      ? h("div", { style: { padding: "42px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "var(--dshcv-muted)" } },
          h(Spinner), "正在读取来源并编译上下文…")
      : preview && preview.error
        ? h("div", { className: "dshcv-notice", "data-tone": "error" }, preview.error)
        : h("div", null,
            stats
              ? h("div", { className: "dshcv-stats" },
                  h("div", { className: "dshcv-stat" }, h("div", { className: "dshcv-statLabel" }, "历史对话"), h("div", { className: "dshcv-statValue" }, stats.conversations)),
                  h("div", { className: "dshcv-stat" }, h("div", { className: "dshcv-statLabel" }, "文件"), h("div", { className: "dshcv-statValue" }, stats.files)),
                  h("div", { className: "dshcv-stat" }, h("div", { className: "dshcv-statLabel" }, "任务要求"), h("div", { className: "dshcv-statValue" }, stats.prompts)),
                  stats.disabled > 0 ? h("div", { className: "dshcv-stat" }, h("div", { className: "dshcv-statLabel" }, "已禁用"), h("div", { className: "dshcv-statValue" }, stats.disabled)) : null,
                  h("div", { className: "dshcv-stat" }, h("div", { className: "dshcv-statLabel" }, "字符"), h("div", { className: "dshcv-statValue" }, formatNumber(stats.chars))),
                  h("div", { className: "dshcv-stat" }, h("div", { className: "dshcv-statLabel" }, "估算 tokens"), h("div", { className: "dshcv-statValue" }, formatNumber(stats.tokens))),
                )
              : null,
            result && result.warnings.length > 0
              ? h("div", { className: "dshcv-notice" }, h(IconWarning, { size: 14 }), h("div", null, result.warnings.map((warning, index) => h("div", { key: index }, warning))))
              : null,
            stats && stats.disabled > 0
              ? h("div", { className: "dshcv-notice", "data-tone": "info" }, h(IconLink, { size: 14 }), h("div", null, "有 " + stats.disabled + " 个来源已禁用，不会进入上下文。"))
              : null,
            stats && stats.conversations >= 2
              ? h("div", { className: "dshcv-notice", "data-tone": "info" }, h(IconWarning, { size: 14 }), h("div", null, "V1 不会自动裁决来源冲突；上下文已要求新对话并列呈现不同说法，最终判断留给你或新对话。"))
              : null,
            h("div", { className: "dshcv-fieldHint", style: { marginBottom: 8 } },
              "下面就是新对话将收到的第一条消息。可以直接修改文字后再创建。"),
            h("textarea", {
              className: "dshcv-previewText",
              value: draft,
              onChange: (event) => setDraft(event.target.value),
              spellCheck: false,
              "aria-label": "上下文预览文本",
            }),
            !props.workspaceReady
              ? h("div", { className: "dshcv-notice", style: { marginTop: 10 } }, h(IconWarning, { size: 14 }), "还没有可用工作区，请先在工作区面板创建一个。")
              : null,
          ),
  });
}

function HelpModal(props) {
  return h(Modal, {
    title: "画布怎么用",
    icon: IconHelp,
    onClose: props.onClose,
    footer: h(React.Fragment, null,
      h("span", { style: { flex: 1, fontSize: 11, color: "var(--dshcv-faint)" } }, "画布状态自动保存在本机"),
      h(Btn, { size: "sm", kind: "primary", onClick: props.onClose, children: "知道了" }),
    ),
    children: h("div", null,
      h("ol", { className: "dshcv-helpList" },
        h("li", null, h("b", null, "拖入素材"), "：从左侧「对话 / 文件 / 提示词」把内容拖到画布上。第一次加入素材时会自动生成一个「新对话」节点。"),
        h("li", null, h("b", null, "连线"), "：从来源节点右侧的圆点拖一条线，落在「新对话」节点上；也可以直接拖到空白处，自动新建一个已连接的新对话节点。"),
        h("li", null, h("b", null, "整理"), "：点选节点后在右侧调整摘要方式、任务指令、目标工作区和来源顺序。取消勾选可以临时禁用某个来源。"),
        h("li", null, h("b", null, "预览并开始"), "：点击「预览上下文」检查编译结果和 token 估算，再选择「创建并预填」或「创建并发送」。"),
      ),
      h("div", { className: "dshcv-sectionTitle", style: { marginTop: 18 } }, "快捷键"),
      h("ul", { className: "dshcv-helpList" },
        h("li", null, h("span", { className: "dshcv-kbd" }, "Delete"), " 删除选中的节点或连线"),
        h("li", null, h("span", { className: "dshcv-kbd" }, "Esc"), " 取消连线 / 关闭弹窗 / 取消选中"),
        h("li", null, h("span", { className: "dshcv-kbd" }, "Ctrl"), " + 滚轮 缩放，滚轮平移画布"),
      ),
      h("div", { className: "dshcv-notice", "data-tone": "info", style: { marginTop: 16 } },
        h("div", null,
          h("div", null, h("b", null, "关于上下文：")),
          h("div", null, "V1 使用每个历史对话的文本摘要（目标 + 最近消息 + 可选片段），不会默认发送完整历史。文件默认以路径引用进入上下文，新对话会按需读取。"),
          h("div", { style: { marginTop: 6 } }, "资料之间的冲突不会被自动裁决，而是在上下文里要求新对话并列呈现。"),
        ),
      ),
    ),
  });
}
