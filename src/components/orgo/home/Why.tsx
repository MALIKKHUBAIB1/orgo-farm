"use client";

import { Droplets, HandHeart, Leaf, ShieldCheck, Sprout, Wind } from "lucide-react";
import { img } from "@/lib/orgo/products";
import { Reveal, SectionHeading } from "@/components/orgo/Reveal";

const smalls = [
  {
    icon: ShieldCheck,
    title: "No Parabens",
    text: "Thoughtful formulations without parabens.",
    tint: "bg-terracotta/10 text-terracotta",
  },
  {
    icon: Wind,
    title: "No Artificial Fragrances",
    text: "Natural and authentic product experience.",
    tint: "bg-rose/10 text-rose",
  },
  {
    icon: HandHeart,
    title: "Handmade With Love",
    text: "Carefully handcrafted in small batches.",
    tint: "bg-gold/15 text-gold",
  },
  {
    icon: Sprout,
    title: "Farm To Skin",
    text: "Bringing natural care directly from the farm.",
    tint: "bg-accent/15 text-accent",
  },
];

export function Why() {
  return (
    <section className="wash-warm border-y border-border">
      <div className="mx-auto max-w-[1280px] px-4 py-20 md:px-8 md:py-28">
        <SectionHeading
          eyebrow="Trust"
          title="Why Choose ORGO FARM?"
          subtitle="Six promises we keep in every single batch."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {/* Hero card — image reveal on hover */}
          <Reveal className="lg:col-span-2">
            <div className="group relative h-full min-h-[340px] overflow-hidden rounded-sm">
              <img
                src={img.collection}
                alt="ORGO FARM natural handmade products"
                loading="lazy"
                className="absolute inset-0 size-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/50 to-foreground/15" />
              <div className="relative flex h-full flex-col justify-end p-8 md:p-10">
                <span className="grid size-12 place-items-center rounded-full bg-primary-foreground/15 text-primary-foreground backdrop-blur-sm">
                  <Leaf className="size-5" strokeWidth={1.5} />
                </span>
                <h3 className="mt-5 font-display text-3xl text-primary-foreground md:text-4xl">
                  100% Natural Ingredients
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-primary-foreground/80">
                  Natural, farm-fresh ingredients — nothing your skin can’t pronounce.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Small promise cards */}
          {smalls.map((it, i) => {
            const Icon = it.icon;
            return (
              <Reveal key={it.title} delay={0.08 * (i + 1)}>
                <div className="group flex h-full flex-col justify-center rounded-sm border border-border bg-background/85 p-7 transition-all duration-500 hover:-translate-y-1 hover:lift-shadow">
                  <span
                    className={`grid size-12 place-items-center rounded-full transition-transform duration-500 group-hover:scale-110 ${it.tint}`}
                  >
                    <Icon className="size-5" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-4 font-display text-xl text-primary">{it.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{it.text}</p>
                </div>
              </Reveal>
            );
          })}

          {/* Bottom banner — brand green strip */}
          <Reveal delay={0.3} className="lg:col-span-3">
            <div className="group flex h-full flex-col items-start gap-5 rounded-sm bg-primary p-8 text-primary-foreground transition-all duration-500 hover:lift-shadow sm:flex-row sm:items-center md:p-10">
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-primary-foreground/15">
                <Droplets className="size-6" strokeWidth={1.4} />
              </span>
              <div className="flex-1">
                <h3 className="font-display text-3xl">Made With Purpose</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-primary-foreground/75">
                  Quality and authenticity in every product — small batches, honest labels, nothing to hide.
                </p>
              </div>
              <span className="hidden shrink-0 font-script text-3xl text-primary-foreground/45 md:block">
                with love
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
