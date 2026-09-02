"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Package, Sparkles, MessagesSquare, Mail, Video, CircleHelp, SlidersHorizontal, MessageSquareQuote, GalleryHorizontalEnd, BarChart3, ExternalLink, type LucideIcon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { adminLogout, adminMe, type AdminUser } from "@/lib/orgo/admin";

const nav: { label: string; to: string; icon: LucideIcon }[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Products", to: "/admin/products", icon: Package },
  { label: "Curations", to: "/admin/curations", icon: Sparkles },
  { label: "Traffic & Visitors", to: "/admin/analytics", icon: BarChart3 },
  { label: "Subscribers", to: "/admin/subscribers", icon: Mail },
  { label: "FAQs", to: "/admin/faqs", icon: CircleHelp },
  { label: "Instagram Posts", to: "/admin/instagram", icon: Video },
  { label: "Testimonials", to: "/admin/testimonials", icon: MessageSquareQuote },
  { label: "Contact Messages", to: "/admin/contacts", icon: MessagesSquare },
  { label: "Hero Section", to: "/admin/hero-settings", icon: GalleryHorizontalEnd },
  { label: "Shop Filters", to: "/admin/shop-settings", icon: SlidersHorizontal },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const a = await adminMe();
      if (!cancelled) setAdmin(a);
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const isLogin = pathname === "/admin/login";

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-card md:flex">
        <div className="px-5 py-6">
          <p className="font-display text-xl tracking-[0.14em] text-primary">ORGO FARM</p>
          <p className="mt-0.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin Panel</p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                href={item.to}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-beige/40 hover:text-primary"
                }`}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-4">
          <Link href="/" className="mb-2 flex items-center gap-2 px-2 text-xs text-muted-foreground hover:text-primary">
            <ExternalLink className="size-3.5" /> View store
          </Link>
          <button
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-rose/10 hover:text-rose"
            onClick={() => {
              adminLogout();
              setAdmin(null);
              router.replace("/admin/login");
            }}
            type="button"
          >
            <LogOut className="size-3.5" /> Log out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
            <div className="flex items-center gap-2 md:gap-6">
              <Link href="/admin" className="font-display text-lg text-primary md:hidden">
                ORGO FARM
              </Link>
              <nav className="flex flex-1 gap-1 overflow-x-auto md:hidden">
                {nav.map((item) => (
                  <Link
                    key={item.to}
                    href={item.to}
                    className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium ${
                      pathname === item.to ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              {admin ? <span className="hidden text-xs text-muted-foreground sm:inline">{admin.email}</span> : null}
              {admin && !isLogin ? (
                <button
                  className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-primary md:hidden"
                  onClick={() => {
                    adminLogout();
                    setAdmin(null);
                    router.replace("/admin/login");
                  }}
                  type="button"
                >
                  Log out
                </button>
              ) : null}
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}