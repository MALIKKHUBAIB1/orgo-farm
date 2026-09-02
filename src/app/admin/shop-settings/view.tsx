"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { adminFetch } from "@/lib/orgo/admin";
import { refreshCatalog } from "@/lib/orgo/catalog";
import { emptySettings, type PriceBucket, type ShopSettings } from "@/lib/orgo/shop-settings";
import { btnGhost, btnPrimary, inputCls } from "@/components/admin/ui";

function StringListEditor({
  label,
  hint,
  items,
  placeholder,
  onChange,
}: {
  label: string;
  hint?: string;
  items: string[];
  placeholder: string;
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={`${item}-${i}`} className="flex items-center gap-2">
            <span className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm">{item}</span>
            <button
              className={btnGhost}
              disabled={i === 0}
              onClick={() => {
                const next = [...items];
                [next[i - 1], next[i]] = [next[i], next[i - 1]];
                onChange(next);
              }}
              type="button"
              aria-label="Move up"
            >
              <ArrowUp className="size-3.5" />
            </button>
            <button
              className={btnGhost}
              disabled={i === items.length - 1}
              onClick={() => {
                const next = [...items];
                [next[i + 1], next[i]] = [next[i], next[i + 1]];
                onChange(next);
              }}
              type="button"
              aria-label="Move down"
            >
              <ArrowDown className="size-3.5" />
            </button>
            <button
              className={btnGhost}
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              type="button"
              aria-label="Remove"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
        <div className="flex gap-2">
          <input
            className={inputCls}
            placeholder={placeholder}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button
            className={btnPrimary}
            onClick={() => {
              const value = draft.trim();
              if (!value) return;
              if (!items.some((s) => s.toLowerCase() === value.toLowerCase())) onChange([...items, value]);
              setDraft("");
            }}
            type="button"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>
      {hint ? <span className="mt-1 block text-[11px] text-muted-foreground/70">{hint}</span> : null}
    </div>
  );
}

function BucketEditor({ buckets, onChange }: { buckets: PriceBucket[]; onChange: (next: PriceBucket[]) => void }) {
  const [label, setLabel] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Price buckets <span className="normal-case tracking-normal">— keep empty to use the slider</span>
      </p>
      <div className="space-y-2">
        {buckets.map((b, i) => (
          <div key={`${b.label}-${i}`} className="flex items-center gap-2">
            <span className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm">
              {b.label}
              <span className="ml-2 text-muted-foreground">
                — ₹{b.min}
                {b.max === null ? "+" : ` to ₹${b.max}`}
              </span>
            </span>
            <button
              className={btnGhost}
              onClick={() => onChange(buckets.filter((_, j) => j !== i))}
              type="button"
              aria-label="Remove bucket"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
        <div className="grid grid-cols-[1fr_90px_90px_auto] gap-2">
          <input className={inputCls} placeholder="Label (e.g. Up to ₹300)" value={label} onChange={(e) => setLabel(e.target.value)} />
          <input className={inputCls} placeholder="Min ₹" value={min} onChange={(e) => setMin(e.target.value)} />
          <input className={inputCls} placeholder="Max ₹" value={max} onChange={(e) => setMax(e.target.value)} />
          <button
            className={btnPrimary}
            onClick={() => {
              const l = label.trim();
              if (!l) return;
              onChange([
                ...buckets,
                {
                  label: l,
                  min: min === "" ? 0 : Number(min),
                  max: max === "" ? null : Number(max),
                },
              ]);
              setLabel("");
              setMin("");
              setMax("");
            }}
            type="button"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ShopSettingsManager() {
  const [settings, setSettings] = useState<ShopSettings>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await adminFetch<{ settings: ShopSettings | null }>("/api/admin/shop-settings");
        if (!cancelled) {
          if (data.settings) setSettings(data.settings);
          setLoaded(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const save = async () => {
    setBusy(true);
    try {
      await adminFetch<{ settings: ShopSettings }>("/api/admin/shop-settings", {
        method: "PUT",
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      refreshCatalog();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save settings.");
    } finally {
      setBusy(false);
    }
  };

  const loadFromProducts = async () => {
    try {
      const products = await adminFetch<
        { category: string; type: string; concerns: string[] }[]
      >("/api/products");
      setSettings((cur) => ({
        ...cur,
        categories: [...new Set(products.flatMap((p) => [p.category, p.type]))],
        concerns: [...new Set(products.flatMap((p) => p.concerns))].sort(),
      }));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Could not load products.");
    }
  };

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><p className="text-sm text-muted-foreground">Loading settings...</p></div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-primary">Shop Settings</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            These are the filters shown on the shop page — categories, skin concerns, price buckets and sort options.
            Leave empty to let the shop auto-detect from products.
          </p>
        </div>
        <button className={btnGhost} onClick={loadFromProducts} type="button">
          Load from products
        </button>
      </div>

      <div className="mt-6 space-y-8">
        <section className="rounded-lg border border-accent/40 bg-card p-5">
          <StringListEditor
            label="Category chips"
            hint="Chips below the shop header categories. Empty = auto from products."
            items={settings.categories}
            placeholder="e.g. Face Care"
            onChange={(items) => setSettings((cur) => ({ ...cur, categories: items }))}
          />
        </section>

        <section className="rounded-lg border border-accent/40 bg-card p-5">
          <StringListEditor
            label="Skin concerns"
            hint="These chips appear after ANY. Empty = auto from products."
            items={settings.concerns}
            placeholder="e.g. Acne"
            onChange={(items) => setSettings((cur) => ({ ...cur, concerns: items }))}
          />
        </section>

        <section className="rounded-lg border border-accent/40 bg-card p-5">
          <BucketEditor
            buckets={settings.priceBuckets}
            onChange={(buckets) => setSettings((cur) => ({ ...cur, priceBuckets: buckets }))}
          />
        </section>

        <section className="rounded-lg border border-accent/40 bg-card p-5">
          <StringListEditor
            label="Sort options"
            hint="Sort dropdown. Empty = Default sort list."
            items={settings.sorts}
            placeholder="e.g. Newest"
            onChange={(items) => setSettings((cur) => ({ ...cur, sorts: items }))}
          />
        </section>

        <section className="rounded-lg border border-accent/40 bg-card p-5">
          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              In-stock checkbox label
            </span>
            <input
              className={inputCls}
              value={settings.inStockLabel}
              onChange={(e) => setSettings((cur) => ({ ...cur, inStockLabel: e.target.value }))}
            />
          </label>
        </section>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <button className={btnPrimary} disabled={busy} onClick={save} type="button">
          {busy ? "Saving..." : "Save settings"}
        </button>
        {saved ? <span className="text-sm text-accent">Saved — shop updated!</span> : null}
        {!loaded ? <span className="text-xs text-muted-foreground">Not configured yet — defaults are live.</span> : null}
      </div>
    </div>
  );
}