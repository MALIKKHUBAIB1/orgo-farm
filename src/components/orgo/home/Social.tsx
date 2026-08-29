"use client";

import Link from "next/link";
import { img } from "@/lib/orgo/products";
import { Reveal, SectionHeading } from "@/components/orgo/Reveal";

const grid = [img.collection, img.roseBar, img.lemonBar, img.facePack, img.barsPackaged, img.lid];

export function Social() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-20 md:px-8 md:py-28">
      <SectionHeading eyebrow="@orgo.farm_" title="Follow Our Natural Journey" />
      <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-6">
        {grid.map((src, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <img
              src={src}
              alt="ORGO FARM product and lifestyle photography"
              loading="lazy"
              className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
            />
          </Reveal>
        ))}
      </div>
      <div className="mt-10 flex flex-col items-center gap-3">
        <a
          href="https://instagram.com/orgo.farm_"
          target="_blank"
          rel="noreferrer"
          className="inline-block border border-primary px-9 py-4 text-[11px] tracking-[0.22em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          FOLLOW US ON INSTAGRAM
        </a>
        <Link
          href="/instagram"
          className="text-[10px] tracking-[0.2em] text-primary underline underline-offset-4"
        >
          WATCH OUR VIDEO GALLERY
        </Link>
      </div>
    </section>
  );
}
