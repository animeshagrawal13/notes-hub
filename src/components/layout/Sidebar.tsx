'use client';
// Fixed 240px sidebar per §5. Nav items are 42px tall with 9px radius.
// Active: bg-sage-100 text-sage-800 font-semibold.
// Bottom: 'Contribute notes' card + disclaimer line.

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  GraduationCap, LayoutDashboard, BookOpen, FileText,
  Bookmark, ScrollText, CalendarDays, Upload, Settings,
  ShieldCheck, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { useShell } from './ShellContext';

const NAV_ITEMS = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/subjects', icon: BookOpen, label: 'Subjects' },
  { href: '/notes', icon: FileText, label: 'Notes' },
  { href: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
  { href: '/pyq', icon: ScrollText, label: 'PYQ Papers' },
] as const;

const NAV_SECONDARY = [
  { href: '/schedule', icon: CalendarDays, label: 'Schedule' },
  { href: '/uploads', icon: Upload, label: 'My Uploads' },
  { href: '/settings', icon: Settings, label: 'Settings' },
] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { sidebarOpen } = useShell();

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href) ?? false;
  }

  const item = (href: string, Icon: React.ElementType, label: string) => (
    <Link
      key={href}
      href={href}
      className={cn(
        'flex h-nav items-center gap-[11px] rounded-button px-3 text-body-lg transition duration-calm ease-calm',
        isActive(href)
          ? 'bg-sage-100 text-sage-800 font-semibold'
          : 'text-secondary hover:bg-sage-50 hover:text-ink'
      )}
    >
      <Icon size={17} strokeWidth={1.8} className="shrink-0" />
      {label}
    </Link>
  );

  return (
    <aside
      className={cn(
        'hidden md:flex fixed inset-y-0 left-0 z-40 w-sidebar flex-col bg-surface border-r border-border thin-scroll overflow-y-auto',
        'transition-transform duration-calm ease-calm',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      {/* Wordmark */}
      <Link href="/" className="flex items-center gap-3 px-5 py-5 shrink-0">
        <span className="flex h-9 w-9 items-center justify-center rounded-button bg-sage-100 text-sage-700">
          <GraduationCap size={20} strokeWidth={1.8} />
        </span>
        <span className="leading-tight">
          <span className="block text-micro font-semibold uppercase tracking-widest text-muted">COLLEGE</span>
          <span className="block text-[15px] font-bold tracking-tight text-ink">NOTES HUB</span>
        </span>
      </Link>

      {/* Primary nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => item(href, Icon, label))}

        {/* Hairline divider */}
        <div className="my-2 border-t border-border-light" />

        {NAV_SECONDARY.map(({ href, icon: Icon, label }) => item(href, Icon, label))}

        {session?.user?.role === 'ADMIN' && item('/admin', ShieldCheck, 'Admin')}
      </nav>

      {/* Bottom card: contribute + disclaimer */}
      <div className="mx-3 mb-4 mt-2">
        <div className="rounded-panel border border-sage-100 bg-sage-50 p-3.5">
          <p className="text-body font-semibold text-sage-800 mb-1">Contribute notes</p>
          <p className="text-micro text-sage-700 mb-2.5 leading-relaxed">
            Share your notes and help fellow students.
          </p>
          <Link
            href="/uploads"
            className="flex items-center gap-1 text-micro font-semibold text-sage-700 hover:text-sage-800"
          >
            Upload notes <ChevronRight size={12} />
          </Link>
        </div>
        <p className="mt-3 px-1 text-micro text-muted leading-relaxed">
          Unofficial student resource · not an official SGSITS portal
        </p>
      </div>
    </aside>
  );
}
