import { NextRequest } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { getEditPrompt } from "@/lib/prompts/edit";

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
    const { currentHtml, message } = body as {
      currentHtml: string;
      message: string;
    };

    if (!currentHtml || !message || typeof message !== "string") {
      return Response.json(
        { success: false, error: "HTML atual ou mensagem ausente" },
        { status: 400 }
      );
    }

    const systemPrompt = getEditPrompt(currentHtml);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = "";

          const messageStream = anthropic.messages.stream({
            model: "claude-sonnet-4-20250514",
            max_tokens: 64000,
            system: systemPrompt,
            messages: [
              {
                role: "user",
                content: message,
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

          const html = stripHtmlCodeBlock(fullResponse);

          if (!html.includes("<!DOCTYPE") && !html.includes("<html")) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "error", error: "A IA não retornou um HTML válido." })}\n\n`
              )
            );
            controller.close();
            return;
          }

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "done", html })}\n\n`
            )
          );
          controller.close();
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Erro na edição";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", error: msg })}\n\n`
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
    const message = err instanceof Error ? err.message : "Erro interno";
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
