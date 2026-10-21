function IconBase(props) {
  const size = props.size || 16;
  const children = props.children;
  return h(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: props.weight || 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      style: props.style,
      className: props.className,
    },
    children,
  );
}

function IconCanvas(props) {
  return h(IconBase, props,
    h("rect", { x: 3, y: 4, width: 8, height: 7, rx: 1.6 }),
    h("rect", { x: 13, y: 13, width: 8, height: 7, rx: 1.6 }),
    h("path", { d: "M11 7.5h3.2a2 2 0 0 1 2 2V13" }),
    h("circle", { cx: 11, cy: 7.5, r: 0.9, fill: "currentColor", stroke: "none" }),
    h("circle", { cx: 16.2, cy: 13, r: 0.9, fill: "currentColor", stroke: "none" }),
  );
}
function IconChat(props) {
  return h(IconBase, props, h("path", { d: "M20 12.4a7.6 7.6 0 0 1-8 7.4 9 9 0 0 1-2.7-.4L4 21l1.4-4.5A7.2 7.2 0 0 1 4 12.4 7.6 7.6 0 0 1 12 5a7.6 7.6 0 0 1 8 7.4Z" }), h("path", { d: "M8.5 11.5h7M8.5 14.5h4" }));
}
function IconFile(props) {
  return h(IconBase, props, h("path", { d: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" }), h("path", { d: "M14 3v5h5M9 13h6M9 17h6" }));
}
function IconPrompt(props) {
  return h(IconBase, props, h("path", { d: "M4 6h16M4 12h10M4 18h7" }), h("path", { d: "m16 15 2 2-2 2" }), h("path", { d: "M20 17h-5" }));
}
function IconSpark(props) {
  return h(IconBase, props, h("path", { d: "M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" }));
}
function IconSearch(props) {
  return h(IconBase, props, h("circle", { cx: 11, cy: 11, r: 6.2 }), h("path", { d: "m16 16 4 4" }));
}
function IconPlus(props) {
  return h(IconBase, props, h("path", { d: "M12 5v14M5 12h14" }));
}
function IconClose(props) {
  return h(IconBase, props, h("path", { d: "m6 6 12 12M18 6 6 18" }));
}
function IconTrash(props) {
  return h(IconBase, props, h("path", { d: "M4 7h16M10 4h4M6 7l1 13h10l1-13" }), h("path", { d: "M10 11v5M14 11v5" }));
}
function IconRefresh(props) {
  return h(IconBase, props, h("path", { d: "M20 11a8 8 0 1 0-2.3 6.4" }), h("path", { d: "M20 5v6h-6" }));
}
function IconLink(props) {
  return h(IconBase, props, h("path", { d: "M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.2 1.2" }), h("path", { d: "M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20.1l1.2-1.2" }));
}
function IconZoomIn(props) {
  return h(IconBase, props, h("circle", { cx: 11, cy: 11, r: 6.2 }), h("path", { d: "m16 16 4 4M11 8.5v5M8.5 11h5" }));
}
function IconZoomOut(props) {
  return h(IconBase, props, h("circle", { cx: 11, cy: 11, r: 6.2 }), h("path", { d: "m16 16 4 4M8.5 11h5" }));
}
function IconFit(props) {
  return h(IconBase, props, h("path", { d: "M4 9V5a1 1 0 0 1 1-1h4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4" }));
}
function IconMore(props) {
  return h(IconBase, props, h("circle", { cx: 5, cy: 12, r: 1.2, fill: "currentColor", stroke: "none" }), h("circle", { cx: 12, cy: 12, r: 1.2, fill: "currentColor", stroke: "none" }), h("circle", { cx: 19, cy: 12, r: 1.2, fill: "currentColor", stroke: "none" }));
}
function IconHelp(props) {
  return h(IconBase, props, h("circle", { cx: 12, cy: 12, r: 8.5 }), h("path", { d: "M9.6 9.2a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .9-1 1.7v.4" }), h("circle", { cx: 12, cy: 17, r: 0.9, fill: "currentColor", stroke: "none" }));
}
function IconCopy(props) {
  return h(IconBase, props, h("rect", { x: 9, y: 9, width: 11, height: 11, rx: 2 }), h("path", { d: "M5 15V6a2 2 0 0 1 2-2h8" }));
}
function IconCheck(props) {
  return h(IconBase, props, h("path", { d: "m5 12 4.5 4.5L19 7" }));
}
function IconPlay(props) {
  return h(IconBase, props, h("path", { d: "M8 5.5v13l10-6.5Z" }));
}
function IconArrowUp(props) {
  return h(IconBase, props, h("path", { d: "M12 19V5M6.5 10.5 12 5l5.5 5.5" }));
}
function IconArrowDown(props) {
  return h(IconBase, props, h("path", { d: "M12 5v14M6.5 13.5 12 19l5.5-5.5" }));
}
function IconFolder(props) {
  return h(IconBase, props, h("path", { d: "M3.5 7.5A2.5 2.5 0 0 1 6 5h4l2 2h6.5A2.5 2.5 0 0 1 21 9.5v8A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5Z" }));
}
function IconClock(props) {
  return h(IconBase, props, h("circle", { cx: 12, cy: 12, r: 8.5 }), h("path", { d: "M12 7.5V12l3 2" }));
}
function IconWarning(props) {
  return h(IconBase, props, h("path", { d: "M10.3 4.2 2.9 17a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z" }), h("path", { d: "M12 9v4.2" }), h("circle", { cx: 12, cy: 17, r: 0.9, fill: "currentColor", stroke: "none" }));
}
function IconDownload(props) {
  return h(IconBase, props, h("path", { d: "M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14" }));
}
function IconUpload(props) {
  return h(IconBase, props, h("path", { d: "M12 16V5M7.5 9.5 12 5l4.5 4.5M5 19.5h14" }));
}
function IconChevronDown(props) {
  return h(IconBase, props, h("path", { d: "m6 9 6 6 6-6" }));
}
function IconExternal(props) {
  return h(IconBase, props, h("path", { d: "M14 4h6v6M20 4l-8 8" }), h("path", { d: "M19 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" }));
}
function IconGrip(props) {
  return h(IconBase, props, h("circle", { cx: 9, cy: 7, r: 1, fill: "currentColor", stroke: "none" }), h("circle", { cx: 15, cy: 7, r: 1, fill: "currentColor", stroke: "none" }), h("circle", { cx: 9, cy: 12, r: 1, fill: "currentColor", stroke: "none" }), h("circle", { cx: 15, cy: 12, r: 1, fill: "currentColor", stroke: "none" }), h("circle", { cx: 9, cy: 17, r: 1, fill: "currentColor", stroke: "none" }), h("circle", { cx: 15, cy: 17, r: 1, fill: "currentColor", stroke: "none" }));
}
function IconSend(props) {
  return h(IconBase, props, h("path", { d: "M4.5 11.5 20 4l-7.5 15.5-2.2-6.3Z" }), h("path", { d: "m10.3 13.2 4.5-4.5" }));
}

function TypeIcon(props) {
  const type = props.type;
  const size = props.size || 14;
  if (type === "conversation") return h(IconChat, { size });
  if (type === "file") return h(IconFile, { size });
  if (type === "prompt") return h(IconPrompt, { size });
  return h(IconSpark, { size });
}
