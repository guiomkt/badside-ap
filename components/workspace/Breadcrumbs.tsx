import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1 text-sm">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && (
              <span className="material-symbols-outlined text-base text-zinc-300">
                chevron_right
              </span>
            )}
            {isLast || !item.href ? (
              <span
                className={
                  isLast
                    ? "font-semibold text-zinc-800"
                    : "text-zinc-400"
                }
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-zinc-400 transition-colors hover:text-zinc-600"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
