import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PageHeader from '@/components/ui/PageHeader';
import BookmarksList from '@/components/BookmarksList';

export const dynamic = 'force-dynamic';

export default async function BookmarksPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    include: { resource: { include: { subject: true, uploadedBy: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Bookmarks" subtitle="Your saved notes" />
      <BookmarksList bookmarks={bookmarks as any[]} />
    </div>
  );
}
