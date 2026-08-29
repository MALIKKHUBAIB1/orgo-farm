import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/orgo/api";
import { apiGet } from "@/lib/orgo/api";
import { findProduct, products as fallbackProducts, type Product } from "@/lib/orgo/products";
import { COUNTRY, findCity } from "@/lib/orgo/cities";
import { productFaqJsonLd, productJsonLd, breadcrumbJsonLd } from "@/lib/orgo/schema";
import { ProductView } from "../view";

async function loadProduct(slug: string): Promise<Product | null> {
  return apiGet<Product | null>(`/api/products/${encodeURIComponent(slug)}`, findProduct(slug) ?? null);
}

function productImage(p: Product): string | undefined {
  const raw = p.image || p.gallery?.[0] || "";
  if (!raw) return undefined;
  return raw.startsWith("http") || raw.startsWith("/uploads/") ? raw : raw;
}

export async function generateStaticParams() {
  return fallbackProducts.map((p) => ({ slug: p.slug, city: COUNTRY.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; city: string }>;
}): Promise<Metadata> {
  const { slug, city } = await params;
  const [product] = await Promise.all([loadProduct(slug)]);
  const c = findCity(city);

  if (!product || !c) {
    return { title: "Not found — ORGO FARM", robots: { index: false } };
  }

  const isCountry = city === COUNTRY.slug;
  const t = `Buy ${product.name} ${isCountry ? "Across India" : `in ${c.name}`} at ₹${product.price} | ORGO FARM`;
  const desc = `Buy ${product.name} (${product.size}) at ₹${product.price} ${
    isCountry ? "online across India" : `online in ${c.name}${c.state ? `, ${c.state}` : ""}`
  }. Handcrafted, 100% natural skincare — free shipping pan-India.`;
  const url = `${SITE_URL}/product/${slug}/${city}`;
  const image = productImage(product);

  return {
    title: t,
    description: desc,
    alternates: { canonical: url },
    keywords: [
      `buy ${product.name} in ${c.name}`,
      `${product.name} ${c.name}`,
      "natural skincare India",
      "ORGO FARM",
    ],
    openGraph: {
      title: t,
      description: desc,
      url,
      siteName: "ORGO FARM",
      locale: "en_IN",
      type: "website",
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    twitter: { card: "summary_large_image", title: t, description: desc, images: image ? [image] : undefined },
  };
}

export default async function CityProductPage({
  params,
}: {
  params: Promise<{ slug: string; city: string }>;
}) {
  const { slug, city } = await params;
  const [product, all] = await Promise.all([
    loadProduct(slug),
    apiGet<Product[]>("/api/products", fallbackProducts),
  ]);
  const c = findCity(city);
  if (!product || !c) notFound();

  const isCountry = city === COUNTRY.slug;
  const related = all.filter((p) => p.slug !== product.slug).slice(0, 4);

  const url = `${SITE_URL}/product/${slug}/${city}`;
  const areaServed = isCountry
    ? { "@type": "Country", name: "India" }
    : { "@type": "City", name: c.name };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product, url, areaServed)) }}
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
              { name: product.name, url: `${SITE_URL}/product/${slug}` },
              { name: c.name, url },
            ]),
          ),
        }}
      />
      <ProductView product={product} related={related} />
    </>
  );
}