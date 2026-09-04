import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import SubjectCard from '@/components/ui/SubjectCard';
import NoteListItem from '@/components/ui/NoteListItem';
import NoteListTable from '@/components/ui/NoteListTable';
import EmptyState from '@/components/ui/EmptyState';
import { LinkButton } from '@/components/ui/Button';
import { auth } from '@/lib/auth';
import { LibraryBig, FileText, Bookmark, Upload, CalendarDays, Search, ChevronRight, ScrollText, Users, Clock } from 'lucide-react';
import { daysUntil } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    const [subjectCount, noteCount, bookmarkCount, uploadCount, recentBookmarks, upcomingEvents] = await Promise.all([
      prisma.subject.count(),
      prisma.resource.count({ where: { status: 'APPROVED' } }),
      prisma.bookmark.count({ where: { userId: session.user.id } }),
      prisma.resource.count({ where: { uploadedById: session.user.id } }),
      prisma.bookmark.findMany({
        where: { userId: session.user.id },
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: { resource: { include: { subject: true, unit: true } } },
      }),
      prisma.studyEvent.findMany({
        where: {
          date: { gte: new Date() },
          OR: [{ userId: null }, { userId: session.user.id }],
        },
        orderBy: { date: 'asc' },
        take: 5,
      }),
    ]);

    const firstName = session.user.name?.split(' ')[0] || 'User';

    return (
      <div className="space-y-8">
        <PageHeader title={`Welcome back, ${firstName}`} subtitle="Here's what's happening with your notes." />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Subjects" value={subjectCount} Icon={LibraryBig} tint="sage" href="/subjects" />
          <StatCard label="Notes" value={noteCount} Icon={FileText} tint="slate" href="/notes" />
          <StatCard label="Bookmarks" value={bookmarkCount} Icon={Bookmark} tint="lavender" href="/bookmarks" />
          <StatCard label="My Uploads" value={uploadCount} Icon={Upload} tint="ochre" href="/uploads" />
        </div>

        <div className="flex gap-4">
          <LinkButton variant="primary" href="/uploads" size="md">Upload Notes</LinkButton>
          <LinkButton variant="secondary" href="/notes" size="md">Search Notes</LinkButton>
          <LinkButton variant="secondary" href="/pyq" size="md">Explore PYQs</LinkButton>
          <LinkButton variant="secondary" href="/browse" size="md">Browse by College</LinkButton>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-card-title font-semibold text-ink">Continue where you left off</h2>
            {recentBookmarks.length > 0 ? (
              <div className="flex flex-col gap-2">
                {recentBookmarks.map(b => (
                  <NoteListItem key={b.id} note={b.resource as any} variant="row" right={<Bookmark className="text-sage-600 fill-sage-600" size={18} />} />
                ))}
              </div>
            ) : (
              <EmptyState title="No bookmarks yet" body="Save notes to quickly access them here." Icon={Bookmark} action={<LinkButton href="/notes">Find Notes</LinkButton>} />
            )}
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-card-title font-semibold text-ink">Upcoming</h2>
              <LinkButton href="/schedule" variant="tertiary" size="sm">+ Add reminder</LinkButton>
            </div>
            {upcomingEvents.length > 0 ? (
              <div className="flex flex-col gap-2">
                {upcomingEvents.map(e => (
                  <div key={e.id} className="flex items-center justify-between p-3 bg-surface rounded-card border border-border">
                    <div className="flex items-center gap-3">
                      <CalendarDays size={18} className="text-muted" />
                      <span className="text-body font-medium text-ink">{e.title}</span>
                    </div>
                    <span className="text-meta font-semibold text-warning" style={{ color: 'var(--warning)' }}>{daysUntil(e.date)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No upcoming events" Icon={CalendarDays} />
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Signed out — landing page ───────────────────────────────────────────
  const [topSubjects, topNotes, recentNotes, allSubjects, subjectCount, resourceCount, pyqCount, studentCount] =
    await Promise.all([
      prisma.subject.findMany({
        take: 8,
        orderBy: { resources: { _count: 'desc' } },
        include: { _count: { select: { resources: true } } },
      }),
      prisma.resource.findMany({
        take: 6,
        orderBy: { views: 'desc' },
        where: { status: 'APPROVED' },
        include: { subject: true },
      }),
      prisma.resource.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        where: { status: 'APPROVED' },
        include: { subject: true },
      }),
      prisma.subject.findMany({ include: { semester: true }, orderBy: { name: 'asc' } }),
      prisma.subject.count(),
      prisma.resource.count({ where: { status: 'APPROVED' } }),
      prisma.resource.count({ where: { status: 'APPROVED', type: 'PYQ' } }),
      prisma.user.count(),
    ]);

  const stats = [
    { label: 'Subjects', value: subjectCount, Icon: LibraryBig, tint: 'sage' as const },
    { label: 'Notes', value: resourceCount, Icon: FileText, tint: 'slate' as const },
    { label: 'PYQ Papers', value: pyqCount, Icon: ScrollText, tint: 'ochre' as const },
    { label: 'Students', value: studentCount, Icon: Users, tint: 'lavender' as const },
  ];

  const firstYear = allSubjects.filter(s => s.semester?.year === 1);
  const sem1 = firstYear.filter(s => s.semester?.number === 1);
  const sem2 = firstYear.filter(s => s.semester?.number === 2);
  const names = (list: typeof allSubjects) =>
    list.map(s => s.name).slice(0, 5).join(', ') + (list.length ? '.' : '');

  const semCards = [
    { href: '/subjects', label: 'Semester I', count: sem1.length, subjects: names(sem1), tone: 'blue' as const },
    { href: '/subjects', label: 'Semester II', count: sem2.length, subjects: names(sem2), tone: 'gold' as const },
  ];

  return (
    <div className="home space-y-16">
      {/* Hero */}
      <div className="home-hero-wrap">
        <div className="home-botanical" aria-hidden>
          <svg viewBox="0 0 900 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="120" cy="90" rx="180" ry="130" fill="var(--sage-200)" opacity="0.35" />
            <ellipse cx="760" cy="60" rx="220" ry="150" fill="var(--sage-300)" opacity="0.25" />
            <ellipse cx="820" cy="380" rx="200" ry="140" fill="var(--accent-cream)" opacity="0.4" />
            <ellipse cx="60" cy="420" rx="170" ry="120" fill="var(--sage-100)" opacity="0.5" />
            <path
              d="M420 40 C470 90 470 150 420 200 C370 150 370 90 420 40 Z"
              fill="var(--sage-300)"
              opacity="0.22"
            />
            <path
              d="M500 380 C555 420 555 470 500 500 C445 470 445 420 500 380 Z"
              fill="var(--sage-400)"
              opacity="0.18"
            />
          </svg>
        </div>
        <div className="home-hero">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <span className="home-badge home-badge-blue">Estd. 1952</span>
            <span className="home-badge home-badge-soft">Autonomous Institute</span>
            <span className="home-badge home-badge-soft">RGPV Affiliated</span>
          </div>
          <h1 className="home-display">
            B.Tech First Year<br />
            <span className="home-grad">Notes Hub</span>
          </h1>
          <p>
            Unit-wise notes, official syllabus, class slides and previous year question
            papers for every first-year subject at SGSITS, Indore.
          </p>
          <form action="/notes" className="relative mx-auto max-w-[540px]">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
              size={20}
              style={{ color: 'var(--h-faint)' }}
            />
            <input
              type="text"
              name="q"
              autoComplete="off"
              placeholder={'Search subject or code — e.g. "Physics" or "IT10007"'}
              className="home-search"
            />
          </form>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-2">
            <Link href="/uploads" className="home-badge home-badge-blue transition hover:opacity-80">Upload notes</Link>
            <Link href="/notes" className="home-badge home-badge-soft transition hover:opacity-80">Browse notes</Link>
            <Link href="/pyq" className="home-badge home-badge-soft transition hover:opacity-80">Explore PYQs</Link>
            <Link href="/subjects" className="home-badge home-badge-soft transition hover:opacity-80">All subjects</Link>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="home-card flex items-center gap-3.5 p-4.5">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-input"
              style={{ background: 'var(--h-primary-pale)', color: 'var(--h-primary)' }}
            >
              <s.Icon size={18} strokeWidth={1.8} />
            </span>
            <span className="min-w-0">
              <span className="block text-[22px] font-heading leading-none tracking-[-0.01em]" style={{ color: 'var(--h-ink)' }}>
                {s.value}
              </span>
              <span className="mt-1 block truncate text-meta" style={{ color: 'var(--h-soft)' }}>{s.label}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Semester cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        {semCards.map(card => (
          <Link
            key={card.label}
            href={card.href}
            className="home-card group relative overflow-hidden p-9"
            style={{ borderTop: `4px solid ${card.tone === 'blue' ? 'var(--h-primary)' : 'var(--h-accent)'}` }}
          >
            <div
              className="pointer-events-none absolute right-0 top-0 h-32 w-32"
              style={{
                background: `radial-gradient(circle at top right, ${
                  card.tone === 'blue' ? 'var(--h-primary-glow)' : 'var(--h-accent-glow)'
                }, transparent 70%)`,
              }}
            />
            <div className="relative mb-5 flex items-center justify-between">
              <span className={`home-badge ${card.tone === 'blue' ? 'home-badge-blue' : 'home-badge-gold'}`}>
                {card.count} subjects
              </span>
              <ChevronRight
                size={22}
                style={{ color: card.tone === 'blue' ? 'var(--h-primary)' : 'var(--h-accent)' }}
              />
            </div>
            <h2 className="home-display relative mb-2.5 text-[1.85rem] font-bold" style={{ color: 'var(--h-ink)' }}>
              {card.label}
            </h2>
            <p className="relative text-[0.92rem] leading-relaxed" style={{ color: 'var(--h-soft)' }}>
              {card.subjects || 'Subjects coming soon.'}
            </p>
          </Link>
        ))}
      </div>

      {/* Popular subjects */}
      <div className="space-y-4">
        <h2 className="home-section-title">Popular Subjects</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {topSubjects.map(s => (
            <SubjectCard key={s.id} id={s.id} name={s.name} code={s.code || undefined} notes={s._count.resources} layout="grid" />
          ))}
        </div>
      </div>

      {/* Recently added */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock size={16} style={{ color: 'var(--h-primary)' }} />
          <h2 className="home-section-title">Recently Added</h2>
        </div>
        <NoteListTable notes={recentNotes as any[]} />
      </div>

      {/* Trending notes */}
      <div className="space-y-4">
        <h2 className="home-section-title">Trending Notes</h2>
        <NoteListTable notes={topNotes as any[]} />
      </div>

      {/* Footer */}
      <footer className="home-foot grid gap-10 pt-12 sm:grid-cols-3">
        <div>
          <div className="home-display mb-3 text-[0.95rem] font-bold" style={{ color: 'var(--h-ink)' }}>
            SGSITS, Indore
          </div>
          <p className="text-[0.85rem] leading-relaxed">
            Shri G. S. Institute of Technology &amp; Science. Autonomous Institute, Govt. of M.P.
            Affiliated to RGPV, Bhopal.
          </p>
        </div>
        <div>
          <div className="home-display mb-3 text-[0.95rem] font-bold" style={{ color: 'var(--h-ink)' }}>
            Quick Links
          </div>
          <Link href="/subjects" className="block py-1 text-[0.85rem]">Subjects</Link>
          <Link href="/notes" className="block py-1 text-[0.85rem]">Notes</Link>
          <Link href="/pyq" className="block py-1 text-[0.85rem]">PYQ Papers</Link>
          <a href="https://www.sgsits.ac.in/" target="_blank" rel="noopener noreferrer" className="block py-1 text-[0.85rem]">
            Official Website ↗
          </a>
        </div>
        <div>
          <div className="home-display mb-3 text-[0.95rem] font-bold" style={{ color: 'var(--h-ink)' }}>
            Contact
          </div>
          <p className="text-[0.85rem] leading-loose">
            23, Sir M. Visvesvaraya Marg<br />
            Indore, M.P. 452003
          </p>
        </div>
      </footer>
      <p className="home-foot pt-6 text-center text-[0.75rem]" style={{ color: 'var(--h-faint)' }}>
        A student-driven resource for B.Tech 1st Year · Unofficial
      </p>
    </div>
  );
}
