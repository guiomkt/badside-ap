"use client";

interface EmptyCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

export default function EmptyCard({ title, description, onClick }: EmptyCardProps) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-transparent p-8 transition-all duration-300 hover:border-[#d12429]/30 hover:bg-[#ac0015]/5"
    >
      {/* Plus Icon */}
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 transition-colors duration-300 group-hover:bg-[#d12429]/10">
        <span className="material-symbols-outlined text-3xl text-zinc-400 transition-colors duration-300 group-hover:text-[#d12429]">
          add
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold tracking-[-0.022em] text-zinc-700 transition-colors group-hover:text-zinc-900">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-1 text-sm text-zinc-400 transition-colors group-hover:text-zinc-500">
        {description}
      </p>
    </button>
  );
}
