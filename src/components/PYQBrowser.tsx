'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import { parseExamYear } from '@/lib/format';
import Link from 'next/link';

export default function PYQBrowser({ pyqs }: { pyqs: any[] }) {
  const subjects = Array.from(new Set(pyqs.map(p => p.subject.name))).sort();
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set());

  const toggleSubject = (s: string) => {
    const next = new Set(selectedSubjects);
    if (next.has(s)) next.delete(s);
    else next.add(s);
    setSelectedSubjects(next);
  };

  const filtered = selectedSubjects.size > 0 ? pyqs.filter(p => selectedSubjects.has(p.subject.name)) : pyqs;

  const byYear: Record<string, any[]> = filtered.reduce((acc: Record<string, any[]>, p: any) => {
    const year = parseExamYear(p.title, p.tags) || 'Compilations & undated';
    if (!acc[year]) acc[year] = [];
    acc[year].push(p);
    return acc;
  }, {});

  const years = Object.keys(byYear).sort().reverse();

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-64 shrink-0 space-y-4">
        <h3 className="font-semibold text-card-title text-ink">Filter by Subject</h3>
        <div className="flex flex-wrap md:flex-col gap-2">
          {subjects.map(s => (
            <button key={s} onClick={() => toggleSubject(s)} className={`text-left px-3 py-1.5 rounded-button text-body transition-colors ${selectedSubjects.has(s) ? 'bg-sage-600 text-white' : 'bg-surface border border-border text-secondary hover:text-ink'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-6">
        {years.map(year => (
          <div key={year} className="space-y-4">
            <h2 className="text-xl font-heading text-ink">{year}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {byYear[year].map(p => (
                <Link key={p.id} href={`/notes/${p.id}`}>
                  <Card hover className="p-4 h-full flex flex-col justify-center">
                    <p className="text-meta text-sage-600 font-semibold mb-1">{p.subject.name}</p>
                    <p className="text-card-title font-medium text-ink">{p.title}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
