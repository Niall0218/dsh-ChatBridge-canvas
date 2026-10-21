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
