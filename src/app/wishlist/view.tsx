"use client";

import Link from "next/link";
import { toast } from "sonner";
import { displayProductImage, inr } from "@/lib/orgo/products";
import { useShop } from "@/lib/orgo/store";
import { useCatalog } from "@/lib/orgo/catalog";
import { resolveImage } from "@/lib/orgo/image";

export function WishlistView() {
  const { wishlist, removeWishlist, addToCart } = useShop();
  const { products } = useCatalog();
  const items = wishlist
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-14 md:px-8 md:py-20">
      <h1 className="text-4xl text-primary md:text-5xl">Your Natural Wishlist</h1>

      {items.length === 0 ? (
        <div className="mt-10 border border-border p-14 text-center">
          <p className="font-script text-3xl text-rose">Your wishlist is waiting for something natural.</p>
          <Link href="/shop" className="mt-6 inline-block bg-primary px-9 py-4 text-[11px] tracking-[0.24em] text-primary-foreground">
            EXPLORE PRODUCTS
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {items.map((p) => (
            <div key={p!.slug} className="bg-card">
              <Link href={`/product/${p!.slug}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resolveImage(displayProductImage(p))} alt={p.name} className="aspect-[4/5] w-full object-cover" />
              </Link>
              <div className="p-4">
                <h2 className="font-display text-xl text-primary">{p!.name}</h2>
                <p className="mt-1 font-display text-lg">{inr(p!.price)}</p>
                <button
                  onClick={() => {
                    addToCart(p!.slug);
                    toast.success("Added to cart");
                  }}
                  className="mt-4 w-full bg-primary py-3 text-[10px] tracking-[0.2em] text-primary-foreground"
                >
                  ADD TO CART
                </button>
                <button onClick={() => removeWishlist(p!.slug)} className="mt-2 w-full py-2 text-xs text-muted-foreground">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
