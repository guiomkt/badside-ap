"use client";

import Link from "next/link";

interface PresentationCardProps {
  title: string;
  thumbnailUrl: string;
  status: "live" | "draft";
  editedAt: string;
  slug: string;
}

export default function PresentationCard({
  title,
  thumbnailUrl,
  status,
  editedAt,
  slug,
}: PresentationCardProps) {
  return (
    <Link href={`/d/${slug}`} className="group block">
      <div className="overflow-hidden rounded-xl bg-white shadow-[0_10px_40px_rgba(26,28,28,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_50px_rgba(209,36,41,0.08)]">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-zinc-100">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-zinc-200 to-zinc-300" />
          )}

          {/* Status Badge */}
          <div className="absolute left-3 top-3">
            {status === "live" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                Live
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-zinc-500/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                Draft
              </span>
            )}
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-lg">
              <span className="material-symbols-outlined text-lg">
                slideshow
              </span>
              Abrir Deck
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5">
          <h3 className="text-lg font-bold tracking-[-0.022em] text-zinc-900">
            {title}
          </h3>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm text-zinc-400">Editado {editedAt}</p>
            <div className="flex -space-x-1.5">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="h-6 w-6 rounded-full border-2 border-white bg-gradient-to-br from-zinc-300 to-zinc-400"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
