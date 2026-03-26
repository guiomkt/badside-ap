import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workspace: string }> }
) {
  const { workspace: workspaceSlug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  // Get workspace by slug
  const { data: workspace, error: wsError } = await supabase
    .from("workspaces")
    .select("id")
    .eq("slug", workspaceSlug)
    .single();

  if (wsError || !workspace) {
    return NextResponse.json(
      { error: "Workspace não encontrado" },
      { status: 404 }
    );
  }

  const title = "Nova Apresentação";
  const slug = `${slugify(title)}-${Date.now().toString(36)}`;

  const { data: presentation, error } = await supabase
    .from("presentations")
    .insert({
      title,
      slug,
      workspace_id: workspace.id,
      created_by: user.id,
      status: "draft",
      slide_data: JSON.stringify({ slides: [] }),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Redirect to the edit page
  const editUrl = new URL(
    `/w/${workspaceSlug}/${presentation.slug}/edit`,
    request.url
  );

  return NextResponse.redirect(editUrl);
}
