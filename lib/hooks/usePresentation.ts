"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

export interface Presentation {
  id: string;
  title: string;
  slug: string;
  workspace_id: string;
  slide_data: any;
  html_content: string;
  status: string;
  created_by: string | null;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export function usePresentation(workspaceSlug: string, presentationSlug: string) {
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const abortRef = useRef<AbortController | null>(null);

  // Load presentation on mount
  useEffect(() => {
    loadPresentation();
  }, [workspaceSlug, presentationSlug]);

  // Load messages once we have the presentation id
  useEffect(() => {
    if (presentation?.id) {
      loadMessages(presentation.id);
    }
  }, [presentation?.id]);

  async function loadPresentation() {
    setIsLoading(true);
    setError(null);
    try {
      // First find the workspace by slug
      const { data: workspace, error: wsErr } = await supabase
        .from("workspaces")
        .select("id")
        .eq("slug", workspaceSlug)
        .single();

      if (wsErr || !workspace) {
        // Fallback: try treating workspaceSlug as workspace_id directly
        const { data: pres, error: presErr } = await supabase
          .from("presentations")
          .select("*")
          .eq("workspace_id", workspaceSlug)
          .eq("slug", presentationSlug)
          .single();

        if (presErr || !pres) {
          setError("Apresentação não encontrada");
          setIsLoading(false);
          return;
        }
        setPresentation(pres as Presentation);
        setIsLoading(false);
        return;
      }

      const { data: pres, error: presErr } = await supabase
        .from("presentations")
        .select("*")
        .eq("workspace_id", workspace.id)
        .eq("slug", presentationSlug)
        .single();

      if (presErr || !pres) {
        setError("Apresentação não encontrada");
        setIsLoading(false);
        return;
      }

      setPresentation(pres as Presentation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar a apresentação");
    } finally {
      setIsLoading(false);
    }
  }

  async function loadMessages(presentationId: string) {
    try {
      const { data, error: msgErr } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("presentation_id", presentationId)
        .order("created_at", { ascending: true });

      if (msgErr) {
        console.error("Failed to load messages:", msgErr);
        return;
      }

      setMessages((data ?? []) as ChatMessage[]);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  }

  async function saveMessage(
    presentationId: string,
    role: "user" | "assistant",
    content: string
  ): Promise<ChatMessage | null> {
    const { data, error: saveErr } = await supabase
      .from("chat_messages")
      .insert({ presentation_id: presentationId, role, content })
      .select()
      .single();

    if (saveErr) {
      console.error("Failed to save message:", saveErr);
      return null;
    }

    return data as ChatMessage;
  }

  async function updatePresentationData(
    presentationId: string,
    slideData: any,
    htmlContent: string,
    title?: string
  ) {
    const updates: any = {
      slide_data: slideData,
      html_content: htmlContent,
      status: "generated",
    };
    if (title) updates.title = title;

    const { error: updateErr } = await supabase
      .from("presentations")
      .update(updates)
      .eq("id", presentationId);

    if (updateErr) {
      console.error("Failed to save presentation:", updateErr);
      throw new Error("Erro ao salvar a apresentação");
    }
  }

  const sendMessage = useCallback(
    async (content: string) => {
      if (!presentation) {
        setError("Nenhuma apresentação carregada");
        return;
      }

      setError(null);
      setIsGenerating(true);
      setProgress(0);

      // 1. Add user message to local state immediately
      const tempUserMsg: ChatMessage = {
        id: `temp-${Date.now()}`,
        role: "user",
        content,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempUserMsg]);

      // 2. Save user message to Supabase
      const savedUserMsg = await saveMessage(presentation.id, "user", content);
      if (savedUserMsg) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempUserMsg.id ? savedUserMsg : m))
        );
      }

