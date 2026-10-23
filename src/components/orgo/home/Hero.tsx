"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Leaf, Sparkles } from "lucide-react";
import { img } from "@/lib/orgo/products";
import { useCatalog } from "@/lib/orgo/catalog";

export function Hero() {
  const { hero } = useCatalog();
  const overlayImage = hero?.overlayImage || img.facePack;
  const tagline = hero?.tagline || "Handcrafted with Love";
  const title = hero?.title || "Pure Care. Straight From Nature.";
  const subtitle =
    hero?.subtitle ||
    "Premium handmade skincare crafted with natural, farm-fresh ingredients and brought directly from the farm to your skin.";
  const [titleA, ...titleRest] = title.split("<br>");
  return (
    <section className="relative overflow-hidden paper">
      {/* Drifting botanical accents — subtle, premium, alive */}
      <Leaf className="pointer-events-none absolute left-[6%] top-[22%] hidden size-5 animate-float-slow text-sage/40 md:block" />
      <Leaf className="pointer-events-none absolute left-[42%] top-[12%] hidden size-3.5 animate-float-slower text-rose/35 md:block" />
      <Leaf className="pointer-events-none absolute bottom-[18%] left-[12%] hidden size-4 animate-float-slower text-gold/45 md:block" />
      <Sparkles className="pointer-events-none absolute right-[6%] top-[16%] hidden size-4 animate-float-slow text-gold/50 lg:block" />

      <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-4 pb-16 pt-14 md:px-8 md:pb-24 md:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-script text-3xl text-rose">{tagline}</p>
          <h1 className="mt-4 text-5xl leading-[1.05] text-primary md:text-7xl">
            {titleA}
            <br />
            {titleRest.join("<br>")}
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
            {subtitle}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 bg-primary px-9 py-4 text-[11px] tracking-[0.24em] text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:lift-shadow"
            >
              SHOP NOW
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/collections"
              className="border border-primary px-9 py-4 text-[11px] tracking-[0.24em] text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
            >
              EXPLORE CURATIONS
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute -left-10 top-10 hidden size-56 animate-float-slow rounded-full bg-beige/70 blur-3xl md:block" />
          <div className="absolute -right-12 bottom-24 hidden size-64 animate-float-slower rounded-full bg-rose/15 blur-3xl md:block" />
          <img
            src={img.soapCollection}
            alt="ORGO FARM natural handmade soap collection"
            className="relative aspect-[4/5] w-full animate-kenburns rounded-t-[999px] object-cover soft-shadow"
          />
          <motion.img
            src={overlayImage}
            alt="ORGO FARM Signature Face Pack pouch"
            className="absolute -bottom-6 -left-6 hidden w-40 rounded-sm object-cover lift-shadow md:block lg:w-48"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
