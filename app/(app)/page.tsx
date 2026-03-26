"use client";

import { useState } from "react";
import WorkspaceCard from "@/components/dashboard/WorkspaceCard";
import EmptyCard from "@/components/dashboard/EmptyCard";
import ActivityList from "@/components/dashboard/ActivityList";

const workspaces = [
  {
    name: "Nike Brazil",
    logoUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/nike.svg",
    presentationCount: 12,
    memberCount: 8,
    slug: "nike-brazil",
  },
  {
    name: "Apple Inc.",
    logoUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apple.svg",
    presentationCount: 28,
    memberCount: 14,
    slug: "apple-inc",
  },
  {
    name: "Nubank",
    logoUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/nubank.svg",
    presentationCount: 4,
    memberCount: 3,
    slug: "nubank",
  },
];

const activities = [
  {
    title: "Estratégia de Marca Q4 2025",
    subtitle: "Nike Brazil · há 2 horas",
    status: "Finalizado",
    icon: "slideshow",
  },
  {
    title: "Lançamento de Produto 2025",
    subtitle: "Apple Inc. · há 5 horas",
    status: "Em Rascunho",
    icon: "edit_note",
  },
  {
    title: "Workshop de Cultura Digital",
    subtitle: "Nubank · há 1 dia",
    status: "Em Rascunho",
    icon: "groups",
  },
  {
    title: "Relatório Trimestral Q3",
    subtitle: "Nike Brazil · há 3 dias",
    status: "Finalizado",
    icon: "analytics",
  },
  {
    title: "Pitch Investidores Série C",
    subtitle: "Nubank · há 5 dias",
    status: "Finalizado",
    icon: "trending_up",
  },
];

export default function DashboardPage() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
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
              <span className="material-symbols-outlined text-xl">list</span>
            </button>
          </div>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workspaces.map((ws) => (
          <WorkspaceCard key={ws.slug} {...ws} />
        ))}
        <EmptyCard
          title="Novo Workspace"
          description="Crie um novo espaço de trabalho"
          onClick={() => {}}
        />
      </div>

      {/* Activity Section */}
      <div className="mt-16">
        <h2 className="mb-6 text-2xl font-extrabold tracking-[-0.022em] text-zinc-900">
          Atividade Recente
        </h2>
        <ActivityList items={activities} />
      </div>
    </div>
  );
}
