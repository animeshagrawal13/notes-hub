import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PageHeader from '@/components/ui/PageHeader';
import SettingsPanel from '@/components/SettingsPanel';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const [colleges, branches, semesters] = await Promise.all([
    prisma.college.findMany(),
    prisma.branch.findMany(),
    prisma.semester.findMany()
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" />
      <SettingsPanel user={session.user as any} colleges={colleges} branches={branches} semesters={semesters} />
    </div>
  );
}
