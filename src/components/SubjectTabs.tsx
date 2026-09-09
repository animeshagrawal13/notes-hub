'use client';

import { useState } from 'react';
import Tabs from '@/components/ui/Tabs';
import NoteListTable from '@/components/ui/NoteListTable';
import EmptyState from '@/components/ui/EmptyState';

// Resource types grouped into the four boxes students actually think in
// terms of (mirrors how the source material itself was organized on Drive:
// Books / Notes / Class Slides / PYQs, with PYQs split into MST & End-Sem).
const BOOK_TYPES = new Set(['REFERENCE_MATERIAL', 'CHEAT_SHEET']);
const NOTES_TYPES = new Set(['NOTES', 'HANDWRITTEN_NOTES']);
const SLIDES_TYPES = new Set(['SLIDES']);
const PYQ_TYPES = new Set(['PYQ', 'QUESTION_BANK', 'IMPORTANT_QUESTIONS']);
// Everything else (assignments, practicals, lab manuals, syllabus) still
// needs a home so nothing silently disappears from the subject page.
const OTHER_TYPES = new Set(['ASSIGNMENT', 'PRACTICAL', 'LAB_MANUAL', 'SYLLABUS']);

function isMst(title: string) {
  return /\bmst\b|mid[\s-]?sem(ester)?|\bmid[\s-]?term\b/i.test(title);
}
function isEndSem(title: string) {
  return /end[\s-]?sem|end[\s-]?of[\s-]?semester/i.test(title);
}

export default function SubjectTabs({
  subject,
  resources,
  bookmarkedIds,
}: {
  subject: any;
  resources: any[];
  bookmarkedIds?: Set<string>;
}) {
  const books = resources.filter((r) => BOOK_TYPES.has(r.type));
  const notes = resources.filter((r) => NOTES_TYPES.has(r.type));
  const slides = resources.filter((r) => SLIDES_TYPES.has(r.type));
  const pyqs = resources.filter((r) => PYQ_TYPES.has(r.type));
  const other = resources.filter((r) => OTHER_TYPES.has(r.type));

  const mstPyqs = pyqs.filter((r) => isMst(r.title));
  const endSemPyqs = pyqs.filter((r) => isEndSem(r.title) && !isMst(r.title));
  const otherPyqs = pyqs.filter((r) => !isMst(r.title) && !isEndSem(r.title));

  const TABS = [
    { key: 'books', label: 'Books', count: books.length },
    { key: 'notes', label: 'Notes', count: notes.length },
    { key: 'slides', label: 'Class Slides', count: slides.length },
    { key: 'pyq', label: 'PYQs', count: pyqs.length },
    { key: 'other', label: 'Other', count: other.length },
  ].filter((t) => t.key === 'pyq' || t.count > 0 || resources.length === 0);

  const [active, setActive] = useState(TABS[0]?.key ?? 'books');
  const activeKey = TABS.some((t) => t.key === active) ? active : TABS[0]?.key ?? 'books';

  return (
    <div className="space-y-6">
      <Tabs tabs={TABS} active={activeKey} onChange={setActive} />

      {activeKey === 'books' && (
        <NoteListTable notes={books} bookmarkedIds={bookmarkedIds} emptyTitle="No books yet" />
      )}

      {activeKey === 'notes' && (
        <NoteListTable notes={notes} bookmarkedIds={bookmarkedIds} emptyTitle="No notes yet" />
      )}

      {activeKey === 'slides' && (
        <NoteListTable notes={slides} bookmarkedIds={bookmarkedIds} emptyTitle="No class slides yet" />
      )}

      {activeKey === 'pyq' && (
        <div className="space-y-8">
          {pyqs.length === 0 && <EmptyState title="No PYQs yet" body="Be the first to upload." />}
          {mstPyqs.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-card-title font-semibold text-ink">MST</h3>
              <NoteListTable notes={mstPyqs} bookmarkedIds={bookmarkedIds} />
            </section>
          )}
          {endSemPyqs.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-card-title font-semibold text-ink">End-Semester</h3>
              <NoteListTable notes={endSemPyqs} bookmarkedIds={bookmarkedIds} />
            </section>
          )}
          {otherPyqs.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-card-title font-semibold text-ink">Sample &amp; Other Papers</h3>
              <NoteListTable notes={otherPyqs} bookmarkedIds={bookmarkedIds} />
            </section>
          )}
        </div>
      )}

      {activeKey === 'other' && (
        <NoteListTable notes={other} bookmarkedIds={bookmarkedIds} emptyTitle="Nothing else here" />
      )}
    </div>
  );
}
