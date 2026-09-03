// Orpheus Hospitality Suite — sales deck for hotel owners and operators (group / branded estate)
// Build:  node presentation/build_deck.js
const pptxgen = require("pptxgenjs");

/* ---------------------------------------------------------------- palette */
const INK        = "0B1220";
const INK_SOFT   = "16223A";
const INK_LINE   = "27354F";
const GOLD       = "D4A94A";
const GOLD_DEEP  = "A87C1F";
const TEAL       = "3FB6A8";
const CREAM      = "F4F1EA";
const WHITE      = "FFFFFF";
const PAPER      = "F5F7FA";
const PAPER_LINE = "DFE5EE";
const MUTED_D    = "9AA9C2";
const MUTED_L    = "5A6880";

// the product's own palette — used only inside screen mockups, so a slide shows the real interface
const O_BG = "0A0613", O_RAIL = "120C22", O_LINE = "241A3D", O_ACTIVE = "231640";
const O_PURPLE = "B06BFF", O_MAGENTA = "F05CE0", O_FOCUS = "C77BFF";
const O_MUTE = "9C93B8", O_NAV = "A79CC4", O_PINK = "EC4899";

const SERIF = "Cambria";
const SANS  = "Calibri";

const W = 13.333, H = 7.5, M = 0.7, CW = W - M * 2;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Orpheus Hospitality Suite";
pres.title  = "Orpheus Hospitality Suite";

/* -------------------------------------------------------------- helpers */
const softShadow = () => ({ type: "outer", color: "0B1220", blur: 10, offset: 2, angle: 90, opacity: 0.10 });
const darkShadow = () => ({ type: "outer", color: "000000", blur: 12, offset: 3, angle: 90, opacity: 0.35 });

function darkSlide() { const s = pres.addSlide(); s.background = { color: INK }; return s; }
function lightSlide() { const s = pres.addSlide(); s.background = { color: WHITE }; return s; }

function slideTitle(s, text, dark, kicker) {
  if (kicker) {
    s.addText(kicker.toUpperCase(), { isTextBox: true, x: M, y: 0.42, w: CW, h: 0.28, margin: 0,
      fontFace: SANS, fontSize: 11, bold: true, charSpacing: 2, color: dark ? GOLD : GOLD_DEEP });
  }
  s.addText(text, { isTextBox: true, x: M, y: kicker ? 0.72 : 0.5, w: CW, h: 0.85, margin: 0,
    fontFace: SERIF, fontSize: 33, bold: true, color: dark ? CREAM : INK, valign: "top" });
}

function card(s, x, y, w, h, dark, tint) {
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.09,
    fill: { color: tint || (dark ? INK_SOFT : PAPER) },
    line: { color: dark ? INK_LINE : PAPER_LINE, width: 1 },
    shadow: dark ? darkShadow() : softShadow() });
}

function badge(s, x, y, label, dark, d) {
  const dia = d || 0.42;
  s.addShape(pres.ShapeType.ellipse, { x, y, w: dia, h: dia,
    fill: { color: dark ? GOLD : GOLD_DEEP }, line: { color: dark ? GOLD : GOLD_DEEP, width: 1 } });
  s.addText(label, { isTextBox: true, x, y, w: dia, h: dia, margin: 0,
    fontFace: SANS, fontSize: dia > 0.5 ? 15 : 12, bold: true,
    color: dark ? INK : WHITE, align: "center", valign: "middle" });
}

function body(s, text, x, y, w, h, dark, size) {
  s.addText(text, { isTextBox: true, x, y, w, h, margin: 0,
    fontFace: SANS, fontSize: size || 13, color: dark ? MUTED_D : MUTED_L,
    lineSpacing: (size || 13) * 1.45, valign: "top" });
}

function bullets(s, items, x, y, w, h, dark, size) {
  s.addText(items.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i !== items.length - 1 } })),
    { isTextBox: true, x, y, w, h, margin: 0, fontFace: SANS, fontSize: size || 13,
      color: dark ? MUTED_D : MUTED_L, paraSpaceAfter: 7, valign: "top" });
}

function footnote(s, text, dark) {
  s.addText(text, { isTextBox: true, x: M, y: H - 0.62, w: CW, h: 0.3, margin: 0,
    fontFace: SANS, fontSize: 9, italic: true, color: dark ? "6B7A94" : "8B96A8" });
}

/* =========================================================== 1. TITLE */
{
  const s = darkSlide();
  s.addShape(pres.ShapeType.roundRect, { x: 8.6, y: -1.1, w: 3.2, h: 6.2, rectRadius: 0.2,
    fill: { color: GOLD, transparency: 90 }, line: { color: GOLD, transparency: 78, width: 1 }, rotate: 18 });
  s.addShape(pres.ShapeType.roundRect, { x: 10.4, y: 0.4, w: 3.0, h: 6.4, rectRadius: 0.2,
    fill: { color: TEAL, transparency: 92 }, line: { color: TEAL, transparency: 82, width: 1 }, rotate: 18 });

  s.addText("FOR HOTEL OWNERS AND OPERATORS", { isTextBox: true, x: M, y: 1.7, w: 7.8, h: 0.3, margin: 0,
    fontFace: SANS, fontSize: 12, bold: true, charSpacing: 3, color: GOLD });
  s.addText("Orpheus\nHospitality Suite", { isTextBox: true, x: M, y: 2.15, w: 7.8, h: 1.9, margin: 0,
    fontFace: SERIF, fontSize: 50, bold: true, color: CREAM, lineSpacing: 54 });
  s.addText("The property-level guest experience layer — in-room entertainment, dining, concierge, facility booking, payments and digital documents — running on one guest record and plugged into the enterprise systems you already own.",
    { isTextBox: true, x: M, y: 4.18, w: 7.55, h: 1.25, margin: 0,
      fontFace: SANS, fontSize: 14, color: MUTED_D, lineSpacing: 22 });

  ["One Android app. No set-top box.", "Powered by Orpheus Nations."].forEach((t, i) => {
    s.addShape(pres.ShapeType.roundRect, { x: M + i * 3.5, y: 5.82, w: 3.3, h: 0.46, rectRadius: 0.23,
      fill: { color: INK_SOFT }, line: { color: INK_LINE, width: 1 } });
    s.addText(t, { isTextBox: true, x: M + i * 3.5, y: 5.82, w: 3.3, h: 0.46, margin: 0,
      fontFace: SANS, fontSize: 11.5, bold: true, color: GOLD, align: "center", valign: "middle" });
  });
  s.addNotes("Audience is a group owner or operator, not an independent. Establish in the first minute that we are not proposing to replace the enterprise core — we are proposing to own the layer between that core and the guest, which today is a patchwork of property-level vendors.");
}

/* ================================================ 2. THE PROBLEM */
{
  const s = lightSlide();
  slideTitle(s, "The core is solved. The last mile is not.", false, "the problem");
  body(s, "Central reservations, the property management system and the loyalty programme are enterprise-grade and estate-wide. Below them, the systems the guest actually touches were bought property by property, from whoever was local.",
    M, 1.72, 11.0, 0.7, false, 13.5);

  card(s, M, 2.55, 5.75, 3.55, false, "0B1220");
  s.addText("ESTATE-WIDE, ENTERPRISE, YOURS", { isTextBox: true, x: M + 0.38, y: 2.82, w: 5.0, h: 0.3, margin: 0,
    fontFace: SANS, fontSize: 10.5, bold: true, charSpacing: 1.8, color: GOLD });
  const owned = [["Central reservations", "One inventory, one rate strategy"],
                 ["Property management system", "Opera-class, standardised across the estate"],
                 ["Enterprise loyalty", "One programme, one member identity"],
                 ["Corporate finance and reporting", "Consolidated to the group"]];
  owned.forEach((o, i) => {
    const y = 3.32 + i * 0.68;
    s.addText(o[0], { isTextBox: true, x: M + 0.38, y, w: 5.0, h: 0.26, margin: 0,
      fontFace: SANS, fontSize: 12.5, bold: true, color: CREAM });
    s.addText(o[1], { isTextBox: true, x: M + 0.38, y: y + 0.26, w: 5.0, h: 0.26, margin: 0,
      fontFace: SANS, fontSize: 10.5, color: MUTED_D });
  });

  card(s, M + 6.15, 2.55, CW - 6.15, 3.55, false);
  s.addText("PROPERTY BY PROPERTY, LOCAL, INCONSISTENT", { isTextBox: true, x: M + 6.53, y: 2.82, w: 5.2, h: 0.3, margin: 0,
    fontFace: SANS, fontSize: 10.5, bold: true, charSpacing: 1.5, color: GOLD_DEEP });
  const local = [["In-room television", "Sold with the hardware, different vendor per site"],
                 ["Restaurant and bar point of sale", "Often two systems, rarely reporting to the group"],
                 ["Concierge and service requests", "Radio, paper log, or a spreadsheet"],
                 ["Guest identity documents", "Photocopied, filed, retained indefinitely"]];
  local.forEach((o, i) => {
    const y = 3.32 + i * 0.68;
    s.addText(o[0], { isTextBox: true, x: M + 6.53, y, w: 5.2, h: 0.26, margin: 0,
      fontFace: SANS, fontSize: 12.5, bold: true, color: INK });
    s.addText(o[1], { isTextBox: true, x: M + 6.53, y: y + 0.26, w: 5.2, h: 0.26, margin: 0,
      fontFace: SANS, fontSize: 10.5, color: MUTED_L });
  });
  s.addNotes("The framing that earns the meeting: we are not competing with the enterprise stack, we are fixing the layer beneath it. Ask how many TV vendors and POS systems the estate carries — the number is usually higher than head office expects.");
}

