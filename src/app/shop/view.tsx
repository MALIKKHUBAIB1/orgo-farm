"use client";

import { useMemo, useState } from "react";
import { type Product } from "@/lib/orgo/products";
import { ProductCard } from "@/components/orgo/ProductCard";
import { Reveal } from "@/components/orgo/Reveal";

const sorts = ["Featured", "Newest", "Price Low to High", "Price High to Low", "Customer Rating"] as const;

const priceCap = (list: Product[]) =>
  list.length ? Math.min(1000, Math.ceil(Math.max(...list.map((p) => p.price)) / 10) * 10) : 300;

export function ShopView({ products }: { products: Product[] }) {
  const categories = useMemo(
    () => [...new Set(products.flatMap((p) => [p.category, p.type]))],
    [products],
  );
  const concernOptions = useMemo(
    () => [...new Set(products.flatMap((p) => p.concerns))].sort(),
    [products],
  );
  const cap = priceCap(products);

  const [category, setCategory] = useState<string | null>(null);
  const [concern, setConcern] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState(cap);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<(typeof sorts)[number]>("Featured");

  const list = useMemo(() => {
    let l = products.filter(
      (p) =>
        (!category || p.category === category || p.type === category) &&
        (!concern || p.concerns.includes(concern)) &&
        p.price <= maxPrice &&
        (!inStockOnly || p.inStock),
    );
    if (sort === "Price Low to High") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "Price High to Low") l = [...l].sort((a, b) => b.price - a.price);
    if (sort === "Newest") l = [...l].reverse();
    return l;
  }, [products, category, concern, maxPrice, inStockOnly, sort]);

  const chip = (active: boolean) =>
    `px-4 py-2 text-[10px] tracking-[0.18em] border transition-colors ${
      active ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground/70 hover:border-primary"
    }`;

  return (
    <>
      <section className="paper border-b border-border">
        <div className="mx-auto max-w-[1280px] px-4 py-14 md:px-8 md:py-20">
          <p className="eyebrow text-accent">Shop</p>
          <h1 className="mt-3 text-5xl text-primary md:text-6xl">Shop Natural Skincare</h1>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground">
            Handcrafted in small batches with 100% natural, farm-fresh ingredients.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            <button className={chip(!category)} onClick={() => setCategory(null)}>
              ALL
            </button>
            {categories.map((c) => (
              <button key={c} className={chip(category === c)} onClick={() => setCategory(c)}>
                {c.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-14 md:px-8 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-8">
          <div>
            <p className="eyebrow text-muted-foreground">Skin Concern</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className={chip(!concern)} onClick={() => setConcern(null)}>
                ANY
              </button>
              {concernOptions.map((c) => (
                <button key={c} className={chip(concern === c)} onClick={() => setConcern(c)}>
                  {c.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow text-muted-foreground">Price — up to ₹{maxPrice}</p>
            <input
              type="range"
              min={99}
              max={cap}
              step={10}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="mt-4 w-full accent-[var(--primary)]"
            />
          </div>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="size-4 accent-[var(--primary)]"
            />
            In stock only
          </label>
        </aside>

        <div>
          <div className="flex items-center justify-between border-b border-border pb-4">
            <p className="text-xs text-muted-foreground">{list.length} products</p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as (typeof sorts)[number])}
              className="border border-border bg-card px-3 py-2 text-xs outline-none"
            >
              {sorts.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.05}>
                <ProductCard product={p} compact />
              </Reveal>
            ))}
          </div>
          {list.length === 0 ? (
            <p className="py-20 text-center text-sm text-muted-foreground">
              No products match these filters yet. Try widening your selection.
            </p>
          ) : null}
        </div>
      </div>
    </>
  );
}
