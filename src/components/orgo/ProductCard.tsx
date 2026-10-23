"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Heart, Star } from "lucide-react";
import { toast } from "sonner";
import { inr, type Product } from "@/lib/orgo/products";
import { useShop } from "@/lib/orgo/store";
import { resolveImage } from "@/lib/orgo/image";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const wished = wishlist.includes(product.slug);

  return (
    <article className="group relative flex h-full flex-col bg-card transition-shadow duration-500 hover:lift-shadow">
      <div className="relative overflow-hidden">
        <Link href={`/product/${product.slug}`}>
          <img
            src={resolveImage(product.image)}
            alt={product.name}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          />
        </Link>

        {product.badge ? (
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="absolute left-3 top-3 animate-pulse-soft bg-primary px-3 py-1 text-[10px] tracking-[0.18em] text-primary-foreground"
          >
            {product.badge}
          </motion.span>
        ) : null}

        <motion.button
          aria-label="Add to wishlist"
          whileTap={{ scale: 0.75 }}
          animate={wished ? { scale: [1, 1.4, 1] } : {}}
          transition={{ duration: 0.4 }}
          onClick={() => {
            toggleWishlist(product.slug);
            toast(wished ? "Removed from wishlist" : "Saved to wishlist");
          }}
          className={`absolute right-3 top-3 grid size-9 place-items-center rounded-full transition-colors ${
            wished ? "bg-rose/10" : "bg-card/90"
          } text-foreground/70 hover:text-rose`}
        >
          <Heart className={`size-4 transition-all ${wished ? "fill-rose text-rose" : ""}`} />
        </motion.button>

        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex translate-y-3 gap-2 opacity-0 transition-all duration-500 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={() => {
              addToCart(product.slug);
              toast.success(`${product.name} added to cart`);
            }}
            className="shimmer flex-1 bg-primary py-3 text-[10px] tracking-[0.2em] text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
          >
            ADD TO CART
          </button>
          <Link
            href={`/product/${product.slug}`}
            className="bg-card px-4 py-3 text-[10px] tracking-[0.2em] text-primary"
          >
            QUICK VIEW
          </Link>
        </div>
      </div>

      <div className={`flex flex-1 flex-col ${compact ? "p-4" : "p-5"}`}>
        <div className="flex items-center gap-1 text-terracotta">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="size-3 fill-current" />
          ))}
          <span className="ml-1 text-[11px] text-muted-foreground">Placeholder rating</span>
        </div>
        <h3 className="mt-2 font-display text-xl leading-snug text-primary">
          <Link href={`/product/${product.slug}`}>
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-[11px] tracking-[0.16em] text-muted-foreground">{product.size}</p>
        {!compact ? <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.short}</p> : null}
        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-display text-xl text-foreground">{inr(product.price)}</span>
          {product.eachNote ? <span className="text-xs text-muted-foreground">{product.eachNote}</span> : null}
        </div>
        <button
          onClick={() => {
            addToCart(product.slug);
            toast.success(`${product.name} added to cart`);
          }}
          className="mt-4 border border-primary py-3 text-[10px] tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground md:hidden"
        >
          ADD TO CART
        </button>
      </div>
    </article>
  );
}
