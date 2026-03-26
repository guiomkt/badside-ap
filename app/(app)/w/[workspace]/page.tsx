"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import PresentationCard from "@/components/workspace/PresentationCard";
import Breadcrumbs from "@/components/workspace/Breadcrumbs";
import EmptyCard from "@/components/dashboard/EmptyCard";

const workspaceMeta: Record<
  string,
  { name: string; description: string }
> = {
  "nike-brazil": {
    name: "Nike Brazil",
    description:
      "Todas as apresentações e decks do time Nike Brazil. Gerencie, edite e publique com a equipe.",
  },
  "apple-inc": {
    name: "Apple Inc.",
    description:
      "Workspace corporativo da Apple Inc. Decks estratégicos e lançamentos de produto.",
  },
  nubank: {
    name: "Nubank",
    description:
      "Apresentações do time Nubank. Pitches, relatórios e workshops internos.",
  },
};

const presentations = [
  {
    title: "Estratégia de Marca Q4",
    thumbnailUrl: "",
    status: "live" as const,
    editedAt: "há 2 horas",
    slug: "estrategia-marca-q4",
  },
  {
    title: "Lançamento de Produto 2025",
    thumbnailUrl: "",
    status: "draft" as const,
    editedAt: "há 5 horas",
    slug: "lancamento-produto-2025",
  },
  {
    title: "Workshop de Cultura Digital",
    thumbnailUrl: "",
    status: "draft" as const,
    editedAt: "há 1 dia",
    slug: "workshop-cultura-digital",
  },
  {
    title: "Relatório Trimestral Q3",
    thumbnailUrl: "",
    status: "live" as const,
    editedAt: "há 3 dias",
    slug: "relatorio-trimestral-q3",
  },
  {
    title: "Pitch Investidores Série C",
    thumbnailUrl: "",
    status: "live" as const,
    editedAt: "há 5 dias",
    slug: "pitch-investidores-serie-c",
  },
];

export default function WorkspacePage() {
  const params = useParams<{ workspace: string }>();
  const [view, setView] = useState<"grid" | "list">("grid");

  const workspace = params.workspace;
  const meta = workspaceMeta[workspace] ?? {
    name: workspace,
    description: "",
  };

  return (
    <div className="mx-auto max-w-7xl p-10">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/" },
          { label: meta.name },
        ]}
      />

      {/* Header */}
      <div className="mt-6 mb-10">
        <h1 className="text-4xl font-black tracking-tighter text-zinc-900">
          Apresentações do {meta.name}
        </h1>
        {meta.description && (
          <p className="mt-2 max-w-2xl text-base text-zinc-500">
            {meta.description}
          </p>
        )}

        {/* View Toggle */}
        <div className="mt-6 flex items-center gap-1 rounded-lg bg-zinc-100 p-1 w-fit">
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

      {/* Presentations Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {presentations.map((p) => (
          <PresentationCard key={p.slug} {...p} />
        ))}
        <EmptyCard
          title="Criar Nova Apresentação"
          description="Comece um novo deck do zero ou use um template"
          onClick={() => {}}
        />
      </div>

      {/* FAB */}
      <div className="fixed bottom-10 right-10 z-50 group">
        <button
          className="flex h-16 w-16 items-center justify-center rounded-full bg-[#d12429] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#ac0015] hover:shadow-xl active:scale-95"
          onClick={() => {}}
        >
          <span className="material-symbols-outlined text-2xl">
            auto_awesome
          </span>
        </button>
        {/* Tooltip */}
        <span className="pointer-events-none absolute bottom-full right-0 mb-3 whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          Criar com IA
        </span>
      </div>
    </div>
  );
}
