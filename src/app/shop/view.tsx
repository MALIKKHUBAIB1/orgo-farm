"use client";

import { useMemo, useState } from "react";
import { type Product } from "@/lib/orgo/products";
import { useCatalog } from "@/lib/orgo/catalog";
import type { PriceBucket } from "@/lib/orgo/shop-settings";
import { ProductCard } from "@/components/orgo/ProductCard";
import { Reveal } from "@/components/orgo/Reveal";

const DEFAULT_SORTS = ["Featured", "Newest", "Price Low to High", "Price High to Low", "Customer Rating"];

const priceCap = (list: Product[]) =>
  list.length ? Math.min(1000, Math.ceil(Math.max(...list.map((p) => p.price)) / 10) * 10) : 300;

export function ShopView({
  products,
  initialCategory = null,
}: {
  products: Product[];
  initialCategory?: string | null;
}) {
  const { settings } = useCatalog();

  const categories = useMemo(
    () =>
      settings?.categories?.length
        ? settings.categories
        : [...new Set(products.flatMap((p) => [p.category, p.type]))],
    [products, settings?.categories],
  );
  const concernOptions = useMemo(
    () =>
      settings?.concerns?.length
        ? settings.concerns
        : [...new Set(products.flatMap((p) => p.concerns))].sort(),
    [products, settings?.concerns],
  );
  const sorts =
    settings?.sorts?.length && settings.sorts.length
      ? settings.sorts
      : DEFAULT_SORTS;
  const buckets = settings?.priceBuckets?.length ? settings.priceBuckets : null;
  const cap = priceCap(products);
  const inStockLabel = settings?.inStockLabel || "In stock only";

  const [category, setCategory] = useState<string | null>(initialCategory);
  const [concern, setConcern] = useState<string | null>(null);
  const [bucket, setBucket] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState(cap);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<string>(sorts[0] ?? "Featured");

  const pickCategory = (c: string | null) => {
    setCategory(c);
    const url = new URL(window.location.href);
    if (c) url.searchParams.set("category", c);
    else url.searchParams.delete("category");
    window.history.replaceState(null, "", url);
    window.dispatchEvent(new Event("orgo:category-change"));
  };

  const inBucket = (b: PriceBucket) =>
    maxPrice >= b.min && (b.max === null ? true : maxPrice <= b.max);

  const list = useMemo(() => {
    let l = products.filter(
      (p) =>
        (!category || p.category === category || p.type === category) &&
        (!concern || p.concerns.includes(concern)) &&
        p.price <= maxPrice &&
        (!inStockOnly || p.inStock),
    );
    const s = sort.toLowerCase();
    if (s.includes("high to low") || s.includes("high-to-low")) l = [...l].sort((a, b) => b.price - a.price);
    else if (s.includes("low to high") || s.includes("low-to-high")) l = [...l].sort((a, b) => a.price - b.price);
    else if (s.includes("newest")) l = [...l].reverse();
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
            <button className={chip(!category)} onClick={() => pickCategory(null)}>
              ALL
            </button>
            {categories.map((c) => (
              <button key={c} className={chip(category === c)} onClick={() => pickCategory(c)}>
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
                <button
                  key={c}
                  className={chip(concern === c)}
                  onClick={() => {
                    setConcern((cur) => (cur === c ? null : c));
                  }}
                >
                  {c.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow text-muted-foreground">
              {bucket !== null && buckets ? (
                (buckets[bucket]?.label ?? "Price").toUpperCase()
              ) : (
                <>Price — up to ₹{maxPrice}</>
              )}
            </p>
            {buckets ? (
              <div className="mt-4 flex flex-col gap-2">
                <button
                  className={chip(bucket === null)}
                  onClick={() => {
                    setBucket(null);
                    setMaxPrice(cap);
                  }}
                >
                  ANY
                </button>
                {buckets.map((b, i) => (
                  <button
                    key={b.label}
                    className={chip(bucket === i)}
                    onClick={() => {
                      setBucket(i);
                      setMaxPrice(b.max === null ? cap : b.max);
                    }}
                  >
                    {b.label.toUpperCase()}
                  </button>
                ))}
              </div>
            ) : (
              <>
                <input
                  type="range"
                  min={99}
                  max={cap}
                  step={10}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="mt-4 w-full accent-[var(--primary)]"
                />
                <label className="mt-2 block text-right text-xs text-muted-foreground">up to ₹{maxPrice}</label>
              </>
            )}
          </div>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="size-4 accent-[var(--primary)]"
            />
            {inStockLabel}
          </label>
        </aside>

        <div>
          <div className="flex items-center justify-between border-b border-border pb-4">
            <p className="text-xs text-muted-foreground">{list.length} products</p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
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