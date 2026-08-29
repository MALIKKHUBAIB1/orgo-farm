import type { Metadata } from "next";
import { CheckoutView } from "./view";

export const metadata: Metadata = {
  title: "Secure Checkout — ORGO FARM",
  description: "Complete your ORGO FARM order with UPI, card, net banking, wallets or cash on delivery.",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}