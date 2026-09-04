'use client';

import { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import SubjectCard from '@/components/ui/SubjectCard';
import SearchInput from '@/components/ui/SearchInput';
import Select from '@/components/ui/Select';
import { IconButton } from '@/components/ui/IconButton';
import { LayoutGrid, List } from 'lucide-react';

export default function SubjectsGrid({ subjects }: { subjects: any[] }) {
  const [layout, setLayout] = useState<'grid'|'list'>('grid');
  const [search, setSearch] = useState('');
  const [semester, setSemester] = useState('all');

  const filtered = subjects.filter(s => {
    if (semester !== 'all' && s.semester?.id !== semester) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Subjects" 
        subtitle="Browse all subjects and course material"
        actions={
          <div className="flex items-center gap-3">
            <Select value={semester} onChange={e => setSemester(e.target.value)}>
              <option value="all">All Semesters</option>
              <option value="sem1">Semester 1</option>
              <option value="sem2">Semester 2</option>
            </Select>
            <SearchInput value={search} onChange={setSearch} placeholder="Search..." />
            <div className="flex gap-1 border border-border rounded-button p-0.5 bg-surface">
              <IconButton onClick={() => setLayout('grid')} icon={<LayoutGrid size={16} />} label="Grid view" className={layout === 'grid' ? 'bg-elevated' : ''} />
              <IconButton onClick={() => setLayout('list')} icon={<List size={16} />} label="List view" className={layout === 'list' ? 'bg-elevated' : ''} />
            </div>
          </div>
        }
      />
      <div className={layout === 'grid' ? 'grid grid-cols-2 lg:grid-cols-4 gap-4' : 'flex flex-col gap-2'}>
        {filtered.map(s => (
          <SubjectCard key={s.id} id={s.id} name={s.name} code={s.code} notes={s._count.resources} pyqs={s.pyqsCount} layout={layout} />
        ))}
      </div>
    </div>
  );
}
