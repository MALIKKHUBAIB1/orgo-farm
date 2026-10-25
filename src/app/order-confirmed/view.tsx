"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { displayProductImage, inr } from "@/lib/orgo/products";
import { useShop } from "@/lib/orgo/store";
import { useCatalog } from "@/lib/orgo/catalog";
import { resolveImage } from "@/lib/orgo/image";

export function OrderConfirmedView() {
  const { lastOrder } = useShop();
  const { products } = useCatalog();

  return (
    <div className="mx-auto max-w-[820px] px-4 py-20 text-center md:px-8">
      <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary text-primary-foreground">
        <Check className="size-7" />
      </div>
      <h1 className="mt-8 text-4xl text-primary md:text-5xl">Thank You For Choosing ORGO FARM</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Your order has been received and is being prepared with care.
      </p>

      {lastOrder ? (
        <div className="mt-12 border border-border p-8 text-left">
          <div className="flex flex-wrap justify-between gap-4 text-sm">
            <div>
              <p className="eyebrow text-muted-foreground">Order ID</p>
              <p className="mt-1 font-display text-xl">{lastOrder.id}</p>
            </div>
            <div>
              <p className="eyebrow text-muted-foreground">Estimated Delivery</p>
              <p className="mt-1">{lastOrder.shipping === "fast" ? "2–3 business days" : "4–7 business days"}</p>
            </div>
          </div>

          <ul className="mt-8 space-y-4 border-t border-border pt-6 text-sm">
            {lastOrder.lines.map((l) => {
              const p = products.find((pr) => pr.slug === l.slug);
              if (!p) return null;
              return (
                <li key={l.slug} className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resolveImage(displayProductImage(p))} alt="" className="size-14 object-cover" />
                  <span className="flex-1">
                    {p.name} × {l.qty}
                  </span>
                  <span>{inr(p.price * l.qty)}</span>
                </li>
              );
            })}
          </ul>

          {lastOrder.discount ? (
            <div className="mt-6 flex justify-between border-t border-border pt-5 text-sm">
              <span className="text-muted-foreground">
                Coupon{lastOrder.coupon?.code ? ` (${lastOrder.coupon.code})` : ""}
              </span>
              <span>−{inr(lastOrder.discount)}</span>
            </div>
          ) : null}
          <div className="mt-6 flex justify-between border-t border-border pt-5 font-display text-xl">
            <span>Total</span>
            <span>{inr(lastOrder.total)}</span>
          </div>

          <div className="mt-8 text-sm">
            <p className="eyebrow text-muted-foreground">Delivery Address</p>
            <p className="mt-2 leading-relaxed">
              {lastOrder.name}
              <br />
              {lastOrder.address}, {lastOrder.city}
              <br />
              {lastOrder.state} — {lastOrder.pin}
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-10 text-sm text-muted-foreground">No recent order found.</p>
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/account" className="bg-primary px-9 py-4 text-[11px] tracking-[0.24em] text-primary-foreground">
          TRACK ORDER
        </Link>
        <Link href="/shop" className="border border-primary px-9 py-4 text-[11px] tracking-[0.24em] text-primary">
          CONTINUE SHOPPING
        </Link>
      </div>
    </div>
  );
}
