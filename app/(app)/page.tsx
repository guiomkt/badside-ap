import { createClient } from "@/lib/supabase/server";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch workspaces with member and presentation counts
  const { data: workspaces } = await supabase
    .from("workspaces")
    .select("*, workspace_members(count), presentations(count)")
    .order("created_at", { ascending: false });

  // Fetch recent activity (latest presentations across all workspaces)
  const { data: recentPresentations } = await supabase
    .from("presentations")
    .select("*, workspaces(name)")
    .order("updated_at", { ascending: false })
    .limit(5);

  return (
    <DashboardClient
      workspaces={workspaces ?? []}
      recentPresentations={recentPresentations ?? []}
    />
  );
}
