import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TiltCard from "@/components/TiltCard";
import EmptyState from "@/components/EmptyState";

export const dynamic = "force-dynamic";

const YEAR_LABELS: Record<number, string> = { 1: "First Year", 2: "Second Year", 3: "Third Year", 4: "Fourth Year" };

export default async function BrowseYearPage({ params }: { params: Promise<{ collegeSlug: string; year: string }> }) {
  const { collegeSlug, year } = await params;
  const yearNum = parseInt(year, 10);

  const college = await prisma.college.findUnique({ where: { slug: collegeSlug } });
  if (!college || !YEAR_LABELS[yearNum]) notFound();

  // First year is common to every branch — go straight to semester selection.
  if (yearNum === 1) {
    const semesters = await Promise.all(
      [1, 2].map(async (num) => ({
        number: num,
        count: await prisma.resource.count({
          where: { status: "APPROVED", subject: { semester: { collegeId: college.id, year: 1, number: num, branchId: null } } },
        }),
      }))
    );

    return (
      <main className="max-w-4xl mx-auto px-5 py-12">
        <p className="text-sm text-[var(--faint)] mb-1">{college.name} · First Year</p>
        <h1 className="serif text-2xl font-bold mb-1">Select Semester</h1>
        <p className="text-sm mb-8 badge badge-blue inline-block">Common to All Branches</p>

        <div className="grid sm:grid-cols-2 gap-4">
          {semesters.map((s) => (
            <Link key={s.number} href={s.count > 0 ? `/browse/${collegeSlug}/1/${s.number}` : "#"} aria-disabled={s.count === 0}>
              <TiltCard className={`p-6 h-full ${s.count === 0 ? "opacity-40 pointer-events-none" : ""}`}>
                <p className="text-2xl font-extrabold mb-1" style={{ color: "var(--primary)" }}>
                  Semester {s.number}
                </p>
                <p className="text-sm text-[var(--soft)]">{s.count} resources</p>
              </TiltCard>
            </Link>
          ))}
        </div>
      </main>
    );
  }

  // Year 2+ is branch-specific.
  const branches = await prisma.branch.findMany({ where: { collegeId: college.id }, orderBy: { name: "asc" } });

  return (
    <main className="max-w-4xl mx-auto px-5 py-12">
      <p className="text-sm text-[var(--faint)] mb-1">
        {college.name} · {YEAR_LABELS[yearNum]}
      </p>
      <h1 className="serif text-2xl font-bold mb-8">Select Your Branch</h1>

      {branches.length === 0 ? (
        <EmptyState title="No branches yet" subtitle="This college has no branches configured yet." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {branches.map((b) => (
            <Link key={b.id} href={`/browse/${collegeSlug}/${yearNum}/branch/${b.slug}`}>
              <TiltCard className="p-5 h-full">
                <p className="font-semibold">{b.name}</p>
              </TiltCard>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
