import type { Metadata } from "next";
import { Hero } from "@/components/orgo/home/Hero";
import { Favorites } from "@/components/orgo/home/Favorites";
import { Curations } from "@/components/orgo/home/Curations";
import { Philosophy } from "@/components/orgo/home/Philosophy";
import { Why } from "@/components/orgo/home/Why";
import { Ingredients } from "@/components/orgo/home/Ingredients";
import { HowToUse } from "@/components/orgo/home/HowToUse";
import { Social } from "@/components/orgo/home/Social";
import { Reviews } from "@/components/orgo/home/Reviews";
import { Newsletter } from "@/components/orgo/home/Newsletter";

export const metadata: Metadata = {
  title: "ORGO FARM — Pure & Natural Handmade Skincare",
  description:
    "Handmade organic skincare from ORGO FARM: face packs, rose, lemon and coffee scrub bars crafted with farm-fresh ingredients. No parabens, no artificial fragrances.",
  alternates: { canonical: "/" },
  keywords: ["organic skincare India", "handmade face pack", "natural skincare", "tan removal", "ORGO FARM"],
};

export default function Home() {
  return (
    <>
      <Hero />
      <Favorites />
      <Curations />
      <Philosophy />
      <Why />
      <Ingredients />
      <HowToUse />
      <Social />
      <Reviews />
      <Newsletter />
    </>
  );
}
