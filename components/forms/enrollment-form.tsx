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
import { Info, Warning } from "@phosphor-icons/react";

type Props = { programs: Program[]; initialProgramId?: string };

const steps = ["Élève", "Parcours", "Parent", "Récapitulatif"];

const programLevels: Record<string, { label: string; color: string }> = {
  debutant: { label: "Débutant", color: "#22c55e" },
  intermediaire: { label: "Intermédiaire", color: "#f59e0b" },
  avance: { label: "Avancé", color: "#ef4444" },
};

const inputBase = "rounded-brand-sm border-2 border-border bg-white px-4 py-2.5 font-body text-sm text-ink outline-none transition duration-200 ease-out placeholder:text-ink-soft/50 dark:border-white/10 dark:bg-[#1e293b] dark:text-white dark:placeholder:text-slate-400";
const inputClass = `${inputBase} focus:border-brand`;
const inputError = `${inputBase} border-coral focus:border-coral`;

const selectClass = "rounded-brand-sm border-2 border-border bg-white px-4 py-2.5 text-sm text-ink transition duration-200 ease-out focus:border-brand dark:border-white/10 dark:bg-[#1e293b] dark:text-white";
const selectError = "rounded-brand-sm border-2 border-coral bg-white px-4 py-2.5 text-sm text-ink transition duration-200 ease-out focus:border-coral dark:border-white/10 dark:bg-[#1e293b] dark:text-white";

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

type FormErrors = Partial<Record<keyof FormData, string>>;

function validateStep0(form: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.studentFirstName.trim() || form.studentFirstName.trim().length < 2) {
    errors.studentFirstName = "Le prénom doit contenir au moins 2 caractères";
  }
  if (!form.studentLastName.trim() || form.studentLastName.trim().length < 2) {
    errors.studentLastName = "Le nom doit contenir au moins 2 caractères";
  }
  if (!form.age) {
    errors.age = "Veuillez sélectionner l'âge de votre enfant";
  } else {
    const ageNum = Number(form.age);
    if (ageNum < 7 || ageNum > 17) {
      errors.age = "L'âge doit être entre 7 et 17 ans";
    }
  }
  return errors;
}

function validateStep1(form: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.programId) {
    errors.programId = "Veuillez choisir une formation";
  }
  return errors;
}

function validateStep2(form: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.parentFirstName.trim() || form.parentFirstName.trim().length < 2) {
    errors.parentFirstName = "Le prénom du parent est requis";
  }
  if (!form.parentLastName.trim() || form.parentLastName.trim().length < 2) {
    errors.parentLastName = "Le nom du parent est requis";
  }
  if (!form.parentPhone.trim() || form.parentPhone.trim().length < 8) {
    errors.parentPhone = "Numéro de téléphone requis (min. 8 caractères)";
  }
  if (!form.parentEmail.trim()) {
    errors.parentEmail = "L'email est requis";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.parentEmail.trim())) {
    errors.parentEmail = "Adresse email invalide";
  }
  return errors;
}

