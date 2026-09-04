import { cn } from "@/lib/cn";
import NoteListItem, { type NoteRowData } from "./NoteListItem";
import EmptyState from "./EmptyState";

/**
 * The §20 notes table: a hairline-separated list inside the standard card
 * surface. Column widths live in NoteListItem so the header can never fall out
 * of step with the rows.
 */
export function NoteListTable({
  notes,
  emptyTitle = "No notes here yet",
  emptyBody,
  className,
}: {
  notes: NoteRowData[];
  emptyTitle?: string;
  emptyBody?: string;
  className?: string;
}) {
  if (notes.length === 0) {
    return <EmptyState title={emptyTitle} body={emptyBody} className={className} />;
  }

  return (
    <div className={cn("overflow-hidden rounded-card border border-border bg-surface shadow-card", className)}>
      <div className="flex items-center gap-3 border-b border-border-light bg-elevated px-4 py-2.5 text-micro font-semibold uppercase tracking-[0.06em] text-muted">
        <span className="w-[17px] shrink-0" aria-hidden />
        <span className="min-w-0 flex-1">Title</span>
        <span className="hidden w-[104px] shrink-0 sm:block">Type</span>
        <span className="hidden w-[150px] shrink-0 lg:block">Uploaded by</span>
        <span className="w-[74px] shrink-0 text-right">Updated</span>
      </div>
      <ul className="divide-y divide-[color:var(--border-light)]">
        {notes.map((note) => (
          <li key={note.id}>
            <NoteListItem note={note} variant="table" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NoteListTable;

