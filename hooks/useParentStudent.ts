"use client";

import { useState, useEffect, useCallback } from "react";
import type { StudentPortfolio } from "@/lib/types";
import { showToast } from "@/components/ui/toast";

export function useParentStudent() {
  const [student, setStudent] = useState<StudentPortfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudent = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/parent/student");
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Impossible de charger les données");
        return;
      }
      const data = await res.json();
      setStudent(data.student);
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }, []);

  const togglePrivacy = useCallback(async () => {
    if (!student) return;
    try {
      const res = await fetch(`/api/students/${student.id}/privacy`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: !student.isPublic }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      setStudent(data.student);
      showToast(
        data.student.isPublic ? "Portfolio rendu public" : "Portfolio rendu privé",
        "success"
      );
    } catch (e: any) {
      showToast(e.message ?? "Erreur lors du changement", "error");
    }
  }, [student]);

  const updateStudent = useCallback((updated: StudentPortfolio) => {
    setStudent(updated);
  }, []);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  return { student, loading, error, refetch: fetchStudent, togglePrivacy, updateStudent };
}
