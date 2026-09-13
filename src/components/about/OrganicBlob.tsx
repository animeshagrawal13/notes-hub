// Purely decorative background shape used to break up the About page's
// otherwise-flat sections. Pure CSS (radial gradient + border-radius
// "blob" via long-hand values), so it costs nothing to render and needs no
// image asset. Always aria-hidden — never carries content.
import { cn } from '@/lib/cn';

const TONE_GRADIENTS: Record<'sage' | 'cream' | 'mint', string> = {
  sage: 'radial-gradient(circle at 35% 30%, var(--sage-300), transparent 70%)',
  mint: 'radial-gradient(circle at 60% 40%, var(--sage-200), transparent 70%)',
  cream: 'radial-gradient(circle at 45% 50%, var(--accent-cream), transparent 72%)',
};

export function OrganicBlob({
  tone = 'sage',
  className,
}: {
  tone?: 'sage' | 'cream' | 'mint';
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute -z-10 opacity-70 blur-xl dark:opacity-40', className)}
      style={{
        background: TONE_GRADIENTS[tone],
        borderRadius: '42% 58% 63% 37% / 41% 44% 56% 59%',
      }}
    />
  );
}

export default OrganicBlob;
