// Intercepting route: when a note link is followed from inside the app, render
// the reader as an overlay on top of the page the user was on (its scroll,
// filters and search stay put). A direct visit / refresh falls through to
// src/app/notes/[id]/page.tsx instead.

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import ReaderOverlay from '@/components/reader/ReaderOverlay';

export const dynamic = 'force-dynamic';

export default async function InterceptedNoteReader({ params }: { params: { id: string } }) {
  const session = await auth();
  const [resource, existingBookmark] = await Promise.all([
    prisma.resource.findUnique({
      where: { id: params.id },
      include: { subject: true, unit: true },
    }),
    session?.user
      ? prisma.bookmark.findUnique({
          where: { userId_resourceId: { userId: session.user.id, resourceId: params.id } },
        })
      : null,
  ]);
  if (!resource) notFound();

  prisma.resource
    .update({ where: { id: resource.id }, data: { views: { increment: 1 } } })
    .catch(() => {});

  const subtitle = [resource.subject?.name, resource.unit ? `Unit ${resource.unit.number}` : null]
    .filter(Boolean)
    .join('  ·  ');

  return (
    <ReaderOverlay
      fileUrl={resource.fileUrl}
      resourceId={resource.id}
      title={resource.title}
      subtitle={subtitle || undefined}
      canRenderPdf={resource.fileUrl.toLowerCase().endsWith('.pdf')}
      initiallyBookmarked={!!existingBookmark}
    />
  );
}
