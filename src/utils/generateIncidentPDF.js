/**
 * generateIncidentPDF.js — Fentons IT NOC
 * Full green colour theme.
 */

import jsPDF     from "jspdf";
import autoTable from "jspdf-autotable";
import { LOGO_MAP }         from "../assets/logos/logoMap.js";
import { SITE_INFORMATION } from "../data/siteInformation.js";

// ── Geometry ──────────────────────────────────────────────────────────────────
const PW = 210, PH = 297, ML = 16, MR = 16, CW = PW - ML - MR;

// ── Green colour palette (replaces every blue) ────────────────────────────────
const INK        = [10,  30,  15];   // near-black with green tint
const INK_MID    = [55,  90,  65];   // mid green-grey for labels
const INK_LIGHT  = [130, 165, 140];  // light green-grey for footer text

const GREEN      = [22,  101, 52];   // #166534  forest green — accent / section bars
const GREEN_BG   = [240, 253, 244];  // #F0FDF4  very light green — banner & date boxes bg
const GREEN_DARK = [20,  83,  45];   // #14532D  deep green — header / footer bar / table heads
const GREEN_MID  = [187, 247, 208];  // #BBF7D0  light green tint for category text in header

const WHITE      = [255, 255, 255];
const BORDER     = [220, 237, 225];  // green-tinted border
const ROW_ALT    = [245, 252, 247];  // very light green alt row

// ── Helpers ───────────────────────────────────────────────────────────────────
const setFill = (d, c) => d.setFillColor(...c);
const setDraw = (d, c) => d.setDrawColor(...c);
const setTxt  = (d, c) => d.setTextColor(...c);
const setFont = (d, s, z) => { d.setFont("helvetica", s); if (z) d.setFontSize(z); };

function rule(doc, y, color = BORDER, lw = 0.25) {
  setDraw(doc, color); doc.setLineWidth(lw);
  doc.line(ML, y, PW - MR, y);
}

function fmtDT(raw) {
  if (!raw) return "N/A";
  const M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const [dp, tp] = raw.split(" ");
  if (!dp) return raw;
  const [y, m, d] = dp.split("-");
  if (!y || !m || !d) return raw;
  let s = `${d}-${M[parseInt(m,10)-1]}-${y}`;
  if (tp) {
    const [hh, mm] = tp.split(":");
    let h = parseInt(hh, 10);
    const ap = h >= 12 ? "PM" : "AM";
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    s += `   ${String(h).padStart(2,"0")}:${mm} ${ap}`;
  }
  return s;
}

