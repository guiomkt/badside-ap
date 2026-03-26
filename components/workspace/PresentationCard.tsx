import Link from "next/link";

interface PresentationCardProps {
  id: string;
  title: string;
  slug: string;
  status: string;
  updated_at: string;
  thumbnail_url: string | null;
  workspace_slug: string;
}

function formatDate(dateStr: string): string {
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
    year: "numeric",
  }).format(date);
}

export default function PresentationCard({
  title,
  slug,
  status,
  updated_at,
  thumbnail_url,
  workspace_slug,
}: PresentationCardProps) {
  const isLive = status === "published" || status === "live";

  return (
    <Link href={`/w/${workspace_slug}/${slug}/edit`} className="group block">
      <div className="overflow-hidden rounded-xl bg-white shadow-[0_10px_40px_rgba(26,28,28,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_50px_rgba(209,36,41,0.08)]">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-zinc-100">
          {thumbnail_url ? (
            <img
              src={thumbnail_url}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-200 to-zinc-300">
              <span className="material-symbols-outlined text-4xl text-zinc-400">
                slideshow
              </span>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute left-3 top-3">
            {isLive ? (
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
            <p className="text-sm text-zinc-400">
              Editado {formatDate(updated_at)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
