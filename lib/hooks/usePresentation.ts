"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

export interface Presentation {
  id: string;
  title: string;
  slug: string;
  workspace_id: string;
  slide_data: Record<string, unknown>;
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
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    loadPresentation();
  }, [workspaceSlug, presentationSlug]);

  useEffect(() => {
    if (presentation?.id) {
      loadMessages(presentation.id);
    }
  }, [presentation?.id]);

  async function loadPresentation() {
    setIsLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: workspace } = await supabase
        .from("workspaces")
        .select("id")
        .eq("slug", workspaceSlug)
        .single();

      if (!workspace) {
        setError("Workspace não encontrado");
        setIsLoading(false);
        return;
      }

      const { data: pres } = await supabase
        .from("presentations")
        .select("*")
        .eq("workspace_id", workspace.id)
        .eq("slug", presentationSlug)
        .single();

      if (!pres) {
        setError("Apresentação não encontrada");
        setIsLoading(false);
        return;
      }

      setPresentation(pres as Presentation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar");
    } finally {
      setIsLoading(false);
    }
  }

  async function loadMessages(presentationId: string) {
    const supabase = createClient();
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("presentation_id", presentationId)
      .order("created_at", { ascending: true });

    setMessages((data ?? []) as ChatMessage[]);
  }

  async function saveMessage(presentationId: string, role: "user" | "assistant", content: string): Promise<ChatMessage | null> {
    const supabase = createClient();
    const { data } = await supabase
      .from("chat_messages")
      .insert({ presentation_id: presentationId, role, content })
      .select()
      .single();
    return data as ChatMessage | null;
  }

  const sendMessage = useCallback(
    async (content: string) => {
      if (!presentation) return;

      setError(null);
      setIsGenerating(true);
      setProgress(0);

      // Add user message immediately
      const tempUserMsg: ChatMessage = {
        id: `temp-${Date.now()}`,
        role: "user",
        content,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempUserMsg]);

      // Save user message to DB
      const savedUserMsg = await saveMessage(presentation.id, "user", content);
      if (savedUserMsg) {
        setMessages((prev) => prev.map((m) => (m.id === tempUserMsg.id ? savedUserMsg : m)));
      }

      try {
        const hasHtml = presentation.html_content && presentation.html_content.length > 100;
        let html: string;
        let assistantContent: string;

        if (!hasHtml) {
          // First message: GENERATE new presentation
          html = await streamRequest("/api/generate", { briefing: content });
          assistantContent = "Apresentação gerada com sucesso! Confira o preview ao lado.";
        } else {
          // Edit existing presentation
          html = await streamRequest("/api/edit", { currentHtml: presentation.html_content, message: content });
          assistantContent = "Apresentação atualizada! As alterações estão no preview.";
        }

        // Save HTML to Supabase
        const supabase = createClient();
        await supabase
          .from("presentations")
          .update({ html_content: html, status: "live" })
          .eq("id", presentation.id);

        // Update local state
        setPresentation((prev) =>
          prev ? { ...prev, html_content: html, status: "live" } : prev
        );

        setProgress(100);

        // Save assistant message
        const savedAssistantMsg = await saveMessage(presentation.id, "assistant", assistantContent);
        setMessages((prev) => [
          ...prev,
          savedAssistantMsg ?? {
            id: `asst-${Date.now()}`,
            role: "assistant" as const,
            content: assistantContent,
            created_at: new Date().toISOString(),
          },
        ]);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : "Erro desconhecido";
        setError(errMsg);
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant" as const,
            content: `Desculpe, ocorreu um erro: ${errMsg}`,
            created_at: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsGenerating(false);
        setProgress(0);
      }
    },
    [presentation]
  );

  async function streamRequest(url: string, body: Record<string, unknown>): Promise<string> {
    const abortController = new AbortController();
    abortRef.current = abortController;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: abortController.signal,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Erro na requisição" }));
      throw new Error(err.error || "Erro na requisição");
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error("Sem stream de resposta");

    const decoder = new TextDecoder();
    let buffer = "";
    let chunkCount = 0;
    let resultHtml: string | null = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (!jsonStr) continue;

        try {
          const event = JSON.parse(jsonStr);
          if (event.type === "chunk") {
            chunkCount++;
            setProgress(Math.min(90, chunkCount));
          } else if (event.type === "done") {
            resultHtml = event.html;
            setProgress(95);
          } else if (event.type === "error") {
            throw new Error(event.error);
          }
        } catch (e) {
          if (e instanceof SyntaxError) continue;
          throw e;
        }
      }
    }

    abortRef.current = null;
    if (!resultHtml) throw new Error("Nenhum HTML recebido da IA");
    return resultHtml;
  }

  const updatePresentation = useCallback(
    async (updates: Partial<Presentation>) => {
      if (!presentation) return;
      const supabase = createClient();
      await supabase.from("presentations").update(updates).eq("id", presentation.id);
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
