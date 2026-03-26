import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import WorkspaceClient from "@/components/workspace/WorkspaceClient";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ workspace: string }>;
}) {
  const { workspace: workspaceSlug } = await params;
  const supabase = await createClient();

  // Fetch workspace by slug
  const { data: workspace, error: wsError } = await supabase
    .from("workspaces")
    .select("*")
    .eq("slug", workspaceSlug)
    .single();

  if (wsError || !workspace) {
    notFound();
  }

  // Fetch presentations for this workspace
  const { data: presentations } = await supabase
    .from("presentations")
    .select("*")
    .eq("workspace_id", workspace.id)
    .order("updated_at", { ascending: false });

  return (
    <WorkspaceClient
      workspace={{
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
      }}
      presentations={presentations ?? []}
    />
  );
}
