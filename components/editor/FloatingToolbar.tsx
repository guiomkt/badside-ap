"use client";

import Link from "next/link";

interface Props {
  currentSlide: number;
  totalSlides: number;
  workspaceSlug: string;
  presentationSlug: string;
}

export default function FloatingToolbar({ currentSlide, totalSlides, workspaceSlug, presentationSlug }: Props) {
  if (totalSlides === 0) return null;

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 bg-white/80 backdrop-blur-xl px-5 py-2 rounded-full flex items-center gap-4 shadow-lg border border-white/40">
      <span className="text-xs font-medium text-zinc-500">
        Slide {currentSlide} de {totalSlides}
      </span>
      <div className="w-px h-5 bg-zinc-200" />
      <Link
        href={`/w/${workspaceSlug}/${presentationSlug}`}
        target="_blank"
        className="flex items-center gap-2 px-4 py-1.5 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800 transition-colors"
      >
        <span className="material-symbols-outlined text-[16px]">play_arrow</span>
        Apresentar
      </Link>
    </div>
  );
}
