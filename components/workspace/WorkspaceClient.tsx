"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PresentationCard from "@/components/workspace/PresentationCard";
import Breadcrumbs from "@/components/workspace/Breadcrumbs";
import EmptyCard from "@/components/dashboard/EmptyCard";

interface Presentation {
  id: string;
  title: string;
  slug: string;
  status: string;
  updated_at: string;
  thumbnail_url: string | null;
}

interface WorkspaceData {
  id: string;
  name: string;
  slug: string;
}

export default function WorkspaceClient({
  workspace,
  presentations,
}: {
  workspace: WorkspaceData;
  presentations: Presentation[];
}) {
  const router = useRouter();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [creating, setCreating] = useState(false);

  const hasPresentations = presentations.length > 0;

  async function handleCreatePresentation() {
    setCreating(true);
    try {
      const res = await fetch(`/w/${workspace.slug}/new`, {
        method: "POST",
        redirect: "follow",
      });

      if (res.redirected) {
        router.push(res.url);
        return;
      }

      // Fallback: create via API and navigate
      const apiRes = await fetch("/api/presentations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspace_id: workspace.id }),
      });

      if (apiRes.ok) {
        const data = await apiRes.json();
        router.push(`/w/${workspace.slug}/${data.slug}/edit`);
      }
    } catch {
      // If redirect doesn't work, try API directly
      const apiRes = await fetch("/api/presentations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspace_id: workspace.id }),
      });

      if (apiRes.ok) {
        const data = await apiRes.json();
        router.push(`/w/${workspace.slug}/${data.slug}/edit`);
      }
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-10">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/" },
          { label: workspace.name },
        ]}
      />

      {/* Header */}
      <div className="mt-6 mb-10">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900">
            Apresentações do {workspace.name}
          </h1>
          <button
            onClick={handleCreatePresentation}
            disabled={creating}
            className="inline-flex items-center gap-2 rounded-lg bg-[#d12429] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#ac0015] disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            {creating ? "Criando..." : "Nova Apresentação"}
          </button>
        </div>

        {/* View Toggle */}
        {hasPresentations && (
          <div className="mt-6 flex w-fit items-center gap-1 rounded-lg bg-zinc-100 p-1">
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
        )}
      </div>

      {/* Empty State */}
      {!hasPresentations && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 px-8 py-20 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#d12429]/10">
            <span className="material-symbols-outlined text-4xl text-[#d12429]">
              slideshow
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-zinc-900">
            Nenhuma apresentação ainda
          </h2>
          <p className="mt-2 max-w-md text-base text-zinc-500">
            Crie sua primeira apresentação para começar a trabalhar neste
            workspace.
          </p>
          <button
            onClick={handleCreatePresentation}
            disabled={creating}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#d12429] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#ac0015] disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            {creating ? "Criando..." : "Criar Primeira Apresentação"}
          </button>
        </div>
      )}

      {/* Presentations Grid */}
      {hasPresentations && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {presentations.map((p) => (
            <PresentationCard
              key={p.id}
              id={p.id}
              title={p.title}
              slug={p.slug}
              status={p.status}
              updated_at={p.updated_at}
              thumbnail_url={p.thumbnail_url}
              workspace_slug={workspace.slug}
            />
          ))}
          <EmptyCard
            title="Criar Nova Apresentação"
            description="Comece um novo deck do zero ou use um template"
            onClick={handleCreatePresentation}
          />
        </div>
      )}

      {/* FAB */}
      <div className="fixed bottom-10 right-10 z-50 group">
        <button
          className="flex h-16 w-16 items-center justify-center rounded-full bg-[#d12429] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#ac0015] hover:shadow-xl active:scale-95"
          onClick={handleCreatePresentation}
          disabled={creating}
        >
          <span className="material-symbols-outlined text-2xl">
            auto_awesome
          </span>
        </button>
        <span className="pointer-events-none absolute bottom-full right-0 mb-3 whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          Criar com IA
        </span>
      </div>
    </div>
  );
}