/* ================================================ 3. WHAT IT COSTS */
{
  const s = darkSlide();
  slideTitle(s, "Property fragmentation is paid at the group", true, "what it costs at estate scale");

  const stats = [
    ["Per site", "vendor contracts", "TV, POS, concierge and document handling procured locally — renewed locally, audited locally"],
    ["Uneven", "guest experience", "the same brand promise delivered differently in every property the guest visits"],
    ["Partial", "ancillary data", "outlet, spa and in-room revenue that never rolls up cleanly to the group"],
    ["Siloed", "document risk", "identity documents held at property level, with no estate-wide retention control"],
  ];
  const cw = 2.92, gx = 0.31;
  stats.forEach((st, i) => {
    const x = M + i * (cw + gx);
    card(s, x, 2.0, cw, 3.55, true);
    s.addText(st[0], { isTextBox: true, x: x + 0.28, y: 2.32, w: cw - 0.56, h: 0.52, margin: 0,
      fontFace: SERIF, fontSize: 30, bold: true, color: GOLD });
    s.addText(st[1], { isTextBox: true, x: x + 0.28, y: 2.88, w: cw - 0.56, h: 0.34, margin: 0,
      fontFace: SANS, fontSize: 14.5, bold: true, color: CREAM });
    s.addText(st[2], { isTextBox: true, x: x + 0.28, y: 3.5, w: cw - 0.56, h: 1.85, margin: 0,
      fontFace: SANS, fontSize: 11.5, color: MUTED_D, lineSpacing: 16.5 });
  });
  footnote(s, "Characteristic of multi-property estates with locally procured guest-facing systems. Replaced with the group's own vendor inventory at proposal stage.", true);
  s.addNotes("Deliberately not fabricated percentages. At proposal stage this slide becomes the group's real vendor count and spend, which is far more persuasive than a benchmark and is a number head office often cannot produce on request.");
}

/* ================================================ 4. THE IDEA */
{
  const s = lightSlide();
  slideTitle(s, "One guest layer. Every property.", false, "the idea");
  body(s, "The guest is identified once and read by every surface below the enterprise stack — consistently, in every property, whatever the brand standard requires.",
    M, 1.75, 8.4, 0.6, false, 13.5);

  s.addShape(pres.ShapeType.roundRect, { x: 4.9, y: 3.62, w: 3.5, h: 1.15, rectRadius: 0.12,
    fill: { color: INK }, line: { color: INK, width: 1 }, shadow: softShadow() });
  s.addText("THE GUEST RECORD", { isTextBox: true, x: 4.9, y: 3.79, w: 3.5, h: 0.3, margin: 0,
    fontFace: SANS, fontSize: 10.5, bold: true, charSpacing: 2, color: GOLD, align: "center" });
  s.addText("identity · preferences · history · consent", { isTextBox: true, x: 4.9, y: 4.13, w: 3.5, h: 0.4, margin: 0,
    fontFace: SANS, fontSize: 11.5, color: CREAM, align: "center" });

  const top = ["Pre-arrival", "Front desk", "In-room TV", "Guest mobile"];
  const bot = ["Restaurant & bar", "Concierge", "Payment & folio", "Group reporting"];
  const bw = 2.75, bgx = 0.4;
  top.forEach((t, i) => {
    const x = M + i * (bw + bgx);
    card(s, x, 2.95, bw, 0.5, false, WHITE);
    s.addText(t, { isTextBox: true, x, y: 2.95, w: bw, h: 0.5, margin: 0,
      fontFace: SANS, fontSize: 12, bold: true, color: INK, align: "center", valign: "middle" });
    s.addShape(pres.ShapeType.line, { x: x + bw / 2, y: 3.45, w: 0, h: 0.17, line: { color: GOLD_DEEP, width: 1.5 } });
  });
  bot.forEach((t, i) => {
    const x = M + i * (bw + bgx);
    card(s, x, 4.94, bw, 0.5, false, WHITE);
    s.addText(t, { isTextBox: true, x, y: 4.94, w: bw, h: 0.5, margin: 0,
      fontFace: SANS, fontSize: 12, bold: true, color: INK, align: "center", valign: "middle" });
    s.addShape(pres.ShapeType.line, { x: x + bw / 2, y: 4.77, w: 0, h: 0.17, line: { color: GOLD_DEEP, width: 1.5 } });
  });
  s.addText("One deployment model, repeated per property — so the estate converges instead of diverging.",
    { isTextBox: true, x: M, y: 5.85, w: CW, h: 0.35, margin: 0,
      fontFace: SANS, fontSize: 12.5, italic: true, color: GOLD_DEEP, align: "center" });
  s.addNotes("For an operator the word that matters is 'converges'. Every year of local procurement pushes the estate further apart; this is the first layer that pulls it back together without touching the enterprise core.");
}

/* ================================================ 5. WHERE WE SIT */
{
  const s = lightSlide();
  slideTitle(s, "Where we sit in your stack", false, "integration");
  body(s, "We do not replace central reservations, the property management system, or the loyalty programme. We consume them, and we own the layer they do not reach.",
    M, 1.7, 10.5, 0.45, false, 13.5);

  // band 1 — enterprise (theirs)
  card(s, M, 2.28, CW, 1.0, false, "0B1220");
  s.addText("YOURS — ENTERPRISE, UNCHANGED", { isTextBox: true, x: M + 0.32, y: 2.42, w: 4.2, h: 0.26, margin: 0,
    fontFace: SANS, fontSize: 10, bold: true, charSpacing: 1.6, color: GOLD });
  ["Central reservations", "Property management", "Enterprise loyalty", "SIP PBX", "Corporate finance", "Identity / SSO"].forEach((t, i) => {
    const x = M + 0.32 + i * 1.88;
    s.addShape(pres.ShapeType.roundRect, { x, y: 2.74, w: 1.78, h: 0.4, rectRadius: 0.2,
      fill: { color: "1C2942" }, line: { color: INK_LINE, width: 1 } });
    s.addText(t, { isTextBox: true, x, y: 2.74, w: 1.78, h: 0.4, margin: 0,
      fontFace: SANS, fontSize: 9, bold: true, color: CREAM, align: "center", valign: "middle" });
  });

  [1.9, 11.5].forEach(x => s.addShape(pres.ShapeType.line, { x, y: 3.32, w: 0, h: 0.3,
    line: { color: GOLD_DEEP, width: 1.5, beginArrowType: "triangle", endArrowType: "triangle" } }));
  s.addText("guest & stay sync  ·  folio posting  ·  loyalty accrual  ·  call records  ·  single sign-on", { isTextBox: true,
    x: M, y: 3.35, w: CW, h: 0.26, margin: 0, fontFace: SANS, fontSize: 9.5, italic: true, color: GOLD_DEEP, align: "center" });

  // band 2 — ours
  card(s, M, 3.7, CW, 1.35, false, "FBF6E9");
  s.addText("OURS — THE PROPERTY GUEST LAYER", { isTextBox: true, x: M + 0.32, y: 3.84, w: 4.4, h: 0.26, margin: 0,
    fontFace: SANS, fontSize: 10, bold: true, charSpacing: 1.6, color: GOLD_DEEP });
  const mods = ["Identity\n& docs", "Guest\nprofile", "Direct\nbooking", "Facility\nbookings", "Payments\n& folio", "Ordering\nF&B", "Concierge\n& service", "Voice\n& PBX", "Entertainment\n& TV", "Operations\n& data"];
  mods.forEach((t, i) => {
    const x = M + 0.32 + i * 1.129;
    s.addShape(pres.ShapeType.roundRect, { x, y: 4.16, w: 1.07, h: 0.72, rectRadius: 0.08,
      fill: { color: WHITE }, line: { color: GOLD_DEEP, width: 1 } });
    s.addText(t, { isTextBox: true, x: x + 0.01, y: 4.16, w: 1.05, h: 0.72, margin: 0,
      fontFace: SANS, fontSize: 8, bold: true, color: INK, align: "center", valign: "middle", lineSpacing: 10 });
  });

  [1.9, 6.67, 11.5].forEach(x => s.addShape(pres.ShapeType.line, { x, y: 5.09, w: 0, h: 0.28,
    line: { color: GOLD_DEEP, width: 1.5, endArrowType: "triangle" } }));

  // band 3 — surfaces
  card(s, M, 5.45, CW, 0.95, false);
  s.addText("SURFACES", { isTextBox: true, x: M + 0.32, y: 5.57, w: 2.0, h: 0.26, margin: 0,
    fontFace: SANS, fontSize: 10, bold: true, charSpacing: 1.6, color: MUTED_L });
  ["In-room TV", "In-room phone", "Guest mobile", "QR on site", "Front desk", "Kitchen display", "Housekeeping", "Manager view"].forEach((t, i) => {
    const x = M + 2.2 + i * 1.216;
    s.addText(t, { isTextBox: true, x, y: 5.55, w: 1.18, h: 0.28, margin: 0,
      fontFace: SANS, fontSize: 9, bold: true, color: INK, align: "center" });
  });
  s.addText("guest-facing", { isTextBox: true, x: M + 2.2, y: 5.98, w: 4.86, h: 0.24, margin: 0,
    fontFace: SANS, fontSize: 9, italic: true, color: MUTED_L, align: "center" });
  s.addText("staff-facing", { isTextBox: true, x: M + 7.06, y: 5.98, w: 4.86, h: 0.24, margin: 0,
    fontFace: SANS, fontSize: 9, italic: true, color: MUTED_L, align: "center" });
  footnote(s, "Integration is scoped per PMS and per loyalty platform. We do not promise a generic connector — the interface is agreed before the pilot.", false);
  s.addNotes("This is the slide the group's IT function will test you on. The honest position — scoped per vendor, agreed before pilot, no generic connector — is what separates a credible integration story from a slideware one.");
}

