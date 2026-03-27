import { NextRequest } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { getGenerationPrompt } from "@/lib/prompts/system";

function stripHtmlCodeBlock(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:html)?\s*\n?/, "").replace(/\n?\s*```$/, "");
  }
  return cleaned.trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { briefing } = body as { briefing: string };

    if (!briefing || typeof briefing !== "string") {
      return Response.json(
        { success: false, error: "Briefing inválido ou ausente" },
        { status: 400 }
      );
    }

    const systemPrompt = getGenerationPrompt();

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = "";

          const messageStream = anthropic.messages.stream({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 64000,
            system: systemPrompt,
            messages: [
              {
                role: "user",
                content: `Crie uma apresentação a partir deste briefing:\n\n${briefing}`,
              },
            ],
          });

          messageStream.on("text", (text) => {
            fullResponse += text;
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "chunk", content: text })}\n\n`
              )
            );
          });

          await messageStream.finalMessage();

          // Clean up the response (remove ```html wrapper if present)
          const html = stripHtmlCodeBlock(fullResponse);

          // Basic validation: must contain <!DOCTYPE or <html
          if (!html.includes("<!DOCTYPE") && !html.includes("<html")) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "error", error: "A IA não retornou um HTML válido. Tente novamente." })}\n\n`
              )
            );
            controller.close();
            return;
          }

          // Send the final HTML
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "done", html })}\n\n`
            )
          );
          controller.close();
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Erro desconhecido na geração";
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
      err instanceof Error ? err.message : "Erro interno do servidor";
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
