"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

interface ChatPanelProps {
  onSendMessage: (msg: string) => void;
  messages: Message[];
  isGenerating: boolean;
  progress: number;
  error?: string | null;
}

export default function ChatPanel({
  onSendMessage,
  messages,
  isGenerating,
  progress,
  error,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isGenerating) return;
    onSendMessage(trimmed);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  };

  const formatTime = (msg: Message) => {
    if (msg.created_at) {
      return new Date(msg.created_at).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return "";
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="w-[35%] min-w-[340px] h-full flex flex-col bg-white/40 glass-panel border-r border-white/50">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-200/40">
        <div className="w-10 h-10 rounded-xl bg-[#d12429] flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-white text-[20px]">
            auto_awesome
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-[--color-on-surface] tight-tracking">
            GUIO Assistant
          </h2>
          <p className="text-[11px] text-[--color-on-surface-variant]">
            {isGenerating ? "Gerando..." : "AI Copilot"}
          </p>
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100/50 transition-colors">
          <span className="material-symbols-outlined text-[20px] text-[--color-on-surface-variant]">
            more_horiz
          </span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4">
        {/* Welcome message when no messages exist */}
        {!hasMessages && (
          <div className="flex flex-col items-start">
            <div className="max-w-[85%] px-4 py-2.5 text-sm leading-relaxed bg-white border border-zinc-200/60 rounded-2xl rounded-tl-none text-[--color-on-surface]">
              Olá! Sou o GUIO Assistant. Descreva a apresentação que você
              deseja criar e eu vou gerar os slides automaticamente para você.
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id ?? msg.created_at ?? msg.content.slice(0, 20)}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#e8e8e8] rounded-2xl rounded-tr-none text-[--color-on-surface]"
                  : "bg-white border border-zinc-200/60 rounded-2xl rounded-tl-none text-[--color-on-surface]"
              }`}
            >
              {msg.content}
            </div>
            {formatTime(msg) && (
              <span className="text-[10px] text-[--color-on-surface-variant]/50 mt-1 px-1">
                {formatTime(msg)}
              </span>
            )}
          </div>
        ))}

        {/* Error indicator */}
        {error && !isGenerating && (
          <div className="flex flex-col items-start">
            <div className="max-w-[85%] px-4 py-2.5 text-sm leading-relaxed bg-red-50 border border-red-200/60 rounded-2xl rounded-tl-none text-red-700">
              {error}
            </div>
          </div>
        )}

        {/* Generating indicator */}
        {isGenerating && (
          <div className="flex flex-col items-start space-y-3">
            {/* Status */}
            <div className="flex items-center gap-2 px-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d12429] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#d12429]" />
              </span>
              <span className="text-xs font-medium text-[--color-on-surface-variant]">
                {progress < 85
                  ? "Gerando slides..."
                  : progress < 90
                  ? "Validando..."
                  : "Compilando HTML..."}
              </span>
            </div>

            {/* Progress card */}
            <div className="w-full max-w-[85%] bg-[--color-primary]/5 rounded-2xl px-4 py-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[--color-on-surface]">
                  Progresso
                </span>
                <span className="text-xs font-semibold text-[--color-primary]">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-zinc-200/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#d12429] rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="px-4 py-3 border-t border-zinc-200/40">
        <div className="flex items-end gap-2 bg-white/70 rounded-2xl border border-zinc-200/50 px-4 py-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={
              isGenerating
                ? "Aguarde a geração..."
                : "Descreva sua apresentação..."
            }
            disabled={isGenerating}
            className="flex-1 bg-transparent text-sm text-[--color-on-surface] placeholder:text-[--color-on-surface-variant]/40 resize-none outline-none max-h-[120px] disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
            className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl premium-gradient text-white disabled:opacity-40 transition-opacity"
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              send
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
