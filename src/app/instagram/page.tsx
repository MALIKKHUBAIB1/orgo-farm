import type { Metadata } from "next";
import { InstagramView } from "./view";

export const metadata: Metadata = {
  title: "Instagram Videos | ORGO FARM",
  description:
    "Watch ORGO FARM product videos, skincare rituals and behind-the-scenes moments from our farm on Instagram.",
  alternates: { canonical: "/instagram" },
  keywords: ["ORGO FARM Instagram", "skincare videos", "behind the scenes skincare", "natural skincare reels"],
};

export default function InstagramPage() {
  return <InstagramView />;
}