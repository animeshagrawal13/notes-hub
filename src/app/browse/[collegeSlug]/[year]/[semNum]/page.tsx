import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TiltCard from "@/components/TiltCard";
import EmptyState from "@/components/EmptyState";

export const dynamic = "force-dynamic";

export default async function BrowseFirstYearSubjectsPage({
  params,
}: {
  params: Promise<{ collegeSlug: string; year: string; semNum: string }>;
}) {
  const { collegeSlug, year, semNum } = await params;
  if (parseInt(year, 10) !== 1) notFound();
  const number = parseInt(semNum, 10);

  const college = await prisma.college.findUnique({ where: { slug: collegeSlug } });
  if (!college) notFound();

  const semester = await prisma.semester.findFirst({
    where: { collegeId: college.id, branchId: null, year: 1, number },
    include: { subjects: { include: { _count: { select: { resources: true } } } } },
  });
  if (!semester) notFound();

  return (
    <main className="max-w-5xl mx-auto px-5 py-12">
      <p className="text-sm text-[var(--faint)] mb-1">
        {college.name} · First Year · Semester {semester.number}
      </p>
      <h1 className="serif text-2xl font-bold mb-1">Subjects</h1>
      <p className="text-sm mb-8 badge badge-blue inline-block">Common to All Branches</p>

      {semester.subjects.length === 0 ? (
        <EmptyState title="No subjects yet" subtitle="Subjects for this semester haven't been added yet." />
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {semester.subjects.map((s) => (
            <Link key={s.id} href={`/subject/${s.id}`}>
              <TiltCard className="p-5 h-full">
                <p className="font-semibold mb-1">{s.name}</p>
                <p className="text-xs text-[var(--faint)] mb-3">{s.code}</p>
                <p className="text-sm text-[var(--soft)]">{s._count.resources} resources</p>
              </TiltCard>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
