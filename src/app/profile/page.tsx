import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import StatCard from '@/components/ui/StatCard';
import { LinkButton } from '@/components/ui/Button';
import ProfileTabs from '@/components/ProfileTabs';
import { Upload, Download, Star, Bookmark } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const [uploads, bookmarks] = await Promise.all([
    prisma.resource.findMany({ where: { uploadedById: session.user.id, status: 'APPROVED' }, include: { subject: true, uploadedBy: true }, orderBy: { createdAt: 'desc' } }),
    prisma.bookmark.findMany({ where: { userId: session.user.id }, include: { resource: { include: { subject: true, uploadedBy: true } } }, orderBy: { createdAt: 'desc' } })
  ]);

  const initials = session.user.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
  const totalDownloads = uploads.reduce((acc, r) => acc + r.downloads, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-sage-100 text-sage-800 flex items-center justify-center text-2xl font-semibold shrink-0">
          {initials}
        </div>
        <div className="flex-1">
          <h1 className="text-page font-heading text-ink">{session.user.name}</h1>
          <p className="text-meta text-secondary">{session.user.email} · Joined {new Date().getFullYear()}</p>
        </div>
        <LinkButton href="/settings" variant="secondary">Edit Profile</LinkButton>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Uploads" value={uploads.length} Icon={Upload} tint="sage" />
        <StatCard label="Downloads" value={totalDownloads} Icon={Download} tint="slate" />
        <StatCard label="Avg Rating" value="4.8" Icon={Star} tint="ochre" />
        <StatCard label="Bookmarks" value={bookmarks.length} Icon={Bookmark} tint="lavender" />
      </div>

      <ProfileTabs uploads={uploads as any[]} bookmarks={bookmarks.map(b => b.resource) as any[]} />
    </div>
  );
}