/* ================================================ 6. MODULES */
{
  const s = lightSlide();
  slideTitle(s, "Ten modules, one platform", false, "at a glance");
  const mods = [
    ["ID", "Identity & Documents", "Scanning, OCR, e-signature, secure vault"],
    ["CR", "Guest Profile", "Preferences, allergies, history, consent"],
    ["BK", "Booking", "Direct engine, pre-arrival upsell"],
    ["RV", "Reservations", "Tables, spa, function rooms, tours"],
    ["PY", "Payments & Folio", "Cards, wallets, room charge, settlement"],
    ["OR", "Ordering", "Restaurant, bar, in-room dining, kitchen display"],
    ["SV", "Concierge & Service", "Requests, SLA ticketing, housekeeping"],
    ["TV", "Entertainment", "Guest TV app, live and on-demand, casting"],
    ["VO", "Voice", "In-room SIP phone, wake-ups, call posting"],
    ["OP", "Operations", "Dashboards, analytics, RBAC, audit"],
  ];
  const cw = 2.146, ch = 2.0, gx = 0.3, gy = 0.26;
  mods.forEach((m, i) => {
    const col = i % 5, row = Math.floor(i / 5);
    const x = M + col * (cw + gx), y = 1.85 + row * (ch + gy);
    card(s, x, y, cw, ch, false, m[0] === "VO" ? "FBF6E9" : PAPER);
    badge(s, x + 0.22, y + 0.22, m[0], false, 0.44);
    s.addText(m[1], { isTextBox: true, x: x + 0.22, y: y + 0.78, w: cw - 0.44, h: 0.54, margin: 0,
      fontFace: SANS, fontSize: 12.5, bold: true, color: INK, lineSpacing: 15 });
    s.addText(m[2], { isTextBox: true, x: x + 0.22, y: y + 1.32, w: cw - 0.44, h: 0.58, margin: 0,
      fontFace: SANS, fontSize: 9.5, color: MUTED_L, lineSpacing: 12.5 });
  });
  s.addText("Adopted as a whole, or module by module against the gaps in a given property — the guest record is shared from the first one.",
    { isTextBox: true, x: M, y: 6.35, w: CW, h: 0.35, margin: 0,
      fontFace: SANS, fontSize: 12, italic: true, color: GOLD_DEEP, align: "center" });
  s.addNotes("Voice is the newest module and the easiest sell to a property that already runs a PBX: it is the only one that adds a guest-facing device without adding a platform, because the handset registers to the SIP system they already own.");
}

/* ================================================ 7. GUEST JOURNEY */
{
  const s = lightSlide();
  slideTitle(s, "What the guest actually experiences", false, "end to end");
  const steps = [
    ["1", "Book", "Through your central reservations, unchanged. We pick the guest up on confirmation."],
    ["2", "Pre-arrival", "Passport scanned at home, registration card signed, card authorised, upsell offered."],
    ["3", "Arrive", "Past the desk. Key issued, and the television already greets them by name."],
    ["4", "Stay", "Dinner, the spa, the concierge — from the remote or their own phone."],
    ["5", "Check out", "Folio reviewed on screen, settled, gone. No queue."],
    ["6", "Return", "Preferences travel to the next property in the estate, not just the next stay here."],
  ];
  const cw = 1.93, gx = 0.14;
  steps.forEach((st, i) => {
    const x = M + i * (cw + gx);
    card(s, x, 2.1, cw, 3.05, false, (i === 3 || i === 5) ? "FBF6E9" : PAPER);
    badge(s, x + cw / 2 - 0.24, 2.36, st[0], false, 0.48);
    s.addText(st[1], { isTextBox: true, x: x + 0.16, y: 3.0, w: cw - 0.32, h: 0.32, margin: 0,
      fontFace: SANS, fontSize: 13.5, bold: true, color: INK, align: "center" });
    s.addText(st[2], { isTextBox: true, x: x + 0.18, y: 3.42, w: cw - 0.36, h: 1.6, margin: 0,
      fontFace: SANS, fontSize: 10.5, color: MUTED_L, lineSpacing: 14, align: "center" });
    if (i < steps.length - 1) {
      s.addShape(pres.ShapeType.line, { x: x + cw + 0.02, y: 2.6, w: 0.1, h: 0,
        line: { color: GOLD_DEEP, width: 1.5, endArrowType: "triangle" } });
    }
  });
  s.addText("Step six is the one only a group can offer — and today almost none do.",
    { isTextBox: true, x: M, y: 5.42, w: CW, h: 0.35, margin: 0,
      fontFace: SANS, fontSize: 12.5, italic: true, color: GOLD_DEEP, align: "center" });
  s.addNotes("Land step six hard. Preference portability across the estate is a genuine group advantage that independents structurally cannot match, and most groups fail to deliver it below the loyalty tier.");
}

/* ================================================ 8. DIVIDER 01 */
{
  const s = darkSlide();
  s.addShape(pres.ShapeType.roundRect, { x: 9.4, y: 1.2, w: 3.6, h: 5.1, rectRadius: 0.2,
    fill: { color: GOLD, transparency: 91 }, line: { color: GOLD, transparency: 80, width: 1 } });
  s.addText("01", { isTextBox: true, x: M, y: 2.25, w: 2, h: 0.9, margin: 0,
    fontFace: SERIF, fontSize: 60, bold: true, color: GOLD });
  s.addText("Arrival, digitalized", { isTextBox: true, x: M, y: 3.25, w: 8.4, h: 0.85, margin: 0,
    fontFace: SERIF, fontSize: 40, bold: true, color: CREAM });
  s.addText("From photocopied passports held at property level to a scanned, parsed, signed and\ncentrally retention-managed record — under one policy across the whole estate.",
    { isTextBox: true, x: M, y: 4.2, w: 8.4, h: 0.9, margin: 0,
      fontFace: SANS, fontSize: 14, color: MUTED_D, lineSpacing: 22 });
  s.addNotes("Section break. For a group, the interesting word is 'centrally' — document risk currently sits with each property and is invisible to head office.");
}

/* ================================================ 9. DOCUMENTS */
{
  const s = lightSlide();
  slideTitle(s, "The filing cabinet, retired — estate-wide", false, "documents & scanning");
  const flow = [
    ["Scan", "Passport, national ID or licence. The guest's own phone works for pre-arrival capture."],
    ["Parse", "Machine-readable zone and field OCR extract name, number, nationality and expiry. No typing."],
    ["Sign", "Registration card pre-filled from the scan, signed on a tablet or the guest's phone."],
    ["Vault", "Encrypted storage under a separate key. Every read logged with actor, time and reason."],
    ["Purge", "One retention policy, set by the group, enforced per property, with a provable deletion trail."],
  ];
  const cw = 2.31, gx = 0.155;
  flow.forEach((f, i) => {
    const x = M + i * (cw + gx);
    card(s, x, 2.0, cw, 2.45, false);
    badge(s, x + 0.22, 2.22, String(i + 1), false, 0.44);
    s.addText(f[0], { isTextBox: true, x: x + 0.22, y: 2.78, w: cw - 0.44, h: 0.32, margin: 0,
      fontFace: SANS, fontSize: 14.5, bold: true, color: INK });
    s.addText(f[1], { isTextBox: true, x: x + 0.22, y: 3.16, w: cw - 0.44, h: 1.2, margin: 0,
      fontFace: SANS, fontSize: 10.5, color: MUTED_L, lineSpacing: 14 });
  });
  card(s, M, 4.72, CW, 1.15, false, "0B1220");
  s.addText("Also in the vault", { isTextBox: true, x: M + 0.35, y: 4.92, w: 2.6, h: 0.3, margin: 0,
    fontFace: SANS, fontSize: 11, bold: true, charSpacing: 1.5, color: GOLD });
  s.addText("Folios and invoices · signed contracts and banquet event orders · incident reports · supplier documents · the statutory guest register, exportable per jurisdiction for police and immigration filing",
    { isTextBox: true, x: M + 0.35, y: 5.25, w: CW - 0.7, h: 0.45, margin: 0,
      fontFace: SANS, fontSize: 12, color: CREAM });
  s.addNotes("Per-jurisdiction register export is the detail that matters to a cross-border operator — the obligation differs by market and is currently met manually, differently, in each one.");
}

