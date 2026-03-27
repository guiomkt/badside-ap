import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getGenerationPrompt } from "@/lib/prompts/system";

export const runtime = "edge";
export const maxDuration = 120;

function extractHtml(text: string): string {
  let cleaned = text.trim();

  // Remove ```html ... ``` wrapping
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:html)?\s*\n?/, "").replace(/\n?\s*```$/, "");
  }

  // If there's text before <!DOCTYPE, strip it
  const doctypeIndex = cleaned.indexOf("<!DOCTYPE");
  const htmlIndex = cleaned.indexOf("<html");
  const startIndex = doctypeIndex >= 0 ? doctypeIndex : htmlIndex;
  if (startIndex > 0) {
    cleaned = cleaned.substring(startIndex);
  }

  // If there's text after </html>, strip it
  const endIndex = cleaned.lastIndexOf("</html>");
  if (endIndex >= 0) {
    cleaned = cleaned.substring(0, endIndex + "</html>".length);
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
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = "";

          const messageStream = anthropic.messages.stream({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 16384,
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

          // Extract HTML from response
          const html = extractHtml(fullResponse);
          console.log(`[generate] Response length: ${fullResponse.length}, HTML length: ${html.length}, starts with: ${html.substring(0, 50)}`);

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
