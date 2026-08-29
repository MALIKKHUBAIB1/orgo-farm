import { RequireAdmin } from "@/components/admin/ui";
import { CurationsManager } from "./view";

export default function AdminCurationsPage() {
  return (
    <RequireAdmin>
      <CurationsManager />
    </RequireAdmin>
  );
}