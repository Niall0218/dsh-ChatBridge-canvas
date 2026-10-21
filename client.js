window.__ModuleLoader__.load({
  id: "dsh-context-canvas",
  factory(require) {
    "use strict";
    const CSS = "\n.dshcv-page{\n  --dshcv-bg:var(--dsw-alias-bg-base,#fff);\n  --dshcv-layer:var(--dsw-alias-bg-layer-1,#fff);\n  --dshcv-layer2:var(--dsw-alias-bg-layer-2,#f6f7f9);\n  --dshcv-border:var(--dsw-alias-border-l3,#e6e6e6);\n  --dshcv-border2:var(--dsw-alias-border-l2,#ddd);\n  --dshcv-text:var(--dsw-alias-label-primary,#1b1b1f);\n  --dshcv-muted:var(--dsw-alias-label-secondary,#62626b);\n  --dshcv-faint:var(--dsw-alias-label-tertiary,#9a9aa5);\n  --dshcv-accent:var(--dsw-alias-brand-primary,#4d6bfe);\n  --dshcv-accent-soft:color-mix(in srgb,var(--dshcv-accent) 12%,transparent);\n  --dshcv-hover:var(--dsw-alias-interactive-bg-hover,#f0f1f4);\n  --dshcv-active:var(--dsw-alias-interactive-bg-active,#e8eaf0);\n  --dshcv-danger:var(--dsw-alias-state-error-primary,#e5484d);\n  --dshcv-warn:var(--dsw-alias-state-warn-primary,#d97706);\n  --dshcv-ok:var(--dsw-alias-state-success-primary,#16a34a);\n  flex:1;min-height:0;min-width:0;display:flex;flex-direction:column;position:relative;overflow:hidden;\n  background:var(--dshcv-bg);color:var(--dshcv-text);\n  font-family:var(--dsw-font,-apple-system,BlinkMacSystemFont,\"Segoe UI\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif);\n  font-size:13px;line-height:1.45;\n}\n.dshcv-page *{box-sizing:border-box}\n.dshcv-page button,.dshcv-page input,.dshcv-page textarea,.dshcv-page select{font:inherit;color:inherit}\n.dshcv-page button{cursor:pointer}\n.dshcv-page ::-webkit-scrollbar{width:10px;height:10px}\n.dshcv-page ::-webkit-scrollbar-thumb{background:var(--dsw-alias-scrollbar-bg-l2,#d7d7dd);border-radius:8px;border:2px solid transparent;background-clip:content-box}\n.dshcv-page ::-webkit-scrollbar-thumb:hover{background:var(--dsw-alias-scrollbar-hover-l2,#bfbfc8);border:2px solid transparent;background-clip:content-box}\n\n/* header */\n.dshcv-header{flex:none;height:52px;display:flex;align-items:center;gap:6px;padding:0 10px 0 14px;border-bottom:1px solid var(--dshcv-border);background:var(--dshcv-bg);position:relative;z-index:5}\n.dshcv-brand{display:flex;align-items:center;gap:8px;min-width:0;flex:0 1 auto}\n.dshcv-brandIcon{width:22px;height:22px;color:var(--dshcv-accent);flex:none}\n.dshcv-titleInput{font-size:14px;font-weight:650;border:1px solid transparent;background:transparent;border-radius:6px;padding:3px 7px;min-width:60px;max-width:260px;width:150px;outline:none;text-overflow:ellipsis}\n.dshcv-titleInput:hover{background:var(--dshcv-hover)}\n.dshcv-titleInput:focus{background:var(--dshcv-layer);border-color:var(--dshcv-border2)}\n.dshcv-saveState{font-size:11px;color:var(--dshcv-faint);white-space:nowrap;margin-left:2px}\n.dshcv-spacer{flex:1}\n.dshcv-headerActions{display:flex;align-items:center;gap:4px}\n.dshcv-divider{width:1px;height:20px;background:var(--dshcv-border);margin:0 4px;flex:none}\n.dshcv-zoomLabel{font-size:11px;color:var(--dshcv-muted);min-width:36px;text-align:center;font-variant-numeric:tabular-nums}\n\n/* buttons */\n.dshcv-btn{display:inline-flex;align-items:center;justify-content:center;gap:5px;height:30px;padding:0 10px;border-radius:7px;border:1px solid transparent;background:transparent;color:var(--dshcv-text);white-space:nowrap;transition:background .12s,border-color .12s,opacity .12s}\n.dshcv-btn:hover{background:var(--dshcv-hover)}\n.dshcv-btn:active{background:var(--dshcv-active)}\n.dshcv-btn:disabled{opacity:.45;cursor:default;background:transparent}\n.dshcv-btn[data-kind=\"primary\"]{background:var(--dshcv-accent);color:#fff;font-weight:600}\n.dshcv-btn[data-kind=\"primary\"]:hover{background:color-mix(in srgb,var(--dshcv-accent) 88%,#000)}\n.dshcv-btn[data-kind=\"outline\"]{border-color:var(--dshcv-border2);background:var(--dshcv-layer)}\n.dshcv-btn[data-kind=\"outline\"]:hover{background:var(--dshcv-hover)}\n.dshcv-btn[data-kind=\"danger\"]{color:var(--dshcv-danger)}\n.dshcv-btn[data-kind=\"danger\"]:hover{background:color-mix(in srgb,var(--dshcv-danger) 10%,transparent)}\n.dshcv-btn[data-size=\"sm\"]{height:26px;padding:0 8px;font-size:12px;border-radius:6px}\n.dshcv-iconBtn{width:30px;height:30px;padding:0;border-radius:7px;border:none;background:transparent;color:var(--dshcv-muted);display:inline-flex;align-items:center;justify-content:center;flex:none}\n.dshcv-iconBtn:hover{background:var(--dshcv-hover);color:var(--dshcv-text)}\n.dshcv-iconBtn[data-active=\"true\"]{background:var(--dshcv-accent-soft);color:var(--dshcv-accent)}\n.dshcv-iconBtn[data-size=\"sm\"]{width:24px;height:24px;border-radius:5px}\n\n/* body + dock */\n.dshcv-body{flex:1;min-height:0;display:flex;position:relative}\n.dshcv-dock{width:252px;flex:none;min-height:0;display:flex;flex-direction:column;border-right:1px solid var(--dshcv-border);background:var(--dshcv-bg)}\n.dshcv-dockTabs{flex:none;display:flex;gap:2px;padding:8px 8px 0}\n.dshcv-tab{flex:1;height:30px;border:none;background:transparent;border-radius:7px;color:var(--dshcv-muted);font-size:12px;font-weight:550;display:flex;align-items:center;justify-content:center;gap:5px;white-space:nowrap;overflow:hidden;padding:0 2px}\n.dshcv-tab:hover{background:var(--dshcv-hover);color:var(--dshcv-text)}\n.dshcv-tab[data-active=\"true\"]{background:var(--dshcv-layer2);color:var(--dshcv-text)}\n.dshcv-tabBadge{font-size:10px;line-height:1;padding:2px 5px;border-radius:20px;background:var(--dshcv-accent-soft);color:var(--dshcv-accent);font-variant-numeric:tabular-nums}\n.dshcv-dockBody{flex:1;min-height:0;overflow:auto;padding:8px}\n.dshcv-dockHint{font-size:11px;color:var(--dshcv-faint);padding:2px 4px 8px;line-height:1.5}\n.dshcv-search{position:relative;margin-bottom:8px}\n.dshcv-search svg{position:absolute;left:9px;top:50%;transform:translateY(-50%);color:var(--dshcv-faint);pointer-events:none}\n.dshcv-searchInput{width:100%;height:30px;border:1px solid var(--dshcv-border);border-radius:7px;background:var(--dshcv-layer);padding:0 8px 0 29px;outline:none;font-size:12px}\n.dshcv-searchInput:focus{border-color:var(--dshcv-accent);box-shadow:0 0 0 2px var(--dshcv-accent-soft)}\n.dshcv-sessionRow{width:100%;display:flex;flex-direction:column;gap:2px;text-align:left;padding:7px 8px;border:none;background:transparent;border-radius:7px;color:var(--dshcv-text);position:relative}\n.dshcv-sessionRow:hover{background:var(--dshcv-hover)}\n.dshcv-sessionRow[data-dragging=\"true\"]{opacity:.5}\n.dshcv-sessionTop{display:flex;align-items:center;gap:6px;min-width:0}\n.dshcv-sessionTitle{font-size:12.5px;font-weight:520;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0}\n.dshcv-sessionTime{font-size:10.5px;color:var(--dshcv-faint);flex:none;font-variant-numeric:tabular-nums}\n.dshcv-sessionMeta{font-size:10.5px;color:var(--dshcv-faint);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-left:20px}\n.dshcv-sessionAdd{position:absolute;right:6px;bottom:6px;width:22px;height:22px;border-radius:5px;border:none;background:var(--dshcv-accent-soft);color:var(--dshcv-accent);display:none;align-items:center;justify-content:center;padding:0}\n.dshcv-sessionRow:hover .dshcv-sessionAdd{display:inline-flex}\n.dshcv-listEmpty{font-size:12px;color:var(--dshcv-faint);text-align:center;padding:28px 12px;line-height:1.6}\n\n/* fields */\n.dshcv-field{display:flex;flex-direction:column;gap:5px;margin-bottom:12px}\n.dshcv-fieldLabel{font-size:11px;font-weight:600;color:var(--dshcv-muted);display:flex;align-items:center;justify-content:space-between;gap:8px}\n.dshcv-fieldHint{font-size:10.5px;color:var(--dshcv-faint);line-height:1.5}\n.dshcv-input,.dshcv-select,.dshcv-textarea{width:100%;border:1px solid var(--dshcv-border);border-radius:7px;background:var(--dshcv-layer);padding:7px 8px;outline:none;font-size:12px}\n.dshcv-input{height:30px;padding:0 8px}\n.dshcv-input:focus,.dshcv-select:focus,.dshcv-textarea:focus{border-color:var(--dshcv-accent);box-shadow:0 0 0 2px var(--dshcv-accent-soft)}\n.dshcv-textarea{min-height:70px;resize:vertical;line-height:1.55}\n.dshcv-select{height:30px;padding:0 26px 0 8px;appearance:none;background-image:linear-gradient(45deg,transparent 50%,var(--dshcv-muted) 50%),linear-gradient(135deg,var(--dshcv-muted) 50%,transparent 50%);background-position:calc(100% - 14px) 50%,calc(100% - 9px) 50%;background-size:5px 5px,5px 5px;background-repeat:no-repeat}\n.dshcv-row{display:flex;align-items:center;gap:6px}\n.dshcv-row > .dshcv-input{flex:1;min-width:0}\n.dshcv-check{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;color:var(--dshcv-muted);cursor:pointer;user-select:none}\n.dshcv-check input{accent-color:var(--dshcv-accent);width:13px;height:13px;margin:0}\n\n/* canvas */\n.dshcv-canvasHost{flex:1;min-width:0;min-height:0;position:relative;overflow:hidden}\n.dshcv-canvas{position:absolute;inset:0;overflow:hidden;touch-action:none;cursor:grab;background-color:var(--dshcv-bg);background-image:radial-gradient(circle,color-mix(in srgb,var(--dshcv-faint) 42%,transparent) 1px,transparent 1.2px)}\n.dshcv-canvas[data-panning=\"true\"]{cursor:grabbing}\n.dshcv-world{position:absolute;left:0;top:0;transform-origin:0 0;will-change:transform}\n.dshcv-edges{position:absolute;left:0;top:0;width:1px;height:1px;overflow:visible;pointer-events:none;z-index:1}\n.dshcv-edge{fill:none;stroke:color-mix(in srgb,var(--dshcv-accent) 58%,var(--dshcv-border2));stroke-width:2;transition:stroke .12s}\n.dshcv-edge[data-selected=\"true\"]{stroke:var(--dshcv-accent);stroke-width:2.6}\n.dshcv-edgeHit{fill:none;stroke:transparent;stroke-width:14;pointer-events:stroke;cursor:pointer}\n.dshcv-edgeTemp{stroke:var(--dshcv-accent);stroke-dasharray:5 4;stroke-width:2}\n.dshcv-edgeLabel{font-size:9px;fill:var(--dshcv-faint);paint-order:stroke;stroke:var(--dshcv-bg);stroke-width:3px;stroke-linejoin:round}\n.dshcv-node{position:absolute;z-index:2;display:flex;flex-direction:column;background:var(--dshcv-layer);border:1px solid var(--dshcv-border);border-radius:11px;box-shadow:0 1px 2px rgba(20,20,35,.04),0 6px 18px rgba(20,20,35,.055);overflow:visible;user-select:none;transition:box-shadow .12s,border-color .12s}\n.dshcv-node:hover{border-color:var(--dshcv-border2);box-shadow:0 2px 4px rgba(20,20,35,.05),0 10px 26px rgba(20,20,35,.09)}\n.dshcv-node[data-selected=\"true\"]{border-color:var(--dshcv-accent);box-shadow:0 0 0 2px var(--dshcv-accent-soft),0 10px 28px rgba(20,20,35,.12)}\n.dshcv-node[data-type=\"chat\"]{border-color:color-mix(in srgb,var(--dshcv-accent) 38%,var(--dshcv-border))}\n.dshcv-nodeHead{flex:none;display:flex;align-items:center;gap:7px;padding:9px 10px 7px;cursor:grab;min-width:0}\n.dshcv-nodeHead:active{cursor:grabbing}\n.dshcv-nodeGlyph{width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;flex:none;background:var(--dshcv-layer2);color:var(--dshcv-muted)}\n.dshcv-node[data-type=\"conversation\"] .dshcv-nodeGlyph{background:color-mix(in srgb,#3b82f6 13%,transparent);color:#3b82f6}\n.dshcv-node[data-type=\"file\"] .dshcv-nodeGlyph{background:color-mix(in srgb,#f59e0b 15%,transparent);color:#d97706}\n.dshcv-node[data-type=\"prompt\"] .dshcv-nodeGlyph{background:color-mix(in srgb,#8b5cf6 14%,transparent);color:#7c3aed}\n.dshcv-node[data-type=\"chat\"] .dshcv-nodeGlyph{background:var(--dshcv-accent-soft);color:var(--dshcv-accent)}\n.dshcv-nodeTitle{font-size:12.5px;font-weight:620;line-height:1.35;min-width:0;flex:1;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;word-break:break-all}\n.dshcv-nodeBody{padding:0 10px 8px;font-size:11px;color:var(--dshcv-muted);min-height:0;overflow:hidden;flex:1}\n.dshcv-nodeMeta{font-size:10px;color:var(--dshcv-faint);display:flex;align-items:center;gap:5px;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.dshcv-dot{width:5px;height:5px;border-radius:50%;background:var(--dshcv-faint);flex:none}\n.dshcv-dot[data-tone=\"ok\"]{background:var(--dshcv-ok)}\n.dshcv-dot[data-tone=\"warn\"]{background:var(--dshcv-warn)}\n.dshcv-dot[data-tone=\"error\"]{background:var(--dshcv-danger)}\n.dshcv-dot[data-tone=\"accent\"]{background:var(--dshcv-accent)}\n.dshcv-nodeText{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;word-break:break-word;line-height:1.5;white-space:pre-wrap}\n.dshcv-nodeText[data-lines=\"2\"]{-webkit-line-clamp:2}\n.dshcv-nodeFoot{flex:none;display:flex;align-items:center;gap:6px;padding:7px 10px 9px;border-top:1px solid color-mix(in srgb,var(--dshcv-border) 65%,transparent);font-size:10.5px;color:var(--dshcv-faint);min-width:0}\n.dshcv-nodeFoot .dshcv-spacer{flex:1}\n.dshcv-chip{display:inline-flex;align-items:center;gap:4px;padding:2px 6px;border-radius:20px;background:var(--dshcv-layer2);color:var(--dshcv-muted);font-size:10px;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.dshcv-chip[data-tone=\"accent\"]{background:var(--dshcv-accent-soft);color:var(--dshcv-accent)}\n.dshcv-chip[data-tone=\"warn\"]{background:color-mix(in srgb,var(--dshcv-warn) 12%,transparent);color:var(--dshcv-warn)}\n.dshcv-chip[data-tone=\"error\"]{background:color-mix(in srgb,var(--dshcv-danger) 12%,transparent);color:var(--dshcv-danger)}\n.dshcv-chip[data-tone=\"ok\"]{background:color-mix(in srgb,var(--dshcv-ok) 12%,transparent);color:var(--dshcv-ok)}\n.dshcv-nodeActions{display:flex;gap:5px;padding:0 10px 9px;flex:none}\n.dshcv-nodeActions .dshcv-btn{flex:1;height:26px;font-size:11px;padding:0 6px}\n.dshcv-port{position:absolute;top:50%;width:13px;height:13px;margin-top:-6.5px;border-radius:50%;border:2px solid var(--dshcv-layer);background:var(--dshcv-border2);z-index:4;transition:transform .12s,background .12s;box-shadow:0 0 0 1px var(--dshcv-border)}\n.dshcv-port:hover{transform:scale(1.22);background:var(--dshcv-accent)}\n.dshcv-port[data-side=\"out\"]{right:-7px;cursor:crosshair;background:var(--dshcv-accent);box-shadow:0 0 0 2px color-mix(in srgb,var(--dshcv-accent) 20%,transparent)}\n.dshcv-port[data-side=\"in\"]{left:-7px;cursor:default;background:var(--dshcv-layer);border-color:var(--dshcv-accent)}\n.dshcv-port[data-side=\"in\"]:after{content:\"\";position:absolute;inset:4px;border-radius:50%;background:var(--dshcv-accent)}\n.dshcv-port[data-side=\"out\"]:after{content:\"+\";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;line-height:1}\n.dshcv-node[data-type=\"chat\"] .dshcv-port[data-side=\"out\"]{display:none}\n\n/* connection drag feedback */\n.dshcv-node[data-drop-ok=\"true\"]{border-style:dashed;border-color:var(--dshcv-accent);opacity:1}\n.dshcv-node[data-drop-hover=\"true\"]{border-style:solid;box-shadow:0 0 0 3px var(--dshcv-accent-soft),0 12px 30px rgba(20,20,35,.14)}\n.dshcv-node[data-drop-hover=\"true\"] .dshcv-port[data-side=\"in\"]{background:var(--dshcv-accent);transform:scale(1.35)}\n.dshcv-page[data-connecting=\"true\"] .dshcv-node:not([data-drop-ok=\"true\"]){opacity:.55}\n.dshcv-page[data-connecting=\"true\"] .dshcv-inspector{pointer-events:none}\n\n/* empty state */\n.dshcv-emptyCanvas{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;padding:24px}\n.dshcv-emptyCard{pointer-events:auto;max-width:410px;text-align:center;background:color-mix(in srgb,var(--dshcv-layer) 86%,transparent);backdrop-filter:blur(6px);border:1px solid var(--dshcv-border);border-radius:14px;padding:26px 26px 22px;box-shadow:0 10px 36px rgba(20,20,35,.08)}\n.dshcv-emptyIcon{width:44px;height:44px;border-radius:12px;background:var(--dshcv-accent-soft);color:var(--dshcv-accent);display:flex;align-items:center;justify-content:center;margin:0 auto 12px}\n.dshcv-emptyTitle{font-size:15px;font-weight:650;margin:0 0 6px}\n.dshcv-emptyText{font-size:12px;color:var(--dshcv-muted);line-height:1.65;margin:0 0 16px}\n.dshcv-emptyActions{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}\n\n/* inspector */\n.dshcv-inspector{position:absolute;top:0;right:0;bottom:0;width:320px;z-index:12;display:flex;flex-direction:column;border-left:1px solid var(--dshcv-border);background:var(--dshcv-bg);box-shadow:-8px 0 24px rgba(20,20,35,.08);animation:dshcv-slideIn .16s ease-out}\n@keyframes dshcv-slideIn{from{transform:translateX(8px);opacity:.6}to{transform:none;opacity:1}}\n.dshcv-inspectorHead{flex:none;display:flex;align-items:center;gap:8px;padding:11px 12px;border-bottom:1px solid var(--dshcv-border)}\n.dshcv-inspectorTitle{font-size:12.5px;font-weight:650;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.dshcv-inspectorBody{flex:1;min-height:0;overflow:auto;padding:12px}\n.dshcv-section{padding:0 0 12px;margin:0 0 12px;border-bottom:1px solid color-mix(in srgb,var(--dshcv-border) 72%,transparent)}\n.dshcv-section:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0}\n.dshcv-sectionTitle{font-size:10.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--dshcv-faint);margin:0 0 8px;display:flex;align-items:center;justify-content:space-between}\n.dshcv-source{display:flex;align-items:center;gap:7px;padding:6px 4px;border-radius:6px;font-size:11.5px;min-width:0}\n.dshcv-source:hover{background:var(--dshcv-hover)}\n.dshcv-sourceTitle{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.dshcv-sourceOrder{display:flex;flex-direction:column;gap:2px;flex:none}\n.dshcv-sourceOrder button{width:16px;height:14px;border:none;background:transparent;color:var(--dshcv-faint);padding:0;display:flex;align-items:center;justify-content:center;border-radius:3px}\n.dshcv-sourceOrder button:hover{background:var(--dshcv-active);color:var(--dshcv-text)}\n.dshcv-sourceOrder button:disabled{opacity:.25}\n.dshcv-code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10.5px;background:var(--dshcv-layer2);border:1px solid var(--dshcv-border);border-radius:6px;padding:7px 8px;white-space:pre-wrap;word-break:break-word;max-height:180px;overflow:auto;line-height:1.5;color:var(--dshcv-muted)}\n.dshcv-inlineActions{display:flex;gap:6px;flex-wrap:wrap}\n.dshcv-statusLine{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--dshcv-muted);margin-top:6px}\n\n/* modal */\n.dshcv-modalLayer{position:absolute;inset:0;z-index:40;background:color-mix(in srgb,var(--dshcv-text) 22%,transparent);backdrop-filter:blur(2px);display:flex;align-items:center;justify-content:center;padding:24px;animation:dshcv-fadeIn .14s ease-out}\n@keyframes dshcv-fadeIn{from{opacity:0}to{opacity:1}}\n.dshcv-modal{width:min(840px,100%);max-height:min(760px,100%);display:flex;flex-direction:column;background:var(--dshcv-layer);border:1px solid var(--dshcv-border);border-radius:14px;box-shadow:0 24px 80px rgba(10,10,25,.28);overflow:hidden;animation:dshcv-popIn .16s ease-out}\n@keyframes dshcv-popIn{from{transform:translateY(6px) scale(.99);opacity:.6}to{transform:none;opacity:1}}\n.dshcv-modalHead{flex:none;display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid var(--dshcv-border)}\n.dshcv-modalTitle{font-size:14px;font-weight:650;flex:1}\n.dshcv-modalBody{flex:1;min-height:0;overflow:auto;padding:16px}\n.dshcv-modalFoot{flex:none;display:flex;align-items:center;gap:8px;padding:12px 16px;border-top:1px solid var(--dshcv-border);background:var(--dshcv-bg)}\n.dshcv-stats{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}\n.dshcv-stat{background:var(--dshcv-layer2);border:1px solid var(--dshcv-border);border-radius:8px;padding:7px 10px;min-width:88px}\n.dshcv-statLabel{font-size:10px;color:var(--dshcv-faint);margin-bottom:2px}\n.dshcv-statValue{font-size:14px;font-weight:650;font-variant-numeric:tabular-nums}\n.dshcv-previewText{width:100%;height:min(440px,48vh);resize:vertical;border:1px solid var(--dshcv-border);border-radius:9px;background:var(--dshcv-bg);padding:12px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11.5px;line-height:1.62;outline:none;white-space:pre-wrap}\n.dshcv-notice{display:flex;align-items:flex-start;gap:8px;padding:9px 10px;border-radius:8px;background:color-mix(in srgb,var(--dshcv-warn) 9%,transparent);color:var(--dshcv-warn);font-size:11.5px;line-height:1.55;margin-bottom:12px}\n.dshcv-notice[data-tone=\"info\"]{background:var(--dshcv-accent-soft);color:var(--dshcv-accent)}\n.dshcv-notice[data-tone=\"error\"]{background:color-mix(in srgb,var(--dshcv-danger) 9%,transparent);color:var(--dshcv-danger)}\n\n/* menu, toast, misc */\n.dshcv-menu{position:absolute;z-index:30;min-width:190px;background:var(--dshcv-layer);border:1px solid var(--dshcv-border);border-radius:9px;box-shadow:0 12px 32px rgba(10,10,25,.16);padding:5px}\n.dshcv-menuItem{width:100%;height:30px;border:none;background:transparent;border-radius:6px;padding:0 9px;display:flex;align-items:center;gap:8px;font-size:12px;color:var(--dshcv-text);text-align:left}\n.dshcv-menuItem:hover{background:var(--dshcv-hover)}\n.dshcv-menuItem[data-danger=\"true\"]{color:var(--dshcv-danger)}\n.dshcv-menuSep{height:1px;background:var(--dshcv-border);margin:5px 3px}\n.dshcv-toast{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);z-index:60;display:flex;align-items:center;gap:8px;background:var(--dsw-alias-toast-bg,#1f2026);color:var(--dsw-alias-toast-label,#fff);padding:9px 14px;border-radius:9px;font-size:12px;box-shadow:0 8px 28px rgba(0,0,0,.24);max-width:min(560px,80%);animation:dshcv-toastIn .18s ease-out}\n@keyframes dshcv-toastIn{from{transform:translate(-50%,8px);opacity:0}to{transform:translate(-50%,0);opacity:1}}\n.dshcv-toast[data-tone=\"error\"]{background:var(--dshcv-danger);color:#fff}\n.dshcv-spinner{width:13px;height:13px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;display:inline-block;animation:dshcv-spin .7s linear infinite;flex:none;opacity:.7}\n@keyframes dshcv-spin{to{transform:rotate(360deg)}}\n.dshcv-kbd{display:inline-block;padding:1px 5px;border-radius:4px;border:1px solid var(--dshcv-border2);background:var(--dshcv-layer2);font-family:ui-monospace,monospace;font-size:10px;color:var(--dshcv-muted)}\n.dshcv-helpList{margin:0;padding-left:18px;font-size:12px;line-height:1.8;color:var(--dshcv-muted)}\n.dshcv-helpList b{color:var(--dshcv-text);font-weight:600}\n.dshcv-dropHint{position:absolute;inset:10px;border:2px dashed var(--dshcv-accent);border-radius:12px;background:var(--dshcv-accent-soft);display:flex;align-items:center;justify-content:center;color:var(--dshcv-accent);font-size:13px;font-weight:600;pointer-events:none;z-index:6}\n\n@media (max-width:1100px){\n  .dshcv-dock{width:220px}\n  .dshcv-inspector{width:300px}\n}\n@media (max-width:900px){\n  .dshcv-dock{width:196px}\n  .dshcv-saveState{display:none}\n  .dshcv-titleInput{width:110px}\n  .dshcv-tab{font-size:11px;gap:3px}\n  .dshcv-tabBadge{display:none}\n}\n";
// ---- src/prelude.js ----
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

// ---- src/afc.js ----
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

// ---- src/model.js ----
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

// ---- src/ui-icons.js ----
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

// ---- src/ui-parts.js ----
function Btn(props) {
  const icon = props.icon;
  return h(
    "button",
    {
      type: "button",
      className: cx("dshcv-btn", props.className),
      "data-kind": props.kind || "ghost",
      "data-size": props.size,
      disabled: props.disabled || false,
      title: props.title,
      "aria-label": props.title,
      onClick: props.onClick,
      onPointerDown: props.onPointerDown,
    },
    icon ? h(icon, { size: props.size === "sm" ? 13 : 14 }) : null,
    props.children != null ? props.children : null,
    props.busy ? h("span", { className: "dshcv-spinner" }) : null,
  );
}

function IconButton(props) {
  const icon = props.icon;
  return h(
    "button",
    {
      type: "button",
      className: cx("dshcv-iconBtn", props.className),
      "data-size": props.size,
      "data-active": props.active ? "true" : undefined,
      title: props.title,
      "aria-label": props.title,
      "aria-pressed": props.active === undefined ? undefined : Boolean(props.active),
      disabled: props.disabled || false,
      onClick: props.onClick,
    },
    h(icon, { size: props.size === "sm" ? 13 : props.iconSize || 15 }),
  );
}

function Field(props) {
  return h(
    "div",
    { className: "dshcv-field" },
    props.label
      ? h(
          "div",
          { className: "dshcv-fieldLabel" },
          h("span", null, props.label),
          props.action != null ? props.action : null,
        )
      : null,
    props.children,
    props.hint ? h("div", { className: "dshcv-fieldHint" }, props.hint) : null,
  );
}

function Spinner(props) {
  return h("span", { className: "dshcv-spinner", style: props.style, "aria-label": props.label || "加载中" });
}

function PopupMenu(props) {
  const ref = useRef(null);
  useEffect(() => {
    const onPointerDown = (event) => {
      if (ref.current && ref.current.contains(event.target)) return;
      props.onClose();
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") props.onClose();
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [props.onClose]);
  return h(
    "div",
    {
      ref,
      className: "dshcv-menu",
      style: Object.assign({ top: 48, right: 10 }, props.style || {}),
      role: "menu",
    },
    props.items.map((item, index) => {
      if (item === "-") return h("div", { key: "sep-" + index, className: "dshcv-menuSep" });
      return h(
        "button",
        {
          key: item.id || index,
          type: "button",
          role: "menuitem",
          className: "dshcv-menuItem",
          "data-danger": item.danger ? "true" : undefined,
          onClick: () => {
            props.onClose();
            item.onSelect();
          },
        },
        item.icon ? h(item.icon, { size: 14 }) : null,
        h("span", null, item.label),
      );
    }),
  );
}

function Modal(props) {
  const ref = useRef(null);
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        props.onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const timer = setTimeout(() => {
      const focusable = ref.current && ref.current.querySelector("button, textarea, input, select");
      if (focusable) focusable.focus();
    }, 30);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [props.onClose]);

  return h(
    "div",
    {
      className: "dshcv-modalLayer",
      onPointerDown: (event) => {
        if (event.target === event.currentTarget) props.onClose();
      },
    },
    h(
      "div",
      {
        ref,
        className: "dshcv-modal",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": props.title,
      },
      h(
        "div",
        { className: "dshcv-modalHead" },
        props.icon ? h(props.icon, { size: 17 }) : null,
        h("div", { className: "dshcv-modalTitle" }, props.title),
        h(IconButton, { icon: IconClose, title: "关闭", onClick: props.onClose }),
      ),
      h("div", { className: "dshcv-modalBody" }, props.children),
      props.footer ? h("div", { className: "dshcv-modalFoot" }, props.footer) : null,
    ),
  );
}

function Toast(props) {
  const toast = props.toast;
  if (!toast) return null;
  return h(
    "div",
    { className: "dshcv-toast", "data-tone": toast.tone || "info", role: "status" },
    toast.tone === "error" ? h(IconWarning, { size: 14 }) : h(IconCheck, { size: 14 }),
    h("span", null, toast.text),
    toast.action
      ? h(Btn, {
          size: "sm",
          kind: "ghost",
          onClick: toast.action.onClick,
          children: toast.action.label,
        })
      : null,
  );
}

// ---- src/ui-nodes.js ----
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

// ---- src/ui-inspector.js ----
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

// ---- src/ui-page.js ----
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

// ---- src/apply.js ----
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

    return { inject, apply };
  },
});
