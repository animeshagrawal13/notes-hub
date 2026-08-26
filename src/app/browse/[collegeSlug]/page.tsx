import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TiltCard from "@/components/TiltCard";

export const dynamic = "force-dynamic";

const YEARS = [
  { number: 1, label: "First Year", note: "Common curriculum — no branch selection needed" },
  { number: 2, label: "Second Year", note: "Branch-specific" },
  { number: 3, label: "Third Year", note: "Branch-specific" },
  { number: 4, label: "Fourth Year", note: "Branch-specific" },
];

export default async function BrowseYearsPage({ params }: { params: Promise<{ collegeSlug: string }> }) {
  const { collegeSlug } = await params;
  const college = await prisma.college.findUnique({ where: { slug: collegeSlug } });
  if (!college) notFound();

  const resourceCounts = await Promise.all(
    YEARS.map((y) =>
      prisma.resource.count({
        where: { status: "APPROVED", subject: { semester: { collegeId: college.id, year: y.number } } },
      })
    )
  );

  return (
    <main className="max-w-4xl mx-auto px-5 py-12">
      <p className="text-sm text-[var(--faint)] mb-1">{college.name}</p>
      <h1 className="serif text-2xl font-bold mb-2">Select Your Year</h1>
      <p className="text-[var(--soft)] mb-8">Step 2 of 3</p>

      <div className="grid sm:grid-cols-2 gap-4">
        {YEARS.map((y, i) => {
          const count = resourceCounts[i];
          const enabled = count > 0;
          return (
            <Link key={y.number} href={enabled ? `/browse/${collegeSlug}/${y.number}` : "#"} aria-disabled={!enabled}>
              <TiltCard className={`p-5 h-full ${!enabled ? "opacity-40 pointer-events-none" : ""}`}>
                <p className="font-semibold mb-1">{y.label}</p>
                <p className="text-xs text-[var(--faint)] mb-2">{y.note}</p>
                <p className="text-sm text-[var(--soft)]">{enabled ? `${count} resources` : "Coming soon"}</p>
              </TiltCard>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
