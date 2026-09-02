"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/orgo/Reveal";
import {
  fallbackTestimonials,
  getTestimonials,
  type Testimonial,
} from "@/lib/orgo/testimonials";

export function Reviews() {
  const [items, setItems] = useState<Testimonial[]>(fallbackTestimonials);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = await getTestimonials();
      if (cancelled) return;
      if (list.length) setItems(list);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const response =
    ready && items.length === 0
      ? null
      : {
          eyebrow: ready ? "What Our Customers Say" : "Loved By Our Customers",
          title: ready ? "Real Reviews From Real Skin" : "Loved By Our Customers",
          subtitle: ready
            ? "Genuine feedback from people who switched to natural, handmade skincare."
            : "Loading real customer reviews...",
        };

  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-[1280px] px-4 py-20 md:px-8 md:py-28">
        <SectionHeading
          eyebrow={response?.eyebrow ?? "Loved By Our Customers"}
          title={response?.title ?? "Loved By Our Customers"}
          subtitle={response?.subtitle ?? ""}
        />
        {ready && items.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Reviews coming soon — be among the first to share your experience.
          </p>
        ) : (
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {items.map((r, i) => (
              <Reveal key={r._id ?? i} delay={i * 0.08}>
                <figure className="flex h-full flex-col border border-border p-8">
                  <div className="flex gap-1 text-terracotta">
                    {Array.from({ length: Math.min(5, r.rating || 5) }).map((_, s) => (
                      <Star key={s} className="size-3.5 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {r.quote}
                  </blockquote>
                  <figcaption className="mt-6 text-sm">
                    <span className="text-primary">{r.name}</span>
                    <span className="ml-2 text-[10px] tracking-[0.16em] text-accent">VERIFIED PURCHASE</span>
                    {r.product ? <p className="mt-1 text-xs text-muted-foreground">{r.product}</p> : null}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}