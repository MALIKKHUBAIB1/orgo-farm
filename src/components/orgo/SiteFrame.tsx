"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { Header, MobileTabBar } from "@/components/orgo/Header";
import { Footer } from "@/components/orgo/Footer";
import { VisitTracker } from "@/components/orgo/VisitTracker";
import { Toaster } from "@/components/ui/sonner";
import type { Product } from "@/lib/orgo/products";

export function SiteFrame({ products, children }: { products: Product[]; children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Suspense fallback={null}>
        <VisitTracker />
      </Suspense>      <div className="flex min-h-screen flex-col bg-background">
        <Header products={products} />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <Footer />
        <MobileTabBar />
      </div>
      <Toaster position="bottom-right" />
    </>
  );
}