/* ================================================ 10. GUEST PROFILE */
{
  const s = lightSlide();
  slideTitle(s, "The guest, remembered across the estate", false, "guest profile");
  card(s, M, 1.85, 6.0, 3.9, false);
  s.addText("What the property record holds", { isTextBox: true, x: M + 0.4, y: 2.12, w: 5.2, h: 0.32, margin: 0,
    fontFace: SANS, fontSize: 15, bold: true, color: INK });
  bullets(s, [
    "Preferences captured once — floor, bed, pillow, newspaper, language",
    "Allergies and dietary restrictions, which reach the kitchen ticket as a hard warning",
    "Spend across every outlet, not just room revenue",
    "Service history: what was asked for, how fast it was delivered, what went wrong",
    "A consent ledger recording what was agreed, when, and which version of the text was shown",
  ], M + 0.4, 2.6, 5.2, 2.9, false, 12.5);

  card(s, M + 6.4, 1.85, CW - 6.4, 3.9, false, "0B1220");
  s.addText("What it changes", { isTextBox: true, x: M + 6.8, y: 2.12, w: 4.4, h: 0.32, margin: 0,
    fontFace: SANS, fontSize: 15, bold: true, color: GOLD });
  const chg = [
    ["Loyalty gets substance", "Your programme knows the stays. This adds what they ate, asked for and cared about."],
    ["The allergy", "Flagged at the kitchen, not remembered by a waiter who is off shift tomorrow."],
    ["Portability", "A preference set in one property is honoured at the next one in the estate."],
    ["Recovery", "A service failure is visible to the next property before the guest has to repeat it."],
  ];
  chg.forEach((c, i) => {
    const y = 2.6 + i * 0.78;
    s.addText(c[0], { isTextBox: true, x: M + 6.8, y, w: 4.7, h: 0.28, margin: 0,
      fontFace: SANS, fontSize: 12.5, bold: true, color: CREAM });
    s.addText(c[1], { isTextBox: true, x: M + 6.8, y: y + 0.29, w: 4.7, h: 0.44, margin: 0,
      fontFace: SANS, fontSize: 10.5, color: MUTED_D, lineSpacing: 14 });
  });
  s.addNotes("'Loyalty gets substance' is the line for the operator: the enterprise programme knows transactions, not preferences. This feeds it the texture it has never had.");
}

/* ================================================ 11. RESERVATIONS */
{
  const s = lightSlide();
  slideTitle(s, "Rooms are yours. The rest has no system.", false, "reservations & ancillary");
  body(s, "We do not compete with central reservations for room inventory. We take the reservation as an input, and we run the demand your enterprise stack was never built to handle.",
    M, 1.72, 10.8, 0.62, false, 13.5);

  card(s, M, 2.45, 5.75, 3.25, false, PAPER);
  s.addText("Rooms — yours", { isTextBox: true, x: M + 0.38, y: 2.72, w: 5.0, h: 0.34, margin: 0,
    fontFace: SANS, fontSize: 16, bold: true, color: INK });
  bullets(s, [
    "Central reservations remains the system of record",
    "We consume the confirmed reservation, and return the stay",
    "Direct booking engine available where a property needs its own",
    "Pre-arrival upsell layered on any reservation, whatever its channel",
  ], M + 0.38, 3.22, 5.05, 2.35, false, 12.5);

  card(s, M + 6.15, 2.45, CW - 6.15, 3.25, false, "FBF6E9");
  s.addText("Everything else — ours", { isTextBox: true, x: M + 6.53, y: 2.72, w: 5.0, h: 0.34, margin: 0,
    fontFace: SANS, fontSize: 16, bold: true, color: INK });
  bullets(s, [
    "Restaurant tables, by service and by section",
    "Spa treatments and therapist availability",
    "Gym classes, courts, equipment and pool cabanas",
    "Function and meeting rooms, with banquet event orders",
    "Tours, transfers and airport pickup",
  ], M + 6.53, 3.22, 5.05, 2.35, false, 12.5);

  card(s, M, 5.9, CW, 0.82, false, "0B1220");
  s.addText("One capacity engine serves every resource — a table, a therapist, a boardroom and a shuttle seat are the same problem, solved once and deployed estate-wide.",
    { isTextBox: true, x: M + 0.35, y: 5.9, w: CW - 0.7, h: 0.82, margin: 0,
      fontFace: SANS, fontSize: 12.5, color: CREAM, valign: "middle" });
  s.addNotes("Conceding room inventory to the CRS is what makes the rest of the pitch credible. A vendor who claims to replace central reservations is shown the door; a vendor who claims the ancillary layer is filling a real gap.");
}

/* ================================================ 12. PAYMENTS */
{
  const s = lightSlide();
  slideTitle(s, "Every charge, one folio", false, "payments & folio");
  body(s, "Bar, restaurant, spa, minibar, laundry, the television — every outlet posts through one interface, and the folio reconciles to the property management system you already run.",
    M, 1.72, 10.6, 0.62, false, 13.5);

  const sources = ["Restaurant", "Bar", "In-room dining", "Spa & facilities", "Entertainment", "Minibar & laundry"];
  const bw = 1.87, bgx = 0.13;
  sources.forEach((t, i) => {
    const x = M + i * (bw + bgx);
    card(s, x, 2.5, bw, 0.62, false, WHITE);
    s.addText(t, { isTextBox: true, x: x + 0.06, y: 2.5, w: bw - 0.12, h: 0.62, margin: 0,
      fontFace: SANS, fontSize: 11, bold: true, color: INK, align: "center", valign: "middle" });
    s.addShape(pres.ShapeType.line, { x: x + bw / 2, y: 3.12, w: 0, h: 0.26,
      line: { color: GOLD_DEEP, width: 1.5, endArrowType: "triangle" } });
  });
  s.addShape(pres.ShapeType.roundRect, { x: M, y: 3.42, w: CW, h: 0.78, rectRadius: 0.1,
    fill: { color: INK }, line: { color: INK, width: 1 }, shadow: softShadow() });
  s.addText("THE GUEST FOLIO   →   POSTED TO YOUR PMS", { isTextBox: true, x: M, y: 3.42, w: CW, h: 0.78, margin: 0,
    fontFace: SANS, fontSize: 14, bold: true, charSpacing: 2, color: GOLD, align: "center", valign: "middle" });

  const pay = [
    ["Settlement", "Card, digital wallet, bank transfer and cash — reconciled in one ledger, per property"],
    ["Card on file", "Tokenised for pre-authorisation, incidentals and no-show charges"],
    ["Flexible billing", "Split by guest, item or company; city ledger for corporate and group accounts"],
    ["PCI scope", "Card data goes device to acquirer. We hold a token, never a card number"],
  ];
  const pw = 2.92, pgx = 0.31;
  pay.forEach((p, i) => {
    const x = M + i * (pw + pgx);
    card(s, x, 4.45, pw, 1.42, false);
    s.addText(p[0], { isTextBox: true, x: x + 0.24, y: 4.64, w: pw - 0.48, h: 0.3, margin: 0,
      fontFace: SANS, fontSize: 12.5, bold: true, color: INK });
    s.addText(p[1], { isTextBox: true, x: x + 0.24, y: 4.98, w: pw - 0.48, h: 0.82, margin: 0,
      fontFace: SANS, fontSize: 10.5, color: MUTED_L, lineSpacing: 14 });
  });
  s.addNotes("Tokenisation keeps the property on the light-touch PCI self-assessment. For a group with a hundred properties that is a hundred audits made cheaper, which is a procurement argument as much as a technical one.");
}

/* ================================================ 13. F&B */
{
  const s = lightSlide();
  slideTitle(s, "Four ways to order. One kitchen.", false, "food & beverage");
  const ch = [
    ["01", "At the table", "Server on a tablet, or the guest scans the code and orders without waiting."],
    ["02", "At the bar", "Tabs that follow the guest and close to the room, not to a card at the till."],
    ["03", "From the room", "In-room dining on the television or the phone, posted to the folio automatically."],
    ["04", "Anywhere on site", "Poolside, lobby, terrace. The code carries the location; the order knows where to go."],
  ];
  const cw = 2.92, gx = 0.31;
  ch.forEach((c, i) => {
    const x = M + i * (cw + gx);
    card(s, x, 1.8, cw, 2.15, false);
    badge(s, x + 0.24, 2.02, c[0], false, 0.44);
    s.addText(c[1], { isTextBox: true, x: x + 0.24, y: 2.58, w: cw - 0.48, h: 0.3, margin: 0,
      fontFace: SANS, fontSize: 13.5, bold: true, color: INK });
    s.addText(c[2], { isTextBox: true, x: x + 0.24, y: 2.94, w: cw - 0.48, h: 0.92, margin: 0,
      fontFace: SANS, fontSize: 10.5, color: MUTED_L, lineSpacing: 14 });
  });
  card(s, M, 4.2, CW, 1.62, false, "0B1220");
  s.addText("Behind all four", { isTextBox: true, x: M + 0.38, y: 4.42, w: 3, h: 0.3, margin: 0,
    fontFace: SANS, fontSize: 12, bold: true, charSpacing: 1.5, color: GOLD });
  const back = [
    ["Kitchen display", "Tickets routed by prep station, courses fired in order, bar split from kitchen."],
    ["Live menu control", "Remove an item once and it clears the television, the codes and the tablets at once."],
    ["Margin, not just revenue", "Recipe costing and stock depletion roll outlet profitability up to the group."],
  ];
  back.forEach((b, i) => {
    const x = M + 0.38 + i * 3.95;
    s.addText(b[0], { isTextBox: true, x, y: 4.82, w: 3.75, h: 0.28, margin: 0,
      fontFace: SANS, fontSize: 12.5, bold: true, color: CREAM });
    s.addText(b[1], { isTextBox: true, x, y: 5.12, w: 3.75, h: 0.6, margin: 0,
      fontFace: SANS, fontSize: 10.5, color: MUTED_D, lineSpacing: 14 });
  });
  s.addNotes("Outlet margin rolling up to the group is the F&B point head office cares about — most estates can see outlet revenue and cannot see outlet profitability without a manual exercise.");
}

