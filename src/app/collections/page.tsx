import type { Metadata } from "next";
import { Curations } from "@/components/orgo/home/Curations";
import { img } from "@/lib/orgo/products";

export const metadata: Metadata = {
  title: "Curated Wellness Sets — ORGO FARM",
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img.curationTiers} alt="ORGO FARM curation tiers" className="mt-10 w-full object-cover soft-shadow" />
        </div>
      </section>
      <Curations />
    </>
  );
}