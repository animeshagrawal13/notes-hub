import PageHeader from '@/components/ui/PageHeader';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { getBookmarkedIds } from '@/lib/bookmarks';
import NoteListTable from '@/components/ui/NoteListTable';
import EmptyState from '@/components/ui/EmptyState';
import NotesFilters from '@/components/NotesFilters';
import type { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function NotesPage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string; year?: string; sort?: string };
}) {
  const { q, type, year, sort } = searchParams;
  const session = await auth();

  const where: Prisma.ResourceWhereInput = { status: 'APPROVED' };
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { tags: { contains: q } },
      { subject: { name: { contains: q } } },
    ];
  }
  if (type && type !== 'all') where.type = type;
  if (year && year !== 'all') where.academicYear = parseInt(year, 10);

  const [notes, bookmarkedIds, yearRows] = await Promise.all([
    prisma.resource.findMany({
      where,
      include: { subject: true, uploadedBy: true },
      orderBy: sort === 'popular' ? { views: 'desc' } : { createdAt: 'desc' },
    }),
    getBookmarkedIds(session?.user?.id),
    prisma.resource.findMany({
      where: { academicYear: { not: null } },
      distinct: ['academicYear'],
      select: { academicYear: true },
      orderBy: { academicYear: 'desc' },
    }),
  ]);
  const years = yearRows.map((r) => r.academicYear!).filter(Boolean);

  return (
    <div className="space-y-7">
      <PageHeader title={q ? `Results for "${q}"` : 'All Notes'} subtitle={`${notes.length} resource${notes.length === 1 ? '' : 's'} in the library`} />
      <div className="rounded-md border border-border bg-surface p-3.5 shadow-sm">
        <NotesFilters currentQ={q} currentType={type} currentYear={year} currentSort={sort} years={years} />
      </div>

      {notes.length > 0 ? (
        <NoteListTable notes={notes as any[]} bookmarkedIds={bookmarkedIds} />
      ) : (
        <EmptyState title="No notes found" body="Try adjusting your search or filters." />
      )}
    </div>
  );
}
