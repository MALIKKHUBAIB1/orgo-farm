import type { Product } from "./products";

export type Dimension = {
  slug: string;
  label: string;
  products: Product[];
};

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function concernSlug(label: string): string {
  return slugify(label);
}

const concernTips: Record<string, string> = {
  acne: "fights acne and blemishes for clearer, calmer skin",
  tan: "gently fades sun tan and evens out your natural skin tone",
  dullness: "awakens dull skin and brings back a fresh, natural glow",
  "dry-skin": "nourishes, replenishes and comforts dry skin",
  pigmentation: "helps reduce the appearance of pigmentation and dark spots",
};

export function concernTip(slug: string): string {
  return concernTips[slug] ?? "supports healthier, naturally radiant skin";
}

export function collectConcerns(products: Product[]): Dimension[] {
  const map = new Map<string, Dimension>();
  for (const p of products) {
    for (const c of p.concerns ?? []) {
      const s = concernSlug(c);
      if (!s) continue;
      const d = map.get(s) ?? { slug: s, label: c, products: [] };
      d.products.push(p);
      map.set(s, d);
    }
  }
  return [...map.values()];
}

export function collectTypes(products: Product[]): Dimension[] {
  const map = new Map<string, Dimension>();
  for (const p of products) {
    const s = slugify(p.type);
    if (!s) continue;
    const d = map.get(s) ?? { slug: s, label: p.type, products: [] };
    d.products.push(p);
    map.set(s, d);
  }
  return [...map.values()];
}

export function collectCategories(products: Product[]): Dimension[] {
  const map = new Map<string, Dimension>();
  for (const p of products) {
    const s = slugify(p.category);
    if (!s) continue;
    const d = map.get(s) ?? { slug: s, label: p.category, products: [] };
    d.products.push(p);
    map.set(s, d);
  }
  return [...map.values()];
}

export function findDimension(dims: Dimension[], slug: string): Dimension | undefined {
  return dims.find((d) => d.slug === slug);
}

export function concernIntro(d: Dimension): string {
  const names = d.products.map((p) => p.name);
  return `Handcrafted in small batches with farm-fresh, 100% natural ingredients, our ${d.label.toLowerCase()} care picks ${concernTip(
    d.slug,
  )}. Explore ${names.join(", ")} — no parabens, no artificial fragrances, just honest natural skincare.`;
}

export function dimensionIntro(d: Dimension): string {
  const names = d.products.map((p) => p.name).join(", ");
  return `Handcrafted in small batches with farm-fresh, 100% natural ingredients, our ${d.label.toLowerCase()} range includes ${names}. No parabens, no artificial fragrances — made with care, made for everyday.`;
}