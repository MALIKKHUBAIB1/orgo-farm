"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { apiFetch } from "@/lib/orgo/api";
import { getSessionKey } from "@/lib/orgo/session";
import { getToken, setToken } from "@/lib/orgo/token";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  shopKey: string;
};

type AuthState = {
  user: AuthUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = getToken();
      if (!token) {
        if (!cancelled) setReady(true);
        return;
      }
      try {
        const u = await apiFetch<AuthUser>("/api/auth/me");
        if (!cancelled) setUser(u);
      } catch {
        setToken(null);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const finalize = useCallback(async (token: string, u: AuthUser) => {
    setToken(token);
    try {
      await apiFetch("/api/auth/merge", {
        method: "POST",
        body: JSON.stringify({ sessionKey: getSessionKey() }),
      });
    } catch {
      /* merge best-effort */
    }
    setUser(u);
    window.dispatchEvent(new Event("orgo-auth-changed"));
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await apiFetch<{ token: string; user: AuthUser }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      await finalize(res.token, res.user);
    },
    [finalize],
  );

  const register = useCallback(
    async (name: string, email: string, phone: string, password: string) => {
      const res = await apiFetch<{ token: string; user: AuthUser }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, phone, password }),
      });
      await finalize(res.token, res.user);
    },
    [finalize],
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    window.dispatchEvent(new Event("orgo-auth-changed"));
  }, []);

  return (
    <Ctx.Provider value={{ user, ready, login, register, logout }}>{children}</Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
