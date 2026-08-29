"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiFetch } from "./api";
import {
  curations as fallbackCurations,
  products as fallbackProducts,
  type Curation,
  type Product,
} from "./products";

type Catalog = {
  products: Product[];
  curations: Curation[];
  ready: boolean;
};

const CatalogContext = createContext<Catalog>({
  products: fallbackProducts,
  curations: fallbackCurations,
  ready: false,
});

export function refreshCatalog() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("orgo-catalog-changed"));
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<Catalog>({
    products: fallbackProducts,
    curations: fallbackCurations,
    ready: false,
  });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [products, curations] = await Promise.all([
          apiFetch<Product[]>("/api/products"),
          apiFetch<Curation[]>("/api/curations"),
        ]);
        if (!cancelled) setCatalog({ products, curations, ready: true });
      } catch {
        if (!cancelled) setCatalog((cur) => ({ ...cur, ready: true }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [version]);

  useEffect(() => {
    const bump = () => setVersion((v) => v + 1);
    window.addEventListener("orgo-catalog-changed", bump);
    return () => window.removeEventListener("orgo-catalog-changed", bump);
  }, []);

  return <CatalogContext.Provider value={catalog}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}

export function useProduct(slug?: string) {
  const { products } = useCatalog();
  if (!slug) return undefined;
  return products.find((p) => p.slug === slug);
}