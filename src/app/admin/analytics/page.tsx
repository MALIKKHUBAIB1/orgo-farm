import { RequireAdmin } from "@/components/admin/ui";
import { AnalyticsView } from "./view";

export default function AdminAnalyticsPage() {
  return (
    <RequireAdmin>
      <AnalyticsView />
    </RequireAdmin>
  );
}