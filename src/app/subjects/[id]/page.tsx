import { prisma } from '@/lib/prisma';
import PageHeader from '@/components/ui/PageHeader';
import SubjectTabs from '@/components/SubjectTabs';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SubjectDetailPage({ params }: { params: { id: string } }) {
  const subject = await prisma.subject.findUnique({
    where: { id: params.id },
    include: {
      units: { orderBy: { number: 'asc' } },
      resources: { where: { status: 'APPROVED' }, include: { uploadedBy: true }, orderBy: { createdAt: 'desc' } }
    }
  });

  if (!subject) notFound();

  return (
    <div className="space-y-6">
      <PageHeader 
        title={subject.name} 
        subtitle={subject.units.slice(0, 3).map(u => u.title).join(' · ')} 
        crumbs={[{ label: 'Subjects', href: '/subjects' }, { label: subject.name }]} 
      />
      <SubjectTabs subject={subject as any} resources={subject.resources as any[]} />
    </div>
  );
}
