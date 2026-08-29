"use client";

import { Star } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/orgo/Reveal";

const reviews = [
  { name: "Customer Name", product: "Signature Face Pack Pouch" },
  { name: "Customer Name", product: "Rose Scrub Bar" },
  { name: "Customer Name", product: "D-Tan Coffee Bar" },
];

export function Reviews() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-[1280px] px-4 py-20 md:px-8 md:py-28">
        <SectionHeading eyebrow="Placeholder content" title="Loved By Our Customers" subtitle="Review content below is placeholder text, ready to be replaced with real customer feedback." />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <figure className="h-full border border-border p-8">
                <div className="flex gap-1 text-terracotta">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="size-3.5 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  [Placeholder review text — replace with a real customer review before launch.]
                </blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="text-primary">{r.name}</span>
                  <span className="ml-2 text-[10px] tracking-[0.16em] text-accent">VERIFIED PURCHASE</span>
                  <p className="mt-1 text-xs text-muted-foreground">{r.product}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
