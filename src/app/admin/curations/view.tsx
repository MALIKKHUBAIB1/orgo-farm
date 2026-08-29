"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/orgo/admin";
import { refreshCatalog } from "@/lib/orgo/catalog";
import { inr, type Curation } from "@/lib/orgo/products";
import { Field, btnDanger, btnGhost, btnPrimary, inputCls } from "@/components/admin/ui";

function CurationForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Curation | null;
  onSave: (c: Curation, isNew: boolean) => Promise<void>;
  onCancel: () => void;
}) {
  const [tier, setTier] = useState<string>(initial?.tier ?? "Bronze");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [label, setLabel] = useState(initial?.label ?? "");
  const [itemsText, setItemsText] = useState(initial?.items.join("\n") ?? "");
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [cta, setCta] = useState(initial?.cta ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [busy, setBusy] = useState(false);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-primary">{initial ? "Edit Curation" : "New Curation"}</h1>
        <button className={btnGhost} onClick={onCancel} type="button">
          Back to list
        </button>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field label="Tier">
          <select className={inputCls} value={tier} onChange={(e) => setTier(e.target.value)}>
            <option>Bronze</option>
            <option>Silver</option>
            <option>Gold</option>
          </select>
        </Field>
        <Field label="Slug">
          <input className={inputCls} value={slug} onChange={(e) => setSlug(e.target.value)} />
        </Field>
        <Field label="Title">
          <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Label" hint="Short badge text">
          <input className={inputCls} value={label} onChange={(e) => setLabel(e.target.value)} />
        </Field>
        <Field label="Price (₹)">
          <input className={inputCls} type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        </Field>
        <Field label="CTA">
          <input className={inputCls} value={cta} onChange={(e) => setCta(e.target.value)} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Items" hint="One per line">
            <textarea className={inputCls} rows={6} value={itemsText} onChange={(e) => setItemsText(e.target.value)} />
          </Field>
        </div>
      </div>
      <div className="mt-8 flex items-center gap-3">
        <button
          className={btnPrimary}
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await onSave(
                {
                  slug: slug.trim().toLowerCase(),
                  tier: tier as Curation["tier"],
                  title: title.trim(),
                  label: label.trim(),
                  items: itemsText.split("\n").map((s) => s.trim()).filter(Boolean),
                  price: Number(price),
                  cta: cta.trim(),
                },
                !initial,
              );
            } finally {
              setBusy(false);
            }
          }}
          type="button"
        >
          {busy ? "Saving..." : initial ? "Save changes" : "Create curation"}
        </button>
        <button className={btnGhost} onClick={onCancel} type="button">
          Cancel
        </button>
      </div>
    </div>
  );
}

export function CurationsManager() {
  const [curations, setCurations] = useState<Curation[]>([]);
  const [editing, setEditing] = useState<Curation | null | "new" | undefined>(undefined);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const c = await adminFetch<Curation[]>("/api/curations");
        if (!cancelled) setCurations(c);
      } catch {
        if (!cancelled) setCurations([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [version]);

  useEffect(() => {
    const bump = () => setVersion((v) => v + 1);
    window.addEventListener("orgo-catalog-changed", bump);
    return () => window.removeEventListener("orgo-catalog-changed", bump);
  }, []);

  const reload = async () => {
    try {
      setCurations(await adminFetch<Curation[]>("/api/curations"));
    } catch {
      setCurations([]);
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-primary">Curations</h1>
          <p className="mt-1 text-sm text-muted-foreground">{curations.length} curated sets</p>
        </div>
        <button className={btnPrimary} onClick={() => setEditing("new")} type="button">
          + New curation
        </button>
      </div>

      {editing !== undefined ? (
        <CurationForm
          initial={editing === "new" ? null : editing}
          onCancel={() => setEditing(undefined)}
          onSave={async (c, isNew) => {
            if (isNew) {
              await adminFetch("/api/curations", { method: "POST", body: JSON.stringify(c) });
            } else {
              await adminFetch(`/api/curations/${c.slug}`, { method: "PATCH", body: JSON.stringify(c) });
            }
            await reload();
            refreshCatalog();
            setEditing(undefined);
          }}
        />
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {curations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No curations found.</p>
          ) : (
            curations.map((c) => (
              <div key={c.slug} className="rounded-lg border border-border bg-card p-5">
                <span className="rounded bg-beige/60 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
                  {c.tier}
                </span>
                <h3 className="mt-3 font-display text-xl text-primary">{c.title}</h3>
                <p className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {c.items.slice(0, 4).map((it) => (
                    <li key={it} className="flex gap-2">
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
                      {it}
                    </li>
                  ))}
                  {c.items.length > 4 ? <li className="text-xs">+{c.items.length - 4} more</li> : null}
                </ul>
                <p className="mt-3 font-display text-lg text-primary">{inr(c.price)}</p>
                <div className="mt-4 flex gap-2">
                  <button className={btnGhost} onClick={() => setEditing(c)} type="button">
                    Edit
                  </button>
                  <button
                    className={btnDanger}
                    onClick={async () => {
                      if (!window.confirm(`Delete "${c.title}" curation?`)) return;
                      await adminFetch(`/api/curations/${c.slug}`, { method: "DELETE", body: JSON.stringify({}) });
                      await reload();
                      refreshCatalog();
                    }}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}