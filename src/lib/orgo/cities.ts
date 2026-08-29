import raw from "@/data/cities.json";

export type City = { name: string; state: string };

export const COUNTRY = { slug: "india", name: "India", state: "" };

export const cities: City[] = (raw as (string | City)[]).map((c) =>
  typeof c === "string" ? { name: c, state: "" } : { name: c.name, state: c.state ?? "" },
);

export function citySlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function findCity(slug: string): City | null {
  if (slug === COUNTRY.slug) return { ...COUNTRY, name: COUNTRY.name };
  return cities.find((c) => citySlug(c.name) === slug) ?? null;
}

export function cityName(slug: string): string {
  const c = findCity(slug);
  return c ? c.name : slug;
}