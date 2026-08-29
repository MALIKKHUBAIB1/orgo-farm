"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Leaf, HandHeart, Sparkles, Sprout } from "lucide-react";
import { img } from "@/lib/orgo/products";

const trust = [
  { icon: Leaf, label: "100% Natural" },
  { icon: HandHeart, label: "Handcrafted" },
  { icon: Sparkles, label: "No Harsh Chemicals" },
  { icon: Sprout, label: "Farm To Skin" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden paper">
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-4 pb-16 pt-14 md:px-8 md:pb-24 md:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-script text-3xl text-rose">Handcrafted with Love</p>
          <h1 className="mt-4 text-5xl leading-[1.05] text-primary md:text-7xl">
            Pure Care.
            <br />
            Straight From Nature.
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
            Premium handmade skincare crafted with natural, farm-fresh ingredients and brought directly from the farm
            to your skin.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="bg-primary px-9 py-4 text-[11px] tracking-[0.24em] text-primary-foreground transition-opacity hover:opacity-90"
            >
              SHOP NOW
            </Link>
            <Link
              href="/collections"
              className="border border-primary px-9 py-4 text-[11px] tracking-[0.24em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
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
          <div className="absolute -left-10 top-10 hidden size-56 rounded-full bg-beige/70 blur-3xl md:block" />
          <img
            src={img.collection}
            alt="ORGO FARM handmade botanical soap collection with rose petals and lemons"
            className="relative aspect-[4/5] w-full rounded-t-[999px] object-cover soft-shadow"
          />
          <img
            src={img.facePack}
            alt="ORGO FARM Signature Face Pack pouch"
            className="absolute -bottom-6 -left-6 hidden w-40 rounded-sm object-cover lift-shadow md:block lg:w-48"
          />
        </motion.div>
      </div>

      <div className="border-y border-border bg-card/60">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-6 px-4 py-7 md:grid-cols-4 md:px-8">
          {trust.map((t) => (
            <div key={t.label} className="flex items-center gap-3">
              <t.icon className="size-5 text-accent" strokeWidth={1.3} />
              <span className="text-[11px] tracking-[0.18em] text-foreground/80">{t.label.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