export function EnrollmentForm({ programs, initialProgramId = "" }: Props) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    ...initialForm,
    programId: programs.some((p) => p.id === initialProgramId) ? initialProgramId : "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const ageOptions = Array.from({ length: 11 }, (_, index) => index + 7);

  function updateField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function tryNextStep() {
    let stepErrors: FormErrors = {};
    if (step === 0) stepErrors = validateStep0(form);
    else if (step === 1) stepErrors = validateStep1(form);
    else if (step === 2) stepErrors = validateStep2(form);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep((c) => Math.min(c + 1, steps.length - 1));
  }

  function previousStep() {
    setErrors({});
    setStep((c) => Math.max(c - 1, 0));
  }

  function goToStep(index: number) {
    if (index < step) {
      setErrors({});
      setStep(index);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const stepErrors = validateStep2(form);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setStatus("loading");
    setMessage("");
    setErrors({});

    const selectedProgram = programs.find((p) => p.id === form.programId);
    const payload = {
      studentFirstName: form.studentFirstName.trim(),
      studentLastName: form.studentLastName.trim(),
      age: Number(form.age),
      schoolLevel: form.schoolLevel.trim(),
      programId: form.programId,
      parentFirstName: form.parentFirstName.trim(),
      parentLastName: form.parentLastName.trim(),
      parentPhone: form.parentPhone.trim(),
      parentEmail: form.parentEmail.trim(),
      message: form.message.trim(),
    };

    try {
      const response = await fetch("/api/inscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        setStatus("error");
        setMessage(result.error ?? "Impossible d'envoyer la demande. Veuillez réessayer.");
        return;
      }

      setForm(initialForm);
      setStep(0);
      setStatus("success");
      window.location.href = `/inscription/confirmation?id=${result.request.id}`;
    } catch {
      setStatus("error");
      setMessage("Erreur de connexion. Vérifiez votre connexion internet et réessayez.");
    }
  }

  const selectedProgram = programs.find((p) => p.id === form.programId);
  const selectedLevel = selectedProgram ? programLevels[selectedProgram.level] ?? programLevels.debutant : null;

  function ErrorMsg({ field }: { field: keyof FormData }) {
    if (!errors[field]) return null;
    return (
      <span className="mt-1 flex items-center gap-1 text-xs font-medium text-coral">
        <Warning className="size-3 shrink-0" /> {errors[field]}
      </span>
    );
  }

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
          Aucun programme présélectionné — vous le choisirez à l&apos;étape Parcours.
        </div>
      )}

      {/* Step indicators */}
      <div className="mb-8 grid gap-2 sm:grid-cols-4">
        {steps.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => goToStep(index)}
            className={`rounded-brand-sm border px-4 py-3 text-left text-sm font-bold transition duration-200 ease-out ${
              step === index
                ? "border-brand bg-brand text-white shadow-sm"
                : index < step
                  ? "border-brand/30 bg-brand/5 text-brand hover:border-brand/50 cursor-pointer"
                  : "border-border bg-white text-ink-soft dark:border-white/10 dark:bg-white/5 dark:text-slate-400"
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
        <p className="mt-2 text-sm font-medium text-ink-soft dark:text-slate-400">On commence par les informations de base de votre enfant.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-semibold text-ink dark:text-white">
            Prénom *
            <input
              name="studentFirstName"
              value={form.studentFirstName}
              onChange={(e) => updateField("studentFirstName", e.target.value)}
              placeholder="Karim"
              className={errors.studentFirstName ? inputError : inputClass}
            />
            <ErrorMsg field="studentFirstName" />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-ink dark:text-white">
            Nom *
            <input
              name="studentLastName"
              value={form.studentLastName}
              onChange={(e) => updateField("studentLastName", e.target.value)}
              placeholder="Benali"
              className={errors.studentLastName ? inputError : inputClass}
            />
            <ErrorMsg field="studentLastName" />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-ink dark:text-white">
            Âge *
            <Select name="age" value={form.age} onValueChange={(v) => updateField("age", v)}>
              <SelectTrigger className={errors.age ? selectError : selectClass}>
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
            <ErrorMsg field="age" />
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
        <p className="mt-2 text-sm font-medium text-ink-soft dark:text-slate-400">Choisissez la formation qui correspond le mieux à votre enfant. L&apos;équipe adaptera le parcours après contact.</p>
        <label className="mt-6 flex flex-col gap-2 text-sm font-semibold text-ink dark:text-white">
          Formation souhaitée *
          <Select name="programId" value={form.programId} onValueChange={(v) => updateField("programId", v)}>
            <SelectTrigger className={errors.programId ? selectError : selectClass}>
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
          <ErrorMsg field="programId" />
        </label>
        <div className="mt-5 rounded-brand-sm border border-border bg-surface p-4 text-sm font-medium text-ink-soft dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
          Pas sûr(e) ? Choisissez la formation qui plaît le plus à votre enfant — notre équipe vous accompagnera par la suite.
        </div>
      </div>

      {/* Step 3: Parent */}
      <div className={step === 2 ? "block" : "hidden"}>
        <h2 className="font-display text-2xl font-semibold text-ink dark:text-white">Contact parent</h2>
        <p className="mt-2 text-sm font-medium text-ink-soft dark:text-slate-400">Vos coordonnées pour finaliser l&apos;inscription.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-semibold text-ink dark:text-white">
            Prénom du parent *
            <input
              name="parentFirstName"
              value={form.parentFirstName}
              onChange={(e) => updateField("parentFirstName", e.target.value)}
              placeholder="Karim"
              className={errors.parentFirstName ? inputError : inputClass}
            />
            <ErrorMsg field="parentFirstName" />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-ink dark:text-white">
            Nom du parent *
            <input
              name="parentLastName"
              value={form.parentLastName}
              onChange={(e) => updateField("parentLastName", e.target.value)}
              placeholder="Benali"
              className={errors.parentLastName ? inputError : inputClass}
            />
            <ErrorMsg field="parentLastName" />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-ink dark:text-white">
            Téléphone *
            <input
              name="parentPhone"
              value={form.parentPhone}
              onChange={(e) => updateField("parentPhone", e.target.value)}
              type="tel"
              placeholder="+212 6XX XXX XXX"
              className={errors.parentPhone ? inputError : inputClass}
            />
            <ErrorMsg field="parentPhone" />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-ink dark:text-white">
            Email *
            <input
              name="parentEmail"
              value={form.parentEmail}
              onChange={(e) => updateField("parentEmail", e.target.value)}
              type="email"
              placeholder="parent@email.com"
              className={errors.parentEmail ? inputError : inputClass}
            />
            <ErrorMsg field="parentEmail" />
          </label>
        </div>
        <label className="mt-4 flex flex-col gap-2 text-sm font-semibold text-ink dark:text-white">
          Message <span className="font-normal text-ink-soft/60">(optionnel)</span>
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
          <p className="mt-2 text-sm font-medium text-ink-soft dark:text-slate-400">Vérifiez les informations avant d&apos;envoyer votre demande.</p>
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

      {/* Navigation buttons */}
      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <button type="button" onClick={previousStep} disabled={step === 0} className="btn-outline disabled:cursor-not-allowed disabled:opacity-50">
          Retour
        </button>
        {step < steps.length - 1 ? (
          <button type="button" onClick={tryNextStep} className="btn-primary">
            Continuer
          </button>
        ) : (
          <button disabled={status === "loading"} className="btn-primary disabled:cursor-not-allowed disabled:opacity-60">
            {status === "loading" ? "Envoi en cours..." : "Envoyer la demande"}
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
