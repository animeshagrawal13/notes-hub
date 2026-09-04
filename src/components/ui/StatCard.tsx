import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { TINT_STYLE, type SubjectTint } from "@/lib/subject-visuals";

/**
 * The dashboard's metric tiles: a tinted icon chip up top, a large value, a
 * quiet label underneath. No sparklines, no percentage deltas — there is no
 * historical data behind them and inventing one would be a lie.
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
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-input"
        style={TINT_STYLE[tint]}
      >
        <Icon size={19} strokeWidth={1.8} />
      </span>
      <span className="mt-3 block text-[28px] font-heading leading-none tracking-[-0.015em] text-ink">
        {value}
      </span>
      <span className="mt-1.5 block truncate text-meta text-muted">{hint ?? label}</span>
    </>
  );

  const shell = cn(
    "flex min-h-[116px] flex-col justify-center rounded-md border border-border bg-surface px-4.5 py-4 shadow-sm",
    href && "transition duration-calm ease-calm hover:-translate-y-0.5 hover:border-sage-300 hover:shadow-md"
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