/* ================================================ 14. CONCIERGE */
{
  const s = lightSlide();
  slideTitle(s, "Every request in one queue", false, "concierge & service");
  body(s, "A guest asks by television, by phone, by chat or at the desk. Staff see one list. Head office sees whether the brand standard was met.",
    M, 1.72, 9.5, 0.4, false, 13.5);

  card(s, M, 2.35, 5.6, 3.5, false);
  s.addText("How a request moves", { isTextBox: true, x: M + 0.38, y: 2.6, w: 4.8, h: 0.32, margin: 0,
    fontFace: SANS, fontSize: 15, bold: true, color: INK });
  const steps = ["Raised — from any channel, tagged to the stay",
                 "Classified — type, priority, target time",
                 "Assigned — to a person, not to a department",
                 "Clocked — the SLA runs, and escalates if it breaches",
                 "Closed — logged against the guest, the room and the property"];
  steps.forEach((t, i) => {
    const y = 3.06 + i * 0.53;
    badge(s, M + 0.38, y, String(i + 1), false, 0.34);
    s.addText(t, { isTextBox: true, x: M + 0.86, y: y + 0.02, w: 4.55, h: 0.32, margin: 0,
      fontFace: SANS, fontSize: 11.5, color: MUTED_L });
  });

  const right = [
    ["Housekeeping", "Room status, turn-down, linen, inspection and out-of-order rooms on one board."],
    ["Maintenance", "Work orders with asset history, so a recurring fault becomes visible as a pattern."],
    ["Brand standard reporting", "SLA attainment per property, comparable across the estate, without a manual audit."],
  ];
  right.forEach((r, i) => {
    const y = 2.35 + i * 1.2;
    card(s, M + 6.0, y, CW - 6.0, 1.1, false, i === 2 ? "FBF6E9" : PAPER);
    s.addText(r[0], { isTextBox: true, x: M + 6.36, y: y + 0.18, w: 5.2, h: 0.3, margin: 0,
      fontFace: SANS, fontSize: 13.5, bold: true, color: INK });
    s.addText(r[1], { isTextBox: true, x: M + 6.36, y: y + 0.52, w: 5.2, h: 0.5, margin: 0,
      fontFace: SANS, fontSize: 11, color: MUTED_L, lineSpacing: 14 });
  });
  s.addNotes("Brand standard reporting is the operator's hook. Today SLA attainment is measured by mystery shopper and self-report; this measures it continuously as a by-product of doing the work.");
}

/* ================================================ 15. DIVIDER 02 */
{
  const s = darkSlide();
  s.addShape(pres.ShapeType.roundRect, { x: 9.4, y: 1.2, w: 3.6, h: 5.1, rectRadius: 0.2,
    fill: { color: TEAL, transparency: 91 }, line: { color: TEAL, transparency: 80, width: 1 } });
  s.addText("02", { isTextBox: true, x: M, y: 2.25, w: 2, h: 0.9, margin: 0,
    fontFace: SERIF, fontSize: 60, bold: true, color: GOLD });
  s.addText("The devices in the room", { isTextBox: true, x: M, y: 3.25, w: 8.4, h: 0.85, margin: 0,
    fontFace: SERIF, fontSize: 40, bold: true, color: CREAM });
  s.addText("The two things a guest touches once the door closes: the screen on the wall and\nthe handset beside the bed. Both bought locally in most estates. Both ours to fix.",
    { isTextBox: true, x: M, y: 4.2, w: 8.4, h: 0.9, margin: 0,
      fontFace: SANS, fontSize: 14, color: MUTED_D, lineSpacing: 22 });
  s.addNotes("Transition into the entertainment story. The framing for a group is consistency, not novelty.");
}

/* ================================================ 16. TV HUB */
{
  const s = darkSlide();
  slideTitle(s, "From a television into the hotel itself", true, "the guest hub");

  /* ---- the actual Orpheus interface, drawn in the product's own colours ---- */
  const FX = M, FY = 1.85, FW = 7.1, FH = 4.0;              // screen frame
  s.addShape(pres.ShapeType.roundRect, { x: FX, y: FY, w: FW, h: FH, rectRadius: 0.09,
    fill: { color: O_BG }, line: { color: INK_LINE, width: 2 }, shadow: darkShadow() });

  // left rail
  s.addShape(pres.ShapeType.roundRect, { x: FX + 0.02, y: FY + 0.02, w: 1.5, h: FH - 0.04, rectRadius: 0.08,
    fill: { color: O_RAIL }, line: { color: O_LINE, width: 1 } });
  s.addShape(pres.ShapeType.ellipse, { x: FX + 0.16, y: FY + 0.17, w: 0.2, h: 0.2,
    fill: { color: "3A2560" }, line: { color: "553A8A", width: 1 } });
  s.addText([{ text: "Orph", options: { color: O_PURPLE } }, { text: "eus", options: { color: O_MAGENTA } }],
    { isTextBox: true, x: FX + 0.42, y: FY + 0.13, w: 1.0, h: 0.28, margin: 0,
      fontFace: SANS, fontSize: 11, bold: true });

  const rnav = ["Home", "Live TV", "Movies", "TV Shows", "Music"];
  rnav.forEach((n, i) => {
    const y = FY + 0.61 + i * 0.30;
    if (i === 0) s.addShape(pres.ShapeType.roundRect, { x: FX + 0.14, y, w: 1.26, h: 0.26, rectRadius: 0.05,
      fill: { color: O_ACTIVE }, line: { color: O_ACTIVE, width: 1 } });
    s.addText(n, { isTextBox: true, x: FX + 0.24, y, w: 1.16, h: 0.26, margin: 0,
      fontFace: SANS, fontSize: 8, bold: true, color: i === 0 ? CREAM : O_NAV, valign: "middle" });
  });
  s.addShape(pres.ShapeType.line, { x: FX + 0.16, y: FY + 2.14, w: 1.22, h: 0, line: { color: O_LINE, width: 1 } });
  s.addText("YOUR STAY", { isTextBox: true, x: FX + 0.16, y: FY + 2.21, w: 1.2, h: 0.16, margin: 0,
    fontFace: SANS, fontSize: 5.5, bold: true, charSpacing: 1.2, color: "6B6088" });
  ["Dining", "Concierge", "My Bill"].forEach((n, i) => {
    s.addText(n, { isTextBox: true, x: FX + 0.24, y: FY + 2.45 + i * 0.30, w: 1.16, h: 0.26, margin: 0,
      fontFace: SANS, fontSize: 8, bold: true, color: O_NAV, valign: "middle" });
  });

  // content pane
  const CX = FX + 1.65;
  s.addText("Good evening, Ms Reyes", { isTextBox: true, x: CX, y: FY + 0.13, w: 3.4, h: 0.3, margin: 0,
    fontFace: SERIF, fontSize: 14, bold: true, color: CREAM });
  s.addText("2 nights remaining  ·  Gold member", { isTextBox: true, x: CX, y: FY + 0.43, w: 3.4, h: 0.2, margin: 0,
    fontFace: SANS, fontSize: 7.5, color: O_MUTE });
  s.addShape(pres.ShapeType.roundRect, { x: FX + 5.75, y: FY + 0.13, w: 1.25, h: 0.26, rectRadius: 0.13,
    fill: { color: "1A1130" }, line: { color: "2E2150", width: 1 } });
  s.addText("Room 812 · Gold", { isTextBox: true, x: FX + 5.75, y: FY + 0.13, w: 1.25, h: 0.26, margin: 0,
    fontFace: SANS, fontSize: 6.5, color: "CFC4EA", align: "center", valign: "middle" });

  // featured card
  s.addShape(pres.ShapeType.roundRect, { x: CX, y: FY + 0.77, w: 5.35, h: 1.12, rectRadius: 0.07,
    fill: { color: "2A1A4A" }, line: { color: "3A2463", width: 1 } });
  s.addShape(pres.ShapeType.roundRect, { x: CX + 0.12, y: FY + 0.87, w: 0.6, h: 0.92, rectRadius: 0.04,
    fill: { color: "8E5A6B" }, line: { color: "8E5A6B", width: 1 } });
  s.addText("FEATURED", { isTextBox: true, x: CX + 0.83, y: FY + 0.89, w: 1.4, h: 0.15, margin: 0,
    fontFace: SANS, fontSize: 5.5, bold: true, charSpacing: 1, color: O_FOCUS });
  s.addText("Office Romance", { isTextBox: true, x: CX + 0.83, y: FY + 1.04, w: 3.0, h: 0.26, margin: 0,
    fontFace: SANS, fontSize: 12.5, bold: true, color: CREAM });
  s.addText("2026  ·  Movies  ·  ★ R", { isTextBox: true, x: CX + 0.83, y: FY + 1.30, w: 2.4, h: 0.16, margin: 0,
    fontFace: SANS, fontSize: 6.5, color: O_MUTE });
  s.addShape(pres.ShapeType.roundRect, { x: CX + 0.83, y: FY + 1.51, w: 0.98, h: 0.22, rectRadius: 0.04,
    fill: { color: "B94AE8" }, line: { color: "B94AE8", width: 1 } });
  s.addText("▶  Watch now", { isTextBox: true, x: CX + 0.83, y: FY + 1.51, w: 0.98, h: 0.22, margin: 0,
    fontFace: SANS, fontSize: 6.5, bold: true, color: "FFFFFF", align: "center", valign: "middle" });

  // carousel
  s.addText("LAST ADDED MOVIES", { isTextBox: true, x: CX, y: FY + 2.05, w: 2.2, h: 0.18, margin: 0,
    fontFace: SANS, fontSize: 6.5, bold: true, charSpacing: 1.2, color: O_FOCUS });
  s.addText("See all →", { isTextBox: true, x: FX + 6.2, y: FY + 2.05, w: 0.8, h: 0.18, margin: 0,
    fontFace: SANS, fontSize: 6, color: O_MUTE, align: "right" });

  const art = [["On the Hunt", "8A3B22"], ["One Mile I", "3A4A5C"], ["One Mile II", "4A4438"],
               ["Mercy", "6B2230"], ["Mexicali", "8A6A2A"]];
  art.forEach((a, i) => {
    const x = CX + i * 1.06;
    s.addShape(pres.ShapeType.roundRect, { x, y: FY + 2.29, w: 0.94, h: 0.98, rectRadius: 0.05,
      fill: { color: a[1] }, line: { color: i === 0 ? O_FOCUS : "2A1C47", width: i === 0 ? 1.5 : 1 } });
    if (i === 0) {
      s.addShape(pres.ShapeType.ellipse, { x: x + 0.32, y: FY + 2.63, w: 0.3, h: 0.3,
        fill: { color: "FFFFFF" }, line: { color: "FFFFFF", width: 1 } });
      s.addText("▶", { isTextBox: true, x: x + 0.32, y: FY + 2.63, w: 0.3, h: 0.3, margin: 0,
        fontFace: SANS, fontSize: 9, color: "1A0F2E", align: "center", valign: "middle" });
    }
    s.addText([{ text: "▶ ", options: { color: O_PINK, fontSize: 5 } },
               { text: a[0], options: { color: CREAM, fontSize: 6 } }],
      { isTextBox: true, x, y: FY + 3.32, w: 0.98, h: 0.16, margin: 0, fontFace: SANS, bold: true });
    s.addText("2026", { isTextBox: true, x, y: FY + 3.48, w: 0.94, h: 0.14, margin: 0,
      fontFace: SANS, fontSize: 5.5, color: O_MUTE });
  });

  /* ---- right column ---- */
  const pts = [
    ["It is the Orpheus product", "The same application your subscribers use at home, running in a hospitality mode — not a hotel imitation of it."],
    ["Personal on arrival", "Name, nights remaining and loyalty tier, drawn from the same record the front desk reads."],
    ["Revenue, not just cost", "The remote reaches room service, the spa and the bar. The screen begins to earn."],
    ["The stay is the subscriber", "Entitlement is issued to the room for the dates of the stay. Profile, history and pairings are wiped at checkout."],
  ];
  pts.forEach((p, i) => {
    const y = 1.9 + i * 1.02;
    s.addText(p[0], { isTextBox: true, x: M + 7.5, y, w: 4.55, h: 0.28, margin: 0,
      fontFace: SANS, fontSize: 13, bold: true, color: GOLD });
    s.addText(p[1], { isTextBox: true, x: M + 7.5, y: y + 0.3, w: 4.6, h: 0.72, margin: 0,
      fontFace: SANS, fontSize: 10.5, color: MUTED_D, lineSpacing: 14 });
  });
  s.addNotes("The screen on this slide is the real interface, not an illustration — the same rail, featured card and rows a subscriber sees at home. That is the point: the hotel is not commissioning a bespoke TV system, it is switching on a hospitality mode in a product that already ships. Volunteer the checkout wipe before IT asks; every group has been burned by a guest finding the previous occupant's signed-in streaming account.");
}

