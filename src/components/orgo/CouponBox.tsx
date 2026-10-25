"use client";

import { useState } from "react";
import { Ticket, X } from "lucide-react";
import { couponDiscount, validateCoupon, type AppliedCoupon } from "@/lib/orgo/coupons";
import { inr } from "@/lib/orgo/products";

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30";
const removeClass =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-primary";

export function CouponBox({
  subtotal,
  shippingFee,
  applied,
  onApply,
  onRemove,
}: {
  subtotal: number;
  shippingFee: number;
  applied: AppliedCoupon | null;
  onApply: (coupon: AppliedCoupon) => void;
  onRemove: () => void;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const currentDiscount = applied
    ? couponDiscount(applied.coupon, subtotal, shippingFee)
    : 0;

  const apply = async () => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      onApply(await validateCoupon(code, subtotal, shippingFee));
      setCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not validate coupon.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-5 border-t border-border pt-5">
      <h3 className="flex items-center gap-2 text-sm font-medium text-primary">
        <Ticket className="size-4" /> Apply coupon
      </h3>
      {applied ? (
        <div className="mt-3 flex items-center justify-between gap-3 rounded border border-accent/40 bg-accent/5 p-3">
          <div className="min-w-0 text-xs">
            <p className="font-mono font-semibold tracking-wider text-primary">{applied.coupon.code}</p>
            <p className="mt-1 text-muted-foreground">
              {applied.coupon.message} · {inr(currentDiscount)} discount
            </p>
            {subtotal < applied.coupon.minOrder ? (
              <p className="mt-1 text-rose">Add {inr(applied.coupon.minOrder - subtotal)} to meet the minimum order.</p>
            ) : null}
            {applied.coupon.type === "shipping" && shippingFee === 0 ? (
              <p className="mt-1 text-muted-foreground">Standard shipping is already free.</p>
            ) : null}
          </div>
          <button type="button" className={removeClass} onClick={onRemove} aria-label="Remove coupon">
            <X className="size-3.5" /> Remove
          </button>
        </div>
      ) : (
        <div className="mt-3 flex gap-2">
          <input
            className={inputClass}
            value={code}
            maxLength={24}
            placeholder="Enter code"
            aria-label="Coupon code"
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void apply();
              }
            }}
          />
          <button
            type="button"
            className="shrink-0 border border-primary px-4 py-2 text-xs font-medium text-primary disabled:opacity-50"
            onClick={() => void apply()}
            disabled={busy || !code.trim()}
          >
            {busy ? "Checking…" : "Apply"}
          </button>
        </div>
      )}
      {error ? <p role="alert" className="mt-2 text-xs text-rose">{error}</p> : null}
    </section>
  );
}
