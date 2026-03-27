"use client";

import { use, useState } from "react";
import Link from "next/link";
import ChatPanel from "@/components/editor/ChatPanel";
import PreviewPanel from "@/components/editor/PreviewPanel";
import ShareModal from "@/components/editor/ShareModal";
import { usePresentation } from "@/lib/hooks/usePresentation";

export default function EditorPage({
  params,
}: {
  params: Promise<{ workspace: string; slug: string }>;
}) {
  const { workspace, slug } = use(params);
  const {
    presentation,
    messages,
    isLoading,
    isGenerating,
    progress,
    error,
    sendMessage,
  } = usePresentation(workspace, slug);

  const [shareOpen, setShareOpen] = useState(false);

  const slideData = presentation?.slide_data as Record<string, unknown> | undefined;
  const slides = slideData?.slides as unknown[] | undefined;
  const slideCount = slides?.length ?? 0;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[--color-surface]">
      {/* Top Navigation */}
      <nav className="h-12 flex items-center px-4 border-b border-zinc-200/40 bg-white/60 glass-panel flex-shrink-0 z-30">
        {/* Left: back button + logo */}
        <div className="flex items-center gap-3">
          <Link
            href={`/w/${workspace}`}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100/50 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-[--color-on-surface-variant]">
              arrow_back
            </span>
          </Link>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold tight-tracking text-[--color-on-surface]">
              GUIO
            </span>
            <span className="text-[10px] text-[--color-on-surface-variant]/50 font-medium">
              Presentations
            </span>
          </div>
        </div>

        {/* Center: title */}
        {presentation && (
          <div className="flex items-center gap-2 ml-4">
            <span className="text-xs text-[--color-on-surface-variant]/60">
              /
            </span>
            <span className="text-xs font-medium text-[--color-on-surface] truncate max-w-[200px]">
              {presentation.title || "Untitled"}
            </span>
            {presentation.status === "generated" && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                Saved
              </span>
            )}
          </div>
        )}

        {/* Right section */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Apresentar button */}
          <Link
            href={`/w/${workspace}/${slug}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[--color-on-surface-variant] hover:bg-zinc-100/50 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">
              slideshow
            </span>
            Apresentar
          </Link>

          {/* Share button */}
          <button
            onClick={() => setShareOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg premium-gradient text-white text-xs font-semibold"
          >
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
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-zinc-300 border-t-[#d12429] rounded-full animate-spin" />
              <span className="text-sm text-[--color-on-surface-variant]">
                Carregando apresentação...
              </span>
            </div>
          </div>
        ) : (
          <>
            <ChatPanel
              onSendMessage={sendMessage}
              messages={messages}
              isGenerating={isGenerating}
              progress={progress}
              error={error}
            />
            <PreviewPanel
              htmlContent={presentation?.html_content ?? undefined}
              currentSlide={1}
              totalSlides={slideCount}
              workspaceSlug={workspace}
              presentationSlug={slug}
            />
          </>
        )}
      </div>

      {/* LIVE badge */}
      {isGenerating && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-full shadow-lg text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          IA Gerando...
        </div>
      )}

      {/* Share Modal */}
      {presentation && (
        <ShareModal
          presentationId={presentation.id}
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
        />
      )}
    </div>
  );
}
