import { RequireAdmin } from "@/components/admin/ui";
import { FaqsManager } from "./view";

export default function AdminFaqsPage() {
  return (
    <RequireAdmin>
      <FaqsManager />
    </RequireAdmin>
  );
}