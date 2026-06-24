"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function ParentGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isParent, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isParent)) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, isParent, router]);

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (!isAuthenticated || !isParent) return null;
  return <>{children}</>;
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.replace("/admin");
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (!isAuthenticated || !isAdmin) return null;
  return <>{children}</>;
}

export function TeacherGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role !== "teacher") {
      router.replace("/teacher");
    }
  }, [isLoading, user, router]);

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (user?.role !== "teacher") return null;
  return <>{children}</>;
}
