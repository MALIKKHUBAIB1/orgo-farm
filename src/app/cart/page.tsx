import type { Metadata } from "next";
import { CartView } from "./view";

export const metadata: Metadata = {
  title: "Your Cart — ORGO FARM",
  description: "Review your ORGO FARM handmade skincare selection and check out securely.",
};

export default function CartPage() {
  return <CartView />;
}