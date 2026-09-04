'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useToast } from './Toast';

/**
 * The one bookmark control in the product. Optimistic toggle + a tiny pop on
 * change, real persistence via POST /api/bookmarks (userId_resourceId is a
 * unique constraint server-side, so this call is itself the toggle).
 * Safe to nest inside a <Link> — stops the click from bubbling into it.
 */
export function BookmarkButton({
  resourceId,
  initialBookmarked,
  size = 17,
  variant = 'icon',
  className,
}: {
  resourceId: string;
  initialBookmarked: boolean;
  size?: number;
  variant?: 'icon' | 'pill';
  className?: string;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [pending, setPending] = useState(false);
  const [pop, setPop] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;
    if (!session?.user) {
      router.push('/login');
      return;
    }
    const next = !bookmarked;
    setBookmarked(next);
    setPending(true);
    setPop(true);
    setTimeout(() => setPop(false), 260);
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBookmarked(!!data.bookmarked);
      router.refresh();
    } catch {
      setBookmarked(!next); // revert
      toast('Could not update bookmark', 'error');
    } finally {
      setPending(false);
    }
  }

  const Icon = bookmarked ? BookmarkCheck : Bookmark;

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={bookmarked}
        aria-label={bookmarked ? 'Remove bookmark' : 'Save bookmark'}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-button border px-3 py-2 text-body font-semibold transition duration-calm ease-calm',
          bookmarked
            ? 'border-transparent bg-sage-600 text-white hover:bg-sage-700'
            : 'border-border bg-surface text-secondary hover:border-sage-300 hover:text-ink',
          className,
        )}
      >
        <Icon size={size} strokeWidth={1.9} className={cn(pop && 'nav-try-pulse')} />
        {bookmarked ? 'Saved' : 'Save'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? 'Remove bookmark' : 'Save bookmark'}
      className={cn(
        'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition duration-calm ease-calm',
        bookmarked ? 'text-sage-600' : 'text-faint hover:text-sage-500',
        className,
      )}
    >
      <Icon
        size={size}
        strokeWidth={1.9}
        className={cn('transition-transform duration-200', pop && 'scale-125', bookmarked && 'fill-sage-100')}
      />
    </button>
  );
}

export default BookmarkButton;
