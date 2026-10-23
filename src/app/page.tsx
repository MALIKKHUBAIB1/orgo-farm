import type { Metadata } from "next";
import { Hero } from "@/components/orgo/home/Hero";
import { Marquee } from "@/components/orgo/home/Marquee";
import { Favorites } from "@/components/orgo/home/Favorites";
import { SoapSpotlight } from "@/components/orgo/home/SoapSpotlight";
import { Curations } from "@/components/orgo/home/Curations";
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
  keywords: [
    "handmade organic skincare India",
    "natural skincare products India",
    "organic face pack India",
    "coffee scrub bar",
    "rose scrub bar",
    "lemon scrub bar",
    "tan removal skincare",
    "paraben free skincare",
    "farm fresh skincare",
    "ORGO FARM",
  ],
};

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Favorites />
      <SoapSpotlight />
      <Curations />
      <Why />
      <Ingredients />
      <HowToUse />
      <Social />
      <Reviews />
      <Newsletter />
    </>
  );
}