/* ================================================ 17. NO SET-TOP BOX */
{
  const s = darkSlide();
  slideTitle(s, "No box behind the television", true, "why it matters at estate scale");
  const rows = [
    ["Hardware per room", "A set-top box, a power supply, an HDMI lead, a mount", "Nothing. The application runs on the television"],
    ["Install per property", "Every room cabled and provisioned individually", "One firmware profile, cloned across the estate"],
    ["Failure points", "Box, power supply and cable — all guest-accessible", "The television, already under warranty"],
    ["Guest input", "A second remote, and a lesson in which one to use", "The remote that came with the television"],
    ["Refresh cycle", "Boxes age and are replaced on their own cycle", "On the television capex plan you already have"],
  ];
  const y0 = 1.9, rh = 0.78;
  s.addText("Traditional hotel TV", { isTextBox: true, x: M + 4.15, y: y0 - 0.45, w: 3.9, h: 0.3, margin: 0,
    fontFace: SANS, fontSize: 11, bold: true, charSpacing: 1.5, color: MUTED_D });
  s.addText("Orpheus Hospitality Suite", { isTextBox: true, x: M + 8.25, y: y0 - 0.45, w: 3.9, h: 0.3, margin: 0,
    fontFace: SANS, fontSize: 11, bold: true, charSpacing: 1.5, color: GOLD });
  rows.forEach((r, i) => {
    const y = y0 + i * rh;
    s.addShape(pres.ShapeType.roundRect, { x: M, y, w: CW, h: rh - 0.1, rectRadius: 0.06,
      fill: { color: i % 2 ? "101A2C" : INK_SOFT }, line: { color: INK_LINE, width: 1 } });
    s.addText(r[0], { isTextBox: true, x: M + 0.3, y, w: 3.7, h: rh - 0.1, margin: 0,
      fontFace: SANS, fontSize: 12, bold: true, color: CREAM, valign: "middle" });
    s.addText(r[1], { isTextBox: true, x: M + 4.15, y, w: 3.95, h: rh - 0.1, margin: 0,
      fontFace: SANS, fontSize: 10.5, color: MUTED_D, valign: "middle" });
    s.addText(r[2], { isTextBox: true, x: M + 8.25, y, w: 3.45, h: rh - 0.1, margin: 0,
      fontFace: SANS, fontSize: 10.5, color: GOLD, valign: "middle" });
  });
  footnote(s, "Requires Android TV or Google TV hospitality models, which permit managed install and lockdown. Tizen and webOS estates run the same app on a small Android device until refresh.", true);
  s.addNotes("Raise the Android-SKU caveat yourself. For an owner it lands as a capex-timing question, not an objection: the platform aligns to the television refresh cycle already in the plan, and Android hospitality sets are the cheapest end of that market.");
}

/* ================================================ 18. ANDROID ESTATE */
{
  const s = lightSlide();
  slideTitle(s, "One Android app. Every screen.", false, "android, end to end");
  body(s, "Every device that runs our application runs Android — the television in the room, the tablets on the floor, the handhelds in the corridor, the kiosk in the lobby. One application, one release train, one way to manage a device.",
    M, 1.72, 11.4, 0.62, false, 13);

  const est = [
    ["In-room television", "Android TV / Google TV", "TCL, Sony, Hisense, Philips and others. The guest app runs on the set — nothing behind it.", true],
    ["Staff tablets", "Android", "Restaurant and bar point of sale, kitchen display, housekeeping and inspection boards.", false],
    ["Handhelds", "Android", "Passport and ID capture at the desk or kerbside, order running, maintenance work orders.", false],
    ["Self-service kiosk", "Android", "Lobby check-in, document capture and signature, key issue.", false],
  ];
  const cw = 2.92, gx = 0.31;
  est.forEach((e, i) => {
    const x = M + i * (cw + gx);
    card(s, x, 2.5, cw, 2.05, false, e[3] ? "FBF6E9" : PAPER);
    s.addText(e[0], { isTextBox: true, x: x + 0.26, y: 2.7, w: cw - 0.52, h: 0.62, margin: 0,
      fontFace: SERIF, fontSize: 17, bold: true, color: INK, lineSpacing: 21 });
    s.addText(e[1], { isTextBox: true, x: x + 0.26, y: 3.32, w: cw - 0.52, h: 0.28, margin: 0,
      fontFace: SANS, fontSize: 11, bold: true, color: GOLD_DEEP });
    s.addText(e[2], { isTextBox: true, x: x + 0.26, y: 3.66, w: cw - 0.52, h: 0.82, margin: 0,
      fontFace: SANS, fontSize: 10.5, color: MUTED_L, lineSpacing: 14 });
  });

  card(s, M, 4.75, CW, 1.55, false, "0B1220");
  s.addText("Why one operating system", { isTextBox: true, x: M + 0.35, y: 4.95, w: 5.2, h: 0.3, margin: 0,
    fontFace: SANS, fontSize: 12, bold: true, color: GOLD });
  s.addText("One codebase and one release train, not four · one device-management enrolment for the whole estate · commodity hardware the group can source in any market · a single patch and security posture to put in front of your vendor review",
    { isTextBox: true, x: M + 0.35, y: 5.28, w: 5.3, h: 0.85, margin: 0,
      fontFace: SANS, fontSize: 11, color: CREAM, lineSpacing: 14.5 });
  s.addText("Before we quote, we survey", { isTextBox: true, x: M + 6.3, y: 4.95, w: 5.2, h: 0.3, margin: 0,
    fontFace: SANS, fontSize: 12, bold: true, color: GOLD });
  s.addText("Television models per property, and whether they are Android hospitality SKUs · per-room network to each set · VLAN separation of guest and device traffic · multicast, where live television is carried over IP",
    { isTextBox: true, x: M + 6.3, y: 5.28, w: 5.3, h: 0.85, margin: 0,
      fontFace: SANS, fontSize: 11, color: CREAM, lineSpacing: 14.5 });

  footnote(s, "The in-room handset is the exception — a SIP endpoint on your own PBX. Tizen and webOS sets are not native Android targets, and run the app on a small device until refresh.", false);
  s.addNotes("Committing to Android is a strength, not a limitation — say it that way. One codebase instead of four, one MDM enrolment, and hardware the group can buy in any market. The cost is honest and on the slide: a Samsung or LG estate needs a small Android device until refresh, so establish early which sets a given property actually has.");
}

