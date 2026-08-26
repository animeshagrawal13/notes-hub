import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SubjectTabs from "@/components/SubjectTabs";

export const dynamic = "force-dynamic";

const YEAR_LABELS: Record<number, string> = { 1: "First Year", 2: "Second Year", 3: "Third Year", 4: "Fourth Year" };

export default async function SubjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const subject = await prisma.subject.findUnique({
    where: { id },
    include: {
      semester: { include: { college: true, branch: true } },
      units: { orderBy: { number: "asc" }, include: { topics: { orderBy: { name: "asc" } } } },
      resources: {
        where: { status: "APPROVED" },
        include: { unit: true, topic: true, ratings: { select: { stars: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!subject) notFound();

  const isCommonFirstYear = subject.semester.year === 1 && !subject.semester.branchId;

  return (
    <main className="max-w-5xl mx-auto px-5 py-12">
      <p className="text-sm text-[var(--faint)] mb-1">
        {subject.semester.college.name} ·{" "}
        {isCommonFirstYear ? "First Year" : `${YEAR_LABELS[subject.semester.year]} · ${subject.semester.branch?.name ?? ""}`} · Semester{" "}
        {subject.semester.number}
      </p>
      <h1 className="serif text-2xl font-bold mb-1">{subject.name}</h1>
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <p className="mono text-xs text-[var(--faint)]">
          {subject.code}
          {subject.credits ? ` · ${subject.credits}` : ""} · {subject.resources.length} resources
        </p>
        {isCommonFirstYear && <span className="badge badge-blue">Common to All Branches</span>}
      </div>

      <SubjectTabs resources={subject.resources} units={subject.units} />
    </main>
  );
}
