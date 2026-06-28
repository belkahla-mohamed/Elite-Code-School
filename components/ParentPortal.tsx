"use client";

import { useState } from "react";
import { Download, Share2, Bell, BellOff, Loader2, Check, Copy } from "lucide-react";
import type { StudentPortfolio } from "@/lib/types";
import { generateStudentReport, downloadBlob } from "@/lib/pdf-generator";
import { showToast } from "@/components/ui/toast";

export function ParentPortal() {
  const [email, setEmail] = useState("");
  const [secret, setSecret] = useState("");
  const [student, setStudent] = useState<StudentPortfolio | null>(null);
  const [message, setMessage] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [copiedId, setCopiedId] = useState("");

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/auth/parent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, secret })
    });
    const result = await response.json();
    if (!response.ok) { setMessage(result.error ?? "Accès invalide."); return; }
    setStudent(result.student);
    setMessage("Accès parent ouvert.");
  }

  async function togglePrivacy() {
    if (!student) return;
    const response = await fetch(`/api/students/${student.id}/privacy`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic: !student.isPublic })
    });
    const result = await response.json();
    if (!response.ok) { setMessage(result.error ?? "Erreur"); return; }
    setStudent(result.student);
    setMessage(result.student.isPublic ? "Portfolio public." : "Portfolio privé.");
  }

  async function downloadPdf() {
    if (!student) return;
    setPdfLoading(true);
    try {
      const blob = await generateStudentReport(student);
      downloadBlob(blob, `Elite_Code_${student.firstName}_${student.lastName}_${new Date().getFullYear()}.pdf`);
      showToast("PDF téléchargé", "success");
    } catch { showToast("Erreur PDF", "error"); }
    setPdfLoading(false);
  }

  function shareCert(cert: any) {
    const text = `🎓 ${cert.emoji} ${cert.title} — ${cert.mention}\nÉlève: ${student?.firstName} ${student?.lastName}\nElite Code School`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  function copyCertLink(certId: string) {
    const url = `${window.location.origin}/certification/${certId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(certId);
      showToast("Lien copié", "success");
      setTimeout(() => setCopiedId(""), 2000);
    });
  }

  if (!student) {
    return (
      <div className="mx-auto max-w-md rounded-brand border border-ink/10 bg-white dark:bg-surface p-8 shadow-card">
        <span className="tag">Parent</span>
        <h1 className="mt-4 font-display text-3xl font-extrabold">Espace parent</h1>
        <p className="mt-2 text-sm text-ink-soft">Demo: <code className="font-mono">parent.youssef@example.com</code> + <code className="font-mono">YOUSEEF-2026</code></p>
        <form onSubmit={login} className="mt-6 flex flex-col gap-4">
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email parent" className="rounded-brand-sm border border-ink/15 bg-surface px-4 py-3 outline-none focus:border-accent focus:ring-4 focus:ring-accent/15" />
          <input value={secret} onChange={(event) => setSecret(event.target.value)} type="password" placeholder="Secret enfant" className="rounded-brand-sm border border-ink/15 bg-surface px-4 py-3 outline-none focus:border-accent focus:ring-4 focus:ring-accent/15" />
          <button className="btn-primary">Accéder</button>
        </form>
        {message && <p className="mt-4 rounded-brand-sm bg-red-50 p-3 text-sm text-red-700">{message}</p>}
      </div>
    );
  }

  return (
    <div className="container-shell">
      <div className="rounded-brand border border-ink/10 bg-white dark:bg-surface p-8 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-2xl font-display text-xl font-bold text-white" style={{ background: student.avatarGradient }}>{student.avatar}</div>
            <div>
              <span className="tag">Espace parent</span>
              <h1 className="mt-2 font-display text-3xl font-extrabold">{student.firstName} {student.lastName}</h1>
              <p className="text-ink-soft">{student.levelLabel}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={togglePrivacy} className={student.isPublic ? "btn-outline px-5 py-2" : "btn-primary px-5 py-2"}>
              {student.isPublic ? "Rendre privé" : "Rendre public"}
            </button>
            <a href={`/portfolio/${student.slug}`} className="btn-outline px-5 py-2">Voir portfolio</a>
          </div>
        </div>

        {message && <p className="mt-5 rounded-brand-sm bg-accent/10 p-3 text-sm text-accent">{message}</p>}

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <Stat label="Visibilité" value={student.isPublic ? "Public" : "Privé"} />
          <Stat label="Projets" value={String(student.projects.length)} />
          <Stat label="Certificats" value={String(student.certifications.length)} />
          <Stat label="Heures" value={`${student.hours}h`} />
        </div>

        {/* PDF Download */}
        <div className="mt-8 rounded-brand-sm bg-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold">Bilan PDF</h2>
              <p className="mt-1 text-sm text-ink-soft">Télécharger le rapport complet de {student.firstName}</p>
            </div>
            <button onClick={downloadPdf} disabled={pdfLoading} className="btn-primary px-5 py-2">
              {pdfLoading ? <Loader2 className="mr-2 inline size-4 animate-spin" /> : <Download className="mr-2 inline size-4" />}
              {pdfLoading ? "Génération..." : "Télécharger PDF"}
            </button>
          </div>
        </div>

        {/* Certifications */}
        {student.certifications.length > 0 && (
          <div className="mt-8">
            <h2 className="font-display text-xl font-bold">Certifications</h2>
            <div className="mt-3 space-y-2">
              {student.certifications.map((c: any) => (
                <div key={c.id} className="flex flex-wrap items-center justify-between gap-2 rounded-brand-sm border-2 border-[#E8EEF6] dark:border-border bg-white dark:bg-surface px-4 py-3">
                  <span className="text-sm font-bold">{c.emoji} {c.title} — {c.mention}</span>
                  <div className="flex gap-2">
                    <button onClick={() => shareCert(c)} className="rounded-full bg-green-100 p-2 text-green-700 hover:bg-green-200 transition" title="Partager WhatsApp">
                      <Share2 className="size-4" />
                    </button>
                    <button onClick={() => copyCertLink(c.id)} className="rounded-full bg-sky/10 p-2 text-sky hover:bg-sky/20 transition" title="Copier le lien">
                      {copiedId === c.id ? <Check className="size-4" /> : <Copy className="size-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notification Preferences */}
        <div className="mt-8 rounded-brand-sm bg-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {notifications ? <Bell className="size-5 text-sky" /> : <BellOff className="size-5 text-ink-soft" />}
              <div>
                <h2 className="font-display text-base font-bold">Notifications</h2>
                <p className="text-sm text-ink-soft">Recevoir les mises à jour de {student.firstName}</p>
              </div>
            </div>
            <button
              onClick={() => { setNotifications(!notifications); showToast(notifications ? "Notifications désactivées" : "Notifications activées", "info"); }}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${notifications ? "bg-sky" : "bg-gray-300 dark:bg-slate-600"}`}>
              <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition ${notifications ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-brand-sm bg-surface p-4">
      <div className="text-sm text-ink-soft">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold">{value}</div>
    </div>
  );
}
