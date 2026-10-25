import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { apiGet, API_URL, SITE_URL } from "@/lib/orgo/api";
import { displayProductImage, findProduct, products as fallbackProducts, type Product } from "@/lib/orgo/products";
import { productFaqJsonLd, productJsonLd, breadcrumbJsonLd } from "@/lib/orgo/schema";
import { ProductView } from "./view";

type ReviewRow = { rating: number };

async function loadReviews(slug: string): Promise<ReviewRow[]> {
  try {
    const res = await fetch(`${API_URL}/api/reviews/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: unknown = await res.json();
    return Array.isArray(data) ? (data as ReviewRow[]) : [];
  } catch {
    return [];
  }
}

async function loadProduct(slug: string): Promise<Product | null> {
  return apiGet<Product | null>(`/api/products/${encodeURIComponent(slug)}`, findProduct(slug) ?? null);
}

function productImage(product: Product): string {
  const raw = displayProductImage(product) || product.gallery?.[0] || "";
  if (raw.startsWith("http")) return raw;
  if (raw.startsWith("/uploads/")) return `${API_URL}${raw}`;
  return raw;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProduct(slug);

  if (!product) {
    return {
      title: "Product not found — ORGO FARM",
      robots: { index: false },
    };
  }

  const t = `${product.name} — ORGO FARM`;
  const url = `${SITE_URL}/product/${product.slug}`;
  const ogImage = productImage(product);

  return {
    title: t,
    description: product.short || product.description,
    alternates: { canonical: url },
    keywords: [product.name, product.category, ...product.concerns, "natural skincare", "ORGO FARM", "buy online India"],
    openGraph: {
      title: t,
      description: product.short || product.description,
      url,
      siteName: "ORGO FARM",
      locale: "en_IN",
      type: "website",
      images: ogImage ? [{ url: ogImage, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: t,
      description: product.short || product.description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, all, reviewRows] = await Promise.all([
    loadProduct(slug),
    apiGet<Product[]>("/api/products", fallbackProducts),
    loadReviews(slug),
  ]);
  if (!product) notFound();
  const related = all.filter((p) => p.slug !== product.slug);
  const url = `${SITE_URL}/product/${slug}`;
  const validRatings = reviewRows
    .map((r) => r.rating)
    .filter((n) => Number.isFinite(n) && n >= 1 && n <= 5);
  const aggregate =
    validRatings.length > 0
      ? {
          ratingValue: Math.round((validRatings.reduce((s, n) => s + n, 0) / validRatings.length) * 10) / 10,
          reviewCount: validRatings.length,
        }
      : undefined;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product, url, undefined, aggregate)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productFaqJsonLd(product)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: `${SITE_URL}/` },
              { name: "Shop", url: `${SITE_URL}/shop` },
              { name: product.name, url },
            ]),
          ),
        }}
      />
      <ProductView product={product} related={related} />
    </>
  );
}