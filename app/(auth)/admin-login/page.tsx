"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AdminLoginForm } from "./AdminLoginForm";

export default function AdminLoginPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(isAdmin ? "/dashboard" : "/");
    }
  }, [isAuthenticated, isAdmin, router]);

  return <AdminLoginForm />;
}