/* ================================================ 19. ORPHEUS NATIONS */
{
  const s = darkSlide();
  slideTitle(s, "A player, not a content deal", true, "the entertainment layer");
  body(s, "Orpheus Nations owns no content and holds no library. It is a multimedia player over a source registry: sources are configured per property, and the player verifies them continuously so a guest never meets a dead channel.",
    M, 1.78, 11.0, 0.62, true, 13);
  const items = [
    ["We are the player", "Nothing ships with content in it. No catalogue is bundled and no rights are held."],
    ["The sources are yours", "Your existing linear feeds, your licensed on-demand provider, free ad-supported channels, and your own hotel channels."],
    ["Smart search keeps it alive", "Every source is probed continuously for reachability. A dead endpoint is dropped before a guest can select it."],
    ["Change sources, not systems", "Sources are dynamic and can be updated at any time without touching a single television in the estate."]
  ];
  const cw = 2.92, gx = 0.31;
  items.forEach((it, i) => {
    const x = M + i * (cw + gx);
    card(s, x, 2.62, cw, 2.45, true);
    badge(s, x + 0.26, 2.84, String(i + 1), true, 0.44);
    s.addText(it[0], { isTextBox: true, x: x + 0.26, y: 3.4, w: cw - 0.52, h: 0.55, margin: 0,
      fontFace: SANS, fontSize: 13, bold: true, color: CREAM, lineSpacing: 17 });
    s.addText(it[1], { isTextBox: true, x: x + 0.26, y: 3.98, w: cw - 0.52, h: 0.88, margin: 0,
      fontFace: SANS, fontSize: 10.5, color: MUTED_D, lineSpacing: 14 });
  });
  card(s, M, 5.28, CW, 1.05, true, "1A2438");
  s.addText("Where the rights sit", { isTextBox: true, x: M + 0.35, y: 5.44, w: 3.4, h: 0.28, margin: 0,
    fontFace: SANS, fontSize: 12, bold: true, color: GOLD });
  s.addText("The property or the group supplies its sources and holds the right to show them. We supply the player, the interface and the verification. Put that boundary in the contract — a hotel is publicly performing whatever it puts on a guest television, and licensing that is the property's obligation.",
    { isTextBox: true, x: M + 0.35, y: 5.74, w: CW - 0.7, h: 0.5, margin: 0,
      fontFace: SANS, fontSize: 11, color: CREAM, lineSpacing: 14.5 });
  footnote(s, "Community-maintained link lists are not a licensed source for commercial redistribution. Hospitality estates are provisioned against the property's own licensed feeds.", true);
  s.addNotes("Say this slide plainly; it is the one a hotel's legal team will test. We are a player and a verification service, not a content supplier — the property brings sources it already has the right to show, which is usually its existing linear contract plus free ad-supported channels. That is an easier sale than it sounds: the group keeps its content deals and gets a better player, rather than being asked to switch supplier. Never imply the platform brings a licensed library, and never let a community link list near a hospitality deployment — a hotel showing an unlicensed stream is publicly performing it commercially, and that is the property's liability and the fastest way to lose the account.");
}

/* ================================================ 19b. VOICE */
{
  const s = lightSlide();
  slideTitle(s, "The phone beside the bed", false, "voice");
  body(s, "The SIP handset registers to the PBX you already run. We do not replace your telephony — we give the handset the guest record, and we put the calls on the folio.",
    M, 1.72, 10.8, 0.62, false, 13.5);

  const items = [
    ["Your PBX, unchanged", "The handset registers to your existing SIP platform. No forklift, no new call path, no carrier contract to renegotiate.", true],
    ["It knows who is in the room", "The display carries the guest's name and language. Dial 0 and the desk sees the profile before the call is answered.", false],
    ["Wake-up calls that work", "Set from the handset, the television or the desk — one schedule, escalating to the desk if the guest does not answer.", false],
    ["Calls on the folio", "Call records priced and posted to the same folio as dinner and the minibar, through the same interface as every other outlet.", false],
  ];
  const cw = 2.92, gx = 0.31;
  items.forEach((it, i) => {
    const x = M + i * (cw + gx);
    card(s, x, 2.5, cw, 2.3, false, it[2] ? "FBF6E9" : PAPER);
    badge(s, x + 0.24, 2.72, String(i + 1), false, 0.44);
    s.addText(it[0], { isTextBox: true, x: x + 0.24, y: 3.28, w: cw - 0.48, h: 0.56, margin: 0,
      fontFace: SANS, fontSize: 13, bold: true, color: INK, lineSpacing: 16 });
    s.addText(it[1], { isTextBox: true, x: x + 0.24, y: 3.86, w: cw - 0.48, h: 0.86, margin: 0,
      fontFace: SANS, fontSize: 10.5, color: MUTED_L, lineSpacing: 14 });
  });

  card(s, M, 5.0, CW, 1.35, false, "0B1220");
  s.addText("Staff carry extensions, not radios", { isTextBox: true, x: M + 0.35, y: 5.18, w: 5.2, h: 0.28, margin: 0,
    fontFace: SANS, fontSize: 12, bold: true, color: GOLD });
  s.addText("The same PBX rings the Android handhelds housekeeping and maintenance already carry. One numbering plan, no separate DECT fleet to buy or maintain, and a service ticket that can call the guest back.",
    { isTextBox: true, x: M + 0.35, y: 5.5, w: 5.3, h: 0.7, margin: 0,
      fontFace: SANS, fontSize: 11, color: CREAM, lineSpacing: 14.5 });
  s.addText("Emergency calling, verified", { isTextBox: true, x: M + 6.3, y: 5.18, w: 5.2, h: 0.28, margin: 0,
    fontFace: SANS, fontSize: 12, bold: true, color: GOLD });
  s.addText("Direct emergency dialling with no prefix, simultaneous notification to the front desk, and a dispatchable location for every room — checked at survey against the rules of each market you operate in.",
    { isTextBox: true, x: M + 6.3, y: 5.5, w: 5.3, h: 0.7, margin: 0,
      fontFace: SANS, fontSize: 11, color: CREAM, lineSpacing: 14.5 });

  footnote(s, "Analogue handsets in older rooms bridge to the same PBX through an adapter — a room does not have to be rewired to join the platform.", false);
  s.addNotes("Two things to lead with in the room. First, this is the cheapest module to say yes to: the PBX, the handsets and the numbering plan already exist, so the work is integration rather than replacement. Second, emergency calling — direct dial with no prefix, desk notification and a per-room dispatchable location are legal requirements in several markets and are the fastest way to find out whether a property's current telephony is actually compliant.");
}

/* ================================================ 20. OWNER vs OPERATOR */
{
  const s = lightSlide();
  slideTitle(s, "Owner and operator want different things", false, "who gets what");
  body(s, "In a branded estate the party funding the capital expenditure and the party setting the standard are rarely the same. The platform has to answer to both.",
    M, 1.72, 10.5, 0.45, false, 13.5);

  const cols = [
    ["The owner", "funds it", ["Ancillary revenue per occupied room, from a screen that previously earned nothing",
      "Local vendor contracts consolidated into one line",
      "Set-top hardware removed from the refresh plan",
      "Labour hours returned at the desk, the outlets and night audit",
      "An asset that improves on the schedule the televisions are replaced on anyway"], "FBF6E9"],
    ["The operator", "sets the standard", ["One guest experience across every property, not one per procurement decision",
      "Service SLAs measured continuously rather than by mystery shopper",
      "Brand standard compliance evidenced from operational data",
      "Guest preferences portable between properties in the estate",
      "Document retention under one policy, enforced everywhere"], PAPER],
  ];
  cols.forEach((c, i) => {
    const x = M + i * (5.95 + 0.44);
    card(s, x, 2.42, 5.95, 3.5, false, c[3]);
    s.addText(c[0], { isTextBox: true, x: x + 0.4, y: 2.66, w: 3.0, h: 0.36, margin: 0,
      fontFace: SERIF, fontSize: 21, bold: true, color: INK });
    s.addText(c[1], { isTextBox: true, x: x + 0.4, y: 3.04, w: 4.0, h: 0.28, margin: 0,
      fontFace: SANS, fontSize: 11, bold: true, charSpacing: 1.5, color: GOLD_DEEP });
    bullets(s, c[2], x + 0.4, 3.45, 5.15, 2.35, false, 11.5);
  });
  footnote(s, "For managed and franchised properties the split differs — we scope who signs, who pays and who is served, per agreement type.", false);
  s.addNotes("Ask early in the meeting which side of this slide the room sits on. A deck that pitches operator benefits to an owner, or capex savings to a brand team, loses both.");
}

