/**
 * generateIncidentPDF.js — Fentons IT NOC
 * Blue theme version (GREEN_* names preserved for compatibility)
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { LOGO_MAP } from "../assets/logos/logoMap.js";
import { SITE_INFORMATION } from "../data/siteInformation.js";

// ── Geometry ────────────────────────────────────────────────────────────────
const PW = 210, PH = 297, ML = 16, MR = 16, CW = PW - ML - MR;

// ── Blue colour palette (GREEN_* names kept for compatibility) ──────────────
const INK        = [10, 20, 35];
const INK_MID    = [55, 75, 105];
const INK_LIGHT  = [130, 150, 180];

const GREEN      = [2, 18, 194];      // primary blue
const GREEN_BG   = [239, 246, 255];   // light blue bg
const GREEN_DARK = [3, 19, 163];      // deep blue
const GREEN_MID  = [191, 219, 254];   // light accent blue

const WHITE      = [255, 255, 255];
const BORDER     = [219, 234, 254];
const ROW_ALT    = [245, 249, 255];

// ── Helpers ────────────────────────────────────────────────────────────────
const setFill = (d, c) => d.setFillColor(...c);
const setDraw = (d, c) => d.setDrawColor(...c);
const setTxt  = (d, c) => d.setTextColor(...c);
const setFont = (d, s, z) => { d.setFont("helvetica", s); if (z) d.setFontSize(z); };

function rule(doc, y, color = BORDER, lw = 0.25) {
  setDraw(doc, color);
  doc.setLineWidth(lw);
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

// ── Header ────────────────────────────────────────────────────────────────
function drawHeader(doc, category) {
  const H = 40;
  const LOGO_W = 52;
  const LOGO_H = 20.8;
  const LOGO_Y = (H - LOGO_H) / 2;

  setFill(doc, GREEN_DARK);
  doc.rect(0, 0, PW, H, "F");

  setFill(doc, GREEN);
  doc.rect(0, H - 1.5, PW, 1.5, "F");

  const catLogo = LOGO_MAP[category];
  if (catLogo) {
    try { doc.addImage(catLogo, "PNG", ML, LOGO_Y, LOGO_W, LOGO_H); } catch (_) {}
  }

  const fitLogo = LOGO_MAP["FIT-logo"];
  if (fitLogo) {
    try { doc.addImage(fitLogo, "PNG", PW - MR - LOGO_W, LOGO_Y, LOGO_W, LOGO_H); } catch (_) {}
  }

  setFont(doc, "bold", 14);
  setTxt(doc, WHITE);
  const t1 = "DAILY INCIDENT REPORT";
  doc.text(t1, (PW - doc.getTextWidth(t1)) / 2, H / 2 + 1);

  setFont(doc, "bold", 10);
  setTxt(doc, GREEN_MID);
  const t2 = category.toUpperCase();
  doc.text(t2, (PW - doc.getTextWidth(t2)) / 2, H / 2 + 11);

  return H + 4;
}

// ── Footer ────────────────────────────────────────────────────────────────
function drawFooter(doc, pageNum, total, genTime) {
  const barH = 14;
  const barY = PH - barH;
  const textY = PH - 5;

  setFill(doc, GREEN_DARK);
  doc.rect(0, barY, PW, barH, "F");

  setFill(doc, GREEN);
  doc.rect(0, barY, PW, 1.5, "F");

  setFont(doc, "normal", 6.5);
  setTxt(doc, INK_LIGHT);
  doc.text(`Generated: ${genTime}`, ML, textY);

  setFont(doc, "bold", 10.5);
  setTxt(doc, WHITE);
  doc.text("Fentons IT — NOC", PW / 2, textY, { align: "center" });

  setFont(doc, "normal", 6.5);
  setTxt(doc, INK_LIGHT);
  doc.text(`Page ${pageNum} of ${total}`, PW - MR, textY, { align: "right" });
}

// ── Section label ──────────────────────────────────────────────────────────
function sectionLabel(doc, y, num, title) {
  setFill(doc, GREEN);
  doc.rect(ML, y, 2.5, 5.5, "F");

  setFont(doc, "bold", 9.5);
  setTxt(doc, INK);
  doc.text(`${num}.  ${title}`, ML + 6, y + 4.3);

  return y + 9;
}

// ── Key-value line ─────────────────────────────────────────────────────────
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

// ── Page check ────────────────────────────────────────────────────────────
function checkPage(doc, y, need) {
  if (y + need > PH - 18) {
    doc.addPage();
    return 14;
  }
  return y;
}

// ── MAIN ───────────────────────────────────────────────────────────────────
export function generateIncidentPDF(formData) {
  const { category, trackingNumber, startDateTime, endDateTime, sites = [] } = formData;
  const genTime = nowLabel();

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  let y = drawHeader(doc, category);

  setFill(doc, GREEN_BG);
  setDraw(doc, BORDER);
  doc.roundedRect(ML, y, CW, 14, 1.5, 1.5, "FD");

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

  y = sectionLabel(doc, y, 1, "Sector");
  y = kvLine(doc, y, "Classification", "Other Logistics");
  y += 4; rule(doc, y); y += 5;

  y = sectionLabel(doc, y, 2, "Physical Location of Affected Computer");

  sites.forEach(s => {
    y = checkPage(doc, y, 6);
    setFill(doc, GREEN);
    doc.circle(ML + 4, y - 0.8, 0.9, "F");
    setFont(doc, "normal", 8);
    setTxt(doc, INK);
    doc.text(s.site, ML + 8, y);
    y += 5;
  });

  y += 3; rule(doc, y); y += 5;

  const total = doc.getNumberOfPages();
  doc.setPage(total);
  drawFooter(doc, total, total, genTime);

  doc.save(`${(category || "Incident").replace(/\s+/g, "_")}_Incident_Report.pdf`);
}