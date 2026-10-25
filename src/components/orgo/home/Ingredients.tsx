"use client";

import { ingredients } from "@/lib/orgo/products";
import { Reveal, SectionHeading } from "@/components/orgo/Reveal";

export function Ingredients() {
  return (
    <section className="wash-sage border-b border-border">
      <div className="mx-auto max-w-[1280px] px-4 py-20 md:px-8 md:py-28">
        <SectionHeading
          eyebrow="From The Farm"
          title="Ingredients We Trust"
          subtitle="Every formulation begins with a short list of ingredients we can name and trace."
        />
        <div className="mt-14 grid grid-cols-2 gap-8 md:grid-cols-5">
          {ingredients.map((ing, i) => (
            <Reveal key={ing.name} delay={i * 0.07} className="text-center">
              <img
                src={ing.image}
                alt={ing.name}
                loading="lazy"
                className="mx-auto aspect-square w-full max-w-[180px] rounded-full object-cover soft-shadow transition-all duration-500 hover:scale-105 hover:lift-shadow"
              />
              <h3 className="mt-5 font-display text-2xl text-primary">{ing.name}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{ing.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
