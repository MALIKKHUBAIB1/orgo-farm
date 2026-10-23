import type { Metadata } from "next";
import { ContactView } from "./view";

export const metadata: Metadata = {
  title: "Contact ORGO FARM Noida — Natural Skincare Support",
  description:
    "Contact ORGO FARM in Noida for handmade natural skincare orders, product guidance, wholesale enquiries and support across India.",
  alternates: { canonical: "/contact" },
  keywords: [
    "contact ORGO FARM Noida",
    "natural skincare support India",
    "handmade skincare wholesale",
    "ORGO FARM WhatsApp",
    "organic skincare Noida",
  ],
};

export default function ContactPage() {
  return <ContactView />;
}
