"use client";

import { useState, useRef, type ReactNode } from "react";
import "./Folder.css";

function darkenColor(hex: string, amount: number): string {
  let color = hex.replace("#", "");
  if (color.length === 3) {
    color = color.split("").map((c) => c + c).join("");
  }
  const num = parseInt(color, 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount);
  const b = Math.max(0, (num & 0x0000ff) - amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

interface FolderProps {
  color?: string;
  size?: number;
  items?: ReactNode[];
  className?: string;
}

export default function Folder({
  color = "#D12429",
  size = 1,
  items = [],
  className = "",
}: FolderProps) {
  const [open, setOpen] = useState(false);
  const [prevOpen, setPrevOpen] = useState(false);
  const folderRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(!open);
    setPrevOpen(!open);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!folderRef.current || !open) return;
    const rect = folderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    folderRef.current.style.setProperty("--mouse-x", `${x * 0.15}px`);
    folderRef.current.style.setProperty("--mouse-y", `${y * 0.15}px`);
  };

  const papers = items.slice(0, 3);
  const backColor = darkenColor(color, 20);
  const paperColors = [
    darkenColor("#ffffff", 25),
    darkenColor("#ffffff", 13),
    "#ffffff",
  ];

  return (
    <div
      ref={folderRef}
      className={`folder ${open ? "open" : ""} ${prevOpen ? "folder--click" : ""} ${className}`}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      style={
        {
          "--folder-color": color,
          "--folder-back-color": backColor,
          "--paper-1": paperColors[0],
          "--paper-2": paperColors[1],
          "--paper-3": paperColors[2],
          transform: `scale(${size})`,
        } as React.CSSProperties
      }
    >
      <div className="folder__back">
        {papers.map((item, i) => (
          <div
            key={i}
            className="paper"
            style={{
              transform: open
                ? undefined
                : `translate(-50%, 10%) translateX(calc(var(--mouse-x, 0px) * ${(i + 1) * 0.3})) translateY(calc(var(--mouse-y, 0px) * ${(i + 1) * 0.3}))`,
            }}
          >
            {item}
          </div>
        ))}
        <div className="folder__front" />
        <div className="folder__front right" />
      </div>
    </div>
  );
}
