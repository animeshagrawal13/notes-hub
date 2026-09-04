'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Leaf, AlertCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not create your account.');
        setLoading(false);
        return;
      }
      const result = await signIn('credentials', { email, password, redirect: false });
      setLoading(false);
      if (result?.error) {
        router.push('/login');
        return;
      }
      router.push('/');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card elevated className="w-full max-w-md p-8">
        <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-input bg-eucalyptus-fade text-white shadow-sm">
          <Leaf size={20} strokeWidth={1.9} />
        </span>
        <h1 className="mb-1 text-page font-heading tracking-[-0.01em] text-ink">Create an account</h1>
        <p className="mb-7 text-body-lg text-secondary">Join the College Notes Hub community.</p>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-input border border-[color:var(--danger)] bg-[color:var(--tint-terracotta)] px-3 py-2.5 text-body text-[color:var(--danger)]">
            <AlertCircle size={15} className="shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            autoComplete="name"
            className="w-full h-11 px-3.5 rounded-input border border-border bg-surface text-body outline-none focus:ring-2 focus:ring-sage-500"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            autoComplete="email"
            className="w-full h-11 px-3.5 rounded-input border border-border bg-surface text-body outline-none focus:ring-2 focus:ring-sage-500"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min. 6 characters)"
            autoComplete="new-password"
            minLength={6}
            className="w-full h-11 px-3.5 rounded-input border border-border bg-surface text-body outline-none focus:ring-2 focus:ring-sage-500"
            required
          />
          <Button variant="primary" size="lg" className="w-full justify-center" disabled={loading}>
            {loading ? 'Creating account…' : 'Register'}
          </Button>
        </form>

        <p className="mt-6 text-center text-meta text-secondary">
          Already have an account? <Link href="/login" className="font-semibold text-sage-600 hover:underline">Sign in</Link>
        </p>
      </Card>
    </div>
  );
}
