import { NextRequest } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { getEditPrompt } from "@/lib/prompts/edit";
import { PresentationData } from "@/lib/schemas/presentation";

function stripCodeBlock(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?\s*```$/, "");
  }
  return cleaned.trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentData, message } = body as {
      currentData: unknown;
      message: string;
    };

    if (!currentData || !message || typeof message !== "string") {
      return Response.json(
        { success: false, error: "Missing currentData or message" },
        { status: 400 }
      );
    }

    // Validate currentData against the schema
    const currentValidation = PresentationData.safeParse(currentData);
    if (!currentValidation.success) {
      return Response.json(
        {
          success: false,
          error: "Invalid currentData structure",
          details: currentValidation.error.issues,
        },
        { status: 400 }
      );
    }

    const systemPrompt = getEditPrompt(currentValidation.data);

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    // Extract text content from the response
    const textContent = response.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      return Response.json(
        { success: false, error: "No text response from AI" },
        { status: 500 }
      );
    }

    const cleanedJson = stripCodeBlock(textContent.text);
    let parsed: unknown;
    try {
      parsed = JSON.parse(cleanedJson);
    } catch {
      return Response.json(
        { success: false, error: "Failed to parse JSON from AI response" },
        { status: 500 }
      );
    }

    const validation = PresentationData.safeParse(parsed);
    if (!validation.success) {
      return Response.json(
        {
          success: false,
          error: "Invalid presentation structure in AI response",
          details: validation.error.issues,
        },
        { status: 500 }
      );
    }

    return Response.json({ success: true, data: validation.data });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
