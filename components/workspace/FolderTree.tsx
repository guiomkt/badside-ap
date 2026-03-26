"use client";

import { useState } from "react";

interface Folder {
  name: string;
  children?: Folder[];
}

interface FolderTreeProps {
  folders: Folder[];
}

function FolderNode({
  folder,
  depth = 0,
}: {
  folder: Folder;
  depth?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = folder.children && folder.children.length > 0;

  return (
    <div>
      <button
        onClick={() => hasChildren && setExpanded(!expanded)}
        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-zinc-100 ${
          hasChildren ? "cursor-pointer" : "cursor-default"
        }`}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        {hasChildren ? (
          <span
            className={`material-symbols-outlined text-base text-zinc-400 transition-transform duration-200 ${
              expanded ? "rotate-90" : ""
            }`}
          >
            chevron_right
          </span>
        ) : (
          <span className="w-5" />
        )}
        <span className="material-symbols-outlined text-base text-zinc-400">
          folder
        </span>
        <span className="truncate font-medium text-zinc-700">
          {folder.name}
        </span>
      </button>
      {expanded &&
        hasChildren &&
        folder.children!.map((child, i) => (
          <FolderNode key={i} folder={child} depth={depth + 1} />
        ))}
    </div>
  );
}

export default function FolderTree({ folders }: FolderTreeProps) {
  return (
    <div className="space-y-0.5">
      {folders.map((folder, i) => (
        <FolderNode key={i} folder={folder} />
      ))}
    </div>
  );
}
