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

export async function getActiveCoupons(): Promise<Coupon[]> {
  try {
    return await apiFetch<Coupon[]>("/api/coupons");
  } catch {
    return [];
  }
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
