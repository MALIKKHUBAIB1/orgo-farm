import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/orgo/api";
import { products as fallbackProducts } from "@/lib/orgo/products";
import {
  collectCategories,
  dimensionIntro,
  findDimension,
  type Dimension,
} from "@/lib/orgo/seo";
import { loadProducts } from "@/lib/orgo/catalog-server";
import { dimensionFaqJsonLd, breadcrumbJsonLd } from "@/lib/orgo/schema";
import { LandingView } from "@/components/orgo/LandingView";

function itemListJsonLd(d: Dimension) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: d.label,
    itemListElement: d.products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `${SITE_URL}/product/${p.slug}`,
    })),
  };
}

export async function generateStaticParams() {
  return collectCategories(fallbackProducts).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const products = await loadProducts();
  const d = findDimension(collectCategories(products), slug);

  if (!d) {
    return {
      title: "Category not found — ORGO FARM",
      robots: { index: false },
    };
  }

  const t = `${d.label} — ORGO FARM`;
  const desc = dimensionIntro(d);
  const image = d.products[0]?.image;

  return {
    title: t,
    description: desc,
    alternates: { canonical: `${SITE_URL}/category/${d.slug}` },
    keywords: [`${d.label.toLowerCase()} products`, "natural skincare", "ORGO FARM", "India"],
    openGraph: {
      title: t,
      description: desc,
      url: `${SITE_URL}/category/${d.slug}`,
      siteName: "ORGO FARM",
      locale: "en_IN",
      type: "website",
      images: image ? [{ url: image, alt: d.label }] : undefined,
    },
    twitter: { card: "summary_large_image", title: t, description: desc, images: image ? [image] : undefined },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await loadProducts();
  const all = collectCategories(products);
  const d = findDimension(all, slug);
  if (!d) notFound();

  const links = all
    .filter((x) => x.slug !== d.slug)
    .map((x) => ({ href: `/category/${x.slug}`, label: x.label }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd(d)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(dimensionFaqJsonLd("category", d.label, dimensionIntro(d))),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Shop", url: `${SITE_URL}/shop` },
            { name: d.label, url: `${SITE_URL}/category/${d.slug}` },
          ])),
        }}
      />
      <LandingView
        kicker="Shop by Category"
        title={`${d.label} Products`}
        subtitle={`Handcrafted ${d.label.toLowerCase()} products for everyday natural care — farm-fresh, chemical-free.`}
        intro={dimensionIntro(d)}
        products={d.products}
        links={links}
        waMessage={`Hello ORGO FARM! I'd like to know more about your ${d.label.toLowerCase()} products. Please help me choose.`}
      />
    </>
  );
}