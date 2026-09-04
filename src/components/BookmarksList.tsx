'use client';

import { useState } from 'react';
import NoteListItem from '@/components/ui/NoteListItem';
import SearchInput from '@/components/ui/SearchInput';
import Tabs from '@/components/ui/Tabs';
import EmptyState from '@/components/ui/EmptyState';
import { Bookmark } from 'lucide-react';

const GROUPS: { key: string; label: string; match: (type: string) => boolean }[] = [
  { key: 'all', label: 'All', match: () => true },
  { key: 'notes', label: 'Notes', match: (t) => t === 'NOTES' || t === 'HANDWRITTEN_NOTES' },
  { key: 'pyq', label: 'PYQ', match: (t) => t === 'PYQ' || t === 'QUESTION_BANK' },
  { key: 'reference', label: 'Reference', match: (t) => t === 'REFERENCE_MATERIAL' || t === 'SYLLABUS' || t === 'CHEAT_SHEET' },
  { key: 'other', label: 'Other', match: (t) => !['NOTES', 'HANDWRITTEN_NOTES', 'PYQ', 'QUESTION_BANK', 'REFERENCE_MATERIAL', 'SYLLABUS', 'CHEAT_SHEET'].includes(t) },
];

export default function BookmarksList({ bookmarks }: { bookmarks: any[] }) {
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState('all');

  const activeMatch = GROUPS.find((g) => g.key === group)!.match;
  const filtered = bookmarks.filter(
    (b) => activeMatch(b.resource.type) && b.resource.title.toLowerCase().includes(search.toLowerCase())
  );

  const tabs = GROUPS.map((g) => ({
    key: g.key,
    label: g.label,
    count: g.key === 'all' ? bookmarks.length : bookmarks.filter((b) => g.match(b.resource.type)).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs tabs={tabs} active={group} onChange={setGroup} />
        <div className="w-full sm:max-w-[240px]">
          <SearchInput value={search} onChange={setSearch} placeholder="Search bookmarks…" />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="flex flex-col gap-2">
          {filtered.map((b) => (
            <NoteListItem key={b.id} note={b.resource as any} variant="row" bookmarked />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No bookmarks here"
          body="Save notes, PYQs and reference material to find them quickly later."
          Icon={Bookmark}
        />
      )}
    </div>
  );
}
