const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;width:100%;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;height:22px;
    border-radius:6px;cursor:default;padding:0}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}
`;
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  const setTweak = React.useCallback((key, val) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [key]: val } }, "*");
  }, []);
  return [values, setTweak];
}
function TweaksPanel({ title = "Tweaks", children }) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({ x: 16, y: 16 });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + "px";
    panel.style.bottom = offsetRef.current.y + "px";
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", clampToViewport);
      return () => window.removeEventListener("resize", clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = (e) => {
      var _a;
      const t = (_a = e == null ? void 0 : e.data) == null ? void 0 : _a.type;
      if (t === "__activate_edit_mode") setOpen(true);
      else if (t === "__deactivate_edit_mode") setOpen(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*");
  };
  const onDragStart = (e) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev) => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };
  if (!open) return null;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("style", null, __TWEAKS_STYLE), /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: dragRef,
      className: "twk-panel",
      style: { right: offsetRef.current.x, bottom: offsetRef.current.y }
    },
    /* @__PURE__ */ React.createElement("div", { className: "twk-hd", onMouseDown: onDragStart }, /* @__PURE__ */ React.createElement("b", null, title), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "twk-x",
        "aria-label": "Close tweaks",
        onMouseDown: (e) => e.stopPropagation(),
        onClick: dismiss
      },
      "\u2715"
    )),
    /* @__PURE__ */ React.createElement("div", { className: "twk-body" }, children)
  ));
}
function TweakSection({ label, children }) {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "twk-sect" }, label), children);
}
function TweakRow({ label, value, children, inline = false }) {
  return /* @__PURE__ */ React.createElement("div", { className: inline ? "twk-row twk-row-h" : "twk-row" }, /* @__PURE__ */ React.createElement("div", { className: "twk-lbl" }, /* @__PURE__ */ React.createElement("span", null, label), value != null && /* @__PURE__ */ React.createElement("span", { className: "twk-val" }, value)), children);
}
function TweakSlider({ label, value, min = 0, max = 100, step = 1, unit = "", onChange }) {
  return /* @__PURE__ */ React.createElement(TweakRow, { label, value: `${value}${unit}` }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "range",
      className: "twk-slider",
      min,
      max,
      step,
      value,
      onChange: (e) => onChange(Number(e.target.value))
    }
  ));
}
function TweakToggle({ label, value, onChange }) {
  return /* @__PURE__ */ React.createElement("div", { className: "twk-row twk-row-h" }, /* @__PURE__ */ React.createElement("div", { className: "twk-lbl" }, /* @__PURE__ */ React.createElement("span", null, label)), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "twk-toggle",
      "data-on": value ? "1" : "0",
      role: "switch",
      "aria-checked": !!value,
      onClick: () => onChange(!value)
    },
    /* @__PURE__ */ React.createElement("i", null)
  ));
}
function TweakRadio({ label, value, options, onChange }) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const opts = options.map((o) => typeof o === "object" ? o : { value: o, label: o });
  const idx = Math.max(0, opts.findIndex((o) => o.value === value));
  const n = opts.length;
  const valueRef = React.useRef(value);
  valueRef.current = value;
  const segAt = (clientX) => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = (e) => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = (ev) => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return /* @__PURE__ */ React.createElement(TweakRow, { label }, /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: trackRef,
      role: "radiogroup",
      onPointerDown,
      className: dragging ? "twk-seg dragging" : "twk-seg"
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "twk-seg-thumb",
        style: {
          left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
          width: `calc((100% - 4px) / ${n})`
        }
      }
    ),
    opts.map((o) => /* @__PURE__ */ React.createElement("button", { key: o.value, type: "button", role: "radio", "aria-checked": o.value === value }, o.label))
  ));
}
function TweakSelect({ label, value, options, onChange }) {
  return /* @__PURE__ */ React.createElement(TweakRow, { label }, /* @__PURE__ */ React.createElement("select", { className: "twk-field", value, onChange: (e) => onChange(e.target.value) }, options.map((o) => {
    const v = typeof o === "object" ? o.value : o;
    const l = typeof o === "object" ? o.label : o;
    return /* @__PURE__ */ React.createElement("option", { key: v, value: v }, l);
  })));
}
function TweakText({ label, value, placeholder, onChange }) {
  return /* @__PURE__ */ React.createElement(TweakRow, { label }, /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "twk-field",
      type: "text",
      value,
      placeholder,
      onChange: (e) => onChange(e.target.value)
    }
  ));
}
function TweakNumber({ label, value, min, max, step = 1, unit = "", onChange }) {
  const clamp = (n) => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({ x: 0, val: 0 });
  const onScrubStart = (e) => {
    e.preventDefault();
    startRef.current = { x: e.clientX, val: value };
    const decimals = (String(step).split(".")[1] || "").length;
    const move = (ev) => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "twk-num" }, /* @__PURE__ */ React.createElement("span", { className: "twk-num-lbl", onPointerDown: onScrubStart }, label), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      value,
      min,
      max,
      step,
      onChange: (e) => onChange(clamp(Number(e.target.value)))
    }
  ), unit && /* @__PURE__ */ React.createElement("span", { className: "twk-num-unit" }, unit));
}
function TweakColor({ label, value, onChange }) {
  return /* @__PURE__ */ React.createElement("div", { className: "twk-row twk-row-h" }, /* @__PURE__ */ React.createElement("div", { className: "twk-lbl" }, /* @__PURE__ */ React.createElement("span", null, label)), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "color",
      className: "twk-swatch",
      value,
      onChange: (e) => onChange(e.target.value)
    }
  ));
}
function TweakButton({ label, onClick, secondary = false }) {
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: secondary ? "twk-btn secondary" : "twk-btn",
      onClick
    },
    label
  );
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHdlYWtzLXBhbmVsLmpzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiXG4vLyB0d2Vha3MtcGFuZWwuanN4XG4vLyBSZXVzYWJsZSBUd2Vha3Mgc2hlbGwgKyBmb3JtLWNvbnRyb2wgaGVscGVycy5cbi8vXG4vLyBPd25zIHRoZSBob3N0IHByb3RvY29sIChsaXN0ZW5zIGZvciBfX2FjdGl2YXRlX2VkaXRfbW9kZSAvIF9fZGVhY3RpdmF0ZV9lZGl0X21vZGUsXG4vLyBwb3N0cyBfX2VkaXRfbW9kZV9hdmFpbGFibGUgLyBfX2VkaXRfbW9kZV9zZXRfa2V5cyAvIF9fZWRpdF9tb2RlX2Rpc21pc3NlZCkgc29cbi8vIGluZGl2aWR1YWwgcHJvdG90eXBlcyBkb24ndCByZS1yb2xsIGl0LiBTaGlwcyBhIGNvbnNpc3RlbnQgc2V0IG9mIGNvbnRyb2xzIHNvIHlvdVxuLy8gZG9uJ3QgaGFuZC1kcmF3IDxpbnB1dCB0eXBlPVwicmFuZ2VcIj4sIHNlZ21lbnRlZCByYWRpb3MsIHN0ZXBwZXJzLCBldGMuXG4vL1xuLy8gVXNhZ2UgKGluIGFuIEhUTUwgZmlsZSB0aGF0IGxvYWRzIFJlYWN0ICsgQmFiZWwpOlxuLy9cbi8vICAgY29uc3QgVFdFQUtfREVGQVVMVFMgPSAvKkVESVRNT0RFLUJFR0lOKi97XG4vLyAgICAgXCJwcmltYXJ5Q29sb3JcIjogXCIjRDk3NzU3XCIsXG4vLyAgICAgXCJmb250U2l6ZVwiOiAxNixcbi8vICAgICBcImRlbnNpdHlcIjogXCJyZWd1bGFyXCIsXG4vLyAgICAgXCJkYXJrXCI6IGZhbHNlXG4vLyAgIH0vKkVESVRNT0RFLUVORCovO1xuLy9cbi8vICAgZnVuY3Rpb24gQXBwKCkge1xuLy8gICAgIGNvbnN0IFt0LCBzZXRUd2Vha10gPSB1c2VUd2Vha3MoVFdFQUtfREVGQVVMVFMpO1xuLy8gICAgIHJldHVybiAoXG4vLyAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRTaXplOiB0LmZvbnRTaXplLCBjb2xvcjogdC5wcmltYXJ5Q29sb3IgfX0+XG4vLyAgICAgICAgIEhlbGxvXG4vLyAgICAgICAgIDxUd2Vha3NQYW5lbD5cbi8vICAgICAgICAgICA8VHdlYWtTZWN0aW9uIGxhYmVsPVwiVHlwb2dyYXBoeVwiIC8+XG4vLyAgICAgICAgICAgPFR3ZWFrU2xpZGVyIGxhYmVsPVwiRm9udCBzaXplXCIgdmFsdWU9e3QuZm9udFNpemV9IG1pbj17MTB9IG1heD17MzJ9IHVuaXQ9XCJweFwiXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodikgPT4gc2V0VHdlYWsoJ2ZvbnRTaXplJywgdil9IC8+XG4vLyAgICAgICAgICAgPFR3ZWFrUmFkaW8gIGxhYmVsPVwiRGVuc2l0eVwiIHZhbHVlPXt0LmRlbnNpdHl9XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM9e1snY29tcGFjdCcsICdyZWd1bGFyJywgJ2NvbWZ5J119XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodikgPT4gc2V0VHdlYWsoJ2RlbnNpdHknLCB2KX0gLz5cbi8vICAgICAgICAgICA8VHdlYWtTZWN0aW9uIGxhYmVsPVwiVGhlbWVcIiAvPlxuLy8gICAgICAgICAgIDxUd2Vha0NvbG9yICBsYWJlbD1cIlByaW1hcnlcIiB2YWx1ZT17dC5wcmltYXJ5Q29sb3J9XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodikgPT4gc2V0VHdlYWsoJ3ByaW1hcnlDb2xvcicsIHYpfSAvPlxuLy8gICAgICAgICAgIDxUd2Vha1RvZ2dsZSBsYWJlbD1cIkRhcmsgbW9kZVwiIHZhbHVlPXt0LmRhcmt9XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodikgPT4gc2V0VHdlYWsoJ2RhcmsnLCB2KX0gLz5cbi8vICAgICAgICAgPC9Ud2Vha3NQYW5lbD5cbi8vICAgICAgIDwvZGl2PlxuLy8gICAgICk7XG4vLyAgIH1cbi8vXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgX19UV0VBS1NfU1RZTEUgPSBgXG4gIC50d2stcGFuZWx7cG9zaXRpb246Zml4ZWQ7cmlnaHQ6MTZweDtib3R0b206MTZweDt6LWluZGV4OjIxNDc0ODM2NDY7d2lkdGg6MjgwcHg7XG4gICAgbWF4LWhlaWdodDpjYWxjKDEwMHZoIC0gMzJweCk7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtcbiAgICBiYWNrZ3JvdW5kOnJnYmEoMjUwLDI0OSwyNDcsLjc4KTtjb2xvcjojMjkyNjFiO1xuICAgIC13ZWJraXQtYmFja2Ryb3AtZmlsdGVyOmJsdXIoMjRweCkgc2F0dXJhdGUoMTYwJSk7YmFja2Ryb3AtZmlsdGVyOmJsdXIoMjRweCkgc2F0dXJhdGUoMTYwJSk7XG4gICAgYm9yZGVyOi41cHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwuNik7Ym9yZGVyLXJhZGl1czoxNHB4O1xuICAgIGJveC1zaGFkb3c6MCAxcHggMCByZ2JhKDI1NSwyNTUsMjU1LC41KSBpbnNldCwwIDEycHggNDBweCByZ2JhKDAsMCwwLC4xOCk7XG4gICAgZm9udDoxMS41cHgvMS40IHVpLXNhbnMtc2VyaWYsc3lzdGVtLXVpLC1hcHBsZS1zeXN0ZW0sc2Fucy1zZXJpZjtvdmVyZmxvdzpoaWRkZW59XG4gIC50d2staGR7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjtcbiAgICBwYWRkaW5nOjEwcHggOHB4IDEwcHggMTRweDtjdXJzb3I6bW92ZTt1c2VyLXNlbGVjdDpub25lfVxuICAudHdrLWhkIGJ7Zm9udC1zaXplOjEycHg7Zm9udC13ZWlnaHQ6NjAwO2xldHRlci1zcGFjaW5nOi4wMWVtfVxuICAudHdrLXh7YXBwZWFyYW5jZTpub25lO2JvcmRlcjowO2JhY2tncm91bmQ6dHJhbnNwYXJlbnQ7Y29sb3I6cmdiYSg0MSwzOCwyNywuNTUpO1xuICAgIHdpZHRoOjIycHg7aGVpZ2h0OjIycHg7Ym9yZGVyLXJhZGl1czo2cHg7Y3Vyc29yOmRlZmF1bHQ7Zm9udC1zaXplOjEzcHg7bGluZS1oZWlnaHQ6MX1cbiAgLnR3ay14OmhvdmVye2JhY2tncm91bmQ6cmdiYSgwLDAsMCwuMDYpO2NvbG9yOiMyOTI2MWJ9XG4gIC50d2stYm9keXtwYWRkaW5nOjJweCAxNHB4IDE0cHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MTBweDtcbiAgICBvdmVyZmxvdy15OmF1dG87b3ZlcmZsb3cteDpoaWRkZW47bWluLWhlaWdodDowO1xuICAgIHNjcm9sbGJhci13aWR0aDp0aGluO3Njcm9sbGJhci1jb2xvcjpyZ2JhKDAsMCwwLC4xNSkgdHJhbnNwYXJlbnR9XG4gIC50d2stYm9keTo6LXdlYmtpdC1zY3JvbGxiYXJ7d2lkdGg6OHB4fVxuICAudHdrLWJvZHk6Oi13ZWJraXQtc2Nyb2xsYmFyLXRyYWNre2JhY2tncm91bmQ6dHJhbnNwYXJlbnQ7bWFyZ2luOjJweH1cbiAgLnR3ay1ib2R5Ojotd2Via2l0LXNjcm9sbGJhci10aHVtYntiYWNrZ3JvdW5kOnJnYmEoMCwwLDAsLjE1KTtib3JkZXItcmFkaXVzOjRweDtcbiAgICBib3JkZXI6MnB4IHNvbGlkIHRyYW5zcGFyZW50O2JhY2tncm91bmQtY2xpcDpjb250ZW50LWJveH1cbiAgLnR3ay1ib2R5Ojotd2Via2l0LXNjcm9sbGJhci10aHVtYjpob3ZlcntiYWNrZ3JvdW5kOnJnYmEoMCwwLDAsLjI1KTtcbiAgICBib3JkZXI6MnB4IHNvbGlkIHRyYW5zcGFyZW50O2JhY2tncm91bmQtY2xpcDpjb250ZW50LWJveH1cbiAgLnR3ay1yb3d7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6NXB4fVxuICAudHdrLXJvdy1oe2ZsZXgtZGlyZWN0aW9uOnJvdzthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47Z2FwOjEwcHh9XG4gIC50d2stbGJse2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpiYXNlbGluZTtcbiAgICBjb2xvcjpyZ2JhKDQxLDM4LDI3LC43Mil9XG4gIC50d2stbGJsPnNwYW46Zmlyc3QtY2hpbGR7Zm9udC13ZWlnaHQ6NTAwfVxuICAudHdrLXZhbHtjb2xvcjpyZ2JhKDQxLDM4LDI3LC41KTtmb250LXZhcmlhbnQtbnVtZXJpYzp0YWJ1bGFyLW51bXN9XG5cbiAgLnR3ay1zZWN0e2ZvbnQtc2l6ZToxMHB4O2ZvbnQtd2VpZ2h0OjYwMDtsZXR0ZXItc3BhY2luZzouMDZlbTt0ZXh0LXRyYW5zZm9ybTp1cHBlcmNhc2U7XG4gICAgY29sb3I6cmdiYSg0MSwzOCwyNywuNDUpO3BhZGRpbmc6MTBweCAwIDB9XG4gIC50d2stc2VjdDpmaXJzdC1jaGlsZHtwYWRkaW5nLXRvcDowfVxuXG4gIC50d2stZmllbGR7YXBwZWFyYW5jZTpub25lO3dpZHRoOjEwMCU7aGVpZ2h0OjI2cHg7cGFkZGluZzowIDhweDtcbiAgICBib3JkZXI6LjVweCBzb2xpZCByZ2JhKDAsMCwwLC4xKTtib3JkZXItcmFkaXVzOjdweDtcbiAgICBiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjYpO2NvbG9yOmluaGVyaXQ7Zm9udDppbmhlcml0O291dGxpbmU6bm9uZX1cbiAgLnR3ay1maWVsZDpmb2N1c3tib3JkZXItY29sb3I6cmdiYSgwLDAsMCwuMjUpO2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuODUpfVxuICBzZWxlY3QudHdrLWZpZWxke3BhZGRpbmctcmlnaHQ6MjJweDtcbiAgICBiYWNrZ3JvdW5kLWltYWdlOnVybChcImRhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LDxzdmcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB3aWR0aD0nMTAnIGhlaWdodD0nNicgdmlld0JveD0nMCAwIDEwIDYnPjxwYXRoIGZpbGw9J3JnYmEoMCwwLDAsLjUpJyBkPSdNMCAwaDEwTDUgNnonLz48L3N2Zz5cIik7XG4gICAgYmFja2dyb3VuZC1yZXBlYXQ6bm8tcmVwZWF0O2JhY2tncm91bmQtcG9zaXRpb246cmlnaHQgOHB4IGNlbnRlcn1cblxuICAudHdrLXNsaWRlcnthcHBlYXJhbmNlOm5vbmU7LXdlYmtpdC1hcHBlYXJhbmNlOm5vbmU7d2lkdGg6MTAwJTtoZWlnaHQ6NHB4O21hcmdpbjo2cHggMDtcbiAgICBib3JkZXItcmFkaXVzOjk5OXB4O2JhY2tncm91bmQ6cmdiYSgwLDAsMCwuMTIpO291dGxpbmU6bm9uZX1cbiAgLnR3ay1zbGlkZXI6Oi13ZWJraXQtc2xpZGVyLXRodW1iey13ZWJraXQtYXBwZWFyYW5jZTpub25lO2FwcGVhcmFuY2U6bm9uZTtcbiAgICB3aWR0aDoxNHB4O2hlaWdodDoxNHB4O2JvcmRlci1yYWRpdXM6NTAlO2JhY2tncm91bmQ6I2ZmZjtcbiAgICBib3JkZXI6LjVweCBzb2xpZCByZ2JhKDAsMCwwLC4xMik7Ym94LXNoYWRvdzowIDFweCAzcHggcmdiYSgwLDAsMCwuMik7Y3Vyc29yOmRlZmF1bHR9XG4gIC50d2stc2xpZGVyOjotbW96LXJhbmdlLXRodW1ie3dpZHRoOjE0cHg7aGVpZ2h0OjE0cHg7Ym9yZGVyLXJhZGl1czo1MCU7XG4gICAgYmFja2dyb3VuZDojZmZmO2JvcmRlcjouNXB4IHNvbGlkIHJnYmEoMCwwLDAsLjEyKTtib3gtc2hhZG93OjAgMXB4IDNweCByZ2JhKDAsMCwwLC4yKTtjdXJzb3I6ZGVmYXVsdH1cblxuICAudHdrLXNlZ3twb3NpdGlvbjpyZWxhdGl2ZTtkaXNwbGF5OmZsZXg7cGFkZGluZzoycHg7Ym9yZGVyLXJhZGl1czo4cHg7XG4gICAgYmFja2dyb3VuZDpyZ2JhKDAsMCwwLC4wNik7dXNlci1zZWxlY3Q6bm9uZX1cbiAgLnR3ay1zZWctdGh1bWJ7cG9zaXRpb246YWJzb2x1dGU7dG9wOjJweDtib3R0b206MnB4O2JvcmRlci1yYWRpdXM6NnB4O1xuICAgIGJhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuOSk7Ym94LXNoYWRvdzowIDFweCAycHggcmdiYSgwLDAsMCwuMTIpO1xuICAgIHRyYW5zaXRpb246bGVmdCAuMTVzIGN1YmljLWJlemllciguMywuNywuNCwxKSx3aWR0aCAuMTVzfVxuICAudHdrLXNlZy5kcmFnZ2luZyAudHdrLXNlZy10aHVtYnt0cmFuc2l0aW9uOm5vbmV9XG4gIC50d2stc2VnIGJ1dHRvbnthcHBlYXJhbmNlOm5vbmU7cG9zaXRpb246cmVsYXRpdmU7ei1pbmRleDoxO2ZsZXg6MTtib3JkZXI6MDtcbiAgICBiYWNrZ3JvdW5kOnRyYW5zcGFyZW50O2NvbG9yOmluaGVyaXQ7Zm9udDppbmhlcml0O2ZvbnQtd2VpZ2h0OjUwMDtoZWlnaHQ6MjJweDtcbiAgICBib3JkZXItcmFkaXVzOjZweDtjdXJzb3I6ZGVmYXVsdDtwYWRkaW5nOjB9XG5cbiAgLnR3ay10b2dnbGV7cG9zaXRpb246cmVsYXRpdmU7d2lkdGg6MzJweDtoZWlnaHQ6MThweDtib3JkZXI6MDtib3JkZXItcmFkaXVzOjk5OXB4O1xuICAgIGJhY2tncm91bmQ6cmdiYSgwLDAsMCwuMTUpO3RyYW5zaXRpb246YmFja2dyb3VuZCAuMTVzO2N1cnNvcjpkZWZhdWx0O3BhZGRpbmc6MH1cbiAgLnR3ay10b2dnbGVbZGF0YS1vbj1cIjFcIl17YmFja2dyb3VuZDojMzRjNzU5fVxuICAudHdrLXRvZ2dsZSBpe3Bvc2l0aW9uOmFic29sdXRlO3RvcDoycHg7bGVmdDoycHg7d2lkdGg6MTRweDtoZWlnaHQ6MTRweDtib3JkZXItcmFkaXVzOjUwJTtcbiAgICBiYWNrZ3JvdW5kOiNmZmY7Ym94LXNoYWRvdzowIDFweCAycHggcmdiYSgwLDAsMCwuMjUpO3RyYW5zaXRpb246dHJhbnNmb3JtIC4xNXN9XG4gIC50d2stdG9nZ2xlW2RhdGEtb249XCIxXCJdIGl7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoMTRweCl9XG5cbiAgLnR3ay1udW17ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtoZWlnaHQ6MjZweDtwYWRkaW5nOjAgMCAwIDhweDtcbiAgICBib3JkZXI6LjVweCBzb2xpZCByZ2JhKDAsMCwwLC4xKTtib3JkZXItcmFkaXVzOjdweDtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjYpfVxuICAudHdrLW51bS1sYmx7Zm9udC13ZWlnaHQ6NTAwO2NvbG9yOnJnYmEoNDEsMzgsMjcsLjYpO2N1cnNvcjpldy1yZXNpemU7XG4gICAgdXNlci1zZWxlY3Q6bm9uZTtwYWRkaW5nLXJpZ2h0OjhweH1cbiAgLnR3ay1udW0gaW5wdXR7ZmxleDoxO21pbi13aWR0aDowO2hlaWdodDoxMDAlO2JvcmRlcjowO2JhY2tncm91bmQ6dHJhbnNwYXJlbnQ7XG4gICAgZm9udDppbmhlcml0O2ZvbnQtdmFyaWFudC1udW1lcmljOnRhYnVsYXItbnVtczt0ZXh0LWFsaWduOnJpZ2h0O3BhZGRpbmc6MCA4cHggMCAwO1xuICAgIG91dGxpbmU6bm9uZTtjb2xvcjppbmhlcml0Oy1tb3otYXBwZWFyYW5jZTp0ZXh0ZmllbGR9XG4gIC50d2stbnVtIGlucHV0Ojotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLC50d2stbnVtIGlucHV0Ojotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9ue1xuICAgIC13ZWJraXQtYXBwZWFyYW5jZTpub25lO21hcmdpbjowfVxuICAudHdrLW51bS11bml0e3BhZGRpbmctcmlnaHQ6OHB4O2NvbG9yOnJnYmEoNDEsMzgsMjcsLjQ1KX1cblxuICAudHdrLWJ0bnthcHBlYXJhbmNlOm5vbmU7aGVpZ2h0OjI2cHg7cGFkZGluZzowIDEycHg7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czo3cHg7XG4gICAgYmFja2dyb3VuZDpyZ2JhKDAsMCwwLC43OCk7Y29sb3I6I2ZmZjtmb250OmluaGVyaXQ7Zm9udC13ZWlnaHQ6NTAwO2N1cnNvcjpkZWZhdWx0fVxuICAudHdrLWJ0bjpob3ZlcntiYWNrZ3JvdW5kOnJnYmEoMCwwLDAsLjg4KX1cbiAgLnR3ay1idG4uc2Vjb25kYXJ5e2JhY2tncm91bmQ6cmdiYSgwLDAsMCwuMDYpO2NvbG9yOmluaGVyaXR9XG4gIC50d2stYnRuLnNlY29uZGFyeTpob3ZlcntiYWNrZ3JvdW5kOnJnYmEoMCwwLDAsLjEpfVxuXG4gIC50d2stc3dhdGNoe2FwcGVhcmFuY2U6bm9uZTstd2Via2l0LWFwcGVhcmFuY2U6bm9uZTt3aWR0aDo1NnB4O2hlaWdodDoyMnB4O1xuICAgIGJvcmRlcjouNXB4IHNvbGlkIHJnYmEoMCwwLDAsLjEpO2JvcmRlci1yYWRpdXM6NnB4O3BhZGRpbmc6MDtjdXJzb3I6ZGVmYXVsdDtcbiAgICBiYWNrZ3JvdW5kOnRyYW5zcGFyZW50O2ZsZXgtc2hyaW5rOjB9XG4gIC50d2stc3dhdGNoOjotd2Via2l0LWNvbG9yLXN3YXRjaC13cmFwcGVye3BhZGRpbmc6MH1cbiAgLnR3ay1zd2F0Y2g6Oi13ZWJraXQtY29sb3Itc3dhdGNoe2JvcmRlcjowO2JvcmRlci1yYWRpdXM6NS41cHh9XG4gIC50d2stc3dhdGNoOjotbW96LWNvbG9yLXN3YXRjaHtib3JkZXI6MDtib3JkZXItcmFkaXVzOjUuNXB4fVxuYDtcblxuLy8gXHUyNTAwXHUyNTAwIHVzZVR3ZWFrcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIFNpbmdsZSBzb3VyY2Ugb2YgdHJ1dGggZm9yIHR3ZWFrIHZhbHVlcy4gc2V0VHdlYWsgcGVyc2lzdHMgdmlhIHRoZSBob3N0XG4vLyAoX19lZGl0X21vZGVfc2V0X2tleXMgXHUyMTkyIGhvc3QgcmV3cml0ZXMgdGhlIEVESVRNT0RFIGJsb2NrIG9uIGRpc2spLlxuZnVuY3Rpb24gdXNlVHdlYWtzKGRlZmF1bHRzKSB7XG4gIGNvbnN0IFt2YWx1ZXMsIHNldFZhbHVlc10gPSBSZWFjdC51c2VTdGF0ZShkZWZhdWx0cyk7XG4gIGNvbnN0IHNldFR3ZWFrID0gUmVhY3QudXNlQ2FsbGJhY2soKGtleSwgdmFsKSA9PiB7XG4gICAgc2V0VmFsdWVzKChwcmV2KSA9PiAoeyAuLi5wcmV2LCBba2V5XTogdmFsIH0pKTtcbiAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKHsgdHlwZTogJ19fZWRpdF9tb2RlX3NldF9rZXlzJywgZWRpdHM6IHsgW2tleV06IHZhbCB9IH0sICcqJyk7XG4gIH0sIFtdKTtcbiAgcmV0dXJuIFt2YWx1ZXMsIHNldFR3ZWFrXTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFR3ZWFrc1BhbmVsIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gRmxvYXRpbmcgc2hlbGwuIFJlZ2lzdGVycyB0aGUgcHJvdG9jb2wgbGlzdGVuZXIgQkVGT1JFIGFubm91bmNpbmdcbi8vIGF2YWlsYWJpbGl0eSBcdTIwMTQgaWYgdGhlIGFubm91bmNlIHJhbiBmaXJzdCwgdGhlIGhvc3QncyBhY3RpdmF0ZSBjb3VsZCBsYW5kXG4vLyBiZWZvcmUgb3VyIGhhbmRsZXIgZXhpc3RzIGFuZCB0aGUgdG9vbGJhciB0b2dnbGUgd291bGQgc2lsZW50bHkgbm8tb3AuXG4vLyBUaGUgY2xvc2UgYnV0dG9uIHBvc3RzIF9fZWRpdF9tb2RlX2Rpc21pc3NlZCBzbyB0aGUgaG9zdCdzIHRvb2xiYXIgdG9nZ2xlXG4vLyBmbGlwcyBvZmYgaW4gbG9ja3N0ZXA7IHRoZSBob3N0IGVjaG9lcyBfX2RlYWN0aXZhdGVfZWRpdF9tb2RlIGJhY2sgd2hpY2hcbi8vIGlzIHdoYXQgYWN0dWFsbHkgaGlkZXMgdGhlIHBhbmVsLlxuZnVuY3Rpb24gVHdlYWtzUGFuZWwoeyB0aXRsZSA9ICdUd2Vha3MnLCBjaGlsZHJlbiB9KSB7XG4gIGNvbnN0IFtvcGVuLCBzZXRPcGVuXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgZHJhZ1JlZiA9IFJlYWN0LnVzZVJlZihudWxsKTtcbiAgY29uc3Qgb2Zmc2V0UmVmID0gUmVhY3QudXNlUmVmKHsgeDogMTYsIHk6IDE2IH0pO1xuICBjb25zdCBQQUQgPSAxNjtcblxuICBjb25zdCBjbGFtcFRvVmlld3BvcnQgPSBSZWFjdC51c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgY29uc3QgcGFuZWwgPSBkcmFnUmVmLmN1cnJlbnQ7XG4gICAgaWYgKCFwYW5lbCkgcmV0dXJuO1xuICAgIGNvbnN0IHcgPSBwYW5lbC5vZmZzZXRXaWR0aCwgaCA9IHBhbmVsLm9mZnNldEhlaWdodDtcbiAgICBjb25zdCBtYXhSaWdodCA9IE1hdGgubWF4KFBBRCwgd2luZG93LmlubmVyV2lkdGggLSB3IC0gUEFEKTtcbiAgICBjb25zdCBtYXhCb3R0b20gPSBNYXRoLm1heChQQUQsIHdpbmRvdy5pbm5lckhlaWdodCAtIGggLSBQQUQpO1xuICAgIG9mZnNldFJlZi5jdXJyZW50ID0ge1xuICAgICAgeDogTWF0aC5taW4obWF4UmlnaHQsIE1hdGgubWF4KFBBRCwgb2Zmc2V0UmVmLmN1cnJlbnQueCkpLFxuICAgICAgeTogTWF0aC5taW4obWF4Qm90dG9tLCBNYXRoLm1heChQQUQsIG9mZnNldFJlZi5jdXJyZW50LnkpKSxcbiAgICB9O1xuICAgIHBhbmVsLnN0eWxlLnJpZ2h0ID0gb2Zmc2V0UmVmLmN1cnJlbnQueCArICdweCc7XG4gICAgcGFuZWwuc3R5bGUuYm90dG9tID0gb2Zmc2V0UmVmLmN1cnJlbnQueSArICdweCc7XG4gIH0sIFtdKTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghb3BlbikgcmV0dXJuO1xuICAgIGNsYW1wVG9WaWV3cG9ydCgpO1xuICAgIGlmICh0eXBlb2YgUmVzaXplT2JzZXJ2ZXIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgY2xhbXBUb1ZpZXdwb3J0KTtcbiAgICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgY2xhbXBUb1ZpZXdwb3J0KTtcbiAgICB9XG4gICAgY29uc3Qgcm8gPSBuZXcgUmVzaXplT2JzZXJ2ZXIoY2xhbXBUb1ZpZXdwb3J0KTtcbiAgICByby5vYnNlcnZlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCk7XG4gICAgcmV0dXJuICgpID0+IHJvLmRpc2Nvbm5lY3QoKTtcbiAgfSwgW29wZW4sIGNsYW1wVG9WaWV3cG9ydF0pO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25Nc2cgPSAoZSkgPT4ge1xuICAgICAgY29uc3QgdCA9IGU/LmRhdGE/LnR5cGU7XG4gICAgICBpZiAodCA9PT0gJ19fYWN0aXZhdGVfZWRpdF9tb2RlJykgc2V0T3Blbih0cnVlKTtcbiAgICAgIGVsc2UgaWYgKHQgPT09ICdfX2RlYWN0aXZhdGVfZWRpdF9tb2RlJykgc2V0T3BlbihmYWxzZSk7XG4gICAgfTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIG9uTXNnKTtcbiAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKHsgdHlwZTogJ19fZWRpdF9tb2RlX2F2YWlsYWJsZScgfSwgJyonKTtcbiAgICByZXR1cm4gKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBvbk1zZyk7XG4gIH0sIFtdKTtcblxuICBjb25zdCBkaXNtaXNzID0gKCkgPT4ge1xuICAgIHNldE9wZW4oZmFsc2UpO1xuICAgIHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2UoeyB0eXBlOiAnX19lZGl0X21vZGVfZGlzbWlzc2VkJyB9LCAnKicpO1xuICB9O1xuXG4gIGNvbnN0IG9uRHJhZ1N0YXJ0ID0gKGUpID0+IHtcbiAgICBjb25zdCBwYW5lbCA9IGRyYWdSZWYuY3VycmVudDtcbiAgICBpZiAoIXBhbmVsKSByZXR1cm47XG4gICAgY29uc3QgciA9IHBhbmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHN4ID0gZS5jbGllbnRYLCBzeSA9IGUuY2xpZW50WTtcbiAgICBjb25zdCBzdGFydFJpZ2h0ID0gd2luZG93LmlubmVyV2lkdGggLSByLnJpZ2h0O1xuICAgIGNvbnN0IHN0YXJ0Qm90dG9tID0gd2luZG93LmlubmVySGVpZ2h0IC0gci5ib3R0b207XG4gICAgY29uc3QgbW92ZSA9IChldikgPT4ge1xuICAgICAgb2Zmc2V0UmVmLmN1cnJlbnQgPSB7XG4gICAgICAgIHg6IHN0YXJ0UmlnaHQgLSAoZXYuY2xpZW50WCAtIHN4KSxcbiAgICAgICAgeTogc3RhcnRCb3R0b20gLSAoZXYuY2xpZW50WSAtIHN5KSxcbiAgICAgIH07XG4gICAgICBjbGFtcFRvVmlld3BvcnQoKTtcbiAgICB9O1xuICAgIGNvbnN0IHVwID0gKCkgPT4ge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdmUpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB1cCk7XG4gICAgfTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW92ZSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB1cCk7XG4gIH07XG5cbiAgaWYgKCFvcGVuKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPHN0eWxlPntfX1RXRUFLU19TVFlMRX08L3N0eWxlPlxuICAgICAgPGRpdiByZWY9e2RyYWdSZWZ9IGNsYXNzTmFtZT1cInR3ay1wYW5lbFwiXG4gICAgICAgICAgIHN0eWxlPXt7IHJpZ2h0OiBvZmZzZXRSZWYuY3VycmVudC54LCBib3R0b206IG9mZnNldFJlZi5jdXJyZW50LnkgfX0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHdrLWhkXCIgb25Nb3VzZURvd249e29uRHJhZ1N0YXJ0fT5cbiAgICAgICAgICA8Yj57dGl0bGV9PC9iPlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwidHdrLXhcIiBhcmlhLWxhYmVsPVwiQ2xvc2UgdHdlYWtzXCJcbiAgICAgICAgICAgICAgICAgIG9uTW91c2VEb3duPXsoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX1cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2Rpc21pc3N9Plx1MjcxNTwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0d2stYm9keVwiPntjaGlsZHJlbn08L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvPlxuICApO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTGF5b3V0IGhlbHBlcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIFR3ZWFrU2VjdGlvbih7IGxhYmVsLCBjaGlsZHJlbiB9KSB7XG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHdrLXNlY3RcIj57bGFiZWx9PC9kaXY+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC8+XG4gICk7XG59XG5cbmZ1bmN0aW9uIFR3ZWFrUm93KHsgbGFiZWwsIHZhbHVlLCBjaGlsZHJlbiwgaW5saW5lID0gZmFsc2UgfSkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtpbmxpbmUgPyAndHdrLXJvdyB0d2stcm93LWgnIDogJ3R3ay1yb3cnfT5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHdrLWxibFwiPlxuICAgICAgICA8c3Bhbj57bGFiZWx9PC9zcGFuPlxuICAgICAgICB7dmFsdWUgIT0gbnVsbCAmJiA8c3BhbiBjbGFzc05hbWU9XCJ0d2stdmFsXCI+e3ZhbHVlfTwvc3Bhbj59XG4gICAgICA8L2Rpdj5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIENvbnRyb2xzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBUd2Vha1NsaWRlcih7IGxhYmVsLCB2YWx1ZSwgbWluID0gMCwgbWF4ID0gMTAwLCBzdGVwID0gMSwgdW5pdCA9ICcnLCBvbkNoYW5nZSB9KSB7XG4gIHJldHVybiAoXG4gICAgPFR3ZWFrUm93IGxhYmVsPXtsYWJlbH0gdmFsdWU9e2Ake3ZhbHVlfSR7dW5pdH1gfT5cbiAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBjbGFzc05hbWU9XCJ0d2stc2xpZGVyXCIgbWluPXttaW59IG1heD17bWF4fSBzdGVwPXtzdGVwfVxuICAgICAgICAgICAgIHZhbHVlPXt2YWx1ZX0gb25DaGFuZ2U9eyhlKSA9PiBvbkNoYW5nZShOdW1iZXIoZS50YXJnZXQudmFsdWUpKX0gLz5cbiAgICA8L1R3ZWFrUm93PlxuICApO1xufVxuXG5mdW5jdGlvbiBUd2Vha1RvZ2dsZSh7IGxhYmVsLCB2YWx1ZSwgb25DaGFuZ2UgfSkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidHdrLXJvdyB0d2stcm93LWhcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHdrLWxibFwiPjxzcGFuPntsYWJlbH08L3NwYW4+PC9kaXY+XG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJ0d2stdG9nZ2xlXCIgZGF0YS1vbj17dmFsdWUgPyAnMScgOiAnMCd9XG4gICAgICAgICAgICAgIHJvbGU9XCJzd2l0Y2hcIiBhcmlhLWNoZWNrZWQ9eyEhdmFsdWV9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uQ2hhbmdlKCF2YWx1ZSl9PjxpIC8+PC9idXR0b24+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmZ1bmN0aW9uIFR3ZWFrUmFkaW8oeyBsYWJlbCwgdmFsdWUsIG9wdGlvbnMsIG9uQ2hhbmdlIH0pIHtcbiAgY29uc3QgdHJhY2tSZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gIGNvbnN0IFtkcmFnZ2luZywgc2V0RHJhZ2dpbmddID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBvcHRzID0gb3B0aW9ucy5tYXAoKG8pID0+ICh0eXBlb2YgbyA9PT0gJ29iamVjdCcgPyBvIDogeyB2YWx1ZTogbywgbGFiZWw6IG8gfSkpO1xuICBjb25zdCBpZHggPSBNYXRoLm1heCgwLCBvcHRzLmZpbmRJbmRleCgobykgPT4gby52YWx1ZSA9PT0gdmFsdWUpKTtcbiAgY29uc3QgbiA9IG9wdHMubGVuZ3RoO1xuXG4gIC8vIFRoZSBhY3RpdmUgdmFsdWUgaXMgcmVhZCBieSBwb2ludGVyLW1vdmUgaGFuZGxlcnMgYXR0YWNoZWQgZm9yIHRoZSBsaWZldGltZVxuICAvLyBvZiBhIGRyYWcgXHUyMDE0IHJlZiBpdCBzbyBhIHN0YWxlIGNsb3N1cmUgZG9lc24ndCBmaXJlIG9uQ2hhbmdlIGZvciBldmVyeSBtb3ZlLlxuICBjb25zdCB2YWx1ZVJlZiA9IFJlYWN0LnVzZVJlZih2YWx1ZSk7XG4gIHZhbHVlUmVmLmN1cnJlbnQgPSB2YWx1ZTtcblxuICBjb25zdCBzZWdBdCA9IChjbGllbnRYKSA9PiB7XG4gICAgY29uc3QgciA9IHRyYWNrUmVmLmN1cnJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgaW5uZXIgPSByLndpZHRoIC0gNDtcbiAgICBjb25zdCBpID0gTWF0aC5mbG9vcigoKGNsaWVudFggLSByLmxlZnQgLSAyKSAvIGlubmVyKSAqIG4pO1xuICAgIHJldHVybiBvcHRzW01hdGgubWF4KDAsIE1hdGgubWluKG4gLSAxLCBpKSldLnZhbHVlO1xuICB9O1xuXG4gIGNvbnN0IG9uUG9pbnRlckRvd24gPSAoZSkgPT4ge1xuICAgIHNldERyYWdnaW5nKHRydWUpO1xuICAgIGNvbnN0IHYwID0gc2VnQXQoZS5jbGllbnRYKTtcbiAgICBpZiAodjAgIT09IHZhbHVlUmVmLmN1cnJlbnQpIG9uQ2hhbmdlKHYwKTtcbiAgICBjb25zdCBtb3ZlID0gKGV2KSA9PiB7XG4gICAgICBpZiAoIXRyYWNrUmVmLmN1cnJlbnQpIHJldHVybjtcbiAgICAgIGNvbnN0IHYgPSBzZWdBdChldi5jbGllbnRYKTtcbiAgICAgIGlmICh2ICE9PSB2YWx1ZVJlZi5jdXJyZW50KSBvbkNoYW5nZSh2KTtcbiAgICB9O1xuICAgIGNvbnN0IHVwID0gKCkgPT4ge1xuICAgICAgc2V0RHJhZ2dpbmcoZmFsc2UpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgbW92ZSk7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgdXApO1xuICAgIH07XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgbW92ZSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHVwKTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxUd2Vha1JvdyBsYWJlbD17bGFiZWx9PlxuICAgICAgPGRpdiByZWY9e3RyYWNrUmVmfSByb2xlPVwicmFkaW9ncm91cFwiIG9uUG9pbnRlckRvd249e29uUG9pbnRlckRvd259XG4gICAgICAgICAgIGNsYXNzTmFtZT17ZHJhZ2dpbmcgPyAndHdrLXNlZyBkcmFnZ2luZycgOiAndHdrLXNlZyd9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInR3ay1zZWctdGh1bWJcIlxuICAgICAgICAgICAgIHN0eWxlPXt7IGxlZnQ6IGBjYWxjKDJweCArICR7aWR4fSAqICgxMDAlIC0gNHB4KSAvICR7bn0pYCxcbiAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogYGNhbGMoKDEwMCUgLSA0cHgpIC8gJHtufSlgIH19IC8+XG4gICAgICAgIHtvcHRzLm1hcCgobykgPT4gKFxuICAgICAgICAgIDxidXR0b24ga2V5PXtvLnZhbHVlfSB0eXBlPVwiYnV0dG9uXCIgcm9sZT1cInJhZGlvXCIgYXJpYS1jaGVja2VkPXtvLnZhbHVlID09PSB2YWx1ZX0+XG4gICAgICAgICAgICB7by5sYWJlbH1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgKSl9XG4gICAgICA8L2Rpdj5cbiAgICA8L1R3ZWFrUm93PlxuICApO1xufVxuXG5mdW5jdGlvbiBUd2Vha1NlbGVjdCh7IGxhYmVsLCB2YWx1ZSwgb3B0aW9ucywgb25DaGFuZ2UgfSkge1xuICByZXR1cm4gKFxuICAgIDxUd2Vha1JvdyBsYWJlbD17bGFiZWx9PlxuICAgICAgPHNlbGVjdCBjbGFzc05hbWU9XCJ0d2stZmllbGRcIiB2YWx1ZT17dmFsdWV9IG9uQ2hhbmdlPXsoZSkgPT4gb25DaGFuZ2UoZS50YXJnZXQudmFsdWUpfT5cbiAgICAgICAge29wdGlvbnMubWFwKChvKSA9PiB7XG4gICAgICAgICAgY29uc3QgdiA9IHR5cGVvZiBvID09PSAnb2JqZWN0JyA/IG8udmFsdWUgOiBvO1xuICAgICAgICAgIGNvbnN0IGwgPSB0eXBlb2YgbyA9PT0gJ29iamVjdCcgPyBvLmxhYmVsIDogbztcbiAgICAgICAgICByZXR1cm4gPG9wdGlvbiBrZXk9e3Z9IHZhbHVlPXt2fT57bH08L29wdGlvbj47XG4gICAgICAgIH0pfVxuICAgICAgPC9zZWxlY3Q+XG4gICAgPC9Ud2Vha1Jvdz5cbiAgKTtcbn1cblxuZnVuY3Rpb24gVHdlYWtUZXh0KHsgbGFiZWwsIHZhbHVlLCBwbGFjZWhvbGRlciwgb25DaGFuZ2UgfSkge1xuICByZXR1cm4gKFxuICAgIDxUd2Vha1JvdyBsYWJlbD17bGFiZWx9PlxuICAgICAgPGlucHV0IGNsYXNzTmFtZT1cInR3ay1maWVsZFwiIHR5cGU9XCJ0ZXh0XCIgdmFsdWU9e3ZhbHVlfSBwbGFjZWhvbGRlcj17cGxhY2Vob2xkZXJ9XG4gICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBvbkNoYW5nZShlLnRhcmdldC52YWx1ZSl9IC8+XG4gICAgPC9Ud2Vha1Jvdz5cbiAgKTtcbn1cblxuZnVuY3Rpb24gVHdlYWtOdW1iZXIoeyBsYWJlbCwgdmFsdWUsIG1pbiwgbWF4LCBzdGVwID0gMSwgdW5pdCA9ICcnLCBvbkNoYW5nZSB9KSB7XG4gIGNvbnN0IGNsYW1wID0gKG4pID0+IHtcbiAgICBpZiAobWluICE9IG51bGwgJiYgbiA8IG1pbikgcmV0dXJuIG1pbjtcbiAgICBpZiAobWF4ICE9IG51bGwgJiYgbiA+IG1heCkgcmV0dXJuIG1heDtcbiAgICByZXR1cm4gbjtcbiAgfTtcbiAgY29uc3Qgc3RhcnRSZWYgPSBSZWFjdC51c2VSZWYoeyB4OiAwLCB2YWw6IDAgfSk7XG4gIGNvbnN0IG9uU2NydWJTdGFydCA9IChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHN0YXJ0UmVmLmN1cnJlbnQgPSB7IHg6IGUuY2xpZW50WCwgdmFsOiB2YWx1ZSB9O1xuICAgIGNvbnN0IGRlY2ltYWxzID0gKFN0cmluZyhzdGVwKS5zcGxpdCgnLicpWzFdIHx8ICcnKS5sZW5ndGg7XG4gICAgY29uc3QgbW92ZSA9IChldikgPT4ge1xuICAgICAgY29uc3QgZHggPSBldi5jbGllbnRYIC0gc3RhcnRSZWYuY3VycmVudC54O1xuICAgICAgY29uc3QgcmF3ID0gc3RhcnRSZWYuY3VycmVudC52YWwgKyBkeCAqIHN0ZXA7XG4gICAgICBjb25zdCBzbmFwcGVkID0gTWF0aC5yb3VuZChyYXcgLyBzdGVwKSAqIHN0ZXA7XG4gICAgICBvbkNoYW5nZShjbGFtcChOdW1iZXIoc25hcHBlZC50b0ZpeGVkKGRlY2ltYWxzKSkpKTtcbiAgICB9O1xuICAgIGNvbnN0IHVwID0gKCkgPT4ge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgbW92ZSk7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgdXApO1xuICAgIH07XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgbW92ZSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHVwKTtcbiAgfTtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInR3ay1udW1cIj5cbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInR3ay1udW0tbGJsXCIgb25Qb2ludGVyRG93bj17b25TY3J1YlN0YXJ0fT57bGFiZWx9PC9zcGFuPlxuICAgICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIiB2YWx1ZT17dmFsdWV9IG1pbj17bWlufSBtYXg9e21heH0gc3RlcD17c3RlcH1cbiAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IG9uQ2hhbmdlKGNsYW1wKE51bWJlcihlLnRhcmdldC52YWx1ZSkpKX0gLz5cbiAgICAgIHt1bml0ICYmIDxzcGFuIGNsYXNzTmFtZT1cInR3ay1udW0tdW5pdFwiPnt1bml0fTwvc3Bhbj59XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmZ1bmN0aW9uIFR3ZWFrQ29sb3IoeyBsYWJlbCwgdmFsdWUsIG9uQ2hhbmdlIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInR3ay1yb3cgdHdrLXJvdy1oXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInR3ay1sYmxcIj48c3Bhbj57bGFiZWx9PC9zcGFuPjwvZGl2PlxuICAgICAgPGlucHV0IHR5cGU9XCJjb2xvclwiIGNsYXNzTmFtZT1cInR3ay1zd2F0Y2hcIiB2YWx1ZT17dmFsdWV9XG4gICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBvbkNoYW5nZShlLnRhcmdldC52YWx1ZSl9IC8+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmZ1bmN0aW9uIFR3ZWFrQnV0dG9uKHsgbGFiZWwsIG9uQ2xpY2ssIHNlY29uZGFyeSA9IGZhbHNlIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9e3NlY29uZGFyeSA/ICd0d2stYnRuIHNlY29uZGFyeScgOiAndHdrLWJ0bid9XG4gICAgICAgICAgICBvbkNsaWNrPXtvbkNsaWNrfT57bGFiZWx9PC9idXR0b24+XG4gICk7XG59XG5cbk9iamVjdC5hc3NpZ24od2luZG93LCB7XG4gIHVzZVR3ZWFrcywgVHdlYWtzUGFuZWwsIFR3ZWFrU2VjdGlvbiwgVHdlYWtSb3csXG4gIFR3ZWFrU2xpZGVyLCBUd2Vha1RvZ2dsZSwgVHdlYWtSYWRpbywgVHdlYWtTZWxlY3QsXG4gIFR3ZWFrVGV4dCwgVHdlYWtOdW1iZXIsIFR3ZWFrQ29sb3IsIFR3ZWFrQnV0dG9uLFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiQUEwQ0EsTUFBTSxpQkFBaUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7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
