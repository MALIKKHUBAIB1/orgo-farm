import { RequireAdmin } from "@/components/admin/ui";
import { ShopSettingsManager } from "./view";

export default function AdminShopSettingsPage() {
  return (
    <RequireAdmin>
      <ShopSettingsManager />
    </RequireAdmin>
  );
}