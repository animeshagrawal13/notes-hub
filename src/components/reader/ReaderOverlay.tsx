'use client';

// Bridges a route (intercepted overlay or the full /notes/[id] page) to
// <PdfReader>. Owns "close" = go back to wherever the user was, and locks
// body scroll while reading mode is up so the hub behind doesn't move
// (section 23 — return to exactly the previous state).

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { X } from 'lucide-react';

const PdfReader = dynamic(() => import('./PdfReader'), { ssr: false });

type Props = {
  fileUrl: string;
  resourceId: string;
  title: string;
  subtitle?: string;
  canRenderPdf: boolean;
  /** where to go on close when there's no history to pop (direct load) */
  fallbackHref?: string;
};

export default function ReaderOverlay({
  fileUrl,
  resourceId,
  title,
  subtitle,
  canRenderPdf,
  fallbackHref = '/notes',
}: Props) {
  const router = useRouter();

  const close = () => {
    // Prefer popping history so the previous page (with its scroll / filters /
    // search) is restored untouched; fall back to a hard destination.
    if (window.history.length > 1) router.back();
    else router.push(fallbackHref);
  };

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (!canRenderPdf) {
    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6" onClick={close}>
        <div
          className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 text-center shadow-pop"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-card-title font-semibold text-ink">Preview not available</h2>
          <p className="mt-2 text-body text-secondary">
            This file type can&rsquo;t be shown in the reader.
          </p>
          <button
            onClick={close}
            className="mt-4 inline-flex items-center gap-1.5 rounded-button border border-border px-4 py-2 text-body font-semibold text-ink hover:bg-sage-50"
          >
            <X size={15} /> Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <PdfReader
      fileUrl={fileUrl}
      resourceId={resourceId}
      title={title}
      subtitle={subtitle}
      onClose={close}
    />
  );
}
