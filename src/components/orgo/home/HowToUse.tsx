"use client";

import { Check } from "lucide-react";
import { steps } from "@/lib/orgo/products";
import { Reveal, SectionHeading } from "@/components/orgo/Reveal";

const tips = [
  "Use 2–3 times a week",
  "Always do a patch test",
  "Use fresh water to mix",
  "Follow up with a good moisturizer",
  "Store in a cool, dry place",
];

export function HowToUse({ hideSteps = false }: { hideSteps?: boolean }) {
  return (
    <section className="paper border-y border-border">
      <div className="mx-auto max-w-[1280px] px-4 py-20 md:px-8 md:py-28">
        {/* hideSteps=true par heading+steps render nahi hote (guide image mein already dikh rahe hote hain) */}
        {!hideSteps ? (
          <>
            <SectionHeading
              eyebrow="Orgo Farm Face Pack"
              title="6 Easy Steps To Glowing Skin"
              subtitle="A simple weekly ritual for brightening and tightening skin."
            />

            {/* Journey timeline — desktop pe center line, steps alternate left/right */}
            <div className="relative mx-auto mt-16 max-w-4xl">
              <div className="absolute bottom-4 left-[27px] top-4 w-px bg-gradient-to-b from-sage/50 via-sage/25 to-transparent md:left-1/2" />

              <ol className="space-y-10 md:space-y-16">
                {steps.map((s, i) => {
                  const right = i % 2 === 1;
                  return (
                    <Reveal key={s.n} delay={i * 0.05}>
                      <li className="relative pl-20 md:min-h-28 md:pl-0">
                        {/* Number bubble — hamesha line ke exactly upar */}
                        <span className="group absolute left-0 top-0 z-10 grid size-14 cursor-default place-items-center rounded-full border border-border bg-card font-display text-xl text-primary soft-shadow transition-all duration-500 hover:scale-110 hover:border-primary hover:bg-primary hover:text-primary-foreground md:left-1/2 md:-translate-x-1/2">
                          {s.n}
                        </span>

                        {/* Content card — left/right alternate */}
                        <div
                          className={`rounded-sm border border-border bg-card/70 p-6 transition-all duration-500 hover:-translate-y-1 hover:lift-shadow md:w-[calc(50%-3.5rem)] ${
                            right ? "md:ml-auto" : "md:mr-auto"
                          }`}
                        >
                          <h3 className="font-display text-2xl text-primary">{s.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                        </div>
                      </li>
                    </Reveal>
                  );
                })}
              </ol>
            </div>
          </>
        ) : null}

        <Reveal delay={0.1}>
          <div className="mt-14 grid gap-8 bg-card p-8 md:grid-cols-2 md:p-12">
            <div>
              <p className="eyebrow text-accent">Tips For Best Results</p>
              <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                {tips.map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent/15">
                      <Check className="size-3 text-accent" strokeWidth={3} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-between gap-6">
              <p className="font-script text-3xl text-rose">Good skin is not magic, it&rsquo;s a routine.</p>
              <div className="flex flex-wrap gap-3 text-[10px] tracking-[0.18em] text-muted-foreground">
                <span className="border border-border px-4 py-2">FOR EXTERNAL USE ONLY</span>
                <span className="border border-border px-4 py-2">PATCH TEST RECOMMENDED</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
