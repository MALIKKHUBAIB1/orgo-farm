"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { API_URL } from "@/lib/orgo/api";

/**
 * Sends one lightweight beacon per pageview to the backend
 * (POST /api/visits) so /admin/analytics "Traffic & Visitors" has data.
 * Skips /admin itself so dogfooding the dashboard doesn't pollute stats.
 */
export function VisitTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastSent = useRef("");

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const query = searchParams?.toString();
    const fullPath = query ? `${pathname}?${query}` : pathname;
    if (lastSent.current === fullPath) return;
    lastSent.current = fullPath;

    const payload = JSON.stringify({
      path: fullPath.slice(0, 250),
      referrer: typeof document !== "undefined" ? document.referrer.slice(0, 250) : "",
      // Location signal: the backend has no GeoIP, so the browser timezone
      // (e.g. "Asia/Kolkata") is what powers city/country in analytics.
      timezone:
        typeof Intl !== "undefined"
          ? (Intl.DateTimeFormat().resolvedOptions().timeZone || "").slice(0, 80)
          : "",
      language: typeof navigator !== "undefined" ? (navigator.language || "").slice(0, 20) : "",
    });

    try {
      if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
        const blob = new Blob([payload], { type: "application/json" });
        if (navigator.sendBeacon(`${API_URL}/api/visits`, blob)) return;
      }
      fetch(`${API_URL}/api/visits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    } catch {
      // never break the storefront for analytics
    }
  }, [pathname, searchParams]);

  return null;
}
