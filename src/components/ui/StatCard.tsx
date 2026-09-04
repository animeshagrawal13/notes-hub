import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { TINT_STYLE, type SubjectTint } from "@/lib/subject-visuals";

/**
 * The dashboard's four metric tiles (§12): 100px tall, one tinted icon square,
 * a 25px value and a muted label. No sparklines, no percentage deltas — there
 * is no historical data behind them and inventing one would be a lie.
 */
export function StatCard({
  label,
  value,
  Icon,
  tint = "sage",
  href,
  hint,
}: {
  label: string;
  value: number | string;
  Icon: LucideIcon;
  tint?: SubjectTint;
  href?: string;
  hint?: string;
}) {
  const body = (
    <>
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-button"
        style={TINT_STYLE[tint]}
      >
        <Icon size={18} strokeWidth={1.8} />
      </span>
      <span className="min-w-0">
        <span className="block text-[25px] font-heading leading-none tracking-[-0.01em] text-ink">
          {value}
        </span>
        <span className="mt-1.5 block truncate text-meta text-muted">{hint ?? label}</span>
      </span>
    </>
  );

  const shell = cn(
    "flex h-[100px] items-center gap-3.5 rounded-card border border-border bg-surface px-4 shadow-card",
    href && "transition duration-calm ease-calm hover:-translate-y-0.5 hover:border-sage-300 hover:shadow-card-hover"
  );

  if (href) {
    return (
      <Link href={href} className={shell} aria-label={label}>
        {body}
      </Link>
    );
  }
  return <div className={shell}>{body}</div>;
}

export default StatCard;

