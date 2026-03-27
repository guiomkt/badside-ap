"use client";

interface ThumbnailStripProps {
  totalSlides: number;
  activeSlide: number;
  onSlideClick: (n: number) => void;
}

export default function ThumbnailStrip({
  totalSlides,
  activeSlide,
  onSlideClick,
}: ThumbnailStripProps) {
  return (
    <div className="w-16 h-full bg-[#f3f3f3]/50 glass-panel flex flex-col items-center py-3 gap-2 overflow-y-auto no-scrollbar flex-shrink-0">
      {Array.from({ length: totalSlides }, (_, i) => i + 1).map((num) => {
        const isActive = num === activeSlide;
        return (
          <button
            key={num}
            onClick={() => onSlideClick(num)}
            className={`relative flex items-center justify-center rounded-sm transition-all flex-shrink-0 ${
              isActive
                ? "w-12 h-8 bg-white ring-2 ring-[#d12429]/40 shadow-sm"
                : "w-10 h-6 bg-zinc-200/50 hover:bg-zinc-200/80"
            }`}
          >
            {isActive && (
              <span className="text-[9px] font-semibold text-[--color-primary]">
                {num}
              </span>
            )}
          </button>
        );
      })}

    </div>
  );
}
