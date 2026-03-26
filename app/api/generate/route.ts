import { NextRequest } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { getGenerationPrompt } from "@/lib/prompts/system";
import { PresentationData, BrandColors } from "@/lib/schemas/presentation";

function stripCodeBlock(text: string): string {
  let cleaned = text.trim();
  // Remove ```json ... ``` wrapping
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?\s*```$/, "");
  }
  return cleaned.trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { briefing, brandColors } = body as {
      briefing: string;
      brandColors?: typeof BrandColors._type;
    };

    if (!briefing || typeof briefing !== "string") {
      return Response.json(
        { success: false, error: "Missing or invalid briefing" },
        { status: 400 }
      );
    }

    // Validate brand colors if provided
    let parsedBrandColors: typeof BrandColors._type | undefined;
    if (brandColors) {
      const result = BrandColors.safeParse(brandColors);
      if (result.success) {
        parsedBrandColors = result.data;
      }
    }

    const systemPrompt = getGenerationPrompt(parsedBrandColors);

    // Create a streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = "";

          const messageStream = anthropic.messages.stream({
            model: "claude-sonnet-4-20250514",
            max_tokens: 8192,
            system: systemPrompt,
            messages: [
              {
                role: "user",
                content: `Generate a presentation from this briefing:\n\n${briefing}`,
              },
            ],
          });

          messageStream.on("text", (text) => {
            fullResponse += text;
            // Stream partial text to client for progress indication
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "chunk", content: text })}\n\n`
              )
            );
          });

          await messageStream.finalMessage();

          // Parse and validate the complete response
          const cleanedJson = stripCodeBlock(fullResponse);
          let parsed: unknown;
          try {
            parsed = JSON.parse(cleanedJson);
          } catch {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "error", error: "Failed to parse JSON from AI response" })}\n\n`
              )
            );
            controller.close();
            return;
          }

          const validation = PresentationData.safeParse(parsed);
          if (!validation.success) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "error",
                  error: "Invalid presentation structure",
                  details: validation.error.issues,
                })}\n\n`
              )
            );
            controller.close();
            return;
          }

          // Send the final validated data
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "done", data: validation.data })}\n\n`
            )
          );
          controller.close();
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Unknown error during generation";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", error: message })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
