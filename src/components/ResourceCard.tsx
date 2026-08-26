import Link from "next/link";
import TiltCard from "@/components/TiltCard";
import { Download, FileText, Star } from "lucide-react";

type ResourceCardData = {
  id: string;
  title: string;
  type: string;
  fileType: string;
  fileSize: number;
  downloads: number;
  views: number;
  unit?: { number: number } | null;
  topic?: { name: string } | null;
  ratings?: { stars: number }[];
};

function formatSize(bytes: number) {
  if (bytes > 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default function ResourceCard({ resource }: { resource: ResourceCardData }) {
  const avg =
    resource.ratings && resource.ratings.length > 0
      ? resource.ratings.reduce((sum, r) => sum + r.stars, 0) / resource.ratings.length
      : null;

  return (
    <Link href={`/resource/${resource.id}`}>
      <TiltCard className="p-4 h-full flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <FileText size={18} style={{ color: "var(--primary)" }} className="shrink-0" />
            <p className="font-medium text-sm truncate">{resource.title}</p>
          </div>
          <span className="badge badge-soft shrink-0">{resource.fileType}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-[var(--faint)]">
          <span className="badge badge-blue">{resource.type.replace(/_/g, " ")}</span>
          {resource.topic ? (
            <span>{resource.topic.name}</span>
          ) : (
            resource.unit && <span>Unit {resource.unit.number}</span>
          )}
          <span>{formatSize(resource.fileSize)}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-[var(--soft)] mt-auto pt-2">
          <span className="flex items-center gap-1">
            <Download size={13} /> {resource.downloads}
          </span>
          {avg !== null ? (
            <span className="flex items-center gap-1">
              <Star size={13} fill="var(--accent)" style={{ color: "var(--accent)" }} /> {avg.toFixed(1)}
            </span>
          ) : (
            <span className="text-[var(--faint)]">No ratings yet</span>
          )}
        </div>
      </TiltCard>
    </Link>
  );
}
