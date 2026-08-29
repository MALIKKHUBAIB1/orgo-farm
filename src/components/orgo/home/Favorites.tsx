"use client";

import Link from "next/link";
import { ProductCard } from "@/components/orgo/ProductCard";
import { Reveal, SectionHeading } from "@/components/orgo/Reveal";
import { useCatalog } from "@/lib/orgo/catalog";

export function Favorites() {
  const { products } = useCatalog();
  const featured = products.filter((p) => p.featured).length ? products.filter((p) => p.featured) : products;
  const shown = featured.slice(0, 4);

  return (
    <section id="favorites" className="mx-auto max-w-[1280px] px-4 py-20 md:px-8 md:py-28">
      <SectionHeading
        eyebrow="Bestsellers"
        title="Our Natural Favorites"
        subtitle="Simple ingredients. Thoughtful formulations. Skin that feels naturally cared for."
      />
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {shown.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.08}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link href="/shop" className="eyebrow border-b border-primary pb-1 text-primary">
          View All Products
        </Link>
      </div>
    </section>
  );
}
