import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PageHeader from '@/components/ui/PageHeader';
import UploadForm from '@/components/UploadForm';
import NoteListItem from '@/components/ui/NoteListItem';
import { StatusBadge } from '@/components/ui/Badge';

export const dynamic = 'force-dynamic';

export default async function UploadsPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const [subjects, uploads] = await Promise.all([
    prisma.subject.findMany({ orderBy: { name: 'asc' }, include: { units: true } }),
    prisma.resource.findMany({
      where: { uploadedById: session.user.id },
      include: { subject: true, unit: true },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return (
    <div className="space-y-8">
      <PageHeader title="My Uploads" subtitle="Manage your contributions" />
      <UploadForm subjects={subjects} />
      
      <div className="space-y-4">
        <h2 className="text-card-title font-semibold text-ink">Your Uploads</h2>
        <div className="flex flex-col gap-2">
          {uploads.map(u => (
            <NoteListItem key={u.id} note={u as any} variant="row" right={<StatusBadge status={u.status} />} />
          ))}
        </div>
      </div>
    </div>
  );
}
