import { Inbox } from "lucide-react";
import { ReactNode } from "react";

export default function EmptyState({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="card p-10 text-center text-[var(--soft)]">
      <Inbox size={32} className="mx-auto mb-3" style={{ color: "var(--faint)" }} />
      <p className="font-semibold text-[var(--ink)] mb-1">{title}</p>
      <p className="text-sm mb-4">{subtitle}</p>
      {action}
    </div>
  );
}
