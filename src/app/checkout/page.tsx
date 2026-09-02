import type { Metadata } from "next";
import { CheckoutView } from "./view";

export const metadata: Metadata = {
  title: "Secure Checkout — ORGO FARM",
  description: "Complete your ORGO FARM order with UPI, card, net banking, wallets or cash on delivery.",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: false },
  keywords: ["ORGO FARM checkout", "secure skincare payment", "cash on delivery skincare India"],
};

export default function CheckoutPage() {
  return <CheckoutView />;
}