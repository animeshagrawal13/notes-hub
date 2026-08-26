import { prisma } from "@/lib/prisma";
import ResourceCard from "@/components/ResourceCard";
import EmptyState from "@/components/EmptyState";
import SearchFilters from "@/components/SearchFilters";

export const dynamic = "force-dynamic";

const RESOURCE_TYPES = [
  "NOTES",
  "HANDWRITTEN_NOTES",
  "PYQ",
  "QUESTION_BANK",
  "ASSIGNMENT",
  "PRACTICAL",
  "LAB_MANUAL",
  "REFERENCE_MATERIAL",
  "CHEAT_SHEET",
  "SLIDES",
  "SYLLABUS",
];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; year?: string; sort?: string }>;
}) {
  const { q = "", type, year, sort } = await searchParams;

  const resources = await prisma.resource.findMany({
    where: {
      status: "APPROVED",
      ...(q
        ? {
            OR: [
              { title: { contains: q } },
              { tags: { contains: q } },
              { subject: { name: { contains: q } } },
            ],
          }
        : {}),
      ...(type ? { type } : {}),
      ...(year ? { subject: { semester: { year: parseInt(year, 10) } } } : {}),
    },
    include: { unit: true, topic: true, ratings: { select: { stars: true } } },
    orderBy: sort === "downloads" ? { downloads: "desc" } : sort === "recent" ? { createdAt: "desc" } : { views: "desc" },
    take: 60,
  });

  return (
    <main className="max-w-5xl mx-auto px-5 py-12">
      <h1 className="serif text-2xl font-bold mb-6">{q ? `Results for "${q}"` : "Browse All Resources"}</h1>

      <SearchFilters q={q} type={type} year={year} sort={sort} types={RESOURCE_TYPES} />

      {resources.length === 0 ? (
        <EmptyState title="No notes found" subtitle="Try changing your filters or upload the first resource." />
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {resources.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      )}
    </main>
  );
}
