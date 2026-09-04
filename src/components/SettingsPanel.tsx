'use client';

import { useState } from 'react';
import Tabs from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import Select from '@/components/ui/Select';

export default function SettingsPanel({ user, colleges, branches, semesters }: any) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('account');
  const [density, setDensity] = useState('comfortable');

  const tabs = [
    { key: 'account', label: 'Account' },
    { key: 'appearance', label: 'Appearance' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'privacy', label: 'Privacy' },
    { key: 'data', label: 'Data' },
  ];

  const handleSave = () => toast('Settings saved successfully', 'success');

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
      
      {activeTab === 'account' && (
        <div className="max-w-md space-y-4">
          <div>
            <label className="block text-meta font-medium mb-1">Name</label>
            <input type="text" defaultValue={user.name} className="w-full h-10 px-3 rounded-input border border-border bg-surface text-body" />
          </div>
          <div>
            <label className="block text-meta font-medium mb-1">College</label>
            <Select><option>Select College</option>{colleges.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
          </div>
          <div>
            <label className="block text-meta font-medium mb-1">Branch</label>
            <Select><option>Select Branch</option>{branches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}</Select>
          </div>
          <div>
            <label className="block text-meta font-medium mb-1">Semester</label>
            <Select><option>Select Semester</option>{semesters.map((s: any) => <option key={s.id} value={s.id}>Semester {s.number}</option>)}</Select>
          </div>
          <Button variant="primary" onClick={handleSave}>Save changes</Button>
        </div>
      )}

      {activeTab === 'appearance' && (
        <div className="max-w-md space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-card">
            <div>
              <p className="font-medium text-ink">Density</p>
              <p className="text-meta text-secondary">Adjust the spacing of UI elements</p>
            </div>
            <Select value={density} onChange={e => setDensity(e.target.value)}>
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </Select>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded-card">
            <div>
              <p className="font-medium text-ink">Reduced Motion</p>
              <p className="text-meta text-secondary">Disable non-essential animations</p>
            </div>
            <input type="checkbox" className="w-5 h-5 rounded text-sage-600" />
          </div>
        </div>
      )}

      {['notifications', 'privacy', 'data'].includes(activeTab) && (
        <div className="p-8 text-center border border-border rounded-card bg-surface opacity-50 cursor-not-allowed">
          <p className="text-body font-medium text-ink">These features are coming soon.</p>
        </div>
      )}
    </div>
  );
}
