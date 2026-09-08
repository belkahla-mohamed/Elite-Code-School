"use client";

import { useState } from "react";
import type { Program } from "@/lib/types";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Info } from "lucide-react";

type Props = { programs: Program[]; initialProgramId?: string };

const steps = ["Élève", "Parcours", "Parent", "Récapitulatif"];

const programLevels: Record<string, { label: string; color: string }> = {
  debutant: { label: "Débutant", color: "#22c55e" },
  intermediaire: { label: "Intermédiaire", color: "#f59e0b" },
  avance: { label: "Avancé", color: "#ef4444" },
};

const inputClass = "rounded-brand-sm border-2 border-border bg-white px-4 py-2.5 font-body text-sm text-ink outline-none transition duration-200 ease-out focus:border-brand placeholder:text-ink-soft/50 dark:border-white/10 dark:bg-[#1e293b] dark:text-white dark:placeholder:text-slate-400";

const selectClass = "rounded-brand-sm border-2 border-border bg-white px-4 py-2.5 text-sm text-ink transition duration-200 ease-out focus:border-brand dark:border-white/10 dark:bg-[#1e293b] dark:text-white";

interface FormData {
  studentFirstName: string;
  studentLastName: string;
  age: string;
  schoolLevel: string;
  programId: string;
  parentFirstName: string;
  parentLastName: string;
  parentPhone: string;
  parentEmail: string;
  message: string;
}

const initialForm: FormData = {
  studentFirstName: "",
  studentLastName: "",
  age: "",
  schoolLevel: "",
  programId: "",
  parentFirstName: "",
  parentLastName: "",
  parentPhone: "",
  parentEmail: "",
  message: "",
};

