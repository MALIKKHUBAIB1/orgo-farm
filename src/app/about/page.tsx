import type { Metadata } from "next";
import { img } from "@/lib/orgo/products";
import { Reveal, SectionHeading } from "@/components/orgo/Reveal";
import { Why } from "@/components/orgo/home/Why";
import { Ingredients } from "@/components/orgo/home/Ingredients";

export const metadata: Metadata = {
  title: "Our Story — From Our Farm To Your Skin | ORGO FARM",
  description:
    "The story behind ORGO FARM: an Indian organic skincare brand handcrafting products with farm-fresh ingredients, no parabens and no artificial fragrances.",
  alternates: { canonical: "/about" },
  keywords: ["about ORGO FARM", "organic skincare brand India", "handmade skincare story", "farm fresh skincare"],
};

const blocks = [
  {
    heading: "Our Story",
    text: "ORGO FARM began with a simple belief — that skincare should be honest. What started as small handcrafted batches for family and friends grew into a brand built on natural, farm-fresh ingredients.",
    image: img.collection,
  },
  {
    heading: "Our Process",
    text: "Every bar is poured, cured and wrapped by hand. Small batches let us control quality at every step, from sourcing botanicals to the final label on each pack.",
    image: img.barsPackaged,
  },
  {
    heading: "Why We Care",
    text: "Skin is not a trend. We make products we use ourselves — free from parabens and artificial fragrances, and made with love, from nature.",
    image: img.roseBar,
  },
];

export default function About() {
  return (
    <>
      <section className="paper border-b border-border">
        <div className="mx-auto max-w-[1280px] px-4 py-16 text-center md:px-8 md:py-24">
          <p className="font-script text-3xl text-rose">Handcrafted with Love</p>
          <h1 className="mt-4 text-5xl text-primary md:text-7xl">From Our Farm To Your Skin</h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            We believe in doing everything with absolute perfection. Bringing premium organic care directly from the
            farm to your skin.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] space-y-20 px-4 py-20 md:px-8 md:py-28">
        {blocks.map((b, i) => (
          <Reveal key={b.heading}>
            <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${i % 2 ? "lg:[direction:rtl]" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={b.image}
                alt={b.heading}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover soft-shadow"
              />
              <div className="lg:[direction:ltr]">
                <h2 className="text-4xl text-primary md:text-5xl">{b.heading}</h2>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground md:text-base">{b.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="paper border-y border-border">
        <div className="mx-auto max-w-[1280px] px-4 py-20 md:px-8 md:py-24">
          <SectionHeading
            eyebrow="Our Philosophy"
            title="Nature, Crafted With Perfection."
            subtitle="From selecting natural ingredients to carefully crafting every product, ORGO FARM brings premium organic care directly from the farm to your skin."
          />
        </div>
      </section>

      <Ingredients />
      <Why />
    </>
  );
}
