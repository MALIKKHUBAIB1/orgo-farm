import type { Metadata } from "next";
import { Curations } from "@/components/orgo/home/Curations";
import { img } from "@/lib/orgo/products";

export const metadata: Metadata = {
  title: "Natural Skincare Gift Sets & Wellness Bundles | ORGO FARM",
  description:
    "Bronze, Silver and Gold ORGO FARM curations: thoughtfully selected handmade skincare rituals for every self-care journey.",
  alternates: { canonical: "/collections" },
  keywords: ["skincare gift sets India", "ORGO FARM curations", "self care gift hamper", "natural skincare bundle"],
};

export default function Collections() {
  return (
    <>
<section className="paper border-b border-border">
        <div className="mx-auto max-w-[1280px] px-4 py-14 md:px-8 md:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow text-accent">Collections</p>
            <h1 className="mt-3 text-5xl text-primary md:text-6xl">ORGO FARM Curations</h1>
            <p className="mt-4 max-w-lg text-sm text-muted-foreground">
              All products are handcrafted with 100% natural, farm-fresh ingredients. No parabens. No artificial
              fragrances.
            </p>
          </div>
          {/* Tier photos — user-uploaded Bronze / Silver / Gold curation shots */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { src: img.curationBronze, label: "Bronze" },
              { src: img.curationSilver, label: "Silver" },
              { src: img.curationGold, label: "Gold" },
            ].map((t) => (
              <figure key={t.label} className="group relative overflow-hidden soft-shadow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.src}
                  alt={`ORGO FARM ${t.label} curation gift set`}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <figcaption className="absolute bottom-3 left-3 bg-background/85 px-3 py-1.5 font-display text-lg text-primary backdrop-blur-sm">
                  {t.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <Curations />
    </>
  );
}