import Link from "next/link";
import { File, FileText, Image as ImageIcon, Presentation, Sheet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { relativeTime } from "@/lib/format";
import { TypeBadge } from "./Badge";

export type NoteRowData = {
  id: string;
  title: string;
  type: string;
  fileType?: string | null;
  updatedAt?: Date | string | null;
  subject?: { id: string; name: string } | null;
  unit?: { number: number; title: string } | null;
  uploadedBy?: { name: string | null } | null;
};

const FILE_ICON: Record<string, LucideIcon> = {
  PDF: FileText,
  DOC: FileText,
  DOCX: FileText,
  TXT: FileText,
  PPT: Presentation,
  PPTX: Presentation,
  XLS: Sheet,
  XLSX: Sheet,
  PNG: ImageIcon,
  JPG: ImageIcon,
  JPEG: ImageIcon,
};

export function fileIcon(fileType?: string | null): LucideIcon {
  return FILE_ICON[(fileType ?? "").toUpperCase()] ?? File;
}

/**
 * One note, one row. `variant="table"` is the §20 column layout (TITLE / TYPE /
 * UPLOADED BY / UPDATED) at 56px; `variant="row"` is the looser form the
 * dashboard and bookmarks use, with a caller-supplied right slot.
 */
export default function NoteListItem({
  note,
  variant = "row",
  right,
  className,
}: {
  note: NoteRowData;
  variant?: "row" | "table";
  right?: React.ReactNode;
  className?: string;
}) {
  const Icon = fileIcon(note.fileType);
  const hover = "transition duration-calm ease-calm hover:bg-sage-50";

  if (variant === "table") {
    return (
      <Link
        href={`/notes/${note.id}`}
        className={cn("flex min-h-[56px] items-center gap-3 px-4 py-2.5", hover, className)}
      >
        <Icon size={17} strokeWidth={1.8} className="shrink-0 text-muted" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-body-lg font-semibold text-ink">{note.title}</span>
          {note.subject && (
            <span className="block truncate text-micro text-muted">{note.subject.name}</span>
          )}
        </span>
        <span className="hidden w-[104px] shrink-0 sm:block">
          <TypeBadge type={note.type} />
        </span>
        <span className="hidden w-[150px] shrink-0 truncate text-meta text-secondary lg:block">
          {note.uploadedBy?.name ?? "—"}
        </span>
        <span className="w-[74px] shrink-0 text-right text-meta text-muted">
          {note.updatedAt ? relativeTime(note.updatedAt) : "—"}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={`/notes/${note.id}`}
      className={cn(
        "flex items-center gap-3 rounded-input px-3 py-2.5",
        hover,
        className
      )}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-button bg-sage-50 text-sage-700">
        <Icon size={17} strokeWidth={1.8} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-body-lg font-semibold text-ink">{note.title}</span>
        <span className="mt-0.5 flex items-center gap-1.5 text-meta text-muted">
          {note.subject && <span className="truncate">{note.subject.name}</span>}
          {note.subject && <span aria-hidden>·</span>}
          <span className="shrink-0">{note.updatedAt ? relativeTime(note.updatedAt) : "—"}</span>
        </span>
      </span>
      {right && <span className="shrink-0 text-meta text-muted">{right}</span>}
    </Link>
  );
}
