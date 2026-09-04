'use client';
import { Search } from 'lucide-react';
import { useEffect } from 'react';
import UserMenu from './UserMenu';
import type { Session } from 'next-auth';

export default function TopBarClient({ session }: { session: Session | null }) {

  // Expose global opener for Ctrl/Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('open-palette'));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-surface px-8 md:px-10">
      <button
        onClick={() => window.dispatchEvent(new CustomEvent('open-palette'))}
        className="flex w-[360px] items-center gap-2 rounded-input border border-border bg-background px-3 py-2 text-body text-muted transition duration-calm ease-calm hover:border-sage-300 hover:bg-surface"
        aria-label="Search notes (Ctrl+K)"
      >
        <Search size={15} strokeWidth={1.8} className="shrink-0" />
        <span className="flex-1 text-left">Search notes…</span>
        <kbd className="hidden rounded border border-border px-1 py-0.5 text-micro sm:inline">⌘K</kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <UserMenu session={session} />
      </div>
    </header>
  );
}