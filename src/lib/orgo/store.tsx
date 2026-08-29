"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { apiFetch } from "@/lib/orgo/api";
import { getSessionKey } from "@/lib/orgo/session";
import { getToken } from "@/lib/orgo/token";

export type CartLine = { slug: string; qty: number };
export type Order = {
  id: string;
  lines: CartLine[];
  total: number;
  name: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  shipping: "standard" | "fast";
  payment: string;
  placedAt: string;
};

type ShopState = {
  cart: CartLine[];
  wishlist: string[];
  lastOrder: Order | null;
  addToCart: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string) => void;
  removeWishlist: (slug: string) => void;
  placeOrder: (o: Order) => void;
  count: number;
};

const Ctx = createContext<ShopState | null>(null);
const ORDER_KEY = "orgo-last-order-v1";

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const sessionRef = useRef<string | null>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const raw = window.localStorage.getItem(ORDER_KEY);
      if (raw) setLastOrder(JSON.parse(raw));
    } catch {
      /* ignore */
    }

    const reload = async () => {
      let key = getSessionKey();
      if (getToken()) {
        try {
          const me = await apiFetch<{ shopKey: string }>("/api/auth/me");
          if (me.shopKey) key = me.shopKey;
        } catch {
          /* fall back to anonymous key */
        }
      }
      sessionRef.current = key;
      try {
        const d = await apiFetch<{ items: CartLine[]; wishlist: string[] }>(
          `/api/shop/${encodeURIComponent(key)}`,
        );
        setCart(Array.isArray(d.items) ? d.items : []);
        setWishlist(Array.isArray(d.wishlist) ? d.wishlist : []);
      } catch {
        /* offline: keep current state */
      }
    };

    reload();
    window.addEventListener("orgo-auth-changed", reload);
    return () => window.removeEventListener("orgo-auth-changed", reload);
  }, []);

  const sync = (body: Record<string, unknown>) => {
    const key = sessionRef.current;
    if (!key) return;
    apiFetch(`/api/shop/${encodeURIComponent(key)}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).catch(() => {});
  };

  const value = useMemo<ShopState>(
    () => ({
      cart,
      wishlist,
      lastOrder,
      count: cart.reduce((s, l) => s + l.qty, 0),
      addToCart: (slug, qty = 1) => {
        setCart((c) =>
          c.some((l) => l.slug === slug)
            ? c.map((l) => (l.slug === slug ? { ...l, qty: l.qty + qty } : l))
            : [...c, { slug, qty }],
        );
        sync({ op: "add", slug, qty });
      },
      setQty: (slug, qty) => {
        setCart((c) => c.map((l) => (l.slug === slug ? { ...l, qty: Math.max(1, qty) } : l)));
        sync({ op: "setQty", slug, qty });
      },
      removeFromCart: (slug) => {
        setCart((c) => c.filter((l) => l.slug !== slug));
        sync({ op: "remove", slug });
      },
      clearCart: () => {
        setCart([]);
        sync({ op: "clearCart" });
      },
      toggleWishlist: (slug) => {
        setWishlist((w) => (w.includes(slug) ? w.filter((s) => s !== slug) : [...w, slug]));
        sync({ op: "toggleWishlist", slug });
      },
      removeWishlist: (slug) => {
        setWishlist((w) => w.filter((s) => s !== slug));
        sync({ op: "removeWishlist", slug });
      },
      placeOrder: (o) => {
        setLastOrder(o);
        try {
          window.localStorage.setItem(ORDER_KEY, JSON.stringify(o));
        } catch {
          /* ignore */
        }
      },
    }),
    [cart, wishlist, lastOrder],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useShop() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
}
