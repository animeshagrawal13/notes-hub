import { prisma } from "@/lib/prisma";
import UploadForm from "@/components/UploadForm";

export const dynamic = "force-dynamic";

export default async function UploadPage() {
  const subjects = await prisma.subject.findMany({
    include: { semester: { include: { branch: true } } },
    orderBy: { name: "asc" },
  });

  const YEAR_LABELS: Record<number, string> = { 1: "First Year", 2: "Second Year", 3: "Third Year", 4: "Fourth Year" };

  const options = subjects.map((s) => ({
    id: s.id,
    label: s.semester.branch
      ? `${s.name} (${s.code}) — ${YEAR_LABELS[s.semester.year]} · ${s.semester.branch.name} · Sem ${s.semester.number}`
      : `${s.name} (${s.code}) — ${YEAR_LABELS[s.semester.year]} · Sem ${s.semester.number} · Common to All Branches`,
  }));

  return (
    <main className="max-w-2xl mx-auto px-5 py-12">
      <h1 className="serif text-2xl font-bold mb-1">Upload Notes</h1>
      <p className="text-sm text-[var(--soft)] mb-8">
        Help other students — your upload is reviewed before it becomes visible.
      </p>
      <UploadForm subjects={options} />
    </main>
  );
}
