"use client";

import { useMemo, useState } from "react";
import type { Program } from "@/lib/types";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Info } from "lucide-react";

type Props = { programs: Program[] };

const steps = ["Élève", "Parcours", "Parent", "Récapitulatif"];

interface FormData {
  studentFirstName: string;
  studentLastName: string;
  age: string;
  schoolLevel: string;
  programId: string;
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
  parentPhone: "",
  parentEmail: "",
  message: "",
};

export function EnrollmentForm({ programs }: Props) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const ageOptions = useMemo(() => Array.from({ length: 11 }, (_, index) => index + 7), []);

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

  return (
    <form onSubmit={onSubmit} className="card p-6 sm:p-8">
      <div className="mb-8 grid gap-3 sm:grid-cols-4">
        {steps.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(index)}
            className={`rounded-brand-sm border px-4 py-3 text-left text-sm font-extrabold ${
              step === index
                ? "border-sky bg-sky/10 text-sky"
                : "border-[#E6EEF8] dark:border-border bg-white dark:bg-surface text-ink-soft"
            }`}
          >
            <span className="block font-mono text-xs">0{index + 1}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Step 1: Child */}
      <div className={step === 0 ? "block" : "hidden"}>
        <h2 className="font-display text-2xl font-extrabold">Informations de l&apos;élève</h2>
        <p className="mt-2 text-sm text-ink-soft">On commence simple: nom, âge et niveau actuel.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Prénom *
            <input
              name="studentFirstName"
              value={form.studentFirstName}
              onChange={(e) => updateField("studentFirstName", e.target.value)}
              required
              placeholder="Karim"
              className="rounded-brand-sm border-2 border-[#E8EEF6] dark:border-border bg-white dark:bg-surface px-4 py-2.5 font-body text-ink transition focus:border-sky focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Nom *
            <input
              name="studentLastName"
              value={form.studentLastName}
              onChange={(e) => updateField("studentLastName", e.target.value)}
              required
              placeholder="Benali"
              className="rounded-brand-sm border-2 border-[#E8EEF6] dark:border-border bg-white dark:bg-surface px-4 py-2.5 font-body text-ink transition focus:border-sky focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Âge *
            <Select name="age" value={form.age} onValueChange={(v) => updateField("age", v)}>
              <SelectTrigger className="rounded-brand-sm border-2 border-border bg-white dark:bg-surface">
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
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Niveau scolaire
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="inline-flex items-center text-ink-soft hover:text-sky transition">
                  <Info className="size-3.5" />
                </button>
              </PopoverTrigger>
              <PopoverContent side="top" className="text-xs text-ink-soft max-w-56">
                Ex: 6ème primaire, 3ème collège, Tronc commun scientifique…
              </PopoverContent>
            </Popover>
            <input
              name="schoolLevel"
              value={form.schoolLevel}
              onChange={(e) => updateField("schoolLevel", e.target.value)}
              placeholder="6ème primaire"
              className="rounded-brand-sm border-2 border-[#E8EEF6] dark:border-border bg-white dark:bg-surface px-4 py-2.5 font-body text-ink transition focus:border-sky focus:outline-none"
            />
          </label>
        </div>
      </div>

      {/* Step 2: Curriculum */}
      <div className={step === 1 ? "block" : "hidden"}>
        <h2 className="font-display text-2xl font-extrabold">Choix du parcours</h2>
        <p className="mt-2 text-sm text-ink-soft">Choisis le parcours le plus proche. L&apos;équipe ajuste après contact.</p>
        <label className="mt-6 flex flex-col gap-2 text-sm font-semibold">
          Formation souhaitée *
          <Select name="programId" value={form.programId} onValueChange={(v) => updateField("programId", v)}>
            <SelectTrigger className="rounded-brand-sm border-2 border-border bg-white dark:bg-surface">
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
        <div className="mt-5 rounded-brand-sm border-2 border-[#E8EEF6] dark:border-border bg-surface p-4 text-sm text-ink-soft">
          Si tu hésites, choisis le parcours qui plaît le plus à l&apos;enfant. On confirmera par téléphone.
        </div>
      </div>

      {/* Step 3: Parent */}
      <div className={step === 2 ? "block" : "hidden"}>
        <h2 className="font-display text-2xl font-extrabold">Contact parent</h2>
        <p className="mt-2 text-sm text-ink-soft">Dernière étape avant le récapitulatif.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Téléphone *
            <input
              name="parentPhone"
              value={form.parentPhone}
              onChange={(e) => updateField("parentPhone", e.target.value)}
              type="tel"
              required
              placeholder="+212 6XX XXX XXX"
              className="rounded-brand-sm border-2 border-[#E8EEF6] dark:border-border bg-white dark:bg-surface px-4 py-2.5 font-body text-ink transition focus:border-sky focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Email *
            <input
              name="parentEmail"
              value={form.parentEmail}
              onChange={(e) => updateField("parentEmail", e.target.value)}
              type="email"
              required
              placeholder="parent@email.com"
              className="rounded-brand-sm border-2 border-[#E8EEF6] dark:border-border bg-white dark:bg-surface px-4 py-2.5 font-body text-ink transition focus:border-sky focus:outline-none"
            />
          </label>
        </div>
        <label className="mt-4 flex flex-col gap-2 text-sm font-semibold">
          Message
          <Textarea
            name="message"
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
            className="min-h-24"
            placeholder="Questions, disponibilités, niveau actuel…"
          />
        </label>
      </div>

      {/* Step 4: Review */}
      {step === 3 && (
        <div>
          <h2 className="font-display text-2xl font-extrabold">Récapitulatif</h2>
          <p className="mt-2 text-sm text-ink-soft">Vérifie les informations avant d&apos;envoyer.</p>
          <div className="mt-6 space-y-3">
            <div className="rounded-brand-sm border-2 border-[#E8EEF6] dark:border-border bg-surface p-4">
              <h3 className="text-xs font-black uppercase tracking-wide text-ink-soft mb-3">1. Informations de l&apos;élève</h3>
              <div className="grid gap-2 sm:grid-cols-2 text-sm">
                <div><span className="font-bold text-ink-soft">Prénom:</span> <span className="font-semibold text-ink">{form.studentFirstName || "—"}</span></div>
                <div><span className="font-bold text-ink-soft">Nom:</span> <span className="font-semibold text-ink">{form.studentLastName || "—"}</span></div>
                <div><span className="font-bold text-ink-soft">Âge:</span> <span className="font-semibold text-ink">{form.age ? `${form.age} ans` : "—"}</span></div>
                <div><span className="font-bold text-ink-soft">Niveau scolaire:</span> <span className="font-semibold text-ink">{form.schoolLevel || "Non spécifié"}</span></div>
              </div>
            </div>

            <div className="rounded-brand-sm border-2 border-[#E8EEF6] dark:border-border bg-surface p-4">
              <h3 className="text-xs font-black uppercase tracking-wide text-ink-soft mb-3">2. Parcours choisi</h3>
              <div className="text-sm">
                <span className="font-bold text-ink-soft">Formation:</span>{" "}
                <span className="font-semibold text-ink">{selectedProgram?.title || "Non sélectionné"}</span>
                {selectedProgram && (
                  <span className="ml-2 text-ink-soft">· {selectedProgram.ageRange} · {selectedProgram.priceMonthly} DH/mois</span>
                )}
              </div>
            </div>

            <div className="rounded-brand-sm border-2 border-[#E8EEF6] dark:border-border bg-surface p-4">
              <h3 className="text-xs font-black uppercase tracking-wide text-ink-soft mb-3">3. Contact parent</h3>
              <div className="grid gap-2 sm:grid-cols-2 text-sm">
                <div><span className="font-bold text-ink-soft">Téléphone:</span> <span className="font-semibold text-ink">{form.parentPhone || "—"}</span></div>
                <div><span className="font-bold text-ink-soft">Email:</span> <span className="font-semibold text-ink">{form.parentEmail || "—"}</span></div>
              </div>
              {form.message && (
                <div className="mt-2 text-sm">
                  <span className="font-bold text-ink-soft">Message:</span>
                  <p className="mt-1 text-ink-soft italic">&ldquo;{form.message}&rdquo;</p>
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
            status === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {message}
        </p>
      )}
      {status === "idle" && !message && (
        <p className="mt-3 text-center text-xs text-ink-soft">Réponse sous 24h · Essai gratuit disponible sur demande</p>
      )}
    </form>
  );
}
