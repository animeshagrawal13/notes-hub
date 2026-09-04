import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { subjectVisual, TINT_STYLE } from "@/lib/subject-visuals";

type Props = {
  id: string;
  name: string;
  code?: string | null;
  notes: number;
  pyqs?: number;
  layout?: "grid" | "list";
  className?: string;
};

/**
 * A subject looks the same wherever it appears (§17): tinted icon square, name,
 * one meta line. `layout="list"` is the same card laid on its side for the
 * /subjects list toggle — deliberately not a different component, so the two
 * views can never drift apart.
 */
export function SubjectCard({ id, name, code, notes, pyqs = 0, layout = "grid", className }: Props) {
  const { Icon, tint } = subjectVisual(name);
  const meta = [`${notes} ${notes === 1 ? "Note" : "Notes"}`, pyqs > 0 && `${pyqs} PYQs`]
    .filter(Boolean)
    .join(" · ");

  const lift =
    "transition duration-calm ease-calm hover:-translate-y-0.5 hover:border-sage-300 hover:shadow-card-hover";

  if (layout === "list") {
    return (
      <Link
        href={`/subjects/${id}`}
        className={cn(
          "group flex items-center gap-3.5 rounded-card border border-border bg-surface px-4 py-3.5 shadow-card",
          lift,
          className
        )}
      >
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-button"
          style={TINT_STYLE[tint]}
        >
          <Icon size={19} strokeWidth={1.8} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-card-title font-semibold text-ink">{name}</span>
          <span className="mt-0.5 block text-meta text-muted">
            {code ? `${code} · ${meta}` : meta}
          </span>
        </span>
        <ChevronRight
          size={17}
          strokeWidth={1.8}
          className="shrink-0 text-muted transition duration-calm ease-calm group-hover:text-sage-600"
        />
      </Link>
    );
  }

  return (
    <Link
      href={`/subjects/${id}`}
      className={cn(
        "flex h-[178px] flex-col justify-between rounded-card border border-border bg-surface p-4 shadow-card",
        lift,
        className
      )}
    >
      <span
        className="flex h-[46px] w-[46px] items-center justify-center rounded-input"
        style={TINT_STYLE[tint]}
      >
        <Icon size={22} strokeWidth={1.8} />
      </span>
      <span className="block">
        <span className="line-clamp-2 block text-card-title font-semibold leading-snug text-ink">{name}</span>
        {code && <span className="mt-1 block text-micro text-muted">{code}</span>}
        <span className="mt-2 block text-meta text-secondary">{meta}</span>
      </span>
    </Link>
  );
}

export default SubjectCard;

