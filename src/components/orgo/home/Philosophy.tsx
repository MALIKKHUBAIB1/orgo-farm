"use client";

import { Leaf } from "lucide-react";
import { img } from "@/lib/orgo/products";
import { Reveal } from "@/components/orgo/Reveal";

export function Philosophy() {
  return (
    <section className="mx-auto grid max-w-[1280px] items-center gap-12 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-2 lg:gap-20">
      <Reveal>
        <img
          src={img.roseBar}
          alt="Handmade ORGO FARM rose soap bar with dried petals"
          className="aspect-[4/5] w-full rounded-b-[999px] object-cover soft-shadow"
        />
      </Reveal>
      <Reveal delay={0.1}>
        <Leaf className="size-8 text-accent" strokeWidth={1.2} />
        <p className="eyebrow mt-6 text-accent">Our Philosophy</p>
        <h2 className="mt-4 text-4xl leading-tight text-primary md:text-5xl">Nature, Crafted With Perfection.</h2>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground md:text-base">
          We believe in doing everything with absolute perfection. From selecting natural ingredients to carefully
          crafting every product, ORGO FARM brings premium organic care directly from the farm to your skin.
        </p>
        <p className="mt-8 font-script text-3xl text-rose">Made with love, from nature</p>
      </Reveal>
    </section>
  );
}
