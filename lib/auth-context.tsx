"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type UserRole = "admin" | "parent" | null;

interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (user: AuthUser, token?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isParent: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  isParent: false,
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("ecs_token");
    if (stored) {
      try {
        const payload = JSON.parse(atob(stored.split(".")[1]));
        if (payload.exp && payload.exp >= Math.floor(Date.now() / 1000)) {
          setUser({ id: payload.id ?? "", name: payload.name ?? "", role: payload.role });
          setToken(stored);
        } else {
          localStorage.removeItem("ecs_token");
        }
      } catch {
        localStorage.removeItem("ecs_token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((u: AuthUser, t?: string) => {
    setUser(u);
    if (t) {
      setToken(t);
      localStorage.setItem("ecs_token", t);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("ecs_token");
    window.location.href = "/";
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
        isParent: user?.role === "parent",
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
