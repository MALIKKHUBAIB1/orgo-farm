"use client";

import { inr, img, WHATSAPP_NUMBER } from "@/lib/orgo/products";
import { Reveal, SectionHeading } from "@/components/orgo/Reveal";
import { useCatalog } from "@/lib/orgo/catalog";

const styles: Record<string, string> = {
  Bronze: "bg-beige text-foreground",
  Silver: "bg-muted text-foreground",
  Gold: "bg-primary text-primary-foreground",
};

export function Curations() {
  const { curations } = useCatalog();
  return (
    <section className="paper border-y border-border">
      <div className="mx-auto max-w-[1280px] px-4 py-20 md:px-8 md:py-28">
        <SectionHeading
          eyebrow="ORGO FARM Curations"
          title="Curated Wellness"
          subtitle="Thoughtfully selected skincare rituals for every kind of self-care journey."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {curations.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.1}>
              <div className={`flex h-full flex-col p-8 ${styles[c.tier]} ${c.tier === "Gold" ? "lift-shadow" : "soft-shadow"}`}>
                <p className="eyebrow opacity-70">{c.label}</p>
                <h3
                  className={`mt-4 font-display text-4xl ${c.tier === "Gold" ? "gold-text" : c.tier === "Silver" ? "text-accent" : "text-terracotta"}`}
                >
                  {c.tier}
                </h3>
                <p className="mt-1 font-display text-2xl">{c.title}</p>
                <ul className="mt-6 flex-1 space-y-2.5 text-sm opacity-85">
                  {c.items.map((it) => (
                    <li key={it} className="flex gap-2">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-current opacity-60" />
                      {it}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 font-display text-2xl">{inr(c.price)}</p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Hello ORGO FARM! I'd like to order a curation:\n\nTier: ${c.tier} — ${c.title}\nIncludes: ${c.items.join(", ")}\nPrice: ${inr(c.price)}\n\nName:\nDelivery address:\nPhone:`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`mt-6 border px-6 py-3.5 text-center text-[10px] tracking-[0.22em] transition-colors ${
                    c.tier === "Gold"
                      ? "border-primary-foreground/40 hover:bg-primary-foreground hover:text-primary"
                      : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {c.cta}
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <img src={img.curationTiers} alt="ORGO FARM curation tiers card" className="w-full object-cover soft-shadow" />
            <img src={img.curationCard} alt="ORGO FARM curation offering card" className="w-full object-cover soft-shadow" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
