import { RequireAdmin } from "@/components/admin/ui";
import { ProductsManager } from "./view";

export default function AdminProductsPage() {
  return (
    <RequireAdmin>
      <ProductsManager />
    </RequireAdmin>
  );
}