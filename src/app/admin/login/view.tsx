"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Field, btnPrimary, inputCls } from "@/components/admin/ui";
import { adminLogin } from "@/lib/orgo/admin";

const bigInput = `${inputCls} px-4 py-3 text-base`;

export function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  return (
    <div className="paper min-h-screen border-y border-border">
      <div className="mx-auto max-w-sm px-4 py-24">
        <p className="text-center font-display text-xl tracking-[0.14em] text-primary">ORGO FARM</p>
        <h1 className="mt-1 text-center font-display text-3xl text-primary">Admin Login</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">Sign in to manage your store.</p>
        <form
          className="mt-8 space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            setLoggingIn(true);
            setError("");
            try {
              await adminLogin(email.trim(), password);
              window.location.href = "/admin";
            } catch (err) {
              setError(err instanceof Error ? err.message : "Login failed");
            } finally {
              setLoggingIn(false);
            }
          }}
        >
          <Field label="Email / Username">
            <input
              className={bigInput}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoCapitalize="none"
              autoComplete="username"
              placeholder="admin@orgo.in"
            />
          </Field>
          <Field label="Password">
            <div className="relative">
              <input
                className={`${bigInput} pr-12`}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground transition hover:bg-accent/40 hover:text-primary"
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </Field>
          {error ? <p className="text-sm text-rose">{error}</p> : null}
          <button className={`${btnPrimary} w-full px-4 py-3 text-base`} disabled={loggingIn} type="submit">
            {loggingIn ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}