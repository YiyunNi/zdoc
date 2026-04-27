import { jsx as B, jsxs as ye, Fragment as xr } from "react/jsx-runtime";
import yt, { forwardRef as br, createElement as Dn } from "react";
function Oi(e, t) {
  if (e && e !== "cloud-guides") return e;
  if (t) {
    if (/milvus\.io/i.test(t)) return "external-web";
    if (/github\.com/i.test(t)) return "external-github";
    if (/\/byoc[-/]/.test(t) || /docs-byoc/.test(t)) return "byoc-guides";
    if (/\/reference\//.test(t)) return "api-reference";
  }
  return e || "cloud-guides";
}
function xt(e) {
  if (!e || e.startsWith("/")) return !1;
  try {
    return !new URL(e).hostname.endsWith("zilliz.com");
  } catch {
    return !1;
  }
}
const Ni = "_dot_4g0w8_1", Bi = {
  dot: Ni
}, ji = {
  high: "#22c55e",
  medium: "#eab308",
  low: "#ef4444"
}, bt = {
  high: "High confidence — answer directly supported by documentation",
  medium: "Medium confidence — partially supported by documentation",
  low: "Low confidence — limited documentation available"
};
function Hi({ level: e }) {
  return e ? /* @__PURE__ */ B(
    "span",
    {
      className: Bi.dot,
      style: { backgroundColor: ji[e] },
      title: bt[e],
      "aria-label": bt[e]
    }
  ) : null;
}
const Ui = "_tag_3z9c6_1", $i = "_tagByoc_3z9c6_11", Vi = "_tagCloud_3z9c6_16", qi = "_tagApi_3z9c6_21", Wi = "_tagExternal_3z9c6_26", De = {
  tag: Ui,
  tagByoc: $i,
  tagCloud: Vi,
  tagApi: qi,
  tagExternal: Wi
}, Gi = {
  "byoc-guides": { label: "BYOC", className: De.tagByoc },
  "cloud-guides": { label: "CLOUD", className: De.tagCloud },
  "api-reference": { label: "API", className: De.tagApi },
  "external-web": { label: "EXT", className: De.tagExternal },
  "external-github": { label: "GITHUB", className: De.tagExternal }
};
function Yi({ section: e, url: t }) {
  const n = Oi(e, t), r = Gi[n];
  return r ? /* @__PURE__ */ B("span", { className: `${De.tag} ${r.className}`, children: r.label }) : null;
}
function Xi(e, t) {
  const n = {};
  return (e[e.length - 1] === "" ? [...e, ""] : e).join(
    (n.padRight ? " " : "") + "," + (n.padLeft === !1 ? "" : " ")
  ).trim();
}
const Qi = /^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u, Ki = /^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u, Ji = {};
function wt(e, t) {
  return (Ji.jsx ? Ki : Qi).test(e);
}
const Zi = /[ \t\n\f\r]/g;
function el(e) {
  return typeof e == "object" ? e.type === "text" ? Ct(e.value) : !1 : Ct(e);
}
function Ct(e) {
  return e.replace(Zi, "") === "";
}
class Xe {
  /**
   * @param {SchemaType['property']} property
   *   Property.
   * @param {SchemaType['normal']} normal
   *   Normal.
   * @param {Space | undefined} [space]
   *   Space.
   * @returns
   *   Schema.
   */
  constructor(t, n, r) {
    this.normal = n, this.property = t, r && (this.space = r);
  }
}
Xe.prototype.normal = {};
Xe.prototype.property = {};
Xe.prototype.space = void 0;
function wr(e, t) {
  const n = {}, r = {};
  for (const i of e)
    Object.assign(n, i.property), Object.assign(r, i.normal);
  return new Xe(n, r, t);
}
function Fn(e) {
  return e.toLowerCase();
}
class te {
  /**
   * @param {string} property
   *   Property.
   * @param {string} attribute
   *   Attribute.
   * @returns
   *   Info.
   */
  constructor(t, n) {
    this.attribute = n, this.property = t;
  }
}
te.prototype.attribute = "";
te.prototype.booleanish = !1;
te.prototype.boolean = !1;
te.prototype.commaOrSpaceSeparated = !1;
te.prototype.commaSeparated = !1;
te.prototype.defined = !1;
te.prototype.mustUseProperty = !1;
te.prototype.number = !1;
te.prototype.overloadedBoolean = !1;
te.prototype.property = "";
te.prototype.spaceSeparated = !1;
te.prototype.space = void 0;
let nl = 0;
const P = _e(), Y = _e(), Rn = _e(), C = _e(), V = _e(), Re = _e(), ie = _e();
function _e() {
  return 2 ** ++nl;
}
const Mn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  boolean: P,
  booleanish: Y,
  commaOrSpaceSeparated: ie,
  commaSeparated: Re,
  number: C,
  overloadedBoolean: Rn,
  spaceSeparated: V
}, Symbol.toStringTag, { value: "Module" })), kn = (
  /** @type {ReadonlyArray<keyof typeof types>} */
  Object.keys(Mn)
);
class Gn extends te {
  /**
   * @constructor
   * @param {string} property
   *   Property.
   * @param {string} attribute
   *   Attribute.
   * @param {number | null | undefined} [mask]
   *   Mask.
   * @param {Space | undefined} [space]
   *   Space.
   * @returns
   *   Info.
   */
  constructor(t, n, r, i) {
    let o = -1;
    if (super(t, n), St(this, "space", i), typeof r == "number")
      for (; ++o < kn.length; ) {
        const l = kn[o];
        St(this, kn[o], (r & Mn[l]) === Mn[l]);
      }
  }
}
Gn.prototype.defined = !0;
function St(e, t, n) {
  n && (e[t] = n);
}
function Oe(e) {
  const t = {}, n = {};
  for (const [r, i] of Object.entries(e.properties)) {
    const o = new Gn(
      r,
      e.transform(e.attributes || {}, r),
      i,
      e.space
    );
    e.mustUseProperty && e.mustUseProperty.includes(r) && (o.mustUseProperty = !0), t[r] = o, n[Fn(r)] = r, n[Fn(o.attribute)] = r;
  }
  return new Xe(t, n, e.space);
}
const Cr = Oe({
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: Y,
    ariaAutoComplete: null,
    ariaBusy: Y,
    ariaChecked: Y,
    ariaColCount: C,
    ariaColIndex: C,
    ariaColSpan: C,
    ariaControls: V,
    ariaCurrent: null,
    ariaDescribedBy: V,
    ariaDetails: null,
    ariaDisabled: Y,
    ariaDropEffect: V,
    ariaErrorMessage: null,
    ariaExpanded: Y,
    ariaFlowTo: V,
    ariaGrabbed: Y,
    ariaHasPopup: null,
    ariaHidden: Y,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: V,
    ariaLevel: C,
    ariaLive: null,
    ariaModal: Y,
    ariaMultiLine: Y,
    ariaMultiSelectable: Y,
    ariaOrientation: null,
    ariaOwns: V,
    ariaPlaceholder: null,
    ariaPosInSet: C,
    ariaPressed: Y,
    ariaReadOnly: Y,
    ariaRelevant: null,
    ariaRequired: Y,
    ariaRoleDescription: V,
    ariaRowCount: C,
    ariaRowIndex: C,
    ariaRowSpan: C,
    ariaSelected: Y,
    ariaSetSize: C,
    ariaSort: null,
    ariaValueMax: C,
    ariaValueMin: C,
    ariaValueNow: C,
    ariaValueText: null,
    role: null
  },
  transform(e, t) {
    return t === "role" ? t : "aria-" + t.slice(4).toLowerCase();
  }
});
function Sr(e, t) {
  return t in e ? e[t] : t;
}
function Er(e, t) {
  return Sr(e, t.toLowerCase());
}
const tl = Oe({
  attributes: {
    acceptcharset: "accept-charset",
    classname: "class",
    htmlfor: "for",
    httpequiv: "http-equiv"
  },
  mustUseProperty: ["checked", "multiple", "muted", "selected"],
  properties: {
    // Standard Properties.
    abbr: null,
    accept: Re,
    acceptCharset: V,
    accessKey: V,
    action: null,
    allow: null,
    allowFullScreen: P,
    allowPaymentRequest: P,
    allowUserMedia: P,
    alt: null,
    as: null,
    async: P,
    autoCapitalize: null,
    autoComplete: V,
    autoFocus: P,
    autoPlay: P,
    blocking: V,
    capture: null,
    charSet: null,
    checked: P,
    cite: null,
    className: V,
    cols: C,
    colSpan: null,
    content: null,
    contentEditable: Y,
    controls: P,
    controlsList: V,
    coords: C | Re,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: P,
    defer: P,
    dir: null,
    dirName: null,
    disabled: P,
    download: Rn,
    draggable: Y,
    encType: null,
    enterKeyHint: null,
    fetchPriority: null,
    form: null,
    formAction: null,
    formEncType: null,
    formMethod: null,
    formNoValidate: P,
    formTarget: null,
    headers: V,
    height: C,
    hidden: Rn,
    high: C,
    href: null,
    hrefLang: null,
    htmlFor: V,
    httpEquiv: V,
    id: null,
    imageSizes: null,
    imageSrcSet: null,
    inert: P,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: P,
    itemId: null,
    itemProp: V,
    itemRef: V,
    itemScope: P,
    itemType: V,
    kind: null,
    label: null,
    lang: null,
    language: null,
    list: null,
    loading: null,
    loop: P,
    low: C,
    manifest: null,
    max: null,
    maxLength: C,
    media: null,
    method: null,
    min: null,
    minLength: C,
    multiple: P,
    muted: P,
    name: null,
    nonce: null,
    noModule: P,
    noValidate: P,
    onAbort: null,
    onAfterPrint: null,
    onAuxClick: null,
    onBeforeMatch: null,
    onBeforePrint: null,
    onBeforeToggle: null,
    onBeforeUnload: null,
    onBlur: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onContextLost: null,
    onContextMenu: null,
    onContextRestored: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFormData: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLanguageChange: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadEnd: null,
    onLoadStart: null,
    onMessage: null,
    onMessageError: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRejectionHandled: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onScrollEnd: null,
    onSecurityPolicyViolation: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onSlotChange: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnhandledRejection: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onWheel: null,
    open: P,
    optimum: C,
    pattern: null,
    ping: V,
    placeholder: null,
    playsInline: P,
    popover: null,
    popoverTarget: null,
    popoverTargetAction: null,
    poster: null,
    preload: null,
    readOnly: P,
    referrerPolicy: null,
    rel: V,
    required: P,
    reversed: P,
    rows: C,
    rowSpan: C,
    sandbox: V,
    scope: null,
    scoped: P,
    seamless: P,
    selected: P,
    shadowRootClonable: P,
    shadowRootDelegatesFocus: P,
    shadowRootMode: null,
    shape: null,
    size: C,
    sizes: null,
    slot: null,
    span: C,
    spellCheck: Y,
    src: null,
    srcDoc: null,
    srcLang: null,
    srcSet: null,
    start: C,
    step: null,
    style: null,
    tabIndex: C,
    target: null,
    title: null,
    translate: null,
    type: null,
    typeMustMatch: P,
    useMap: null,
    value: Y,
    width: C,
    wrap: null,
    writingSuggestions: null,
    // Legacy.
    // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
    align: null,
    // Several. Use CSS `text-align` instead,
    aLink: null,
    // `<body>`. Use CSS `a:active {color}` instead
    archive: V,
    // `<object>`. List of URIs to archives
    axis: null,
    // `<td>` and `<th>`. Use `scope` on `<th>`
    background: null,
    // `<body>`. Use CSS `background-image` instead
    bgColor: null,
    // `<body>` and table elements. Use CSS `background-color` instead
    border: C,
    // `<table>`. Use CSS `border-width` instead,
    borderColor: null,
    // `<table>`. Use CSS `border-color` instead,
    bottomMargin: C,
    // `<body>`
    cellPadding: null,
    // `<table>`
    cellSpacing: null,
    // `<table>`
    char: null,
    // Several table elements. When `align=char`, sets the character to align on
    charOff: null,
    // Several table elements. When `char`, offsets the alignment
    classId: null,
    // `<object>`
    clear: null,
    // `<br>`. Use CSS `clear` instead
    code: null,
    // `<object>`
    codeBase: null,
    // `<object>`
    codeType: null,
    // `<object>`
    color: null,
    // `<font>` and `<hr>`. Use CSS instead
    compact: P,
    // Lists. Use CSS to reduce space between items instead
    declare: P,
    // `<object>`
    event: null,
    // `<script>`
    face: null,
    // `<font>`. Use CSS instead
    frame: null,
    // `<table>`
    frameBorder: null,
    // `<iframe>`. Use CSS `border` instead
    hSpace: C,
    // `<img>` and `<object>`
    leftMargin: C,
    // `<body>`
    link: null,
    // `<body>`. Use CSS `a:link {color: *}` instead
    longDesc: null,
    // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
    lowSrc: null,
    // `<img>`. Use a `<picture>`
    marginHeight: C,
    // `<body>`
    marginWidth: C,
    // `<body>`
    noResize: P,
    // `<frame>`
    noHref: P,
    // `<area>`. Use no href instead of an explicit `nohref`
    noShade: P,
    // `<hr>`. Use background-color and height instead of borders
    noWrap: P,
    // `<td>` and `<th>`
    object: null,
    // `<applet>`
    profile: null,
    // `<head>`
    prompt: null,
    // `<isindex>`
    rev: null,
    // `<link>`
    rightMargin: C,
    // `<body>`
    rules: null,
    // `<table>`
    scheme: null,
    // `<meta>`
    scrolling: Y,
    // `<frame>`. Use overflow in the child context
    standby: null,
    // `<object>`
    summary: null,
    // `<table>`
    text: null,
    // `<body>`. Use CSS `color` instead
    topMargin: C,
    // `<body>`
    valueType: null,
    // `<param>`
    version: null,
    // `<html>`. Use a doctype.
    vAlign: null,
    // Several. Use CSS `vertical-align` instead
    vLink: null,
    // `<body>`. Use CSS `a:visited {color}` instead
    vSpace: C,
    // `<img>` and `<object>`
    // Non-standard Properties.
    allowTransparency: null,
    autoCorrect: null,
    autoSave: null,
    disablePictureInPicture: P,
    disableRemotePlayback: P,
    prefix: null,
    property: null,
    results: C,
    security: null,
    unselectable: null
  },
  space: "html",
  transform: Er
}), rl = Oe({
  attributes: {
    accentHeight: "accent-height",
    alignmentBaseline: "alignment-baseline",
    arabicForm: "arabic-form",
    baselineShift: "baseline-shift",
    capHeight: "cap-height",
    className: "class",
    clipPath: "clip-path",
    clipRule: "clip-rule",
    colorInterpolation: "color-interpolation",
    colorInterpolationFilters: "color-interpolation-filters",
    colorProfile: "color-profile",
    colorRendering: "color-rendering",
    crossOrigin: "crossorigin",
    dataType: "datatype",
    dominantBaseline: "dominant-baseline",
    enableBackground: "enable-background",
    fillOpacity: "fill-opacity",
    fillRule: "fill-rule",
    floodColor: "flood-color",
    floodOpacity: "flood-opacity",
    fontFamily: "font-family",
    fontSize: "font-size",
    fontSizeAdjust: "font-size-adjust",
    fontStretch: "font-stretch",
    fontStyle: "font-style",
    fontVariant: "font-variant",
    fontWeight: "font-weight",
    glyphName: "glyph-name",
    glyphOrientationHorizontal: "glyph-orientation-horizontal",
    glyphOrientationVertical: "glyph-orientation-vertical",
    hrefLang: "hreflang",
    horizAdvX: "horiz-adv-x",
    horizOriginX: "horiz-origin-x",
    horizOriginY: "horiz-origin-y",
    imageRendering: "image-rendering",
    letterSpacing: "letter-spacing",
    lightingColor: "lighting-color",
    markerEnd: "marker-end",
    markerMid: "marker-mid",
    markerStart: "marker-start",
    navDown: "nav-down",
    navDownLeft: "nav-down-left",
    navDownRight: "nav-down-right",
    navLeft: "nav-left",
    navNext: "nav-next",
    navPrev: "nav-prev",
    navRight: "nav-right",
    navUp: "nav-up",
    navUpLeft: "nav-up-left",
    navUpRight: "nav-up-right",
    onAbort: "onabort",
    onActivate: "onactivate",
    onAfterPrint: "onafterprint",
    onBeforePrint: "onbeforeprint",
    onBegin: "onbegin",
    onCancel: "oncancel",
    onCanPlay: "oncanplay",
    onCanPlayThrough: "oncanplaythrough",
    onChange: "onchange",
    onClick: "onclick",
    onClose: "onclose",
    onCopy: "oncopy",
    onCueChange: "oncuechange",
    onCut: "oncut",
    onDblClick: "ondblclick",
    onDrag: "ondrag",
    onDragEnd: "ondragend",
    onDragEnter: "ondragenter",
    onDragExit: "ondragexit",
    onDragLeave: "ondragleave",
    onDragOver: "ondragover",
    onDragStart: "ondragstart",
    onDrop: "ondrop",
    onDurationChange: "ondurationchange",
    onEmptied: "onemptied",
    onEnd: "onend",
    onEnded: "onended",
    onError: "onerror",
    onFocus: "onfocus",
    onFocusIn: "onfocusin",
    onFocusOut: "onfocusout",
    onHashChange: "onhashchange",
    onInput: "oninput",
    onInvalid: "oninvalid",
    onKeyDown: "onkeydown",
    onKeyPress: "onkeypress",
    onKeyUp: "onkeyup",
    onLoad: "onload",
    onLoadedData: "onloadeddata",
    onLoadedMetadata: "onloadedmetadata",
    onLoadStart: "onloadstart",
    onMessage: "onmessage",
    onMouseDown: "onmousedown",
    onMouseEnter: "onmouseenter",
    onMouseLeave: "onmouseleave",
    onMouseMove: "onmousemove",
    onMouseOut: "onmouseout",
    onMouseOver: "onmouseover",
    onMouseUp: "onmouseup",
    onMouseWheel: "onmousewheel",
    onOffline: "onoffline",
    onOnline: "ononline",
    onPageHide: "onpagehide",
    onPageShow: "onpageshow",
    onPaste: "onpaste",
    onPause: "onpause",
    onPlay: "onplay",
    onPlaying: "onplaying",
    onPopState: "onpopstate",
    onProgress: "onprogress",
    onRateChange: "onratechange",
    onRepeat: "onrepeat",
    onReset: "onreset",
    onResize: "onresize",
    onScroll: "onscroll",
    onSeeked: "onseeked",
    onSeeking: "onseeking",
    onSelect: "onselect",
    onShow: "onshow",
    onStalled: "onstalled",
    onStorage: "onstorage",
    onSubmit: "onsubmit",
    onSuspend: "onsuspend",
    onTimeUpdate: "ontimeupdate",
    onToggle: "ontoggle",
    onUnload: "onunload",
    onVolumeChange: "onvolumechange",
    onWaiting: "onwaiting",
    onZoom: "onzoom",
    overlinePosition: "overline-position",
    overlineThickness: "overline-thickness",
    paintOrder: "paint-order",
    panose1: "panose-1",
    pointerEvents: "pointer-events",
    referrerPolicy: "referrerpolicy",
    renderingIntent: "rendering-intent",
    shapeRendering: "shape-rendering",
    stopColor: "stop-color",
    stopOpacity: "stop-opacity",
    strikethroughPosition: "strikethrough-position",
    strikethroughThickness: "strikethrough-thickness",
    strokeDashArray: "stroke-dasharray",
    strokeDashOffset: "stroke-dashoffset",
    strokeLineCap: "stroke-linecap",
    strokeLineJoin: "stroke-linejoin",
    strokeMiterLimit: "stroke-miterlimit",
    strokeOpacity: "stroke-opacity",
    strokeWidth: "stroke-width",
    tabIndex: "tabindex",
    textAnchor: "text-anchor",
    textDecoration: "text-decoration",
    textRendering: "text-rendering",
    transformOrigin: "transform-origin",
    typeOf: "typeof",
    underlinePosition: "underline-position",
    underlineThickness: "underline-thickness",
    unicodeBidi: "unicode-bidi",
    unicodeRange: "unicode-range",
    unitsPerEm: "units-per-em",
    vAlphabetic: "v-alphabetic",
    vHanging: "v-hanging",
    vIdeographic: "v-ideographic",
    vMathematical: "v-mathematical",
    vectorEffect: "vector-effect",
    vertAdvY: "vert-adv-y",
    vertOriginX: "vert-origin-x",
    vertOriginY: "vert-origin-y",
    wordSpacing: "word-spacing",
    writingMode: "writing-mode",
    xHeight: "x-height",
    // These were camelcased in Tiny. Now lowercased in SVG 2
    playbackOrder: "playbackorder",
    timelineBegin: "timelinebegin"
  },
  properties: {
    about: ie,
    accentHeight: C,
    accumulate: null,
    additive: null,
    alignmentBaseline: null,
    alphabetic: C,
    amplitude: C,
    arabicForm: null,
    ascent: C,
    attributeName: null,
    attributeType: null,
    azimuth: C,
    bandwidth: null,
    baselineShift: null,
    baseFrequency: null,
    baseProfile: null,
    bbox: null,
    begin: null,
    bias: C,
    by: null,
    calcMode: null,
    capHeight: C,
    className: V,
    clip: null,
    clipPath: null,
    clipPathUnits: null,
    clipRule: null,
    color: null,
    colorInterpolation: null,
    colorInterpolationFilters: null,
    colorProfile: null,
    colorRendering: null,
    content: null,
    contentScriptType: null,
    contentStyleType: null,
    crossOrigin: null,
    cursor: null,
    cx: null,
    cy: null,
    d: null,
    dataType: null,
    defaultAction: null,
    descent: C,
    diffuseConstant: C,
    direction: null,
    display: null,
    dur: null,
    divisor: C,
    dominantBaseline: null,
    download: P,
    dx: null,
    dy: null,
    edgeMode: null,
    editable: null,
    elevation: C,
    enableBackground: null,
    end: null,
    event: null,
    exponent: C,
    externalResourcesRequired: null,
    fill: null,
    fillOpacity: C,
    fillRule: null,
    filter: null,
    filterRes: null,
    filterUnits: null,
    floodColor: null,
    floodOpacity: null,
    focusable: null,
    focusHighlight: null,
    fontFamily: null,
    fontSize: null,
    fontSizeAdjust: null,
    fontStretch: null,
    fontStyle: null,
    fontVariant: null,
    fontWeight: null,
    format: null,
    fr: null,
    from: null,
    fx: null,
    fy: null,
    g1: Re,
    g2: Re,
    glyphName: Re,
    glyphOrientationHorizontal: null,
    glyphOrientationVertical: null,
    glyphRef: null,
    gradientTransform: null,
    gradientUnits: null,
    handler: null,
    hanging: C,
    hatchContentUnits: null,
    hatchUnits: null,
    height: null,
    href: null,
    hrefLang: null,
    horizAdvX: C,
    horizOriginX: C,
    horizOriginY: C,
    id: null,
    ideographic: C,
    imageRendering: null,
    initialVisibility: null,
    in: null,
    in2: null,
    intercept: C,
    k: C,
    k1: C,
    k2: C,
    k3: C,
    k4: C,
    kernelMatrix: ie,
    kernelUnitLength: null,
    keyPoints: null,
    // SEMI_COLON_SEPARATED
    keySplines: null,
    // SEMI_COLON_SEPARATED
    keyTimes: null,
    // SEMI_COLON_SEPARATED
    kerning: null,
    lang: null,
    lengthAdjust: null,
    letterSpacing: null,
    lightingColor: null,
    limitingConeAngle: C,
    local: null,
    markerEnd: null,
    markerMid: null,
    markerStart: null,
    markerHeight: null,
    markerUnits: null,
    markerWidth: null,
    mask: null,
    maskContentUnits: null,
    maskUnits: null,
    mathematical: null,
    max: null,
    media: null,
    mediaCharacterEncoding: null,
    mediaContentEncodings: null,
    mediaSize: C,
    mediaTime: null,
    method: null,
    min: null,
    mode: null,
    name: null,
    navDown: null,
    navDownLeft: null,
    navDownRight: null,
    navLeft: null,
    navNext: null,
    navPrev: null,
    navRight: null,
    navUp: null,
    navUpLeft: null,
    navUpRight: null,
    numOctaves: null,
    observer: null,
    offset: null,
    onAbort: null,
    onActivate: null,
    onAfterPrint: null,
    onBeforePrint: null,
    onBegin: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnd: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFocusIn: null,
    onFocusOut: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadStart: null,
    onMessage: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onMouseWheel: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRepeat: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onShow: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onZoom: null,
    opacity: null,
    operator: null,
    order: null,
    orient: null,
    orientation: null,
    origin: null,
    overflow: null,
    overlay: null,
    overlinePosition: C,
    overlineThickness: C,
    paintOrder: null,
    panose1: null,
    path: null,
    pathLength: C,
    patternContentUnits: null,
    patternTransform: null,
    patternUnits: null,
    phase: null,
    ping: V,
    pitch: null,
    playbackOrder: null,
    pointerEvents: null,
    points: null,
    pointsAtX: C,
    pointsAtY: C,
    pointsAtZ: C,
    preserveAlpha: null,
    preserveAspectRatio: null,
    primitiveUnits: null,
    propagate: null,
    property: ie,
    r: null,
    radius: null,
    referrerPolicy: null,
    refX: null,
    refY: null,
    rel: ie,
    rev: ie,
    renderingIntent: null,
    repeatCount: null,
    repeatDur: null,
    requiredExtensions: ie,
    requiredFeatures: ie,
    requiredFonts: ie,
    requiredFormats: ie,
    resource: null,
    restart: null,
    result: null,
    rotate: null,
    rx: null,
    ry: null,
    scale: null,
    seed: null,
    shapeRendering: null,
    side: null,
    slope: null,
    snapshotTime: null,
    specularConstant: C,
    specularExponent: C,
    spreadMethod: null,
    spacing: null,
    startOffset: null,
    stdDeviation: null,
    stemh: null,
    stemv: null,
    stitchTiles: null,
    stopColor: null,
    stopOpacity: null,
    strikethroughPosition: C,
    strikethroughThickness: C,
    string: null,
    stroke: null,
    strokeDashArray: ie,
    strokeDashOffset: null,
    strokeLineCap: null,
    strokeLineJoin: null,
    strokeMiterLimit: C,
    strokeOpacity: C,
    strokeWidth: null,
    style: null,
    surfaceScale: C,
    syncBehavior: null,
    syncBehaviorDefault: null,
    syncMaster: null,
    syncTolerance: null,
    syncToleranceDefault: null,
    systemLanguage: ie,
    tabIndex: C,
    tableValues: null,
    target: null,
    targetX: C,
    targetY: C,
    textAnchor: null,
    textDecoration: null,
    textRendering: null,
    textLength: null,
    timelineBegin: null,
    title: null,
    transformBehavior: null,
    type: null,
    typeOf: ie,
    to: null,
    transform: null,
    transformOrigin: null,
    u1: null,
    u2: null,
    underlinePosition: C,
    underlineThickness: C,
    unicode: null,
    unicodeBidi: null,
    unicodeRange: null,
    unitsPerEm: C,
    values: null,
    vAlphabetic: C,
    vMathematical: C,
    vectorEffect: null,
    vHanging: C,
    vIdeographic: C,
    version: null,
    vertAdvY: C,
    vertOriginX: C,
    vertOriginY: C,
    viewBox: null,
    viewTarget: null,
    visibility: null,
    width: null,
    widths: null,
    wordSpacing: null,
    writingMode: null,
    x: null,
    x1: null,
    x2: null,
    xChannelSelector: null,
    xHeight: C,
    y: null,
    y1: null,
    y2: null,
    yChannelSelector: null,
    z: null,
    zoomAndPan: null
  },
  space: "svg",
  transform: Sr
}), Ir = Oe({
  properties: {
    xLinkActuate: null,
    xLinkArcRole: null,
    xLinkHref: null,
    xLinkRole: null,
    xLinkShow: null,
    xLinkTitle: null,
    xLinkType: null
  },
  space: "xlink",
  transform(e, t) {
    return "xlink:" + t.slice(5).toLowerCase();
  }
}), Ar = Oe({
  attributes: { xmlnsxlink: "xmlns:xlink" },
  properties: { xmlnsXLink: null, xmlns: null },
  space: "xmlns",
  transform: Er
}), Tr = Oe({
  properties: { xmlBase: null, xmlLang: null, xmlSpace: null },
  space: "xml",
  transform(e, t) {
    return "xml:" + t.slice(3).toLowerCase();
  }
}), il = {
  classId: "classID",
  dataType: "datatype",
  itemId: "itemID",
  strokeDashArray: "strokeDasharray",
  strokeDashOffset: "strokeDashoffset",
  strokeLineCap: "strokeLinecap",
  strokeLineJoin: "strokeLinejoin",
  strokeMiterLimit: "strokeMiterlimit",
  typeOf: "typeof",
  xLinkActuate: "xlinkActuate",
  xLinkArcRole: "xlinkArcrole",
  xLinkHref: "xlinkHref",
  xLinkRole: "xlinkRole",
  xLinkShow: "xlinkShow",
  xLinkTitle: "xlinkTitle",
  xLinkType: "xlinkType",
  xmlnsXLink: "xmlnsXlink"
}, ll = /[A-Z]/g, Et = /-[a-z]/g, ol = /^data[-\w.:]+$/i;
function al(e, t) {
  const n = Fn(t);
  let r = t, i = te;
  if (n in e.normal)
    return e.property[e.normal[n]];
  if (n.length > 4 && n.slice(0, 4) === "data" && ol.test(t)) {
    if (t.charAt(4) === "-") {
      const o = t.slice(5).replace(Et, sl);
      r = "data" + o.charAt(0).toUpperCase() + o.slice(1);
    } else {
      const o = t.slice(4);
      if (!Et.test(o)) {
        let l = o.replace(ll, ul);
        l.charAt(0) !== "-" && (l = "-" + l), t = "data" + l;
      }
    }
    i = Gn;
  }
  return new i(r, t);
}
function ul(e) {
  return "-" + e.toLowerCase();
}
function sl(e) {
  return e.charAt(1).toUpperCase();
}
const cl = wr([Cr, tl, Ir, Ar, Tr], "html"), Yn = wr([Cr, rl, Ir, Ar, Tr], "svg");
function fl(e) {
  return e.join(" ").trim();
}
var on = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function _r(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Xn = {}, It = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, hl = /\n/g, pl = /^\s*/, ml = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/, dl = /^:\s*/, gl = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/, kl = /^[;\s]*/, yl = /^\s+|\s+$/g, xl = `
`, At = "/", Tt = "*", Ae = "", bl = "comment", wl = "declaration";
function Cl(e, t) {
  if (typeof e != "string")
    throw new TypeError("First argument must be a string");
  if (!e) return [];
  t = t || {};
  var n = 1, r = 1;
  function i(g) {
    var x = g.match(hl);
    x && (n += x.length);
    var S = g.lastIndexOf(xl);
    r = ~S ? g.length - S : r + g.length;
  }
  function o() {
    var g = { line: n, column: r };
    return function(x) {
      return x.position = new l(g), s(), x;
    };
  }
  function l(g) {
    this.start = g, this.end = { line: n, column: r }, this.source = t.source;
  }
  l.prototype.content = e;
  function a(g) {
    var x = new Error(
      t.source + ":" + n + ":" + r + ": " + g
    );
    if (x.reason = g, x.filename = t.source, x.line = n, x.column = r, x.source = e, !t.silent) throw x;
  }
  function u(g) {
    var x = g.exec(e);
    if (x) {
      var S = x[0];
      return i(S), e = e.slice(S.length), x;
    }
  }
  function s() {
    u(pl);
  }
  function f(g) {
    var x;
    for (g = g || []; x = c(); )
      x !== !1 && g.push(x);
    return g;
  }
  function c() {
    var g = o();
    if (!(At != e.charAt(0) || Tt != e.charAt(1))) {
      for (var x = 2; Ae != e.charAt(x) && (Tt != e.charAt(x) || At != e.charAt(x + 1)); )
        ++x;
      if (x += 2, Ae === e.charAt(x - 1))
        return a("End of comment missing");
      var S = e.slice(2, x - 2);
      return r += 2, i(S), e = e.slice(x), r += 2, g({
        type: bl,
        comment: S
      });
    }
  }
  function p() {
    var g = o(), x = u(ml);
    if (x) {
      if (c(), !u(dl)) return a("property missing ':'");
      var S = u(gl), k = g({
        type: wl,
        property: _t(x[0].replace(It, Ae)),
        value: S ? _t(S[0].replace(It, Ae)) : Ae
      });
      return u(kl), k;
    }
  }
  function h() {
    var g = [];
    f(g);
    for (var x; x = p(); )
      x !== !1 && (g.push(x), f(g));
    return g;
  }
  return s(), h();
}
function _t(e) {
  return e ? e.replace(yl, Ae) : Ae;
}
var Sl = Cl, El = on && on.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Xn, "__esModule", { value: !0 });
Xn.default = Al;
const Il = El(Sl);
function Al(e, t) {
  let n = null;
  if (!e || typeof e != "string")
    return n;
  const r = (0, Il.default)(e), i = typeof t == "function";
  return r.forEach((o) => {
    if (o.type !== "declaration")
      return;
    const { property: l, value: a } = o;
    i ? t(l, a, o) : a && (n = n || {}, n[l] = a);
  }), n;
}
var fn = {};
Object.defineProperty(fn, "__esModule", { value: !0 });
fn.camelCase = void 0;
var Tl = /^--[a-zA-Z0-9_-]+$/, _l = /-([a-z])/g, vl = /^[^-]+$/, Ll = /^-(webkit|moz|ms|o|khtml)-/, Pl = /^-(ms)-/, zl = function(e) {
  return !e || vl.test(e) || Tl.test(e);
}, Dl = function(e, t) {
  return t.toUpperCase();
}, vt = function(e, t) {
  return "".concat(t, "-");
}, Fl = function(e, t) {
  return t === void 0 && (t = {}), zl(e) ? e : (e = e.toLowerCase(), t.reactCompat ? e = e.replace(Pl, vt) : e = e.replace(Ll, vt), e.replace(_l, Dl));
};
fn.camelCase = Fl;
var Rl = on && on.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
}, Ml = Rl(Xn), Ol = fn;
function On(e, t) {
  var n = {};
  return !e || typeof e != "string" || (0, Ml.default)(e, function(r, i) {
    r && i && (n[(0, Ol.camelCase)(r, t)] = i);
  }), n;
}
On.default = On;
var Nl = On;
const Bl = /* @__PURE__ */ _r(Nl), vr = Lr("end"), Qn = Lr("start");
function Lr(e) {
  return t;
  function t(n) {
    const r = n && n.position && n.position[e] || {};
    if (typeof r.line == "number" && r.line > 0 && typeof r.column == "number" && r.column > 0)
      return {
        line: r.line,
        column: r.column,
        offset: typeof r.offset == "number" && r.offset > -1 ? r.offset : void 0
      };
  }
}
function jl(e) {
  const t = Qn(e), n = vr(e);
  if (t && n)
    return { start: t, end: n };
}
function Ve(e) {
  return !e || typeof e != "object" ? "" : "position" in e || "type" in e ? Lt(e.position) : "start" in e || "end" in e ? Lt(e) : "line" in e || "column" in e ? Nn(e) : "";
}
function Nn(e) {
  return Pt(e && e.line) + ":" + Pt(e && e.column);
}
function Lt(e) {
  return Nn(e && e.start) + "-" + Nn(e && e.end);
}
function Pt(e) {
  return e && typeof e == "number" ? e : 1;
}
class Z extends Error {
  /**
   * Create a message for `reason`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {Options | null | undefined} [options]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | Options | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns
   *   Instance of `VFileMessage`.
   */
  // eslint-disable-next-line complexity
  constructor(t, n, r) {
    super(), typeof n == "string" && (r = n, n = void 0);
    let i = "", o = {}, l = !1;
    if (n && ("line" in n && "column" in n ? o = { place: n } : "start" in n && "end" in n ? o = { place: n } : "type" in n ? o = {
      ancestors: [n],
      place: n.position
    } : o = { ...n }), typeof t == "string" ? i = t : !o.cause && t && (l = !0, i = t.message, o.cause = t), !o.ruleId && !o.source && typeof r == "string") {
      const u = r.indexOf(":");
      u === -1 ? o.ruleId = r : (o.source = r.slice(0, u), o.ruleId = r.slice(u + 1));
    }
    if (!o.place && o.ancestors && o.ancestors) {
      const u = o.ancestors[o.ancestors.length - 1];
      u && (o.place = u.position);
    }
    const a = o.place && "start" in o.place ? o.place.start : o.place;
    this.ancestors = o.ancestors || void 0, this.cause = o.cause || void 0, this.column = a ? a.column : void 0, this.fatal = void 0, this.file = "", this.message = i, this.line = a ? a.line : void 0, this.name = Ve(o.place) || "1:1", this.place = o.place || void 0, this.reason = this.message, this.ruleId = o.ruleId || void 0, this.source = o.source || void 0, this.stack = l && o.cause && typeof o.cause.stack == "string" ? o.cause.stack : "", this.actual = void 0, this.expected = void 0, this.note = void 0, this.url = void 0;
  }
}
Z.prototype.file = "";
Z.prototype.name = "";
Z.prototype.reason = "";
Z.prototype.message = "";
Z.prototype.stack = "";
Z.prototype.column = void 0;
Z.prototype.line = void 0;
Z.prototype.ancestors = void 0;
Z.prototype.cause = void 0;
Z.prototype.fatal = void 0;
Z.prototype.place = void 0;
Z.prototype.ruleId = void 0;
Z.prototype.source = void 0;
const Kn = {}.hasOwnProperty, Hl = /* @__PURE__ */ new Map(), Ul = /[A-Z]/g, $l = /* @__PURE__ */ new Set(["table", "tbody", "thead", "tfoot", "tr"]), Vl = /* @__PURE__ */ new Set(["td", "th"]), Pr = "https://github.com/syntax-tree/hast-util-to-jsx-runtime";
function ql(e, t) {
  if (!t || t.Fragment === void 0)
    throw new TypeError("Expected `Fragment` in options");
  const n = t.filePath || void 0;
  let r;
  if (t.development) {
    if (typeof t.jsxDEV != "function")
      throw new TypeError(
        "Expected `jsxDEV` in options when `development: true`"
      );
    r = Zl(n, t.jsxDEV);
  } else {
    if (typeof t.jsx != "function")
      throw new TypeError("Expected `jsx` in production options");
    if (typeof t.jsxs != "function")
      throw new TypeError("Expected `jsxs` in production options");
    r = Jl(n, t.jsx, t.jsxs);
  }
  const i = {
    Fragment: t.Fragment,
    ancestors: [],
    components: t.components || {},
    create: r,
    elementAttributeNameCase: t.elementAttributeNameCase || "react",
    evaluater: t.createEvaluater ? t.createEvaluater() : void 0,
    filePath: n,
    ignoreInvalidStyle: t.ignoreInvalidStyle || !1,
    passKeys: t.passKeys !== !1,
    passNode: t.passNode || !1,
    schema: t.space === "svg" ? Yn : cl,
    stylePropertyNameCase: t.stylePropertyNameCase || "dom",
    tableCellAlignToStyle: t.tableCellAlignToStyle !== !1
  }, o = zr(i, e, void 0);
  return o && typeof o != "string" ? o : i.create(
    e,
    i.Fragment,
    { children: o || void 0 },
    void 0
  );
}
function zr(e, t, n) {
  if (t.type === "element")
    return Wl(e, t, n);
  if (t.type === "mdxFlowExpression" || t.type === "mdxTextExpression")
    return Gl(e, t);
  if (t.type === "mdxJsxFlowElement" || t.type === "mdxJsxTextElement")
    return Xl(e, t, n);
  if (t.type === "mdxjsEsm")
    return Yl(e, t);
  if (t.type === "root")
    return Ql(e, t, n);
  if (t.type === "text")
    return Kl(e, t);
}
function Wl(e, t, n) {
  const r = e.schema;
  let i = r;
  t.tagName.toLowerCase() === "svg" && r.space === "html" && (i = Yn, e.schema = i), e.ancestors.push(t);
  const o = Fr(e, t.tagName, !1), l = eo(e, t);
  let a = Zn(e, t);
  return $l.has(t.tagName) && (a = a.filter(function(u) {
    return typeof u == "string" ? !el(u) : !0;
  })), Dr(e, l, o, t), Jn(l, a), e.ancestors.pop(), e.schema = r, e.create(t, o, l, n);
}
function Gl(e, t) {
  if (t.data && t.data.estree && e.evaluater) {
    const r = t.data.estree.body[0];
    return r.type, /** @type {Child | undefined} */
    e.evaluater.evaluateExpression(r.expression);
  }
  Ge(e, t.position);
}
function Yl(e, t) {
  if (t.data && t.data.estree && e.evaluater)
    return (
      /** @type {Child | undefined} */
      e.evaluater.evaluateProgram(t.data.estree)
    );
  Ge(e, t.position);
}
function Xl(e, t, n) {
  const r = e.schema;
  let i = r;
  t.name === "svg" && r.space === "html" && (i = Yn, e.schema = i), e.ancestors.push(t);
  const o = t.name === null ? e.Fragment : Fr(e, t.name, !0), l = no(e, t), a = Zn(e, t);
  return Dr(e, l, o, t), Jn(l, a), e.ancestors.pop(), e.schema = r, e.create(t, o, l, n);
}
function Ql(e, t, n) {
  const r = {};
  return Jn(r, Zn(e, t)), e.create(t, e.Fragment, r, n);
}
function Kl(e, t) {
  return t.value;
}
function Dr(e, t, n, r) {
  typeof n != "string" && n !== e.Fragment && e.passNode && (t.node = r);
}
function Jn(e, t) {
  if (t.length > 0) {
    const n = t.length > 1 ? t : t[0];
    n && (e.children = n);
  }
}
function Jl(e, t, n) {
  return r;
  function r(i, o, l, a) {
    const s = Array.isArray(l.children) ? n : t;
    return a ? s(o, l, a) : s(o, l);
  }
}
function Zl(e, t) {
  return n;
  function n(r, i, o, l) {
    const a = Array.isArray(o.children), u = Qn(r);
    return t(
      i,
      o,
      l,
      a,
      {
        columnNumber: u ? u.column - 1 : void 0,
        fileName: e,
        lineNumber: u ? u.line : void 0
      },
      void 0
    );
  }
}
function eo(e, t) {
  const n = {};
  let r, i;
  for (i in t.properties)
    if (i !== "children" && Kn.call(t.properties, i)) {
      const o = to(e, i, t.properties[i]);
      if (o) {
        const [l, a] = o;
        e.tableCellAlignToStyle && l === "align" && typeof a == "string" && Vl.has(t.tagName) ? r = a : n[l] = a;
      }
    }
  if (r) {
    const o = (
      /** @type {Style} */
      n.style || (n.style = {})
    );
    o[e.stylePropertyNameCase === "css" ? "text-align" : "textAlign"] = r;
  }
  return n;
}
function no(e, t) {
  const n = {};
  for (const r of t.attributes)
    if (r.type === "mdxJsxExpressionAttribute")
      if (r.data && r.data.estree && e.evaluater) {
        const o = r.data.estree.body[0];
        o.type;
        const l = o.expression;
        l.type;
        const a = l.properties[0];
        a.type, Object.assign(
          n,
          e.evaluater.evaluateExpression(a.argument)
        );
      } else
        Ge(e, t.position);
    else {
      const i = r.name;
      let o;
      if (r.value && typeof r.value == "object")
        if (r.value.data && r.value.data.estree && e.evaluater) {
          const a = r.value.data.estree.body[0];
          a.type, o = e.evaluater.evaluateExpression(a.expression);
        } else
          Ge(e, t.position);
      else
        o = r.value === null ? !0 : r.value;
      n[i] = /** @type {Props[keyof Props]} */
      o;
    }
  return n;
}
function Zn(e, t) {
  const n = [];
  let r = -1;
  const i = e.passKeys ? /* @__PURE__ */ new Map() : Hl;
  for (; ++r < t.children.length; ) {
    const o = t.children[r];
    let l;
    if (e.passKeys) {
      const u = o.type === "element" ? o.tagName : o.type === "mdxJsxFlowElement" || o.type === "mdxJsxTextElement" ? o.name : void 0;
      if (u) {
        const s = i.get(u) || 0;
        l = u + "-" + s, i.set(u, s + 1);
      }
    }
    const a = zr(e, o, l);
    a !== void 0 && n.push(a);
  }
  return n;
}
function to(e, t, n) {
  const r = al(e.schema, t);
  if (!(n == null || typeof n == "number" && Number.isNaN(n))) {
    if (Array.isArray(n) && (n = r.commaSeparated ? Xi(n) : fl(n)), r.property === "style") {
      let i = typeof n == "object" ? n : ro(e, String(n));
      return e.stylePropertyNameCase === "css" && (i = io(i)), ["style", i];
    }
    return [
      e.elementAttributeNameCase === "react" && r.space ? il[r.property] || r.property : r.attribute,
      n
    ];
  }
}
function ro(e, t) {
  try {
    return Bl(t, { reactCompat: !0 });
  } catch (n) {
    if (e.ignoreInvalidStyle)
      return {};
    const r = (
      /** @type {Error} */
      n
    ), i = new Z("Cannot parse `style` attribute", {
      ancestors: e.ancestors,
      cause: r,
      ruleId: "style",
      source: "hast-util-to-jsx-runtime"
    });
    throw i.file = e.filePath || void 0, i.url = Pr + "#cannot-parse-style-attribute", i;
  }
}
function Fr(e, t, n) {
  let r;
  if (!n)
    r = { type: "Literal", value: t };
  else if (t.includes(".")) {
    const i = t.split(".");
    let o = -1, l;
    for (; ++o < i.length; ) {
      const a = wt(i[o]) ? { type: "Identifier", name: i[o] } : { type: "Literal", value: i[o] };
      l = l ? {
        type: "MemberExpression",
        object: l,
        property: a,
        computed: !!(o && a.type === "Literal"),
        optional: !1
      } : a;
    }
    r = l;
  } else
    r = wt(t) && !/^[a-z]/.test(t) ? { type: "Identifier", name: t } : { type: "Literal", value: t };
  if (r.type === "Literal") {
    const i = (
      /** @type {string | number} */
      r.value
    );
    return Kn.call(e.components, i) ? e.components[i] : i;
  }
  if (e.evaluater)
    return e.evaluater.evaluateExpression(r);
  Ge(e);
}
function Ge(e, t) {
  const n = new Z(
    "Cannot handle MDX estrees without `createEvaluater`",
    {
      ancestors: e.ancestors,
      place: t,
      ruleId: "mdx-estree",
      source: "hast-util-to-jsx-runtime"
    }
  );
  throw n.file = e.filePath || void 0, n.url = Pr + "#cannot-handle-mdx-estrees-without-createevaluater", n;
}
function io(e) {
  const t = {};
  let n;
  for (n in e)
    Kn.call(e, n) && (t[lo(n)] = e[n]);
  return t;
}
function lo(e) {
  let t = e.replace(Ul, oo);
  return t.slice(0, 3) === "ms-" && (t = "-" + t), t;
}
function oo(e) {
  return "-" + e.toLowerCase();
}
const yn = {
  action: ["form"],
  cite: ["blockquote", "del", "ins", "q"],
  data: ["object"],
  formAction: ["button", "input"],
  href: ["a", "area", "base", "link"],
  icon: ["menuitem"],
  itemId: null,
  manifest: ["html"],
  ping: ["a", "area"],
  poster: ["video"],
  src: [
    "audio",
    "embed",
    "iframe",
    "img",
    "input",
    "script",
    "source",
    "track",
    "video"
  ]
}, ao = {};
function et(e, t) {
  const n = ao, r = typeof n.includeImageAlt == "boolean" ? n.includeImageAlt : !0, i = typeof n.includeHtml == "boolean" ? n.includeHtml : !0;
  return Rr(e, r, i);
}
function Rr(e, t, n) {
  if (uo(e)) {
    if ("value" in e)
      return e.type === "html" && !n ? "" : e.value;
    if (t && "alt" in e && e.alt)
      return e.alt;
    if ("children" in e)
      return zt(e.children, t, n);
  }
  return Array.isArray(e) ? zt(e, t, n) : "";
}
function zt(e, t, n) {
  const r = [];
  let i = -1;
  for (; ++i < e.length; )
    r[i] = Rr(e[i], t, n);
  return r.join("");
}
function uo(e) {
  return !!(e && typeof e == "object");
}
const Dt = document.createElement("i");
function nt(e) {
  const t = "&" + e + ";";
  Dt.innerHTML = t;
  const n = Dt.textContent;
  return n.charCodeAt(n.length - 1) === 59 && e !== "semi" || n === t ? !1 : n;
}
function le(e, t, n, r) {
  const i = e.length;
  let o = 0, l;
  if (t < 0 ? t = -t > i ? 0 : i + t : t = t > i ? i : t, n = n > 0 ? n : 0, r.length < 1e4)
    l = Array.from(r), l.unshift(t, n), e.splice(...l);
  else
    for (n && e.splice(t, n); o < r.length; )
      l = r.slice(o, o + 1e4), l.unshift(t, 0), e.splice(...l), o += 1e4, t += 1e4;
}
function oe(e, t) {
  return e.length > 0 ? (le(e, e.length, 0, t), e) : t;
}
const Ft = {}.hasOwnProperty;
function Mr(e) {
  const t = {};
  let n = -1;
  for (; ++n < e.length; )
    so(t, e[n]);
  return t;
}
function so(e, t) {
  let n;
  for (n in t) {
    const i = (Ft.call(e, n) ? e[n] : void 0) || (e[n] = {}), o = t[n];
    let l;
    if (o)
      for (l in o) {
        Ft.call(i, l) || (i[l] = []);
        const a = o[l];
        co(
          // @ts-expect-error Looks like a list.
          i[l],
          Array.isArray(a) ? a : a ? [a] : []
        );
      }
  }
}
function co(e, t) {
  let n = -1;
  const r = [];
  for (; ++n < t.length; )
    (t[n].add === "after" ? e : r).push(t[n]);
  le(e, 0, 0, r);
}
function Or(e, t) {
  const n = Number.parseInt(e, t);
  return (
    // C0 except for HT, LF, FF, CR, space.
    n < 9 || n === 11 || n > 13 && n < 32 || // Control character (DEL) of C0, and C1 controls.
    n > 126 && n < 160 || // Lone high surrogates and low surrogates.
    n > 55295 && n < 57344 || // Noncharacters.
    n > 64975 && n < 65008 || /* eslint-disable no-bitwise */
    (n & 65535) === 65535 || (n & 65535) === 65534 || /* eslint-enable no-bitwise */
    // Out of range
    n > 1114111 ? "�" : String.fromCodePoint(n)
  );
}
function fe(e) {
  return e.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase();
}
const ee = Ce(/[A-Za-z]/), J = Ce(/[\dA-Za-z]/), fo = Ce(/[#-'*+\--9=?A-Z^-~]/);
function an(e) {
  return (
    // Special whitespace codes (which have negative values), C0 and Control
    // character DEL
    e !== null && (e < 32 || e === 127)
  );
}
const Bn = Ce(/\d/), ho = Ce(/[\dA-Fa-f]/), po = Ce(/[!-/:-@[-`{-~]/);
function v(e) {
  return e !== null && e < -2;
}
function $(e) {
  return e !== null && (e < 0 || e === 32);
}
function F(e) {
  return e === -2 || e === -1 || e === 32;
}
const hn = Ce(new RegExp("\\p{P}|\\p{S}", "u")), Te = Ce(/\s/);
function Ce(e) {
  return t;
  function t(n) {
    return n !== null && n > -1 && e.test(String.fromCharCode(n));
  }
}
function Ne(e) {
  const t = [];
  let n = -1, r = 0, i = 0;
  for (; ++n < e.length; ) {
    const o = e.charCodeAt(n);
    let l = "";
    if (o === 37 && J(e.charCodeAt(n + 1)) && J(e.charCodeAt(n + 2)))
      i = 2;
    else if (o < 128)
      /[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(o)) || (l = String.fromCharCode(o));
    else if (o > 55295 && o < 57344) {
      const a = e.charCodeAt(n + 1);
      o < 56320 && a > 56319 && a < 57344 ? (l = String.fromCharCode(o, a), i = 1) : l = "�";
    } else
      l = String.fromCharCode(o);
    l && (t.push(e.slice(r, n), encodeURIComponent(l)), r = n + i + 1, l = ""), i && (n += i, i = 0);
  }
  return t.join("") + e.slice(r);
}
function M(e, t, n, r) {
  const i = r ? r - 1 : Number.POSITIVE_INFINITY;
  let o = 0;
  return l;
  function l(u) {
    return F(u) ? (e.enter(n), a(u)) : t(u);
  }
  function a(u) {
    return F(u) && o++ < i ? (e.consume(u), a) : (e.exit(n), t(u));
  }
}
const mo = {
  tokenize: go
};
function go(e) {
  const t = e.attempt(this.parser.constructs.contentInitial, r, i);
  let n;
  return t;
  function r(a) {
    if (a === null) {
      e.consume(a);
      return;
    }
    return e.enter("lineEnding"), e.consume(a), e.exit("lineEnding"), M(e, t, "linePrefix");
  }
  function i(a) {
    return e.enter("paragraph"), o(a);
  }
  function o(a) {
    const u = e.enter("chunkText", {
      contentType: "text",
      previous: n
    });
    return n && (n.next = u), n = u, l(a);
  }
  function l(a) {
    if (a === null) {
      e.exit("chunkText"), e.exit("paragraph"), e.consume(a);
      return;
    }
    return v(a) ? (e.consume(a), e.exit("chunkText"), o) : (e.consume(a), l);
  }
}
const ko = {
  tokenize: yo
}, Rt = {
  tokenize: xo
};
function yo(e) {
  const t = this, n = [];
  let r = 0, i, o, l;
  return a;
  function a(E) {
    if (r < n.length) {
      const z = n[r];
      return t.containerState = z[1], e.attempt(z[0].continuation, u, s)(E);
    }
    return s(E);
  }
  function u(E) {
    if (r++, t.containerState._closeFlow) {
      t.containerState._closeFlow = void 0, i && A();
      const z = t.events.length;
      let D = z, w;
      for (; D--; )
        if (t.events[D][0] === "exit" && t.events[D][1].type === "chunkFlow") {
          w = t.events[D][1].end;
          break;
        }
      k(r);
      let O = z;
      for (; O < t.events.length; )
        t.events[O][1].end = {
          ...w
        }, O++;
      return le(t.events, D + 1, 0, t.events.slice(z)), t.events.length = O, s(E);
    }
    return a(E);
  }
  function s(E) {
    if (r === n.length) {
      if (!i)
        return p(E);
      if (i.currentConstruct && i.currentConstruct.concrete)
        return g(E);
      t.interrupt = !!(i.currentConstruct && !i._gfmTableDynamicInterruptHack);
    }
    return t.containerState = {}, e.check(Rt, f, c)(E);
  }
  function f(E) {
    return i && A(), k(r), p(E);
  }
  function c(E) {
    return t.parser.lazy[t.now().line] = r !== n.length, l = t.now().offset, g(E);
  }
  function p(E) {
    return t.containerState = {}, e.attempt(Rt, h, g)(E);
  }
  function h(E) {
    return r++, n.push([t.currentConstruct, t.containerState]), p(E);
  }
  function g(E) {
    if (E === null) {
      i && A(), k(0), e.consume(E);
      return;
    }
    return i = i || t.parser.flow(t.now()), e.enter("chunkFlow", {
      _tokenizer: i,
      contentType: "flow",
      previous: o
    }), x(E);
  }
  function x(E) {
    if (E === null) {
      S(e.exit("chunkFlow"), !0), k(0), e.consume(E);
      return;
    }
    return v(E) ? (e.consume(E), S(e.exit("chunkFlow")), r = 0, t.interrupt = void 0, a) : (e.consume(E), x);
  }
  function S(E, z) {
    const D = t.sliceStream(E);
    if (z && D.push(null), E.previous = o, o && (o.next = E), o = E, i.defineSkip(E.start), i.write(D), t.parser.lazy[E.start.line]) {
      let w = i.events.length;
      for (; w--; )
        if (
          // The token starts before the line ending…
          i.events[w][1].start.offset < l && // …and either is not ended yet…
          (!i.events[w][1].end || // …or ends after it.
          i.events[w][1].end.offset > l)
        )
          return;
      const O = t.events.length;
      let q = O, j, y;
      for (; q--; )
        if (t.events[q][0] === "exit" && t.events[q][1].type === "chunkFlow") {
          if (j) {
            y = t.events[q][1].end;
            break;
          }
          j = !0;
        }
      for (k(r), w = O; w < t.events.length; )
        t.events[w][1].end = {
          ...y
        }, w++;
      le(t.events, q + 1, 0, t.events.slice(O)), t.events.length = w;
    }
  }
  function k(E) {
    let z = n.length;
    for (; z-- > E; ) {
      const D = n[z];
      t.containerState = D[1], D[0].exit.call(t, e);
    }
    n.length = E;
  }
  function A() {
    i.write([null]), o = void 0, i = void 0, t.containerState._closeFlow = void 0;
  }
}
function xo(e, t, n) {
  return M(e, e.attempt(this.parser.constructs.document, t, n), "linePrefix", this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
}
function Me(e) {
  if (e === null || $(e) || Te(e))
    return 1;
  if (hn(e))
    return 2;
}
function pn(e, t, n) {
  const r = [];
  let i = -1;
  for (; ++i < e.length; ) {
    const o = e[i].resolveAll;
    o && !r.includes(o) && (t = o(t, n), r.push(o));
  }
  return t;
}
const jn = {
  name: "attention",
  resolveAll: bo,
  tokenize: wo
};
function bo(e, t) {
  let n = -1, r, i, o, l, a, u, s, f;
  for (; ++n < e.length; )
    if (e[n][0] === "enter" && e[n][1].type === "attentionSequence" && e[n][1]._close) {
      for (r = n; r--; )
        if (e[r][0] === "exit" && e[r][1].type === "attentionSequence" && e[r][1]._open && // If the markers are the same:
        t.sliceSerialize(e[r][1]).charCodeAt(0) === t.sliceSerialize(e[n][1]).charCodeAt(0)) {
          if ((e[r][1]._close || e[n][1]._open) && (e[n][1].end.offset - e[n][1].start.offset) % 3 && !((e[r][1].end.offset - e[r][1].start.offset + e[n][1].end.offset - e[n][1].start.offset) % 3))
            continue;
          u = e[r][1].end.offset - e[r][1].start.offset > 1 && e[n][1].end.offset - e[n][1].start.offset > 1 ? 2 : 1;
          const c = {
            ...e[r][1].end
          }, p = {
            ...e[n][1].start
          };
          Mt(c, -u), Mt(p, u), l = {
            type: u > 1 ? "strongSequence" : "emphasisSequence",
            start: c,
            end: {
              ...e[r][1].end
            }
          }, a = {
            type: u > 1 ? "strongSequence" : "emphasisSequence",
            start: {
              ...e[n][1].start
            },
            end: p
          }, o = {
            type: u > 1 ? "strongText" : "emphasisText",
            start: {
              ...e[r][1].end
            },
            end: {
              ...e[n][1].start
            }
          }, i = {
            type: u > 1 ? "strong" : "emphasis",
            start: {
              ...l.start
            },
            end: {
              ...a.end
            }
          }, e[r][1].end = {
            ...l.start
          }, e[n][1].start = {
            ...a.end
          }, s = [], e[r][1].end.offset - e[r][1].start.offset && (s = oe(s, [["enter", e[r][1], t], ["exit", e[r][1], t]])), s = oe(s, [["enter", i, t], ["enter", l, t], ["exit", l, t], ["enter", o, t]]), s = oe(s, pn(t.parser.constructs.insideSpan.null, e.slice(r + 1, n), t)), s = oe(s, [["exit", o, t], ["enter", a, t], ["exit", a, t], ["exit", i, t]]), e[n][1].end.offset - e[n][1].start.offset ? (f = 2, s = oe(s, [["enter", e[n][1], t], ["exit", e[n][1], t]])) : f = 0, le(e, r - 1, n - r + 3, s), n = r + s.length - f - 2;
          break;
        }
    }
  for (n = -1; ++n < e.length; )
    e[n][1].type === "attentionSequence" && (e[n][1].type = "data");
  return e;
}
function wo(e, t) {
  const n = this.parser.constructs.attentionMarkers.null, r = this.previous, i = Me(r);
  let o;
  return l;
  function l(u) {
    return o = u, e.enter("attentionSequence"), a(u);
  }
  function a(u) {
    if (u === o)
      return e.consume(u), a;
    const s = e.exit("attentionSequence"), f = Me(u), c = !f || f === 2 && i || n.includes(u), p = !i || i === 2 && f || n.includes(r);
    return s._open = !!(o === 42 ? c : c && (i || !p)), s._close = !!(o === 42 ? p : p && (f || !c)), t(u);
  }
}
function Mt(e, t) {
  e.column += t, e.offset += t, e._bufferIndex += t;
}
const Co = {
  name: "autolink",
  tokenize: So
};
function So(e, t, n) {
  let r = 0;
  return i;
  function i(h) {
    return e.enter("autolink"), e.enter("autolinkMarker"), e.consume(h), e.exit("autolinkMarker"), e.enter("autolinkProtocol"), o;
  }
  function o(h) {
    return ee(h) ? (e.consume(h), l) : h === 64 ? n(h) : s(h);
  }
  function l(h) {
    return h === 43 || h === 45 || h === 46 || J(h) ? (r = 1, a(h)) : s(h);
  }
  function a(h) {
    return h === 58 ? (e.consume(h), r = 0, u) : (h === 43 || h === 45 || h === 46 || J(h)) && r++ < 32 ? (e.consume(h), a) : (r = 0, s(h));
  }
  function u(h) {
    return h === 62 ? (e.exit("autolinkProtocol"), e.enter("autolinkMarker"), e.consume(h), e.exit("autolinkMarker"), e.exit("autolink"), t) : h === null || h === 32 || h === 60 || an(h) ? n(h) : (e.consume(h), u);
  }
  function s(h) {
    return h === 64 ? (e.consume(h), f) : fo(h) ? (e.consume(h), s) : n(h);
  }
  function f(h) {
    return J(h) ? c(h) : n(h);
  }
  function c(h) {
    return h === 46 ? (e.consume(h), r = 0, f) : h === 62 ? (e.exit("autolinkProtocol").type = "autolinkEmail", e.enter("autolinkMarker"), e.consume(h), e.exit("autolinkMarker"), e.exit("autolink"), t) : p(h);
  }
  function p(h) {
    if ((h === 45 || J(h)) && r++ < 63) {
      const g = h === 45 ? p : c;
      return e.consume(h), g;
    }
    return n(h);
  }
}
const Qe = {
  partial: !0,
  tokenize: Eo
};
function Eo(e, t, n) {
  return r;
  function r(o) {
    return F(o) ? M(e, i, "linePrefix")(o) : i(o);
  }
  function i(o) {
    return o === null || v(o) ? t(o) : n(o);
  }
}
const Nr = {
  continuation: {
    tokenize: Ao
  },
  exit: To,
  name: "blockQuote",
  tokenize: Io
};
function Io(e, t, n) {
  const r = this;
  return i;
  function i(l) {
    if (l === 62) {
      const a = r.containerState;
      return a.open || (e.enter("blockQuote", {
        _container: !0
      }), a.open = !0), e.enter("blockQuotePrefix"), e.enter("blockQuoteMarker"), e.consume(l), e.exit("blockQuoteMarker"), o;
    }
    return n(l);
  }
  function o(l) {
    return F(l) ? (e.enter("blockQuotePrefixWhitespace"), e.consume(l), e.exit("blockQuotePrefixWhitespace"), e.exit("blockQuotePrefix"), t) : (e.exit("blockQuotePrefix"), t(l));
  }
}
function Ao(e, t, n) {
  const r = this;
  return i;
  function i(l) {
    return F(l) ? M(e, o, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(l) : o(l);
  }
  function o(l) {
    return e.attempt(Nr, t, n)(l);
  }
}
function To(e) {
  e.exit("blockQuote");
}
const Br = {
  name: "characterEscape",
  tokenize: _o
};
function _o(e, t, n) {
  return r;
  function r(o) {
    return e.enter("characterEscape"), e.enter("escapeMarker"), e.consume(o), e.exit("escapeMarker"), i;
  }
  function i(o) {
    return po(o) ? (e.enter("characterEscapeValue"), e.consume(o), e.exit("characterEscapeValue"), e.exit("characterEscape"), t) : n(o);
  }
}
const jr = {
  name: "characterReference",
  tokenize: vo
};
function vo(e, t, n) {
  const r = this;
  let i = 0, o, l;
  return a;
  function a(c) {
    return e.enter("characterReference"), e.enter("characterReferenceMarker"), e.consume(c), e.exit("characterReferenceMarker"), u;
  }
  function u(c) {
    return c === 35 ? (e.enter("characterReferenceMarkerNumeric"), e.consume(c), e.exit("characterReferenceMarkerNumeric"), s) : (e.enter("characterReferenceValue"), o = 31, l = J, f(c));
  }
  function s(c) {
    return c === 88 || c === 120 ? (e.enter("characterReferenceMarkerHexadecimal"), e.consume(c), e.exit("characterReferenceMarkerHexadecimal"), e.enter("characterReferenceValue"), o = 6, l = ho, f) : (e.enter("characterReferenceValue"), o = 7, l = Bn, f(c));
  }
  function f(c) {
    if (c === 59 && i) {
      const p = e.exit("characterReferenceValue");
      return l === J && !nt(r.sliceSerialize(p)) ? n(c) : (e.enter("characterReferenceMarker"), e.consume(c), e.exit("characterReferenceMarker"), e.exit("characterReference"), t);
    }
    return l(c) && i++ < o ? (e.consume(c), f) : n(c);
  }
}
const Ot = {
  partial: !0,
  tokenize: Po
}, Nt = {
  concrete: !0,
  name: "codeFenced",
  tokenize: Lo
};
function Lo(e, t, n) {
  const r = this, i = {
    partial: !0,
    tokenize: D
  };
  let o = 0, l = 0, a;
  return u;
  function u(w) {
    return s(w);
  }
  function s(w) {
    const O = r.events[r.events.length - 1];
    return o = O && O[1].type === "linePrefix" ? O[2].sliceSerialize(O[1], !0).length : 0, a = w, e.enter("codeFenced"), e.enter("codeFencedFence"), e.enter("codeFencedFenceSequence"), f(w);
  }
  function f(w) {
    return w === a ? (l++, e.consume(w), f) : l < 3 ? n(w) : (e.exit("codeFencedFenceSequence"), F(w) ? M(e, c, "whitespace")(w) : c(w));
  }
  function c(w) {
    return w === null || v(w) ? (e.exit("codeFencedFence"), r.interrupt ? t(w) : e.check(Ot, x, z)(w)) : (e.enter("codeFencedFenceInfo"), e.enter("chunkString", {
      contentType: "string"
    }), p(w));
  }
  function p(w) {
    return w === null || v(w) ? (e.exit("chunkString"), e.exit("codeFencedFenceInfo"), c(w)) : F(w) ? (e.exit("chunkString"), e.exit("codeFencedFenceInfo"), M(e, h, "whitespace")(w)) : w === 96 && w === a ? n(w) : (e.consume(w), p);
  }
  function h(w) {
    return w === null || v(w) ? c(w) : (e.enter("codeFencedFenceMeta"), e.enter("chunkString", {
      contentType: "string"
    }), g(w));
  }
  function g(w) {
    return w === null || v(w) ? (e.exit("chunkString"), e.exit("codeFencedFenceMeta"), c(w)) : w === 96 && w === a ? n(w) : (e.consume(w), g);
  }
  function x(w) {
    return e.attempt(i, z, S)(w);
  }
  function S(w) {
    return e.enter("lineEnding"), e.consume(w), e.exit("lineEnding"), k;
  }
  function k(w) {
    return o > 0 && F(w) ? M(e, A, "linePrefix", o + 1)(w) : A(w);
  }
  function A(w) {
    return w === null || v(w) ? e.check(Ot, x, z)(w) : (e.enter("codeFlowValue"), E(w));
  }
  function E(w) {
    return w === null || v(w) ? (e.exit("codeFlowValue"), A(w)) : (e.consume(w), E);
  }
  function z(w) {
    return e.exit("codeFenced"), t(w);
  }
  function D(w, O, q) {
    let j = 0;
    return y;
    function y(N) {
      return w.enter("lineEnding"), w.consume(N), w.exit("lineEnding"), T;
    }
    function T(N) {
      return w.enter("codeFencedFence"), F(N) ? M(w, _, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(N) : _(N);
    }
    function _(N) {
      return N === a ? (w.enter("codeFencedFenceSequence"), H(N)) : q(N);
    }
    function H(N) {
      return N === a ? (j++, w.consume(N), H) : j >= l ? (w.exit("codeFencedFenceSequence"), F(N) ? M(w, W, "whitespace")(N) : W(N)) : q(N);
    }
    function W(N) {
      return N === null || v(N) ? (w.exit("codeFencedFence"), O(N)) : q(N);
    }
  }
}
function Po(e, t, n) {
  const r = this;
  return i;
  function i(l) {
    return l === null ? n(l) : (e.enter("lineEnding"), e.consume(l), e.exit("lineEnding"), o);
  }
  function o(l) {
    return r.parser.lazy[r.now().line] ? n(l) : t(l);
  }
}
const xn = {
  name: "codeIndented",
  tokenize: Do
}, zo = {
  partial: !0,
  tokenize: Fo
};
function Do(e, t, n) {
  const r = this;
  return i;
  function i(s) {
    return e.enter("codeIndented"), M(e, o, "linePrefix", 5)(s);
  }
  function o(s) {
    const f = r.events[r.events.length - 1];
    return f && f[1].type === "linePrefix" && f[2].sliceSerialize(f[1], !0).length >= 4 ? l(s) : n(s);
  }
  function l(s) {
    return s === null ? u(s) : v(s) ? e.attempt(zo, l, u)(s) : (e.enter("codeFlowValue"), a(s));
  }
  function a(s) {
    return s === null || v(s) ? (e.exit("codeFlowValue"), l(s)) : (e.consume(s), a);
  }
  function u(s) {
    return e.exit("codeIndented"), t(s);
  }
}
function Fo(e, t, n) {
  const r = this;
  return i;
  function i(l) {
    return r.parser.lazy[r.now().line] ? n(l) : v(l) ? (e.enter("lineEnding"), e.consume(l), e.exit("lineEnding"), i) : M(e, o, "linePrefix", 5)(l);
  }
  function o(l) {
    const a = r.events[r.events.length - 1];
    return a && a[1].type === "linePrefix" && a[2].sliceSerialize(a[1], !0).length >= 4 ? t(l) : v(l) ? i(l) : n(l);
  }
}
const Ro = {
  name: "codeText",
  previous: Oo,
  resolve: Mo,
  tokenize: No
};
function Mo(e) {
  let t = e.length - 4, n = 3, r, i;
  if ((e[n][1].type === "lineEnding" || e[n][1].type === "space") && (e[t][1].type === "lineEnding" || e[t][1].type === "space")) {
    for (r = n; ++r < t; )
      if (e[r][1].type === "codeTextData") {
        e[n][1].type = "codeTextPadding", e[t][1].type = "codeTextPadding", n += 2, t -= 2;
        break;
      }
  }
  for (r = n - 1, t++; ++r <= t; )
    i === void 0 ? r !== t && e[r][1].type !== "lineEnding" && (i = r) : (r === t || e[r][1].type === "lineEnding") && (e[i][1].type = "codeTextData", r !== i + 2 && (e[i][1].end = e[r - 1][1].end, e.splice(i + 2, r - i - 2), t -= r - i - 2, r = i + 2), i = void 0);
  return e;
}
function Oo(e) {
  return e !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
}
function No(e, t, n) {
  let r = 0, i, o;
  return l;
  function l(c) {
    return e.enter("codeText"), e.enter("codeTextSequence"), a(c);
  }
  function a(c) {
    return c === 96 ? (e.consume(c), r++, a) : (e.exit("codeTextSequence"), u(c));
  }
  function u(c) {
    return c === null ? n(c) : c === 32 ? (e.enter("space"), e.consume(c), e.exit("space"), u) : c === 96 ? (o = e.enter("codeTextSequence"), i = 0, f(c)) : v(c) ? (e.enter("lineEnding"), e.consume(c), e.exit("lineEnding"), u) : (e.enter("codeTextData"), s(c));
  }
  function s(c) {
    return c === null || c === 32 || c === 96 || v(c) ? (e.exit("codeTextData"), u(c)) : (e.consume(c), s);
  }
  function f(c) {
    return c === 96 ? (e.consume(c), i++, f) : i === r ? (e.exit("codeTextSequence"), e.exit("codeText"), t(c)) : (o.type = "codeTextData", s(c));
  }
}
class Bo {
  /**
   * @param {ReadonlyArray<T> | null | undefined} [initial]
   *   Initial items (optional).
   * @returns
   *   Splice buffer.
   */
  constructor(t) {
    this.left = t ? [...t] : [], this.right = [];
  }
  /**
   * Array access;
   * does not move the cursor.
   *
   * @param {number} index
   *   Index.
   * @return {T}
   *   Item.
   */
  get(t) {
    if (t < 0 || t >= this.left.length + this.right.length)
      throw new RangeError("Cannot access index `" + t + "` in a splice buffer of size `" + (this.left.length + this.right.length) + "`");
    return t < this.left.length ? this.left[t] : this.right[this.right.length - t + this.left.length - 1];
  }
  /**
   * The length of the splice buffer, one greater than the largest index in the
   * array.
   */
  get length() {
    return this.left.length + this.right.length;
  }
  /**
   * Remove and return `list[0]`;
   * moves the cursor to `0`.
   *
   * @returns {T | undefined}
   *   Item, optional.
   */
  shift() {
    return this.setCursor(0), this.right.pop();
  }
  /**
   * Slice the buffer to get an array;
   * does not move the cursor.
   *
   * @param {number} start
   *   Start.
   * @param {number | null | undefined} [end]
   *   End (optional).
   * @returns {Array<T>}
   *   Array of items.
   */
  slice(t, n) {
    const r = n ?? Number.POSITIVE_INFINITY;
    return r < this.left.length ? this.left.slice(t, r) : t > this.left.length ? this.right.slice(this.right.length - r + this.left.length, this.right.length - t + this.left.length).reverse() : this.left.slice(t).concat(this.right.slice(this.right.length - r + this.left.length).reverse());
  }
  /**
   * Mimics the behavior of Array.prototype.splice() except for the change of
   * interface necessary to avoid segfaults when patching in very large arrays.
   *
   * This operation moves cursor is moved to `start` and results in the cursor
   * placed after any inserted items.
   *
   * @param {number} start
   *   Start;
   *   zero-based index at which to start changing the array;
   *   negative numbers count backwards from the end of the array and values
   *   that are out-of bounds are clamped to the appropriate end of the array.
   * @param {number | null | undefined} [deleteCount=0]
   *   Delete count (default: `0`);
   *   maximum number of elements to delete, starting from start.
   * @param {Array<T> | null | undefined} [items=[]]
   *   Items to include in place of the deleted items (default: `[]`).
   * @return {Array<T>}
   *   Any removed items.
   */
  splice(t, n, r) {
    const i = n || 0;
    this.setCursor(Math.trunc(t));
    const o = this.right.splice(this.right.length - i, Number.POSITIVE_INFINITY);
    return r && Ue(this.left, r), o.reverse();
  }
  /**
   * Remove and return the highest-numbered item in the array, so
   * `list[list.length - 1]`;
   * Moves the cursor to `length`.
   *
   * @returns {T | undefined}
   *   Item, optional.
   */
  pop() {
    return this.setCursor(Number.POSITIVE_INFINITY), this.left.pop();
  }
  /**
   * Inserts a single item to the high-numbered side of the array;
   * moves the cursor to `length`.
   *
   * @param {T} item
   *   Item.
   * @returns {undefined}
   *   Nothing.
   */
  push(t) {
    this.setCursor(Number.POSITIVE_INFINITY), this.left.push(t);
  }
  /**
   * Inserts many items to the high-numbered side of the array.
   * Moves the cursor to `length`.
   *
   * @param {Array<T>} items
   *   Items.
   * @returns {undefined}
   *   Nothing.
   */
  pushMany(t) {
    this.setCursor(Number.POSITIVE_INFINITY), Ue(this.left, t);
  }
  /**
   * Inserts a single item to the low-numbered side of the array;
   * Moves the cursor to `0`.
   *
   * @param {T} item
   *   Item.
   * @returns {undefined}
   *   Nothing.
   */
  unshift(t) {
    this.setCursor(0), this.right.push(t);
  }
  /**
   * Inserts many items to the low-numbered side of the array;
   * moves the cursor to `0`.
   *
   * @param {Array<T>} items
   *   Items.
   * @returns {undefined}
   *   Nothing.
   */
  unshiftMany(t) {
    this.setCursor(0), Ue(this.right, t.reverse());
  }
  /**
   * Move the cursor to a specific position in the array. Requires
   * time proportional to the distance moved.
   *
   * If `n < 0`, the cursor will end up at the beginning.
   * If `n > length`, the cursor will end up at the end.
   *
   * @param {number} n
   *   Position.
   * @return {undefined}
   *   Nothing.
   */
  setCursor(t) {
    if (!(t === this.left.length || t > this.left.length && this.right.length === 0 || t < 0 && this.left.length === 0))
      if (t < this.left.length) {
        const n = this.left.splice(t, Number.POSITIVE_INFINITY);
        Ue(this.right, n.reverse());
      } else {
        const n = this.right.splice(this.left.length + this.right.length - t, Number.POSITIVE_INFINITY);
        Ue(this.left, n.reverse());
      }
  }
}
function Ue(e, t) {
  let n = 0;
  if (t.length < 1e4)
    e.push(...t);
  else
    for (; n < t.length; )
      e.push(...t.slice(n, n + 1e4)), n += 1e4;
}
function Hr(e) {
  const t = {};
  let n = -1, r, i, o, l, a, u, s;
  const f = new Bo(e);
  for (; ++n < f.length; ) {
    for (; n in t; )
      n = t[n];
    if (r = f.get(n), n && r[1].type === "chunkFlow" && f.get(n - 1)[1].type === "listItemPrefix" && (u = r[1]._tokenizer.events, o = 0, o < u.length && u[o][1].type === "lineEndingBlank" && (o += 2), o < u.length && u[o][1].type === "content"))
      for (; ++o < u.length && u[o][1].type !== "content"; )
        u[o][1].type === "chunkText" && (u[o][1]._isInFirstContentOfListItem = !0, o++);
    if (r[0] === "enter")
      r[1].contentType && (Object.assign(t, jo(f, n)), n = t[n], s = !0);
    else if (r[1]._container) {
      for (o = n, i = void 0; o--; )
        if (l = f.get(o), l[1].type === "lineEnding" || l[1].type === "lineEndingBlank")
          l[0] === "enter" && (i && (f.get(i)[1].type = "lineEndingBlank"), l[1].type = "lineEnding", i = o);
        else if (!(l[1].type === "linePrefix" || l[1].type === "listItemIndent")) break;
      i && (r[1].end = {
        ...f.get(i)[1].start
      }, a = f.slice(i, n), a.unshift(r), f.splice(i, n - i + 1, a));
    }
  }
  return le(e, 0, Number.POSITIVE_INFINITY, f.slice(0)), !s;
}
function jo(e, t) {
  const n = e.get(t)[1], r = e.get(t)[2];
  let i = t - 1;
  const o = [];
  let l = n._tokenizer;
  l || (l = r.parser[n.contentType](n.start), n._contentTypeTextTrailing && (l._contentTypeTextTrailing = !0));
  const a = l.events, u = [], s = {};
  let f, c, p = -1, h = n, g = 0, x = 0;
  const S = [x];
  for (; h; ) {
    for (; e.get(++i)[1] !== h; )
      ;
    o.push(i), h._tokenizer || (f = r.sliceStream(h), h.next || f.push(null), c && l.defineSkip(h.start), h._isInFirstContentOfListItem && (l._gfmTasklistFirstContentOfListItem = !0), l.write(f), h._isInFirstContentOfListItem && (l._gfmTasklistFirstContentOfListItem = void 0)), c = h, h = h.next;
  }
  for (h = n; ++p < a.length; )
    // Find a void token that includes a break.
    a[p][0] === "exit" && a[p - 1][0] === "enter" && a[p][1].type === a[p - 1][1].type && a[p][1].start.line !== a[p][1].end.line && (x = p + 1, S.push(x), h._tokenizer = void 0, h.previous = void 0, h = h.next);
  for (l.events = [], h ? (h._tokenizer = void 0, h.previous = void 0) : S.pop(), p = S.length; p--; ) {
    const k = a.slice(S[p], S[p + 1]), A = o.pop();
    u.push([A, A + k.length - 1]), e.splice(A, 2, k);
  }
  for (u.reverse(), p = -1; ++p < u.length; )
    s[g + u[p][0]] = g + u[p][1], g += u[p][1] - u[p][0] - 1;
  return s;
}
const Ho = {
  resolve: $o,
  tokenize: Vo
}, Uo = {
  partial: !0,
  tokenize: qo
};
function $o(e) {
  return Hr(e), e;
}
function Vo(e, t) {
  let n;
  return r;
  function r(a) {
    return e.enter("content"), n = e.enter("chunkContent", {
      contentType: "content"
    }), i(a);
  }
  function i(a) {
    return a === null ? o(a) : v(a) ? e.check(Uo, l, o)(a) : (e.consume(a), i);
  }
  function o(a) {
    return e.exit("chunkContent"), e.exit("content"), t(a);
  }
  function l(a) {
    return e.consume(a), e.exit("chunkContent"), n.next = e.enter("chunkContent", {
      contentType: "content",
      previous: n
    }), n = n.next, i;
  }
}
function qo(e, t, n) {
  const r = this;
  return i;
  function i(l) {
    return e.exit("chunkContent"), e.enter("lineEnding"), e.consume(l), e.exit("lineEnding"), M(e, o, "linePrefix");
  }
  function o(l) {
    if (l === null || v(l))
      return n(l);
    const a = r.events[r.events.length - 1];
    return !r.parser.constructs.disable.null.includes("codeIndented") && a && a[1].type === "linePrefix" && a[2].sliceSerialize(a[1], !0).length >= 4 ? t(l) : e.interrupt(r.parser.constructs.flow, n, t)(l);
  }
}
function Ur(e, t, n, r, i, o, l, a, u) {
  const s = u || Number.POSITIVE_INFINITY;
  let f = 0;
  return c;
  function c(k) {
    return k === 60 ? (e.enter(r), e.enter(i), e.enter(o), e.consume(k), e.exit(o), p) : k === null || k === 32 || k === 41 || an(k) ? n(k) : (e.enter(r), e.enter(l), e.enter(a), e.enter("chunkString", {
      contentType: "string"
    }), x(k));
  }
  function p(k) {
    return k === 62 ? (e.enter(o), e.consume(k), e.exit(o), e.exit(i), e.exit(r), t) : (e.enter(a), e.enter("chunkString", {
      contentType: "string"
    }), h(k));
  }
  function h(k) {
    return k === 62 ? (e.exit("chunkString"), e.exit(a), p(k)) : k === null || k === 60 || v(k) ? n(k) : (e.consume(k), k === 92 ? g : h);
  }
  function g(k) {
    return k === 60 || k === 62 || k === 92 ? (e.consume(k), h) : h(k);
  }
  function x(k) {
    return !f && (k === null || k === 41 || $(k)) ? (e.exit("chunkString"), e.exit(a), e.exit(l), e.exit(r), t(k)) : f < s && k === 40 ? (e.consume(k), f++, x) : k === 41 ? (e.consume(k), f--, x) : k === null || k === 32 || k === 40 || an(k) ? n(k) : (e.consume(k), k === 92 ? S : x);
  }
  function S(k) {
    return k === 40 || k === 41 || k === 92 ? (e.consume(k), x) : x(k);
  }
}
function $r(e, t, n, r, i, o) {
  const l = this;
  let a = 0, u;
  return s;
  function s(h) {
    return e.enter(r), e.enter(i), e.consume(h), e.exit(i), e.enter(o), f;
  }
  function f(h) {
    return a > 999 || h === null || h === 91 || h === 93 && !u || // To do: remove in the future once we’ve switched from
    // `micromark-extension-footnote` to `micromark-extension-gfm-footnote`,
    // which doesn’t need this.
    // Hidden footnotes hook.
    /* c8 ignore next 3 */
    h === 94 && !a && "_hiddenFootnoteSupport" in l.parser.constructs ? n(h) : h === 93 ? (e.exit(o), e.enter(i), e.consume(h), e.exit(i), e.exit(r), t) : v(h) ? (e.enter("lineEnding"), e.consume(h), e.exit("lineEnding"), f) : (e.enter("chunkString", {
      contentType: "string"
    }), c(h));
  }
  function c(h) {
    return h === null || h === 91 || h === 93 || v(h) || a++ > 999 ? (e.exit("chunkString"), f(h)) : (e.consume(h), u || (u = !F(h)), h === 92 ? p : c);
  }
  function p(h) {
    return h === 91 || h === 92 || h === 93 ? (e.consume(h), a++, c) : c(h);
  }
}
function Vr(e, t, n, r, i, o) {
  let l;
  return a;
  function a(p) {
    return p === 34 || p === 39 || p === 40 ? (e.enter(r), e.enter(i), e.consume(p), e.exit(i), l = p === 40 ? 41 : p, u) : n(p);
  }
  function u(p) {
    return p === l ? (e.enter(i), e.consume(p), e.exit(i), e.exit(r), t) : (e.enter(o), s(p));
  }
  function s(p) {
    return p === l ? (e.exit(o), u(l)) : p === null ? n(p) : v(p) ? (e.enter("lineEnding"), e.consume(p), e.exit("lineEnding"), M(e, s, "linePrefix")) : (e.enter("chunkString", {
      contentType: "string"
    }), f(p));
  }
  function f(p) {
    return p === l || p === null || v(p) ? (e.exit("chunkString"), s(p)) : (e.consume(p), p === 92 ? c : f);
  }
  function c(p) {
    return p === l || p === 92 ? (e.consume(p), f) : f(p);
  }
}
function qe(e, t) {
  let n;
  return r;
  function r(i) {
    return v(i) ? (e.enter("lineEnding"), e.consume(i), e.exit("lineEnding"), n = !0, r) : F(i) ? M(e, r, n ? "linePrefix" : "lineSuffix")(i) : t(i);
  }
}
const Wo = {
  name: "definition",
  tokenize: Yo
}, Go = {
  partial: !0,
  tokenize: Xo
};
function Yo(e, t, n) {
  const r = this;
  let i;
  return o;
  function o(h) {
    return e.enter("definition"), l(h);
  }
  function l(h) {
    return $r.call(
      r,
      e,
      a,
      // Note: we don’t need to reset the way `markdown-rs` does.
      n,
      "definitionLabel",
      "definitionLabelMarker",
      "definitionLabelString"
    )(h);
  }
  function a(h) {
    return i = fe(r.sliceSerialize(r.events[r.events.length - 1][1]).slice(1, -1)), h === 58 ? (e.enter("definitionMarker"), e.consume(h), e.exit("definitionMarker"), u) : n(h);
  }
  function u(h) {
    return $(h) ? qe(e, s)(h) : s(h);
  }
  function s(h) {
    return Ur(
      e,
      f,
      // Note: we don’t need to reset the way `markdown-rs` does.
      n,
      "definitionDestination",
      "definitionDestinationLiteral",
      "definitionDestinationLiteralMarker",
      "definitionDestinationRaw",
      "definitionDestinationString"
    )(h);
  }
  function f(h) {
    return e.attempt(Go, c, c)(h);
  }
  function c(h) {
    return F(h) ? M(e, p, "whitespace")(h) : p(h);
  }
  function p(h) {
    return h === null || v(h) ? (e.exit("definition"), r.parser.defined.push(i), t(h)) : n(h);
  }
}
function Xo(e, t, n) {
  return r;
  function r(a) {
    return $(a) ? qe(e, i)(a) : n(a);
  }
  function i(a) {
    return Vr(e, o, n, "definitionTitle", "definitionTitleMarker", "definitionTitleString")(a);
  }
  function o(a) {
    return F(a) ? M(e, l, "whitespace")(a) : l(a);
  }
  function l(a) {
    return a === null || v(a) ? t(a) : n(a);
  }
}
const Qo = {
  name: "hardBreakEscape",
  tokenize: Ko
};
function Ko(e, t, n) {
  return r;
  function r(o) {
    return e.enter("hardBreakEscape"), e.consume(o), i;
  }
  function i(o) {
    return v(o) ? (e.exit("hardBreakEscape"), t(o)) : n(o);
  }
}
const Jo = {
  name: "headingAtx",
  resolve: Zo,
  tokenize: ea
};
function Zo(e, t) {
  let n = e.length - 2, r = 3, i, o;
  return e[r][1].type === "whitespace" && (r += 2), n - 2 > r && e[n][1].type === "whitespace" && (n -= 2), e[n][1].type === "atxHeadingSequence" && (r === n - 1 || n - 4 > r && e[n - 2][1].type === "whitespace") && (n -= r + 1 === n ? 2 : 4), n > r && (i = {
    type: "atxHeadingText",
    start: e[r][1].start,
    end: e[n][1].end
  }, o = {
    type: "chunkText",
    start: e[r][1].start,
    end: e[n][1].end,
    contentType: "text"
  }, le(e, r, n - r + 1, [["enter", i, t], ["enter", o, t], ["exit", o, t], ["exit", i, t]])), e;
}
function ea(e, t, n) {
  let r = 0;
  return i;
  function i(f) {
    return e.enter("atxHeading"), o(f);
  }
  function o(f) {
    return e.enter("atxHeadingSequence"), l(f);
  }
  function l(f) {
    return f === 35 && r++ < 6 ? (e.consume(f), l) : f === null || $(f) ? (e.exit("atxHeadingSequence"), a(f)) : n(f);
  }
  function a(f) {
    return f === 35 ? (e.enter("atxHeadingSequence"), u(f)) : f === null || v(f) ? (e.exit("atxHeading"), t(f)) : F(f) ? M(e, a, "whitespace")(f) : (e.enter("atxHeadingText"), s(f));
  }
  function u(f) {
    return f === 35 ? (e.consume(f), u) : (e.exit("atxHeadingSequence"), a(f));
  }
  function s(f) {
    return f === null || f === 35 || $(f) ? (e.exit("atxHeadingText"), a(f)) : (e.consume(f), s);
  }
}
const na = [
  "address",
  "article",
  "aside",
  "base",
  "basefont",
  "blockquote",
  "body",
  "caption",
  "center",
  "col",
  "colgroup",
  "dd",
  "details",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hr",
  "html",
  "iframe",
  "legend",
  "li",
  "link",
  "main",
  "menu",
  "menuitem",
  "nav",
  "noframes",
  "ol",
  "optgroup",
  "option",
  "p",
  "param",
  "search",
  "section",
  "summary",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "title",
  "tr",
  "track",
  "ul"
], Bt = ["pre", "script", "style", "textarea"], ta = {
  concrete: !0,
  name: "htmlFlow",
  resolveTo: la,
  tokenize: oa
}, ra = {
  partial: !0,
  tokenize: ua
}, ia = {
  partial: !0,
  tokenize: aa
};
function la(e) {
  let t = e.length;
  for (; t-- && !(e[t][0] === "enter" && e[t][1].type === "htmlFlow"); )
    ;
  return t > 1 && e[t - 2][1].type === "linePrefix" && (e[t][1].start = e[t - 2][1].start, e[t + 1][1].start = e[t - 2][1].start, e.splice(t - 2, 2)), e;
}
function oa(e, t, n) {
  const r = this;
  let i, o, l, a, u;
  return s;
  function s(d) {
    return f(d);
  }
  function f(d) {
    return e.enter("htmlFlow"), e.enter("htmlFlowData"), e.consume(d), c;
  }
  function c(d) {
    return d === 33 ? (e.consume(d), p) : d === 47 ? (e.consume(d), o = !0, x) : d === 63 ? (e.consume(d), i = 3, r.interrupt ? t : m) : ee(d) ? (e.consume(d), l = String.fromCharCode(d), S) : n(d);
  }
  function p(d) {
    return d === 45 ? (e.consume(d), i = 2, h) : d === 91 ? (e.consume(d), i = 5, a = 0, g) : ee(d) ? (e.consume(d), i = 4, r.interrupt ? t : m) : n(d);
  }
  function h(d) {
    return d === 45 ? (e.consume(d), r.interrupt ? t : m) : n(d);
  }
  function g(d) {
    const se = "CDATA[";
    return d === se.charCodeAt(a++) ? (e.consume(d), a === se.length ? r.interrupt ? t : _ : g) : n(d);
  }
  function x(d) {
    return ee(d) ? (e.consume(d), l = String.fromCharCode(d), S) : n(d);
  }
  function S(d) {
    if (d === null || d === 47 || d === 62 || $(d)) {
      const se = d === 47, Se = l.toLowerCase();
      return !se && !o && Bt.includes(Se) ? (i = 1, r.interrupt ? t(d) : _(d)) : na.includes(l.toLowerCase()) ? (i = 6, se ? (e.consume(d), k) : r.interrupt ? t(d) : _(d)) : (i = 7, r.interrupt && !r.parser.lazy[r.now().line] ? n(d) : o ? A(d) : E(d));
    }
    return d === 45 || J(d) ? (e.consume(d), l += String.fromCharCode(d), S) : n(d);
  }
  function k(d) {
    return d === 62 ? (e.consume(d), r.interrupt ? t : _) : n(d);
  }
  function A(d) {
    return F(d) ? (e.consume(d), A) : y(d);
  }
  function E(d) {
    return d === 47 ? (e.consume(d), y) : d === 58 || d === 95 || ee(d) ? (e.consume(d), z) : F(d) ? (e.consume(d), E) : y(d);
  }
  function z(d) {
    return d === 45 || d === 46 || d === 58 || d === 95 || J(d) ? (e.consume(d), z) : D(d);
  }
  function D(d) {
    return d === 61 ? (e.consume(d), w) : F(d) ? (e.consume(d), D) : E(d);
  }
  function w(d) {
    return d === null || d === 60 || d === 61 || d === 62 || d === 96 ? n(d) : d === 34 || d === 39 ? (e.consume(d), u = d, O) : F(d) ? (e.consume(d), w) : q(d);
  }
  function O(d) {
    return d === u ? (e.consume(d), u = null, j) : d === null || v(d) ? n(d) : (e.consume(d), O);
  }
  function q(d) {
    return d === null || d === 34 || d === 39 || d === 47 || d === 60 || d === 61 || d === 62 || d === 96 || $(d) ? D(d) : (e.consume(d), q);
  }
  function j(d) {
    return d === 47 || d === 62 || F(d) ? E(d) : n(d);
  }
  function y(d) {
    return d === 62 ? (e.consume(d), T) : n(d);
  }
  function T(d) {
    return d === null || v(d) ? _(d) : F(d) ? (e.consume(d), T) : n(d);
  }
  function _(d) {
    return d === 45 && i === 2 ? (e.consume(d), K) : d === 60 && i === 1 ? (e.consume(d), X) : d === 62 && i === 4 ? (e.consume(d), ue) : d === 63 && i === 3 ? (e.consume(d), m) : d === 93 && i === 5 ? (e.consume(d), me) : v(d) && (i === 6 || i === 7) ? (e.exit("htmlFlowData"), e.check(ra, de, H)(d)) : d === null || v(d) ? (e.exit("htmlFlowData"), H(d)) : (e.consume(d), _);
  }
  function H(d) {
    return e.check(ia, W, de)(d);
  }
  function W(d) {
    return e.enter("lineEnding"), e.consume(d), e.exit("lineEnding"), N;
  }
  function N(d) {
    return d === null || v(d) ? H(d) : (e.enter("htmlFlowData"), _(d));
  }
  function K(d) {
    return d === 45 ? (e.consume(d), m) : _(d);
  }
  function X(d) {
    return d === 47 ? (e.consume(d), l = "", ae) : _(d);
  }
  function ae(d) {
    if (d === 62) {
      const se = l.toLowerCase();
      return Bt.includes(se) ? (e.consume(d), ue) : _(d);
    }
    return ee(d) && l.length < 8 ? (e.consume(d), l += String.fromCharCode(d), ae) : _(d);
  }
  function me(d) {
    return d === 93 ? (e.consume(d), m) : _(d);
  }
  function m(d) {
    return d === 62 ? (e.consume(d), ue) : d === 45 && i === 2 ? (e.consume(d), m) : _(d);
  }
  function ue(d) {
    return d === null || v(d) ? (e.exit("htmlFlowData"), de(d)) : (e.consume(d), ue);
  }
  function de(d) {
    return e.exit("htmlFlow"), t(d);
  }
}
function aa(e, t, n) {
  const r = this;
  return i;
  function i(l) {
    return v(l) ? (e.enter("lineEnding"), e.consume(l), e.exit("lineEnding"), o) : n(l);
  }
  function o(l) {
    return r.parser.lazy[r.now().line] ? n(l) : t(l);
  }
}
function ua(e, t, n) {
  return r;
  function r(i) {
    return e.enter("lineEnding"), e.consume(i), e.exit("lineEnding"), e.attempt(Qe, t, n);
  }
}
const sa = {
  name: "htmlText",
  tokenize: ca
};
function ca(e, t, n) {
  const r = this;
  let i, o, l;
  return a;
  function a(m) {
    return e.enter("htmlText"), e.enter("htmlTextData"), e.consume(m), u;
  }
  function u(m) {
    return m === 33 ? (e.consume(m), s) : m === 47 ? (e.consume(m), D) : m === 63 ? (e.consume(m), E) : ee(m) ? (e.consume(m), q) : n(m);
  }
  function s(m) {
    return m === 45 ? (e.consume(m), f) : m === 91 ? (e.consume(m), o = 0, g) : ee(m) ? (e.consume(m), A) : n(m);
  }
  function f(m) {
    return m === 45 ? (e.consume(m), h) : n(m);
  }
  function c(m) {
    return m === null ? n(m) : m === 45 ? (e.consume(m), p) : v(m) ? (l = c, X(m)) : (e.consume(m), c);
  }
  function p(m) {
    return m === 45 ? (e.consume(m), h) : c(m);
  }
  function h(m) {
    return m === 62 ? K(m) : m === 45 ? p(m) : c(m);
  }
  function g(m) {
    const ue = "CDATA[";
    return m === ue.charCodeAt(o++) ? (e.consume(m), o === ue.length ? x : g) : n(m);
  }
  function x(m) {
    return m === null ? n(m) : m === 93 ? (e.consume(m), S) : v(m) ? (l = x, X(m)) : (e.consume(m), x);
  }
  function S(m) {
    return m === 93 ? (e.consume(m), k) : x(m);
  }
  function k(m) {
    return m === 62 ? K(m) : m === 93 ? (e.consume(m), k) : x(m);
  }
  function A(m) {
    return m === null || m === 62 ? K(m) : v(m) ? (l = A, X(m)) : (e.consume(m), A);
  }
  function E(m) {
    return m === null ? n(m) : m === 63 ? (e.consume(m), z) : v(m) ? (l = E, X(m)) : (e.consume(m), E);
  }
  function z(m) {
    return m === 62 ? K(m) : E(m);
  }
  function D(m) {
    return ee(m) ? (e.consume(m), w) : n(m);
  }
  function w(m) {
    return m === 45 || J(m) ? (e.consume(m), w) : O(m);
  }
  function O(m) {
    return v(m) ? (l = O, X(m)) : F(m) ? (e.consume(m), O) : K(m);
  }
  function q(m) {
    return m === 45 || J(m) ? (e.consume(m), q) : m === 47 || m === 62 || $(m) ? j(m) : n(m);
  }
  function j(m) {
    return m === 47 ? (e.consume(m), K) : m === 58 || m === 95 || ee(m) ? (e.consume(m), y) : v(m) ? (l = j, X(m)) : F(m) ? (e.consume(m), j) : K(m);
  }
  function y(m) {
    return m === 45 || m === 46 || m === 58 || m === 95 || J(m) ? (e.consume(m), y) : T(m);
  }
  function T(m) {
    return m === 61 ? (e.consume(m), _) : v(m) ? (l = T, X(m)) : F(m) ? (e.consume(m), T) : j(m);
  }
  function _(m) {
    return m === null || m === 60 || m === 61 || m === 62 || m === 96 ? n(m) : m === 34 || m === 39 ? (e.consume(m), i = m, H) : v(m) ? (l = _, X(m)) : F(m) ? (e.consume(m), _) : (e.consume(m), W);
  }
  function H(m) {
    return m === i ? (e.consume(m), i = void 0, N) : m === null ? n(m) : v(m) ? (l = H, X(m)) : (e.consume(m), H);
  }
  function W(m) {
    return m === null || m === 34 || m === 39 || m === 60 || m === 61 || m === 96 ? n(m) : m === 47 || m === 62 || $(m) ? j(m) : (e.consume(m), W);
  }
  function N(m) {
    return m === 47 || m === 62 || $(m) ? j(m) : n(m);
  }
  function K(m) {
    return m === 62 ? (e.consume(m), e.exit("htmlTextData"), e.exit("htmlText"), t) : n(m);
  }
  function X(m) {
    return e.exit("htmlTextData"), e.enter("lineEnding"), e.consume(m), e.exit("lineEnding"), ae;
  }
  function ae(m) {
    return F(m) ? M(e, me, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(m) : me(m);
  }
  function me(m) {
    return e.enter("htmlTextData"), l(m);
  }
}
const tt = {
  name: "labelEnd",
  resolveAll: ma,
  resolveTo: da,
  tokenize: ga
}, fa = {
  tokenize: ka
}, ha = {
  tokenize: ya
}, pa = {
  tokenize: xa
};
function ma(e) {
  let t = -1;
  const n = [];
  for (; ++t < e.length; ) {
    const r = e[t][1];
    if (n.push(e[t]), r.type === "labelImage" || r.type === "labelLink" || r.type === "labelEnd") {
      const i = r.type === "labelImage" ? 4 : 2;
      r.type = "data", t += i;
    }
  }
  return e.length !== n.length && le(e, 0, e.length, n), e;
}
function da(e, t) {
  let n = e.length, r = 0, i, o, l, a;
  for (; n--; )
    if (i = e[n][1], o) {
      if (i.type === "link" || i.type === "labelLink" && i._inactive)
        break;
      e[n][0] === "enter" && i.type === "labelLink" && (i._inactive = !0);
    } else if (l) {
      if (e[n][0] === "enter" && (i.type === "labelImage" || i.type === "labelLink") && !i._balanced && (o = n, i.type !== "labelLink")) {
        r = 2;
        break;
      }
    } else i.type === "labelEnd" && (l = n);
  const u = {
    type: e[o][1].type === "labelLink" ? "link" : "image",
    start: {
      ...e[o][1].start
    },
    end: {
      ...e[e.length - 1][1].end
    }
  }, s = {
    type: "label",
    start: {
      ...e[o][1].start
    },
    end: {
      ...e[l][1].end
    }
  }, f = {
    type: "labelText",
    start: {
      ...e[o + r + 2][1].end
    },
    end: {
      ...e[l - 2][1].start
    }
  };
  return a = [["enter", u, t], ["enter", s, t]], a = oe(a, e.slice(o + 1, o + r + 3)), a = oe(a, [["enter", f, t]]), a = oe(a, pn(t.parser.constructs.insideSpan.null, e.slice(o + r + 4, l - 3), t)), a = oe(a, [["exit", f, t], e[l - 2], e[l - 1], ["exit", s, t]]), a = oe(a, e.slice(l + 1)), a = oe(a, [["exit", u, t]]), le(e, o, e.length, a), e;
}
function ga(e, t, n) {
  const r = this;
  let i = r.events.length, o, l;
  for (; i--; )
    if ((r.events[i][1].type === "labelImage" || r.events[i][1].type === "labelLink") && !r.events[i][1]._balanced) {
      o = r.events[i][1];
      break;
    }
  return a;
  function a(p) {
    return o ? o._inactive ? c(p) : (l = r.parser.defined.includes(fe(r.sliceSerialize({
      start: o.end,
      end: r.now()
    }))), e.enter("labelEnd"), e.enter("labelMarker"), e.consume(p), e.exit("labelMarker"), e.exit("labelEnd"), u) : n(p);
  }
  function u(p) {
    return p === 40 ? e.attempt(fa, f, l ? f : c)(p) : p === 91 ? e.attempt(ha, f, l ? s : c)(p) : l ? f(p) : c(p);
  }
  function s(p) {
    return e.attempt(pa, f, c)(p);
  }
  function f(p) {
    return t(p);
  }
  function c(p) {
    return o._balanced = !0, n(p);
  }
}
function ka(e, t, n) {
  return r;
  function r(c) {
    return e.enter("resource"), e.enter("resourceMarker"), e.consume(c), e.exit("resourceMarker"), i;
  }
  function i(c) {
    return $(c) ? qe(e, o)(c) : o(c);
  }
  function o(c) {
    return c === 41 ? f(c) : Ur(e, l, a, "resourceDestination", "resourceDestinationLiteral", "resourceDestinationLiteralMarker", "resourceDestinationRaw", "resourceDestinationString", 32)(c);
  }
  function l(c) {
    return $(c) ? qe(e, u)(c) : f(c);
  }
  function a(c) {
    return n(c);
  }
  function u(c) {
    return c === 34 || c === 39 || c === 40 ? Vr(e, s, n, "resourceTitle", "resourceTitleMarker", "resourceTitleString")(c) : f(c);
  }
  function s(c) {
    return $(c) ? qe(e, f)(c) : f(c);
  }
  function f(c) {
    return c === 41 ? (e.enter("resourceMarker"), e.consume(c), e.exit("resourceMarker"), e.exit("resource"), t) : n(c);
  }
}
function ya(e, t, n) {
  const r = this;
  return i;
  function i(a) {
    return $r.call(r, e, o, l, "reference", "referenceMarker", "referenceString")(a);
  }
  function o(a) {
    return r.parser.defined.includes(fe(r.sliceSerialize(r.events[r.events.length - 1][1]).slice(1, -1))) ? t(a) : n(a);
  }
  function l(a) {
    return n(a);
  }
}
function xa(e, t, n) {
  return r;
  function r(o) {
    return e.enter("reference"), e.enter("referenceMarker"), e.consume(o), e.exit("referenceMarker"), i;
  }
  function i(o) {
    return o === 93 ? (e.enter("referenceMarker"), e.consume(o), e.exit("referenceMarker"), e.exit("reference"), t) : n(o);
  }
}
const ba = {
  name: "labelStartImage",
  resolveAll: tt.resolveAll,
  tokenize: wa
};
function wa(e, t, n) {
  const r = this;
  return i;
  function i(a) {
    return e.enter("labelImage"), e.enter("labelImageMarker"), e.consume(a), e.exit("labelImageMarker"), o;
  }
  function o(a) {
    return a === 91 ? (e.enter("labelMarker"), e.consume(a), e.exit("labelMarker"), e.exit("labelImage"), l) : n(a);
  }
  function l(a) {
    return a === 94 && "_hiddenFootnoteSupport" in r.parser.constructs ? n(a) : t(a);
  }
}
const Ca = {
  name: "labelStartLink",
  resolveAll: tt.resolveAll,
  tokenize: Sa
};
function Sa(e, t, n) {
  const r = this;
  return i;
  function i(l) {
    return e.enter("labelLink"), e.enter("labelMarker"), e.consume(l), e.exit("labelMarker"), e.exit("labelLink"), o;
  }
  function o(l) {
    return l === 94 && "_hiddenFootnoteSupport" in r.parser.constructs ? n(l) : t(l);
  }
}
const bn = {
  name: "lineEnding",
  tokenize: Ea
};
function Ea(e, t) {
  return n;
  function n(r) {
    return e.enter("lineEnding"), e.consume(r), e.exit("lineEnding"), M(e, t, "linePrefix");
  }
}
const rn = {
  name: "thematicBreak",
  tokenize: Ia
};
function Ia(e, t, n) {
  let r = 0, i;
  return o;
  function o(s) {
    return e.enter("thematicBreak"), l(s);
  }
  function l(s) {
    return i = s, a(s);
  }
  function a(s) {
    return s === i ? (e.enter("thematicBreakSequence"), u(s)) : r >= 3 && (s === null || v(s)) ? (e.exit("thematicBreak"), t(s)) : n(s);
  }
  function u(s) {
    return s === i ? (e.consume(s), r++, u) : (e.exit("thematicBreakSequence"), F(s) ? M(e, a, "whitespace")(s) : a(s));
  }
}
const ne = {
  continuation: {
    tokenize: va
  },
  exit: Pa,
  name: "list",
  tokenize: _a
}, Aa = {
  partial: !0,
  tokenize: za
}, Ta = {
  partial: !0,
  tokenize: La
};
function _a(e, t, n) {
  const r = this, i = r.events[r.events.length - 1];
  let o = i && i[1].type === "linePrefix" ? i[2].sliceSerialize(i[1], !0).length : 0, l = 0;
  return a;
  function a(h) {
    const g = r.containerState.type || (h === 42 || h === 43 || h === 45 ? "listUnordered" : "listOrdered");
    if (g === "listUnordered" ? !r.containerState.marker || h === r.containerState.marker : Bn(h)) {
      if (r.containerState.type || (r.containerState.type = g, e.enter(g, {
        _container: !0
      })), g === "listUnordered")
        return e.enter("listItemPrefix"), h === 42 || h === 45 ? e.check(rn, n, s)(h) : s(h);
      if (!r.interrupt || h === 49)
        return e.enter("listItemPrefix"), e.enter("listItemValue"), u(h);
    }
    return n(h);
  }
  function u(h) {
    return Bn(h) && ++l < 10 ? (e.consume(h), u) : (!r.interrupt || l < 2) && (r.containerState.marker ? h === r.containerState.marker : h === 41 || h === 46) ? (e.exit("listItemValue"), s(h)) : n(h);
  }
  function s(h) {
    return e.enter("listItemMarker"), e.consume(h), e.exit("listItemMarker"), r.containerState.marker = r.containerState.marker || h, e.check(
      Qe,
      // Can’t be empty when interrupting.
      r.interrupt ? n : f,
      e.attempt(Aa, p, c)
    );
  }
  function f(h) {
    return r.containerState.initialBlankLine = !0, o++, p(h);
  }
  function c(h) {
    return F(h) ? (e.enter("listItemPrefixWhitespace"), e.consume(h), e.exit("listItemPrefixWhitespace"), p) : n(h);
  }
  function p(h) {
    return r.containerState.size = o + r.sliceSerialize(e.exit("listItemPrefix"), !0).length, t(h);
  }
}
function va(e, t, n) {
  const r = this;
  return r.containerState._closeFlow = void 0, e.check(Qe, i, o);
  function i(a) {
    return r.containerState.furtherBlankLines = r.containerState.furtherBlankLines || r.containerState.initialBlankLine, M(e, t, "listItemIndent", r.containerState.size + 1)(a);
  }
  function o(a) {
    return r.containerState.furtherBlankLines || !F(a) ? (r.containerState.furtherBlankLines = void 0, r.containerState.initialBlankLine = void 0, l(a)) : (r.containerState.furtherBlankLines = void 0, r.containerState.initialBlankLine = void 0, e.attempt(Ta, t, l)(a));
  }
  function l(a) {
    return r.containerState._closeFlow = !0, r.interrupt = void 0, M(e, e.attempt(ne, t, n), "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(a);
  }
}
function La(e, t, n) {
  const r = this;
  return M(e, i, "listItemIndent", r.containerState.size + 1);
  function i(o) {
    const l = r.events[r.events.length - 1];
    return l && l[1].type === "listItemIndent" && l[2].sliceSerialize(l[1], !0).length === r.containerState.size ? t(o) : n(o);
  }
}
function Pa(e) {
  e.exit(this.containerState.type);
}
function za(e, t, n) {
  const r = this;
  return M(e, i, "listItemPrefixWhitespace", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 5);
  function i(o) {
    const l = r.events[r.events.length - 1];
    return !F(o) && l && l[1].type === "listItemPrefixWhitespace" ? t(o) : n(o);
  }
}
const jt = {
  name: "setextUnderline",
  resolveTo: Da,
  tokenize: Fa
};
function Da(e, t) {
  let n = e.length, r, i, o;
  for (; n--; )
    if (e[n][0] === "enter") {
      if (e[n][1].type === "content") {
        r = n;
        break;
      }
      e[n][1].type === "paragraph" && (i = n);
    } else
      e[n][1].type === "content" && e.splice(n, 1), !o && e[n][1].type === "definition" && (o = n);
  const l = {
    type: "setextHeading",
    start: {
      ...e[r][1].start
    },
    end: {
      ...e[e.length - 1][1].end
    }
  };
  return e[i][1].type = "setextHeadingText", o ? (e.splice(i, 0, ["enter", l, t]), e.splice(o + 1, 0, ["exit", e[r][1], t]), e[r][1].end = {
    ...e[o][1].end
  }) : e[r][1] = l, e.push(["exit", l, t]), e;
}
function Fa(e, t, n) {
  const r = this;
  let i;
  return o;
  function o(s) {
    let f = r.events.length, c;
    for (; f--; )
      if (r.events[f][1].type !== "lineEnding" && r.events[f][1].type !== "linePrefix" && r.events[f][1].type !== "content") {
        c = r.events[f][1].type === "paragraph";
        break;
      }
    return !r.parser.lazy[r.now().line] && (r.interrupt || c) ? (e.enter("setextHeadingLine"), i = s, l(s)) : n(s);
  }
  function l(s) {
    return e.enter("setextHeadingLineSequence"), a(s);
  }
  function a(s) {
    return s === i ? (e.consume(s), a) : (e.exit("setextHeadingLineSequence"), F(s) ? M(e, u, "lineSuffix")(s) : u(s));
  }
  function u(s) {
    return s === null || v(s) ? (e.exit("setextHeadingLine"), t(s)) : n(s);
  }
}
const Ra = {
  tokenize: Ma
};
function Ma(e) {
  const t = this, n = e.attempt(
    // Try to parse a blank line.
    Qe,
    r,
    // Try to parse initial flow (essentially, only code).
    e.attempt(this.parser.constructs.flowInitial, i, M(e, e.attempt(this.parser.constructs.flow, i, e.attempt(Ho, i)), "linePrefix"))
  );
  return n;
  function r(o) {
    if (o === null) {
      e.consume(o);
      return;
    }
    return e.enter("lineEndingBlank"), e.consume(o), e.exit("lineEndingBlank"), t.currentConstruct = void 0, n;
  }
  function i(o) {
    if (o === null) {
      e.consume(o);
      return;
    }
    return e.enter("lineEnding"), e.consume(o), e.exit("lineEnding"), t.currentConstruct = void 0, n;
  }
}
const Oa = {
  resolveAll: Wr()
}, Na = qr("string"), Ba = qr("text");
function qr(e) {
  return {
    resolveAll: Wr(e === "text" ? ja : void 0),
    tokenize: t
  };
  function t(n) {
    const r = this, i = this.parser.constructs[e], o = n.attempt(i, l, a);
    return l;
    function l(f) {
      return s(f) ? o(f) : a(f);
    }
    function a(f) {
      if (f === null) {
        n.consume(f);
        return;
      }
      return n.enter("data"), n.consume(f), u;
    }
    function u(f) {
      return s(f) ? (n.exit("data"), o(f)) : (n.consume(f), u);
    }
    function s(f) {
      if (f === null)
        return !0;
      const c = i[f];
      let p = -1;
      if (c)
        for (; ++p < c.length; ) {
          const h = c[p];
          if (!h.previous || h.previous.call(r, r.previous))
            return !0;
        }
      return !1;
    }
  }
}
function Wr(e) {
  return t;
  function t(n, r) {
    let i = -1, o;
    for (; ++i <= n.length; )
      o === void 0 ? n[i] && n[i][1].type === "data" && (o = i, i++) : (!n[i] || n[i][1].type !== "data") && (i !== o + 2 && (n[o][1].end = n[i - 1][1].end, n.splice(o + 2, i - o - 2), i = o + 2), o = void 0);
    return e ? e(n, r) : n;
  }
}
function ja(e, t) {
  let n = 0;
  for (; ++n <= e.length; )
    if ((n === e.length || e[n][1].type === "lineEnding") && e[n - 1][1].type === "data") {
      const r = e[n - 1][1], i = t.sliceStream(r);
      let o = i.length, l = -1, a = 0, u;
      for (; o--; ) {
        const s = i[o];
        if (typeof s == "string") {
          for (l = s.length; s.charCodeAt(l - 1) === 32; )
            a++, l--;
          if (l) break;
          l = -1;
        } else if (s === -2)
          u = !0, a++;
        else if (s !== -1) {
          o++;
          break;
        }
      }
      if (t._contentTypeTextTrailing && n === e.length && (a = 0), a) {
        const s = {
          type: n === e.length || u || a < 2 ? "lineSuffix" : "hardBreakTrailing",
          start: {
            _bufferIndex: o ? l : r.start._bufferIndex + l,
            _index: r.start._index + o,
            line: r.end.line,
            column: r.end.column - a,
            offset: r.end.offset - a
          },
          end: {
            ...r.end
          }
        };
        r.end = {
          ...s.start
        }, r.start.offset === r.end.offset ? Object.assign(r, s) : (e.splice(n, 0, ["enter", s, t], ["exit", s, t]), n += 2);
      }
      n++;
    }
  return e;
}
const Ha = {
  42: ne,
  43: ne,
  45: ne,
  48: ne,
  49: ne,
  50: ne,
  51: ne,
  52: ne,
  53: ne,
  54: ne,
  55: ne,
  56: ne,
  57: ne,
  62: Nr
}, Ua = {
  91: Wo
}, $a = {
  [-2]: xn,
  [-1]: xn,
  32: xn
}, Va = {
  35: Jo,
  42: rn,
  45: [jt, rn],
  60: ta,
  61: jt,
  95: rn,
  96: Nt,
  126: Nt
}, qa = {
  38: jr,
  92: Br
}, Wa = {
  [-5]: bn,
  [-4]: bn,
  [-3]: bn,
  33: ba,
  38: jr,
  42: jn,
  60: [Co, sa],
  91: Ca,
  92: [Qo, Br],
  93: tt,
  95: jn,
  96: Ro
}, Ga = {
  null: [jn, Oa]
}, Ya = {
  null: [42, 95]
}, Xa = {
  null: []
}, Qa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  attentionMarkers: Ya,
  contentInitial: Ua,
  disable: Xa,
  document: Ha,
  flow: Va,
  flowInitial: $a,
  insideSpan: Ga,
  string: qa,
  text: Wa
}, Symbol.toStringTag, { value: "Module" }));
function Ka(e, t, n) {
  let r = {
    _bufferIndex: -1,
    _index: 0,
    line: n && n.line || 1,
    column: n && n.column || 1,
    offset: n && n.offset || 0
  };
  const i = {}, o = [];
  let l = [], a = [];
  const u = {
    attempt: O(D),
    check: O(w),
    consume: A,
    enter: E,
    exit: z,
    interrupt: O(w, {
      interrupt: !0
    })
  }, s = {
    code: null,
    containerState: {},
    defineSkip: x,
    events: [],
    now: g,
    parser: e,
    previous: null,
    sliceSerialize: p,
    sliceStream: h,
    write: c
  };
  let f = t.tokenize.call(s, u);
  return t.resolveAll && o.push(t), s;
  function c(T) {
    return l = oe(l, T), S(), l[l.length - 1] !== null ? [] : (q(t, 0), s.events = pn(o, s.events, s), s.events);
  }
  function p(T, _) {
    return Za(h(T), _);
  }
  function h(T) {
    return Ja(l, T);
  }
  function g() {
    const {
      _bufferIndex: T,
      _index: _,
      line: H,
      column: W,
      offset: N
    } = r;
    return {
      _bufferIndex: T,
      _index: _,
      line: H,
      column: W,
      offset: N
    };
  }
  function x(T) {
    i[T.line] = T.column, y();
  }
  function S() {
    let T;
    for (; r._index < l.length; ) {
      const _ = l[r._index];
      if (typeof _ == "string")
        for (T = r._index, r._bufferIndex < 0 && (r._bufferIndex = 0); r._index === T && r._bufferIndex < _.length; )
          k(_.charCodeAt(r._bufferIndex));
      else
        k(_);
    }
  }
  function k(T) {
    f = f(T);
  }
  function A(T) {
    v(T) ? (r.line++, r.column = 1, r.offset += T === -3 ? 2 : 1, y()) : T !== -1 && (r.column++, r.offset++), r._bufferIndex < 0 ? r._index++ : (r._bufferIndex++, r._bufferIndex === // Points w/ non-negative `_bufferIndex` reference
    // strings.
    /** @type {string} */
    l[r._index].length && (r._bufferIndex = -1, r._index++)), s.previous = T;
  }
  function E(T, _) {
    const H = _ || {};
    return H.type = T, H.start = g(), s.events.push(["enter", H, s]), a.push(H), H;
  }
  function z(T) {
    const _ = a.pop();
    return _.end = g(), s.events.push(["exit", _, s]), _;
  }
  function D(T, _) {
    q(T, _.from);
  }
  function w(T, _) {
    _.restore();
  }
  function O(T, _) {
    return H;
    function H(W, N, K) {
      let X, ae, me, m;
      return Array.isArray(W) ? (
        /* c8 ignore next 1 */
        de(W)
      ) : "tokenize" in W ? (
        // Looks like a construct.
        de([
          /** @type {Construct} */
          W
        ])
      ) : ue(W);
      function ue(Q) {
        return Be;
        function Be(be) {
          const ve = be !== null && Q[be], Le = be !== null && Q.null, Je = [
            // To do: add more extension tests.
            /* c8 ignore next 2 */
            ...Array.isArray(ve) ? ve : ve ? [ve] : [],
            ...Array.isArray(Le) ? Le : Le ? [Le] : []
          ];
          return de(Je)(be);
        }
      }
      function de(Q) {
        return X = Q, ae = 0, Q.length === 0 ? K : d(Q[ae]);
      }
      function d(Q) {
        return Be;
        function Be(be) {
          return m = j(), me = Q, Q.partial || (s.currentConstruct = Q), Q.name && s.parser.constructs.disable.null.includes(Q.name) ? Se() : Q.tokenize.call(
            // If we do have fields, create an object w/ `context` as its
            // prototype.
            // This allows a “live binding”, which is needed for `interrupt`.
            _ ? Object.assign(Object.create(s), _) : s,
            u,
            se,
            Se
          )(be);
        }
      }
      function se(Q) {
        return T(me, m), N;
      }
      function Se(Q) {
        return m.restore(), ++ae < X.length ? d(X[ae]) : K;
      }
    }
  }
  function q(T, _) {
    T.resolveAll && !o.includes(T) && o.push(T), T.resolve && le(s.events, _, s.events.length - _, T.resolve(s.events.slice(_), s)), T.resolveTo && (s.events = T.resolveTo(s.events, s));
  }
  function j() {
    const T = g(), _ = s.previous, H = s.currentConstruct, W = s.events.length, N = Array.from(a);
    return {
      from: W,
      restore: K
    };
    function K() {
      r = T, s.previous = _, s.currentConstruct = H, s.events.length = W, a = N, y();
    }
  }
  function y() {
    r.line in i && r.column < 2 && (r.column = i[r.line], r.offset += i[r.line] - 1);
  }
}
function Ja(e, t) {
  const n = t.start._index, r = t.start._bufferIndex, i = t.end._index, o = t.end._bufferIndex;
  let l;
  if (n === i)
    l = [e[n].slice(r, o)];
  else {
    if (l = e.slice(n, i), r > -1) {
      const a = l[0];
      typeof a == "string" ? l[0] = a.slice(r) : l.shift();
    }
    o > 0 && l.push(e[i].slice(0, o));
  }
  return l;
}
function Za(e, t) {
  let n = -1;
  const r = [];
  let i;
  for (; ++n < e.length; ) {
    const o = e[n];
    let l;
    if (typeof o == "string")
      l = o;
    else switch (o) {
      case -5: {
        l = "\r";
        break;
      }
      case -4: {
        l = `
`;
        break;
      }
      case -3: {
        l = `\r
`;
        break;
      }
      case -2: {
        l = t ? " " : "	";
        break;
      }
      case -1: {
        if (!t && i) continue;
        l = " ";
        break;
      }
      default:
        l = String.fromCharCode(o);
    }
    i = o === -2, r.push(l);
  }
  return r.join("");
}
function eu(e) {
  const r = {
    constructs: (
      /** @type {FullNormalizedExtension} */
      Mr([Qa, ...(e || {}).extensions || []])
    ),
    content: i(mo),
    defined: [],
    document: i(ko),
    flow: i(Ra),
    lazy: {},
    string: i(Na),
    text: i(Ba)
  };
  return r;
  function i(o) {
    return l;
    function l(a) {
      return Ka(r, o, a);
    }
  }
}
function nu(e) {
  for (; !Hr(e); )
    ;
  return e;
}
const Ht = /[\0\t\n\r]/g;
function tu() {
  let e = 1, t = "", n = !0, r;
  return i;
  function i(o, l, a) {
    const u = [];
    let s, f, c, p, h;
    for (o = t + (typeof o == "string" ? o.toString() : new TextDecoder(l || void 0).decode(o)), c = 0, t = "", n && (o.charCodeAt(0) === 65279 && c++, n = void 0); c < o.length; ) {
      if (Ht.lastIndex = c, s = Ht.exec(o), p = s && s.index !== void 0 ? s.index : o.length, h = o.charCodeAt(p), !s) {
        t = o.slice(c);
        break;
      }
      if (h === 10 && c === p && r)
        u.push(-3), r = void 0;
      else
        switch (r && (u.push(-5), r = void 0), c < p && (u.push(o.slice(c, p)), e += p - c), h) {
          case 0: {
            u.push(65533), e++;
            break;
          }
          case 9: {
            for (f = Math.ceil(e / 4) * 4, u.push(-2); e++ < f; ) u.push(-1);
            break;
          }
          case 10: {
            u.push(-4), e = 1;
            break;
          }
          default:
            r = !0, e = 1;
        }
      c = p + 1;
    }
    return a && (r && u.push(-5), t && u.push(t), u.push(null)), u;
  }
}
const ru = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
function iu(e) {
  return e.replace(ru, lu);
}
function lu(e, t, n) {
  if (t)
    return t;
  if (n.charCodeAt(0) === 35) {
    const i = n.charCodeAt(1), o = i === 120 || i === 88;
    return Or(n.slice(o ? 2 : 1), o ? 16 : 10);
  }
  return nt(n) || e;
}
const Gr = {}.hasOwnProperty;
function ou(e, t, n) {
  return t && typeof t == "object" && (n = t, t = void 0), au(n)(nu(eu(n).document().write(tu()(e, t, !0))));
}
function au(e) {
  const t = {
    transforms: [],
    canContainEols: ["emphasis", "fragment", "heading", "paragraph", "strong"],
    enter: {
      autolink: o(gt),
      autolinkProtocol: j,
      autolinkEmail: j,
      atxHeading: o(pt),
      blockQuote: o(Le),
      characterEscape: j,
      characterReference: j,
      codeFenced: o(Je),
      codeFencedFenceInfo: l,
      codeFencedFenceMeta: l,
      codeIndented: o(Je, l),
      codeText: o(_i, l),
      codeTextData: j,
      data: j,
      codeFlowValue: j,
      definition: o(vi),
      definitionDestinationString: l,
      definitionLabelString: l,
      definitionTitleString: l,
      emphasis: o(Li),
      hardBreakEscape: o(mt),
      hardBreakTrailing: o(mt),
      htmlFlow: o(dt, l),
      htmlFlowData: j,
      htmlText: o(dt, l),
      htmlTextData: j,
      image: o(Pi),
      label: l,
      link: o(gt),
      listItem: o(zi),
      listItemValue: p,
      listOrdered: o(kt, c),
      listUnordered: o(kt),
      paragraph: o(Di),
      reference: d,
      referenceString: l,
      resourceDestinationString: l,
      resourceTitleString: l,
      setextHeading: o(pt),
      strong: o(Fi),
      thematicBreak: o(Mi)
    },
    exit: {
      atxHeading: u(),
      atxHeadingSequence: D,
      autolink: u(),
      autolinkEmail: ve,
      autolinkProtocol: be,
      blockQuote: u(),
      characterEscapeValue: y,
      characterReferenceMarkerHexadecimal: Se,
      characterReferenceMarkerNumeric: Se,
      characterReferenceValue: Q,
      characterReference: Be,
      codeFenced: u(S),
      codeFencedFence: x,
      codeFencedFenceInfo: h,
      codeFencedFenceMeta: g,
      codeFlowValue: y,
      codeIndented: u(k),
      codeText: u(N),
      codeTextData: y,
      data: y,
      definition: u(),
      definitionDestinationString: z,
      definitionLabelString: A,
      definitionTitleString: E,
      emphasis: u(),
      hardBreakEscape: u(_),
      hardBreakTrailing: u(_),
      htmlFlow: u(H),
      htmlFlowData: y,
      htmlText: u(W),
      htmlTextData: y,
      image: u(X),
      label: me,
      labelText: ae,
      lineEnding: T,
      link: u(K),
      listItem: u(),
      listOrdered: u(),
      listUnordered: u(),
      paragraph: u(),
      referenceString: se,
      resourceDestinationString: m,
      resourceTitleString: ue,
      resource: de,
      setextHeading: u(q),
      setextHeadingLineSequence: O,
      setextHeadingText: w,
      strong: u(),
      thematicBreak: u()
    }
  };
  Yr(t, (e || {}).mdastExtensions || []);
  const n = {};
  return r;
  function r(b) {
    let I = {
      type: "root",
      children: []
    };
    const L = {
      stack: [I],
      tokenStack: [],
      config: t,
      enter: a,
      exit: s,
      buffer: l,
      resume: f,
      data: n
    }, R = [];
    let U = -1;
    for (; ++U < b.length; )
      if (b[U][1].type === "listOrdered" || b[U][1].type === "listUnordered")
        if (b[U][0] === "enter")
          R.push(U);
        else {
          const ce = R.pop();
          U = i(b, ce, U);
        }
    for (U = -1; ++U < b.length; ) {
      const ce = t[b[U][0]];
      Gr.call(ce, b[U][1].type) && ce[b[U][1].type].call(Object.assign({
        sliceSerialize: b[U][2].sliceSerialize
      }, L), b[U][1]);
    }
    if (L.tokenStack.length > 0) {
      const ce = L.tokenStack[L.tokenStack.length - 1];
      (ce[1] || Ut).call(L, void 0, ce[0]);
    }
    for (I.position = {
      start: we(b.length > 0 ? b[0][1].start : {
        line: 1,
        column: 1,
        offset: 0
      }),
      end: we(b.length > 0 ? b[b.length - 2][1].end : {
        line: 1,
        column: 1,
        offset: 0
      })
    }, U = -1; ++U < t.transforms.length; )
      I = t.transforms[U](I) || I;
    return I;
  }
  function i(b, I, L) {
    let R = I - 1, U = -1, ce = !1, Ee, ge, je, He;
    for (; ++R <= L; ) {
      const re = b[R];
      switch (re[1].type) {
        case "listUnordered":
        case "listOrdered":
        case "blockQuote": {
          re[0] === "enter" ? U++ : U--, He = void 0;
          break;
        }
        case "lineEndingBlank": {
          re[0] === "enter" && (Ee && !He && !U && !je && (je = R), He = void 0);
          break;
        }
        case "linePrefix":
        case "listItemValue":
        case "listItemMarker":
        case "listItemPrefix":
        case "listItemPrefixWhitespace":
          break;
        default:
          He = void 0;
      }
      if (!U && re[0] === "enter" && re[1].type === "listItemPrefix" || U === -1 && re[0] === "exit" && (re[1].type === "listUnordered" || re[1].type === "listOrdered")) {
        if (Ee) {
          let Pe = R;
          for (ge = void 0; Pe--; ) {
            const ke = b[Pe];
            if (ke[1].type === "lineEnding" || ke[1].type === "lineEndingBlank") {
              if (ke[0] === "exit") continue;
              ge && (b[ge][1].type = "lineEndingBlank", ce = !0), ke[1].type = "lineEnding", ge = Pe;
            } else if (!(ke[1].type === "linePrefix" || ke[1].type === "blockQuotePrefix" || ke[1].type === "blockQuotePrefixWhitespace" || ke[1].type === "blockQuoteMarker" || ke[1].type === "listItemIndent")) break;
          }
          je && (!ge || je < ge) && (Ee._spread = !0), Ee.end = Object.assign({}, ge ? b[ge][1].start : re[1].end), b.splice(ge || R, 0, ["exit", Ee, re[2]]), R++, L++;
        }
        if (re[1].type === "listItemPrefix") {
          const Pe = {
            type: "listItem",
            _spread: !1,
            start: Object.assign({}, re[1].start),
            // @ts-expect-error: we’ll add `end` in a second.
            end: void 0
          };
          Ee = Pe, b.splice(R, 0, ["enter", Pe, re[2]]), R++, L++, je = void 0, He = !0;
        }
      }
    }
    return b[I][1]._spread = ce, L;
  }
  function o(b, I) {
    return L;
    function L(R) {
      a.call(this, b(R), R), I && I.call(this, R);
    }
  }
  function l() {
    this.stack.push({
      type: "fragment",
      children: []
    });
  }
  function a(b, I, L) {
    this.stack[this.stack.length - 1].children.push(b), this.stack.push(b), this.tokenStack.push([I, L || void 0]), b.position = {
      start: we(I.start),
      // @ts-expect-error: `end` will be patched later.
      end: void 0
    };
  }
  function u(b) {
    return I;
    function I(L) {
      b && b.call(this, L), s.call(this, L);
    }
  }
  function s(b, I) {
    const L = this.stack.pop(), R = this.tokenStack.pop();
    if (R)
      R[0].type !== b.type && (I ? I.call(this, b, R[0]) : (R[1] || Ut).call(this, b, R[0]));
    else throw new Error("Cannot close `" + b.type + "` (" + Ve({
      start: b.start,
      end: b.end
    }) + "): it’s not open");
    L.position.end = we(b.end);
  }
  function f() {
    return et(this.stack.pop());
  }
  function c() {
    this.data.expectingFirstListItemValue = !0;
  }
  function p(b) {
    if (this.data.expectingFirstListItemValue) {
      const I = this.stack[this.stack.length - 2];
      I.start = Number.parseInt(this.sliceSerialize(b), 10), this.data.expectingFirstListItemValue = void 0;
    }
  }
  function h() {
    const b = this.resume(), I = this.stack[this.stack.length - 1];
    I.lang = b;
  }
  function g() {
    const b = this.resume(), I = this.stack[this.stack.length - 1];
    I.meta = b;
  }
  function x() {
    this.data.flowCodeInside || (this.buffer(), this.data.flowCodeInside = !0);
  }
  function S() {
    const b = this.resume(), I = this.stack[this.stack.length - 1];
    I.value = b.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, ""), this.data.flowCodeInside = void 0;
  }
  function k() {
    const b = this.resume(), I = this.stack[this.stack.length - 1];
    I.value = b.replace(/(\r?\n|\r)$/g, "");
  }
  function A(b) {
    const I = this.resume(), L = this.stack[this.stack.length - 1];
    L.label = I, L.identifier = fe(this.sliceSerialize(b)).toLowerCase();
  }
  function E() {
    const b = this.resume(), I = this.stack[this.stack.length - 1];
    I.title = b;
  }
  function z() {
    const b = this.resume(), I = this.stack[this.stack.length - 1];
    I.url = b;
  }
  function D(b) {
    const I = this.stack[this.stack.length - 1];
    if (!I.depth) {
      const L = this.sliceSerialize(b).length;
      I.depth = L;
    }
  }
  function w() {
    this.data.setextHeadingSlurpLineEnding = !0;
  }
  function O(b) {
    const I = this.stack[this.stack.length - 1];
    I.depth = this.sliceSerialize(b).codePointAt(0) === 61 ? 1 : 2;
  }
  function q() {
    this.data.setextHeadingSlurpLineEnding = void 0;
  }
  function j(b) {
    const L = this.stack[this.stack.length - 1].children;
    let R = L[L.length - 1];
    (!R || R.type !== "text") && (R = Ri(), R.position = {
      start: we(b.start),
      // @ts-expect-error: we’ll add `end` later.
      end: void 0
    }, L.push(R)), this.stack.push(R);
  }
  function y(b) {
    const I = this.stack.pop();
    I.value += this.sliceSerialize(b), I.position.end = we(b.end);
  }
  function T(b) {
    const I = this.stack[this.stack.length - 1];
    if (this.data.atHardBreak) {
      const L = I.children[I.children.length - 1];
      L.position.end = we(b.end), this.data.atHardBreak = void 0;
      return;
    }
    !this.data.setextHeadingSlurpLineEnding && t.canContainEols.includes(I.type) && (j.call(this, b), y.call(this, b));
  }
  function _() {
    this.data.atHardBreak = !0;
  }
  function H() {
    const b = this.resume(), I = this.stack[this.stack.length - 1];
    I.value = b;
  }
  function W() {
    const b = this.resume(), I = this.stack[this.stack.length - 1];
    I.value = b;
  }
  function N() {
    const b = this.resume(), I = this.stack[this.stack.length - 1];
    I.value = b;
  }
  function K() {
    const b = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      const I = this.data.referenceType || "shortcut";
      b.type += "Reference", b.referenceType = I, delete b.url, delete b.title;
    } else
      delete b.identifier, delete b.label;
    this.data.referenceType = void 0;
  }
  function X() {
    const b = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      const I = this.data.referenceType || "shortcut";
      b.type += "Reference", b.referenceType = I, delete b.url, delete b.title;
    } else
      delete b.identifier, delete b.label;
    this.data.referenceType = void 0;
  }
  function ae(b) {
    const I = this.sliceSerialize(b), L = this.stack[this.stack.length - 2];
    L.label = iu(I), L.identifier = fe(I).toLowerCase();
  }
  function me() {
    const b = this.stack[this.stack.length - 1], I = this.resume(), L = this.stack[this.stack.length - 1];
    if (this.data.inReference = !0, L.type === "link") {
      const R = b.children;
      L.children = R;
    } else
      L.alt = I;
  }
  function m() {
    const b = this.resume(), I = this.stack[this.stack.length - 1];
    I.url = b;
  }
  function ue() {
    const b = this.resume(), I = this.stack[this.stack.length - 1];
    I.title = b;
  }
  function de() {
    this.data.inReference = void 0;
  }
  function d() {
    this.data.referenceType = "collapsed";
  }
  function se(b) {
    const I = this.resume(), L = this.stack[this.stack.length - 1];
    L.label = I, L.identifier = fe(this.sliceSerialize(b)).toLowerCase(), this.data.referenceType = "full";
  }
  function Se(b) {
    this.data.characterReferenceType = b.type;
  }
  function Q(b) {
    const I = this.sliceSerialize(b), L = this.data.characterReferenceType;
    let R;
    L ? (R = Or(I, L === "characterReferenceMarkerNumeric" ? 10 : 16), this.data.characterReferenceType = void 0) : R = nt(I);
    const U = this.stack[this.stack.length - 1];
    U.value += R;
  }
  function Be(b) {
    const I = this.stack.pop();
    I.position.end = we(b.end);
  }
  function be(b) {
    y.call(this, b);
    const I = this.stack[this.stack.length - 1];
    I.url = this.sliceSerialize(b);
  }
  function ve(b) {
    y.call(this, b);
    const I = this.stack[this.stack.length - 1];
    I.url = "mailto:" + this.sliceSerialize(b);
  }
  function Le() {
    return {
      type: "blockquote",
      children: []
    };
  }
  function Je() {
    return {
      type: "code",
      lang: null,
      meta: null,
      value: ""
    };
  }
  function _i() {
    return {
      type: "inlineCode",
      value: ""
    };
  }
  function vi() {
    return {
      type: "definition",
      identifier: "",
      label: null,
      title: null,
      url: ""
    };
  }
  function Li() {
    return {
      type: "emphasis",
      children: []
    };
  }
  function pt() {
    return {
      type: "heading",
      // @ts-expect-error `depth` will be set later.
      depth: 0,
      children: []
    };
  }
  function mt() {
    return {
      type: "break"
    };
  }
  function dt() {
    return {
      type: "html",
      value: ""
    };
  }
  function Pi() {
    return {
      type: "image",
      title: null,
      url: "",
      alt: null
    };
  }
  function gt() {
    return {
      type: "link",
      title: null,
      url: "",
      children: []
    };
  }
  function kt(b) {
    return {
      type: "list",
      ordered: b.type === "listOrdered",
      start: null,
      spread: b._spread,
      children: []
    };
  }
  function zi(b) {
    return {
      type: "listItem",
      spread: b._spread,
      checked: null,
      children: []
    };
  }
  function Di() {
    return {
      type: "paragraph",
      children: []
    };
  }
  function Fi() {
    return {
      type: "strong",
      children: []
    };
  }
  function Ri() {
    return {
      type: "text",
      value: ""
    };
  }
  function Mi() {
    return {
      type: "thematicBreak"
    };
  }
}
function we(e) {
  return {
    line: e.line,
    column: e.column,
    offset: e.offset
  };
}
function Yr(e, t) {
  let n = -1;
  for (; ++n < t.length; ) {
    const r = t[n];
    Array.isArray(r) ? Yr(e, r) : uu(e, r);
  }
}
function uu(e, t) {
  let n;
  for (n in t)
    if (Gr.call(t, n))
      switch (n) {
        case "canContainEols": {
          const r = t[n];
          r && e[n].push(...r);
          break;
        }
        case "transforms": {
          const r = t[n];
          r && e[n].push(...r);
          break;
        }
        case "enter":
        case "exit": {
          const r = t[n];
          r && Object.assign(e[n], r);
          break;
        }
      }
}
function Ut(e, t) {
  throw e ? new Error("Cannot close `" + e.type + "` (" + Ve({
    start: e.start,
    end: e.end
  }) + "): a different token (`" + t.type + "`, " + Ve({
    start: t.start,
    end: t.end
  }) + ") is open") : new Error("Cannot close document, a token (`" + t.type + "`, " + Ve({
    start: t.start,
    end: t.end
  }) + ") is still open");
}
function su(e) {
  const t = this;
  t.parser = n;
  function n(r) {
    return ou(r, {
      ...t.data("settings"),
      ...e,
      // Note: these options are not in the readme.
      // The goal is for them to be set by plugins on `data` instead of being
      // passed by users.
      extensions: t.data("micromarkExtensions") || [],
      mdastExtensions: t.data("fromMarkdownExtensions") || []
    });
  }
}
function cu(e, t) {
  const n = {
    type: "element",
    tagName: "blockquote",
    properties: {},
    children: e.wrap(e.all(t), !0)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function fu(e, t) {
  const n = { type: "element", tagName: "br", properties: {}, children: [] };
  return e.patch(t, n), [e.applyData(t, n), { type: "text", value: `
` }];
}
function hu(e, t) {
  const n = t.value ? t.value + `
` : "", r = {}, i = t.lang ? t.lang.split(/\s+/) : [];
  i.length > 0 && (r.className = ["language-" + i[0]]);
  let o = {
    type: "element",
    tagName: "code",
    properties: r,
    children: [{ type: "text", value: n }]
  };
  return t.meta && (o.data = { meta: t.meta }), e.patch(t, o), o = e.applyData(t, o), o = { type: "element", tagName: "pre", properties: {}, children: [o] }, e.patch(t, o), o;
}
function pu(e, t) {
  const n = {
    type: "element",
    tagName: "del",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function mu(e, t) {
  const n = {
    type: "element",
    tagName: "em",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function du(e, t) {
  const n = typeof e.options.clobberPrefix == "string" ? e.options.clobberPrefix : "user-content-", r = String(t.identifier).toUpperCase(), i = Ne(r.toLowerCase()), o = e.footnoteOrder.indexOf(r);
  let l, a = e.footnoteCounts.get(r);
  a === void 0 ? (a = 0, e.footnoteOrder.push(r), l = e.footnoteOrder.length) : l = o + 1, a += 1, e.footnoteCounts.set(r, a);
  const u = {
    type: "element",
    tagName: "a",
    properties: {
      href: "#" + n + "fn-" + i,
      id: n + "fnref-" + i + (a > 1 ? "-" + a : ""),
      dataFootnoteRef: !0,
      ariaDescribedBy: ["footnote-label"]
    },
    children: [{ type: "text", value: String(l) }]
  };
  e.patch(t, u);
  const s = {
    type: "element",
    tagName: "sup",
    properties: {},
    children: [u]
  };
  return e.patch(t, s), e.applyData(t, s);
}
function gu(e, t) {
  const n = {
    type: "element",
    tagName: "h" + t.depth,
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function ku(e, t) {
  if (e.options.allowDangerousHtml) {
    const n = { type: "raw", value: t.value };
    return e.patch(t, n), e.applyData(t, n);
  }
}
function Xr(e, t) {
  const n = t.referenceType;
  let r = "]";
  if (n === "collapsed" ? r += "[]" : n === "full" && (r += "[" + (t.label || t.identifier) + "]"), t.type === "imageReference")
    return [{ type: "text", value: "![" + t.alt + r }];
  const i = e.all(t), o = i[0];
  o && o.type === "text" ? o.value = "[" + o.value : i.unshift({ type: "text", value: "[" });
  const l = i[i.length - 1];
  return l && l.type === "text" ? l.value += r : i.push({ type: "text", value: r }), i;
}
function yu(e, t) {
  const n = String(t.identifier).toUpperCase(), r = e.definitionById.get(n);
  if (!r)
    return Xr(e, t);
  const i = { src: Ne(r.url || ""), alt: t.alt };
  r.title !== null && r.title !== void 0 && (i.title = r.title);
  const o = { type: "element", tagName: "img", properties: i, children: [] };
  return e.patch(t, o), e.applyData(t, o);
}
function xu(e, t) {
  const n = { src: Ne(t.url) };
  t.alt !== null && t.alt !== void 0 && (n.alt = t.alt), t.title !== null && t.title !== void 0 && (n.title = t.title);
  const r = { type: "element", tagName: "img", properties: n, children: [] };
  return e.patch(t, r), e.applyData(t, r);
}
function bu(e, t) {
  const n = { type: "text", value: t.value.replace(/\r?\n|\r/g, " ") };
  e.patch(t, n);
  const r = {
    type: "element",
    tagName: "code",
    properties: {},
    children: [n]
  };
  return e.patch(t, r), e.applyData(t, r);
}
function wu(e, t) {
  const n = String(t.identifier).toUpperCase(), r = e.definitionById.get(n);
  if (!r)
    return Xr(e, t);
  const i = { href: Ne(r.url || "") };
  r.title !== null && r.title !== void 0 && (i.title = r.title);
  const o = {
    type: "element",
    tagName: "a",
    properties: i,
    children: e.all(t)
  };
  return e.patch(t, o), e.applyData(t, o);
}
function Cu(e, t) {
  const n = { href: Ne(t.url) };
  t.title !== null && t.title !== void 0 && (n.title = t.title);
  const r = {
    type: "element",
    tagName: "a",
    properties: n,
    children: e.all(t)
  };
  return e.patch(t, r), e.applyData(t, r);
}
function Su(e, t, n) {
  const r = e.all(t), i = n ? Eu(n) : Qr(t), o = {}, l = [];
  if (typeof t.checked == "boolean") {
    const f = r[0];
    let c;
    f && f.type === "element" && f.tagName === "p" ? c = f : (c = { type: "element", tagName: "p", properties: {}, children: [] }, r.unshift(c)), c.children.length > 0 && c.children.unshift({ type: "text", value: " " }), c.children.unshift({
      type: "element",
      tagName: "input",
      properties: { type: "checkbox", checked: t.checked, disabled: !0 },
      children: []
    }), o.className = ["task-list-item"];
  }
  let a = -1;
  for (; ++a < r.length; ) {
    const f = r[a];
    (i || a !== 0 || f.type !== "element" || f.tagName !== "p") && l.push({ type: "text", value: `
` }), f.type === "element" && f.tagName === "p" && !i ? l.push(...f.children) : l.push(f);
  }
  const u = r[r.length - 1];
  u && (i || u.type !== "element" || u.tagName !== "p") && l.push({ type: "text", value: `
` });
  const s = { type: "element", tagName: "li", properties: o, children: l };
  return e.patch(t, s), e.applyData(t, s);
}
function Eu(e) {
  let t = !1;
  if (e.type === "list") {
    t = e.spread || !1;
    const n = e.children;
    let r = -1;
    for (; !t && ++r < n.length; )
      t = Qr(n[r]);
  }
  return t;
}
function Qr(e) {
  const t = e.spread;
  return t ?? e.children.length > 1;
}
function Iu(e, t) {
  const n = {}, r = e.all(t);
  let i = -1;
  for (typeof t.start == "number" && t.start !== 1 && (n.start = t.start); ++i < r.length; ) {
    const l = r[i];
    if (l.type === "element" && l.tagName === "li" && l.properties && Array.isArray(l.properties.className) && l.properties.className.includes("task-list-item")) {
      n.className = ["contains-task-list"];
      break;
    }
  }
  const o = {
    type: "element",
    tagName: t.ordered ? "ol" : "ul",
    properties: n,
    children: e.wrap(r, !0)
  };
  return e.patch(t, o), e.applyData(t, o);
}
function Au(e, t) {
  const n = {
    type: "element",
    tagName: "p",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function Tu(e, t) {
  const n = { type: "root", children: e.wrap(e.all(t)) };
  return e.patch(t, n), e.applyData(t, n);
}
function _u(e, t) {
  const n = {
    type: "element",
    tagName: "strong",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function vu(e, t) {
  const n = e.all(t), r = n.shift(), i = [];
  if (r) {
    const l = {
      type: "element",
      tagName: "thead",
      properties: {},
      children: e.wrap([r], !0)
    };
    e.patch(t.children[0], l), i.push(l);
  }
  if (n.length > 0) {
    const l = {
      type: "element",
      tagName: "tbody",
      properties: {},
      children: e.wrap(n, !0)
    }, a = Qn(t.children[1]), u = vr(t.children[t.children.length - 1]);
    a && u && (l.position = { start: a, end: u }), i.push(l);
  }
  const o = {
    type: "element",
    tagName: "table",
    properties: {},
    children: e.wrap(i, !0)
  };
  return e.patch(t, o), e.applyData(t, o);
}
function Lu(e, t, n) {
  const r = n ? n.children : void 0, o = (r ? r.indexOf(t) : 1) === 0 ? "th" : "td", l = n && n.type === "table" ? n.align : void 0, a = l ? l.length : t.children.length;
  let u = -1;
  const s = [];
  for (; ++u < a; ) {
    const c = t.children[u], p = {}, h = l ? l[u] : void 0;
    h && (p.align = h);
    let g = { type: "element", tagName: o, properties: p, children: [] };
    c && (g.children = e.all(c), e.patch(c, g), g = e.applyData(c, g)), s.push(g);
  }
  const f = {
    type: "element",
    tagName: "tr",
    properties: {},
    children: e.wrap(s, !0)
  };
  return e.patch(t, f), e.applyData(t, f);
}
function Pu(e, t) {
  const n = {
    type: "element",
    tagName: "td",
    // Assume body cell.
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
const $t = 9, Vt = 32;
function zu(e) {
  const t = String(e), n = /\r?\n|\r/g;
  let r = n.exec(t), i = 0;
  const o = [];
  for (; r; )
    o.push(
      qt(t.slice(i, r.index), i > 0, !0),
      r[0]
    ), i = r.index + r[0].length, r = n.exec(t);
  return o.push(qt(t.slice(i), i > 0, !1)), o.join("");
}
function qt(e, t, n) {
  let r = 0, i = e.length;
  if (t) {
    let o = e.codePointAt(r);
    for (; o === $t || o === Vt; )
      r++, o = e.codePointAt(r);
  }
  if (n) {
    let o = e.codePointAt(i - 1);
    for (; o === $t || o === Vt; )
      i--, o = e.codePointAt(i - 1);
  }
  return i > r ? e.slice(r, i) : "";
}
function Du(e, t) {
  const n = { type: "text", value: zu(String(t.value)) };
  return e.patch(t, n), e.applyData(t, n);
}
function Fu(e, t) {
  const n = {
    type: "element",
    tagName: "hr",
    properties: {},
    children: []
  };
  return e.patch(t, n), e.applyData(t, n);
}
const Ru = {
  blockquote: cu,
  break: fu,
  code: hu,
  delete: pu,
  emphasis: mu,
  footnoteReference: du,
  heading: gu,
  html: ku,
  imageReference: yu,
  image: xu,
  inlineCode: bu,
  linkReference: wu,
  link: Cu,
  listItem: Su,
  list: Iu,
  paragraph: Au,
  // @ts-expect-error: root is different, but hard to type.
  root: Tu,
  strong: _u,
  table: vu,
  tableCell: Pu,
  tableRow: Lu,
  text: Du,
  thematicBreak: Fu,
  toml: Ze,
  yaml: Ze,
  definition: Ze,
  footnoteDefinition: Ze
};
function Ze() {
}
const Kr = -1, mn = 0, We = 1, un = 2, rt = 3, it = 4, lt = 5, ot = 6, Jr = 7, Zr = 8, Wt = typeof self == "object" ? self : globalThis, Mu = (e, t) => {
  const n = (i, o) => (e.set(o, i), i), r = (i) => {
    if (e.has(i))
      return e.get(i);
    const [o, l] = t[i];
    switch (o) {
      case mn:
      case Kr:
        return n(l, i);
      case We: {
        const a = n([], i);
        for (const u of l)
          a.push(r(u));
        return a;
      }
      case un: {
        const a = n({}, i);
        for (const [u, s] of l)
          a[r(u)] = r(s);
        return a;
      }
      case rt:
        return n(new Date(l), i);
      case it: {
        const { source: a, flags: u } = l;
        return n(new RegExp(a, u), i);
      }
      case lt: {
        const a = n(/* @__PURE__ */ new Map(), i);
        for (const [u, s] of l)
          a.set(r(u), r(s));
        return a;
      }
      case ot: {
        const a = n(/* @__PURE__ */ new Set(), i);
        for (const u of l)
          a.add(r(u));
        return a;
      }
      case Jr: {
        const { name: a, message: u } = l;
        return n(new Wt[a](u), i);
      }
      case Zr:
        return n(BigInt(l), i);
      case "BigInt":
        return n(Object(BigInt(l)), i);
      case "ArrayBuffer":
        return n(new Uint8Array(l).buffer, l);
      case "DataView": {
        const { buffer: a } = new Uint8Array(l);
        return n(new DataView(a), l);
      }
    }
    return n(new Wt[o](l), i);
  };
  return r;
}, Gt = (e) => Mu(/* @__PURE__ */ new Map(), e)(0), ze = "", { toString: Ou } = {}, { keys: Nu } = Object, $e = (e) => {
  const t = typeof e;
  if (t !== "object" || !e)
    return [mn, t];
  const n = Ou.call(e).slice(8, -1);
  switch (n) {
    case "Array":
      return [We, ze];
    case "Object":
      return [un, ze];
    case "Date":
      return [rt, ze];
    case "RegExp":
      return [it, ze];
    case "Map":
      return [lt, ze];
    case "Set":
      return [ot, ze];
    case "DataView":
      return [We, n];
  }
  return n.includes("Array") ? [We, n] : n.includes("Error") ? [Jr, n] : [un, n];
}, en = ([e, t]) => e === mn && (t === "function" || t === "symbol"), Bu = (e, t, n, r) => {
  const i = (l, a) => {
    const u = r.push(l) - 1;
    return n.set(a, u), u;
  }, o = (l) => {
    if (n.has(l))
      return n.get(l);
    let [a, u] = $e(l);
    switch (a) {
      case mn: {
        let f = l;
        switch (u) {
          case "bigint":
            a = Zr, f = l.toString();
            break;
          case "function":
          case "symbol":
            if (e)
              throw new TypeError("unable to serialize " + u);
            f = null;
            break;
          case "undefined":
            return i([Kr], l);
        }
        return i([a, f], l);
      }
      case We: {
        if (u) {
          let p = l;
          return u === "DataView" ? p = new Uint8Array(l.buffer) : u === "ArrayBuffer" && (p = new Uint8Array(l)), i([u, [...p]], l);
        }
        const f = [], c = i([a, f], l);
        for (const p of l)
          f.push(o(p));
        return c;
      }
      case un: {
        if (u)
          switch (u) {
            case "BigInt":
              return i([u, l.toString()], l);
            case "Boolean":
            case "Number":
            case "String":
              return i([u, l.valueOf()], l);
          }
        if (t && "toJSON" in l)
          return o(l.toJSON());
        const f = [], c = i([a, f], l);
        for (const p of Nu(l))
          (e || !en($e(l[p]))) && f.push([o(p), o(l[p])]);
        return c;
      }
      case rt:
        return i([a, l.toISOString()], l);
      case it: {
        const { source: f, flags: c } = l;
        return i([a, { source: f, flags: c }], l);
      }
      case lt: {
        const f = [], c = i([a, f], l);
        for (const [p, h] of l)
          (e || !(en($e(p)) || en($e(h)))) && f.push([o(p), o(h)]);
        return c;
      }
      case ot: {
        const f = [], c = i([a, f], l);
        for (const p of l)
          (e || !en($e(p))) && f.push(o(p));
        return c;
      }
    }
    const { message: s } = l;
    return i([a, { name: u, message: s }], l);
  };
  return o;
}, Yt = (e, { json: t, lossy: n } = {}) => {
  const r = [];
  return Bu(!(t || n), !!t, /* @__PURE__ */ new Map(), r)(e), r;
}, sn = typeof structuredClone == "function" ? (
  /* c8 ignore start */
  (e, t) => t && ("json" in t || "lossy" in t) ? Gt(Yt(e, t)) : structuredClone(e)
) : (e, t) => Gt(Yt(e, t));
function ju(e, t) {
  const n = [{ type: "text", value: "↩" }];
  return t > 1 && n.push({
    type: "element",
    tagName: "sup",
    properties: {},
    children: [{ type: "text", value: String(t) }]
  }), n;
}
function Hu(e, t) {
  return "Back to reference " + (e + 1) + (t > 1 ? "-" + t : "");
}
function Uu(e) {
  const t = typeof e.options.clobberPrefix == "string" ? e.options.clobberPrefix : "user-content-", n = e.options.footnoteBackContent || ju, r = e.options.footnoteBackLabel || Hu, i = e.options.footnoteLabel || "Footnotes", o = e.options.footnoteLabelTagName || "h2", l = e.options.footnoteLabelProperties || {
    className: ["sr-only"]
  }, a = [];
  let u = -1;
  for (; ++u < e.footnoteOrder.length; ) {
    const s = e.footnoteById.get(
      e.footnoteOrder[u]
    );
    if (!s)
      continue;
    const f = e.all(s), c = String(s.identifier).toUpperCase(), p = Ne(c.toLowerCase());
    let h = 0;
    const g = [], x = e.footnoteCounts.get(c);
    for (; x !== void 0 && ++h <= x; ) {
      g.length > 0 && g.push({ type: "text", value: " " });
      let A = typeof n == "string" ? n : n(u, h);
      typeof A == "string" && (A = { type: "text", value: A }), g.push({
        type: "element",
        tagName: "a",
        properties: {
          href: "#" + t + "fnref-" + p + (h > 1 ? "-" + h : ""),
          dataFootnoteBackref: "",
          ariaLabel: typeof r == "string" ? r : r(u, h),
          className: ["data-footnote-backref"]
        },
        children: Array.isArray(A) ? A : [A]
      });
    }
    const S = f[f.length - 1];
    if (S && S.type === "element" && S.tagName === "p") {
      const A = S.children[S.children.length - 1];
      A && A.type === "text" ? A.value += " " : S.children.push({ type: "text", value: " " }), S.children.push(...g);
    } else
      f.push(...g);
    const k = {
      type: "element",
      tagName: "li",
      properties: { id: t + "fn-" + p },
      children: e.wrap(f, !0)
    };
    e.patch(s, k), a.push(k);
  }
  if (a.length !== 0)
    return {
      type: "element",
      tagName: "section",
      properties: { dataFootnotes: !0, className: ["footnotes"] },
      children: [
        {
          type: "element",
          tagName: o,
          properties: {
            ...sn(l),
            id: "footnote-label"
          },
          children: [{ type: "text", value: i }]
        },
        { type: "text", value: `
` },
        {
          type: "element",
          tagName: "ol",
          properties: {},
          children: e.wrap(a, !0)
        },
        { type: "text", value: `
` }
      ]
    };
}
const dn = (
  // Note: overloads in JSDoc can’t yet use different `@template`s.
  /**
   * @type {(
   *   (<Condition extends string>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & {type: Condition}) &
   *   (<Condition extends Props>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Condition) &
   *   (<Condition extends TestFunction>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Predicate<Condition, Node>) &
   *   ((test?: null | undefined) => (node?: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node) &
   *   ((test?: Test) => Check)
   * )}
   */
  /**
   * @param {Test} [test]
   * @returns {Check}
   */
  function(e) {
    if (e == null)
      return Wu;
    if (typeof e == "function")
      return gn(e);
    if (typeof e == "object")
      return Array.isArray(e) ? $u(e) : (
        // Cast because `ReadonlyArray` goes into the above but `isArray`
        // narrows to `Array`.
        Vu(
          /** @type {Props} */
          e
        )
      );
    if (typeof e == "string")
      return qu(e);
    throw new Error("Expected function, string, or object as test");
  }
);
function $u(e) {
  const t = [];
  let n = -1;
  for (; ++n < e.length; )
    t[n] = dn(e[n]);
  return gn(r);
  function r(...i) {
    let o = -1;
    for (; ++o < t.length; )
      if (t[o].apply(this, i)) return !0;
    return !1;
  }
}
function Vu(e) {
  const t = (
    /** @type {Record<string, unknown>} */
    e
  );
  return gn(n);
  function n(r) {
    const i = (
      /** @type {Record<string, unknown>} */
      /** @type {unknown} */
      r
    );
    let o;
    for (o in e)
      if (i[o] !== t[o]) return !1;
    return !0;
  }
}
function qu(e) {
  return gn(t);
  function t(n) {
    return n && n.type === e;
  }
}
function gn(e) {
  return t;
  function t(n, r, i) {
    return !!(Gu(n) && e.call(
      this,
      n,
      typeof r == "number" ? r : void 0,
      i || void 0
    ));
  }
}
function Wu() {
  return !0;
}
function Gu(e) {
  return e !== null && typeof e == "object" && "type" in e;
}
const ei = [], Yu = !0, Hn = !1, Xu = "skip";
function ni(e, t, n, r) {
  let i;
  typeof t == "function" && typeof n != "function" ? (r = n, n = t) : i = t;
  const o = dn(i), l = r ? -1 : 1;
  a(e, void 0, [])();
  function a(u, s, f) {
    const c = (
      /** @type {Record<string, unknown>} */
      u && typeof u == "object" ? u : {}
    );
    if (typeof c.type == "string") {
      const h = (
        // `hast`
        typeof c.tagName == "string" ? c.tagName : (
          // `xast`
          typeof c.name == "string" ? c.name : void 0
        )
      );
      Object.defineProperty(p, "name", {
        value: "node (" + (u.type + (h ? "<" + h + ">" : "")) + ")"
      });
    }
    return p;
    function p() {
      let h = ei, g, x, S;
      if ((!t || o(u, s, f[f.length - 1] || void 0)) && (h = Qu(n(u, f)), h[0] === Hn))
        return h;
      if ("children" in u && u.children) {
        const k = (
          /** @type {UnistParent} */
          u
        );
        if (k.children && h[0] !== Xu)
          for (x = (r ? k.children.length : -1) + l, S = f.concat(k); x > -1 && x < k.children.length; ) {
            const A = k.children[x];
            if (g = a(A, x, S)(), g[0] === Hn)
              return g;
            x = typeof g[1] == "number" ? g[1] : x + l;
          }
      }
      return h;
    }
  }
}
function Qu(e) {
  return Array.isArray(e) ? e : typeof e == "number" ? [Yu, e] : e == null ? ei : [e];
}
function at(e, t, n, r) {
  let i, o, l;
  typeof t == "function" && typeof n != "function" ? (o = void 0, l = t, i = n) : (o = t, l = n, i = r), ni(e, o, a, i);
  function a(u, s) {
    const f = s[s.length - 1], c = f ? f.children.indexOf(u) : void 0;
    return l(u, c, f);
  }
}
const Un = {}.hasOwnProperty, Ku = {};
function Ju(e, t) {
  const n = t || Ku, r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), l = { ...Ru, ...n.handlers }, a = {
    all: s,
    applyData: es,
    definitionById: r,
    footnoteById: i,
    footnoteCounts: o,
    footnoteOrder: [],
    handlers: l,
    one: u,
    options: n,
    patch: Zu,
    wrap: ts
  };
  return at(e, function(f) {
    if (f.type === "definition" || f.type === "footnoteDefinition") {
      const c = f.type === "definition" ? r : i, p = String(f.identifier).toUpperCase();
      c.has(p) || c.set(p, f);
    }
  }), a;
  function u(f, c) {
    const p = f.type, h = a.handlers[p];
    if (Un.call(a.handlers, p) && h)
      return h(a, f, c);
    if (a.options.passThrough && a.options.passThrough.includes(p)) {
      if ("children" in f) {
        const { children: x, ...S } = f, k = sn(S);
        return k.children = a.all(f), k;
      }
      return sn(f);
    }
    return (a.options.unknownHandler || ns)(a, f, c);
  }
  function s(f) {
    const c = [];
    if ("children" in f) {
      const p = f.children;
      let h = -1;
      for (; ++h < p.length; ) {
        const g = a.one(p[h], f);
        if (g) {
          if (h && p[h - 1].type === "break" && (!Array.isArray(g) && g.type === "text" && (g.value = Xt(g.value)), !Array.isArray(g) && g.type === "element")) {
            const x = g.children[0];
            x && x.type === "text" && (x.value = Xt(x.value));
          }
          Array.isArray(g) ? c.push(...g) : c.push(g);
        }
      }
    }
    return c;
  }
}
function Zu(e, t) {
  e.position && (t.position = jl(e));
}
function es(e, t) {
  let n = t;
  if (e && e.data) {
    const r = e.data.hName, i = e.data.hChildren, o = e.data.hProperties;
    if (typeof r == "string")
      if (n.type === "element")
        n.tagName = r;
      else {
        const l = "children" in n ? n.children : [n];
        n = { type: "element", tagName: r, properties: {}, children: l };
      }
    n.type === "element" && o && Object.assign(n.properties, sn(o)), "children" in n && n.children && i !== null && i !== void 0 && (n.children = i);
  }
  return n;
}
function ns(e, t) {
  const n = t.data || {}, r = "value" in t && !(Un.call(n, "hProperties") || Un.call(n, "hChildren")) ? { type: "text", value: t.value } : {
    type: "element",
    tagName: "div",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, r), e.applyData(t, r);
}
function ts(e, t) {
  const n = [];
  let r = -1;
  for (t && n.push({ type: "text", value: `
` }); ++r < e.length; )
    r && n.push({ type: "text", value: `
` }), n.push(e[r]);
  return t && e.length > 0 && n.push({ type: "text", value: `
` }), n;
}
function Xt(e) {
  let t = 0, n = e.charCodeAt(t);
  for (; n === 9 || n === 32; )
    t++, n = e.charCodeAt(t);
  return e.slice(t);
}
function Qt(e, t) {
  const n = Ju(e, t), r = n.one(e, void 0), i = Uu(n), o = Array.isArray(r) ? { type: "root", children: r } : r || { type: "root", children: [] };
  return i && o.children.push({ type: "text", value: `
` }, i), o;
}
function rs(e, t) {
  return e && "run" in e ? async function(n, r) {
    const i = (
      /** @type {HastRoot} */
      Qt(n, { file: r, ...t })
    );
    await e.run(i, r);
  } : function(n, r) {
    return (
      /** @type {HastRoot} */
      Qt(n, { file: r, ...e || t })
    );
  };
}
function Kt(e) {
  if (e)
    throw e;
}
var ln = Object.prototype.hasOwnProperty, ti = Object.prototype.toString, Jt = Object.defineProperty, Zt = Object.getOwnPropertyDescriptor, er = function(t) {
  return typeof Array.isArray == "function" ? Array.isArray(t) : ti.call(t) === "[object Array]";
}, nr = function(t) {
  if (!t || ti.call(t) !== "[object Object]")
    return !1;
  var n = ln.call(t, "constructor"), r = t.constructor && t.constructor.prototype && ln.call(t.constructor.prototype, "isPrototypeOf");
  if (t.constructor && !n && !r)
    return !1;
  var i;
  for (i in t)
    ;
  return typeof i > "u" || ln.call(t, i);
}, tr = function(t, n) {
  Jt && n.name === "__proto__" ? Jt(t, n.name, {
    enumerable: !0,
    configurable: !0,
    value: n.newValue,
    writable: !0
  }) : t[n.name] = n.newValue;
}, rr = function(t, n) {
  if (n === "__proto__")
    if (ln.call(t, n)) {
      if (Zt)
        return Zt(t, n).value;
    } else return;
  return t[n];
}, is = function e() {
  var t, n, r, i, o, l, a = arguments[0], u = 1, s = arguments.length, f = !1;
  for (typeof a == "boolean" && (f = a, a = arguments[1] || {}, u = 2), (a == null || typeof a != "object" && typeof a != "function") && (a = {}); u < s; ++u)
    if (t = arguments[u], t != null)
      for (n in t)
        r = rr(a, n), i = rr(t, n), a !== i && (f && i && (nr(i) || (o = er(i))) ? (o ? (o = !1, l = r && er(r) ? r : []) : l = r && nr(r) ? r : {}, tr(a, { name: n, newValue: e(f, l, i) })) : typeof i < "u" && tr(a, { name: n, newValue: i }));
  return a;
};
const wn = /* @__PURE__ */ _r(is);
function $n(e) {
  if (typeof e != "object" || e === null)
    return !1;
  const t = Object.getPrototypeOf(e);
  return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e);
}
function ls() {
  const e = [], t = { run: n, use: r };
  return t;
  function n(...i) {
    let o = -1;
    const l = i.pop();
    if (typeof l != "function")
      throw new TypeError("Expected function as last argument, not " + l);
    a(null, ...i);
    function a(u, ...s) {
      const f = e[++o];
      let c = -1;
      if (u) {
        l(u);
        return;
      }
      for (; ++c < i.length; )
        (s[c] === null || s[c] === void 0) && (s[c] = i[c]);
      i = s, f ? os(f, a)(...s) : l(null, ...s);
    }
  }
  function r(i) {
    if (typeof i != "function")
      throw new TypeError(
        "Expected `middelware` to be a function, not " + i
      );
    return e.push(i), t;
  }
}
function os(e, t) {
  let n;
  return r;
  function r(...l) {
    const a = e.length > l.length;
    let u;
    a && l.push(i);
    try {
      u = e.apply(this, l);
    } catch (s) {
      const f = (
        /** @type {Error} */
        s
      );
      if (a && n)
        throw f;
      return i(f);
    }
    a || (u && u.then && typeof u.then == "function" ? u.then(o, i) : u instanceof Error ? i(u) : o(u));
  }
  function i(l, ...a) {
    n || (n = !0, t(l, ...a));
  }
  function o(l) {
    i(null, l);
  }
}
const he = { basename: as, dirname: us, extname: ss, join: cs, sep: "/" };
function as(e, t) {
  if (t !== void 0 && typeof t != "string")
    throw new TypeError('"ext" argument must be a string');
  Ke(e);
  let n = 0, r = -1, i = e.length, o;
  if (t === void 0 || t.length === 0 || t.length > e.length) {
    for (; i--; )
      if (e.codePointAt(i) === 47) {
        if (o) {
          n = i + 1;
          break;
        }
      } else r < 0 && (o = !0, r = i + 1);
    return r < 0 ? "" : e.slice(n, r);
  }
  if (t === e)
    return "";
  let l = -1, a = t.length - 1;
  for (; i--; )
    if (e.codePointAt(i) === 47) {
      if (o) {
        n = i + 1;
        break;
      }
    } else
      l < 0 && (o = !0, l = i + 1), a > -1 && (e.codePointAt(i) === t.codePointAt(a--) ? a < 0 && (r = i) : (a = -1, r = l));
  return n === r ? r = l : r < 0 && (r = e.length), e.slice(n, r);
}
function us(e) {
  if (Ke(e), e.length === 0)
    return ".";
  let t = -1, n = e.length, r;
  for (; --n; )
    if (e.codePointAt(n) === 47) {
      if (r) {
        t = n;
        break;
      }
    } else r || (r = !0);
  return t < 0 ? e.codePointAt(0) === 47 ? "/" : "." : t === 1 && e.codePointAt(0) === 47 ? "//" : e.slice(0, t);
}
function ss(e) {
  Ke(e);
  let t = e.length, n = -1, r = 0, i = -1, o = 0, l;
  for (; t--; ) {
    const a = e.codePointAt(t);
    if (a === 47) {
      if (l) {
        r = t + 1;
        break;
      }
      continue;
    }
    n < 0 && (l = !0, n = t + 1), a === 46 ? i < 0 ? i = t : o !== 1 && (o = 1) : i > -1 && (o = -1);
  }
  return i < 0 || n < 0 || // We saw a non-dot character immediately before the dot.
  o === 0 || // The (right-most) trimmed path component is exactly `..`.
  o === 1 && i === n - 1 && i === r + 1 ? "" : e.slice(i, n);
}
function cs(...e) {
  let t = -1, n;
  for (; ++t < e.length; )
    Ke(e[t]), e[t] && (n = n === void 0 ? e[t] : n + "/" + e[t]);
  return n === void 0 ? "." : fs(n);
}
function fs(e) {
  Ke(e);
  const t = e.codePointAt(0) === 47;
  let n = hs(e, !t);
  return n.length === 0 && !t && (n = "."), n.length > 0 && e.codePointAt(e.length - 1) === 47 && (n += "/"), t ? "/" + n : n;
}
function hs(e, t) {
  let n = "", r = 0, i = -1, o = 0, l = -1, a, u;
  for (; ++l <= e.length; ) {
    if (l < e.length)
      a = e.codePointAt(l);
    else {
      if (a === 47)
        break;
      a = 47;
    }
    if (a === 47) {
      if (!(i === l - 1 || o === 1)) if (i !== l - 1 && o === 2) {
        if (n.length < 2 || r !== 2 || n.codePointAt(n.length - 1) !== 46 || n.codePointAt(n.length - 2) !== 46) {
          if (n.length > 2) {
            if (u = n.lastIndexOf("/"), u !== n.length - 1) {
              u < 0 ? (n = "", r = 0) : (n = n.slice(0, u), r = n.length - 1 - n.lastIndexOf("/")), i = l, o = 0;
              continue;
            }
          } else if (n.length > 0) {
            n = "", r = 0, i = l, o = 0;
            continue;
          }
        }
        t && (n = n.length > 0 ? n + "/.." : "..", r = 2);
      } else
        n.length > 0 ? n += "/" + e.slice(i + 1, l) : n = e.slice(i + 1, l), r = l - i - 1;
      i = l, o = 0;
    } else a === 46 && o > -1 ? o++ : o = -1;
  }
  return n;
}
function Ke(e) {
  if (typeof e != "string")
    throw new TypeError(
      "Path must be a string. Received " + JSON.stringify(e)
    );
}
const ps = { cwd: ms };
function ms() {
  return "/";
}
function Vn(e) {
  return !!(e !== null && typeof e == "object" && "href" in e && e.href && "protocol" in e && e.protocol && // @ts-expect-error: indexing is fine.
  e.auth === void 0);
}
function ds(e) {
  if (typeof e == "string")
    e = new URL(e);
  else if (!Vn(e)) {
    const t = new TypeError(
      'The "path" argument must be of type string or an instance of URL. Received `' + e + "`"
    );
    throw t.code = "ERR_INVALID_ARG_TYPE", t;
  }
  if (e.protocol !== "file:") {
    const t = new TypeError("The URL must be of scheme file");
    throw t.code = "ERR_INVALID_URL_SCHEME", t;
  }
  return gs(e);
}
function gs(e) {
  if (e.hostname !== "") {
    const r = new TypeError(
      'File URL host must be "localhost" or empty on darwin'
    );
    throw r.code = "ERR_INVALID_FILE_URL_HOST", r;
  }
  const t = e.pathname;
  let n = -1;
  for (; ++n < t.length; )
    if (t.codePointAt(n) === 37 && t.codePointAt(n + 1) === 50) {
      const r = t.codePointAt(n + 2);
      if (r === 70 || r === 102) {
        const i = new TypeError(
          "File URL path must not include encoded / characters"
        );
        throw i.code = "ERR_INVALID_FILE_URL_PATH", i;
      }
    }
  return decodeURIComponent(t);
}
const Cn = (
  /** @type {const} */
  [
    "history",
    "path",
    "basename",
    "stem",
    "extname",
    "dirname"
  ]
);
class ri {
  /**
   * Create a new virtual file.
   *
   * `options` is treated as:
   *
   * *   `string` or `Uint8Array` — `{value: options}`
   * *   `URL` — `{path: options}`
   * *   `VFile` — shallow copies its data over to the new file
   * *   `object` — all fields are shallow copied over to the new file
   *
   * Path related fields are set in the following order (least specific to
   * most specific): `history`, `path`, `basename`, `stem`, `extname`,
   * `dirname`.
   *
   * You cannot set `dirname` or `extname` without setting either `history`,
   * `path`, `basename`, or `stem` too.
   *
   * @param {Compatible | null | undefined} [value]
   *   File value.
   * @returns
   *   New instance.
   */
  constructor(t) {
    let n;
    t ? Vn(t) ? n = { path: t } : typeof t == "string" || ks(t) ? n = { value: t } : n = t : n = {}, this.cwd = "cwd" in n ? "" : ps.cwd(), this.data = {}, this.history = [], this.messages = [], this.value, this.map, this.result, this.stored;
    let r = -1;
    for (; ++r < Cn.length; ) {
      const o = Cn[r];
      o in n && n[o] !== void 0 && n[o] !== null && (this[o] = o === "history" ? [...n[o]] : n[o]);
    }
    let i;
    for (i in n)
      Cn.includes(i) || (this[i] = n[i]);
  }
  /**
   * Get the basename (including extname) (example: `'index.min.js'`).
   *
   * @returns {string | undefined}
   *   Basename.
   */
  get basename() {
    return typeof this.path == "string" ? he.basename(this.path) : void 0;
  }
  /**
   * Set basename (including extname) (`'index.min.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   *
   * @param {string} basename
   *   Basename.
   * @returns {undefined}
   *   Nothing.
   */
  set basename(t) {
    En(t, "basename"), Sn(t, "basename"), this.path = he.join(this.dirname || "", t);
  }
  /**
   * Get the parent path (example: `'~'`).
   *
   * @returns {string | undefined}
   *   Dirname.
   */
  get dirname() {
    return typeof this.path == "string" ? he.dirname(this.path) : void 0;
  }
  /**
   * Set the parent path (example: `'~'`).
   *
   * Cannot be set if there’s no `path` yet.
   *
   * @param {string | undefined} dirname
   *   Dirname.
   * @returns {undefined}
   *   Nothing.
   */
  set dirname(t) {
    ir(this.basename, "dirname"), this.path = he.join(t || "", this.basename);
  }
  /**
   * Get the extname (including dot) (example: `'.js'`).
   *
   * @returns {string | undefined}
   *   Extname.
   */
  get extname() {
    return typeof this.path == "string" ? he.extname(this.path) : void 0;
  }
  /**
   * Set the extname (including dot) (example: `'.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be set if there’s no `path` yet.
   *
   * @param {string | undefined} extname
   *   Extname.
   * @returns {undefined}
   *   Nothing.
   */
  set extname(t) {
    if (Sn(t, "extname"), ir(this.dirname, "extname"), t) {
      if (t.codePointAt(0) !== 46)
        throw new Error("`extname` must start with `.`");
      if (t.includes(".", 1))
        throw new Error("`extname` cannot contain multiple dots");
    }
    this.path = he.join(this.dirname, this.stem + (t || ""));
  }
  /**
   * Get the full path (example: `'~/index.min.js'`).
   *
   * @returns {string}
   *   Path.
   */
  get path() {
    return this.history[this.history.length - 1];
  }
  /**
   * Set the full path (example: `'~/index.min.js'`).
   *
   * Cannot be nullified.
   * You can set a file URL (a `URL` object with a `file:` protocol) which will
   * be turned into a path with `url.fileURLToPath`.
   *
   * @param {URL | string} path
   *   Path.
   * @returns {undefined}
   *   Nothing.
   */
  set path(t) {
    Vn(t) && (t = ds(t)), En(t, "path"), this.path !== t && this.history.push(t);
  }
  /**
   * Get the stem (basename w/o extname) (example: `'index.min'`).
   *
   * @returns {string | undefined}
   *   Stem.
   */
  get stem() {
    return typeof this.path == "string" ? he.basename(this.path, this.extname) : void 0;
  }
  /**
   * Set the stem (basename w/o extname) (example: `'index.min'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   *
   * @param {string} stem
   *   Stem.
   * @returns {undefined}
   *   Nothing.
   */
  set stem(t) {
    En(t, "stem"), Sn(t, "stem"), this.path = he.join(this.dirname || "", t + (this.extname || ""));
  }
  // Normal prototypal methods.
  /**
   * Create a fatal message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `true` (error; file not usable)
   * and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {never}
   *   Never.
   * @throws {VFileMessage}
   *   Message.
   */
  fail(t, n, r) {
    const i = this.message(t, n, r);
    throw i.fatal = !0, i;
  }
  /**
   * Create an info message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `undefined` (info; change
   * likely not needed) and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */
  info(t, n, r) {
    const i = this.message(t, n, r);
    return i.fatal = void 0, i;
  }
  /**
   * Create a message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `false` (warning; change may be
   * needed) and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */
  message(t, n, r) {
    const i = new Z(
      // @ts-expect-error: the overloads are fine.
      t,
      n,
      r
    );
    return this.path && (i.name = this.path + ":" + i.name, i.file = this.path), i.fatal = !1, this.messages.push(i), i;
  }
  /**
   * Serialize the file.
   *
   * > **Note**: which encodings are supported depends on the engine.
   * > For info on Node.js, see:
   * > <https://nodejs.org/api/util.html#whatwg-supported-encodings>.
   *
   * @param {string | null | undefined} [encoding='utf8']
   *   Character encoding to understand `value` as when it’s a `Uint8Array`
   *   (default: `'utf-8'`).
   * @returns {string}
   *   Serialized file.
   */
  toString(t) {
    return this.value === void 0 ? "" : typeof this.value == "string" ? this.value : new TextDecoder(t || void 0).decode(this.value);
  }
}
function Sn(e, t) {
  if (e && e.includes(he.sep))
    throw new Error(
      "`" + t + "` cannot be a path: did not expect `" + he.sep + "`"
    );
}
function En(e, t) {
  if (!e)
    throw new Error("`" + t + "` cannot be empty");
}
function ir(e, t) {
  if (!e)
    throw new Error("Setting `" + t + "` requires `path` to be set too");
}
function ks(e) {
  return !!(e && typeof e == "object" && "byteLength" in e && "byteOffset" in e);
}
const ys = (
  /**
   * @type {new <Parameters extends Array<unknown>, Result>(property: string | symbol) => (...parameters: Parameters) => Result}
   */
  /** @type {unknown} */
  /**
   * @this {Function}
   * @param {string | symbol} property
   * @returns {(...parameters: Array<unknown>) => unknown}
   */
  function(e) {
    const r = (
      /** @type {Record<string | symbol, Function>} */
      // Prototypes do exist.
      // type-coverage:ignore-next-line
      this.constructor.prototype
    ), i = r[e], o = function() {
      return i.apply(o, arguments);
    };
    return Object.setPrototypeOf(o, r), o;
  }
), xs = {}.hasOwnProperty;
class ut extends ys {
  /**
   * Create a processor.
   */
  constructor() {
    super("copy"), this.Compiler = void 0, this.Parser = void 0, this.attachers = [], this.compiler = void 0, this.freezeIndex = -1, this.frozen = void 0, this.namespace = {}, this.parser = void 0, this.transformers = ls();
  }
  /**
   * Copy a processor.
   *
   * @deprecated
   *   This is a private internal method and should not be used.
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   New *unfrozen* processor ({@linkcode Processor}) that is
   *   configured to work the same as its ancestor.
   *   When the descendant processor is configured in the future it does not
   *   affect the ancestral processor.
   */
  copy() {
    const t = (
      /** @type {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>} */
      new ut()
    );
    let n = -1;
    for (; ++n < this.attachers.length; ) {
      const r = this.attachers[n];
      t.use(...r);
    }
    return t.data(wn(!0, {}, this.namespace)), t;
  }
  /**
   * Configure the processor with info available to all plugins.
   * Information is stored in an object.
   *
   * Typically, options can be given to a specific plugin, but sometimes it
   * makes sense to have information shared with several plugins.
   * For example, a list of HTML elements that are self-closing, which is
   * needed during all phases.
   *
   * > **Note**: setting information cannot occur on *frozen* processors.
   * > Call the processor first to create a new unfrozen processor.
   *
   * > **Note**: to register custom data in TypeScript, augment the
   * > {@linkcode Data} interface.
   *
   * @example
   *   This example show how to get and set info:
   *
   *   ```js
   *   import {unified} from 'unified'
   *
   *   const processor = unified().data('alpha', 'bravo')
   *
   *   processor.data('alpha') // => 'bravo'
   *
   *   processor.data() // => {alpha: 'bravo'}
   *
   *   processor.data({charlie: 'delta'})
   *
   *   processor.data() // => {charlie: 'delta'}
   *   ```
   *
   * @template {keyof Data} Key
   *
   * @overload
   * @returns {Data}
   *
   * @overload
   * @param {Data} dataset
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {Key} key
   * @returns {Data[Key]}
   *
   * @overload
   * @param {Key} key
   * @param {Data[Key]} value
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @param {Data | Key} [key]
   *   Key to get or set, or entire dataset to set, or nothing to get the
   *   entire dataset (optional).
   * @param {Data[Key]} [value]
   *   Value to set (optional).
   * @returns {unknown}
   *   The current processor when setting, the value at `key` when getting, or
   *   the entire dataset when getting without key.
   */
  data(t, n) {
    return typeof t == "string" ? arguments.length === 2 ? (Tn("data", this.frozen), this.namespace[t] = n, this) : xs.call(this.namespace, t) && this.namespace[t] || void 0 : t ? (Tn("data", this.frozen), this.namespace = t, this) : this.namespace;
  }
  /**
   * Freeze a processor.
   *
   * Frozen processors are meant to be extended and not to be configured
   * directly.
   *
   * When a processor is frozen it cannot be unfrozen.
   * New processors working the same way can be created by calling the
   * processor.
   *
   * It’s possible to freeze processors explicitly by calling `.freeze()`.
   * Processors freeze automatically when `.parse()`, `.run()`, `.runSync()`,
   * `.stringify()`, `.process()`, or `.processSync()` are called.
   *
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   The current processor.
   */
  freeze() {
    if (this.frozen)
      return this;
    const t = (
      /** @type {Processor} */
      /** @type {unknown} */
      this
    );
    for (; ++this.freezeIndex < this.attachers.length; ) {
      const [n, ...r] = this.attachers[this.freezeIndex];
      if (r[0] === !1)
        continue;
      r[0] === !0 && (r[0] = void 0);
      const i = n.call(t, ...r);
      typeof i == "function" && this.transformers.use(i);
    }
    return this.frozen = !0, this.freezeIndex = Number.POSITIVE_INFINITY, this;
  }
  /**
   * Parse text to a syntax tree.
   *
   * > **Note**: `parse` freezes the processor if not already *frozen*.
   *
   * > **Note**: `parse` performs the parse phase, not the run phase or other
   * > phases.
   *
   * @param {Compatible | undefined} [file]
   *   file to parse (optional); typically `string` or `VFile`; any value
   *   accepted as `x` in `new VFile(x)`.
   * @returns {ParseTree extends undefined ? Node : ParseTree}
   *   Syntax tree representing `file`.
   */
  parse(t) {
    this.freeze();
    const n = nn(t), r = this.parser || this.Parser;
    return In("parse", r), r(String(n), n);
  }
  /**
   * Process the given file as configured on the processor.
   *
   * > **Note**: `process` freezes the processor if not already *frozen*.
   *
   * > **Note**: `process` performs the parse, run, and stringify phases.
   *
   * @overload
   * @param {Compatible | undefined} file
   * @param {ProcessCallback<VFileWithOutput<CompileResult>>} done
   * @returns {undefined}
   *
   * @overload
   * @param {Compatible | undefined} [file]
   * @returns {Promise<VFileWithOutput<CompileResult>>}
   *
   * @param {Compatible | undefined} [file]
   *   File (optional); typically `string` or `VFile`]; any value accepted as
   *   `x` in `new VFile(x)`.
   * @param {ProcessCallback<VFileWithOutput<CompileResult>> | undefined} [done]
   *   Callback (optional).
   * @returns {Promise<VFile> | undefined}
   *   Nothing if `done` is given.
   *   Otherwise a promise, rejected with a fatal error or resolved with the
   *   processed file.
   *
   *   The parsed, transformed, and compiled value is available at
   *   `file.value` (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most
   *   > compilers return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  process(t, n) {
    const r = this;
    return this.freeze(), In("process", this.parser || this.Parser), An("process", this.compiler || this.Compiler), n ? i(void 0, n) : new Promise(i);
    function i(o, l) {
      const a = nn(t), u = (
        /** @type {HeadTree extends undefined ? Node : HeadTree} */
        /** @type {unknown} */
        r.parse(a)
      );
      r.run(u, a, function(f, c, p) {
        if (f || !c || !p)
          return s(f);
        const h = (
          /** @type {CompileTree extends undefined ? Node : CompileTree} */
          /** @type {unknown} */
          c
        ), g = r.stringify(h, p);
        Cs(g) ? p.value = g : p.result = g, s(
          f,
          /** @type {VFileWithOutput<CompileResult>} */
          p
        );
      });
      function s(f, c) {
        f || !c ? l(f) : o ? o(c) : n(void 0, c);
      }
    }
  }
  /**
   * Process the given file as configured on the processor.
   *
   * An error is thrown if asynchronous transforms are configured.
   *
   * > **Note**: `processSync` freezes the processor if not already *frozen*.
   *
   * > **Note**: `processSync` performs the parse, run, and stringify phases.
   *
   * @param {Compatible | undefined} [file]
   *   File (optional); typically `string` or `VFile`; any value accepted as
   *   `x` in `new VFile(x)`.
   * @returns {VFileWithOutput<CompileResult>}
   *   The processed file.
   *
   *   The parsed, transformed, and compiled value is available at
   *   `file.value` (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most
   *   > compilers return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  processSync(t) {
    let n = !1, r;
    return this.freeze(), In("processSync", this.parser || this.Parser), An("processSync", this.compiler || this.Compiler), this.process(t, i), or("processSync", "process", n), r;
    function i(o, l) {
      n = !0, Kt(o), r = l;
    }
  }
  /**
   * Run *transformers* on a syntax tree.
   *
   * > **Note**: `run` freezes the processor if not already *frozen*.
   *
   * > **Note**: `run` performs the run phase, not other phases.
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
   * @returns {undefined}
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {Compatible | undefined} file
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
   * @returns {undefined}
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {Compatible | undefined} [file]
   * @returns {Promise<TailTree extends undefined ? Node : TailTree>}
   *
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   *   Tree to transform and inspect.
   * @param {(
   *   RunCallback<TailTree extends undefined ? Node : TailTree> |
   *   Compatible
   * )} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} [done]
   *   Callback (optional).
   * @returns {Promise<TailTree extends undefined ? Node : TailTree> | undefined}
   *   Nothing if `done` is given.
   *   Otherwise, a promise rejected with a fatal error or resolved with the
   *   transformed tree.
   */
  run(t, n, r) {
    lr(t), this.freeze();
    const i = this.transformers;
    return !r && typeof n == "function" && (r = n, n = void 0), r ? o(void 0, r) : new Promise(o);
    function o(l, a) {
      const u = nn(n);
      i.run(t, u, s);
      function s(f, c, p) {
        const h = (
          /** @type {TailTree extends undefined ? Node : TailTree} */
          c || t
        );
        f ? a(f) : l ? l(h) : r(void 0, h, p);
      }
    }
  }
  /**
   * Run *transformers* on a syntax tree.
   *
   * An error is thrown if asynchronous transforms are configured.
   *
   * > **Note**: `runSync` freezes the processor if not already *frozen*.
   *
   * > **Note**: `runSync` performs the run phase, not other phases.
   *
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   *   Tree to transform and inspect.
   * @param {Compatible | undefined} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @returns {TailTree extends undefined ? Node : TailTree}
   *   Transformed tree.
   */
  runSync(t, n) {
    let r = !1, i;
    return this.run(t, n, o), or("runSync", "run", r), i;
    function o(l, a) {
      Kt(l), i = a, r = !0;
    }
  }
  /**
   * Compile a syntax tree.
   *
   * > **Note**: `stringify` freezes the processor if not already *frozen*.
   *
   * > **Note**: `stringify` performs the stringify phase, not the run phase
   * > or other phases.
   *
   * @param {CompileTree extends undefined ? Node : CompileTree} tree
   *   Tree to compile.
   * @param {Compatible | undefined} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @returns {CompileResult extends undefined ? Value : CompileResult}
   *   Textual representation of the tree (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most compilers
   *   > return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  stringify(t, n) {
    this.freeze();
    const r = nn(n), i = this.compiler || this.Compiler;
    return An("stringify", i), lr(t), i(t, r);
  }
  /**
   * Configure the processor to use a plugin, a list of usable values, or a
   * preset.
   *
   * If the processor is already using a plugin, the previous plugin
   * configuration is changed based on the options that are passed in.
   * In other words, the plugin is not added a second time.
   *
   * > **Note**: `use` cannot be called on *frozen* processors.
   * > Call the processor first to create a new unfrozen processor.
   *
   * @example
   *   There are many ways to pass plugins to `.use()`.
   *   This example gives an overview:
   *
   *   ```js
   *   import {unified} from 'unified'
   *
   *   unified()
   *     // Plugin with options:
   *     .use(pluginA, {x: true, y: true})
   *     // Passing the same plugin again merges configuration (to `{x: true, y: false, z: true}`):
   *     .use(pluginA, {y: false, z: true})
   *     // Plugins:
   *     .use([pluginB, pluginC])
   *     // Two plugins, the second with options:
   *     .use([pluginD, [pluginE, {}]])
   *     // Preset with plugins and settings:
   *     .use({plugins: [pluginF, [pluginG, {}]], settings: {position: false}})
   *     // Settings only:
   *     .use({settings: {position: false}})
   *   ```
   *
   * @template {Array<unknown>} [Parameters=[]]
   * @template {Node | string | undefined} [Input=undefined]
   * @template [Output=Input]
   *
   * @overload
   * @param {Preset | null | undefined} [preset]
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {PluggableList} list
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {Plugin<Parameters, Input, Output>} plugin
   * @param {...(Parameters | [boolean])} parameters
   * @returns {UsePlugin<ParseTree, HeadTree, TailTree, CompileTree, CompileResult, Input, Output>}
   *
   * @param {PluggableList | Plugin | Preset | null | undefined} value
   *   Usable value.
   * @param {...unknown} parameters
   *   Parameters, when a plugin is given as a usable value.
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   Current processor.
   */
  use(t, ...n) {
    const r = this.attachers, i = this.namespace;
    if (Tn("use", this.frozen), t != null) if (typeof t == "function")
      u(t, n);
    else if (typeof t == "object")
      Array.isArray(t) ? a(t) : l(t);
    else
      throw new TypeError("Expected usable value, not `" + t + "`");
    return this;
    function o(s) {
      if (typeof s == "function")
        u(s, []);
      else if (typeof s == "object")
        if (Array.isArray(s)) {
          const [f, ...c] = (
            /** @type {PluginTuple<Array<unknown>>} */
            s
          );
          u(f, c);
        } else
          l(s);
      else
        throw new TypeError("Expected usable value, not `" + s + "`");
    }
    function l(s) {
      if (!("plugins" in s) && !("settings" in s))
        throw new Error(
          "Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither"
        );
      a(s.plugins), s.settings && (i.settings = wn(!0, i.settings, s.settings));
    }
    function a(s) {
      let f = -1;
      if (s != null) if (Array.isArray(s))
        for (; ++f < s.length; ) {
          const c = s[f];
          o(c);
        }
      else
        throw new TypeError("Expected a list of plugins, not `" + s + "`");
    }
    function u(s, f) {
      let c = -1, p = -1;
      for (; ++c < r.length; )
        if (r[c][0] === s) {
          p = c;
          break;
        }
      if (p === -1)
        r.push([s, ...f]);
      else if (f.length > 0) {
        let [h, ...g] = f;
        const x = r[p][1];
        $n(x) && $n(h) && (h = wn(!0, x, h)), r[p] = [s, h, ...g];
      }
    }
  }
}
const bs = new ut().freeze();
function In(e, t) {
  if (typeof t != "function")
    throw new TypeError("Cannot `" + e + "` without `parser`");
}
function An(e, t) {
  if (typeof t != "function")
    throw new TypeError("Cannot `" + e + "` without `compiler`");
}
function Tn(e, t) {
  if (t)
    throw new Error(
      "Cannot call `" + e + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`."
    );
}
function lr(e) {
  if (!$n(e) || typeof e.type != "string")
    throw new TypeError("Expected node, got `" + e + "`");
}
function or(e, t, n) {
  if (!n)
    throw new Error(
      "`" + e + "` finished async. Use `" + t + "` instead"
    );
}
function nn(e) {
  return ws(e) ? e : new ri(e);
}
function ws(e) {
  return !!(e && typeof e == "object" && "message" in e && "messages" in e);
}
function Cs(e) {
  return typeof e == "string" || Ss(e);
}
function Ss(e) {
  return !!(e && typeof e == "object" && "byteLength" in e && "byteOffset" in e);
}
const Es = "https://github.com/remarkjs/react-markdown/blob/main/changelog.md", ar = [], ur = { allowDangerousHtml: !0 }, Is = /^(https?|ircs?|mailto|xmpp)$/i, As = [
  { from: "astPlugins", id: "remove-buggy-html-in-markdown-parser" },
  { from: "allowDangerousHtml", id: "remove-buggy-html-in-markdown-parser" },
  {
    from: "allowNode",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "allowElement"
  },
  {
    from: "allowedTypes",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "allowedElements"
  },
  { from: "className", id: "remove-classname" },
  {
    from: "disallowedTypes",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "disallowedElements"
  },
  { from: "escapeHtml", id: "remove-buggy-html-in-markdown-parser" },
  { from: "includeElementIndex", id: "#remove-includeelementindex" },
  {
    from: "includeNodeIndex",
    id: "change-includenodeindex-to-includeelementindex"
  },
  { from: "linkTarget", id: "remove-linktarget" },
  { from: "plugins", id: "change-plugins-to-remarkplugins", to: "remarkPlugins" },
  { from: "rawSourcePos", id: "#remove-rawsourcepos" },
  { from: "renderers", id: "change-renderers-to-components", to: "components" },
  { from: "source", id: "change-source-to-children", to: "children" },
  { from: "sourcePos", id: "#remove-sourcepos" },
  { from: "transformImageUri", id: "#add-urltransform", to: "urlTransform" },
  { from: "transformLinkUri", id: "#add-urltransform", to: "urlTransform" }
];
function sr(e) {
  const t = Ts(e), n = _s(e);
  return vs(t.runSync(t.parse(n), n), e);
}
function Ts(e) {
  const t = e.rehypePlugins || ar, n = e.remarkPlugins || ar, r = e.remarkRehypeOptions ? { ...e.remarkRehypeOptions, ...ur } : ur;
  return bs().use(su).use(n).use(rs, r).use(t);
}
function _s(e) {
  const t = e.children || "", n = new ri();
  return typeof t == "string" && (n.value = t), n;
}
function vs(e, t) {
  const n = t.allowedElements, r = t.allowElement, i = t.components, o = t.disallowedElements, l = t.skipHtml, a = t.unwrapDisallowed, u = t.urlTransform || Ls;
  for (const f of As)
    Object.hasOwn(t, f.from) && ("" + f.from + (f.to ? "use `" + f.to + "` instead" : "remove it") + Es + f.id, void 0);
  return at(e, s), ql(e, {
    Fragment: xr,
    components: i,
    ignoreInvalidStyle: !0,
    jsx: B,
    jsxs: ye,
    passKeys: !0,
    passNode: !0
  });
  function s(f, c, p) {
    if (f.type === "raw" && p && typeof c == "number")
      return l ? p.children.splice(c, 1) : p.children[c] = { type: "text", value: f.value }, c;
    if (f.type === "element") {
      let h;
      for (h in yn)
        if (Object.hasOwn(yn, h) && Object.hasOwn(f.properties, h)) {
          const g = f.properties[h], x = yn[h];
          (x === null || x.includes(f.tagName)) && (f.properties[h] = u(String(g || ""), h, f));
        }
    }
    if (f.type === "element") {
      let h = n ? !n.includes(f.tagName) : o ? o.includes(f.tagName) : !1;
      if (!h && r && typeof c == "number" && (h = !r(f, c, p)), h && p && typeof c == "number")
        return a && f.children ? p.children.splice(c, 1, ...f.children) : p.children.splice(c, 1), c;
    }
  }
}
function Ls(e) {
  const t = e.indexOf(":"), n = e.indexOf("?"), r = e.indexOf("#"), i = e.indexOf("/");
  return (
    // If there is no protocol, it’s relative.
    t === -1 || // If the first colon is after a `?`, `#`, or `/`, it’s not a protocol.
    i !== -1 && t > i || n !== -1 && t > n || r !== -1 && t > r || // It is a protocol, it should be allowed.
    Is.test(e.slice(0, t)) ? e : ""
  );
}
function cr(e, t) {
  const n = String(e);
  if (typeof t != "string")
    throw new TypeError("Expected character");
  let r = 0, i = n.indexOf(t);
  for (; i !== -1; )
    r++, i = n.indexOf(t, i + t.length);
  return r;
}
function Ps(e) {
  if (typeof e != "string")
    throw new TypeError("Expected a string");
  return e.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
function zs(e, t, n) {
  const i = dn((n || {}).ignore || []), o = Ds(t);
  let l = -1;
  for (; ++l < o.length; )
    ni(e, "text", a);
  function a(s, f) {
    let c = -1, p;
    for (; ++c < f.length; ) {
      const h = f[c], g = p ? p.children : void 0;
      if (i(
        h,
        g ? g.indexOf(h) : void 0,
        p
      ))
        return;
      p = h;
    }
    if (p)
      return u(s, f);
  }
  function u(s, f) {
    const c = f[f.length - 1], p = o[l][0], h = o[l][1];
    let g = 0;
    const S = c.children.indexOf(s);
    let k = !1, A = [];
    p.lastIndex = 0;
    let E = p.exec(s.value);
    for (; E; ) {
      const z = E.index, D = {
        index: E.index,
        input: E.input,
        stack: [...f, s]
      };
      let w = h(...E, D);
      if (typeof w == "string" && (w = w.length > 0 ? { type: "text", value: w } : void 0), w === !1 ? p.lastIndex = z + 1 : (g !== z && A.push({
        type: "text",
        value: s.value.slice(g, z)
      }), Array.isArray(w) ? A.push(...w) : w && A.push(w), g = z + E[0].length, k = !0), !p.global)
        break;
      E = p.exec(s.value);
    }
    return k ? (g < s.value.length && A.push({ type: "text", value: s.value.slice(g) }), c.children.splice(S, 1, ...A)) : A = [s], S + A.length;
  }
}
function Ds(e) {
  const t = [];
  if (!Array.isArray(e))
    throw new TypeError("Expected find and replace tuple or list of tuples");
  const n = !e[0] || Array.isArray(e[0]) ? e : [e];
  let r = -1;
  for (; ++r < n.length; ) {
    const i = n[r];
    t.push([Fs(i[0]), Rs(i[1])]);
  }
  return t;
}
function Fs(e) {
  return typeof e == "string" ? new RegExp(Ps(e), "g") : e;
}
function Rs(e) {
  return typeof e == "function" ? e : function() {
    return e;
  };
}
const _n = "phrasing", vn = ["autolink", "link", "image", "label"];
function Ms() {
  return {
    transforms: [$s],
    enter: {
      literalAutolink: Ns,
      literalAutolinkEmail: Ln,
      literalAutolinkHttp: Ln,
      literalAutolinkWww: Ln
    },
    exit: {
      literalAutolink: Us,
      literalAutolinkEmail: Hs,
      literalAutolinkHttp: Bs,
      literalAutolinkWww: js
    }
  };
}
function Os() {
  return {
    unsafe: [
      {
        character: "@",
        before: "[+\\-.\\w]",
        after: "[\\-.\\w]",
        inConstruct: _n,
        notInConstruct: vn
      },
      {
        character: ".",
        before: "[Ww]",
        after: "[\\-.\\w]",
        inConstruct: _n,
        notInConstruct: vn
      },
      {
        character: ":",
        before: "[ps]",
        after: "\\/",
        inConstruct: _n,
        notInConstruct: vn
      }
    ]
  };
}
function Ns(e) {
  this.enter({ type: "link", title: null, url: "", children: [] }, e);
}
function Ln(e) {
  this.config.enter.autolinkProtocol.call(this, e);
}
function Bs(e) {
  this.config.exit.autolinkProtocol.call(this, e);
}
function js(e) {
  this.config.exit.data.call(this, e);
  const t = this.stack[this.stack.length - 1];
  t.type, t.url = "http://" + this.sliceSerialize(e);
}
function Hs(e) {
  this.config.exit.autolinkEmail.call(this, e);
}
function Us(e) {
  this.exit(e);
}
function $s(e) {
  zs(
    e,
    [
      [/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi, Vs],
      [new RegExp("(?<=^|\\s|\\p{P}|\\p{S})([-.\\w+]+)@([-\\w]+(?:\\.[-\\w]+)+)", "gu"), qs]
    ],
    { ignore: ["link", "linkReference"] }
  );
}
function Vs(e, t, n, r, i) {
  let o = "";
  if (!ii(i) || (/^w/i.test(t) && (n = t + n, t = "", o = "http://"), !Ws(n)))
    return !1;
  const l = Gs(n + r);
  if (!l[0]) return !1;
  const a = {
    type: "link",
    title: null,
    url: o + t + l[0],
    children: [{ type: "text", value: t + l[0] }]
  };
  return l[1] ? [a, { type: "text", value: l[1] }] : a;
}
function qs(e, t, n, r) {
  return (
    // Not an expected previous character.
    !ii(r, !0) || // Label ends in not allowed character.
    /[-\d_]$/.test(n) ? !1 : {
      type: "link",
      title: null,
      url: "mailto:" + t + "@" + n,
      children: [{ type: "text", value: t + "@" + n }]
    }
  );
}
function Ws(e) {
  const t = e.split(".");
  return !(t.length < 2 || t[t.length - 1] && (/_/.test(t[t.length - 1]) || !/[a-zA-Z\d]/.test(t[t.length - 1])) || t[t.length - 2] && (/_/.test(t[t.length - 2]) || !/[a-zA-Z\d]/.test(t[t.length - 2])));
}
function Gs(e) {
  const t = /[!"&'),.:;<>?\]}]+$/.exec(e);
  if (!t)
    return [e, void 0];
  e = e.slice(0, t.index);
  let n = t[0], r = n.indexOf(")");
  const i = cr(e, "(");
  let o = cr(e, ")");
  for (; r !== -1 && i > o; )
    e += n.slice(0, r + 1), n = n.slice(r + 1), r = n.indexOf(")"), o++;
  return [e, n];
}
function ii(e, t) {
  const n = e.input.charCodeAt(e.index - 1);
  return (e.index === 0 || Te(n) || hn(n)) && // If it’s an email, the previous character should not be a slash.
  (!t || n !== 47);
}
li.peek = tc;
function Ys() {
  this.buffer();
}
function Xs(e) {
  this.enter({ type: "footnoteReference", identifier: "", label: "" }, e);
}
function Qs() {
  this.buffer();
}
function Ks(e) {
  this.enter(
    { type: "footnoteDefinition", identifier: "", label: "", children: [] },
    e
  );
}
function Js(e) {
  const t = this.resume(), n = this.stack[this.stack.length - 1];
  n.type, n.identifier = fe(
    this.sliceSerialize(e)
  ).toLowerCase(), n.label = t;
}
function Zs(e) {
  this.exit(e);
}
function ec(e) {
  const t = this.resume(), n = this.stack[this.stack.length - 1];
  n.type, n.identifier = fe(
    this.sliceSerialize(e)
  ).toLowerCase(), n.label = t;
}
function nc(e) {
  this.exit(e);
}
function tc() {
  return "[";
}
function li(e, t, n, r) {
  const i = n.createTracker(r);
  let o = i.move("[^");
  const l = n.enter("footnoteReference"), a = n.enter("reference");
  return o += i.move(
    n.safe(n.associationId(e), { after: "]", before: o })
  ), a(), l(), o += i.move("]"), o;
}
function rc() {
  return {
    enter: {
      gfmFootnoteCallString: Ys,
      gfmFootnoteCall: Xs,
      gfmFootnoteDefinitionLabelString: Qs,
      gfmFootnoteDefinition: Ks
    },
    exit: {
      gfmFootnoteCallString: Js,
      gfmFootnoteCall: Zs,
      gfmFootnoteDefinitionLabelString: ec,
      gfmFootnoteDefinition: nc
    }
  };
}
function ic(e) {
  let t = !1;
  return e && e.firstLineBlank && (t = !0), {
    handlers: { footnoteDefinition: n, footnoteReference: li },
    // This is on by default already.
    unsafe: [{ character: "[", inConstruct: ["label", "phrasing", "reference"] }]
  };
  function n(r, i, o, l) {
    const a = o.createTracker(l);
    let u = a.move("[^");
    const s = o.enter("footnoteDefinition"), f = o.enter("label");
    return u += a.move(
      o.safe(o.associationId(r), { before: u, after: "]" })
    ), f(), u += a.move("]:"), r.children && r.children.length > 0 && (a.shift(4), u += a.move(
      (t ? `
` : " ") + o.indentLines(
        o.containerFlow(r, a.current()),
        t ? oi : lc
      )
    )), s(), u;
  }
}
function lc(e, t, n) {
  return t === 0 ? e : oi(e, t, n);
}
function oi(e, t, n) {
  return (n ? "" : "    ") + e;
}
const oc = [
  "autolink",
  "destinationLiteral",
  "destinationRaw",
  "reference",
  "titleQuote",
  "titleApostrophe"
];
ai.peek = fc;
function ac() {
  return {
    canContainEols: ["delete"],
    enter: { strikethrough: sc },
    exit: { strikethrough: cc }
  };
}
function uc() {
  return {
    unsafe: [
      {
        character: "~",
        inConstruct: "phrasing",
        notInConstruct: oc
      }
    ],
    handlers: { delete: ai }
  };
}
function sc(e) {
  this.enter({ type: "delete", children: [] }, e);
}
function cc(e) {
  this.exit(e);
}
function ai(e, t, n, r) {
  const i = n.createTracker(r), o = n.enter("strikethrough");
  let l = i.move("~~");
  return l += n.containerPhrasing(e, {
    ...i.current(),
    before: l,
    after: "~"
  }), l += i.move("~~"), o(), l;
}
function fc() {
  return "~";
}
function hc(e) {
  return e.length;
}
function pc(e, t) {
  const n = t || {}, r = (n.align || []).concat(), i = n.stringLength || hc, o = [], l = [], a = [], u = [];
  let s = 0, f = -1;
  for (; ++f < e.length; ) {
    const x = [], S = [];
    let k = -1;
    for (e[f].length > s && (s = e[f].length); ++k < e[f].length; ) {
      const A = mc(e[f][k]);
      if (n.alignDelimiters !== !1) {
        const E = i(A);
        S[k] = E, (u[k] === void 0 || E > u[k]) && (u[k] = E);
      }
      x.push(A);
    }
    l[f] = x, a[f] = S;
  }
  let c = -1;
  if (typeof r == "object" && "length" in r)
    for (; ++c < s; )
      o[c] = fr(r[c]);
  else {
    const x = fr(r);
    for (; ++c < s; )
      o[c] = x;
  }
  c = -1;
  const p = [], h = [];
  for (; ++c < s; ) {
    const x = o[c];
    let S = "", k = "";
    x === 99 ? (S = ":", k = ":") : x === 108 ? S = ":" : x === 114 && (k = ":");
    let A = n.alignDelimiters === !1 ? 1 : Math.max(
      1,
      u[c] - S.length - k.length
    );
    const E = S + "-".repeat(A) + k;
    n.alignDelimiters !== !1 && (A = S.length + A + k.length, A > u[c] && (u[c] = A), h[c] = A), p[c] = E;
  }
  l.splice(1, 0, p), a.splice(1, 0, h), f = -1;
  const g = [];
  for (; ++f < l.length; ) {
    const x = l[f], S = a[f];
    c = -1;
    const k = [];
    for (; ++c < s; ) {
      const A = x[c] || "";
      let E = "", z = "";
      if (n.alignDelimiters !== !1) {
        const D = u[c] - (S[c] || 0), w = o[c];
        w === 114 ? E = " ".repeat(D) : w === 99 ? D % 2 ? (E = " ".repeat(D / 2 + 0.5), z = " ".repeat(D / 2 - 0.5)) : (E = " ".repeat(D / 2), z = E) : z = " ".repeat(D);
      }
      n.delimiterStart !== !1 && !c && k.push("|"), n.padding !== !1 && // Don’t add the opening space if we’re not aligning and the cell is
      // empty: there will be a closing space.
      !(n.alignDelimiters === !1 && A === "") && (n.delimiterStart !== !1 || c) && k.push(" "), n.alignDelimiters !== !1 && k.push(E), k.push(A), n.alignDelimiters !== !1 && k.push(z), n.padding !== !1 && k.push(" "), (n.delimiterEnd !== !1 || c !== s - 1) && k.push("|");
    }
    g.push(
      n.delimiterEnd === !1 ? k.join("").replace(/ +$/, "") : k.join("")
    );
  }
  return g.join(`
`);
}
function mc(e) {
  return e == null ? "" : String(e);
}
function fr(e) {
  const t = typeof e == "string" ? e.codePointAt(0) : 0;
  return t === 67 || t === 99 ? 99 : t === 76 || t === 108 ? 108 : t === 82 || t === 114 ? 114 : 0;
}
function dc(e, t, n, r) {
  const i = n.enter("blockquote"), o = n.createTracker(r);
  o.move("> "), o.shift(2);
  const l = n.indentLines(
    n.containerFlow(e, o.current()),
    gc
  );
  return i(), l;
}
function gc(e, t, n) {
  return ">" + (n ? "" : " ") + e;
}
function kc(e, t) {
  return hr(e, t.inConstruct, !0) && !hr(e, t.notInConstruct, !1);
}
function hr(e, t, n) {
  if (typeof t == "string" && (t = [t]), !t || t.length === 0)
    return n;
  let r = -1;
  for (; ++r < t.length; )
    if (e.includes(t[r]))
      return !0;
  return !1;
}
function pr(e, t, n, r) {
  let i = -1;
  for (; ++i < n.unsafe.length; )
    if (n.unsafe[i].character === `
` && kc(n.stack, n.unsafe[i]))
      return /[ \t]/.test(r.before) ? "" : " ";
  return `\\
`;
}
function yc(e, t) {
  const n = String(e);
  let r = n.indexOf(t), i = r, o = 0, l = 0;
  if (typeof t != "string")
    throw new TypeError("Expected substring");
  for (; r !== -1; )
    r === i ? ++o > l && (l = o) : o = 1, i = r + t.length, r = n.indexOf(t, i);
  return l;
}
function xc(e, t) {
  return !!(t.options.fences === !1 && e.value && // If there’s no info…
  !e.lang && // And there’s a non-whitespace character…
  /[^ \r\n]/.test(e.value) && // And the value doesn’t start or end in a blank…
  !/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(e.value));
}
function bc(e) {
  const t = e.options.fence || "`";
  if (t !== "`" && t !== "~")
    throw new Error(
      "Cannot serialize code with `" + t + "` for `options.fence`, expected `` ` `` or `~`"
    );
  return t;
}
function wc(e, t, n, r) {
  const i = bc(n), o = e.value || "", l = i === "`" ? "GraveAccent" : "Tilde";
  if (xc(e, n)) {
    const c = n.enter("codeIndented"), p = n.indentLines(o, Cc);
    return c(), p;
  }
  const a = n.createTracker(r), u = i.repeat(Math.max(yc(o, i) + 1, 3)), s = n.enter("codeFenced");
  let f = a.move(u);
  if (e.lang) {
    const c = n.enter(`codeFencedLang${l}`);
    f += a.move(
      n.safe(e.lang, {
        before: f,
        after: " ",
        encode: ["`"],
        ...a.current()
      })
    ), c();
  }
  if (e.lang && e.meta) {
    const c = n.enter(`codeFencedMeta${l}`);
    f += a.move(" "), f += a.move(
      n.safe(e.meta, {
        before: f,
        after: `
`,
        encode: ["`"],
        ...a.current()
      })
    ), c();
  }
  return f += a.move(`
`), o && (f += a.move(o + `
`)), f += a.move(u), s(), f;
}
function Cc(e, t, n) {
  return (n ? "" : "    ") + e;
}
function st(e) {
  const t = e.options.quote || '"';
  if (t !== '"' && t !== "'")
    throw new Error(
      "Cannot serialize title with `" + t + "` for `options.quote`, expected `\"`, or `'`"
    );
  return t;
}
function Sc(e, t, n, r) {
  const i = st(n), o = i === '"' ? "Quote" : "Apostrophe", l = n.enter("definition");
  let a = n.enter("label");
  const u = n.createTracker(r);
  let s = u.move("[");
  return s += u.move(
    n.safe(n.associationId(e), {
      before: s,
      after: "]",
      ...u.current()
    })
  ), s += u.move("]: "), a(), // If there’s no url, or…
  !e.url || // If there are control characters or whitespace.
  /[\0- \u007F]/.test(e.url) ? (a = n.enter("destinationLiteral"), s += u.move("<"), s += u.move(
    n.safe(e.url, { before: s, after: ">", ...u.current() })
  ), s += u.move(">")) : (a = n.enter("destinationRaw"), s += u.move(
    n.safe(e.url, {
      before: s,
      after: e.title ? " " : `
`,
      ...u.current()
    })
  )), a(), e.title && (a = n.enter(`title${o}`), s += u.move(" " + i), s += u.move(
    n.safe(e.title, {
      before: s,
      after: i,
      ...u.current()
    })
  ), s += u.move(i), a()), l(), s;
}
function Ec(e) {
  const t = e.options.emphasis || "*";
  if (t !== "*" && t !== "_")
    throw new Error(
      "Cannot serialize emphasis with `" + t + "` for `options.emphasis`, expected `*`, or `_`"
    );
  return t;
}
function Ye(e) {
  return "&#x" + e.toString(16).toUpperCase() + ";";
}
function cn(e, t, n) {
  const r = Me(e), i = Me(t);
  return r === void 0 ? i === void 0 ? (
    // Letter inside:
    // we have to encode *both* letters for `_` as it is looser.
    // it already forms for `*` (and GFMs `~`).
    n === "_" ? { inside: !0, outside: !0 } : { inside: !1, outside: !1 }
  ) : i === 1 ? (
    // Whitespace inside: encode both (letter, whitespace).
    { inside: !0, outside: !0 }
  ) : (
    // Punctuation inside: encode outer (letter)
    { inside: !1, outside: !0 }
  ) : r === 1 ? i === void 0 ? (
    // Letter inside: already forms.
    { inside: !1, outside: !1 }
  ) : i === 1 ? (
    // Whitespace inside: encode both (whitespace).
    { inside: !0, outside: !0 }
  ) : (
    // Punctuation inside: already forms.
    { inside: !1, outside: !1 }
  ) : i === void 0 ? (
    // Letter inside: already forms.
    { inside: !1, outside: !1 }
  ) : i === 1 ? (
    // Whitespace inside: encode inner (whitespace).
    { inside: !0, outside: !1 }
  ) : (
    // Punctuation inside: already forms.
    { inside: !1, outside: !1 }
  );
}
ui.peek = Ic;
function ui(e, t, n, r) {
  const i = Ec(n), o = n.enter("emphasis"), l = n.createTracker(r), a = l.move(i);
  let u = l.move(
    n.containerPhrasing(e, {
      after: i,
      before: a,
      ...l.current()
    })
  );
  const s = u.charCodeAt(0), f = cn(
    r.before.charCodeAt(r.before.length - 1),
    s,
    i
  );
  f.inside && (u = Ye(s) + u.slice(1));
  const c = u.charCodeAt(u.length - 1), p = cn(r.after.charCodeAt(0), c, i);
  p.inside && (u = u.slice(0, -1) + Ye(c));
  const h = l.move(i);
  return o(), n.attentionEncodeSurroundingInfo = {
    after: p.outside,
    before: f.outside
  }, a + u + h;
}
function Ic(e, t, n) {
  return n.options.emphasis || "*";
}
function Ac(e, t) {
  let n = !1;
  return at(e, function(r) {
    if ("value" in r && /\r?\n|\r/.test(r.value) || r.type === "break")
      return n = !0, Hn;
  }), !!((!e.depth || e.depth < 3) && et(e) && (t.options.setext || n));
}
function Tc(e, t, n, r) {
  const i = Math.max(Math.min(6, e.depth || 1), 1), o = n.createTracker(r);
  if (Ac(e, n)) {
    const f = n.enter("headingSetext"), c = n.enter("phrasing"), p = n.containerPhrasing(e, {
      ...o.current(),
      before: `
`,
      after: `
`
    });
    return c(), f(), p + `
` + (i === 1 ? "=" : "-").repeat(
      // The whole size…
      p.length - // Minus the position of the character after the last EOL (or
      // 0 if there is none)…
      (Math.max(p.lastIndexOf("\r"), p.lastIndexOf(`
`)) + 1)
    );
  }
  const l = "#".repeat(i), a = n.enter("headingAtx"), u = n.enter("phrasing");
  o.move(l + " ");
  let s = n.containerPhrasing(e, {
    before: "# ",
    after: `
`,
    ...o.current()
  });
  return /^[\t ]/.test(s) && (s = Ye(s.charCodeAt(0)) + s.slice(1)), s = s ? l + " " + s : l, n.options.closeAtx && (s += " " + l), u(), a(), s;
}
si.peek = _c;
function si(e) {
  return e.value || "";
}
function _c() {
  return "<";
}
ci.peek = vc;
function ci(e, t, n, r) {
  const i = st(n), o = i === '"' ? "Quote" : "Apostrophe", l = n.enter("image");
  let a = n.enter("label");
  const u = n.createTracker(r);
  let s = u.move("![");
  return s += u.move(
    n.safe(e.alt, { before: s, after: "]", ...u.current() })
  ), s += u.move("]("), a(), // If there’s no url but there is a title…
  !e.url && e.title || // If there are control characters or whitespace.
  /[\0- \u007F]/.test(e.url) ? (a = n.enter("destinationLiteral"), s += u.move("<"), s += u.move(
    n.safe(e.url, { before: s, after: ">", ...u.current() })
  ), s += u.move(">")) : (a = n.enter("destinationRaw"), s += u.move(
    n.safe(e.url, {
      before: s,
      after: e.title ? " " : ")",
      ...u.current()
    })
  )), a(), e.title && (a = n.enter(`title${o}`), s += u.move(" " + i), s += u.move(
    n.safe(e.title, {
      before: s,
      after: i,
      ...u.current()
    })
  ), s += u.move(i), a()), s += u.move(")"), l(), s;
}
function vc() {
  return "!";
}
fi.peek = Lc;
function fi(e, t, n, r) {
  const i = e.referenceType, o = n.enter("imageReference");
  let l = n.enter("label");
  const a = n.createTracker(r);
  let u = a.move("![");
  const s = n.safe(e.alt, {
    before: u,
    after: "]",
    ...a.current()
  });
  u += a.move(s + "]["), l();
  const f = n.stack;
  n.stack = [], l = n.enter("reference");
  const c = n.safe(n.associationId(e), {
    before: u,
    after: "]",
    ...a.current()
  });
  return l(), n.stack = f, o(), i === "full" || !s || s !== c ? u += a.move(c + "]") : i === "shortcut" ? u = u.slice(0, -1) : u += a.move("]"), u;
}
function Lc() {
  return "!";
}
hi.peek = Pc;
function hi(e, t, n) {
  let r = e.value || "", i = "`", o = -1;
  for (; new RegExp("(^|[^`])" + i + "([^`]|$)").test(r); )
    i += "`";
  for (/[^ \r\n]/.test(r) && (/^[ \r\n]/.test(r) && /[ \r\n]$/.test(r) || /^`|`$/.test(r)) && (r = " " + r + " "); ++o < n.unsafe.length; ) {
    const l = n.unsafe[o], a = n.compilePattern(l);
    let u;
    if (l.atBreak)
      for (; u = a.exec(r); ) {
        let s = u.index;
        r.charCodeAt(s) === 10 && r.charCodeAt(s - 1) === 13 && s--, r = r.slice(0, s) + " " + r.slice(u.index + 1);
      }
  }
  return i + r + i;
}
function Pc() {
  return "`";
}
function pi(e, t) {
  const n = et(e);
  return !!(!t.options.resourceLink && // If there’s a url…
  e.url && // And there’s a no title…
  !e.title && // And the content of `node` is a single text node…
  e.children && e.children.length === 1 && e.children[0].type === "text" && // And if the url is the same as the content…
  (n === e.url || "mailto:" + n === e.url) && // And that starts w/ a protocol…
  /^[a-z][a-z+.-]+:/i.test(e.url) && // And that doesn’t contain ASCII control codes (character escapes and
  // references don’t work), space, or angle brackets…
  !/[\0- <>\u007F]/.test(e.url));
}
mi.peek = zc;
function mi(e, t, n, r) {
  const i = st(n), o = i === '"' ? "Quote" : "Apostrophe", l = n.createTracker(r);
  let a, u;
  if (pi(e, n)) {
    const f = n.stack;
    n.stack = [], a = n.enter("autolink");
    let c = l.move("<");
    return c += l.move(
      n.containerPhrasing(e, {
        before: c,
        after: ">",
        ...l.current()
      })
    ), c += l.move(">"), a(), n.stack = f, c;
  }
  a = n.enter("link"), u = n.enter("label");
  let s = l.move("[");
  return s += l.move(
    n.containerPhrasing(e, {
      before: s,
      after: "](",
      ...l.current()
    })
  ), s += l.move("]("), u(), // If there’s no url but there is a title…
  !e.url && e.title || // If there are control characters or whitespace.
  /[\0- \u007F]/.test(e.url) ? (u = n.enter("destinationLiteral"), s += l.move("<"), s += l.move(
    n.safe(e.url, { before: s, after: ">", ...l.current() })
  ), s += l.move(">")) : (u = n.enter("destinationRaw"), s += l.move(
    n.safe(e.url, {
      before: s,
      after: e.title ? " " : ")",
      ...l.current()
    })
  )), u(), e.title && (u = n.enter(`title${o}`), s += l.move(" " + i), s += l.move(
    n.safe(e.title, {
      before: s,
      after: i,
      ...l.current()
    })
  ), s += l.move(i), u()), s += l.move(")"), a(), s;
}
function zc(e, t, n) {
  return pi(e, n) ? "<" : "[";
}
di.peek = Dc;
function di(e, t, n, r) {
  const i = e.referenceType, o = n.enter("linkReference");
  let l = n.enter("label");
  const a = n.createTracker(r);
  let u = a.move("[");
  const s = n.containerPhrasing(e, {
    before: u,
    after: "]",
    ...a.current()
  });
  u += a.move(s + "]["), l();
  const f = n.stack;
  n.stack = [], l = n.enter("reference");
  const c = n.safe(n.associationId(e), {
    before: u,
    after: "]",
    ...a.current()
  });
  return l(), n.stack = f, o(), i === "full" || !s || s !== c ? u += a.move(c + "]") : i === "shortcut" ? u = u.slice(0, -1) : u += a.move("]"), u;
}
function Dc() {
  return "[";
}
function ct(e) {
  const t = e.options.bullet || "*";
  if (t !== "*" && t !== "+" && t !== "-")
    throw new Error(
      "Cannot serialize items with `" + t + "` for `options.bullet`, expected `*`, `+`, or `-`"
    );
  return t;
}
function Fc(e) {
  const t = ct(e), n = e.options.bulletOther;
  if (!n)
    return t === "*" ? "-" : "*";
  if (n !== "*" && n !== "+" && n !== "-")
    throw new Error(
      "Cannot serialize items with `" + n + "` for `options.bulletOther`, expected `*`, `+`, or `-`"
    );
  if (n === t)
    throw new Error(
      "Expected `bullet` (`" + t + "`) and `bulletOther` (`" + n + "`) to be different"
    );
  return n;
}
function Rc(e) {
  const t = e.options.bulletOrdered || ".";
  if (t !== "." && t !== ")")
    throw new Error(
      "Cannot serialize items with `" + t + "` for `options.bulletOrdered`, expected `.` or `)`"
    );
  return t;
}
function gi(e) {
  const t = e.options.rule || "*";
  if (t !== "*" && t !== "-" && t !== "_")
    throw new Error(
      "Cannot serialize rules with `" + t + "` for `options.rule`, expected `*`, `-`, or `_`"
    );
  return t;
}
function Mc(e, t, n, r) {
  const i = n.enter("list"), o = n.bulletCurrent;
  let l = e.ordered ? Rc(n) : ct(n);
  const a = e.ordered ? l === "." ? ")" : "." : Fc(n);
  let u = t && n.bulletLastUsed ? l === n.bulletLastUsed : !1;
  if (!e.ordered) {
    const f = e.children ? e.children[0] : void 0;
    if (
      // Bullet could be used as a thematic break marker:
      (l === "*" || l === "-") && // Empty first list item:
      f && (!f.children || !f.children[0]) && // Directly in two other list items:
      n.stack[n.stack.length - 1] === "list" && n.stack[n.stack.length - 2] === "listItem" && n.stack[n.stack.length - 3] === "list" && n.stack[n.stack.length - 4] === "listItem" && // That are each the first child.
      n.indexStack[n.indexStack.length - 1] === 0 && n.indexStack[n.indexStack.length - 2] === 0 && n.indexStack[n.indexStack.length - 3] === 0 && (u = !0), gi(n) === l && f
    ) {
      let c = -1;
      for (; ++c < e.children.length; ) {
        const p = e.children[c];
        if (p && p.type === "listItem" && p.children && p.children[0] && p.children[0].type === "thematicBreak") {
          u = !0;
          break;
        }
      }
    }
  }
  u && (l = a), n.bulletCurrent = l;
  const s = n.containerFlow(e, r);
  return n.bulletLastUsed = l, n.bulletCurrent = o, i(), s;
}
function Oc(e) {
  const t = e.options.listItemIndent || "one";
  if (t !== "tab" && t !== "one" && t !== "mixed")
    throw new Error(
      "Cannot serialize items with `" + t + "` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`"
    );
  return t;
}
function Nc(e, t, n, r) {
  const i = Oc(n);
  let o = n.bulletCurrent || ct(n);
  t && t.type === "list" && t.ordered && (o = (typeof t.start == "number" && t.start > -1 ? t.start : 1) + (n.options.incrementListMarker === !1 ? 0 : t.children.indexOf(e)) + o);
  let l = o.length + 1;
  (i === "tab" || i === "mixed" && (t && t.type === "list" && t.spread || e.spread)) && (l = Math.ceil(l / 4) * 4);
  const a = n.createTracker(r);
  a.move(o + " ".repeat(l - o.length)), a.shift(l);
  const u = n.enter("listItem"), s = n.indentLines(
    n.containerFlow(e, a.current()),
    f
  );
  return u(), s;
  function f(c, p, h) {
    return p ? (h ? "" : " ".repeat(l)) + c : (h ? o : o + " ".repeat(l - o.length)) + c;
  }
}
function Bc(e, t, n, r) {
  const i = n.enter("paragraph"), o = n.enter("phrasing"), l = n.containerPhrasing(e, r);
  return o(), i(), l;
}
const jc = (
  /** @type {(node?: unknown) => node is Exclude<PhrasingContent, Html>} */
  dn([
    "break",
    "delete",
    "emphasis",
    // To do: next major: removed since footnotes were added to GFM.
    "footnote",
    "footnoteReference",
    "image",
    "imageReference",
    "inlineCode",
    // Enabled by `mdast-util-math`:
    "inlineMath",
    "link",
    "linkReference",
    // Enabled by `mdast-util-mdx`:
    "mdxJsxTextElement",
    // Enabled by `mdast-util-mdx`:
    "mdxTextExpression",
    "strong",
    "text",
    // Enabled by `mdast-util-directive`:
    "textDirective"
  ])
);
function Hc(e, t, n, r) {
  return (e.children.some(function(l) {
    return jc(l);
  }) ? n.containerPhrasing : n.containerFlow).call(n, e, r);
}
function Uc(e) {
  const t = e.options.strong || "*";
  if (t !== "*" && t !== "_")
    throw new Error(
      "Cannot serialize strong with `" + t + "` for `options.strong`, expected `*`, or `_`"
    );
  return t;
}
ki.peek = $c;
function ki(e, t, n, r) {
  const i = Uc(n), o = n.enter("strong"), l = n.createTracker(r), a = l.move(i + i);
  let u = l.move(
    n.containerPhrasing(e, {
      after: i,
      before: a,
      ...l.current()
    })
  );
  const s = u.charCodeAt(0), f = cn(
    r.before.charCodeAt(r.before.length - 1),
    s,
    i
  );
  f.inside && (u = Ye(s) + u.slice(1));
  const c = u.charCodeAt(u.length - 1), p = cn(r.after.charCodeAt(0), c, i);
  p.inside && (u = u.slice(0, -1) + Ye(c));
  const h = l.move(i + i);
  return o(), n.attentionEncodeSurroundingInfo = {
    after: p.outside,
    before: f.outside
  }, a + u + h;
}
function $c(e, t, n) {
  return n.options.strong || "*";
}
function Vc(e, t, n, r) {
  return n.safe(e.value, r);
}
function qc(e) {
  const t = e.options.ruleRepetition || 3;
  if (t < 3)
    throw new Error(
      "Cannot serialize rules with repetition `" + t + "` for `options.ruleRepetition`, expected `3` or more"
    );
  return t;
}
function Wc(e, t, n) {
  const r = (gi(n) + (n.options.ruleSpaces ? " " : "")).repeat(qc(n));
  return n.options.ruleSpaces ? r.slice(0, -1) : r;
}
const yi = {
  blockquote: dc,
  break: pr,
  code: wc,
  definition: Sc,
  emphasis: ui,
  hardBreak: pr,
  heading: Tc,
  html: si,
  image: ci,
  imageReference: fi,
  inlineCode: hi,
  link: mi,
  linkReference: di,
  list: Mc,
  listItem: Nc,
  paragraph: Bc,
  root: Hc,
  strong: ki,
  text: Vc,
  thematicBreak: Wc
};
function Gc() {
  return {
    enter: {
      table: Yc,
      tableData: mr,
      tableHeader: mr,
      tableRow: Qc
    },
    exit: {
      codeText: Kc,
      table: Xc,
      tableData: Pn,
      tableHeader: Pn,
      tableRow: Pn
    }
  };
}
function Yc(e) {
  const t = e._align;
  this.enter(
    {
      type: "table",
      align: t.map(function(n) {
        return n === "none" ? null : n;
      }),
      children: []
    },
    e
  ), this.data.inTable = !0;
}
function Xc(e) {
  this.exit(e), this.data.inTable = void 0;
}
function Qc(e) {
  this.enter({ type: "tableRow", children: [] }, e);
}
function Pn(e) {
  this.exit(e);
}
function mr(e) {
  this.enter({ type: "tableCell", children: [] }, e);
}
function Kc(e) {
  let t = this.resume();
  this.data.inTable && (t = t.replace(/\\([\\|])/g, Jc));
  const n = this.stack[this.stack.length - 1];
  n.type, n.value = t, this.exit(e);
}
function Jc(e, t) {
  return t === "|" ? t : e;
}
function Zc(e) {
  const t = e || {}, n = t.tableCellPadding, r = t.tablePipeAlign, i = t.stringLength, o = n ? " " : "|";
  return {
    unsafe: [
      { character: "\r", inConstruct: "tableCell" },
      { character: `
`, inConstruct: "tableCell" },
      // A pipe, when followed by a tab or space (padding), or a dash or colon
      // (unpadded delimiter row), could result in a table.
      { atBreak: !0, character: "|", after: "[	 :-]" },
      // A pipe in a cell must be encoded.
      { character: "|", inConstruct: "tableCell" },
      // A colon must be followed by a dash, in which case it could start a
      // delimiter row.
      { atBreak: !0, character: ":", after: "-" },
      // A delimiter row can also start with a dash, when followed by more
      // dashes, a colon, or a pipe.
      // This is a stricter version than the built in check for lists, thematic
      // breaks, and setex heading underlines though:
      // <https://github.com/syntax-tree/mdast-util-to-markdown/blob/51a2038/lib/unsafe.js#L57>
      { atBreak: !0, character: "-", after: "[:|-]" }
    ],
    handlers: {
      inlineCode: p,
      table: l,
      tableCell: u,
      tableRow: a
    }
  };
  function l(h, g, x, S) {
    return s(f(h, x, S), h.align);
  }
  function a(h, g, x, S) {
    const k = c(h, x, S), A = s([k]);
    return A.slice(0, A.indexOf(`
`));
  }
  function u(h, g, x, S) {
    const k = x.enter("tableCell"), A = x.enter("phrasing"), E = x.containerPhrasing(h, {
      ...S,
      before: o,
      after: o
    });
    return A(), k(), E;
  }
  function s(h, g) {
    return pc(h, {
      align: g,
      // @ts-expect-error: `markdown-table` types should support `null`.
      alignDelimiters: r,
      // @ts-expect-error: `markdown-table` types should support `null`.
      padding: n,
      // @ts-expect-error: `markdown-table` types should support `null`.
      stringLength: i
    });
  }
  function f(h, g, x) {
    const S = h.children;
    let k = -1;
    const A = [], E = g.enter("table");
    for (; ++k < S.length; )
      A[k] = c(S[k], g, x);
    return E(), A;
  }
  function c(h, g, x) {
    const S = h.children;
    let k = -1;
    const A = [], E = g.enter("tableRow");
    for (; ++k < S.length; )
      A[k] = u(S[k], h, g, x);
    return E(), A;
  }
  function p(h, g, x) {
    let S = yi.inlineCode(h, g, x);
    return x.stack.includes("tableCell") && (S = S.replace(/\|/g, "\\$&")), S;
  }
}
function ef() {
  return {
    exit: {
      taskListCheckValueChecked: dr,
      taskListCheckValueUnchecked: dr,
      paragraph: tf
    }
  };
}
function nf() {
  return {
    unsafe: [{ atBreak: !0, character: "-", after: "[:|-]" }],
    handlers: { listItem: rf }
  };
}
function dr(e) {
  const t = this.stack[this.stack.length - 2];
  t.type, t.checked = e.type === "taskListCheckValueChecked";
}
function tf(e) {
  const t = this.stack[this.stack.length - 2];
  if (t && t.type === "listItem" && typeof t.checked == "boolean") {
    const n = this.stack[this.stack.length - 1];
    n.type;
    const r = n.children[0];
    if (r && r.type === "text") {
      const i = t.children;
      let o = -1, l;
      for (; ++o < i.length; ) {
        const a = i[o];
        if (a.type === "paragraph") {
          l = a;
          break;
        }
      }
      l === n && (r.value = r.value.slice(1), r.value.length === 0 ? n.children.shift() : n.position && r.position && typeof r.position.start.offset == "number" && (r.position.start.column++, r.position.start.offset++, n.position.start = Object.assign({}, r.position.start)));
    }
  }
  this.exit(e);
}
function rf(e, t, n, r) {
  const i = e.children[0], o = typeof e.checked == "boolean" && i && i.type === "paragraph", l = "[" + (e.checked ? "x" : " ") + "] ", a = n.createTracker(r);
  o && a.move(l);
  let u = yi.listItem(e, t, n, {
    ...r,
    ...a.current()
  });
  return o && (u = u.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/, s)), u;
  function s(f) {
    return f + l;
  }
}
function lf() {
  return [
    Ms(),
    rc(),
    ac(),
    Gc(),
    ef()
  ];
}
function of(e) {
  return {
    extensions: [
      Os(),
      ic(e),
      uc(),
      Zc(e),
      nf()
    ]
  };
}
const af = {
  tokenize: pf,
  partial: !0
}, xi = {
  tokenize: mf,
  partial: !0
}, bi = {
  tokenize: df,
  partial: !0
}, wi = {
  tokenize: gf,
  partial: !0
}, uf = {
  tokenize: kf,
  partial: !0
}, Ci = {
  name: "wwwAutolink",
  tokenize: ff,
  previous: Ei
}, Si = {
  name: "protocolAutolink",
  tokenize: hf,
  previous: Ii
}, xe = {
  name: "emailAutolink",
  tokenize: cf,
  previous: Ai
}, pe = {};
function sf() {
  return {
    text: pe
  };
}
let Ie = 48;
for (; Ie < 123; )
  pe[Ie] = xe, Ie++, Ie === 58 ? Ie = 65 : Ie === 91 && (Ie = 97);
pe[43] = xe;
pe[45] = xe;
pe[46] = xe;
pe[95] = xe;
pe[72] = [xe, Si];
pe[104] = [xe, Si];
pe[87] = [xe, Ci];
pe[119] = [xe, Ci];
function cf(e, t, n) {
  const r = this;
  let i, o;
  return l;
  function l(c) {
    return !qn(c) || !Ai.call(r, r.previous) || ft(r.events) ? n(c) : (e.enter("literalAutolink"), e.enter("literalAutolinkEmail"), a(c));
  }
  function a(c) {
    return qn(c) ? (e.consume(c), a) : c === 64 ? (e.consume(c), u) : n(c);
  }
  function u(c) {
    return c === 46 ? e.check(uf, f, s)(c) : c === 45 || c === 95 || J(c) ? (o = !0, e.consume(c), u) : f(c);
  }
  function s(c) {
    return e.consume(c), i = !0, u;
  }
  function f(c) {
    return o && i && ee(r.previous) ? (e.exit("literalAutolinkEmail"), e.exit("literalAutolink"), t(c)) : n(c);
  }
}
function ff(e, t, n) {
  const r = this;
  return i;
  function i(l) {
    return l !== 87 && l !== 119 || !Ei.call(r, r.previous) || ft(r.events) ? n(l) : (e.enter("literalAutolink"), e.enter("literalAutolinkWww"), e.check(af, e.attempt(xi, e.attempt(bi, o), n), n)(l));
  }
  function o(l) {
    return e.exit("literalAutolinkWww"), e.exit("literalAutolink"), t(l);
  }
}
function hf(e, t, n) {
  const r = this;
  let i = "", o = !1;
  return l;
  function l(c) {
    return (c === 72 || c === 104) && Ii.call(r, r.previous) && !ft(r.events) ? (e.enter("literalAutolink"), e.enter("literalAutolinkHttp"), i += String.fromCodePoint(c), e.consume(c), a) : n(c);
  }
  function a(c) {
    if (ee(c) && i.length < 5)
      return i += String.fromCodePoint(c), e.consume(c), a;
    if (c === 58) {
      const p = i.toLowerCase();
      if (p === "http" || p === "https")
        return e.consume(c), u;
    }
    return n(c);
  }
  function u(c) {
    return c === 47 ? (e.consume(c), o ? s : (o = !0, u)) : n(c);
  }
  function s(c) {
    return c === null || an(c) || $(c) || Te(c) || hn(c) ? n(c) : e.attempt(xi, e.attempt(bi, f), n)(c);
  }
  function f(c) {
    return e.exit("literalAutolinkHttp"), e.exit("literalAutolink"), t(c);
  }
}
function pf(e, t, n) {
  let r = 0;
  return i;
  function i(l) {
    return (l === 87 || l === 119) && r < 3 ? (r++, e.consume(l), i) : l === 46 && r === 3 ? (e.consume(l), o) : n(l);
  }
  function o(l) {
    return l === null ? n(l) : t(l);
  }
}
function mf(e, t, n) {
  let r, i, o;
  return l;
  function l(s) {
    return s === 46 || s === 95 ? e.check(wi, u, a)(s) : s === null || $(s) || Te(s) || s !== 45 && hn(s) ? u(s) : (o = !0, e.consume(s), l);
  }
  function a(s) {
    return s === 95 ? r = !0 : (i = r, r = void 0), e.consume(s), l;
  }
  function u(s) {
    return i || r || !o ? n(s) : t(s);
  }
}
function df(e, t) {
  let n = 0, r = 0;
  return i;
  function i(l) {
    return l === 40 ? (n++, e.consume(l), i) : l === 41 && r < n ? o(l) : l === 33 || l === 34 || l === 38 || l === 39 || l === 41 || l === 42 || l === 44 || l === 46 || l === 58 || l === 59 || l === 60 || l === 63 || l === 93 || l === 95 || l === 126 ? e.check(wi, t, o)(l) : l === null || $(l) || Te(l) ? t(l) : (e.consume(l), i);
  }
  function o(l) {
    return l === 41 && r++, e.consume(l), i;
  }
}
function gf(e, t, n) {
  return r;
  function r(a) {
    return a === 33 || a === 34 || a === 39 || a === 41 || a === 42 || a === 44 || a === 46 || a === 58 || a === 59 || a === 63 || a === 95 || a === 126 ? (e.consume(a), r) : a === 38 ? (e.consume(a), o) : a === 93 ? (e.consume(a), i) : (
      // `<` is an end.
      a === 60 || // So is whitespace.
      a === null || $(a) || Te(a) ? t(a) : n(a)
    );
  }
  function i(a) {
    return a === null || a === 40 || a === 91 || $(a) || Te(a) ? t(a) : r(a);
  }
  function o(a) {
    return ee(a) ? l(a) : n(a);
  }
  function l(a) {
    return a === 59 ? (e.consume(a), r) : ee(a) ? (e.consume(a), l) : n(a);
  }
}
function kf(e, t, n) {
  return r;
  function r(o) {
    return e.consume(o), i;
  }
  function i(o) {
    return J(o) ? n(o) : t(o);
  }
}
function Ei(e) {
  return e === null || e === 40 || e === 42 || e === 95 || e === 91 || e === 93 || e === 126 || $(e);
}
function Ii(e) {
  return !ee(e);
}
function Ai(e) {
  return !(e === 47 || qn(e));
}
function qn(e) {
  return e === 43 || e === 45 || e === 46 || e === 95 || J(e);
}
function ft(e) {
  let t = e.length, n = !1;
  for (; t--; ) {
    const r = e[t][1];
    if ((r.type === "labelLink" || r.type === "labelImage") && !r._balanced) {
      n = !0;
      break;
    }
    if (r._gfmAutolinkLiteralWalkedInto) {
      n = !1;
      break;
    }
  }
  return e.length > 0 && !n && (e[e.length - 1][1]._gfmAutolinkLiteralWalkedInto = !0), n;
}
const yf = {
  tokenize: Af,
  partial: !0
};
function xf() {
  return {
    document: {
      91: {
        name: "gfmFootnoteDefinition",
        tokenize: Sf,
        continuation: {
          tokenize: Ef
        },
        exit: If
      }
    },
    text: {
      91: {
        name: "gfmFootnoteCall",
        tokenize: Cf
      },
      93: {
        name: "gfmPotentialFootnoteCall",
        add: "after",
        tokenize: bf,
        resolveTo: wf
      }
    }
  };
}
function bf(e, t, n) {
  const r = this;
  let i = r.events.length;
  const o = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []);
  let l;
  for (; i--; ) {
    const u = r.events[i][1];
    if (u.type === "labelImage") {
      l = u;
      break;
    }
    if (u.type === "gfmFootnoteCall" || u.type === "labelLink" || u.type === "label" || u.type === "image" || u.type === "link")
      break;
  }
  return a;
  function a(u) {
    if (!l || !l._balanced)
      return n(u);
    const s = fe(r.sliceSerialize({
      start: l.end,
      end: r.now()
    }));
    return s.codePointAt(0) !== 94 || !o.includes(s.slice(1)) ? n(u) : (e.enter("gfmFootnoteCallLabelMarker"), e.consume(u), e.exit("gfmFootnoteCallLabelMarker"), t(u));
  }
}
function wf(e, t) {
  let n = e.length;
  for (; n--; )
    if (e[n][1].type === "labelImage" && e[n][0] === "enter") {
      e[n][1];
      break;
    }
  e[n + 1][1].type = "data", e[n + 3][1].type = "gfmFootnoteCallLabelMarker";
  const r = {
    type: "gfmFootnoteCall",
    start: Object.assign({}, e[n + 3][1].start),
    end: Object.assign({}, e[e.length - 1][1].end)
  }, i = {
    type: "gfmFootnoteCallMarker",
    start: Object.assign({}, e[n + 3][1].end),
    end: Object.assign({}, e[n + 3][1].end)
  };
  i.end.column++, i.end.offset++, i.end._bufferIndex++;
  const o = {
    type: "gfmFootnoteCallString",
    start: Object.assign({}, i.end),
    end: Object.assign({}, e[e.length - 1][1].start)
  }, l = {
    type: "chunkString",
    contentType: "string",
    start: Object.assign({}, o.start),
    end: Object.assign({}, o.end)
  }, a = [
    // Take the `labelImageMarker` (now `data`, the `!`)
    e[n + 1],
    e[n + 2],
    ["enter", r, t],
    // The `[`
    e[n + 3],
    e[n + 4],
    // The `^`.
    ["enter", i, t],
    ["exit", i, t],
    // Everything in between.
    ["enter", o, t],
    ["enter", l, t],
    ["exit", l, t],
    ["exit", o, t],
    // The ending (`]`, properly parsed and labelled).
    e[e.length - 2],
    e[e.length - 1],
    ["exit", r, t]
  ];
  return e.splice(n, e.length - n + 1, ...a), e;
}
function Cf(e, t, n) {
  const r = this, i = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []);
  let o = 0, l;
  return a;
  function a(c) {
    return e.enter("gfmFootnoteCall"), e.enter("gfmFootnoteCallLabelMarker"), e.consume(c), e.exit("gfmFootnoteCallLabelMarker"), u;
  }
  function u(c) {
    return c !== 94 ? n(c) : (e.enter("gfmFootnoteCallMarker"), e.consume(c), e.exit("gfmFootnoteCallMarker"), e.enter("gfmFootnoteCallString"), e.enter("chunkString").contentType = "string", s);
  }
  function s(c) {
    if (
      // Too long.
      o > 999 || // Closing brace with nothing.
      c === 93 && !l || // Space or tab is not supported by GFM for some reason.
      // `\n` and `[` not being supported makes sense.
      c === null || c === 91 || $(c)
    )
      return n(c);
    if (c === 93) {
      e.exit("chunkString");
      const p = e.exit("gfmFootnoteCallString");
      return i.includes(fe(r.sliceSerialize(p))) ? (e.enter("gfmFootnoteCallLabelMarker"), e.consume(c), e.exit("gfmFootnoteCallLabelMarker"), e.exit("gfmFootnoteCall"), t) : n(c);
    }
    return $(c) || (l = !0), o++, e.consume(c), c === 92 ? f : s;
  }
  function f(c) {
    return c === 91 || c === 92 || c === 93 ? (e.consume(c), o++, s) : s(c);
  }
}
function Sf(e, t, n) {
  const r = this, i = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []);
  let o, l = 0, a;
  return u;
  function u(g) {
    return e.enter("gfmFootnoteDefinition")._container = !0, e.enter("gfmFootnoteDefinitionLabel"), e.enter("gfmFootnoteDefinitionLabelMarker"), e.consume(g), e.exit("gfmFootnoteDefinitionLabelMarker"), s;
  }
  function s(g) {
    return g === 94 ? (e.enter("gfmFootnoteDefinitionMarker"), e.consume(g), e.exit("gfmFootnoteDefinitionMarker"), e.enter("gfmFootnoteDefinitionLabelString"), e.enter("chunkString").contentType = "string", f) : n(g);
  }
  function f(g) {
    if (
      // Too long.
      l > 999 || // Closing brace with nothing.
      g === 93 && !a || // Space or tab is not supported by GFM for some reason.
      // `\n` and `[` not being supported makes sense.
      g === null || g === 91 || $(g)
    )
      return n(g);
    if (g === 93) {
      e.exit("chunkString");
      const x = e.exit("gfmFootnoteDefinitionLabelString");
      return o = fe(r.sliceSerialize(x)), e.enter("gfmFootnoteDefinitionLabelMarker"), e.consume(g), e.exit("gfmFootnoteDefinitionLabelMarker"), e.exit("gfmFootnoteDefinitionLabel"), p;
    }
    return $(g) || (a = !0), l++, e.consume(g), g === 92 ? c : f;
  }
  function c(g) {
    return g === 91 || g === 92 || g === 93 ? (e.consume(g), l++, f) : f(g);
  }
  function p(g) {
    return g === 58 ? (e.enter("definitionMarker"), e.consume(g), e.exit("definitionMarker"), i.includes(o) || i.push(o), M(e, h, "gfmFootnoteDefinitionWhitespace")) : n(g);
  }
  function h(g) {
    return t(g);
  }
}
function Ef(e, t, n) {
  return e.check(Qe, t, e.attempt(yf, t, n));
}
function If(e) {
  e.exit("gfmFootnoteDefinition");
}
function Af(e, t, n) {
  const r = this;
  return M(e, i, "gfmFootnoteDefinitionIndent", 5);
  function i(o) {
    const l = r.events[r.events.length - 1];
    return l && l[1].type === "gfmFootnoteDefinitionIndent" && l[2].sliceSerialize(l[1], !0).length === 4 ? t(o) : n(o);
  }
}
function Tf(e) {
  let n = (e || {}).singleTilde;
  const r = {
    name: "strikethrough",
    tokenize: o,
    resolveAll: i
  };
  return n == null && (n = !0), {
    text: {
      126: r
    },
    insideSpan: {
      null: [r]
    },
    attentionMarkers: {
      null: [126]
    }
  };
  function i(l, a) {
    let u = -1;
    for (; ++u < l.length; )
      if (l[u][0] === "enter" && l[u][1].type === "strikethroughSequenceTemporary" && l[u][1]._close) {
        let s = u;
        for (; s--; )
          if (l[s][0] === "exit" && l[s][1].type === "strikethroughSequenceTemporary" && l[s][1]._open && // If the sizes are the same:
          l[u][1].end.offset - l[u][1].start.offset === l[s][1].end.offset - l[s][1].start.offset) {
            l[u][1].type = "strikethroughSequence", l[s][1].type = "strikethroughSequence";
            const f = {
              type: "strikethrough",
              start: Object.assign({}, l[s][1].start),
              end: Object.assign({}, l[u][1].end)
            }, c = {
              type: "strikethroughText",
              start: Object.assign({}, l[s][1].end),
              end: Object.assign({}, l[u][1].start)
            }, p = [["enter", f, a], ["enter", l[s][1], a], ["exit", l[s][1], a], ["enter", c, a]], h = a.parser.constructs.insideSpan.null;
            h && le(p, p.length, 0, pn(h, l.slice(s + 1, u), a)), le(p, p.length, 0, [["exit", c, a], ["enter", l[u][1], a], ["exit", l[u][1], a], ["exit", f, a]]), le(l, s - 1, u - s + 3, p), u = s + p.length - 2;
            break;
          }
      }
    for (u = -1; ++u < l.length; )
      l[u][1].type === "strikethroughSequenceTemporary" && (l[u][1].type = "data");
    return l;
  }
  function o(l, a, u) {
    const s = this.previous, f = this.events;
    let c = 0;
    return p;
    function p(g) {
      return s === 126 && f[f.length - 1][1].type !== "characterEscape" ? u(g) : (l.enter("strikethroughSequenceTemporary"), h(g));
    }
    function h(g) {
      const x = Me(s);
      if (g === 126)
        return c > 1 ? u(g) : (l.consume(g), c++, h);
      if (c < 2 && !n) return u(g);
      const S = l.exit("strikethroughSequenceTemporary"), k = Me(g);
      return S._open = !k || k === 2 && !!x, S._close = !x || x === 2 && !!k, a(g);
    }
  }
}
class _f {
  /**
   * Create a new edit map.
   */
  constructor() {
    this.map = [];
  }
  /**
   * Create an edit: a remove and/or add at a certain place.
   *
   * @param {number} index
   * @param {number} remove
   * @param {Array<Event>} add
   * @returns {undefined}
   */
  add(t, n, r) {
    vf(this, t, n, r);
  }
  // To do: add this when moving to `micromark`.
  // /**
  //  * Create an edit: but insert `add` before existing additions.
  //  *
  //  * @param {number} index
  //  * @param {number} remove
  //  * @param {Array<Event>} add
  //  * @returns {undefined}
  //  */
  // addBefore(index, remove, add) {
  //   addImplementation(this, index, remove, add, true)
  // }
  /**
   * Done, change the events.
   *
   * @param {Array<Event>} events
   * @returns {undefined}
   */
  consume(t) {
    if (this.map.sort(function(o, l) {
      return o[0] - l[0];
    }), this.map.length === 0)
      return;
    let n = this.map.length;
    const r = [];
    for (; n > 0; )
      n -= 1, r.push(t.slice(this.map[n][0] + this.map[n][1]), this.map[n][2]), t.length = this.map[n][0];
    r.push(t.slice()), t.length = 0;
    let i = r.pop();
    for (; i; ) {
      for (const o of i)
        t.push(o);
      i = r.pop();
    }
    this.map.length = 0;
  }
}
function vf(e, t, n, r) {
  let i = 0;
  if (!(n === 0 && r.length === 0)) {
    for (; i < e.map.length; ) {
      if (e.map[i][0] === t) {
        e.map[i][1] += n, e.map[i][2].push(...r);
        return;
      }
      i += 1;
    }
    e.map.push([t, n, r]);
  }
}
function Lf(e, t) {
  let n = !1;
  const r = [];
  for (; t < e.length; ) {
    const i = e[t];
    if (n) {
      if (i[0] === "enter")
        i[1].type === "tableContent" && r.push(e[t + 1][1].type === "tableDelimiterMarker" ? "left" : "none");
      else if (i[1].type === "tableContent") {
        if (e[t - 1][1].type === "tableDelimiterMarker") {
          const o = r.length - 1;
          r[o] = r[o] === "left" ? "center" : "right";
        }
      } else if (i[1].type === "tableDelimiterRow")
        break;
    } else i[0] === "enter" && i[1].type === "tableDelimiterRow" && (n = !0);
    t += 1;
  }
  return r;
}
function Pf() {
  return {
    flow: {
      null: {
        name: "table",
        tokenize: zf,
        resolveAll: Df
      }
    }
  };
}
function zf(e, t, n) {
  const r = this;
  let i = 0, o = 0, l;
  return a;
  function a(y) {
    let T = r.events.length - 1;
    for (; T > -1; ) {
      const W = r.events[T][1].type;
      if (W === "lineEnding" || // Note: markdown-rs uses `whitespace` instead of `linePrefix`
      W === "linePrefix") T--;
      else break;
    }
    const _ = T > -1 ? r.events[T][1].type : null, H = _ === "tableHead" || _ === "tableRow" ? w : u;
    return H === w && r.parser.lazy[r.now().line] ? n(y) : H(y);
  }
  function u(y) {
    return e.enter("tableHead"), e.enter("tableRow"), s(y);
  }
  function s(y) {
    return y === 124 || (l = !0, o += 1), f(y);
  }
  function f(y) {
    return y === null ? n(y) : v(y) ? o > 1 ? (o = 0, r.interrupt = !0, e.exit("tableRow"), e.enter("lineEnding"), e.consume(y), e.exit("lineEnding"), h) : n(y) : F(y) ? M(e, f, "whitespace")(y) : (o += 1, l && (l = !1, i += 1), y === 124 ? (e.enter("tableCellDivider"), e.consume(y), e.exit("tableCellDivider"), l = !0, f) : (e.enter("data"), c(y)));
  }
  function c(y) {
    return y === null || y === 124 || $(y) ? (e.exit("data"), f(y)) : (e.consume(y), y === 92 ? p : c);
  }
  function p(y) {
    return y === 92 || y === 124 ? (e.consume(y), c) : c(y);
  }
  function h(y) {
    return r.interrupt = !1, r.parser.lazy[r.now().line] ? n(y) : (e.enter("tableDelimiterRow"), l = !1, F(y) ? M(e, g, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(y) : g(y));
  }
  function g(y) {
    return y === 45 || y === 58 ? S(y) : y === 124 ? (l = !0, e.enter("tableCellDivider"), e.consume(y), e.exit("tableCellDivider"), x) : D(y);
  }
  function x(y) {
    return F(y) ? M(e, S, "whitespace")(y) : S(y);
  }
  function S(y) {
    return y === 58 ? (o += 1, l = !0, e.enter("tableDelimiterMarker"), e.consume(y), e.exit("tableDelimiterMarker"), k) : y === 45 ? (o += 1, k(y)) : y === null || v(y) ? z(y) : D(y);
  }
  function k(y) {
    return y === 45 ? (e.enter("tableDelimiterFiller"), A(y)) : D(y);
  }
  function A(y) {
    return y === 45 ? (e.consume(y), A) : y === 58 ? (l = !0, e.exit("tableDelimiterFiller"), e.enter("tableDelimiterMarker"), e.consume(y), e.exit("tableDelimiterMarker"), E) : (e.exit("tableDelimiterFiller"), E(y));
  }
  function E(y) {
    return F(y) ? M(e, z, "whitespace")(y) : z(y);
  }
  function z(y) {
    return y === 124 ? g(y) : y === null || v(y) ? !l || i !== o ? D(y) : (e.exit("tableDelimiterRow"), e.exit("tableHead"), t(y)) : D(y);
  }
  function D(y) {
    return n(y);
  }
  function w(y) {
    return e.enter("tableRow"), O(y);
  }
  function O(y) {
    return y === 124 ? (e.enter("tableCellDivider"), e.consume(y), e.exit("tableCellDivider"), O) : y === null || v(y) ? (e.exit("tableRow"), t(y)) : F(y) ? M(e, O, "whitespace")(y) : (e.enter("data"), q(y));
  }
  function q(y) {
    return y === null || y === 124 || $(y) ? (e.exit("data"), O(y)) : (e.consume(y), y === 92 ? j : q);
  }
  function j(y) {
    return y === 92 || y === 124 ? (e.consume(y), q) : q(y);
  }
}
function Df(e, t) {
  let n = -1, r = !0, i = 0, o = [0, 0, 0, 0], l = [0, 0, 0, 0], a = !1, u = 0, s, f, c;
  const p = new _f();
  for (; ++n < e.length; ) {
    const h = e[n], g = h[1];
    h[0] === "enter" ? g.type === "tableHead" ? (a = !1, u !== 0 && (gr(p, t, u, s, f), f = void 0, u = 0), s = {
      type: "table",
      start: Object.assign({}, g.start),
      // Note: correct end is set later.
      end: Object.assign({}, g.end)
    }, p.add(n, 0, [["enter", s, t]])) : g.type === "tableRow" || g.type === "tableDelimiterRow" ? (r = !0, c = void 0, o = [0, 0, 0, 0], l = [0, n + 1, 0, 0], a && (a = !1, f = {
      type: "tableBody",
      start: Object.assign({}, g.start),
      // Note: correct end is set later.
      end: Object.assign({}, g.end)
    }, p.add(n, 0, [["enter", f, t]])), i = g.type === "tableDelimiterRow" ? 2 : f ? 3 : 1) : i && (g.type === "data" || g.type === "tableDelimiterMarker" || g.type === "tableDelimiterFiller") ? (r = !1, l[2] === 0 && (o[1] !== 0 && (l[0] = l[1], c = tn(p, t, o, i, void 0, c), o = [0, 0, 0, 0]), l[2] = n)) : g.type === "tableCellDivider" && (r ? r = !1 : (o[1] !== 0 && (l[0] = l[1], c = tn(p, t, o, i, void 0, c)), o = l, l = [o[1], n, 0, 0])) : g.type === "tableHead" ? (a = !0, u = n) : g.type === "tableRow" || g.type === "tableDelimiterRow" ? (u = n, o[1] !== 0 ? (l[0] = l[1], c = tn(p, t, o, i, n, c)) : l[1] !== 0 && (c = tn(p, t, l, i, n, c)), i = 0) : i && (g.type === "data" || g.type === "tableDelimiterMarker" || g.type === "tableDelimiterFiller") && (l[3] = n);
  }
  for (u !== 0 && gr(p, t, u, s, f), p.consume(t.events), n = -1; ++n < t.events.length; ) {
    const h = t.events[n];
    h[0] === "enter" && h[1].type === "table" && (h[1]._align = Lf(t.events, n));
  }
  return e;
}
function tn(e, t, n, r, i, o) {
  const l = r === 1 ? "tableHeader" : r === 2 ? "tableDelimiter" : "tableData", a = "tableContent";
  n[0] !== 0 && (o.end = Object.assign({}, Fe(t.events, n[0])), e.add(n[0], 0, [["exit", o, t]]));
  const u = Fe(t.events, n[1]);
  if (o = {
    type: l,
    start: Object.assign({}, u),
    // Note: correct end is set later.
    end: Object.assign({}, u)
  }, e.add(n[1], 0, [["enter", o, t]]), n[2] !== 0) {
    const s = Fe(t.events, n[2]), f = Fe(t.events, n[3]), c = {
      type: a,
      start: Object.assign({}, s),
      end: Object.assign({}, f)
    };
    if (e.add(n[2], 0, [["enter", c, t]]), r !== 2) {
      const p = t.events[n[2]], h = t.events[n[3]];
      if (p[1].end = Object.assign({}, h[1].end), p[1].type = "chunkText", p[1].contentType = "text", n[3] > n[2] + 1) {
        const g = n[2] + 1, x = n[3] - n[2] - 1;
        e.add(g, x, []);
      }
    }
    e.add(n[3] + 1, 0, [["exit", c, t]]);
  }
  return i !== void 0 && (o.end = Object.assign({}, Fe(t.events, i)), e.add(i, 0, [["exit", o, t]]), o = void 0), o;
}
function gr(e, t, n, r, i) {
  const o = [], l = Fe(t.events, n);
  i && (i.end = Object.assign({}, l), o.push(["exit", i, t])), r.end = Object.assign({}, l), o.push(["exit", r, t]), e.add(n + 1, 0, o);
}
function Fe(e, t) {
  const n = e[t], r = n[0] === "enter" ? "start" : "end";
  return n[1][r];
}
const Ff = {
  name: "tasklistCheck",
  tokenize: Mf
};
function Rf() {
  return {
    text: {
      91: Ff
    }
  };
}
function Mf(e, t, n) {
  const r = this;
  return i;
  function i(u) {
    return (
      // Exit if there’s stuff before.
      r.previous !== null || // Exit if not in the first content that is the first child of a list
      // item.
      !r._gfmTasklistFirstContentOfListItem ? n(u) : (e.enter("taskListCheck"), e.enter("taskListCheckMarker"), e.consume(u), e.exit("taskListCheckMarker"), o)
    );
  }
  function o(u) {
    return $(u) ? (e.enter("taskListCheckValueUnchecked"), e.consume(u), e.exit("taskListCheckValueUnchecked"), l) : u === 88 || u === 120 ? (e.enter("taskListCheckValueChecked"), e.consume(u), e.exit("taskListCheckValueChecked"), l) : n(u);
  }
  function l(u) {
    return u === 93 ? (e.enter("taskListCheckMarker"), e.consume(u), e.exit("taskListCheckMarker"), e.exit("taskListCheck"), a) : n(u);
  }
  function a(u) {
    return v(u) ? t(u) : F(u) ? e.check({
      tokenize: Of
    }, t, n)(u) : n(u);
  }
}
function Of(e, t, n) {
  return M(e, r, "whitespace");
  function r(i) {
    return i === null ? n(i) : t(i);
  }
}
function Nf(e) {
  return Mr([
    sf(),
    xf(),
    Tf(e),
    Pf(),
    Rf()
  ]);
}
const Bf = {};
function kr(e) {
  const t = (
    /** @type {Processor<Root>} */
    this
  ), n = e || Bf, r = t.data(), i = r.micromarkExtensions || (r.micromarkExtensions = []), o = r.fromMarkdownExtensions || (r.fromMarkdownExtensions = []), l = r.toMarkdownExtensions || (r.toMarkdownExtensions = []);
  i.push(Nf(n)), o.push(lf()), l.push(of(n));
}
const jf = "_citationSup_18chq_1", Hf = "_citationLink_18chq_6", Uf = "_citationGroup_18chq_16", zn = {
  citationSup: jf,
  citationLink: Hf,
  citationGroup: Uf
};
function $f(e) {
  const t = [];
  let n = "", r = !1;
  for (const i of e.split(`
`)) {
    if (i.trim().startsWith("```")) {
      r = !r, n += i + `
`;
      continue;
    }
    if (r) {
      n += i + `
`;
      continue;
    }
    i.trim() === "" && n.trim() ? (t.push(n.trim()), n = "") : n += i + `
`;
  }
  return n.trim() && t.push(n.trim()), t;
}
const Wn = {
  table: ({ children: e, ...t }) => {
    const n = yt.Children.map(e, (r) => yt.isValidElement(r) && r.type === "tr" ? /* @__PURE__ */ B("tbody", { children: r }) : r);
    return /* @__PURE__ */ B("table", { ...t, children: n });
  }
};
function Vf(e, t) {
  const n = e.map((i) => {
    var o, l;
    return /* @__PURE__ */ B("sup", { className: zn.citationSup, children: /* @__PURE__ */ B("a", { href: (o = t[i]) == null ? void 0 : o.url, className: zn.citationLink, title: (l = t[i]) == null ? void 0 : l.title, children: i + 1 }) }, `cite-${i}`);
  });
  return { ...Wn, p: ({ children: i, ...o }) => /* @__PURE__ */ ye("p", { ...o, children: [
    i,
    /* @__PURE__ */ B("span", { className: zn.citationGroup, children: n })
  ] }) };
}
function qf({ text: e, sources: t, grounding: n }) {
  if (!n || !t || n.length === 0)
    return /* @__PURE__ */ B(sr, { remarkPlugins: [kr], components: Wn, children: e });
  const r = /* @__PURE__ */ new Map();
  for (const o of n)
    r.set(o.paragraphIndex, o.sourceIndices);
  const i = $f(e);
  return /* @__PURE__ */ B(xr, { children: i.map((o, l) => {
    const a = r.get(l), u = a && a.length > 0 ? Vf(a, t) : Wn;
    return /* @__PURE__ */ B(sr, { remarkPlugins: [kr], components: u, children: o }, l);
  }) });
}
/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ti = (...e) => e.filter((t, n, r) => !!t && t.trim() !== "" && r.indexOf(t) === n).join(" ").trim();
/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wf = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gf = (e) => e.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (t, n, r) => r ? r.toUpperCase() : n.toLowerCase()
);
/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const yr = (e) => {
  const t = Gf(e);
  return t.charAt(0).toUpperCase() + t.slice(1);
};
/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Yf = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Xf = (e) => {
  for (const t in e)
    if (t.startsWith("aria-") || t === "role" || t === "title")
      return !0;
  return !1;
};
/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Qf = br(
  ({
    color: e = "currentColor",
    size: t = 24,
    strokeWidth: n = 2,
    absoluteStrokeWidth: r,
    className: i = "",
    children: o,
    iconNode: l,
    ...a
  }, u) => Dn(
    "svg",
    {
      ref: u,
      ...Yf,
      width: t,
      height: t,
      stroke: e,
      strokeWidth: r ? Number(n) * 24 / Number(t) : n,
      className: Ti("lucide", i),
      ...!o && !Xf(a) && { "aria-hidden": "true" },
      ...a
    },
    [
      ...l.map(([s, f]) => Dn(s, f)),
      ...Array.isArray(o) ? o : [o]
    ]
  )
);
/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ht = (e, t) => {
  const n = br(
    ({ className: r, ...i }, o) => Dn(Qf, {
      ref: o,
      iconNode: t,
      className: Ti(
        `lucide-${Wf(yr(e))}`,
        `lucide-${e}`,
        r
      ),
      ...i
    })
  );
  return n.displayName = yr(e), n;
};
/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Kf = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
], Jf = ht("external-link", Kf);
/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Zf = [
  [
    "path",
    {
      d: "M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z",
      key: "m61m77"
    }
  ],
  ["path", { d: "M17 14V2", key: "8ymqnk" }]
], eh = ht("thumbs-down", Zf);
/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const nh = [
  [
    "path",
    {
      d: "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z",
      key: "emmmcr"
    }
  ],
  ["path", { d: "M7 10v12", key: "1qc93n" }]
], th = ht("thumbs-up", nh), rh = "_userBubble_1pbjm_1", ih = "_userLabel_1pbjm_8", lh = "_userText_1pbjm_17", oh = "_assistantBubble_1pbjm_25", ah = "_assistantHeader_1pbjm_33", uh = "_assistantLabel_1pbjm_41", sh = "_assistantMeta_1pbjm_47", ch = "_assistantContent_1pbjm_55", fh = "_thinkingText_1pbjm_82", hh = "_sourcesSection_1pbjm_87", ph = "_sourcesLabel_1pbjm_91", mh = "_sourcesList_1pbjm_101", dh = "_sourceLink_1pbjm_110", gh = "_sourceIndex_1pbjm_128", kh = "_externalIcon_1pbjm_143", yh = "_feedbackRow_1pbjm_148", xh = "_feedbackBtn_1pbjm_155", bh = "_feedbackBtnActive_1pbjm_173", G = {
  userBubble: rh,
  userLabel: ih,
  userText: lh,
  assistantBubble: oh,
  assistantHeader: ah,
  assistantLabel: uh,
  assistantMeta: sh,
  assistantContent: ch,
  thinkingText: fh,
  sourcesSection: hh,
  sourcesLabel: ph,
  sourcesList: mh,
  sourceLink: dh,
  sourceIndex: gh,
  externalIcon: kh,
  feedbackRow: yh,
  feedbackBtn: xh,
  feedbackBtnActive: bh
};
function Sh({
  message: e,
  isStreaming: t = !1,
  isLast: n = !1,
  onFeedback: r
}) {
  if (e.role === "user")
    return /* @__PURE__ */ ye("div", { className: G.userBubble, children: [
      /* @__PURE__ */ B("div", { className: G.userLabel, children: "User" }),
      /* @__PURE__ */ B("div", { className: G.userText, children: e.text })
    ] });
  const o = t && n && !e.text;
  return /* @__PURE__ */ ye("div", { className: G.assistantBubble, children: [
    /* @__PURE__ */ ye("div", { className: G.assistantHeader, children: [
      /* @__PURE__ */ B("div", { className: G.assistantLabel, children: e.agent ? `Agent · ${e.agent}` : "Agent" }),
      /* @__PURE__ */ B("div", { className: G.assistantMeta, children: e.toolCallCount !== void 0 && t && n && /* @__PURE__ */ ye("span", { children: [
        "searching docs (",
        e.toolCallCount,
        " tool call",
        e.toolCallCount > 1 ? "s" : "",
        ")..."
      ] }) })
    ] }),
    /* @__PURE__ */ B("div", { className: G.assistantContent, children: o ? /* @__PURE__ */ B("span", { className: G.thinkingText, children: e.toolCallCount ? `searching docs (${e.toolCallCount} tool call${e.toolCallCount > 1 ? "s" : ""})...` : "thinking..." }) : /* @__PURE__ */ B(
      qf,
      {
        text: e.text,
        sources: e.sources,
        grounding: e.grounding
      }
    ) }),
    e.sources && e.sources.length > 0 && /* @__PURE__ */ ye("div", { className: G.sourcesSection, children: [
      /* @__PURE__ */ B("span", { className: G.sourcesLabel, children: "Sources" }),
      /* @__PURE__ */ B("ul", { className: G.sourcesList, children: e.sources.map((l, a) => /* @__PURE__ */ B("li", { children: /* @__PURE__ */ ye(
        "a",
        {
          href: l.url,
          className: G.sourceLink,
          title: l.title,
          ...xt(l.url) ? { target: "_blank", rel: "noopener noreferrer" } : {},
          children: [
            /* @__PURE__ */ B("span", { className: G.sourceIndex, children: a + 1 }),
            /* @__PURE__ */ B("span", { children: l.title }),
            /* @__PURE__ */ B(Yi, { section: l.section, url: l.url }),
            xt(l.url) && /* @__PURE__ */ B(Jf, { size: 12, className: G.externalIcon })
          ]
        }
      ) }, a)) })
    ] }),
    e.text && !t && r && /* @__PURE__ */ ye("div", { className: G.feedbackRow, children: [
      /* @__PURE__ */ B(Hi, { level: e.confidence }),
      /* @__PURE__ */ B(
        "button",
        {
          type: "button",
          className: `${G.feedbackBtn} ${e.feedback === "up" ? G.feedbackBtnActive : ""}`,
          onClick: () => r("up"),
          "aria-label": "Helpful",
          title: "Helpful",
          children: /* @__PURE__ */ B(th, { size: 12 })
        }
      ),
      /* @__PURE__ */ B(
        "button",
        {
          type: "button",
          className: `${G.feedbackBtn} ${e.feedback === "down" ? G.feedbackBtnActive : ""}`,
          onClick: () => r("down"),
          "aria-label": "Not helpful",
          title: "Not helpful",
          children: /* @__PURE__ */ B(eh, { size: 12 })
        }
      )
    ] })
  ] });
}
export {
  Sh as ChatMessageBubble,
  Hi as ConfidenceDot,
  qf as GroundedMarkdown,
  Yi as SourceTag,
  xt as isExternalUrl,
  Oi as resolveSection
};
