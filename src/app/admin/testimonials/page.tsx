import { RequireAdmin } from "@/components/admin/ui";
import { TestimonialsManager } from "./view";

export default function AdminTestimonialsPage() {
  return (
    <RequireAdmin>
      <TestimonialsManager />
    </RequireAdmin>
  );
}