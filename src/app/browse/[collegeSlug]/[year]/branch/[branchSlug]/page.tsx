import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TiltCard from "@/components/TiltCard";

export const dynamic = "force-dynamic";

const YEAR_LABELS: Record<number, string> = { 2: "Second Year", 3: "Third Year", 4: "Fourth Year" };

export default async function BrowseBranchSemestersPage({
  params,
}: {
  params: Promise<{ collegeSlug: string; year: string; branchSlug: string }>;
}) {
  const { collegeSlug, year, branchSlug } = await params;
  const yearNum = parseInt(year, 10);
  if (!YEAR_LABELS[yearNum]) notFound();

  const branch = await prisma.branch.findFirst({
    where: { slug: branchSlug, college: { slug: collegeSlug } },
    include: { college: true },
  });
  if (!branch) notFound();

  const semesters = await Promise.all(
    [1, 2].map(async (num) => ({
      number: num,
      count: await prisma.resource.count({
        where: { status: "APPROVED", subject: { semester: { branchId: branch.id, year: yearNum, number: num } } },
      }),
    }))
  );

  return (
    <main className="max-w-4xl mx-auto px-5 py-12">
      <p className="text-sm text-[var(--faint)] mb-1">
        {branch.college.name} · {branch.name} · {YEAR_LABELS[yearNum]}
      </p>
      <h1 className="serif text-2xl font-bold mb-8">Select Semester</h1>

      <div className="grid sm:grid-cols-2 gap-4">
        {semesters.map((s) => (
          <Link
            key={s.number}
            href={s.count > 0 ? `/browse/${collegeSlug}/${yearNum}/branch/${branchSlug}/${s.number}` : "#"}
            aria-disabled={s.count === 0}
          >
            <TiltCard className={`p-6 h-full ${s.count === 0 ? "opacity-40 pointer-events-none" : ""}`}>
              <p className="text-2xl font-extrabold mb-1" style={{ color: "var(--primary)" }}>
                Semester {s.number}
              </p>
              <p className="text-sm text-[var(--soft)]">{s.count > 0 ? `${s.count} resources` : "Coming soon"}</p>
            </TiltCard>
          </Link>
        ))}
      </div>
    </main>
  );
}
