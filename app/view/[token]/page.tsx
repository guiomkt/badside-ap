import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function PublicViewerPage({ params }: Props) {
  const { token } = await params;

  const supabase = await createClient();

  const { data: presentation } = await supabase
    .from("presentations")
    .select("title, html_content")
    .eq("public_token", token)
    .eq("is_public", true)
    .single();

  if (!presentation || !presentation.html_content) notFound();

  return (
    <div className="h-screen w-screen bg-black">
      <iframe
        srcDoc={presentation.html_content}
        className="w-full h-full border-none"
        title={presentation.title}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
