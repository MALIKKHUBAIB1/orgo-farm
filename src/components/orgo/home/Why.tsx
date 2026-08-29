"use client";

import { Droplets, HandHeart, Leaf, ShieldCheck, Sprout, Wind } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/orgo/Reveal";

const items = [
  { icon: Leaf, title: "100% Natural Ingredients", text: "Natural, farm-fresh ingredients." },
  { icon: ShieldCheck, title: "No Parabens", text: "Thoughtful formulations without parabens." },
  { icon: Wind, title: "No Artificial Fragrances", text: "Natural and authentic product experience." },
  { icon: HandHeart, title: "Handmade With Love", text: "Carefully handcrafted products." },
  { icon: Sprout, title: "Farm To Skin", text: "Bringing natural care directly from the farm." },
  { icon: Droplets, title: "Made With Purpose", text: "Quality and authenticity in every product." },
];

export function Why() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-[1280px] px-4 py-20 md:px-8 md:py-28">
        <SectionHeading eyebrow="Trust" title="Why Choose ORGO FARM?" />
        <div className="mt-14 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.05}>
              <div className="h-full bg-card p-8 transition-colors hover:bg-muted/60">
                <it.icon className="size-6 text-accent" strokeWidth={1.2} />
                <h3 className="mt-5 font-display text-2xl text-primary">{it.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{it.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
