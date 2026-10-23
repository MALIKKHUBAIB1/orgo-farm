"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { BadgeCheck, ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/orgo/Reveal";
import {
  fallbackTestimonials,
  getTestimonials,
  type Testimonial,
} from "@/lib/orgo/testimonials";

const tints = [
  "bg-sage/15 text-sage",
  "bg-rose/10 text-rose",
  "bg-gold/15 text-gold",
  "bg-terracotta/10 text-terracotta",
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const AUTOPLAY_MS = 4200;

export function Reviews() {
  const [items, setItems] = useState<Testimonial[]>(fallbackTestimonials);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

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

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Auto-slide — hover/keyboard par ruk jata hai, reduced-motion users ke liye band
  useEffect(() => {
    if (!emblaApi) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!pausedRef.current) emblaApi.scrollNext();
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [emblaApi]);

  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);
  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

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

  if (ready && items.length === 0) {
    return (
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-[1280px] px-4 py-20 md:px-8 md:py-28">
          <SectionHeading eyebrow="Loved By Our Customers" title="Loved By Our Customers" />
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Reviews coming soon — be among the first to share your experience.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-[1280px] px-4 py-20 md:px-8 md:py-28">
        <SectionHeading
          eyebrow={response?.eyebrow ?? "Loved By Our Customers"}
          title={response?.title ?? "Loved By Our Customers"}
          subtitle={response?.subtitle ?? ""}
        />

        <div
          className="relative mt-14"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {items.map((r, i) => (
                <div
                  key={r._id ?? i}
                  className="min-w-0 flex-[0_0_86%] pl-3 first:pl-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                >
                  <figure
                    className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-border bg-background/60 p-8 transition-all duration-500 hover:lift-shadow"
                  >
                    <Quote
                      className="absolute -top-3 right-5 size-16 rotate-180 text-primary/5 transition-colors duration-500 group-hover:text-primary/12"
                      strokeWidth={1}
                    />

                    <div className="flex gap-1 text-terracotta">
                      {Array.from({ length: Math.min(5, r.rating || 5) }).map((_, s) => (
                        <Star
                          key={s}
                          className="size-3.5 fill-current transition-transform duration-300 group-hover:scale-110"
                          style={{ transitionDelay: `${s * 40}ms` }}
                        />
                      ))}
                    </div>

                    <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {r.quote}
                    </blockquote>

                    {r.product ? (
                      <span className="mt-5 self-start border border-border px-3 py-1 text-[10px] tracking-[0.14em] text-muted-foreground">
                        {r.product.toUpperCase()}
                      </span>
                    ) : null}

                    <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                      <span
                        className={`grid size-11 shrink-0 place-items-center rounded-full font-display text-sm ${tints[i % tints.length]}`}
                      >
                        {initials(r.name)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-primary">{r.name}</span>
                        <span className="mt-0.5 flex items-center gap-1 text-[10px] tracking-[0.16em] text-accent">
                          <BadgeCheck className="size-3" />
                          VERIFIED PURCHASE
                        </span>
                      </span>
                    </figcaption>
                  </figure>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-10 flex items-center justify-center gap-5">
            <button
              onClick={prev}
              aria-label="Previous reviews"
              className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <ChevronLeft className="size-4" />
            </button>

            <div className="flex items-center gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  aria-label={`Go to review ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-400 ${
                    selected === i ? "w-7 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next reviews"
              className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Pause hint — thoda sa "live" feel */}
          <p
            className={`mt-4 text-center text-[10px] tracking-[0.18em] text-muted-foreground transition-opacity duration-300 ${
              paused ? "opacity-100" : "opacity-0"
            }`}
          >
            PAUSED — MOVE AWAY TO RESUME
          </p>
        </div>
      </div>
    </section>
  );
}
