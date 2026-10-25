"use client";

import { useEffect, useState } from "react";
import { BadgePercent, RefreshCw, Ticket } from "lucide-react";
import { adminFetch } from "@/lib/orgo/admin";
import { btnDanger, btnGhost, btnPrimary, inputCls } from "@/components/admin/ui";
import type { Coupon } from "@/lib/orgo/coupons";

type Draft = {
  code: string;
  message: string;
  type: "percent" | "fixed" | "shipping";
  value: number;
  minOrder: number;
  maxDiscount: number;
  active: boolean;
  startsAt: string;
  endsAt: string;
};

function notifyCouponsChanged() {
  window.dispatchEvent(new Event("orgo:coupons-changed"));
}

const emptyDraft: Draft = {
  code: "",
  message: "",
  type: "percent",
  value: 10,
  minOrder: 0,
  maxDiscount: 0,
  active: true,
  startsAt: "",
  endsAt: "",
};

function dateInputValue(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  const part = (number: number) => String(number).padStart(2, "0");
  return `${date.getFullYear()}-${part(date.getMonth() + 1)}-${part(date.getDate())}`;
}

function toDraft(c: Coupon): Draft {
  return {
    code: c.code,
    message: c.message,
    type: c.type,
    value: c.value ?? 0,
    minOrder: c.minOrder ?? 0,
    maxDiscount: c.maxDiscount ?? 0,
    active: c.active,
    startsAt: dateInputValue(c.startsAt),
    endsAt: dateInputValue(c.endsAt),
  };
}

function toPayload(draft: Draft) {
  return {
    ...draft,
    startsAt: draft.startsAt ? new Date(`${draft.startsAt}T00:00:00`).toISOString() : null,
    endsAt: draft.endsAt ? new Date(`${draft.endsAt}T23:59:59.999`).toISOString() : null,
  };
}

function typeLabel(c: Pick<Coupon, "type" | "value" | "maxDiscount">) {
  if (c.type === "percent") {
    const cap = c.maxDiscount ? ` up to ₹${c.maxDiscount}` : "";
    return `${c.value}% off${cap}`;
  }
  if (c.type === "fixed") return `₹${c.value} off`;
  return "Free shipping";
}

function statusOf(c: Coupon) {
  if (!c.active) return { label: "Paused", cls: "text-muted-foreground" };
  const now = Date.now();
  const starts = c.startsAt ? new Date(c.startsAt).getTime() : null;
  const endDate = c.endsAt ? new Date(c.endsAt) : null;
  if (
    endDate &&
    endDate.getUTCHours() === 0 &&
    endDate.getUTCMinutes() === 0 &&
    endDate.getUTCSeconds() === 0 &&
    endDate.getUTCMilliseconds() === 0
  ) {
    endDate.setUTCHours(23, 59, 59, 999);
  }
  const ends = endDate?.getTime() ?? null;
  if (starts !== null && starts > now)
    return { label: "Scheduled", cls: "text-gold" };
  if (ends !== null && ends < now) return { label: "Expired", cls: "text-rose" };
  return { label: "Live", cls: "text-accent" };
}

function CouponEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial: Coupon | null;
  onSave: (d: Draft, isNew: boolean) => Promise<void>;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<Draft>(initial ? toDraft(initial) : emptyDraft);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  return (
    <div className="mt-5 rounded-lg border border-accent/40 bg-card p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Code
          </span>
          <input
            className={inputCls}
            placeholder="e.g. FARM10"
            value={draft.code}
            onChange={(e) => set("code", e.target.value.toUpperCase())}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Bar message
          </span>
          <input
            className={inputCls}
            placeholder="e.g. FLAT 10% OFF"
            value={draft.message}
            onChange={(e) => set("message", e.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Discount type
          </span>
          <select
            className={inputCls}
            value={draft.type}
            onChange={(e) => {
              const type = e.target.value as Draft["type"];
              setDraft((current) => ({
                ...current,
                type,
                value: type === "shipping" ? 0 : current.value || (type === "fixed" ? 100 : 10),
                maxDiscount: type === "percent" ? current.maxDiscount : 0,
              }));
            }}
          >
            <option value="percent">Percent off</option>
            <option value="fixed">Fixed ₹ off</option>
            <option value="shipping">Free shipping</option>
          </select>
        </label>
        {draft.type !== "shipping" ? (
          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {draft.type === "percent" ? "Percent value" : "Rupee value"}
            </span>
            <input
              className={inputCls}
              type="number"
              min={0}
              max={draft.type === "percent" ? 100 : undefined}
              step={draft.type === "percent" ? 0.01 : 1}
              value={draft.value}
              onChange={(e) => set("value", Number(e.target.value))}
            />
          </label>
        ) : null}
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Min order (₹)
          </span>
          <input
            className={inputCls}
            type="number"
            min={0}
            step={1}
            value={draft.minOrder}
            onChange={(e) => set("minOrder", Number(e.target.value))}
          />
        </label>
        {draft.type === "percent" ? (
          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Max discount (₹, optional)
            </span>
            <input
              className={inputCls}
              type="number"
              min={0}
              step={1}
              placeholder="0 = no cap"
              value={draft.maxDiscount}
              onChange={(e) => set("maxDiscount", Number(e.target.value))}
            />
          </label>
        ) : null}
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Starts on (optional)
          </span>
          <input className={inputCls} type="date" value={draft.startsAt} onChange={(e) => set("startsAt", e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Ends on (optional)
          </span>
          <input className={inputCls} type="date" value={draft.endsAt} onChange={(e) => set("endsAt", e.target.value)} />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={draft.active}
            onChange={(e) => set("active", e.target.checked)}
            className="size-4 accent-[var(--primary)]"
          />
          Active (available at checkout and in the announcement bar)
        </label>
      </div>
      {error ? <p className="mt-3 text-xs text-rose">{error}</p> : null}
      <div className="mt-4 flex gap-2">
        <button
          className={btnPrimary}
          disabled={busy}
          onClick={async () => {
            if (!draft.code.trim() || !draft.message.trim()) {
              setError("Code and bar message are both required.");
              return;
            }
            setBusy(true);
            setError("");
            try {
              await onSave(draft, !initial);
            } catch (e) {
              setError(e instanceof Error ? e.message : "Could not save coupon.");
            } finally {
              setBusy(false);
            }
          }}
          type="button"
        >
          {busy ? "Saving..." : initial ? "Save changes" : "Create coupon"}
        </button>
        <button className={btnGhost} onClick={onCancel} type="button">
          Cancel
        </button>
      </div>
    </div>
  );
}

export function CouponsManager() {
  const [items, setItems] = useState<Coupon[]>([]);
  const [editing, setEditing] = useState<Coupon | "new" | undefined>(undefined);
  const [busyId, setBusyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const reload = async () => {
    setPageError("");
    try {
      const data = await adminFetch<Coupon[]>("/api/admin/coupons");
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Could not load coupons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await adminFetch<Coupon[]>("/api/admin/coupons");
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!cancelled)
          setPageError(error instanceof Error ? error.message : "Could not load coupons.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleActive = async (c: Coupon) => {
    setBusyId(c._id);
    try {
      await adminFetch(`/api/admin/coupons/${c._id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !c.active }),
      });
      await reload();
      notifyCouponsChanged();
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Could not update coupon.");
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-8 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-primary">Coupons</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} coupons — active coupons can be applied at checkout and appear in the announcement bar
          </p>
        </div>
        <div className="flex gap-2">
          <button className={btnGhost} onClick={reload} type="button">
            <RefreshCw className="size-3.5" /> Refresh
          </button>
          <button className={btnPrimary} onClick={() => setEditing("new")} type="button">
            + New coupon
          </button>
        </div>
      </div>

      {pageError ? (
        <p role="alert" className="mt-4 rounded border border-rose/30 bg-rose/5 px-4 py-3 text-sm text-rose">
          {pageError}
        </p>
      ) : null}

      {editing === "new" ? (
        <CouponEditor
          initial={null}
          onCancel={() => setEditing(undefined)}
          onSave={async (d) => {
            await adminFetch("/api/admin/coupons", {
              method: "POST",
              body: JSON.stringify(toPayload(d)),
            });
            await reload();
            notifyCouponsChanged();
            setEditing(undefined);
          }}
        />
      ) : null}

      <div className="mt-5 overflow-hidden rounded-lg border border-border bg-card">
        {loading ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">Loading coupons…</p>
        ) : items.length === 0 && !pageError ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            No coupons yet. Create one to make a discount code available to customers.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((item) => {
              const st = statusOf(item);
              return (
                <li key={item._id} className="px-4 py-3">
                  {editing === item ? (
                    <CouponEditor
                      initial={item}
                      onCancel={() => setEditing(undefined)}
                      onSave={async (d) => {
                        await adminFetch(`/api/admin/coupons/${item._id}`, {
                          method: "PATCH",
                          body: JSON.stringify(toPayload(d)),
                        });
                        await reload();
                        notifyCouponsChanged();
                        setEditing(undefined);
                      }}
                    />
                  ) : (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground">
                          <Ticket className="size-4 shrink-0 text-primary" />
                          <span className="rounded border border-dashed border-primary/50 px-2 py-0.5 font-mono text-xs tracking-wider text-primary">
                            {item.code}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <BadgePercent className="size-3.5" />
                            {typeLabel(item)}
                          </span>
                          <span className={`text-[11px] uppercase tracking-wider ${st.cls}`}>{st.label}</span>
                        </p>
                        <p className="mt-1 pl-6 text-xs text-muted-foreground">
                          &ldquo;{item.message}&rdquo;
                          {item.minOrder ? ` · min order ₹${item.minOrder}` : ""}
                          {item.startsAt || item.endsAt
                            ? ` · ${dateInputValue(item.startsAt) || "now"} → ${dateInputValue(item.endsAt) || "no end"}`
                            : ""}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          className={`${btnGhost} ${item.active ? "" : "opacity-50"}`}
                          onClick={() => toggleActive(item)}
                          disabled={busyId === item._id}
                          type="button"
                          title={item.active ? "Pause coupon" : "Activate coupon"}
                        >
                          {item.active ? "Pause" : "Activate"}
                        </button>
                        <button className={btnGhost} onClick={() => setEditing(item)} type="button">
                          Edit
                        </button>
                        <button
                          className={btnDanger}
                          onClick={async () => {
                            if (!window.confirm(`Delete coupon ${item.code}?`)) return;
                            setBusyId(item._id);
                            try {
                              await adminFetch(`/api/admin/coupons/${item._id}`, {
                                method: "DELETE",
                                body: JSON.stringify({}),
                              });
                              await reload();
                              notifyCouponsChanged();
                            } catch (error) {
                              setPageError(error instanceof Error ? error.message : "Could not delete coupon.");
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
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
