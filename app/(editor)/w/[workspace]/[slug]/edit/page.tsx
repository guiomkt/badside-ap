"use client";

import { useState } from "react";
import TrafficLights from "@/components/layout/TrafficLights";
import ChatPanel from "@/components/editor/ChatPanel";
import PreviewPanel from "@/components/editor/PreviewPanel";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const initialMessages: Message[] = [
  {
    role: "assistant",
    content:
      "Olá! Sou o GUIO Assistant. Descreva a apresentação que deseja criar e eu vou gerar os slides para você.",
  },
  {
    role: "user",
    content:
      "Preciso de uma apresentação sobre o relatório trimestral da empresa, com foco em resultados de vendas e metas para o próximo trimestre.",
  },
  {
    role: "assistant",
    content:
      "Perfeito! Vou criar uma apresentação com os seguintes slides:\n\n1. Capa — Relatório Trimestral\n2. Resumo Executivo\n3. Resultados de Vendas\n4. Análise por Região\n5. Metas Q2 2026\n\nGerando os slides agora...",
  },
];

const sampleSlideHTML = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      width: 100%; height: 100vh;
      display: flex; flex-direction: column;
      background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
      padding: 48px 56px;
    }
    .badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(172,0,21,0.06); color: #ac0015;
      padding: 6px 14px; border-radius: 100px;
      font-size: 11px; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.05em;
      margin-bottom: 20px; width: fit-content;
    }
    .badge-dot { width: 6px; height: 6px; background: #d12429; border-radius: 50%; }
    h1 {
      font-size: 36px; font-weight: 800;
      color: #1a1c1c; letter-spacing: -0.03em;
      line-height: 1.15; margin-bottom: 12px;
    }
    h1 span { color: #d12429; }
    .subtitle {
      font-size: 15px; color: #5c403d;
      line-height: 1.6; max-width: 520px;
    }
    .metrics {
      display: flex; gap: 20px; margin-top: auto;
    }
    .metric {
      flex: 1; background: white;
      border: 1px solid rgba(0,0,0,0.06);
      border-radius: 16px; padding: 20px;
    }
    .metric-label { font-size: 11px; color: #5c403d; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
    .metric-value { font-size: 28px; font-weight: 800; color: #1a1c1c; letter-spacing: -0.02em; }
    .metric-change { font-size: 12px; color: #28C840; font-weight: 600; margin-top: 4px; }
    .accent-bar { width: 100%; height: 4px; background: linear-gradient(90deg, #ac0015, #d12429); border-radius: 2px; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="badge"><div class="badge-dot"></div>Relatório Q1 2026</div>
  <h1>Resultados <span>Trimestrais</span></h1>
  <p class="subtitle">Análise completa de performance com foco em receita, novos clientes e expansão de mercado para o primeiro trimestre de 2026.</p>
  <div class="metrics">
    <div class="metric">
      <div class="metric-label">Receita</div>
      <div class="metric-value">R$ 4.2M</div>
      <div class="metric-change">+18% vs Q4</div>
    </div>
    <div class="metric">
      <div class="metric-label">Novos Clientes</div>
      <div class="metric-value">342</div>
      <div class="metric-change">+24% vs Q4</div>
    </div>
    <div class="metric">
      <div class="metric-label">NPS Score</div>
      <div class="metric-value">78</div>
      <div class="metric-change">+5 pontos</div>
    </div>
  </div>
  <div class="accent-bar"></div>
</body>
</html>`;

export default function EditorPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isGenerating, setIsGenerating] = useState(true);
  const [progress, setProgress] = useState(74);

  const handleSendMessage = (msg: string) => {
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Entendido! Estou atualizando os slides com as alterações solicitadas.",
        },
      ]);
    }, 1000);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[--color-surface]">
      {/* Top Navigation */}
      <nav className="h-12 flex items-center px-4 border-b border-zinc-200/40 bg-white/60 glass-panel flex-shrink-0 z-30">
        {/* Left: traffic lights + logo */}
        <div className="flex items-center gap-4">
          <TrafficLights />
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold tight-tracking text-[--color-on-surface]">
              GUIO
            </span>
            <span className="text-[10px] text-[--color-on-surface-variant]/50 font-medium">
              Presentations
            </span>
          </div>
        </div>

        {/* Center: nav tabs */}
        <div className="flex items-center gap-1 ml-8">
          {["Projeto", "Slides", "Temas"].map((tab) => (
            <button
              key={tab}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                tab === "Projeto"
                  ? "bg-zinc-900 text-white"
                  : "text-[--color-on-surface-variant] hover:bg-zinc-100/60"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Search */}
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100/50 transition-colors">
            <span className="material-symbols-outlined text-[18px] text-[--color-on-surface-variant]">
              search
            </span>
          </button>

          {/* History */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[--color-on-surface-variant] hover:bg-zinc-100/50 transition-colors">
            <span className="material-symbols-outlined text-[16px]">
              history
            </span>
            History
          </button>

          {/* Share button */}
          <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg premium-gradient text-white text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">
              share
            </span>
            Share
          </button>

          {/* User avatar */}
          <div className="w-7 h-7 rounded-full bg-[--color-primary-container] flex items-center justify-center text-white text-[10px] font-semibold ml-1">
            GU
          </div>
        </div>
      </nav>

      {/* Main split layout */}
      <div className="flex flex-1 overflow-hidden">
        <ChatPanel
          onSendMessage={handleSendMessage}
          messages={messages}
          isGenerating={isGenerating}
          progress={progress}
        />
        <PreviewPanel
          htmlContent={sampleSlideHTML}
          currentSlide={1}
          totalSlides={5}
        />
      </div>

      {/* LIVE badge */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-full shadow-lg text-xs font-medium">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        LIVE: Presentation Preview
      </div>
    </div>
  );
}