function nowLabel() {
  const d = new Date();
  const M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${String(d.getDate()).padStart(2,"0")}-${M[d.getMonth()]}-${d.getFullYear()}`;
}

// ── Page-1 Header ─────────────────────────────────────────────────────────────
function drawHeader(doc, category) {
  const H      = 40;
  const LOGO_W = 52;
  const LOGO_H = 20.8;
  const LOGO_Y = (H - LOGO_H) / 2;

  // Deep green bar
  setFill(doc, GREEN_DARK);
  doc.rect(0, 0, PW, H, "F");

  // Thin accent stripe along the bottom of the header
  setFill(doc, GREEN);
  doc.rect(0, H - 1.5, PW, 1.5, "F");

  // Category logo — left
  const catLogo = LOGO_MAP[category];
  if (catLogo) {
    try { doc.addImage(catLogo, "PNG", ML, LOGO_Y, LOGO_W, LOGO_H); } catch (_) {}
  }

  // FIT logo — right
  const fitLogo = LOGO_MAP["FIT-logo"];
  if (fitLogo) {
    try { doc.addImage(fitLogo, "PNG", PW - MR - LOGO_W, LOGO_Y, LOGO_W, LOGO_H); } catch (_) {}
  }

  // "DAILY INCIDENT REPORT" — large bold white
  setFont(doc, "bold", 14);
  setTxt(doc, WHITE);
  const line1 = "DAILY INCIDENT REPORT";
  const l1w = doc.getTextWidth(line1);
  doc.text(line1, (PW - l1w) / 2, H / 2 + 1);

  // Category name — light green below
  setFont(doc, "bold", 10);
  setTxt(doc, GREEN_MID);
  const line2 = category.toUpperCase();
  const l2w = doc.getTextWidth(line2);
  doc.text(line2, (PW - l2w) / 2, H / 2 + 11);

  return H + 4;
}

// ── Footer — ONLY on last page ────────────────────────────────────────────────
function drawFooter(doc, pageNum, total, genTime) {
  const barH  = 14;
  const barY  = PH - barH;
  const textY = PH - 5;

  // Deep green footer bar
  setFill(doc, GREEN_DARK);
  doc.rect(0, barY, PW, barH, "F");

  // Top accent stripe on footer
  setFill(doc, GREEN);
  doc.rect(0, barY, PW, 1.5, "F");

  setFont(doc, "normal", 6.5);
  setTxt(doc, INK_LIGHT);
  doc.text(`Generated: ${genTime}`, ML, textY);

  setFont(doc, "bold", 10.5);
  setTxt(doc, WHITE);
  doc.text("Fentons IT \u2014 NOC", PW / 2, textY, { align: "center" });

  setFont(doc, "normal", 6.5);
  setTxt(doc, INK_LIGHT);
  doc.text(`Page ${pageNum} of ${total}`, PW - MR, textY, { align: "right" });
}

// ── Section label ─────────────────────────────────────────────────────────────
function sectionLabel(doc, y, num, title) {
  // Green left accent bar
  setFill(doc, GREEN);
  doc.rect(ML, y, 2.5, 5.5, "F");

  setFont(doc, "bold", 9.5);
  setTxt(doc, INK);
  doc.text(`${num}.  ${title}`, ML + 6, y + 4.3);
  return y + 9;
}

// ── Key : value ───────────────────────────────────────────────────────────────
function kvLine(doc, y, label, value) {
  setFont(doc, "bold", 8);
  setTxt(doc, INK_MID);
  doc.text(label, ML + 2, y);

  setFont(doc, "normal", 8);
  setTxt(doc, INK);
  const lines = doc.splitTextToSize(String(value), CW - 60);
  doc.text(lines, ML + 58, y);
  return y + lines.length * 5 + 1;
}

// ── Page break (no header on new pages) ──────────────────────────────────────
function checkPage(doc, y, need) {
  if (y + need > PH - 18) { doc.addPage(); return 14; }
  return y;
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export function generateIncidentPDF(formData) {
  const { category, trackingNumber, startDateTime, endDateTime, sites = [] } = formData;
  const genTime = nowLabel();

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  let y = drawHeader(doc, category);

  // ── Tracking number banner ────────────────────────────────────────────────
  setFill(doc, GREEN_BG);
  setDraw(doc, BORDER);
  doc.setLineWidth(0.3);
  doc.roundedRect(ML, y, CW, 14, 1.5, 1.5, "FD");

  // Left green accent stripe on banner
  setFill(doc, GREEN);
  doc.rect(ML, y, 3, 14, "F");

  setFont(doc, "bold", 7);
  setTxt(doc, GREEN);
  doc.text("INCIDENT TRACKING NUMBER", ML + 7, y + 5);

  setFont(doc, "bold", 13);
  setTxt(doc, INK);
  doc.text(trackingNumber || "N/A", ML + 7, y + 12);

  setFont(doc, "normal", 7);
  setTxt(doc, INK_MID);
  doc.text("Report Date:", PW - MR - 5, y + 5, { align: "right" });
  setFont(doc, "bold", 7);
  setTxt(doc, INK);
  doc.text(genTime, PW - MR - 5, y + 11, { align: "right" });

  y += 19;
  rule(doc, y);
  y += 5;

  // ── Section 1 ─────────────────────────────────────────────────────────────
  y = checkPage(doc, y, 18);
  y = sectionLabel(doc, y, 1, "Sector");
  y = kvLine(doc, y, "Classification", "Other Logistics");
  y += 4; rule(doc, y); y += 5;

  // ── Section 2 ─────────────────────────────────────────────────────────────
  y = checkPage(doc, y, 16 + sites.length * 5);
  y = sectionLabel(doc, y, 2, "Physical Location of Affected Computer");
  sites.forEach((s) => {
    y = checkPage(doc, y, 6);
    setFont(doc, "normal", 8); setTxt(doc, INK);
    setFill(doc, GREEN);
    doc.circle(ML + 4, y - 0.8, 0.9, "F");
    doc.text(s.site, ML + 8, y);
    y += 5;
  });
  y += 3; rule(doc, y); y += 5;

  // ── Section 3 — date boxes ────────────────────────────────────────────────
  y = checkPage(doc, y, 30);
  y = sectionLabel(doc, y, 3, "Date and Time Incident Occurred");

  const half = (CW - 6) / 2;
  const drawDateBox = (xOff, lbl, val) => {
    setFill(doc, GREEN_BG);
    setDraw(doc, BORDER);
    doc.setLineWidth(0.3);
    doc.roundedRect(xOff, y, half, 15, 1.2, 1.2, "FD");

    // Top accent line on each date box
    setFill(doc, GREEN);
    doc.roundedRect(xOff, y, half, 2.5, 1.2, 1.2, "F");

    setFont(doc, "bold", 7); setTxt(doc, GREEN);
    doc.text(lbl, xOff + 4, y + 6.5);
    setFont(doc, "bold", 9); setTxt(doc, INK);
    doc.text(val, xOff + 4, y + 13);
  };
  drawDateBox(ML,            "START DATE & TIME", fmtDT(startDateTime));
  drawDateBox(ML + half + 6, "END DATE & TIME",   fmtDT(endDateTime));
  y += 20; rule(doc, y); y += 5;

  // ── Section 4 ─────────────────────────────────────────────────────────────
  y = checkPage(doc, y, 18);
  y = sectionLabel(doc, y, 4, "Is the affected system/network critical to the organization's mission?");
  y = kvLine(doc, y, "Critical", "Yes");
  y += 4; rule(doc, y); y += 5;

  // ── Section 5 — system table ──────────────────────────────────────────────
  y = checkPage(doc, y, 28);
  y = sectionLabel(doc, y, 5, "Information of Affected System");

  const sysRows = sites
    .map((s) => SITE_INFORMATION[s.site])
    .filter(Boolean)
    .map((i) => [i.ip, i.location, i.os, i.patch, i.hardware]);

  autoTable(doc, {
    startY: y,
    head: [["IP Address","Device Location","Operating System","Last Patched Version","Hardware"]],
    body: sysRows.length ? sysRows : [["—","—","—","—","—"]],
    margin: { left: ML, right: MR }, tableWidth: CW,
    styles: {
      font: "helvetica", fontSize: 7.5,
      cellPadding: { top: 3, bottom: 3, left: 3, right: 3 },
      textColor: INK, lineColor: BORDER, lineWidth: 0.25,
    },
    headStyles: {
      fillColor: GREEN_DARK,   // deep green header
      textColor: WHITE,
      fontStyle: "bold", fontSize: 7.5,
    },
    alternateRowStyles: { fillColor: ROW_ALT },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 46 },
      2: { cellWidth: 32 },
      3: { cellWidth: 34 },
      4: { cellWidth: CW - 142 },
    },
  });
  y = doc.lastAutoTable.finalY + 5; rule(doc, y); y += 5;

  // ── Section 6 ─────────────────────────────────────────────────────────────
  y = checkPage(doc, y, 18);
  y = sectionLabel(doc, y, 6, "Type of Incident");
  y = kvLine(doc, y, "Classification", "Technical Vulnerability");
  y += 4; rule(doc, y); y += 5;

  // ── Section 7 — alert table ───────────────────────────────────────────────
  y = checkPage(doc, y, 28);
  y = sectionLabel(doc, y, 7, "Description of Incident");

  const alertRows = [];
  sites.forEach((s) =>
    (s.alerts || []).forEach((a) =>
      alertRows.push([s.site, a.alertType||"—", String(a.alertCount??"—"), a.description||"—"])
    )
  );

  autoTable(doc, {
    startY: y,
    head: [["Site","Alert Type","Alert Count","Description"]],
    body: alertRows.length ? alertRows : [["—","—","—","—"]],
    margin: { left: ML, right: MR }, tableWidth: CW,
    styles: {
      font: "helvetica", fontSize: 7.5,
      cellPadding: { top: 3, bottom: 3, left: 3, right: 3 },
      textColor: INK, lineColor: BORDER, lineWidth: 0.25, overflow: "linebreak",
    },
    headStyles: {
      fillColor: GREEN_DARK,   // deep green header
      textColor: WHITE,
      fontStyle: "bold", fontSize: 7.5,
    },
    alternateRowStyles: { fillColor: ROW_ALT },
    columnStyles: {
      0: { cellWidth: 50, fontStyle: "bold" },
      1: { cellWidth: 38 },
      2: { cellWidth: 22, halign: "center" },
      3: { cellWidth: CW - 110 },
    },
  });
  y = doc.lastAutoTable.finalY + 5; rule(doc, y); y += 5;

  // ── Section 8 ─────────────────────────────────────────────────────────────
  y = checkPage(doc, y, 18);
  y = sectionLabel(doc, y, 8, "Unusual Behaviour / Symptoms");
  y = kvLine(doc, y, "Symptom", "A system alarm or similar indication from an intrusion detection tool.");
  y += 4; rule(doc, y); y += 5;

  // ── Section 9 ─────────────────────────────────────────────────────────────
  y = checkPage(doc, y, 18);
  y = sectionLabel(doc, y, 9, "When and How was the Incident Detected");
  y = kvLine(doc, y, "Detection Method", "Through Forti Analyzer");
  y += 4; rule(doc, y); y += 5;

  // ── Section 10 ────────────────────────────────────────────────────────────
  y = checkPage(doc, y, 24);
  y = sectionLabel(doc, y, 10, "Additional Information");
  y = kvLine(doc, y, "Log being submitted", "Yes");
  y = kvLine(doc, y, "Mode of submission",  "Outlook");
  y += 4; rule(doc, y);

  // ── Footer on last page only ──────────────────────────────────────────────
  const total = doc.getNumberOfPages();
  doc.setPage(total);
  drawFooter(doc, total, total, genTime);

  // ── Save ──────────────────────────────────────────────────────────────────
  const safeCat = (category || "Incident").replace(/\s+/g, "_");
  doc.save(`${safeCat}_Incident_Report.pdf`);
}
