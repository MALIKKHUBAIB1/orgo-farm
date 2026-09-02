import { apiFetch } from "./api";

export type HeroSettings = {
  heroImage: string;
  overlayImage: string;
  tagline: string;
  title: string;
  subtitle: string;
};

export async function getHeroSettings(): Promise<HeroSettings | null> {
  try {
    const data = await apiFetch<{ settings: HeroSettings | null }>("/api/hero-settings");
    return data.settings;
  } catch {
    return null;
  }
}