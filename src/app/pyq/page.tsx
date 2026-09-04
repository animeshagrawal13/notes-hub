import { prisma } from '@/lib/prisma';
import PageHeader from '@/components/ui/PageHeader';
import PYQBrowser from '@/components/PYQBrowser';

export const dynamic = 'force-dynamic';

export default async function PYQPage() {
  const pyqs = await prisma.resource.findMany({
    where: { status: 'APPROVED', type: 'PYQ' },
    include: { subject: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Previous Year Questions" subtitle="Past exam papers organized by year" />
      <PYQBrowser pyqs={pyqs as any[]} />
    </div>
  );
}
