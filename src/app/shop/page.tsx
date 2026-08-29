import type { Metadata } from "next";
import { apiGet } from "@/lib/orgo/api";
import { products as fallbackProducts, type Product } from "@/lib/orgo/products";
import { ShopView } from "./view";

export const metadata: Metadata = {
  title: "Shop Natural Skincare — ORGO FARM",
  description:
    "Shop ORGO FARM handmade skincare: signature face pack, lemon, rose and D-Tan coffee scrub bars. Free standard shipping across India.",
  alternates: { canonical: "/shop" },
  keywords: ["buy natural skincare India", "face mask online", "scrub bars", "handmade soap", "ORGO FARM shop"],
};

export default async function ShopPage() {
  const products = await apiGet<Product[]>("/api/products", fallbackProducts);
  return <ShopView products={products} />;
}
