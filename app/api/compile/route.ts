import { NextRequest } from "next/server";
import { compilePresentation } from "@/lib/templates/compiler";
import { PresentationData } from "@/lib/schemas/presentation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data } = body as { data: unknown };

    if (!data) {
      return Response.json(
        { success: false, error: "Missing presentation data" },
        { status: 400 }
      );
    }

    const validation = PresentationData.safeParse(data);
    if (!validation.success) {
      return Response.json(
        {
          success: false,
          error: "Invalid presentation data",
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const html = compilePresentation(validation.data);

    return Response.json({ success: true, html });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