export function EnrollmentForm({ programs, initialProgramId = "" }: Props) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    ...initialForm,
    programId: programs.some((p) => p.id === initialProgramId) ? initialProgramId : "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const ageOptions = Array.from({ length: 11 }, (_, index) => index + 7);

  function updateField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function nextStep() {
    setStep((c) => Math.min(c + 1, steps.length - 1));
  }
  function previousStep() {
    setStep((c) => Math.max(c - 1, 0));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const selectedProgram = programs.find((p) => p.id === form.programId);
    const payload = {
      studentFirstName: form.studentFirstName,
      studentLastName: form.studentLastName,
      age: Number(form.age),
      schoolLevel: form.schoolLevel,
      programId: form.programId,
      programName: selectedProgram?.title ?? "",
      parentFirstName: form.parentFirstName,
      parentLastName: form.parentLastName,
      parentPhone: form.parentPhone,
      parentEmail: form.parentEmail,
      message: form.message,
    };

    const response = await fetch("/api/inscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) {
      setStatus("error");
      setMessage(result.error ?? "Impossible d'envoyer la demande.");
      return;
    }

    setForm(initialForm);
    setStep(0);
    setStatus("success");
    window.location.href = `/inscription/confirmation?id=${result.request.id}`;
  }

  const selectedProgram = programs.find((p) => p.id === form.programId);
  const selectedLevel = selectedProgram ? programLevels[selectedProgram.level] ?? programLevels.debutant : null;

  return (
    <form onSubmit={onSubmit} className="rounded-brand border border-border bg-white p-6 sm:p-8 dark:border-white/10 dark:bg-[#1e293b]">
      {/* Selected program summary */}
      {selectedProgram && selectedLevel ? (
        <div className="mb-8 overflow-hidden rounded-brand border border-border dark:border-white/10">
          <div className="relative h-28 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedProgram.image} alt={selectedProgram.title} className="size-full object-cover" />
            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
              <span
                className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
                style={{ backgroundColor: selectedLevel.color }}
              >
                {selectedLevel.label}
              </span>
              {selectedProgram.priceMonthly && (
                <span className="rounded-full bg-ink/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                  {selectedProgram.priceMonthly} DH/mois
                </span>
              )}
            </div>
          </div>
          <div className="bg-surface p-4 dark:bg-white/5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-base font-semibold text-ink dark:text-white">{selectedProgram.title}</h3>
              <button
                type="button"
                onClick={() => { updateField("programId", ""); setStep(1); }}
                className="shrink-0 text-xs font-bold text-brand transition duration-200 ease-out hover:underline"
              >
                Changer
              </button>
            </div>
            <p className="mt-1 text-xs font-medium text-ink-soft dark:text-slate-400">
              {selectedProgram.ageRange}{selectedProgram.schedule ? ` · ${selectedProgram.schedule}` : ""}
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-8 rounded-brand border border-dashed border-border p-4 text-center text-xs font-semibold text-ink-soft dark:border-white/15 dark:text-slate-400">
          Aucun programme présélectionné — tu le choisiras à l&apos;étape Parcours.
        </div>
      )}

      <div className="mb-8 grid gap-2 sm:grid-cols-4">
        {steps.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(index)}
            className={`rounded-brand-sm border px-4 py-3 text-left text-sm font-bold transition duration-200 ease-out ${
              step === index
                ? "border-brand bg-brand text-white shadow-sm"
                : index < step
                  ? "border-brand/30 bg-brand/5 text-brand hover:border-brand/50"
                  : "border-border bg-white text-ink-soft hover:border-brand/30 hover:text-ink dark:border-white/10 dark:bg-white/5 dark:text-slate-400"
            }`}
          >
            <span className="block font-mono text-xs opacity-70">0{index + 1}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Step 1: Child */}
      <div className={step === 0 ? "block" : "hidden"}>
        <h2 className="font-display text-2xl font-semibold text-ink dark:text-white">Informations de l&apos;élève</h2>
        <p className="mt-2 text-sm font-medium text-ink-soft dark:text-slate-400">On commence simple : nom, âge et niveau actuel.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-semibold text-ink dark:text-white">
            Prénom *
            <input
              name="studentFirstName"
              value={form.studentFirstName}
              onChange={(e) => updateField("studentFirstName", e.target.value)}
              required
              placeholder="Karim"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-ink dark:text-white">
            Nom *
            <input
              name="studentLastName"
              value={form.studentLastName}
              onChange={(e) => updateField("studentLastName", e.target.value)}
              required
              placeholder="Benali"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-ink dark:text-white">
            Âge *
            <Select name="age" value={form.age} onValueChange={(v) => updateField("age", v)}>
              <SelectTrigger className={selectClass}>
                <SelectValue placeholder="-- Sélectionner --" />
              </SelectTrigger>
              <SelectContent>
                {ageOptions.map((a) => (
                  <SelectItem key={a} value={String(a)}>
                    {a} ans
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-ink dark:text-white">
            <span className="inline-flex items-center gap-1.5">
              Niveau scolaire
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className="inline-flex items-center text-ink-soft transition duration-200 ease-out hover:text-brand">
                    <Info className="size-3.5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent side="top" className="max-w-56 text-xs text-ink-soft">
                  Ex : 6ème primaire, 3ème collège, Tronc commun scientifique…
                </PopoverContent>
              </Popover>
            </span>
            <input
              name="schoolLevel"
              value={form.schoolLevel}
              onChange={(e) => updateField("schoolLevel", e.target.value)}
              placeholder="6ème primaire"
              className={inputClass}
            />
          </label>
        </div>
      </div>

      {/* Step 2: Curriculum */}
      <div className={step === 1 ? "block" : "hidden"}>
        <h2 className="font-display text-2xl font-semibold text-ink dark:text-white">Choix du parcours</h2>
        <p className="mt-2 text-sm font-medium text-ink-soft dark:text-slate-400">Choisis le parcours le plus proche. L&apos;équipe ajuste après contact.</p>
        <label className="mt-6 flex flex-col gap-2 text-sm font-semibold text-ink dark:text-white">
          Formation souhaitée *
          <Select name="programId" value={form.programId} onValueChange={(v) => updateField("programId", v)}>
            <SelectTrigger className={selectClass}>
              <SelectValue placeholder="-- Choisir une formation --" />
            </SelectTrigger>
            <SelectContent>
              {programs.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.title} · {p.ageRange} · {p.priceMonthly} DH/mois
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <div className="mt-5 rounded-brand-sm border border-border bg-surface p-4 text-sm font-medium text-ink-soft dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
          Si tu hésites, choisis le parcours qui plaît le plus à l&apos;enfant. On confirmera par téléphone.
        </div>
      </div>

      {/* Step 3: Parent */}
      <div className={step === 2 ? "block" : "hidden"}>
        <h2 className="font-display text-2xl font-semibold text-ink dark:text-white">Contact parent</h2>
        <p className="mt-2 text-sm font-medium text-ink-soft dark:text-slate-400">Dernière étape avant le récapitulatif.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-semibold text-ink dark:text-white">
            Prénom du parent *
            <input
              name="parentFirstName"
              value={form.parentFirstName}
              onChange={(e) => updateField("parentFirstName", e.target.value)}
              required
              placeholder="Karim"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-ink dark:text-white">
            Nom du parent *
            <input
              name="parentLastName"
              value={form.parentLastName}
              onChange={(e) => updateField("parentLastName", e.target.value)}
              required
              placeholder="Benali"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-ink dark:text-white">
            Téléphone *
            <input
              name="parentPhone"
              value={form.parentPhone}
              onChange={(e) => updateField("parentPhone", e.target.value)}
              type="tel"
              required
              placeholder="+212 6XX XXX XXX"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-ink dark:text-white">
            Email *
            <input
              name="parentEmail"
              value={form.parentEmail}
              onChange={(e) => updateField("parentEmail", e.target.value)}
              type="email"
              required
              placeholder="parent@email.com"
              className={inputClass}
            />
          </label>
        </div>
        <label className="mt-4 flex flex-col gap-2 text-sm font-semibold text-ink dark:text-white">
          Message
          <Textarea
            name="message"
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
            className="min-h-24 border-2 border-border bg-white transition duration-200 ease-out focus:border-brand dark:border-white/10 dark:bg-[#1e293b] dark:text-white dark:placeholder:text-slate-400"
            placeholder="Questions, disponibilités, niveau actuel…"
          />
        </label>
      </div>

      {/* Step 4: Review */}
      {step === 3 && (
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink dark:text-white">Récapitulatif</h2>
          <p className="mt-2 text-sm font-medium text-ink-soft dark:text-slate-400">Vérifie les informations avant d&apos;envoyer.</p>
          <div className="mt-6 space-y-3">
            <div className="rounded-brand-sm border border-border bg-surface p-4 dark:border-white/10 dark:bg-white/5">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-soft dark:text-slate-400">1. Informations de l&apos;élève</h3>
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <div><span className="font-bold text-ink-soft dark:text-slate-400">Prénom :</span> <span className="font-semibold text-ink dark:text-white">{form.studentFirstName || "—"}</span></div>
                <div><span className="font-bold text-ink-soft dark:text-slate-400">Nom :</span> <span className="font-semibold text-ink dark:text-white">{form.studentLastName || "—"}</span></div>
                <div><span className="font-bold text-ink-soft dark:text-slate-400">Âge :</span> <span className="font-semibold text-ink dark:text-white">{form.age ? `${form.age} ans` : "—"}</span></div>
                <div><span className="font-bold text-ink-soft dark:text-slate-400">Niveau scolaire :</span> <span className="font-semibold text-ink dark:text-white">{form.schoolLevel || "Non spécifié"}</span></div>
              </div>
            </div>

            <div className="rounded-brand-sm border border-border bg-surface p-4 dark:border-white/10 dark:bg-white/5">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-soft dark:text-slate-400">2. Parcours choisi</h3>
              <div className="text-sm">
                <span className="font-bold text-ink-soft dark:text-slate-400">Formation :</span>{" "}
                <span className="font-semibold text-ink dark:text-white">{selectedProgram?.title || "Non sélectionné"}</span>
                {selectedProgram && (
                  <span className="text-ink-soft dark:text-slate-400"> · {selectedProgram.ageRange} · {selectedProgram.priceMonthly} DH/mois</span>
                )}
              </div>
            </div>

            <div className="rounded-brand-sm border border-border bg-surface p-4 dark:border-white/10 dark:bg-white/5">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-soft dark:text-slate-400">3. Contact parent</h3>
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <div><span className="font-bold text-ink-soft dark:text-slate-400">Parent :</span> <span className="font-semibold text-ink dark:text-white">{form.parentFirstName || "—"} {form.parentLastName || "—"}</span></div>
                <div><span className="font-bold text-ink-soft dark:text-slate-400">Téléphone :</span> <span className="font-semibold text-ink dark:text-white">{form.parentPhone || "—"}</span></div>
                <div><span className="font-bold text-ink-soft dark:text-slate-400">Email :</span> <span className="font-semibold text-ink dark:text-white">{form.parentEmail || "—"}</span></div>
              </div>
              {form.message && (
                <div className="mt-2 text-sm">
                  <span className="font-bold text-ink-soft dark:text-slate-400">Message :</span>
                  <p className="mt-1 italic text-ink-soft dark:text-slate-400">&ldquo;{form.message}&rdquo;</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <button type="button" onClick={previousStep} disabled={step === 0} className="btn-outline disabled:cursor-not-allowed disabled:opacity-50">
          Retour
        </button>
        {step < steps.length - 1 ? (
          <button type="button" onClick={nextStep} className="btn-primary">
            Continuer
          </button>
        ) : (
          <button disabled={status === "loading"} className="btn-primary disabled:cursor-not-allowed disabled:opacity-60">
            {status === "loading" ? "Envoi..." : "Envoyer la demande"}
          </button>
        )}
      </div>

      {message && (
        <p
          className={`mt-4 rounded-brand-sm px-4 py-3 text-center text-sm ${
            status === "error" ? "bg-coral/10 text-coral" : "bg-lime/10 text-lime"
          }`}
        >
          {message}
        </p>
      )}
      {status === "idle" && !message && (
        <p className="mt-3 text-center text-xs font-medium text-ink-soft dark:text-slate-400">Réponse sous 24h · Essai gratuit disponible sur demande</p>
      )}
    </form>
  );
}
