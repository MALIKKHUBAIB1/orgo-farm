import type { Metadata } from "next";
import { HowToUse as HowToUseSection } from "@/components/orgo/home/HowToUse";
import { img } from "@/lib/orgo/products";

export const metadata: Metadata = {
  title: "How To Use The ORGO FARM Face Pack — 6 Easy Steps",
  description:
    "A step-by-step guide to using the ORGO FARM Face Pack for brightening and tightening skin, plus tips for best results.",
  alternates: { canonical: "/how-to-use" },
  keywords: ["face pack how to use", "face mask steps", "ORGO FARM face pack", "skin brightening guide"],
};

export default function HowToUsePage() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-14 md:px-8 md:py-20">
      <h1 className="text-5xl text-primary md:text-6xl">How To Use</h1>
      <p className="mt-4 max-w-xl text-sm text-muted-foreground">
        Orgo Farm Face Pack — for brightening &amp; tightening skin.
      </p>
      <img
        src={img.howToUse}
        alt="ORGO FARM face pack how-to-use guide"
        className="mt-10 w-full object-cover soft-shadow"
      />
      {/* The guide image above already shows the 6 steps, so heading + steps are hidden below. */}
      <HowToUseSection hideSteps />
    </section>
  );
}
