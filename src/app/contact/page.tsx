import type { Metadata } from "next";
import { ContactView } from "./view";

export const metadata: Metadata = {
  title: "Contact ORGO FARM Kanpur — Natural Skincare Support",
  description:
    "Contact ORGO FARM in Kanpur for handmade natural skincare orders, product guidance, wholesale enquiries and support across India.",
  alternates: { canonical: "/contact" },
  keywords: [
    "contact ORGO FARM Kanpur",
    "natural skincare support India",
    "handmade skincare wholesale",
    "ORGO FARM WhatsApp",
    "organic skincare Kanpur",
  ],
};

export default function ContactPage() {
  return <ContactView />;
}
