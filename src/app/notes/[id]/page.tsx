import { prisma } from '@/lib/prisma';
import PageHeader from '@/components/ui/PageHeader';
import { IconButton } from '@/components/ui/IconButton';
import { formatSize } from '@/lib/format';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ResourceActionsPanel from '@/components/ResourceActionsPanel';
import NoteListItem from '@/components/ui/NoteListItem';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import Card from '@/components/ui/Card';

export const dynamic = 'force-dynamic';

export default async function NoteDetailPage({ params }: { params: { id: string } }) {
  const resource = await prisma.resource.findUnique({
    where: { id: params.id },
    include: { subject: { include: { units: true } }, unit: true, uploadedBy: true }
  });

  if (!resource) notFound();

  await prisma.resource.update({ where: { id: resource.id }, data: { views: { increment: 1 } } });

  const related = await prisma.resource.findMany({
    where: { subjectId: resource.subjectId, status: 'APPROVED', NOT: { id: resource.id } },
    take: 4,
    orderBy: { downloads: 'desc' }
  });

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-[1200px] mx-auto">
      <div className="hidden md:block w-[230px] shrink-0 space-y-4 sticky top-6 h-fit">
        <h3 className="text-card-title font-semibold text-ink">Contents</h3>
        <div className="flex flex-col gap-1">
          {resource.subject.units.map(u => (
            <div key={u.id} className={`px-3 py-2 rounded-tiny text-body ${u.id === resource.unitId ? 'bg-sage-50 text-sage-800 font-medium' : 'text-secondary'}`}>
              Unit {u.number}: {u.title}
            </div>
          ))}
        </div>
        <Link href={`/subjects/${resource.subjectId}`} className="text-meta text-muted hover:text-ink flex items-center gap-1 mt-4">
          <ArrowLeft size={14} /> Back to {resource.subject.name}
        </Link>
      </div>

      <div className="flex-1 max-w-[800px] space-y-4">
        <PageHeader 
          title={resource.title} 
          subtitle={`${resource.subject.name} · ${resource.type} · ${formatSize(resource.fileSize)}`} 
          crumbs={[{ label: 'Subjects', href: '/subjects' }, { label: resource.subject.name, href: `/subjects/${resource.subjectId}` }, { label: resource.title }]}
          actions={<Link href={`/subjects/${resource.subjectId}`}><IconButton icon={<ArrowLeft size={16} />} label="Back" /></Link>}
        />
        <div className="bg-surface rounded-panel border border-border overflow-hidden h-[70vh]">
          {resource.fileUrl.endsWith('.pdf') ? (
            <iframe src={`${resource.fileUrl}#toolbar=0`} className="w-full h-full border-0 bg-elevated" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted text-body">
              Preview not available for this file type. Please download to view.
            </div>
          )}
        </div>
      </div>

      <div className="w-full md:w-[208px] shrink-0 space-y-6">
        <ResourceActionsPanel resourceId={resource.id} fileUrl={resource.fileUrl} fileName={resource.title} />
        
        <div className="space-y-3">
          <h3 className="text-meta font-semibold text-secondary uppercase tracking-wider">Related Notes</h3>
          <div className="flex flex-col gap-2">
            {related.map(r => (
              <NoteListItem key={r.id} note={r as any} variant="row" />
            ))}
          </div>
        </div>

        <Card className="bg-sage-50 border-sage-100 p-4">
          <div className="flex items-start gap-3">
            <MessageCircle className="text-sage-600 mt-1" size={18} />
            <div>
              <p className="text-body font-semibold text-sage-900">Ask Doubt</p>
              <p className="text-meta text-sage-700 mt-1">Found a mistake? Let us know.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
