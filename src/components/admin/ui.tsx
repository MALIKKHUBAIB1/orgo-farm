"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { adminMe } from "@/lib/orgo/admin";

export const inputCls =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";

export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-primary";

export const btnDanger =
  "inline-flex items-center justify-center rounded-md border border-rose/40 px-3 py-1.5 text-xs font-medium text-rose transition hover:bg-rose/10";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-[11px] text-muted-foreground/70">{hint}</span> : null}
    </label>
  );
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const admin = await adminMe();
      if (cancelled) return;
      setAuthed(Boolean(admin));
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (ready && !authed) router.replace("/admin/login");
  }, [ready, authed, router]);

  if (!ready || !authed) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Checking admin session...</p>
      </div>
    );
  }

  return <>{children}</>;
}