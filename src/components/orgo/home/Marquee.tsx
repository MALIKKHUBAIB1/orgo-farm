"use client";

import { Leaf } from "lucide-react";

const items = [
  "100% Handmade",
  "No Parabens",
  "Farm Fresh Ingredients",
  "Cruelty Free",
  "No Artificial Fragrance",
  "Crafted In Noida",
  "Skin-Loving Natural Oils",
  "Small Batch Goodness",
];

export function Marquee() {
  return (
    <div className="overflow-hidden border-y border-border bg-gradient-to-r from-sage/12 via-gold/10 to-rose/12 py-4">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {items.map((t) => (
              <span key={t} className="flex items-center gap-3 px-6">
                <Leaf className="size-3.5 shrink-0 text-accent" strokeWidth={1.6} />
                <span className="eyebrow whitespace-nowrap text-primary/80">{t}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
