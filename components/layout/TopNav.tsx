"use client";

const tabs = ["Workspace", "Cliente", "Projeto"];

interface TopNavProps {
  activeTab?: string;
  actions?: React.ReactNode;
}

export default function TopNav({ activeTab = "Workspace", actions }: TopNavProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-zinc-200/50">
      <div className="flex items-center justify-between h-14 px-6">
        {/* Left */}
        <div className="flex items-center gap-6">
          <span className="text-xl font-black tight-tracking text-[--color-on-surface]">
            GUIO
          </span>

          <nav className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeTab === tab
                    ? "bg-zinc-100 text-[--color-on-surface] font-medium"
                    : "text-[--color-on-surface-variant] hover:bg-zinc-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[--color-on-surface-variant]">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar..."
              className="w-56 pl-9 pr-4 py-2 rounded-full bg-[--color-surface-container-low] text-sm text-[--color-on-surface] placeholder:text-[--color-on-surface-variant]/50 outline-none focus:ring-1 focus:ring-[--color-outline-variant] transition-shadow"
            />
          </div>

          <button className="p-2 rounded-lg text-[--color-on-surface-variant] hover:bg-zinc-100/50 transition-colors">
            <span className="material-symbols-outlined text-[20px]">history</span>
          </button>

          {actions}

          <button className="p-2 rounded-lg text-[--color-on-surface-variant] hover:bg-zinc-100/50 transition-colors">
            <span className="material-symbols-outlined text-[20px]">more_vert</span>
          </button>
        </div>
      </div>
    </header>
  );
}
