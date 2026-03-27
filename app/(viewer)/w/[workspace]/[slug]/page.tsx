import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ViewerClient from "./ViewerClient";

interface Props {
  params: Promise<{ workspace: string; slug: string }>;
}

export default async function ViewerPage({ params }: Props) {
  const { workspace, slug } = await params;
  const supabase = await createClient();

  // Get workspace
  const { data: ws } = await supabase
    .from("workspaces")
    .select("id, slug")
    .eq("slug", workspace)
    .single();

  if (!ws) notFound();

  // Get presentation
  const { data: presentation } = await supabase
    .from("presentations")
    .select("id, title, html_content, slide_data, status")
    .eq("workspace_id", ws.id)
    .eq("slug", slug)
    .single();

  if (!presentation) notFound();

  return (
    <ViewerClient
      htmlContent={presentation.html_content}
      title={presentation.title}
      workspaceSlug={workspace}
      presentationSlug={slug}
    />
  );
}
