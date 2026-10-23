import { RequireAdmin } from "@/components/admin/ui";
import { CouponsManager } from "./view";

export default function AdminCouponsPage() {
  return (
    <RequireAdmin>
      <CouponsManager />
    </RequireAdmin>
  );
}
