import { RequireAdmin } from "@/components/admin/ui";
import { ContactsManager } from "./view";

export default function AdminContactsPage() {
  return (
    <RequireAdmin>
      <ContactsManager />
    </RequireAdmin>
  );
}