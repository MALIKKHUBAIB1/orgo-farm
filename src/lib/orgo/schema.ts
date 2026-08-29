import { API_URL, SITE_URL } from "./api";
import type { Product } from "./products";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ORGO FARM",
    url: SITE_URL,
    logo: `${SITE_URL}/orgo/logo.jpg`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-92362-06988",
      contactType: "customer service",
      availableLanguage: ["en", "hi"],
    },
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ORGO FARM",
    url: SITE_URL,
    description: "Pure & natural handmade skincare from ORGO FARM.",
    publisher: { "@type": "Organization", name: "ORGO FARM", logo: `${SITE_URL}/orgo/logo.jpg` },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((i, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: i.name,
      item: i.url,
    })),
  };
}

export function absoluteImage(p: Product): string | undefined {
  const raw = p.image || p.gallery?.[0] || "";
  if (!raw) return undefined;
  if (raw.startsWith("http")) return raw;
  if (raw.startsWith("/uploads/")) return `${API_URL}${raw}`;
  return raw;
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function productJsonLd(product: Product, url: string, areaServed?: object) {
  const image = absoluteImage(product);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    ...(image ? { image: [image] } : {}),
    sku: product.slug,
    category: product.category,
    brand: { "@type": "Brand", name: "ORGO FARM" },
    ...(areaServed ? { areaServed } : {}),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: product.price,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}

export function productFaqJsonLd(product: Product) {
  return faqJsonLd([
    {
      question: `What is included in ${product.name}?`,
      answer: `${product.name} (${product.size}) for ${new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(product.price)}. ${product.short}`,
    },
    { question: `What are the ingredients of ${product.name}?`, answer: product.ingredients },
    { question: `How do I use ${product.name}?`, answer: product.howToUse },
    { question: `Who is ${product.name} suitable for?`, answer: product.suitableFor },
    {
      question: `Does ORGO FARM deliver ${product.name} across India?`,
      answer: "Yes — free standard shipping across India on every order.",
    },
  ]);
}

export function dimensionFaqJsonLd(kind: string, label: string, intro: string) {
  return faqJsonLd([
    { question: `What ${kind} products does ORGO FARM offer for ${label.toLowerCase()}?`, answer: intro },
    {
      question: `Are ORGO FARM ${label.toLowerCase()} products natural?`,
      answer: "Yes — every product is handcrafted in small batches with farm-fresh, 100% natural ingredients. No parabens, no artificial fragrances.",
    },
    {
      question: `Do you ship ${label.toLowerCase()} products across India?`,
      answer: "Yes, free standard shipping across India on every order.",
    },
  ]);
}