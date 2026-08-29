"use client";

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

            <ol className="mt-14 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
              {steps.map((s, i) => (
                <Reveal key={s.n} delay={i * 0.05}>
                  <li className="h-full bg-card p-8">
                    <span className="font-display text-4xl text-beige">{s.n}</span>
                    <h3 className="mt-3 font-display text-2xl text-primary">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </>
        ) : null}

        <Reveal delay={0.1}>
          <div className="mt-10 grid gap-8 bg-card p-8 md:grid-cols-2 md:p-12">
            <div>
              <p className="eyebrow text-accent">Tips For Best Results</p>
              <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                {tips.map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-2 size-1 rounded-full bg-accent" />
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
