"use client";

import { useState } from "react";
import { INDIA_STATES, STATE_CITIES, findCityPin } from "@/lib/orgo/india";
import type { ProfileAddress } from "@/lib/orgo/profile";

const OTHER = "__other__";

function Select({
  label,
  value,
  onChange,
  children,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="eyebrow text-muted-foreground">{label}</span>
      <select
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full appearance-none border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary"
      >
        {children}
      </select>
    </label>
  );
}

export function AddressFields({
  value,
  onChange,
}: {
  value: ProfileAddress;
  onChange: (v: ProfileAddress) => void;
}) {
  const set = (patch: Partial<ProfileAddress>) => onChange({ ...value, ...patch });
  const cities = STATE_CITIES[value.state] ?? [];
  const [custom, setCustom] = useState(
    !!value.state && !!value.city && !cities.some((c) => c.name === value.city),
  );

  function handleState(s: string) {
    if (s === value.state) return;
    setCustom(false);
    set({ state: s, city: "", pin: "" });
  }

  function handleCity(v: string) {
    if (v === OTHER) {
      setCustom(true);
      set({ city: "", pin: "" });
      return;
    }
    setCustom(false);
    const pin = findCityPin(value.state, v);
    set({ city: v, ...(pin ? { pin } : {}) });
  }

  return (
    <>
      <label className="block">
        <span className="eyebrow text-muted-foreground">Address</span>
        <input
          required
          placeholder="House no., street, area"
          value={value.address}
          onChange={(e) => set({ address: e.target.value })}
          className="mt-2 w-full border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary"
        />
      </label>

      <Select label="State" required value={value.state} onChange={handleState}>
        <option value="" disabled>
          Select state
        </option>
        {value.state && !(INDIA_STATES as readonly string[]).includes(value.state) ? (
          <option value={value.state}>{value.state}</option>
        ) : null}
        {INDIA_STATES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </Select>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="City" required value={custom ? OTHER : value.city} onChange={handleCity}>
          {!custom ? (
            <>
              <option value="" disabled>
                {value.state ? "Select city" : "Select state first"}
              </option>
              {cities.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </>
          ) : null}
          <option value={OTHER}>Other (not listed)</option>
        </Select>

        {custom ? (
          <label className="block">
            <span className="eyebrow text-muted-foreground">City / Town</span>
            <input
              autoFocus
              required
              placeholder="Type your city or town"
              value={value.city}
              onChange={(e) => set({ city: e.target.value })}
              className="mt-2 w-full border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </label>
        ) : null}
      </div>

      <label className="block">
        <span className="eyebrow text-muted-foreground">PIN Code</span>
        <input
          required
          inputMode="numeric"
          pattern="[0-9]{6}"
          title="6-digit PIN code"
          maxLength={6}
          placeholder="6-digit PIN code"
          value={value.pin}
          onChange={(e) => set({ pin: e.target.value.replace(/\D/g, "").slice(0, 6) })}
          className="mt-2 w-full border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary"
        />
        {!custom && findCityPin(value.state, value.city) ? (
          <span className="mt-1 block text-xs text-accent">
            Auto-filled for {value.city}. Edit it if your area has a different PIN.
          </span>
        ) : null}
      </label>
    </>
  );
}
