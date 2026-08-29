import type { Metadata } from "next";
import { ContactView } from "./view";

export const metadata: Metadata = {
  title: "Contact ORGO FARM — Let's Talk Natural Skincare",
  description:
    "Reach ORGO FARM on WhatsApp, Instagram or email for orders, product help and wholesale enquiries.",
  alternates: { canonical: "/contact" },
  keywords: ["contact ORGO FARM", "WhatsApp skincare", "wholesale skincare India", "natural skincare support"],
};

export default function ContactPage() {
  return <ContactView />;
}
