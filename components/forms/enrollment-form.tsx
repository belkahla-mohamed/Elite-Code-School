"use client";

import { useMemo, useState } from "react";
import type { Program } from "@/lib/types";

type Props = { programs: Program[] };

const steps = ["Élève", "Parcours", "Parent", "Récapitulatif"];

export function EnrollmentForm({ programs }: Props) {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const ageOptions = useMemo(() => Array.from({ length: 11 }, (_, index) => index + 7), []);

  function nextStep() { setStep((c) => Math.min(c + 1, steps.length - 1)); }
  function previousStep() { setStep((c) => Math.max(c - 1, 0)); }

  function getFormData(form: HTMLFormElement) {
    const data = new FormData(form);
    const age = Number(data.get("age"));
    const programId = data.get("programId") as string;
    const selectedProgram = programs.find((p) => p.id === programId);
    return {
      studentFirstName: data.get("studentFirstName") as string,
      studentLastName: data.get("studentLastName") as string,
      age,
      schoolLevel: (data.get("schoolLevel") as string) || "",
      programId,
      programName: selectedProgram?.title ?? "",
      parentPhone: data.get("parentPhone") as string,
      parentEmail: data.get("parentEmail") as string,
      message: (data.get("message") as string) || "",
    };
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    const data = getFormData(event.currentTarget);

    const response = await fetch("/api/inscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      setStatus("error");
      setMessage(result.error ?? "Impossible d'envoyer la demande.");
      return;
    }

    event.currentTarget.reset();
    setStep(0);
    setStatus("success");
    window.location.href = "/inscription/confirmation";
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 sm:p-8">
      <div className="mb-8 grid gap-3 sm:grid-cols-4">
        {steps.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(index)}
            className={`rounded-brand-sm border px-4 py-3 text-left text-sm font-extrabold ${
              step === index ? "border-sky bg-sky/10 text-sky" : "border-[#E6EEF8] dark:border-border bg-white dark:bg-surface text-ink-soft"
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
          <Field name="studentFirstName" label="Prénom *" placeholder="Karim" required />
          <Field name="studentLastName" label="Nom *" placeholder="Benali" required />
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Âge *
            <select name="age" required className="rounded-brand-sm border-2 border-[#E8EEF6] dark:border-border bg-white dark:bg-surface px-4 py-2.5 font-body text-ink transition focus:border-sky focus:outline-none">
              <option value="">-- Sélectionner --</option>
              {ageOptions.map((a) => <option key={a} value={a}>{a} ans</option>)}
            </select>
          </label>
          <Field name="schoolLevel" label="Niveau scolaire" placeholder="6ème primaire" />
        </div>
      </div>

      {/* Step 2: Curriculum */}
      <div className={step === 1 ? "block" : "hidden"}>
        <h2 className="font-display text-2xl font-extrabold">Choix du parcours</h2>
        <p className="mt-2 text-sm text-ink-soft">Choisis le parcours le plus proche. L&apos;équipe ajuste après contact.</p>
        <label className="mt-6 flex flex-col gap-2 text-sm font-semibold">
          Formation souhaitée *
          <select name="programId" required className="rounded-brand-sm border-2 border-[#E8EEF6] dark:border-border bg-white dark:bg-surface px-4 py-2.5 font-body text-ink transition focus:border-sky focus:outline-none">
            <option value="">-- Choisir une formation --</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>{p.title} · {p.ageRange} · {p.priceMonthly} DH/mois</option>
            ))}
          </select>
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
          <Field name="parentPhone" label="Téléphone *" type="tel" placeholder="+212 6XX XXX XXX" required />
          <Field name="parentEmail" label="Email *" type="email" placeholder="parent@email.com" required />
        </div>
        <label className="mt-4 flex flex-col gap-2 text-sm font-semibold">
          Message
          <textarea name="message" className="min-h-24 rounded-brand-sm border-2 border-[#E8EEF6] dark:border-border bg-white dark:bg-surface px-4 py-2.5 font-body text-ink transition focus:border-sky focus:outline-none" placeholder="Questions, disponibilités, niveau actuel…" />
        </label>
      </div>

      {/* Step 4: Review */}
      {step === 3 && (
        <ReviewStep programs={programs} />
      )}

      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <button type="button" onClick={previousStep} disabled={step === 0} className="btn-outline disabled:cursor-not-allowed disabled:opacity-50">
          Retour
        </button>
        {step < steps.length - 1 ? (
          <button type="button" onClick={nextStep} className="btn-primary">Continuer</button>
        ) : (
          <button disabled={status === "loading"} className="btn-primary disabled:cursor-not-allowed disabled:opacity-60">
            {status === "loading" ? "Envoi..." : "Envoyer la demande"}
          </button>
        )}
      </div>

      {message && (
        <p className={`mt-4 rounded-brand-sm px-4 py-3 text-center text-sm ${status === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
          {message}
        </p>
      )}
      {status === "idle" && !message && (
        <p className="mt-3 text-center text-xs text-ink-soft">Réponse sous 24h · Essai gratuit disponible sur demande</p>
      )}
    </form>
  );
}

function ReviewStep({ programs }: { programs: Program[] }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-extrabold">Récapitulatif</h2>
      <p className="mt-2 text-sm text-ink-soft">Vérifie les informations avant d&apos;envoyer.</p>
      <div className="mt-6 space-y-4">
        <p className="text-sm text-ink-soft">
          Les champs seront pré-remplis automatiquement à partir des étapes précédentes. Tu peux modifier une étape en cliquant sur le numéro correspondant ci-dessus.
        </p>
        <div className="rounded-brand-sm border-2 border-[#E8EEF6] dark:border-border bg-surface p-4">
          <p className="text-sm font-bold text-ink">En résumé:</p>
          <ul className="mt-2 space-y-1 text-sm text-ink-soft">
            <li>1. Informations de l&apos;élève (prénom, nom, âge, niveau)</li>
            <li>2. Choix du parcours (formation souhaitée)</li>
            <li>3. Contact parent (téléphone, email, message)</li>
            <li>4. Vérification et envoi</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, placeholder, type = "text", required = false }: {
  label: string; name: string; placeholder: string; type?: string; required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold">
      {label}
      <input name={name} required={required} type={type} placeholder={placeholder}
        className="rounded-brand-sm border-2 border-[#E8EEF6] dark:border-border bg-white dark:bg-surface px-4 py-2.5 font-body text-ink transition focus:border-sky focus:outline-none" />
    </label>
  );
}
