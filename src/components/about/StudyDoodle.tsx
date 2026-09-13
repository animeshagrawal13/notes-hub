// Small line-art illustration used on the About page — a stack of
// books/notebook/pen, drawn thin and monochrome so it reads as part of the
// page's design rather than a big standalone cartoon. Two variants share
// the same visual language: "hero" (books + bookmark + pen + sticky note)
// and "closing" (a shorter stack of notes/slides/PYQs, echoing the site's
// own three content types).
export function StudyDoodle({
  variant = 'hero',
  className,
}: {
  variant?: 'hero' | 'closing';
  className?: string;
}) {
  if (variant === 'closing') {
    return (
      <svg
        viewBox="0 0 220 170"
        fill="none"
        className={className}
        aria-hidden
      >
        <g stroke="var(--sage-500)" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
          <rect x="38" y="108" width="144" height="28" rx="6" fill="var(--sage-100)" />
          <rect x="50" y="80" width="120" height="28" rx="6" fill="var(--surface-elevated)" />
          <rect x="62" y="52" width="96" height="28" rx="6" fill="var(--sage-100)" />
          <path d="M62 66h96" strokeDasharray="2 5" opacity="0.6" />
          <path d="M50 94h120" strokeDasharray="2 5" opacity="0.6" />
          <path d="M38 122h144" strokeDasharray="2 5" opacity="0.6" />
        </g>
        <g className="animate-doodle-float" style={{ transformOrigin: '178px 40px' }}>
          <circle cx="178" cy="40" r="14" fill="var(--accent-cream)" opacity="0.9" />
          <path d="M172 40l4 4 8-9" stroke="var(--sage-700)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 260 260" fill="none" className={className} aria-hidden>
      {/* book stack */}
      <g stroke="var(--sage-500)" strokeWidth="1.6" strokeLinejoin="round">
        <rect x="58" y="160" width="140" height="24" rx="5" fill="var(--sage-100)" />
        <rect x="70" y="134" width="116" height="24" rx="5" fill="var(--surface-elevated)" />
        <rect x="64" y="108" width="128" height="24" rx="5" fill="var(--sage-200)" opacity="0.8" />
      </g>
      {/* notebook, tilted */}
      <g transform="rotate(-6 128 92)">
        <rect x="86" y="46" width="86" height="104" rx="8" fill="var(--surface-elevated)" stroke="var(--sage-600)" strokeWidth="1.6" />
        <path d="M100 68h58M100 84h58M100 100h40" stroke="var(--sage-300)" strokeWidth="2" strokeLinecap="round" />
        <rect x="86" y="46" width="10" height="104" rx="4" fill="var(--sage-400)" opacity="0.5" />
      </g>
      {/* bookmark ribbon */}
      <path d="M150 46v34l-8-7-8 7V46" fill="var(--sage-500)" opacity="0.85" />
      {/* pen, floating */}
      <g className="animate-doodle-float" style={{ transformOrigin: '206px 150px' }}>
        <g transform="rotate(34 206 150)">
          <rect x="198" y="96" width="8" height="70" rx="4" fill="var(--sage-600)" />
          <path d="M198 96l4-14 4 14z" fill="var(--sage-700)" />
        </g>
      </g>
      {/* sticky note, handwritten accent */}
      <g className="animate-doodle-float" style={{ transformOrigin: '54px 96px', animationDelay: '1.4s' }}>
        <rect x="18" y="70" width="72" height="60" rx="3" fill="var(--accent-cream)" transform="rotate(-4 54 100)" />
        <text
          x="54"
          y="104"
          textAnchor="middle"
          className="font-hand"
          style={{ fontSize: '15px', fill: 'var(--accent-cream-ink)' }}
          transform="rotate(-4 54 100)"
        >
          same notes,
        </text>
        <text
          x="54"
          y="122"
          textAnchor="middle"
          className="font-hand"
          style={{ fontSize: '15px', fill: 'var(--accent-cream-ink)' }}
          transform="rotate(-4 54 100)"
        >
          bigger impact
        </text>
      </g>
    </svg>
  );
}

export default StudyDoodle;
