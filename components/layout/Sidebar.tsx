"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface Workspace {
  id: string;
  name: string;
  slug: string;
}

interface UserInfo {
  name: string;
  email: string;
  initials: string;
}

export default function Sidebar() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [user, setUser] = useState<UserInfo | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();

      // Load user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const name =
          authUser.user_metadata?.full_name ||
          authUser.user_metadata?.name ||
          authUser.email?.split("@")[0] ||
          "User";
        const email = authUser.email || "";
        const initials = name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
        setUser({ name, email, initials });
      }

      // Load workspaces
      const { data: ws } = await supabase
        .from("workspaces")
        .select("id, name, slug")
        .order("created_at", { ascending: false });
      if (ws) setWorkspaces(ws);
    }
    loadData();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const isActive = (path: string) => pathname === path;
  const isWorkspaceActive = (slug: string) => pathname.startsWith(`/w/${slug}`);

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-white/80 backdrop-blur-xl border-r border-zinc-200/50 flex flex-col z-50">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 flex items-center gap-3">
        <Image
          src="/images/logo-vermelha.png"
          alt="GUIO"
          width={32}
          height={32}
          className="w-8 h-8 object-contain"
        />
        <div>
          <h1 className="text-base font-bold tight-tracking text-[--color-on-surface]">
            GUIO Presentations
          </h1>
          <p className="text-[10px] text-[--color-on-surface-variant] mt-0.5">
            AI-Powered
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-2 flex-1 overflow-y-auto no-scrollbar">
        <ul className="space-y-0.5">
          <li>
            <Link
              href="/"
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive("/")
                  ? "bg-zinc-100/50 text-[--color-primary] font-medium border-l-2 border-[--color-primary]"
                  : "text-[--color-on-surface-variant] hover:bg-zinc-100/30"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">workspaces</span>
              Workspaces
            </Link>
          </li>
        </ul>

        {/* Workspaces list */}
        {workspaces.length > 0 && (
          <div className="mt-6">
            <h3 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[--color-on-surface-variant]/60 mb-2">
              Seus Workspaces
            </h3>
            <ul className="space-y-0.5">
              {workspaces.map((ws) => (
                <li key={ws.id}>
                  <Link
                    href={`/w/${ws.slug}`}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isWorkspaceActive(ws.slug)
                        ? "bg-zinc-100/50 text-[--color-primary] font-medium"
                        : "text-[--color-on-surface-variant] hover:bg-zinc-100/30"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {isWorkspaceActive(ws.slug) ? "folder_open" : "folder"}
                    </span>
                    {ws.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-zinc-200/50 px-2 py-3">
        {/* User */}
        <div className="flex items-center gap-3 px-3 py-2">
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
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
