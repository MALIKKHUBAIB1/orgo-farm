import type { Metadata } from "next";
import { AccountView } from "./view";

export const metadata: Metadata = {
  title: "Your Account — ORGO FARM",
  description:
    "Manage your ORGO FARM profile, orders, saved addresses and track your deliveries.",
};

export default function AccountPage() {
  return <AccountView />;
}
