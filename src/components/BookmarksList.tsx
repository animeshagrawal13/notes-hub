'use client';

import { useState } from 'react';
import NoteListItem from '@/components/ui/NoteListItem';
import SearchInput from '@/components/ui/SearchInput';
import { IconButton } from '@/components/ui/IconButton';
import { LayoutGrid, List, BookmarkCheck } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';

export default function BookmarksList({ bookmarks }: { bookmarks: any[] }) {
  const [search, setSearch] = useState('');
  const [layout, setLayout] = useState<'row'|'table'>('row');

  const filtered = bookmarks.filter(b => b.resource.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search bookmarks..." />
        <div className="flex gap-1 border border-border rounded-button p-0.5 bg-surface">
          <IconButton onClick={() => setLayout('row')} icon={<List size={16} />} label="List view" className={layout === 'row' ? 'bg-elevated' : ''} />
          <IconButton onClick={() => setLayout('table')} icon={<LayoutGrid size={16} />} label="Table view" className={layout === 'table' ? 'bg-elevated' : ''} />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="flex flex-col gap-2">
          {filtered.map(b => (
            <NoteListItem key={b.id} note={b.resource as any} variant={layout} right={<BookmarkCheck className="text-sage-600 fill-sage-600" size={18} />} />
          ))}
        </div>
      ) : (
        <EmptyState title="No bookmarks found" />
      )}
    </div>
  );
}
