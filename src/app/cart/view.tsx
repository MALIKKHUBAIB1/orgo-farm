"use client";

import Link from "next/link";
import { MessageCircle, Minus, Plus, Trash2, Truck } from "lucide-react";
import { inr, WHATSAPP_NUMBER } from "@/lib/orgo/products";
import { useShop } from "@/lib/orgo/store";
import { useCatalog } from "@/lib/orgo/catalog";
import { resolveImage } from "@/lib/orgo/image";

export function CartView() {
  const { cart, setQty, removeFromCart, toggleWishlist } = useShop();
  const { products } = useCatalog();
  const lines = cart.flatMap((l) => {
    const product = products.find((p) => p.slug === l.slug);
    return product ? [{ ...l, product }] : [];
  });
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);

  const waText = encodeURIComponent(
    `Hello ORGO FARM! I'd like to order:\n\n${lines
      .map((l, i) => `${i + 1}. ${l.product.name} (${l.product.size}) × ${l.qty} — ${inr(l.product.price * l.qty)}`)
      .join("\n")}\n\nSubtotal: ${inr(subtotal)}\nShipping: FREE\n\nName:\nDelivery address:\nPhone:`,
  );

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-14 md:px-8 md:py-20">
      <h1 className="text-4xl text-primary md:text-5xl">Your Cart</h1>

      {lines.length === 0 ? (
        <div className="mt-10 border border-border p-14 text-center">
          <p className="font-script text-3xl text-rose">Your cart is still empty</p>
          <Link href="/shop" className="mt-6 inline-block bg-primary px-9 py-4 text-[11px] tracking-[0.24em] text-primary-foreground">
            CONTINUE SHOPPING
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="divide-y divide-border border-y border-border">
            {lines.map((l) => (
              <div key={l.slug} className="flex gap-5 py-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resolveImage(l.product.image)} alt={l.product.name} className="size-28 object-cover" />
                <div className="flex-1">
                  <h2 className="font-display text-xl text-primary">{l.product.name}</h2>
                  <p className="text-xs text-muted-foreground">{l.product.size}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <div className="flex items-center border border-border">
                      <button className="px-3 py-2" onClick={() => setQty(l.slug, l.qty - 1)} aria-label="Decrease">
                        <Minus className="size-3" />
                      </button>
                      <span className="w-8 text-center text-sm">{l.qty}</span>
                      <button className="px-3 py-2" onClick={() => setQty(l.slug, l.qty + 1)} aria-label="Increase">
                        <Plus className="size-3" />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(l.slug)} className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Trash2 className="size-3.5" /> Remove
                    </button>
                    <button onClick={() => toggleWishlist(l.slug)} className="text-xs text-muted-foreground">
                      Move to wishlist
                    </button>
                  </div>
                </div>
                <p className="font-display text-xl">{inr(l.product.price * l.qty)}</p>
              </div>
            ))}
          </div>

          <aside className="h-fit border border-border p-7">
            <h2 className="eyebrow text-accent">Order Summary</h2>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{inr(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="text-accent">FREE</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Discount</dt>
                <dd>—</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-4 font-display text-xl">
                <dt>Total</dt>
                <dd>{inr(subtotal)}</dd>
              </div>
            </dl>
            {/* TEMP: checkout disabled while orders run on WhatsApp.
                Re-enable when online payment integration ships. */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`}
              target="_blank"
              rel="noreferrer"
              className="mt-7 flex items-center justify-center gap-2 bg-primary py-4 text-center text-[11px] tracking-[0.24em] text-primary-foreground transition-colors hover:opacity-90"
            >
              <MessageCircle className="size-4" /> ORDER ON WHATSAPP
            </a>
            <Link href="/shop" className="mt-3 block border border-primary py-4 text-center text-[11px] tracking-[0.24em] text-primary">
              CONTINUE SHOPPING
            </Link>
            <p className="mt-5 flex items-center gap-2 text-[10px] tracking-[0.16em] text-muted-foreground">
              <Truck className="size-4" /> FREE STANDARD SHIPPING ACROSS INDIA
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
