import { RequireAdmin } from "@/components/admin/ui";
import { HeroSettingsManager } from "./view";

export default function AdminHeroPage() {
  return (
    <RequireAdmin>
      <HeroSettingsManager />
    </RequireAdmin>
  );
}