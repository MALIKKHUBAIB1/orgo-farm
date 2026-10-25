import type { Metadata } from "next";
import { apiGet } from "@/lib/orgo/api";
import { products as fallbackProducts, type Product } from "@/lib/orgo/products";
import { ShopView } from "./view";

export const metadata: Metadata = {
  title: "Buy Handmade Organic Skincare Online in India | ORGO FARM",
  description:
    "Shop ORGO FARM handmade skincare: signature face pack, lemon, rose and D-Tan coffee scrub bars. Free standard shipping across India.",
  alternates: { canonical: "/shop" },
  keywords: ["buy natural skincare India", "face mask online", "scrub bars", "handmade soap", "ORGO FARM shop"],
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category } = await searchParams;
  const initialCategory = typeof category === "string" && category ? category : null;
  const products = await apiGet<Product[]>("/api/products", fallbackProducts);
  return (
    <ShopView
      key={initialCategory ?? "all"}
      products={products}
      initialCategory={initialCategory}
    />
  );
}
