import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    const { searchParams } = new URL(request.url);

    const workspace = searchParams.get("workspace");
    const slug = searchParams.get("slug");

    if (workspace && slug) {
      // Look up by workspace slug + presentation slug
      const { data: ws, error: wsErr } = await supabase
        .from("workspaces")
        .select("id")
        .eq("slug", workspace)
        .single();

      if (wsErr || !ws) {
        // Try treating workspace param as workspace_id directly
        const { data: pres, error: presErr } = await supabase
          .from("presentations")
          .select("*")
          .eq("workspace_id", workspace)
          .eq("slug", slug)
          .single();

        if (presErr || !pres) {
          return Response.json(
            { success: false, error: "Presentation not found" },
            { status: 404 }
          );
        }

        return Response.json({ success: true, data: pres });
      }

      const { data: pres, error: presErr } = await supabase
        .from("presentations")
        .select("*")
        .eq("workspace_id", ws.id)
        .eq("slug", slug)
        .single();

      if (presErr || !pres) {
        return Response.json(
          { success: false, error: "Presentation not found" },
          { status: 404 }
        );
      }

      return Response.json({ success: true, data: pres });
    }

    // Look up by ID directly
    const { data: pres, error: presErr } = await supabase
      .from("presentations")
      .select("*")
      .eq("id", id)
      .single();

    if (presErr || !pres) {
      return Response.json(
        { success: false, error: "Presentation not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: pres });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    const body = await request.json();

    // Only allow updating specific fields
    const allowedFields = [
      "title",
      "slug",
      "slide_data",
      "html_content",
      "status",
    ];
    const updates: Record<string, any> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return Response.json(
        { success: false, error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const { data: pres, error: updateErr } = await supabase
      .from("presentations")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateErr || !pres) {
      return Response.json(
        {
          success: false,
          error: updateErr?.message || "Failed to update presentation",
        },
        { status: 500 }
      );
    }

    return Response.json({ success: true, data: pres });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
