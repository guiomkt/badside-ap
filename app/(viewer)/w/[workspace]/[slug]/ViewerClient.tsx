"use client";

import { useState } from "react";
import Link from "next/link";

interface Props {
  htmlContent: string;
  title: string;
  workspaceSlug: string;
  presentationSlug: string;
}

export default function ViewerClient({ htmlContent, title, workspaceSlug, presentationSlug }: Props) {
  const [showControls, setShowControls] = useState(false);

  if (!htmlContent) {
    return (
      <div className="h-screen w-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-zinc-600 mb-4 block">slideshow</span>
          <h1 className="text-xl font-bold text-white mb-2">Apresentação não gerada</h1>
          <p className="text-zinc-500 mb-6">Esta apresentação ainda não tem conteúdo.</p>
          <Link
            href={`/w/${workspaceSlug}/${presentationSlug}/edit`}
            className="px-6 py-3 bg-[#d12429] text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Ir para o Editor
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-screen w-screen relative bg-black"
      onMouseMove={() => {
        setShowControls(true);
        clearTimeout((window as any).__viewerTimeout);
        (window as any).__viewerTimeout = setTimeout(() => setShowControls(false), 3000);
      }}
    >
      {/* Presentation iframe */}
      <iframe
        srcDoc={htmlContent}
        className="w-full h-full border-none"
        title={title}
        sandbox="allow-scripts allow-same-origin"
      />

      {/* Controls overlay */}
      <div
        className={`absolute inset-x-0 top-0 h-16 flex items-center justify-between px-6 bg-gradient-to-b from-black/60 to-transparent transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Link
          href={`/w/${workspaceSlug}`}
          className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Voltar
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/w/${workspaceSlug}/${presentationSlug}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg backdrop-blur transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Editar
          </Link>
        </div>
      </div>
    </div>
  );
}
