interface ActivityItem {
  title: string;
  subtitle: string;
  status: string;
  icon: string;
}

interface ActivityListProps {
  items: ActivityItem[];
}

function StatusBadge({ status }: { status: string }) {
  const isFinished = status === "Finalizado";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
        isFinished
          ? "bg-zinc-100 text-zinc-500"
          : "bg-[#d12429]/10 text-[#d12429]"
      }`}
    >
      {status}
    </span>
  );
}

export default function ActivityList({ items }: ActivityListProps) {
  return (
    <div className="divide-y divide-zinc-100 rounded-2xl bg-white shadow-[0_10px_40px_rgba(26,28,28,0.04)]">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-zinc-50/50"
        >
          {/* Icon */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-zinc-50">
            <span className="material-symbols-outlined text-xl text-zinc-500">
              {item.icon}
            </span>
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-zinc-800">
              {item.title}
            </p>
            <p className="mt-0.5 text-xs text-zinc-400">{item.subtitle}</p>
          </div>

          {/* Status */}
          <StatusBadge status={item.status} />
        </div>
      ))}
    </div>
  );
}
