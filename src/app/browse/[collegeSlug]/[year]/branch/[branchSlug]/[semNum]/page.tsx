import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TiltCard from "@/components/TiltCard";
import EmptyState from "@/components/EmptyState";

export const dynamic = "force-dynamic";

export default async function BrowseBranchSubjectsPage({
  params,
}: {
  params: Promise<{ collegeSlug: string; year: string; branchSlug: string; semNum: string }>;
}) {
  const { collegeSlug, year, branchSlug, semNum } = await params;
  const yearNum = parseInt(year, 10);
  const number = parseInt(semNum, 10);

  const branch = await prisma.branch.findFirst({
    where: { slug: branchSlug, college: { slug: collegeSlug } },
    include: { college: true },
  });
  if (!branch) notFound();

  const semester = await prisma.semester.findFirst({
    where: { branchId: branch.id, year: yearNum, number },
    include: { subjects: { include: { _count: { select: { resources: true } } } } },
  });

  return (
    <main className="max-w-5xl mx-auto px-5 py-12">
      <p className="text-sm text-[var(--faint)] mb-1">
        {branch.college.name} · {branch.name} · Semester {number}
      </p>
      <h1 className="serif text-2xl font-bold mb-8">Subjects</h1>

      {!semester || semester.subjects.length === 0 ? (
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