      try {
        let slideData: any;
        let assistantContent: string;

        const hasSlides = presentation.slide_data?.slides?.length > 0;

        if (!hasSlides) {
          // First message: call /api/generate with SSE streaming
          const result = await streamGenerate(content);
          slideData = result.data;
          assistantContent = `Apresentação gerada com ${slideData.slides.length} slides: "${slideData.title}"`;
        } else {
          // Edit existing: call /api/edit
          const res = await fetch("/api/edit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              currentData: presentation.slide_data,
              message: content,
            }),
          });

          const result = await res.json();
          if (!result.success) {
            throw new Error(result.error || "Edit failed");
          }
          slideData = result.data;
          assistantContent = `Slides atualizados com sucesso. A apresentação agora tem ${slideData.slides.length} slides.`;
        }

        // 4. Compile to HTML
        setProgress(90);
        const compileRes = await fetch("/api/compile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: slideData }),
        });

        const compileResult = await compileRes.json();
        if (!compileResult.success) {
          throw new Error(compileResult.error || "Compile failed");
        }

        // 5. Save to Supabase
        await updatePresentationData(
          presentation.id,
          slideData,
          compileResult.html,
          slideData.title
        );

        // 6. Update local state
        setPresentation((prev) =>
          prev
            ? {
                ...prev,
                slide_data: slideData,
                html_content: compileResult.html,
                title: slideData.title || prev.title,
                status: "generated",
              }
            : prev
        );

        // 7. Save assistant message
        setProgress(100);
        const savedAssistantMsg = await saveMessage(
          presentation.id,
          "assistant",
          assistantContent
        );

        const assistantMsg: ChatMessage = savedAssistantMsg ?? {
          id: `temp-asst-${Date.now()}`,
          role: "assistant",
          content: assistantContent,
          created_at: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        const errMsg =
          err instanceof Error ? err.message : "Ocorreu um erro";
        setError(errMsg);

        // Add error message to chat
        const errorAssistantMsg: ChatMessage = {
          id: `temp-err-${Date.now()}`,
          role: "assistant",
          content: `Desculpe, ocorreu um erro: ${errMsg}`,
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorAssistantMsg]);
      } finally {
        setIsGenerating(false);
        setProgress(0);
      }
    },
    [presentation]
  );

  async function streamGenerate(
    briefing: string
  ): Promise<{ data: any }> {
    const abortController = new AbortController();
    abortRef.current = abortController;

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ briefing }),
      signal: abortController.signal,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Erro na geração" }));
      throw new Error(err.error || "Erro na geração");
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error("Sem stream de resposta");

    const decoder = new TextDecoder();
    let buffer = "";
    let chunkCount = 0;
    let resultData: any = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Parse SSE messages from buffer
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? ""; // Keep incomplete line in buffer

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (!jsonStr) continue;

        try {
          const event = JSON.parse(jsonStr);

          if (event.type === "chunk") {
            chunkCount++;
            // Estimate progress based on chunks received (cap at 85%)
            const estimated = Math.min(85, chunkCount * 2);
            setProgress(estimated);
          } else if (event.type === "done") {
            resultData = event.data;
            setProgress(88);
          } else if (event.type === "error") {
            throw new Error(event.error || "Erro na geração");
          }
        } catch (parseErr) {
          // If it's not a JSON parse issue for SSE, re-throw
          if (parseErr instanceof Error && parseErr.message !== "Generation error") {
            if (parseErr instanceof SyntaxError) continue; // skip malformed SSE
            throw parseErr;
          }
          throw parseErr;
        }
      }
    }

    abortRef.current = null;

    if (!resultData) {
      throw new Error("Nenhum dado de apresentação recebido da geração");
    }

    return { data: resultData };
  }

  const updatePresentation = useCallback(
    async (updates: Partial<Presentation>) => {
      if (!presentation) return;

      const { error: updateErr } = await supabase
        .from("presentations")
        .update(updates)
        .eq("id", presentation.id);

      if (updateErr) {
        console.error("Failed to update presentation:", updateErr);
        return;
      }

      setPresentation((prev) => (prev ? { ...prev, ...updates } : prev));
    },
    [presentation]
  );

  return {
    presentation,
    messages,
    isLoading,
    isGenerating,
    progress,
    error,
    sendMessage,
    updatePresentation,
  };
}
