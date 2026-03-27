import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { presentationId, isPublic } = await request.json();

  const { data, error } = await supabase
    .from("presentations")
    .update({ is_public: isPublic })
    .eq("id", presentationId)
    .select("public_token, is_public")
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ success: true, data });
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const presentationId = request.nextUrl.searchParams.get("presentationId");
  if (!presentationId) return Response.json({ error: "Missing presentationId" }, { status: 400 });

  const { data, error } = await supabase
    .from("presentations")
    .select("public_token, is_public")
    .eq("id", presentationId)
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ success: true, data });
}
