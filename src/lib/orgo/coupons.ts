import { apiFetch } from "./api";

export type Coupon = {
  _id: string;
  code: string;
  message: string;
  type: "percent" | "fixed" | "shipping";
  value: number;
  minOrder: number;
  maxDiscount: number;
  active: boolean;
  startsAt: string | null;
  endsAt: string | null;
};

export type AppliedCoupon = { coupon: Coupon; discount: number };

export async function validateCoupon(code: string, subtotal: number, shippingFee: number): Promise<AppliedCoupon> {
  return apiFetch<AppliedCoupon>("/api/coupons/validate", {
    method: "POST",
    body: JSON.stringify({ code, subtotal, shippingFee }),
  });
}

export function couponDiscount(coupon: Coupon, subtotal: number, shippingFee: number): number {
  if (subtotal < coupon.minOrder) return 0;
  if (coupon.type === "percent") {
    const amount = (subtotal * coupon.value) / 100;
    return Math.min(subtotal, coupon.maxDiscount > 0 ? Math.min(amount, coupon.maxDiscount) : amount);
  }
  if (coupon.type === "fixed") return Math.min(subtotal, coupon.value);
  return shippingFee;
}

export async function getActiveCoupons(): Promise<Coupon[]> {
  return apiFetch<Coupon[]>("/api/coupons");
}

// Human line for the announcement bar, e.g. "FLAT 10% OFF · USE CODE FARM10".
export function couponLine(c: Coupon): string {
  if (c.type === "percent") {
    const cap = c.maxDiscount ? ` (up to ₹${c.maxDiscount})` : "";
    return `${c.message} · USE CODE ${c.code}${cap}`;
  }
  if (c.type === "fixed") return `${c.message} · USE CODE ${c.code}`;
  return `${c.message} · USE CODE ${c.code}`;
}
