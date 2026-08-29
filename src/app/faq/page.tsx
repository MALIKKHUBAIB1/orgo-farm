import type { Metadata } from "next";
import { apiGet } from "@/lib/orgo/api";
import { FaqView } from "./view";
import { DEFAULT_FAQS } from "@/lib/orgo/faqs";
import { faqJsonLd } from "@/lib/orgo/schema";

export const metadata: Metadata = {
  title: "FAQ — Orders, Shipping & Products | ORGO FARM",
  description:
    "Answers about ordering ORGO FARM skincare, shipping across India, using the face pack, ingredients and returns.",
  alternates: { canonical: "/faq" },
  keywords: ["ORGO FARM faq", "shipping India", "return policy", "how to order", "natural skincare help"],
};

export default async function Faq() {
  const faqs = await apiGet<{ question: string; answer: string }[]>("/api/faqs", DEFAULT_FAQS);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }} />
      <FaqView />
    </>
  );
}