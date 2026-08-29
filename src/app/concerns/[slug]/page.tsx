import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/orgo/api";
import { products as fallbackProducts } from "@/lib/orgo/products";
import {
  collectConcerns,
  concernIntro,
  concernTip,
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
    name: `${d.label} Care`,
    itemListElement: d.products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `${SITE_URL}/product/${p.slug}`,
    })),
  };
}

export async function generateStaticParams() {
  return collectConcerns(fallbackProducts).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const products = await loadProducts();
  const d = findDimension(collectConcerns(products), slug);

  if (!d) {
    return {
      title: "Concern not found — ORGO FARM",
      robots: { index: false },
    };
  }

  const t = `${d.label} Care — Handmade Natural Skincare | ORGO FARM`;
  const desc = concernIntro(d);
  const image = d.products[0]?.image;

  return {
    title: t,
    description: desc,
    alternates: { canonical: `${SITE_URL}/concerns/${d.slug}` },
    keywords: [`${d.label.toLowerCase()} care`, `${d.label} skincare`, "natural remedies", "ORGO FARM", "skincare India"],
    openGraph: {
      title: t,
      description: desc,
      url: `${SITE_URL}/concerns/${d.slug}`,
      siteName: "ORGO FARM",
      locale: "en_IN",
      type: "website",
      images: image ? [{ url: image, alt: d.label }] : undefined,
    },
    twitter: { card: "summary_large_image", title: t, description: desc, images: image ? [image] : undefined },
  };
}

export default async function ConcernPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await loadProducts();
  const all = collectConcerns(products);
  const d = findDimension(all, slug);
  if (!d) notFound();

  const links = all
    .filter((x) => x.slug !== d.slug)
    .map((x) => ({ href: `/concerns/${x.slug}`, label: x.label }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd(d)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(dimensionFaqJsonLd("concern", d.label, concernIntro(d))),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Shop", url: `${SITE_URL}/shop` },
            { name: `${d.label} Care`, url: `${SITE_URL}/concerns/${d.slug}` },
          ])),
        }}
      />
      <LandingView
        kicker="Shop by Concern"
        title={`${d.label} Care`}
        subtitle={`Natural, handmade remedies for ${d.label.toLowerCase()} — farm-fresh, chemical-free.`}
        intro={`${concernIntro(d)} ${concernTip(d.slug)}.`}
        products={d.products}
        links={links}
        waMessage={`Hello ORGO FARM! I need ${d.label.toLowerCase()} care products. Please recommend the right one for my skin.`}
      />
    </>
  );
}