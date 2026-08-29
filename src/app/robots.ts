import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/orgo/api";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/checkout", "/cart", "/account", "/wishlist", "/order-confirmed"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}