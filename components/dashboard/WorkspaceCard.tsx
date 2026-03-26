"use client";

import Link from "next/link";

interface WorkspaceCardProps {
  name: string;
  logoUrl: string;
  presentationCount: number;
  memberCount: number;
  slug: string;
}

export default function WorkspaceCard({
  name,
  logoUrl,
  presentationCount,
  memberCount,
  slug,
}: WorkspaceCardProps) {
  return (
    <Link href={`/w/${slug}`} className="group block">
      <div className="relative rounded-xl bg-white p-8 shadow-[0_10px_40px_rgba(26,28,28,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_50px_rgba(209,36,41,0.08)]">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-zinc-50">
            <img
              src={logoUrl}
              alt={`${name} logo`}
              className="h-14 w-14 object-contain grayscale transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0"
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
