import { prisma } from '@/lib/prisma';
import PageHeader from '@/components/ui/PageHeader';
import PYQBrowser from '@/components/PYQBrowser';
import { auth } from '@/lib/auth';
import { getBookmarkedIds } from '@/lib/bookmarks';

export const dynamic = 'force-dynamic';

export default async function PYQPage() {
  const session = await auth();
  const [pyqs, bookmarkedIds] = await Promise.all([
    prisma.resource.findMany({
      where: { status: 'APPROVED', type: 'PYQ' },
      include: { subject: true },
      orderBy: { createdAt: 'desc' },
    }),
    getBookmarkedIds(session?.user?.id),
  ]);

  return (
    <div className="space-y-7">
      <PageHeader title="Previous Year Questions" subtitle="Past exam papers, organized by subject and year" />
      <PYQBrowser pyqs={pyqs as any[]} bookmarkedIds={bookmarkedIds} />
    </div>
  );
}
