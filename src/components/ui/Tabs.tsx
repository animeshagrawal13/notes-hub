'use client';
import { cn } from '@/lib/cn';

export type TabDef = { key: string; label: string; count?: number };

export function Tabs({
  tabs,
  active,
  onChange,
  className,
}: {
  tabs: TabDef[];
  active: string;
  onChange: (key: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('flex gap-1 overflow-x-auto border-b border-border pb-px', className)}>
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          className={cn(
            'flex items-center gap-1.5 whitespace-nowrap px-3.5 pb-2.5 pt-1 text-body-lg font-semibold transition duration-calm ease-calm',
            active === t.key
              ? 'border-b-2 border-sage-600 text-ink'
              : 'border-b-2 border-transparent text-secondary hover:text-ink'
          )}
        >
          {t.label}
          {t.count != null && (
            <span className="rounded-full bg-sage-100 px-1.5 py-0.5 text-micro text-sage-700">{t.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

export default Tabs;

