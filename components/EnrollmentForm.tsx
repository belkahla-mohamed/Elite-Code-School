"use client";

import { useMemo, useState } from "react";
import type { Program } from "@/lib/types";

type Props = {
  programs: Program[];
};

const steps = ["Élève", "Parcours", "Parent"];

export function EnrollmentForm({ programs }: Props) {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const ageOptions = useMemo(() => Array.from({ length: 11 }, (_, index) => index + 7), []);

  function nextStep() {
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function previousStep() {
    setStep((current) => Math.max(current - 1, 0));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = new FormData(event.currentTarget);
    const payload = {
      studentFirstName: form.get("studentFirstName"),
      studentLastName: form.get("studentLastName"),
      age: form.get("age"),
      schoolLevel: form.get("schoolLevel"),
      programId: form.get("programId"),
      parentPhone: form.get("parentPhone"),
      parentEmail: form.get("parentEmail"),
      message: form.get("message")
    };

    const response = await fetch("/api/inscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
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
    setMessage("Demande envoyée. L'équipe vous contactera sous 24h.");
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 sm:p-8">
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {steps.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(index)}
            className={`rounded-brand-sm border px-4 py-3 text-left text-sm font-extrabold ${
              step === index ? "border-accent bg-[#EAF0FF] text-accent" : "border-[#E6EEF8] bg-white text-ink-soft"
            }`}
          >
            <span className="block font-mono text-xs">0{index + 1}</span>
            {label}
          </button>
        ))}
      </div>

      <div className={step === 0 ? "block" : "hidden"}>
        <h2 className="font-display text-2xl font-extrabold">Informations de l'élève</h2>
        <p className="mt-2 text-sm text-ink-soft">On commence simple: nom, âge et niveau actuel.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <TextField name="studentFirstName" label="Prénom de l'élève *" placeholder="Karim" required />
          <TextField name="studentLastName" label="Nom de famille *" placeholder="Benali" required />
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Âge *
            <select name="age" required className="rounded-brand-sm border border-ink/15 bg-surface px-4 py-3 font-normal outline-none focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/15">
              <option value="">-- Sélectionner --</option>
              {ageOptions.map((age) => (
                <option key={age} value={age}>
                  {age} ans
                </option>
              ))}
            </select>
          </label>
          <TextField name="schoolLevel" label="Niveau scolaire" placeholder="6ème primaire" />
        </div>
      </div>

      <div className={step === 1 ? "block" : "hidden"}>
        <h2 className="font-display text-2xl font-extrabold">Choix du parcours</h2>
        <p className="mt-2 text-sm text-ink-soft">Choisis le parcours le plus proche. L'équipe ajuste après contact.</p>
        <label className="mt-6 flex flex-col gap-2 text-sm font-semibold">
          Formation souhaitée *
          <select name="programId" required className="rounded-brand-sm border border-ink/15 bg-surface px-4 py-3 font-normal outline-none focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/15">
            <option value="">-- Choisir une formation --</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.title} · {program.ageRange}
              </option>
            ))}
          </select>
        </label>
        <div className="mt-5 rounded-brand-sm border border-[#E6EEF8] bg-surface p-4 text-sm text-ink-soft">
          Si tu hésites, choisis le parcours qui plaît le plus à l'enfant. On confirmera par téléphone.
        </div>
      </div>

      <div className={step === 2 ? "block" : "hidden"}>
        <h2 className="font-display text-2xl font-extrabold">Contact parent</h2>
        <p className="mt-2 text-sm text-ink-soft">Dernière étape: comment l'équipe peut vous rappeler.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <TextField name="parentPhone" label="Téléphone parent *" type="tel" placeholder="+212 6XX XXX XXX" required />
          <TextField name="parentEmail" label="Email parent *" type="email" placeholder="parent@email.com" required />
        </div>
        <label className="mt-4 flex flex-col gap-2 text-sm font-semibold">
          Message
          <textarea name="message" className="min-h-24 rounded-brand-sm border border-ink/15 bg-surface px-4 py-3 font-normal outline-none focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/15" placeholder="Questions, disponibilités, niveau actuel…" />
        </label>
      </div>

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

      {message ? (
        <p className={`mt-4 rounded-brand-sm px-4 py-3 text-center text-sm ${status === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
          {message}
        </p>
      ) : (
        <p className="mt-3 text-center text-xs text-ink-soft">Réponse sous 24h · Essai gratuit disponible sur demande</p>
      )}
    </form>
  );
}

function TextField({
  label,
  name,
  placeholder,
  type = "text",
  required = false
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold">
      {label}
      <input name={name} required={required} type={type} className="rounded-brand-sm border border-ink/15 bg-surface px-4 py-3 font-normal outline-none focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/15" placeholder={placeholder} />
    </label>
  );
}
