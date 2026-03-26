"use client";

import { useState } from "react";

export default function FloatingToolbar() {
  const [zoom, setZoom] = useState(85);
  const [view, setView] = useState<"grid" | "preview">("preview");

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center bg-white/80 glass-panel rounded-full shadow-xl border border-white/40 px-1 py-1 gap-0.5">
      {/* Zoom controls */}
      <div className="flex items-center border-r border-zinc-200/50 pr-1">
        <button
          onClick={() => setZoom((z) => Math.max(25, z - 10))}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100/60 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px] text-[--color-on-surface-variant]">
            zoom_out
          </span>
        </button>
        <span className="text-xs font-medium text-[--color-on-surface] w-10 text-center tabular-nums">
          {zoom}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(200, z + 10))}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100/60 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px] text-[--color-on-surface-variant]">
            zoom_in
          </span>
        </button>
      </div>

      {/* View mode */}
      <div className="flex items-center gap-0.5 px-1">
        <button
          onClick={() => setView("grid")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            view === "grid"
              ? "bg-zinc-900 text-white"
              : "text-[--color-on-surface-variant] hover:bg-zinc-100/60"
          }`}
        >
          Grid
        </button>
        <button
          onClick={() => setView("preview")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            view === "preview"
              ? "bg-zinc-900 text-white"
              : "text-[--color-on-surface-variant] hover:bg-zinc-100/60"
          }`}
        >
          Preview
        </button>
      </div>

      {/* Undo / Redo */}
      <div className="flex items-center gap-0.5 border-l border-zinc-200/50 pl-1">
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100/60 transition-colors">
          <span className="material-symbols-outlined text-[18px] text-[--color-on-surface-variant]">
            undo
          </span>
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100/60 transition-colors">
          <span className="material-symbols-outlined text-[18px] text-[--color-on-surface-variant]">
            redo
          </span>
        </button>
      </div>
    </div>
  );
}
