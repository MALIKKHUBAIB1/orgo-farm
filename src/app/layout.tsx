import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteFrame } from "@/components/orgo/SiteFrame";
import { ShopProvider } from "@/lib/orgo/store";
import { AuthProvider } from "@/lib/orgo/auth";
import { CatalogProvider } from "@/lib/orgo/catalog";
import { apiGet, SITE_URL } from "@/lib/orgo/api";
import { products as fallbackProducts, type Product } from "@/lib/orgo/products";
import { organizationJsonLd, webSiteJsonLd } from "@/lib/orgo/schema";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ORGO FARM — Pure & Natural Handmade Skincare",
    template: "%s",
  },
  description:
    "ORGO FARM crafts 100% natural, handmade skincare with farm-fresh ingredients. No parabens, no artificial fragrances.",
  authors: [{ name: "ORGO FARM" }],
  keywords: [
    "organic skincare India",
    "handmade natural skincare",
    "face mask",
    "scrub bar",
    "tan removal",
    "ORGO FARM",
  ],
  openGraph: {
    siteName: "ORGO FARM",
    type: "website",
    images: [{ url: `${SITE_URL}/orgo/logo.jpg`, alt: "ORGO FARM" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${SITE_URL}/orgo/logo.jpg`],
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const products = await apiGet<Product[]>("/api/products", fallbackProducts);
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@300;400;500;600&family=Parisienne&display=swap"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd()) }}
        />
        <ShopProvider>
          <AuthProvider>
            <CatalogProvider>
              <SiteFrame products={products}>{children}</SiteFrame>
            </CatalogProvider>
          </AuthProvider>
        </ShopProvider>
      </body>
    </html>
  );
}