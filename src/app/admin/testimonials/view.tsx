"use client";

import { useEffect, useState } from "react";
import { MessageSquareQuote, RefreshCw, Star } from "lucide-react";
import { adminFetch } from "@/lib/orgo/admin";
import { btnDanger, btnGhost, btnPrimary, inputCls } from "@/components/admin/ui";
import type { Testimonial } from "@/lib/orgo/testimonials";

type Draft = {
  name: string;
  quote: string;
  product: string;
  rating: number;
};

const emptyDraft: Draft = { name: "", quote: "", product: "", rating: 5 };

function TestimonialEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial: (Testimonial & { _id: string }) | null;
  onSave: (d: Draft, isNew: boolean) => Promise<void>;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<Draft>(
    initial
      ? { name: initial.name, quote: initial.quote, product: initial.product ?? "", rating: initial.rating ?? 5 }
      : emptyDraft,
  );
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  return (
    <div className="mt-5 rounded-lg border border-accent/40 bg-card p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Customer name</span>
          <input className={inputCls} value={draft.name} onChange={(e) => set("name", e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Product bought</span>
          <input className={inputCls} value={draft.product} onChange={(e) => set("product", e.target.value)} />
        </label>
        <div className="md:col-span-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Review / quote</span>
            <textarea className={inputCls} rows={3} value={draft.quote} onChange={(e) => set("quote", e.target.value)} />
          </label>
        </div>
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Rating</span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => set("rating", r)}
                className="text-terracotta"
                aria-label={`${r} star`}
              >
                <Star className={`size-6 ${r <= draft.rating ? "fill-current" : "opacity-30"}`} />
              </button>
            ))}
          </div>
        </label>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          className={btnPrimary}
          disabled={busy}
          onClick={async () => {
            if (!draft.name.trim() || !draft.quote.trim()) {
              alert("Both name and review text are required.");
              return;
            }
            setBusy(true);
            try {
              await onSave(draft, !initial);
            } finally {
              setBusy(false);
            }
          }}
          type="button"
        >
          {busy ? "Saving..." : initial ? "Save changes" : "Add review"}
        </button>
        <button className={btnGhost} onClick={onCancel} type="button">
          Cancel
        </button>
      </div>
    </div>
  );
}

export function TestimonialsManager() {
  const [items, setItems] = useState<(Testimonial & { _id: string })[]>([]);
  const [editing, setEditing] = useState<(Testimonial & { _id: string }) | null | "new" | undefined>(undefined);
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = (await adminFetch<(Testimonial & { _id: string })[]>("/api/admin/testimonials")) ?? [];
        if (!cancelled) setItems(data);
      } catch {
        if (!cancelled) setItems([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const reload = async () => {
    try {
      setItems((await adminFetch<(Testimonial & { _id: string })[]>("/api/admin/testimonials")) ?? []);
    } catch {
      setItems([]);
    }
  };

  const move = async (index: number, step: number) => {
    const target = items[index + step];
    if (!target) return;
    const item = items[index];
    setBusyId(item._id);
    try {
      await Promise.all([
        adminFetch(`/api/admin/testimonials/${item._id}`, {
          method: "PATCH",
          body: JSON.stringify({ sortOrder: target.sortOrder }),
        }),
        adminFetch(`/api/admin/testimonials/${target._id}`, {
          method: "PATCH",
          body: JSON.stringify({ sortOrder: item.sortOrder }),
        }),
      ]);
      await reload();
    } finally {
      setBusyId("");
    }
  };

  const toggleVisible = async (item: (Testimonial & { _id: string })) => {
    setBusyId(item._id);
    try {
      await adminFetch(`/api/admin/testimonials/${item._id}`, {
        method: "PATCH",
        body: JSON.stringify({ visible: !item.visible }),
      });
      await reload();
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-8 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-primary">Testimonials</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} reviews — visible ones appear on the homepage
          </p>
        </div>
        <div className="flex gap-2">
          <button className={btnGhost} onClick={reload} type="button">
            <RefreshCw className="size-3.5" /> Refresh
          </button>
          <button className={btnPrimary} onClick={() => setEditing("new")} type="button">
            + Add review
          </button>
        </div>
      </div>

      {editing === "new" ? (
        <TestimonialEditor
          initial={null}
          onCancel={() => setEditing(undefined)}
          onSave={async (d) => {
            await adminFetch("/api/admin/testimonials", {
              method: "POST",
              body: JSON.stringify({ ...d, sortOrder: 0, visible: true }),
            });
            await reload();
            setEditing(undefined);
          }}
        />
      ) : null}

      <div className="mt-5 overflow-hidden rounded-lg border border-border bg-card">
        {items.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            No reviews yet. Add one to show on the homepage.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((item, i) => (
              <li key={item._id} className="px-4 py-3">
                {editing === item ? (
                  <TestimonialEditor
                    initial={item}
                    onCancel={() => setEditing(undefined)}
                    onSave={async (d) => {
                      await adminFetch(`/api/admin/testimonials/${item._id}`, {
                        method: "PATCH",
                        body: JSON.stringify(d),
                      });
                      await reload();
                      setEditing(undefined);
                    }}
                  />
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <MessageSquareQuote className="size-4 shrink-0 text-primary" />
                        <span className="truncate">{item.name}</span>
                        <span className="flex shrink-0 gap-0.5 text-terracotta">
                          {Array.from({ length: item.rating || 5 }).map((_, s) => (
                            <Star key={s} className="size-3 fill-current" />
                          ))}
                        </span>
                      </p>
                      <p className="mt-1 pl-6 text-xs italic leading-relaxed text-muted-foreground">&ldquo;{item.quote}&rdquo;</p>
                      {item.product ? (
                        <p className="mt-1 pl-6 text-[11px] text-muted-foreground/70">
                          Purchased: {item.product}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        className={btnGhost}
                        disabled={i === 0 || busyId === item._id}
                        onClick={() => move(i, -1)}
                        type="button"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        className={btnGhost}
                        disabled={i === items.length - 1 || busyId === item._id}
                        onClick={() => move(i, 1)}
                        type="button"
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button
                        className={`${btnGhost} ${item.visible ? "" : "opacity-50"}`}
                        onClick={() => toggleVisible(item)}
                        disabled={busyId === item._id}
                        type="button"
                        title={item.visible ? "Visible on homepage" : "Hidden"}
                      >
                        {item.visible ? "Visible" : "Hidden"}
                      </button>
                      <button className={btnGhost} onClick={() => setEditing(item)} type="button">
                        Edit
                      </button>
                      <button
                        className={btnDanger}
                        onClick={async () => {
                          if (!window.confirm(`Delete review from "${item.name}"?`)) return;
                          setBusyId(item._id);
                          try {
                            await adminFetch(`/api/admin/testimonials/${item._id}`, {
                              method: "DELETE",
                              body: JSON.stringify({}),
                            });
                            await reload();
                          } finally {
                            setBusyId("");
                          }
                        }}
                        disabled={busyId === item._id}
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}