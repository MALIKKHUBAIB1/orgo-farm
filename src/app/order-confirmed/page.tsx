import type { Metadata } from "next";
import { OrderConfirmedView } from "./view";

export const metadata: Metadata = {
  title: "Order Confirmed — ORGO FARM",
  description: "Thank you for choosing ORGO FARM. Your handmade skincare order is being prepared with care.",
  robots: { index: false },
};

export default function OrderConfirmedPage() {
  return <OrderConfirmedView />;
}