import jsPDF from "jspdf";
import type { StudentPortfolio } from "@/lib/types";

export async function generateStudentReport(student: StudentPortfolio): Promise<Blob> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = 210;

  const cyan = "#12AEEA";
  const dark = "#1E293B";
  const gray = "#64748B";

  function header() {
    doc.setFillColor(18, 174, 234);
    doc.rect(0, 0, pageW, 25, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Elite Code School", 15, 16);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Rapport d'\u00e9volution", pageW - 15, 16, { align: "right" });
  }

  function section(title: string, y: number) {
    doc.setTextColor(18, 174, 234);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(title, 15, y);
    doc.setDrawColor(18, 174, 234);
    doc.setLineWidth(0.5);
    doc.line(15, y + 1.5, pageW - 15, y + 1.5);
    return y + 8;
  }

  function line(text: string, y: number, opts?: { bold?: boolean; size?: number; color?: string }) {
    doc.setTextColor(opts?.color ?? dark);
    doc.setFontSize(opts?.size ?? 10);
    doc.setFont("helvetica", opts?.bold ? "bold" : "normal");
    doc.text(text, 15, y);
    return y + 5;
  }

  function kv(key: string, val: string, y: number) {
    doc.setTextColor(gray);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(key, 15, y);
    doc.setTextColor(dark);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(val, 60, y);
    return y + 6;
  }

  header();
  let y = 33;

  doc.setFontSize(18);
  doc.setTextColor(dark);
  doc.setFont("helvetica", "bold");
  doc.text(`${student.firstName} ${student.lastName}`, 15, y);
  y += 8;

  y = kv("Niveau", student.levelLabel, y);
  y = kv("Programme", student.program?.title ?? "-", y);
  y = kv("Heures", `${student.hours}h`, y);
  y += 2;

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(15, y, pageW - 15, y);
  y += 6;

  y = section("Projets", y);
  if (student.projects.length === 0) {
    y = line("Aucun projet", y, { color: gray });
  } else {
    for (const p of student.projects) {
      y = line(`${p.emoji} ${p.title} — ${p.status === "done" ? "Terminé" : p.status === "progress" ? "En cours" : "Planifié"} (${p.progress}%)`, y, { size: 9 });
    }
  }
  y += 3;

  y = section("Certifications", y);
  if (student.certifications.length === 0) {
    y = line("Aucune certification", y, { color: gray });
  } else {
    for (const c of student.certifications) {
      y = line(`${c.emoji} ${c.title} — ${c.mention}`, y, { size: 9 });
    }
  }
  y += 3;

  y = section("Galerie", y);
  y = line(`${student.gallery.length} élément(s)`, y, { color: gray, size: 9 });
  y += 6;

  if (y > 260) {
    doc.addPage();
    y = 20;
  }

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(15, y, pageW - 15, y);
  y += 5;

  doc.setTextColor(gray);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")} · Elite Code School · Marrakech`, 15, y);

  return doc.output("blob");
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
