"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Heart, Home, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { img, inr, type Product } from "@/lib/orgo/products";
import { resolveImage } from "@/lib/orgo/image";
import { useShop } from "@/lib/orgo/store";

const nav = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Collections", to: "/collections" },
  { label: "Our Story", to: "/about" },
  { label: "How To Use", to: "/how-to-use" },
  { label: "Contact", to: "/contact" },
] as const;

const messages = ["100% NATURAL • PURE • HANDMADE", "FREE STANDARD SHIPPING ACROSS INDIA"];

function Announcement() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % messages.length), 4200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="mx-auto flex h-9 max-w-[1280px] items-center justify-center overflow-hidden px-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5 }}
            className="eyebrow"
          >
            {messages[i]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function SearchOverlay({
  products,
  open,
  onClose,
}: {
  products: Product[];
  open: boolean;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const categories = [...new Set(products.flatMap((p) => [p.category, p.type]))];
  const results = q.trim()
    ? products.filter((p) => (p.name + p.category + p.concerns.join(" ")).toLowerCase().includes(q.toLowerCase()))
    : [];
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -24 }}
            animate={{ y: 0 }}
            exit={{ y: -24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="bg-card px-4 py-8 md:px-10 md:py-12"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto max-w-3xl">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <Search className="size-5 text-accent" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="What are you looking for?"
                  className="w-full bg-transparent font-display text-2xl outline-none placeholder:text-muted-foreground md:text-3xl"
                />
                <button onClick={onClose} aria-label="Close search">
                  <X className="size-5" />
                </button>
              </div>

              {results.length > 0 ? (
                <div className="mt-6 space-y-2">
                  {results.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/product/${p.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 rounded-sm p-2 transition-colors hover:bg-muted"
                    >
                      <img src={resolveImage(p.image)} alt={p.name} className="size-14 rounded-sm object-cover" />
                      <span className="flex-1 text-sm">{p.name}</span>
                      <span className="text-sm text-primary">{inr(p.price)}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="mt-8 grid gap-8 md:grid-cols-3">
                  <div>
                    <p className="eyebrow text-muted-foreground">Recent Searches</p>
                    <ul className="mt-3 space-y-2 text-sm">
                      {["Face pack", "Rose bar", "D-Tan"].map((s) => (
                        <li key={s}>
                          <button className="hover:text-primary" onClick={() => setQ(s)}>
                            {s}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="eyebrow text-muted-foreground">Popular Products</p>
                    <ul className="mt-3 space-y-2 text-sm">
                      {products.slice(0, 3).map((p) => (
                        <li key={p.slug}>
                          <Link href={`/product/${p.slug}`} onClick={onClose} className="hover:text-primary">
                            {p.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="eyebrow text-muted-foreground">Suggested Categories</p>
                    <ul className="mt-3 space-y-2 text-sm">
                      {categories.slice(0, 4).map((c) => (
                        <li key={c}>
                          <Link href="/shop" onClick={onClose} className="hover:text-primary">
                            {c}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function Header({ products }: { products: Product[] }) {
  const { count, wishlist } = useShop();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <Announcement />
      <div className="border-b border-border bg-card/85 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between gap-6 px-4 md:px-8">
          <button className="lg:hidden" onClick={() => setMenu(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>

          <Link href="/" className="flex items-center gap-3">
            <img src={img.logo} alt="ORGO FARM logo" className="size-10 rounded-full object-cover" />
            <span className="hidden font-display text-xl tracking-[0.18em] text-primary sm:block">ORGO FARM</span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                href={n.to}
                className="text-[13px] tracking-wide text-foreground/80 transition-colors hover:text-primary"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={() => setSearch(true)} aria-label="Search">
              <Search className="size-[18px]" />
            </button>
            <Link href="/account" aria-label="Account" className="hidden sm:block">
              <User className="size-[18px]" />
            </Link>
            <Link href="/wishlist" aria-label="Wishlist" className="relative hidden sm:block">
              <Heart className="size-[18px]" />
              {wishlist.length ? (
                <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-rose text-[10px] text-card">
                  {wishlist.length}
                </span>
              ) : null}
            </Link>
            <Link href="/cart" aria-label="Cart" className="relative">
              <ShoppingBag className="size-[18px]" />
              {count ? (
                <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {count}
                </span>
              ) : null}
            </Link>
            <Link
              href="/shop"
              className="hidden bg-primary px-5 py-2.5 text-[11px] tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90 md:block"
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </div>

      <SearchOverlay products={products} open={search} onClose={() => setSearch(false)} />

      <AnimatePresence>
        {menu ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-foreground/40 lg:hidden"
            onClick={() => setMenu(false)}
          >
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-[82%] max-w-sm bg-card p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <img src={img.logo} alt="ORGO FARM" className="size-10 rounded-full object-cover" />
                <button onClick={() => setMenu(false)} aria-label="Close menu">
                  <X className="size-5" />
                </button>
              </div>
              <nav className="mt-10 flex flex-col gap-6">
                {nav.map((n) => (
                  <Link
                    key={n.to}
                    href={n.to}
                    onClick={() => setMenu(false)}
                    className="font-display text-2xl text-primary"
                  >
                    {n.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-10 space-y-4 border-t border-border pt-6 text-sm">
                <Link href="/wishlist" onClick={() => setMenu(false)} className="block">
                  Wishlist
                </Link>
                <Link href="/account" onClick={() => setMenu(false)} className="block">
                  Account
                </Link>
                <Link href="/faq" onClick={() => setMenu(false)} className="block">
                  FAQ
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

export function MobileTabBar() {
  const { count, wishlist } = useShop();
  const cls = "flex flex-1 flex-col items-center gap-1 py-2.5 text-[9px] tracking-[0.16em] text-foreground/70";
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-card/95 backdrop-blur md:hidden">
      <Link href="/" className={cls}>
        <Home className="size-[18px]" />
        HOME
      </Link>
      <Link href="/shop" className={cls}>
        <ShoppingBag className="size-[18px]" />
        SHOP
      </Link>
      <Link href="/wishlist" className={cls}>
        <span className="relative">
          <Heart className="size-[18px]" />
          {wishlist.length ? <span className="absolute -right-2 -top-1 size-1.5 rounded-full bg-rose" /> : null}
        </span>
        WISHLIST
      </Link>
      <Link href="/cart" className={cls}>
        <span className="relative">
          <ShoppingBag className="size-[18px]" />
          {count ? <span className="absolute -right-2 -top-1 size-1.5 rounded-full bg-primary" /> : null}
        </span>
        CART
      </Link>
      <Link href="/account" className={cls}>
        <User className="size-[18px]" />
        ACCOUNT
      </Link>
    </nav>
  );
}
