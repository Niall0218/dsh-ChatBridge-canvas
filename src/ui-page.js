function CanvasPage(props) {
  const api = props.api;
  const [graph, setGraph] = useState(loadGraph);
  const graphRef = useRef(graph);
  graphRef.current = graph;
  const [selection, setSelection] = useState(null);
  const [dockTab, setDockTab] = useState("sessions");
  const [dockOpen, setDockOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(null);
  const [saveState, setSaveState] = useState("saved");
  const [menuOpen, setMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [busyChat, setBusyChat] = useState(null);
  const [readingNode, setReadingNode] = useState(null);
  const [dropActive, setDropActive] = useState(false);
  const [panning, setPanning] = useState(false);
  const [connecting, setConnecting] = useState(null);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const importInputRef = useRef(null);
  const toastTimer = useRef(null);
  const spawnIndex = useRef(0);
  const digestInflight = useRef(new Set());
  const viewportRef = useRef(graph.viewport);
  viewportRef.current = graph.viewport;

  const sessionsSnapshot = useStore(api.ctx.sessions.list);
  const workspacesSnapshot = useStore(api.ctx.workspaces.list);
  const sessionsById = useMemo(() => sessionSummaryMap(sessionsSnapshot), [sessionsSnapshot]);
  const workspaceItems = useMemo(() => {
    return workspacesSnapshot && Array.isArray(workspacesSnapshot.items) ? workspacesSnapshot.items : [];
  }, [workspacesSnapshot]);
  const workspaceReady = workspaceItems.length > 0;

  const sessionItems = useMemo(() => {
    const byId = (sessionsSnapshot && sessionsSnapshot.byId) || {};
    const ids = sessionsSnapshot && Array.isArray(sessionsSnapshot.ids)
      ? sessionsSnapshot.ids
      : Object.keys(byId);
    return ids
      .map((id) => byId[id])
      .filter((item) => item && item.origin !== "subagent" && !item.blank)
      .sort((left, right) => (Number(right.updatedAt) || 0) - (Number(left.updatedAt) || 0));
  }, [sessionsSnapshot]);

  const filteredSessions = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return sessionItems;
    return sessionItems.filter((item) => {
      const fields = [item.title, item.displayTitle, item.cwd, item.id];
      return fields.some((value) => String(value || "").toLowerCase().includes(needle));
    });
  }, [sessionItems, query]);

  const selectedNode = selection && selection.kind === "node"
    ? graph.nodes.find((node) => node.id === selection.id)
    : undefined;
  const selectedEdge = selection && selection.kind === "edge"
    ? graph.edges.find((edge) => edge.id === selection.id)
    : undefined;
  const chatNodes = graph.nodes.filter((node) => node.type === "chat");
  const fileNodes = graph.nodes.filter((node) => node.type === "file");
  const promptNodes = graph.nodes.filter((node) => node.type === "prompt");

  const notify = useCallback((text, tone, action, duration) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ text, tone: tone || "info", action, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), duration || (tone === "error" ? 6500 : 3200));
  }, []);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  useEffect(() => {
    setSaveState("saving");
    const timer = setTimeout(() => {
      const ok = saveGraph(graph);
      setSaveState(ok ? "saved" : "error");
      if (!ok) notify("画布保存失败：本地存储空间不足。建议在菜单里导出备份。", "error");
    }, 320);
    return () => clearTimeout(timer);
  }, [graph, notify]);

  const mutate = useCallback((updater) => {
    setGraph((prev) => Object.assign({}, updater(prev), { updatedAt: Date.now() }));
  }, []);

  const updateNode = useCallback((id, patch) => {
    const current = graphRef.current.nodes.find((node) => node.id === id);
    mutate((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...patch } } : node,
      ),
    }));
    if (current && current.type === "conversation" && patch && patch.includeMode) {
      setTimeout(() => refreshDigestInternal(id), 40);
    }
  }, [mutate]);

  const updateEdge = useCallback((id, patch) => {
    mutate((prev) => ({
      ...prev,
      edges: prev.edges.map((edge) => (edge.id === id ? { ...edge, ...patch } : edge)),
    }));
  }, [mutate]);

  const removeEdge = useCallback((id) => {
    mutate((prev) => ({ ...prev, edges: prev.edges.filter((edge) => edge.id !== id) }));
  }, [mutate]);

  const worldFromClient = useCallback((clientX, clientY) => {
    const element = canvasRef.current;
    if (!element) return { x: 0, y: 0 };
    const rect = element.getBoundingClientRect();
    const vp = viewportRef.current;
    return {
      x: (clientX - rect.left - vp.x) / vp.scale,
      y: (clientY - rect.top - vp.y) / vp.scale,
    };
  }, []);

  const centerForSize = useCallback((size) => {
    const element = canvasRef.current;
    const vp = viewportRef.current;
    const width = element ? element.clientWidth : 900;
    const height = element ? element.clientHeight : 600;
    const offset = (spawnIndex.current++ % 7) * 24;
    return {
      x: (width / 2 - vp.x) / vp.scale - size.w / 2 + offset,
      y: (height / 2 - vp.y) / vp.scale - size.h / 2 + offset,
    };
  }, []);

  function refreshDigestInternal(nodeId) {
    const node = graphRef.current.nodes.find((candidate) => candidate.id === nodeId);
    if (!node || node.type !== "conversation" || !node.data.sessionId) return;
    if (digestInflight.current.has(nodeId)) return;
    digestInflight.current.add(nodeId);
    updateNode(nodeId, { digestStatus: "loading", digestError: "" });
    api.readDigest(node.data.sessionId, node.data.includeMode || "digest")
      .then((result) => {
        updateNode(nodeId, {
          digest: result.digest,
          messageCount: result.messageCount,
          digestAt: Date.now(),
          digestStatus: "ready",
          digestError: "",
        });
      })
      .catch((error) => {
        updateNode(nodeId, {
          digestStatus: "error",
          digestError: "读取失败：" + String(error && error.message ? error.message : error),
        });
      })
      .finally(() => {
        digestInflight.current.delete(nodeId);
      });
  }

  const addSourceNode = useCallback((type, data, at) => {
    if (graphRef.current.nodes.length >= MAX_NODES) {
      notify("画布节点已达上限（" + MAX_NODES + " 个），请先删除不用的节点。", "error");
      return "";
    }
    const size = SIZES[type];
    const current = graphRef.current;
    const start = at || centerForSize(size);
    const position = at ? start : findFreeSpot(current.nodes, size, start);
    const node = {
      id: uid(type),
      type,
      x: Math.round(position.x),
      y: Math.round(position.y),
      data,
    };
    const needsChat = !current.nodes.some((candidate) => candidate.type === "chat");
    const chatSpot = needsChat ? findFreeSpot([...current.nodes, node], SIZES.chat, { x: node.x + size.w + 80, y: Math.max(40, node.y - 16) }) : null;
    const chat = needsChat ? makeChatNode(chatSpot.x, chatSpot.y) : null;
    setGraph((prev) => ({
      ...prev,
      nodes: chat ? [...prev.nodes, node, chat] : [...prev.nodes, node],
      updatedAt: Date.now(),
    }));
    setSelection({ kind: "node", id: node.id });
    if (chat) {
      setTimeout(() => notify("已自动创建一个「新对话」节点，把线连到它上面即可开始。", "info"), 60);
      setTimeout(() => { try { fitView(0.72); } catch (error) { /* view stays */ } }, 140);
    }
    return node.id;
  }, [centerForSize, notify]);

  const addSessionNode = useCallback((sessionId, at) => {
    const current = graphRef.current;
    const existing = current.nodes.find((node) => node.type === "conversation" && node.data.sessionId === sessionId);
    if (existing) {
      setSelection({ kind: "node", id: existing.id });
      notify("这个对话已经在画布中了。", "info");
      return;
    }
    const summary = sessionsById.get(sessionId);
    const nodeId = addSourceNode("conversation", {
      sessionId,
      title: (summary && (summary.title || summary.displayTitle)) || sessionId,
      cwd: (summary && summary.cwd) || "",
      includeMode: "digest",
      digest: "",
      digestAt: 0,
      digestStatus: "idle",
      digestError: "",
      messageCount: 0,
    }, at);
    setTimeout(() => refreshDigestInternal(nodeId), 80);
  }, [addSourceNode, notify, sessionsById]);

  const handleDroppedFile = useCallback(async (file, at) => {
    const path = api.platformPath(file);
    const name = file.name || basename(path);
    if (!path && !isTextName(name)) {
      notify("浏览器无法获得这个文件的路径；请把文件放进工作区后输入路径，或拖入文本文件。", "error");
      return;
    }
    let content = "";
    let contentStatus = "idle";
    if (isTextName(name) && file.size <= 2 * 1024 * 1024) {
      try {
        content = await api.readDroppedFile(file, 40000);
        if (content) contentStatus = "ready";
      } catch (error) {
        content = "";
      }
    }
    addSourceNode("file", {
      path: path || name,
      name,
      includeMode: content ? "inline" : "auto",
      content,
      contentAt: content ? Date.now() : 0,
      contentStatus,
      contentError: "",
      size: file.size || 0,
    }, at);
  }, [addSourceNode, api, notify]);

  const addFileFromDrop = useCallback(async (file, at) => {
    await handleDroppedFile(file, at);
  }, [handleDroppedFile]);

  const addFilePath = useCallback((path, at) => {
    if (!path) return;
    addSourceNode("file", {
      path,
      name: basename(path),
      includeMode: "auto",
      content: "",
      contentAt: 0,
      contentStatus: "idle",
      contentError: "",
      size: 0,
    }, at);
  }, [addSourceNode]);

  const addPromptNode = useCallback((text, at) => {
    addSourceNode("prompt", { text: text || "" }, at);
  }, [addSourceNode]);

  const addChatNode = useCallback(() => {
    const size = SIZES.chat;
    const spot = findFreeSpot(graphRef.current.nodes, size, centerForSize(size));
    const node = makeChatNode(spot.x, spot.y);
    mutate((prev) => ({ ...prev, nodes: [...prev.nodes, node] }));
    setSelection({ kind: "node", id: node.id });
  }, [centerForSize, mutate]);

  const nearestChat = useCallback((world, pad) => {
    const slop = Number.isFinite(pad) ? pad : 14;
    let best = null;
    for (const candidate of graphRef.current.nodes) {
      if (candidate.type !== "chat") continue;
      const size = SIZES.chat;
      const dx = Math.max(candidate.x - slop - world.x, 0, world.x - (candidate.x + size.w + slop));
      const dy = Math.max(candidate.y - slop - world.y, 0, world.y - (candidate.y + size.h + slop));
      const gap = Math.sqrt(dx * dx + dy * dy);
      if (!best || gap < best.gap) best = { node: candidate, gap };
    }
    return best;
  }, []);

  const createChatAt = useCallback((world, fromId) => {
    const spot = findFreeSpot(graphRef.current.nodes, SIZES.chat, {
      x: world.x - SIZES.chat.w / 2,
      y: world.y - SIZES.chat.h / 2,
    });
    const chat = makeChatNode(spot.x, spot.y);
    const edge = { id: uid("edge"), from: fromId, to: chat.id, kind: "context", enabled: true, order: 1 };
    setGraph((prev) => ({
      ...prev,
      nodes: [...prev.nodes, chat],
      edges: [...prev.edges, edge],
      updatedAt: Date.now(),
    }));
    setSelection({ kind: "node", id: chat.id });
    notify("已在空白处创建新对话节点并连接。", "info");
  }, [notify]);

  const connectNodes = useCallback((from, to) => {
    if (!from || !to || from === to) return;
    const current = graphRef.current;
    const target = current.nodes.find((node) => node.id === to);
    const source = current.nodes.find((node) => node.id === from);
    if (!source || !target) return;
    if (target.type !== "chat") {
      notify("只能连接到「新对话」节点。", "error");
      return;
    }
    if (current.edges.some((edge) => edge.from === from && edge.to === to)) {
      notify("这两个节点已经连接。", "info");
      return;
    }
    mutate((prev) => {
      if (prev.edges.some((edge) => edge.from === from && edge.to === to)) return prev;
      const maxOrder = prev.edges
        .filter((edge) => edge.to === to)
        .reduce((max, edge) => Math.max(max, Number(edge.order) || 0), 0);
      const edge = { id: uid("edge"), from, to, kind: "context", enabled: true, order: maxOrder + 1 };
      return { ...prev, edges: [...prev.edges, edge] };
    });
    setSelection({ kind: "node", id: to });
    notify("已连接。可以继续添加来源，或点击「预览上下文」。", "info");
  }, [mutate, notify]);

  const cancelConnectRef = useRef(null);

  const startPortDrag = useCallback((event, node) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const start = worldFromClient(event.clientX, event.clientY);
    setConnecting({ from: node.id, world: start, over: "" });
    const handle = event.currentTarget;
    try { handle.setPointerCapture(event.pointerId); } catch (error) { /* older engines */ }
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("blur", cancel);
      try { handle.releasePointerCapture(event.pointerId); } catch (error) { /* released */ }
      cancelConnectRef.current = null;
      setConnecting(null);
    };
    const cancel = () => finish();
    const move = (moveEvent) => {
      const world = worldFromClient(moveEvent.clientX, moveEvent.clientY);
      const near = nearestChat(world, 14);
      setConnecting({ from: node.id, world, over: near && near.gap === 0 ? near.node.id : "" });
    };
    const up = (upEvent) => {
      if (upEvent.pointerType === "mouse" && upEvent.button !== 0) { finish(); return; }
      const world = worldFromClient(upEvent.clientX, upEvent.clientY);
      const near = nearestChat(world, 14);
      const panel = upEvent.target && upEvent.target.closest ? upEvent.target.closest(".dshcv-inspector") : null;
      const rect = canvasRef.current ? canvasRef.current.getBoundingClientRect() : null;
      const inside = rect && upEvent.clientX >= rect.left && upEvent.clientX <= rect.right && upEvent.clientY >= rect.top && upEvent.clientY <= rect.bottom;
      finish();
      if (panel) {
        notify("请把线拖到画布上的「新对话」节点。", "error");
        return;
      }
      if (!inside) return;
      if (near && near.gap === 0) {
        connectNodes(node.id, near.node.id);
        return;
      }
      const screenGap = near ? near.gap * viewportRef.current.scale : Infinity;
      if (screenGap > DROP_CREATE_MIN) {
        createChatAt(world, node.id);
        return;
      }
      notify("请把线拖到「新对话」节点的输入端；要新建节点请拖到更远的空白处。", "error");
    };
    cancelConnectRef.current = finish;
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    window.addEventListener("blur", cancel);
  }, [connectNodes, createChatAt, nearestChat, notify, worldFromClient]);

  const deleteSelection = useCallback(() => {
    if (!selection) return;
    if (selection.kind === "edge") {
      mutate((prev) => ({ ...prev, edges: prev.edges.filter((edge) => edge.id !== selection.id) }));
    } else {
      mutate((prev) => ({
        ...prev,
        nodes: prev.nodes.filter((node) => node.id !== selection.id),
        edges: prev.edges.filter((edge) => edge.from !== selection.id && edge.to !== selection.id),
      }));
    }
    setSelection(null);
  }, [mutate, selection]);

  const reorderSource = useCallback((chatId, edgeId, direction) => {
    const current = graphRef.current;
    const ordered = incomingEdges(current, chatId);
    const index = ordered.findIndex((edge) => edge.id === edgeId);
    const swap = index + direction;
    if (index < 0 || swap < 0 || swap >= ordered.length) return;
    const ids = ordered.map((edge) => edge.id);
    const moved = ids[index];
    ids[index] = ids[swap];
    ids[swap] = moved;
    mutate((prev) => ({
      ...prev,
      edges: prev.edges.map((edge) => {
        if (edge.to !== chatId) return edge;
        const nextOrder = ids.indexOf(edge.id);
        return nextOrder >= 0 ? { ...edge, order: nextOrder + 1 } : edge;
      }),
    }));
  }, [mutate]);

  const readFileNode = useCallback(async (nodeId) => {
    const node = graphRef.current.nodes.find((candidate) => candidate.id === nodeId);
    if (!node || node.type !== "file" || !node.data.path) {
      notify("请先填写文件路径。", "error");
      return;
    }
    const current = graphRef.current;
    const sourceConversation = current.nodes.find((candidate) => candidate.type === "conversation" && candidate.data.sessionId);
    const fallback = sessionItems.find((item) => !item.blank);
    const sessionId = sourceConversation ? sourceConversation.data.sessionId : fallback ? fallback.id : "";
    if (!sessionId) {
      notify("读取文件需要借用某个会话的工作区。请先在左侧加入一个历史对话，或创建一个新对话。", "error");
      return;
    }
    setReadingNode(nodeId);
    updateNode(nodeId, { contentStatus: "loading", contentError: "" });
    try {
      const result = await api.readWorkspaceFile(sessionId, node.data.path);
      updateNode(nodeId, {
        content: result.text,
        contentAt: Date.now(),
        contentStatus: "ready",
        contentError: "",
      });
      notify("已读取 " + formatNumber(result.text.length) + " 个字符" + (result.eof ? "" : "（文件较长，仅读取首屏）"), "info");
    } catch (error) {
      updateNode(nodeId, {
        contentStatus: "error",
        contentError: "读取失败：" + String(error && error.message ? error.message : error),
      });
      notify("读取文件失败：" + String(error && error.message ? error.message : error), "error");
    } finally {
      setReadingNode(null);
    }
  }, [api, notify, sessionItems, updateNode]);

  const openPreview = useCallback(async (chatId, refresh) => {
    const node = graphRef.current.nodes.find((candidate) => candidate.id === chatId);
    if (!node || node.type !== "chat") return;
    setPreview({ loading: true, error: "", chatId, result: null });
    try {
      const result = await compileContext(api, graphRef.current, node, { refresh: Boolean(refresh) });
      setPreview({ loading: false, error: "", chatId, result });
    } catch (error) {
      setPreview({ loading: false, error: String(error && error.message ? error.message : error), chatId, result: null });
    }
  }, [api]);

  const inferWorkspace = useCallback((node) => {
    if (node.data.workspaceId) return node.data.workspaceId;
    const sources = sourceOptions(graphRef.current, node.id);
    const conversation = sources.find((pair) => pair.node.type === "conversation");
    const preferred = conversation ? conversation.node.data.sessionId : undefined;
    const workspace = pickWorkspace(workspacesSnapshot, sessionsSnapshot, preferred);
    return workspace ? workspace.workspaceId : "";
  }, [sessionsSnapshot, workspacesSnapshot]);

  const createChat = useCallback(async (chatId, autoSend, textOverride) => {
    const node = graphRef.current.nodes.find((candidate) => candidate.id === chatId);
    if (!node || node.type !== "chat") return;
    const workspaceId = inferWorkspace(node);
    if (!workspaceId) {
      notify("没有可用工作区。请先在工作区面板创建一个工作区。", "error");
      return;
    }
    setBusyChat(chatId);
    try {
      const result = textOverride
        ? { text: textOverride, stats: { chars: textOverride.length, tokens: estimateTokens(textOverride) }, warnings: [] }
        : await compileContext(api, graphRef.current, node, {});
      const created = await api.createConversation({ workspaceId, prompt: result.text, autoSend });
      const current = graphRef.current;
      const updated = {
        ...current,
        updatedAt: Date.now(),
        nodes: current.nodes.map((candidate) =>
          candidate.id === chatId
            ? {
                ...candidate,
                data: {
                  ...candidate.data,
                  status: created.ok ? "created" : "error",
                  resultSessionId: created.sessionId || candidate.data.resultSessionId,
                  resultAt: Date.now(),
                  lastContextChars: result.stats ? result.stats.chars : result.text.length,
                  lastTokens: result.stats ? result.stats.tokens : estimateTokens(result.text),
                },
              }
            : candidate,
        ),
      };
      setGraph(updated);
      saveGraph(updated);
      setPreview(null);
      if (!created.ok) {
        notify("对话已创建，但上下文没有填入：" + created.error + "。可以在对话里粘贴预览内容。", "error");
      } else if (autoSend) {
        notify("已创建对话并发送上下文。", "info");
      } else {
        notify("已创建对话，上下文已填入输入框；检查后发送即可。", "info");
      }
    } catch (error) {
      notify("创建对话失败：" + String(error && error.message ? error.message : error), "error");
    } finally {
      setBusyChat(null);
    }
  }, [api, inferWorkspace, notify]);

  const fitView = useCallback((minScale) => {
    const minimum = typeof minScale === "number" && Number.isFinite(minScale) ? minScale : 0.25;
    const current = graphRef.current;
    const element = canvasRef.current;
    if (!element) return;
    if (current.nodes.length === 0) {
      setGraph((prev) => ({ ...prev, viewport: { x: 48, y: 48, scale: 1 } }));
      return;
    }
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const node of current.nodes) {
      const size = SIZES[node.type] || SIZES.chat;
      minX = Math.min(minX, node.x);
      minY = Math.min(minY, node.y);
      maxX = Math.max(maxX, node.x + size.w);
      maxY = Math.max(maxY, node.y + size.h);
    }
    const padding = 48;
    const width = element.clientWidth;
    const height = element.clientHeight;
    const scale = clamp(Math.min((width - padding * 2) / Math.max(1, maxX - minX), (height - padding * 2) / Math.max(1, maxY - minY)), minimum, 1.25);
    const x = (width - (maxX - minX) * scale) / 2 - minX * scale;
    const y = (height - (maxY - minY) * scale) / 2 - minY * scale;
    setGraph((prev) => ({ ...prev, viewport: { x, y, scale } }));
  }, []);

  const zoomBy = useCallback((factor) => {
    const element = canvasRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    setGraph((prev) => {
      const vp = prev.viewport;
      const scale = clamp(vp.scale * factor, MIN_SCALE, MAX_SCALE);
      const k = scale / vp.scale;
      const sx = rect.width / 2;
      const sy = rect.height / 2;
      return { ...prev, viewport: { scale, x: sx - (sx - vp.x) * k, y: sy - (sy - vp.y) * k } };
    });
  }, []);

  useEffect(() => {
    const element = canvasRef.current;
    if (!element) return undefined;
    const onWheel = (event) => {
      event.preventDefault();
      const rect = element.getBoundingClientRect();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? rect.height : 1;
      const deltaX = event.deltaX * unit;
      const deltaY = event.deltaY * unit;
      setGraph((prev) => {
        const vp = prev.viewport;
        if (event.ctrlKey || event.metaKey) {
          const sx = event.clientX - rect.left;
          const sy = event.clientY - rect.top;
          const factor = Math.exp(-deltaY * 0.0018);
          const scale = clamp(vp.scale * factor, MIN_SCALE, MAX_SCALE);
          const k = scale / vp.scale;
          return { ...prev, viewport: { scale, x: sx - (sx - vp.x) * k, y: sy - (sy - vp.y) * k } };
        }
        return { ...prev, viewport: { ...vp, x: vp.x - deltaX, y: vp.y - deltaY } };
      });
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, []);

  const startCanvasPan = useCallback((event) => {
    if (event.button !== 0 && event.button !== 1) return;
    if (event.target.closest && event.target.closest("[data-node-id]")) return;
    setSelection(null);
    setPanning(true);
    const startX = event.clientX;
    const startY = event.clientY;
    const vp = viewportRef.current;
    const move = (moveEvent) => {
      setGraph((prev) => ({
        ...prev,
        viewport: {
          ...prev.viewport,
          x: vp.x + moveEvent.clientX - startX,
          y: vp.y + moveEvent.clientY - startY,
        },
      }));
    };
    const up = () => {
      setPanning(false);
      window.removeEventListener("pointermove", move);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up, { once: true });
  }, []);

  const startNodeDrag = useCallback((event, node) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    setSelection({ kind: "node", id: node.id });
    const current = graphRef.current;
    const index = current.nodes.findIndex((candidate) => candidate.id === node.id);
    if (index >= 0 && index !== current.nodes.length - 1) {
      const nodes = current.nodes.slice();
      const item = nodes.splice(index, 1)[0];
      nodes.push(item);
      setGraph((prev) => ({ ...prev, nodes }));
    }
    const vp = viewportRef.current;
    const startX = event.clientX;
    const startY = event.clientY;
    const originX = node.x;
    const originY = node.y;
    let moved = false;
    const move = (moveEvent) => {
      const dx = (moveEvent.clientX - startX) / vp.scale;
      const dy = (moveEvent.clientY - startY) / vp.scale;
      if (!moved && Math.abs(dx) + Math.abs(dy) < 2) return;
      moved = true;
      setGraph((prev) => ({
        ...prev,
        nodes: prev.nodes.map((candidate) =>
          candidate.id === node.id ? { ...candidate, x: Math.round(originX + dx), y: Math.round(originY + dy) } : candidate,
        ),
      }));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      if (moved) setGraph((prev) => ({ ...prev, updatedAt: Date.now() }));
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up, { once: true });
  }, []);

  const handleCanvasDrop = useCallback(async (event) => {
    event.preventDefault();
    setDropActive(false);
    const world = worldFromClient(event.clientX, event.clientY);
    const sessionId = event.dataTransfer.getData("application/x-dsh-canvas-session") || "";
    if (sessionId) {
      addSessionNode(sessionId, { x: world.x - SIZES.conversation.w / 2, y: world.y - SIZES.conversation.h / 2 });
      return;
    }
    const files = event.dataTransfer.files ? Array.from(event.dataTransfer.files) : [];
    if (files.length > 0) {
      let offset = 0;
      for (const file of files) {
        await handleDroppedFile(file, {
          x: world.x - SIZES.file.w / 2 + offset,
          y: world.y - SIZES.file.h / 2 + offset,
        });
        offset += 28;
      }
      return;
    }
    const text = String(event.dataTransfer.getData("text/plain") || "").trim();
    if (text && (/^[A-Za-z]:[\\/]/.test(text) || /^\\\\/.test(text) || /^[\\/]/.test(text) || /^\.\.?[\\/]/.test(text))) {
      addFilePath(text, { x: world.x - SIZES.file.w / 2, y: world.y - SIZES.file.h / 2 });
    }
  }, [addFilePath, addSessionNode, handleDroppedFile, worldFromClient]);

  const openSessionSafe = useCallback((sessionId) => {
    if (!sessionId) return;
    try {
      api.openSession(sessionId);
    } catch (error) {
      notify("打开对话失败：" + String(error && error.message ? error.message : error), "error");
    }
  }, [api, notify]);

  const copySafe = useCallback(async (text) => {
    const ok = await copyText(text);
    notify(ok ? "已复制到剪贴板。" : "复制失败，请手动选择文本。", ok ? "info" : "error");
  }, [notify]);

  const exportCanvas = useCallback(() => {
    downloadText((graphRef.current.name || "canvas").replace(/[\\/:*?"<>|]/g, "-") + ".json", JSON.stringify(graphRef.current, null, 2));
    notify("画布 JSON 已导出。", "info");
  }, [notify]);

  const importCanvas = useCallback(async (file) => {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = safeParse(text);
      if (!parsed || !Array.isArray(parsed.nodes)) throw new Error("不是有效的画布 JSON");
      const rawNodes = Array.isArray(parsed.nodes) ? parsed.nodes : [];
      const rawEdges = Array.isArray(parsed.edges) ? parsed.edges : [];
      const uniqueIds = new Set(rawNodes.map((node) => node && node.id).filter(Boolean));
      const duplicateNodes = Math.max(0, rawNodes.length - uniqueIds.size);
      const unknownTypes = rawNodes.filter((node) => node && node.type && !Object.prototype.hasOwnProperty.call(SIZES, node.type)).length;
      const rawViewport = parsed.viewport && typeof parsed.viewport === "object" ? parsed.viewport : {};
      const viewportInvalid = typeof rawViewport.x !== "number" || !Number.isFinite(rawViewport.x)
        || typeof rawViewport.y !== "number" || !Number.isFinite(rawViewport.y)
        || typeof rawViewport.scale !== "number" || !Number.isFinite(rawViewport.scale)
        || rawViewport.scale < MIN_SCALE || rawViewport.scale > MAX_SCALE;
      const next = normalizeGraph(parsed);
      if (viewportInvalid) next.viewport = { x: 48, y: 48, scale: 1 };
      setGraph(next);
      setSelection(null);
      setTimeout(() => { try { fitView(0.55); } catch (error) { /* keep parsed viewport */ } }, 90);
      const droppedEdges = Math.max(0, rawEdges.length - next.edges.length);
      const details = [];
      if (duplicateNodes > 0) details.push(duplicateNodes + " 个重复节点");
      if (unknownTypes > 0) details.push(unknownTypes + " 个未知类型");
      if (droppedEdges > 0) details.push(droppedEdges + " 条无效连线");
      if (viewportInvalid) details.push("视口已修正");
      notify("已导入 " + next.nodes.length + " 个节点、" + next.edges.length + " 条连线" + (details.length > 0 ? "；清理：" + details.join("、") : ""), "info", null, 7000);
    } catch (error) {
      notify("导入失败：" + String(error && error.message ? error.message : error), "error");
    }
  }, [notify]);

  const clearCanvas = useCallback(() => {
    if (!window.confirm("清空当前画布？这会删除所有节点和连线（已创建的历史对话不受影响）。")) return;
    const next = emptyGraph();
    setGraph(next);
    saveGraph(next);
    setSelection(null);
    notify("画布已清空。", "info");
  }, [notify]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.defaultPrevented) return;
      if (event.key === "Escape") {
        if (preview) setPreview(null);
        else if (helpOpen) setHelpOpen(false);
        else if (menuOpen) setMenuOpen(false);
        else if (connecting) {
          if (cancelConnectRef.current) cancelConnectRef.current();
          else setConnecting(null);
        }
        else setSelection(null);
        return;
      }
      if ((event.key === "Delete" || event.key === "Backspace") && !isEditableTarget(event.target) && selection) {
        event.preventDefault();
        deleteSelection();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [connecting, deleteSelection, helpOpen, menuOpen, preview, selection]);

  const orderedNodes = useMemo(() => {
    if (!selection || selection.kind !== "node") return graph.nodes;
    const selected = graph.nodes.find((node) => node.id === selection.id);
    if (!selected) return graph.nodes;
    return [...graph.nodes.filter((node) => node.id !== selection.id), selected];
  }, [graph.nodes, selection]);

  const header = h(
    "header",
    { className: "dshcv-header" },
    h("div", { className: "dshcv-brand" },
      h(IconCanvas, { size: 22, className: "dshcv-brandIcon" }),
      h("input", {
        className: "dshcv-titleInput",
        value: graph.name,
        title: "重命名画布",
        "aria-label": "画布名称",
        onChange: (event) => mutate((prev) => ({ ...prev, name: event.target.value.slice(0, 80) })),
      }),
      h("span", { className: "dshcv-saveState" }, saveState === "saving" ? "保存中…" : saveState === "error" ? "保存失败" : "已保存"),
    ),
    h("div", { className: "dshcv-spacer" }),
    h("div", { className: "dshcv-headerActions" },
      h(Btn, { size: "sm", icon: IconFolder, onClick: () => { setDockOpen((value) => !value); setDockTab("sessions"); }, title: "显示或隐藏素材库", children: "素材库" }),
      h(Btn, { size: "sm", icon: IconSpark, onClick: addChatNode, title: "在画布中央新建一个对话节点", children: "新对话节点" }),
      h("div", { className: "dshcv-divider" }),
      h(IconButton, { icon: IconZoomOut, title: "缩小", onClick: () => zoomBy(1 / 1.18) }),
      h("button", {
        type: "button",
        className: "dshcv-zoomLabel",
        title: "重置为 100%",
        onClick: () => setGraph((prev) => ({ ...prev, viewport: { ...prev.viewport, scale: 1 } })),
      }, Math.round(graph.viewport.scale * 100) + "%"),
      h(IconButton, { icon: IconZoomIn, title: "放大", onClick: () => zoomBy(1.18) }),
      h(IconButton, { icon: IconFit, title: "适应画布", onClick: () => fitView() }),
      h("div", { className: "dshcv-divider" }),
      h(IconButton, { icon: IconHelp, title: "使用帮助", onClick: () => setHelpOpen(true) }),
      h(IconButton, { icon: IconMore, title: "更多", onClick: () => setMenuOpen((value) => !value) }),
    ),
  );

  const canvas = h(
    "div",
    {
      ref: canvasRef,
      className: "dshcv-canvas",
      "data-panning": panning ? "true" : undefined,
      style: {
        backgroundSize: GRID * graph.viewport.scale + "px " + GRID * graph.viewport.scale + "px",
        backgroundPosition: graph.viewport.x + "px " + graph.viewport.y + "px",
      },
      onPointerDown: startCanvasPan,
      onDragOver: (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
        if (!dropActive) setDropActive(true);
      },
      onDragLeave: (event) => {
        if (event.currentTarget === event.target) setDropActive(false);
      },
      onDrop: handleCanvasDrop,
    },
    h(
      "div",
      {
        className: "dshcv-world",
        style: { transform: "translate(" + graph.viewport.x + "px," + graph.viewport.y + "px) scale(" + graph.viewport.scale + ")" },
      },
      h(EdgeLayer, {
        graph,
        selection,
        connecting,
        onSelectEdge: (event, edge) => {
          event.stopPropagation();
          setSelection({ kind: "edge", id: edge.id });
        },
      }),
      orderedNodes.map((node) => {
        const incoming = node.type === "chat" ? graph.edges.filter((edge) => edge.to === node.id).length : 0;
        const summary = node.type === "conversation" ? sessionsById.get(node.data.sessionId) : undefined;
        return h(NodeCard, {
          key: node.id,
          node,
          incoming,
          updatedAt: summary ? Number(summary.updatedAt) || 0 : 0,
          selected: Boolean(selection && selection.kind === "node" && selection.id === node.id),
          busy: busyChat === node.id,
          reading: readingNode === node.id,
          dropOk: Boolean(connecting && node.type === "chat" && node.id !== connecting.from),
          dropHover: Boolean(connecting && connecting.over === node.id),
          onDragStart: startNodeDrag,
          onPortStart: startPortDrag,
          onRefresh: refreshDigestInternal,
          onReadFile: readFileNode,
          onPreview: openPreview,
          onCreate: createChat,
          onOpenSession: openSessionSafe,
        });
      }),
    ),
    graph.nodes.length === 0
      ? h("div", { className: "dshcv-emptyCanvas" },
          h("div", { className: "dshcv-emptyCard", onPointerDown: (event) => event.stopPropagation() },
            h("div", { className: "dshcv-emptyIcon" }, h(IconCanvas, { size: 24 })),
            h("div", { className: "dshcv-emptyTitle" }, "把多个对话连成一次新工作"),
            h("div", { className: "dshcv-emptyText" },
              "从左侧把历史对话拖进画布，加入文件和任务要求，再拖线连接到「新对话」节点。画布会把它们编译成一份带来源的上下文。"),
            h("div", { className: "dshcv-emptyActions" },
              h(Btn, { kind: "primary", size: "sm", icon: IconChat, onClick: () => setDockTab("sessions"), children: "选择历史对话" }),
              h(Btn, { kind: "outline", size: "sm", icon: IconSpark, onClick: addChatNode, children: "先放一个新对话节点" }),
            ),
          ),
        )
      : null,
    dropActive ? h("div", { className: "dshcv-dropHint" }, "松开以加入画布") : null,
  );

  const inspector = selection
    ? h(Inspector, {
        selection,
        graph,
        sessionsById,
        workspaces: workspaceItems,
        busy: Boolean(selectedNode && busyChat === selectedNode.id),
        onClose: () => setSelection(null),
        onUpdateNode: updateNode,
        onUpdateEdge: updateEdge,
        onDelete: deleteSelection,
        onRemoveEdge: removeEdge,
        onReorderSource: reorderSource,
        onRefreshDigest: refreshDigestInternal,
        onReadFile: readFileNode,
        onOpenSession: openSessionSafe,
        onCopy: copySafe,
        onPreview: (chatId) => openPreview(chatId, false),
        onCreate: (chatId, autoSend) => createChat(chatId, autoSend),
      })
    : null;

  return h(
    "section",
    { className: "dshcv-page", "aria-label": "画布", "data-connecting": connecting ? "true" : undefined },
    header,
    h(
      "div",
      { className: "dshcv-body" },
      dockOpen ? h(Dock, {
        tab: dockTab,
        onTab: setDockTab,
        query,
        onQuery: setQuery,
        sessions: filteredSessions,
        sessionsPhase: sessionsSnapshot ? sessionsSnapshot.phase : "loading",
        sessionCount: sessionItems.length,
        fileCount: fileNodes.length,
        promptCount: promptNodes.length,
        fileNodes,
        promptNodes,
        onAddSession: (sessionId) => addSessionNode(sessionId),
        onAddPath: (path) => addFilePath(path),
        onAddPrompt: (text) => addPromptNode(text),
        onFiles: (transfer) => {
          const files = transfer && transfer.files ? Array.from(transfer.files) : [];
          files.forEach((file) => {
            handleDroppedFile(file).catch((error) => notify("加入文件失败：" + String(error), "error"));
          });
        },
        onPickFiles: () => {
          if (fileInputRef.current) fileInputRef.current.click();
        },
        onLocate: (nodeId) => {
          const node = graphRef.current.nodes.find((candidate) => candidate.id === nodeId);
          if (!node) return;
          setSelection({ kind: "node", id: nodeId });
          const element = canvasRef.current;
          if (!element) return;
          const size = SIZES[node.type] || SIZES.chat;
          const vp = viewportRef.current;
          setGraph((prev) => ({
            ...prev,
            viewport: {
              ...prev.viewport,
              x: element.clientWidth / 2 - (node.x + size.w / 2) * vp.scale,
              y: element.clientHeight / 2 - (node.y + size.h / 2) * vp.scale,
            },
          }));
        },
      }) : null,
      h("div", { className: "dshcv-canvasHost" }, canvas),
      inspector,
    ),
    h(Toast, { toast }),
    menuOpen
      ? h(PopupMenu, {
          onClose: () => setMenuOpen(false),
          items: [
            { id: "export", label: "导出画布 JSON", icon: IconDownload, onSelect: exportCanvas },
            { id: "import", label: "导入画布 JSON", icon: IconUpload, onSelect: () => importInputRef.current && importInputRef.current.click() },
            { id: "fit", label: "适应视图", icon: IconFit, onSelect: fitView },
            "-",
            { id: "help", label: "使用帮助", icon: IconHelp, onSelect: () => setHelpOpen(true) },
            { id: "clear", label: "清空画布", icon: IconTrash, danger: true, onSelect: clearCanvas },
          ],
        })
      : null,
    preview
      ? h(PreviewModal, {
          preview,
          workspaceReady,
          onClose: () => setPreview(null),
          onRefresh: () => openPreview(preview.chatId, true),
          onCopy: copySafe,
          onCreate: (text, autoSend) => {
            const chatId = preview.chatId;
            setPreview(null);
            createChat(chatId, autoSend, text);
          },
        })
      : null,
    helpOpen ? h(HelpModal, { onClose: () => setHelpOpen(false) }) : null,
    h("input", {
      ref: fileInputRef,
      type: "file",
      multiple: true,
      style: { display: "none" },
      onChange: (event) => {
        const files = event.target.files ? Array.from(event.target.files) : [];
        files.forEach((file) => {
          handleDroppedFile(file).catch((error) => notify("加入文件失败：" + String(error), "error"));
        });
        event.target.value = "";
      },
    }),
    h("input", {
      ref: importInputRef,
      type: "file",
      accept: "application/json,.json",
      style: { display: "none" },
      onChange: (event) => {
        const file = event.target.files && event.target.files[0];
        importCanvas(file);
        event.target.value = "";
      },
    }),
  );
}