/* ================================================ 21. COMMERCIAL CASE */
{
  const s = lightSlide();
  slideTitle(s, "Where the platform pays for itself", false, "the commercial case");
  body(s, "Six effects, each measurable on a property P&L and each multiplying by the number of properties. The chart is a worked model — we rebuild it on the group's real figures before proposal.",
    M, 1.7, 10.8, 0.6, false, 13);

  s.addChart(pres.ChartType.bar, [{
    name: "Annual effect per property",
    labels: ["Ancillary revenue\n(dining, spa and tours from the TV)", "Vendor contracts consolidated\n(TV, POS, concierge tooling)",
             "Labour hours returned\n(desk, outlets, night audit)", "Set-top hardware avoided\n(at TV refresh)",
             "Direct booking\n(where the property runs its own)", "Radio and DECT fleet avoided\n(staff handhelds are extensions)"],
    values: [1.00, 0.54, 0.47, 0.33, 0.29, 0.19],
  }], {
    x: M, y: 2.48, w: 7.5, h: 3.4,
    barDir: "bar", chartColors: [GOLD_DEEP],
    showTitle: false, showLegend: false, showValue: false,
    catAxisLabelColor: MUTED_L, catAxisLabelFontSize: 9.5, catAxisLabelFontFace: SANS,
    valAxisLabelColor: MUTED_L, valAxisLabelFontSize: 9, valAxisLabelFontFace: SANS,
    valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    barGapWidthPct: 55,
  });

  card(s, M + 7.9, 2.48, CW - 7.9, 3.4, false, "0B1220");
  s.addText("How to read this", { isTextBox: true, x: M + 8.25, y: 2.72, w: 3.6, h: 0.3, margin: 0,
    fontFace: SANS, fontSize: 13, bold: true, color: GOLD });
  s.addText("Bars are relative, not absolute. Ancillary revenue is set to 1.0 and the rest scaled against it.\n\nOnly two bars are revenue. The rest are cost — contracts not renewed, hours not worked, hardware not bought. They are the least visible effects and usually the most certain.\n\nCall revenue is deliberately absent: guests use their own mobiles, and telephony earns its place here on cost and compliance, not on billed minutes.",
    { isTextBox: true, x: M + 8.25, y: 3.1, w: 3.65, h: 2.6, margin: 0,
      fontFace: SANS, fontSize: 10.5, color: MUTED_D, lineSpacing: 14.5 });
  footnote(s, "Illustrative model only. No client figures have been used. Rebuilt on the group's own outlet revenue, vendor spend, payroll and capex plan at proposal stage.", false);
  s.addNotes("Say the caveat out loud. For an enterprise buyer, offering to rebuild the model on their numbers during the systems audit is the ask that converts this meeting into a second one. If someone asks why call revenue is not a bar: it has been falling for twenty years and pretending otherwise costs you credibility on every other bar.");
}

/* ================================================ 22. ENTERPRISE READINESS */
{
  const s = lightSlide();
  slideTitle(s, "Built for your vendor review", false, "enterprise readiness");
  const items = [
    ["Guest documents", "Identity scans encrypted under a separately managed key, released only with a reason code, purged on a group-set retention clock."],
    ["Card data", "Never touches the platform. Capture device to acquirer; we hold a token. PCI scope stays on the light-touch assessment."],
    ["Access control", "Role-based and least-privilege, federated to your identity provider. Group sees the estate, property sees itself."],
    ["Audit trail", "Append-only log of every state change. Every privileged read carries actor, time and reason, exportable for review."],
    ["Data residency", "Configurable per property and per region — a requirement for any operator across multiple jurisdictions."],
    ["Certification", "SOC 2 Type II and an independent penetration test are committed deliverables, completed before pilot sign-off."],
  ];
  const cw = 3.75, ch = 1.62, gx = 0.44, gy = 0.26;
  items.forEach((it, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = M + col * (cw + gx), y = 1.82 + row * (ch + gy);
    card(s, x, y, cw, ch, false, i === 5 ? "FBF6E9" : PAPER);
    s.addText(it[0], { isTextBox: true, x: x + 0.28, y: y + 0.2, w: cw - 0.56, h: 0.3, margin: 0,
      fontFace: SANS, fontSize: 13.5, bold: true, color: INK });
    s.addText(it[1], { isTextBox: true, x: x + 0.28, y: y + 0.56, w: cw - 0.56, h: 0.98, margin: 0,
      fontFace: SANS, fontSize: 10.5, color: MUTED_L, lineSpacing: 14 });
  });
  footnote(s, "Certification is stated as a commitment with a date, not as a credential already held. Any claim to the contrary should be corrected before this deck is presented.", false);
  s.addNotes("Be exact here. Enterprise procurement will ask for the SOC 2 report; promising it on a date is credible, implying it exists is a deal-ending discovery. Update this slide the moment the audit completes.");
}

/* ================================================ 23. ROLLOUT */
{
  const s = lightSlide();
  slideTitle(s, "Pilot one property. Then the estate.", false, "rollout");
  body(s, "Nothing is committed estate-wide before it is proven in a property the group chooses.",
    M, 1.72, 9.0, 0.4, false, 13.5);
  const ph = [
    ["1", "Pilot — survey & foundation", "Television and network survey. Guest record, identity capture and the document vault live in one property.", "Weeks 1–6"],
    ["2", "Pilot — money & the room", "Payments, folio, one outlet, and the guest television application. The full guest journey, one site.", "Weeks 7–16"],
    ["3", "Pilot — measure", "Ancillary revenue, SLA attainment and labour effect measured against the property's own baseline.", "Weeks 17–20"],
    ["4", "Cluster", "Three to five properties, deliberately mixed — different TV estates, different PMS versions, different markets.", "Months 6–10"],
    ["5", "Estate", "Standardised deployment runbook, regional teams, phased against the television refresh plan.", "Month 11+"],
  ];
  const rh = 0.74;
  ph.forEach((p, i) => {
    const y = 2.32 + i * rh;
    card(s, M, y, CW, rh - 0.09, false, i < 3 ? "FBF6E9" : PAPER);
    badge(s, M + 0.28, y + 0.11, p[0], false, 0.43);
    s.addText(p[1], { isTextBox: true, x: M + 0.9, y, w: 3.3, h: rh - 0.09, margin: 0,
      fontFace: SANS, fontSize: 12.5, bold: true, color: INK, valign: "middle" });
    s.addText(p[2], { isTextBox: true, x: M + 4.3, y, w: 6.15, h: rh - 0.09, margin: 0,
      fontFace: SANS, fontSize: 10.5, color: MUTED_L, valign: "middle" });
    s.addText(p[3], { isTextBox: true, x: M + 10.55, y, w: 1.35, h: rh - 0.09, margin: 0,
      fontFace: SANS, fontSize: 10.5, bold: true, color: GOLD_DEEP, align: "right", valign: "middle" });
  });
  s.addText("Phase 3 exists so the estate decision is made on measured results, not on this presentation.",
    { isTextBox: true, x: M, y: 6.15, w: CW, h: 0.35, margin: 0,
      fontFace: SANS, fontSize: 12, italic: true, color: GOLD_DEEP, align: "center" });
  s.addNotes("Phase 3 is the credibility move. Volunteering a measurement gate before estate commitment is what an enterprise buyer expects and what most vendors avoid offering.");
}

/* ================================================ 24. NEXT STEPS */
{
  const s = darkSlide();
  s.addShape(pres.ShapeType.roundRect, { x: 8.9, y: -0.9, w: 3.2, h: 6.0, rectRadius: 0.2,
    fill: { color: GOLD, transparency: 91 }, line: { color: GOLD, transparency: 80, width: 1 }, rotate: 18 });
  s.addText("NEXT STEPS", { isTextBox: true, x: M, y: 1.1, w: 7.6, h: 0.3, margin: 0,
    fontFace: SANS, fontSize: 12, bold: true, charSpacing: 3, color: GOLD });
  s.addText("One pilot property,\nchosen by you,\nmeasured against\nits own baseline", { isTextBox: true, x: M, y: 1.55, w: 7.4, h: 2.3, margin: 0,
    fontFace: SERIF, fontSize: 34, bold: true, color: CREAM, lineSpacing: 42 });

  const steps = [
    ["Systems and vendor audit", "What each property runs today, what it costs the group, and what the platform consolidates."],
    ["Integration scoping", "Your PMS, loyalty platform and identity provider — interfaces agreed and documented, not assumed."],
    ["Pilot proposal", "Commercial model rebuilt on your figures, with a measurement gate before any estate commitment."],
  ];
  steps.forEach((st, i) => {
    const y = 4.0 + i * 0.82;
    badge(s, M, y, String(i + 1), true, 0.42);
    s.addText(st[0], { isTextBox: true, x: M + 0.62, y: y - 0.02, w: 3.3, h: 0.55, margin: 0,
      fontFace: SANS, fontSize: 13, bold: true, color: GOLD, lineSpacing: 16 });
    s.addText(st[1], { isTextBox: true, x: M + 4.05, y: y - 0.02, w: 3.95, h: 0.62, margin: 0,
      fontFace: SANS, fontSize: 10.5, color: MUTED_D, lineSpacing: 14 });
  });
  s.addShape(pres.ShapeType.line, { x: M, y: 6.6, w: 11.9, h: 0, line: { color: INK_LINE, width: 1 } });
  s.addText("Orpheus Hospitality Suite  ·  one guest record, every property", { isTextBox: true, x: M, y: 6.75, w: 8, h: 0.3, margin: 0,
    fontFace: SANS, fontSize: 11, color: MUTED_D });
  s.addNotes("Close on the audit and the integration scoping, not on the product. Both are low-commitment yeses, and both produce the facts every later conversation depends on.");
}

pres.writeFile({ fileName: "presentation/Orpheus-Hospitality-Suite.pptx" })
  .then(f => console.log("Wrote", f));
