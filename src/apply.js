const zh = {
  panel: "画布",
  title: "画布",
  subtitle: "把历史对话、文件和提示词连成新的工作上下文",
};

const en = {
  panel: "Canvas",
  title: "Canvas",
  subtitle: "Connect past conversations, files, and prompts into a new working context",
};

const inject = [
  "slots",
  "locale",
  "layout",
  "sessions",
  "workspaces",
  "uiWorkspace",
  "conversation",
  "remote",
  "remote.workspaceFiles",
];

function apply(ctx) {
  ctx.effect(() => {
    const tagId = "dsh-context-canvas/styles.css";
    if (typeof document === "undefined") return undefined;
    if (document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") !== null) return undefined;
    const tag = document.createElement("style");
    tag.dataset.plugin = "dsh-context-canvas";
    tag.dataset.pluginCss = tagId;
    tag.textContent = CSS;
    document.head.appendChild(tag);
    return () => tag.remove();
  }, "context-canvas: styles");

  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "context-canvas: dictionaries");

  const api = createCanvasApi(ctx);
  const t = ctx.locale.bind(NS);

  ctx.slots.inject("main", () => ctx.slots.register({
    name: "main",
    key: PANEL_ID,
    locale: NS,
    inject: () => ({ api }),
  }, CanvasPage));

  ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({
    name: "sidebar.panellist",
    id: PANEL_ID,
    order: 20,
    locale: NS,
    label: () => t("panel"),
  }, IconCanvas));
}
