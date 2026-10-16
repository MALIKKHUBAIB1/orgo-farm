import type { MetadataRoute } from "next";
import { API_URL, SITE_URL } from "@/lib/orgo/api";
import { products as fallbackProducts, type Product } from "@/lib/orgo/products";
import { collectCategories, collectConcerns, collectTypes } from "@/lib/orgo/seo";
import { cities, citySlug, COUNTRY } from "@/lib/orgo/cities";

export const revalidate = 3600;

function absoluteImage(p: Product): string | undefined {
  const raw = p.image || p.gallery?.[0] || "";
  if (!raw) return undefined;
  if (raw.startsWith("http")) return raw;
  if (raw.startsWith("/uploads/")) return `${API_URL}${raw}`;
  return raw;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: Product[] = fallbackProducts;
  try {
    const res = await fetch(`${API_URL}/api/products`, { cache: "no-store" });
    if (res.ok) products = (await res.json()) as Product[];
  } catch {
    // backend offline -> fallback catalogue
  }

  const base = SITE_URL;
  const now = new Date();

  const statics: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/collections`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/instagram`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/how-to-use`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((p) => {
    const img = absoluteImage(p);
    return {
      url: `${base}/product/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
      images: img ? [img] : undefined,
    };
  });

  const concernPages: MetadataRoute.Sitemap = collectConcerns(products).map((d) => ({
    url: `${base}/concerns/${d.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const typePages: MetadataRoute.Sitemap = collectTypes(products).map((d) => ({
    url: `${base}/type/${d.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryPages: MetadataRoute.Sitemap = collectCategories(products).map((d) => ({
    url: `${base}/category/${d.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const cityPages: MetadataRoute.Sitemap = products.flatMap(
    (p): MetadataRoute.Sitemap => [
      {
        url: `${base}/product/${p.slug}/${COUNTRY.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      },
      ...cities.map(
        (c): MetadataRoute.Sitemap[number] => ({
          url: `${base}/product/${p.slug}/${citySlug(c.name)}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7,
        }),
      ),
    ],
  );

  // Blog posts from Sanity (falls back to empty — statics already cover /blog).
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
    if (projectId) {
      const q = encodeURIComponent(
        `*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`,
      );
      const res = await fetch(
        `https://${projectId}.apicdn.sanity.io/v2025-01-01/data/query/${dataset}?query=${q}`,
        { next: { revalidate: 3600 } },
      );
      if (res.ok) {
        const json = (await res.json()) as { result: { slug: string }[] };
        const hidden = new Set(["india-s-political-landscape-in-2026-key-issues-shaping-public-debate"]);
        blogPages = (json.result ?? [])
          .filter((r) => r.slug && !hidden.has(r.slug))
          .map((r) => ({
            url: `${base}/blog/${r.slug}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.7,
          }));
      }
    }
  } catch {
    // sitemap without blog detail pages
  }

  return [...statics, ...productPages, ...concernPages, ...typePages, ...categoryPages, ...cityPages, ...blogPages];
}