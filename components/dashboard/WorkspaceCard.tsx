import Link from "next/link";
import Folder from "@/components/ui/Folder";

interface WorkspaceCardProps {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  created_at: string;
  presentationCount: number;
  memberCount: number;
}

export default function WorkspaceCard({
  name,
  slug,
  presentationCount,
  memberCount,
}: WorkspaceCardProps) {
  const papers = [
    <div key="1" className="w-full h-full bg-gradient-to-b from-zinc-100 to-zinc-200 flex items-center justify-center">
      <span className="text-[8px] font-bold text-zinc-400">SLIDE</span>
    </div>,
    <div key="2" className="w-full h-full bg-gradient-to-b from-zinc-50 to-zinc-150 flex items-center justify-center">
      <span className="text-[8px] font-bold text-zinc-300">DECK</span>
    </div>,
    <div key="3" className="w-full h-full bg-white flex items-center justify-center">
      <span className="text-[8px] font-bold text-zinc-200">NEW</span>
    </div>,
  ];

  return (
    <Link href={`/w/${slug}`} className="group block cursor-pointer">
      <div className="relative rounded-xl bg-white p-8 shadow-[0_10px_40px_rgba(26,28,28,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_50px_rgba(209,36,41,0.08)]">
        <div className="flex flex-col items-center text-center">
          {/* Folder icon */}
          <div className="mb-6 flex items-center justify-center" style={{ height: 120 }}>
            <Folder
              color="#D12429"
              size={1.2}
              items={papers}
            />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold tracking-[-0.022em] text-zinc-900">
            {name}
          </h3>

          {/* Subtitle */}
          <p className="mt-1 text-sm text-zinc-500">
            {presentationCount} apresentações
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between border-t border-zinc-100 pt-5">
          {/* Avatar Stack */}
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {Array.from({ length: Math.min(memberCount, 3) }).map((_, i) => (
                <div
                  key={i}
                  className="h-7 w-7 rounded-full border-2 border-white bg-gradient-to-br from-zinc-300 to-zinc-400"
                />
              ))}
            </div>
            {memberCount > 3 && (
              <span className="ml-2 text-xs font-medium text-zinc-400">
                +{memberCount - 3}
              </span>
            )}
          </div>

          {/* Open Link */}
          <span className="text-sm font-semibold text-[#d12429] transition-colors group-hover:text-[#ac0015]">
            Abrir &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
