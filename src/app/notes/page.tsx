import PageHeader from '@/components/ui/PageHeader';
import { prisma } from '@/lib/prisma';
import NoteListTable from '@/components/ui/NoteListTable';
import EmptyState from '@/components/ui/EmptyState';
import NotesFilters from '@/components/NotesFilters';

export const dynamic = 'force-dynamic';

export default async function NotesPage({ searchParams }: { searchParams: { q?: string, type?: string, year?: string, sort?: string } }) {
  const { q, type, year, sort } = searchParams;
  
  const where: any = { status: 'APPROVED' };
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { tags: { hasSome: [q] } },
      { subject: { name: { contains: q, mode: 'insensitive' } } }
    ];
  }
  if (type && type !== 'all') where.type = type;

  const notes = await prisma.resource.findMany({
    where,
    include: { subject: true, uploadedBy: true },
    orderBy: sort === 'popular' ? { downloads: 'desc' } : { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <PageHeader title={q ? `Results for "${q}"` : 'All Notes'} subtitle={`${notes.length} results`} />
      <NotesFilters currentQ={q} currentType={type} currentYear={year} currentSort={sort} />
      
      {notes.length > 0 ? (
        <NoteListTable notes={notes as any[]} />
      ) : (
        <EmptyState title="No notes found" body="Try adjusting your search or filters." />
      )}
    </div>
  );
}
