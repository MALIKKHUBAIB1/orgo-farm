"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Minus, Plus, MessageCircle, Star, Truck } from "lucide-react";
import { toast } from "sonner";
import { inr, WHATSAPP_NUMBER, type Product } from "@/lib/orgo/products";
import { SITE_URL } from "@/lib/orgo/api";
import { useShop } from "@/lib/orgo/store";
import { resolveImage } from "@/lib/orgo/image";
import { ProductCard } from "@/components/orgo/ProductCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ProductView({ product, related }: { product: Product; related: Product[] }) {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const wished = wishlist.includes(product.slug);

  const waText = encodeURIComponent(
    `Hello ORGO FARM! I'd like to order:\n\nProduct: ${product.name} (${product.size})\nQuantity: ${qty}\nPrice: ${inr(
      product.price * qty,
    )}\nProduct link: ${SITE_URL}/product/${product.slug}\n\nName:\nDelivery address:\nPhone:`,
  );

  const info: [string, string][] = [
    ["Ingredients", product.ingredients],
    ["Benefits", product.benefits.join(" • ")],
    ["How To Use", product.howToUse],
    ["Suitable For", product.suitableFor],
    ["Product Details", `${product.name} · ${product.size} · Handcrafted in small batches.`],
    ["Shipping", "Free standard shipping across India. Fast delivery available at ₹100."],
    ["Returns", "Unopened products can be returned within 7 days of delivery."],
  ];

  return (
    <>
      <div className="mx-auto max-w-[1280px] px-4 py-6 text-xs text-muted-foreground md:px-8">
        <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> /{" "}
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="mx-auto grid max-w-[1280px] gap-12 px-4 pb-20 md:px-8 lg:grid-cols-2 lg:gap-16">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolveImage(product.gallery[active])}
            alt={product.name}
            className="aspect-[4/5] w-full object-cover soft-shadow"
          />
          <div className="mt-4 grid grid-cols-4 gap-3">
            {product.gallery.map((g, i) => (
              <button key={g + i} onClick={() => setActive(i)} className={i === active ? "ring-1 ring-primary" : ""}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resolveImage(g)} alt="" className="aspect-square w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          {product.badge ? (
            <span className="bg-primary px-3 py-1 text-[10px] tracking-[0.18em] text-primary-foreground">
              {product.badge}
            </span>
          ) : null}
          <h1 className="mt-4 text-4xl leading-tight text-primary md:text-5xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-terracotta">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-3.5 fill-current" />
            ))}
            <span className="text-xs text-muted-foreground">Placeholder rating · reviews coming soon</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-3xl">{inr(product.price)}</span>
            <span className="text-xs text-muted-foreground">
              {product.size}
              {product.eachNote ? ` · ${product.eachNote}` : ""}
            </span>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <ul className="mt-6 space-y-2 text-sm">
            {product.benefits.map((b) => (
              <li key={b} className="flex gap-3">
                <span className="mt-2 size-1 rounded-full bg-accent" />
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center border border-border">
              <button className="px-4 py-3" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">
                <Minus className="size-3.5" />
              </button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button className="px-4 py-3" onClick={() => setQty((q) => q + 1)} aria-label="Increase">
                <Plus className="size-3.5" />
              </button>
            </div>
            <button
              onClick={() => {
                toggleWishlist(product.slug);
                toast(wished ? "Removed from wishlist" : "Saved to wishlist");
              }}
              className="flex items-center gap-2 text-xs tracking-[0.18em] text-foreground/70"
            >
              <Heart className={`size-4 ${wished ? "fill-rose text-rose" : ""}`} /> WISHLIST
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => {
                addToCart(product.slug, qty);
                toast.success("Added to cart");
              }}
              className="bg-primary py-4 text-[11px] tracking-[0.24em] text-primary-foreground"
            >
              ADD TO CART
            </button>
            {/* Orders currently happen on WhatsApp. When online payment integration
                ships, this link is where the checkout/payment button plugs in. */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-primary py-4 text-[11px] tracking-[0.24em] text-primary-foreground transition-colors hover:opacity-90"
            >
              <MessageCircle className="size-4" /> ORDER ON WHATSAPP
            </a>
          </div>

          <p className="mt-6 flex items-center gap-2 text-xs tracking-[0.14em] text-muted-foreground">
            <Truck className="size-4" /> FREE STANDARD SHIPPING ACROSS INDIA
          </p>

          <Accordion type="single" collapsible className="mt-8">
            {info.map(([k, v]) => (
              <AccordionItem key={k} value={k}>
                <AccordionTrigger className="text-[11px] tracking-[0.18em]">{k.toUpperCase()}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{v}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <section className="border-t border-border">
        <div className="mx-auto max-w-[1280px] px-4 py-16 md:px-8">
          <h2 className="text-3xl text-primary">You May Also Love</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} compact />
            ))}
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-[52px] z-40 flex items-center gap-3 border-t border-border bg-card px-4 py-3 md:hidden">
        <span className="font-display text-lg">{inr(product.price * qty)}</span>
        <button
          onClick={() => {
            addToCart(product.slug, qty);
            toast.success("Added to cart");
          }}
          className="flex-1 bg-primary py-3 text-[10px] tracking-[0.2em] text-primary-foreground"
        >
          ADD TO CART
        </button>
        {/* Orders currently happen on WhatsApp — replace with payment button later. */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`}
          target="_blank"
          rel="noreferrer"
          className="flex shrink-0 items-center gap-2 bg-primary px-4 py-3 text-[10px] tracking-[0.2em] text-primary-foreground transition-colors hover:opacity-90"
        >
          <MessageCircle className="size-4" /> ORDER ON WHATSAPP
        </a>
      </div>
    </>
  );
}
