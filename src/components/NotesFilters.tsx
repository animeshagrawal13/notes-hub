'use client';

import { useRouter } from 'next/navigation';
import SearchInput from '@/components/ui/SearchInput';
import Select from '@/components/ui/Select';

export default function NotesFilters({ currentQ, currentType, currentSort }: { currentQ?: string; currentType?: string; currentYear?: string; currentSort?: string }) {
  const router = useRouter();
  
  const update = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value && value !== 'all') params.set(key, value);
    else params.delete(key);
    router.push(`/notes?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="w-full sm:w-72">
        <SearchInput value={currentQ || ''} onChange={v => update('q', v)} placeholder="Search notes..." />
      </div>
      <div className="flex gap-2">
        <Select value={currentType || 'all'} onChange={e => update('type', e.target.value)}>
          <option value="all">All Types</option>
          <option value="NOTES">Notes</option>
          <option value="PYQ">PYQs</option>
          <option value="ASSIGNMENT">Assignments</option>
        </Select>
        <Select value={currentSort || 'new'} onChange={e => update('sort', e.target.value)}>
          <option value="new">Newest</option>
          <option value="popular">Most Popular</option>
        </Select>
      </div>
    </div>
  );
}
