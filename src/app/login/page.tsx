'use client';

import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card elevated className="w-full max-w-md p-8">
        <h1 className="text-page font-heading tracking-[-0.01em] text-ink mb-1">Welcome back</h1>
        <p className="text-body-lg text-secondary mb-8">Sign in to your College Notes Hub account.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email address" className="w-full h-10 px-3 rounded-input border border-border bg-surface text-body focus:ring-2 focus:ring-sage-500 outline-none" required />
          <input type="password" placeholder="Password" className="w-full h-10 px-3 rounded-input border border-border bg-surface text-body focus:ring-2 focus:ring-sage-500 outline-none" required />
          <Button variant="primary" size="lg" className="w-full justify-center">Sign In</Button>
        </form>

        <p className="mt-6 text-center text-meta text-secondary">
          Don't have an account? <Link href="/register" className="text-sage-600 hover:underline">Register here</Link>
        </p>
      </Card>
    </div>
  );
}
