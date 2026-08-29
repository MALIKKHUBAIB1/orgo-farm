import { RequireAdmin } from "@/components/admin/ui";
import { SubscribersManager } from "./view";

export default function AdminSubscribersPage() {
  return (
    <RequireAdmin>
      <SubscribersManager />
    </RequireAdmin>
  );
}