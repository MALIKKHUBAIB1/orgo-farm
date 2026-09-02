import { apiFetch } from "./api";

export type PriceBucket = {
  label: string;
  min: number;
  max: number | null;
};

export type ShopSettings = {
  categories: string[];
  concerns: string[];
  priceBuckets: PriceBucket[];
  sorts: string[];
  inStockLabel: string;
};

const EMPTY: ShopSettings = {
  categories: [],
  concerns: [],
  priceBuckets: [],
  sorts: [],
  inStockLabel: "In stock only",
};

export async function getShopSettings(): Promise<ShopSettings | null> {
  try {
    const data = await apiFetch<{ settings: ShopSettings | null }>("/api/shop-settings");
    return data.settings;
  } catch {
    return null;
  }
}

export const emptySettings = EMPTY;