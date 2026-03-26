"use client";

import { useState } from "react";
import WorkspaceCard from "@/components/dashboard/WorkspaceCard";
import EmptyCard from "@/components/dashboard/EmptyCard";
import ActivityList from "@/components/dashboard/ActivityList";
import CreateWorkspaceModal from "@/components/dashboard/CreateWorkspaceModal";

interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  created_at: string;
  workspace_members: { count: number }[];
  presentations: { count: number }[];
}

interface Activity {
  id: string;
  title: string;
  status: string;
  updated_at: string;
  workspaces: { name: string } | null;
}

function formatRelative(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "agora mesmo";
  if (diffHours < 24) return `há ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
  if (diffDays < 7) return `há ${diffDays} dia${diffDays > 1 ? "s" : ""}`;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
  }).format(date);
}

function statusLabel(status: string): string {
  switch (status) {
    case "published":
    case "live":
      return "Finalizado";
    case "draft":
      return "Em Rascunho";
    default:
      return status;
  }
}

export default function DashboardClient({
  workspaces,
  recentPresentations,
}: {
  workspaces: Workspace[];
  recentPresentations: Activity[];
}) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [modalOpen, setModalOpen] = useState(false);

  const hasWorkspaces = workspaces.length > 0;

  const activityItems = recentPresentations.map((p) => ({
    title: p.title,
    subtitle: `${p.workspaces?.name ?? "Workspace"} · ${formatRelative(p.updated_at)}`,
    status: statusLabel(p.status),
    icon: p.status === "draft" ? "edit_note" : "slideshow",
  }));

  return (
    <>
      <div className="mx-auto max-w-7xl p-10">
        {/* Header */}
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ac0015]">
            Visão Geral
          </span>
          <div className="mt-2 flex items-end justify-between">
            <h1 className="text-4xl font-extrabold tracking-[-0.022em] text-zinc-900">
              Seus Workspaces
            </h1>
            {hasWorkspaces && (
              <div className="flex items-center gap-1 rounded-lg bg-zinc-100 p-1">
                <button
                  onClick={() => setView("grid")}
                  className={`rounded-md p-2 transition-colors ${
                    view === "grid"
                      ? "bg-white text-zinc-900 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">
                    grid_view
                  </span>
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`rounded-md p-2 transition-colors ${
                    view === "list"
                      ? "bg-white text-zinc-900 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">
                    list
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {!hasWorkspaces && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 px-8 py-20 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#d12429]/10">
              <span className="material-symbols-outlined text-4xl text-[#d12429]">
                workspaces
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-zinc-900">
              Nenhum workspace ainda
            </h2>
            <p className="mt-2 max-w-md text-base text-zinc-500">
              Crie seu primeiro workspace para começar a organizar e criar
              apresentações incríveis com sua equipe.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#d12429] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#ac0015]"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Criar Primeiro Workspace
            </button>
          </div>
        )}

        {/* Workspace Grid */}
        {hasWorkspaces && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((ws) => (
              <WorkspaceCard
                key={ws.id}
                id={ws.id}
                name={ws.name}
                slug={ws.slug}
                logo_url={ws.logo_url}
                created_at={ws.created_at}
                presentationCount={ws.presentations?.[0]?.count ?? 0}
                memberCount={ws.workspace_members?.[0]?.count ?? 0}
              />
            ))}
            <EmptyCard
              title="Novo Workspace"
              description="Crie um novo espaço de trabalho"
              onClick={() => setModalOpen(true)}
            />
          </div>
        )}

        {/* Activity Section */}
        {activityItems.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-extrabold tracking-[-0.022em] text-zinc-900">
              Atividade Recente
            </h2>
            <ActivityList items={activityItems} />
          </div>
        )}
      </div>

      <CreateWorkspaceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
