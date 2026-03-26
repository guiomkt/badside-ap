"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TrafficLights from "@/components/layout/TrafficLights";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Workspaces", icon: "workspaces", active: true },
  { label: "Favoritos", icon: "star", active: false },
  { label: "Recentes", icon: "schedule", active: false },
];

const clients = [
  { name: "Cliente Alpha", icon: "folder" },
  { name: "Cliente Beta", icon: "folder" },
  { name: "Cliente Gamma", icon: "folder" },
];

interface UserInfo {
  name: string;
  email: string;
  initials: string;
}

export default function Sidebar() {
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "User";
        const email = user.email || "";
        const initials = name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
        setUser({ name, email, initials });
      }
    }
    getUser();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-white/80 backdrop-blur-xl border-r border-zinc-200/50 flex flex-col z-50">
      {/* Traffic Lights */}
      <div className="px-5 pt-5 pb-2">
        <TrafficLights />
      </div>

      {/* Branding */}
      <div className="px-5 pt-3 pb-4">
        <h1 className="text-base font-bold tight-tracking text-[--color-on-surface]">
          GUIO Presentations
        </h1>
        <p className="text-xs text-[--color-on-surface-variant] mt-0.5">
          AI-Powered
        </p>
      </div>

      {/* New Presentation Button */}
      <div className="px-4 pb-4">
        <button className="w-full flex items-center justify-center gap-2 bg-[--color-primary-container] text-white rounded-xl py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined text-[20px]">add</span>
          New Presentation
        </button>
      </div>

      {/* Navigation */}
      <nav className="px-2 flex-1 overflow-y-auto no-scrollbar">
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.label}>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  item.active
                    ? "bg-zinc-100/50 text-[--color-primary] font-medium border-l-2 border-[--color-primary]"
                    : "text-[--color-on-surface-variant] hover:bg-zinc-100/30"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Clientes Ativos */}
        <div className="mt-6">
          <h3 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[--color-on-surface-variant]/60 mb-2">
            Clientes Ativos
          </h3>
          <ul className="space-y-0.5">
            {clients.map((client) => (
              <li key={client.name}>
                <button
                  onClick={() =>
                    setExpandedClient(
                      expandedClient === client.name ? null : client.name
                    )
                  }
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[--color-on-surface-variant] hover:bg-zinc-100/30 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {expandedClient === client.name
                      ? "folder_open"
                      : "folder"}
                  </span>
                  {client.name}
                  <span className="material-symbols-outlined text-[16px] ml-auto">
                    {expandedClient === client.name
                      ? "expand_less"
                      : "expand_more"}
                  </span>
                </button>
                {expandedClient === client.name && (
                  <ul className="ml-8 mt-1 space-y-1">
                    <li className="text-xs text-[--color-on-surface-variant]/60 py-1 px-2">
                      Nenhum projeto ainda
                    </li>
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-zinc-200/50 px-2 py-3 space-y-0.5">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[--color-on-surface-variant] hover:bg-zinc-100/30 transition-colors">
          <span className="material-symbols-outlined text-[20px]">settings</span>
          Settings
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[--color-on-surface-variant] hover:bg-zinc-100/30 transition-colors">
          <span className="material-symbols-outlined text-[20px]">help</span>
          Help
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 px-3 py-2 mt-2">
          <div className="w-8 h-8 rounded-full bg-[--color-primary-container] flex items-center justify-center text-white text-xs font-semibold">
            {user?.initials || ".."}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[--color-on-surface] truncate">
              {user?.name || "Carregando..."}
            </p>
            <p className="text-[11px] text-[--color-on-surface-variant] truncate">
              {user?.email || ""}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            title="Sair"
            className="p-1 rounded-lg text-[--color-on-surface-variant] hover:bg-zinc-100/30 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              logout
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
