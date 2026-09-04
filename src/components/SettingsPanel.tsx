'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import Tabs from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import Select from '@/components/ui/Select';
import { cn } from '@/lib/cn';
import { applyTheme, getStoredTheme, type Theme } from '@/lib/theme';

const MOTION_KEY = 'notes-hub:reduced-motion';

function SettingRow({ title, body, control }: { title: string; body: string; control: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-border bg-surface p-4 shadow-sm">
      <div className="min-w-0">
        <p className="font-medium text-ink">{title}</p>
        <p className="text-meta text-secondary">{body}</p>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

export default function SettingsPanel({ user, colleges, branches, semesters }: any) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('account');
  const [name, setName] = useState(user.name ?? '');
  const [collegeId, setCollegeId] = useState(user.collegeId ?? '');
  const [branchId, setBranchId] = useState(user.branchId ?? '');
  const [semesterId, setSemesterId] = useState(user.semesterId ?? '');
  const [saving, setSaving] = useState(false);

  const [theme, setThemeState] = useState<Theme>('light');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setThemeState(getStoredTheme());
    try {
      setReducedMotion(window.localStorage.getItem(MOTION_KEY) === '1');
    } catch {
      /* ignore */
    }
  }, []);

  const tabs = [
    { key: 'account', label: 'Account' },
    { key: 'appearance', label: 'Appearance' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'privacy', label: 'Privacy' },
    { key: 'data', label: 'Data' },
  ];

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          collegeId: collegeId || null,
          branchId: branchId || null,
          semesterId: semesterId || null,
        }),
      });
      if (!res.ok) throw new Error();
      toast('Settings saved', 'success');
    } catch {
      toast('Could not save settings', 'error');
    } finally {
      setSaving(false);
    }
  }

  function toggleTheme(next: Theme) {
    applyTheme(next);
    setThemeState(next);
  }

  function toggleReducedMotion(v: boolean) {
    setReducedMotion(v);
    document.documentElement.classList.toggle('force-reduced-motion', v);
    try {
      window.localStorage.setItem(MOTION_KEY, v ? '1' : '0');
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'account' && (
        <div className="max-w-md space-y-4">
          <div>
            <label className="block text-meta font-medium mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 rounded-input border border-border bg-surface text-body"
            />
          </div>
          <div>
            <label className="block text-meta font-medium mb-1.5">College</label>
            <Select value={collegeId} onChange={(e) => setCollegeId(e.target.value)} className="w-full">
              <option value="">Select college</option>
              {colleges.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-meta font-medium mb-1.5">Branch</label>
            <Select value={branchId} onChange={(e) => setBranchId(e.target.value)} className="w-full">
              <option value="">Select branch</option>
              {branches.map((b: any) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-meta font-medium mb-1.5">Semester</label>
            <Select value={semesterId} onChange={(e) => setSemesterId(e.target.value)} className="w-full">
              <option value="">Select semester</option>
              {semesters.map((s: any) => (
                <option key={s.id} value={s.id}>Semester {s.number}</option>
              ))}
            </Select>
          </div>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      )}

      {activeTab === 'appearance' && (
        <div className="max-w-md space-y-3">
          <SettingRow
            title="Theme"
            body="Switch between a light and dark Mint Eucalyptus surface."
            control={
              <div className="flex items-center gap-1 rounded-button border border-border bg-surface-soft p-1">
                {(['light', 'dark'] as Theme[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => toggleTheme(t)}
                    className={cn(
                      'flex h-8 items-center gap-1.5 rounded-tiny px-3 text-meta font-semibold transition duration-calm ease-calm',
                      theme === t ? 'bg-surface text-primary-strong shadow-sm' : 'text-muted hover:text-ink',
                    )}
                  >
                    {t === 'light' ? <Sun size={13} /> : <Moon size={13} />}
                    {t === 'light' ? 'Light' : 'Dark'}
                  </button>
                ))}
              </div>
            }
          />
          <SettingRow
            title="Reduced motion"
            body="Disable non-essential animations and transitions."
            control={
              <button
                role="switch"
                aria-checked={reducedMotion}
                onClick={() => toggleReducedMotion(!reducedMotion)}
                className={cn(
                  'relative h-6 w-11 rounded-full transition duration-calm ease-calm',
                  reducedMotion ? 'bg-sage-600' : 'bg-border',
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-calm ease-calm',
                    reducedMotion ? 'translate-x-[22px]' : 'translate-x-0.5',
                  )}
                />
              </button>
            }
          />
        </div>
      )}

      {['notifications', 'privacy', 'data'].includes(activeTab) && (
        <div className="max-w-md rounded-md border border-dashed border-border bg-surface-soft p-8 text-center">
          <p className="text-body font-medium text-secondary">These settings are coming soon.</p>
        </div>
      )}
    </div>
  );
}
