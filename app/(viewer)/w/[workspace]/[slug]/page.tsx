"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

const samplePresentationHTML = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      width: 100%; height: 100vh;
      display: flex; flex-direction: column;
      background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
      padding: 64px 80px;
    }
    .badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(172,0,21,0.06); color: #ac0015;
      padding: 8px 18px; border-radius: 100px;
      font-size: 13px; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.05em;
      margin-bottom: 28px; width: fit-content;
    }
    .badge-dot { width: 7px; height: 7px; background: #d12429; border-radius: 50%; }
    h1 {
      font-size: 52px; font-weight: 800;
      color: #1a1c1c; letter-spacing: -0.03em;
      line-height: 1.1; margin-bottom: 16px;
    }
    h1 span { color: #d12429; }
    .subtitle {
      font-size: 18px; color: #5c403d;
      line-height: 1.7; max-width: 600px;
    }
    .metrics {
      display: flex; gap: 24px; margin-top: auto;
    }
    .metric {
      flex: 1; background: white;
      border: 1px solid rgba(0,0,0,0.06);
      border-radius: 20px; padding: 28px;
    }
    .metric-label { font-size: 12px; color: #5c403d; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px; }
    .metric-value { font-size: 36px; font-weight: 800; color: #1a1c1c; letter-spacing: -0.02em; }
    .metric-change { font-size: 14px; color: #28C840; font-weight: 600; margin-top: 6px; }
    .accent-bar { width: 100%; height: 5px; background: linear-gradient(90deg, #ac0015, #d12429); border-radius: 3px; margin-top: 32px; }
  </style>
</head>
<body>
  <div class="badge"><div class="badge-dot"></div>Relat&oacute;rio Q1 2026</div>
  <h1>Resultados <span>Trimestrais</span></h1>
  <p class="subtitle">An&aacute;lise completa de performance com foco em receita, novos clientes e expans&atilde;o de mercado para o primeiro trimestre de 2026.</p>
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

export default function ViewerPage() {
  const [showControls, setShowControls] = useState(false);
  const params = useParams();
  const router = useRouter();

  const workspace = params.workspace as string;
  const slug = params.slug as string;

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <div
      className="h-screen w-screen bg-black relative"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Full viewport iframe */}
      <iframe
        srcDoc={samplePresentationHTML}
        className="w-full h-full border-0"
        title="Presentation Viewer"
        sandbox="allow-scripts"
      />

      {/* Overlay on hover */}
      <div
        className={`absolute inset-0 bg-black/20 transition-opacity duration-300 pointer-events-none ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Top-left: Back button */}
      <button
        onClick={() => router.push(`/w/${workspace}/${slug}/edit`)}
        className={`absolute top-5 left-5 z-20 flex items-center gap-2 bg-white/90 glass-panel text-[--color-on-surface] px-4 py-2 rounded-xl shadow-lg text-sm font-medium transition-all duration-300 hover:bg-white ${
          showControls
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">
          arrow_back
        </span>
        Voltar
      </button>

      {/* Top-right: Edit + Fullscreen */}
      <div
        className={`absolute top-5 right-5 z-20 flex items-center gap-2 transition-all duration-300 ${
          showControls
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <button
          onClick={() => router.push(`/w/${workspace}/${slug}/edit`)}
          className="flex items-center gap-2 bg-white/90 glass-panel text-[--color-on-surface] px-4 py-2 rounded-xl shadow-lg text-sm font-medium hover:bg-white transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
          Editar
        </button>
        <button
          onClick={handleFullscreen}
          className="w-10 h-10 flex items-center justify-center bg-white/90 glass-panel rounded-xl shadow-lg hover:bg-white transition-colors"
        >
          <span className="material-symbols-outlined text-[18px] text-[--color-on-surface]">
            fullscreen
          </span>
        </button>
      </div>
    </div>
  );
}
