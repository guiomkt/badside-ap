interface SlideIndicatorProps {
  current: number;
  total: number;
  statusText: string;
}

export default function SlideIndicator({
  current,
  total,
  statusText,
}: SlideIndicatorProps) {
  return (
    <div className="flex items-center gap-3 bg-white/50 px-5 py-2 rounded-full border border-white/40 shadow-sm">
      {/* Dots */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }, (_, i) => i + 1).map((num) => (
          <div
            key={num}
            className={`h-2 rounded-full transition-all ${
              num === current
                ? "w-6 bg-[--color-primary-container]"
                : "w-2 bg-zinc-300/60"
            }`}
          />
        ))}
      </div>

      {/* Text */}
      <span className="text-xs text-[--color-on-surface-variant]">
        Slide {current} of {total} — {statusText}
      </span>
    </div>
  );
}
