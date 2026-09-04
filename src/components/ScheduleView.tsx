'use client';

import { useState } from 'react';
import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { ChevronLeft, ChevronRight, CalendarDays, Plus } from 'lucide-react';
import { formatEventDate } from '@/lib/format';

export default function ScheduleView({ events, isLoggedIn }: { events: any[], isLoggedIn: boolean }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [addOpen, setAddOpen] = useState(false);

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const monthEvents = events.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear();
  });

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between bg-surface p-4 rounded-panel border border-border">
        <IconButton icon={<ChevronLeft size={16} />} onClick={prevMonth} label="Previous month" />
        <h2 className="text-card-title font-semibold text-ink">
          {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
        </h2>
        <IconButton icon={<ChevronRight size={16} />} onClick={nextMonth} label="Next month" />
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-meta font-semibold text-muted py-2">{d}</div>
        ))}
        {blanks.map(b => <div key={`blank-${b}`} />)}
        {days.map(d => {
          const hasEvent = monthEvents.some(e => new Date(e.date).getDate() === d);
          return (
            <div key={d} className={`aspect-square flex items-center justify-center rounded-button text-body ${hasEvent ? 'bg-sage-100 text-sage-900 font-bold' : 'text-secondary bg-surface border border-border-light'}`}>
              {d}
            </div>
          );
        })}
      </div>

      <div className="space-y-4 pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-card-title font-semibold text-ink">Events this month</h3>
          {isLoggedIn && <Button variant="secondary" size="sm" onClick={() => setAddOpen(true)}><Plus size={16} /> Add Reminder</Button>}
        </div>
        
        {monthEvents.length > 0 ? (
          <div className="flex flex-col gap-2">
            {monthEvents.map(e => (
              <div key={e.id} className={`p-4 rounded-card border flex items-center justify-between ${e.kind === 'EXAM' ? 'bg-sage-50 border-sage-100' : e.kind === 'ASSIGNMENT' ? 'bg-ochre-50 border-ochre-100' : 'bg-lavender-50 border-lavender-100'}`}>
                <div>
                  <p className="font-semibold text-ink">{e.title}</p>
                  <p className="text-meta text-secondary">{formatEventDate(e.date)}</p>
                </div>
                <div className="text-xs font-bold uppercase tracking-wide px-2 py-1 rounded bg-white/50">{e.kind}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-muted flex flex-col items-center gap-2">
            <CalendarDays size={24} />
            <p>No events scheduled for this month.</p>
          </div>
        )}
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Reminder">
        <div className="p-4 space-y-4">
          <input type="text" placeholder="Event title" className="w-full h-10 px-3 rounded-input border border-border bg-surface text-body" />
          <input type="date" className="w-full h-10 px-3 rounded-input border border-border bg-surface text-body" />
          <select className="w-full h-10 px-3 rounded-input border border-border bg-surface text-body">
            <option value="REMINDER">Reminder</option>
            <option value="ASSIGNMENT">Assignment</option>
            <option value="EXAM">Exam</option>
          </select>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="tertiary" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setAddOpen(false)}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
