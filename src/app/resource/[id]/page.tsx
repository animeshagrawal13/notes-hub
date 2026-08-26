import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import ResourceActions from "@/components/ResourceActions";
import { Star } from "lucide-react";

export const dynamic = "force-dynamic";

const YEAR_LABELS: Record<number, string> = { 1: "First Year", 2: "Second Year", 3: "Third Year", 4: "Fourth Year" };

function formatSize(bytes: number) {
  if (bytes > 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default async function ResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const resource = await prisma.resource
    .update({
      where: { id },
      data: { views: { increment: 1 } },
      include: {
        subject: { include: { semester: { include: { college: true, branch: true } } } },
        unit: true,
        topic: true,
        uploadedBy: true,
        ratings: true,
      },
    })
    .catch(() => null);

  if (!resource) notFound();

  const avg = resource.ratings.length > 0 ? resource.ratings.reduce((s, r) => s + r.stars, 0) / resource.ratings.length : null;

  const bookmark = session?.user
    ? await prisma.bookmark.findUnique({ where: { userId_resourceId: { userId: session.user.id, resourceId: id } } })
    : null;
  const myRating = session?.user
    ? await prisma.rating.findUnique({ where: { userId_resourceId: { userId: session.user.id, resourceId: id } } })
    : null;

  const isPdf = resource.fileType === "PDF";
  const sem = resource.subject.semester;
  const isCommonFirstYear = sem.year === 1 && !sem.branchId;

  const crumbs = [
    sem.college.name,
    isCommonFirstYear ? "First Year" : `${YEAR_LABELS[sem.year]} · ${sem.branch?.name ?? ""}`,
    `Semester ${sem.number}`,
    resource.subject.name,
    resource.unit ? `Unit ${resource.unit.number}` : null,
    resource.topic?.name ?? null,
  ].filter(Boolean);

  return (
    <main className="max-w-4xl mx-auto px-5 py-12">
      <p className="text-sm text-[var(--faint)] mb-1">
        <Link href={`/subject/${resource.subject.id}`} className="hover:underline">
          {crumbs.join(" › ")}
        </Link>
      </p>
      <h1 className="serif text-2xl font-bold mb-2">{resource.title}</h1>

      <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--soft)] mb-6">
        <span className="badge badge-blue">{resource.type.replace(/_/g, " ")}</span>
        <span>{resource.fileType} · {formatSize(resource.fileSize)}</span>
        <span>By {resource.uploadedBy.name}</span>
        <span>{resource.views} views</span>
        {avg !== null && (
          <span className="flex items-center gap-1">
            <Star size={14} fill="var(--accent)" style={{ color: "var(--accent)" }} /> {avg.toFixed(1)} ({resource.ratings.length})
          </span>
        )}
      </div>

      <p className="text-sm text-[var(--soft)] mb-8">{resource.description}</p>

      {isPdf ? (
        <div className="card overflow-hidden mb-8" style={{ height: "70vh" }}>
          <iframe src={resource.fileUrl} title={resource.title} className="w-full h-full" />
        </div>
      ) : (
        <div className="card p-8 text-center text-[var(--soft)] mb-8">
          Preview isn&apos;t available for {resource.fileType} files — download to view.
        </div>
      )}

      <ResourceActions
        resourceId={resource.id}
        fileUrl={resource.fileUrl}
        initiallyBookmarked={!!bookmark}
        myRating={myRating?.stars ?? null}
      />
    </main>
  );
}
