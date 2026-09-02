import type { Metadata } from "next";
import { WishlistView } from "./view";

export const metadata: Metadata = {
  title: "Your Natural Wishlist — ORGO FARM",
  description: "Save your favourite ORGO FARM handmade skincare products for later.",
  alternates: { canonical: "/wishlist" },
  robots: { index: false, follow: false },
  keywords: ["ORGO FARM wishlist", "save natural skincare products", "handmade skincare favourites"],
};

export default function WishlistPage() {
  return <WishlistView />;
}