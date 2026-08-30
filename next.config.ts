import path from "node:path";
import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";
const apiOrigin = process.env.NEXT_PUBLIC_API_URL ? new URL(process.env.NEXT_PUBLIC_API_URL).origin : "http://localhost:5000";
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""} https://instagram.com https://www.instagram.com https://*.instagram.com https://*.cdninstagram.com https://*.fbcdn.net https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.cdninstagram.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://*.imagekit.io https://*.cdninstagram.com https://*.fbcdn.net https://*.instagram.com https://www.instagram.com https://www.google-analytics.com",
  `connect-src 'self' ${apiOrigin} https://*.cdninstagram.com https://*.fbcdn.net https://*.instagram.com https://www.instagram.com https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com`,
  "media-src 'self' blob: https://*.cdninstagram.com https://*.fbcdn.net https://*.instagram.com",
  "frame-src 'self' https://www.instagram.com https://instagram.com https://*.cdninstagram.com",
  "child-src 'self' https://www.instagram.com https://instagram.com https://*.cdninstagram.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    root: path.join(__dirname),
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Permissions-Policy", value: "accelerometer=(), camera=(), geolocation=(), microphone=(), payment=(), usb=()" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          ...(isDevelopment
            ? []
            : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]),
        ],
      },
    ];
  },
};

export default nextConfig;
