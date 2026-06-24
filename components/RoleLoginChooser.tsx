"use client";

import Link from "next/link";
import { GraduationCap, School, UserRound } from "lucide-react";
import { useState } from "react";

type Role = "parent" | "teacher" | "student";

const roles = [
  {
    id: "parent",
    title: "Parent",
    description: "Suivi enfant, privacy, certificats et bilan.",
    Icon: UserRound,
    active: true,
    href: "/parent"
  },
  {
    id: "teacher",
    title: "Teacher",
    description: "Suivi pédagogique, projets et progression.",
    Icon: School,
    active: true,
    href: "/teacher"
  },
  {
    id: "student",
    title: "Student",
    description: "Portfolio personnel, missions et badges.",
    Icon: GraduationCap,
    active: false,
    href: "/student"
  }
] as const;

export function RoleLoginChooser() {
  const [selectedRole, setSelectedRole] = useState<Role>("parent");
  const selected = roles.find((role) => role.id === selectedRole) ?? roles[0];

  return (
    <section className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
      <div className="grid gap-4">
        {roles.map(({ id, title, description, Icon, active }) => (
          <button
            key={id}
            type="button"
            onClick={() => setSelectedRole(id)}
            className={`flex items-center gap-4 rounded-brand border bg-white p-5 text-left transition ${
              selectedRole === id ? "border-accent" : "border-[#E6EEF8] hover:border-accent"
            }`}
          >
            <span className="flex size-14 items-center justify-center rounded-2xl bg-[#EAF0FF] text-accent">
              <Icon />
            </span>
            <span className="flex-1">
              <span className="font-display text-xl font-extrabold">{title}</span>
              <span className="mt-1 block text-sm text-ink-soft">{description}</span>
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${active ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
              {active ? "Actif" : "Phase 2"}
            </span>
          </button>
        ))}
      </div>

      <div className="rounded-brand border border-[#E6EEF8] bg-white p-7">
        <div className="flex items-center gap-4">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-white">
            <selected.Icon />
          </span>
          <div>
            <h2 className="font-display text-2xl font-extrabold">Espace {selected.title}</h2>
            <p className="text-sm text-ink-soft">{selected.description}</p>
          </div>
        </div>

        {selected.active ? (
          <div className="mt-8">
            <p className="rounded-brand-sm bg-surface p-4 text-sm leading-6 text-ink-soft">
              {selected.id === "parent"
                ? "L'accès parent utilise email + secret enfant généré par l'équipe après validation de l'inscription."
                : "L'accès teacher utilise email + secret généré par l'admin. Aucun teacher ne peut créer son compte tout seul."}
            </p>
            <Link href={selected.href} className="btn-primary mt-5 inline-flex w-full justify-center">
              Continuer vers l'espace {selected.title.toLowerCase()}
            </Link>
          </div>
        ) : (
          <div className="mt-8">
            <p className="rounded-brand-sm bg-amber-50 p-4 text-sm leading-6 text-amber-800">
              Cette interface est prévue, mais le backend/auth spécifique n'est pas encore branché. On garde le choix visible pour préparer l'architecture sans inventer un faux accès.
            </p>
            <Link href={selected.href} className="btn-outline mt-5 inline-flex w-full justify-center">
              Voir l'interface prévue
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
