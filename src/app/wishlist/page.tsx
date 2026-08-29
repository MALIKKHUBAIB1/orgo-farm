import type { Metadata } from "next";
import { WishlistView } from "./view";

export const metadata: Metadata = {
  title: "Your Natural Wishlist — ORGO FARM",
  description: "Save your favourite ORGO FARM handmade skincare products for later.",
};

export default function WishlistPage() {
  return <WishlistView />;
}