"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Heart, Home, Menu, Search, ShoppingBag, Ticket, User, X } from "lucide-react";
import { displayProductImage, img, inr, type Product } from "@/lib/orgo/products";
import { resolveImage } from "@/lib/orgo/image";
import { useShop } from "@/lib/orgo/store";
import { getActiveCoupons, type Coupon } from "@/lib/orgo/coupons";

// Naya shop category navbar me dikhane ke liye — sirf ye line add karni hai.
const ROSE_CATEGORY = "Rose Water / Facial Mist";

const nav = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Rose Water", to: `/shop?category=${encodeURIComponent(ROSE_CATEGORY)}` },
  { label: "Collections", to: "/collections" },
  { label: "Our Story", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "How To Use", to: "/how-to-use" },
  { label: "Contact", to: "/contact" },
] as const;

// Static top bar — sirf sabse naya live coupon dikhta hai (rotation nahi).
// Change karne ke liye admin panel se naya coupon create/pause karein.
function Announcement() {
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponLoadFailed, setCouponLoadFailed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadCoupon = async () => {
      try {
        const coupons = await getActiveCoupons();
        if (!cancelled) {
          setCoupon(coupons[0] ?? null);
          setCouponLoadFailed(false);
        }
      } catch {
        if (!cancelled) setCouponLoadFailed(true);
      }
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") void loadCoupon();
    };
    void loadCoupon();
    const interval = window.setInterval(loadCoupon, 60_000);
    window.addEventListener("focus", loadCoupon);
    window.addEventListener("orgo:coupons-changed", loadCoupon);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.removeEventListener("focus", loadCoupon);
      window.removeEventListener("orgo:coupons-changed", loadCoupon);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const copyCode = async () => {
    if (!coupon) return;
    try {
      await navigator.clipboard.writeText(coupon.code);
    } catch {
      // Clipboard blocked — ignore.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="bg-primary text-primary-foreground">
      <div className="mx-auto flex min-h-12 max-w-[1280px] flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-1.5 text-center">
        {coupon ? (
          <>
            <Ticket className="size-4 shrink-0" />
            <p className="eyebrow">
              {coupon.message} · USE CODE{" "}
              <span className="font-mono tracking-[0.2em] underline underline-offset-4">{coupon.code}</span>
            </p>
            <button
              type="button"
              onClick={copyCode}
              aria-label={copied ? "Code copied" : `Copy code ${coupon.code}`}
              className="grid size-6 shrink-0 place-items-center rounded-full transition-colors hover:bg-primary-foreground/15"
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            </button>
          </>
        ) : (
          <p className="eyebrow">
            {couponLoadFailed ? "COUPON CODE COULD NOT BE LOADED" : "FREE STANDARD SHIPPING ACROSS INDIA"}
          </p>
        )}
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
                      <img src={resolveImage(displayProductImage(p))} alt={p.name} className="size-14 rounded-sm object-cover" />
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
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [activeCat, setActiveCat] = useState<string | null>(null);

  // Shop query chip changes (shop page) + browser back/forward don't trigger
  // a pathname change, so track ?category via URL + a lightweight event.
  useEffect(() => {
    const sync = () => setActiveCat(new URLSearchParams(window.location.search).get("category"));
    sync();
    window.addEventListener("popstate", sync);
    window.addEventListener("orgo:category-change", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("orgo:category-change", sync);
    };
  }, [pathname]);

  const navActive = (to: string) => {
    if (to === "/") return pathname === "/";
    if (to.startsWith("/shop?")) {
      const want = decodeURIComponent(to.slice(to.indexOf("?category=") + "?category=".length));
      return pathname === "/shop" && activeCat === want;
    }
    if (to === "/shop") return pathname === "/shop" && activeCat !== ROSE_CATEGORY;
    return pathname === to || pathname.startsWith(to);
  };

  return (
    <header className="sticky top-0 z-50">
      <Announcement />
      <div className="border-b border-border bg-card/85 backdrop-blur-md">
        <div
          className={`mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-4 md:px-8 ${
            isHome ? "h-[80px] md:h-[88px]" : "h-[68px]"
          }`}
        >
          <button className="lg:hidden" onClick={() => setMenu(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>

          <Link href="/" className="flex shrink-0 items-center gap-3">
            <img
              src={img.logo}
              alt="ORGO FARM logo"
              className={isHome ? "h-16 w-auto md:h-[4.5rem]" : "h-12 w-auto md:h-14"}
            />
          </Link>

          <nav className="hidden items-center gap-5 lg:flex xl:gap-8">
            {nav.map((n) => (
              <Link
                key={n.to}
                href={n.to}
                className={`relative whitespace-nowrap pb-1 text-[12px] tracking-wide transition-colors xl:text-[13px] ${
                  navActive(n.to) ? "text-primary" : "text-foreground/80 hover:text-primary"
                }`}
              >
                {n.label}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-primary transition-all duration-300 ${
                    navActive(n.to) ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-4">
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
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 520, damping: 16 }}
                  className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground"
                >
                  {count}
                </motion.span>
              ) : null}
            </Link>
            <Link
              href="/shop"
              className="shimmer hidden whitespace-nowrap bg-primary px-5 py-2.5 text-[11px] tracking-[0.2em] text-primary-foreground md:block"
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
                <img src={img.logo} alt="ORGO FARM" className="h-12 w-auto" />
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
                    className={`font-display text-2xl ${
                      navActive(n.to) ? "text-primary underline underline-offset-8" : "text-primary"
                    }`}
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
  const pathname = usePathname();
  const isActive = {
    home: pathname === "/",
    shop: pathname === "/shop" || pathname.startsWith("/product/"),
    wishlist: pathname === "/wishlist",
    cart: pathname === "/cart",
    account: pathname === "/account",
  };
  const cls = (on: boolean) =>
    `flex flex-1 flex-col items-center gap-1 py-2.5 text-[9px] tracking-[0.16em] transition-colors ${
      on ? "text-primary" : "text-foreground/70"
    }`;
  const bar = (on: boolean) => (
    <span className={`h-0.5 w-7 rounded-full bg-primary transition-opacity ${on ? "opacity-100" : "opacity-0"}`} />
  );
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-card/95 backdrop-blur md:hidden">
      <Link href="/" className={cls(isActive.home)}>
        <Home className="size-[18px]" />
        HOME
        {bar(isActive.home)}
      </Link>
      <Link href="/shop" className={cls(isActive.shop)}>
        <ShoppingBag className="size-[18px]" />
        SHOP
        {bar(isActive.shop)}
      </Link>
      <Link href="/wishlist" className={cls(isActive.wishlist)}>
        <span className="relative">
          <Heart className="size-[18px]" />
          {wishlist.length ? <span className="absolute -right-2 -top-1 size-1.5 rounded-full bg-rose" /> : null}
        </span>
        WISHLIST
        {bar(isActive.wishlist)}
      </Link>
      <Link href="/cart" className={cls(isActive.cart)}>
        <span className="relative">
          <ShoppingBag className="size-[18px]" />
          {count ? <span className="absolute -right-2 -top-1 size-1.5 rounded-full bg-primary" /> : null}
        </span>
        CART
        {bar(isActive.cart)}
      </Link>
      <Link href="/account" className={cls(isActive.account)}>
        <User className="size-[18px]" />
        ACCOUNT
        {bar(isActive.account)}
      </Link>
    </nav>
  );
}
