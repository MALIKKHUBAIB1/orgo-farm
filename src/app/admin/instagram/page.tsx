import { RequireAdmin } from "@/components/admin/ui";
import { InstaManager } from "./view";

export default function AdminInstagramPage() {
  return (
    <RequireAdmin>
      <InstaManager />
    </RequireAdmin>
  );
}