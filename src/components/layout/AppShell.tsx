'use client';
// Fixed sidebar (240px) + fluid main column on md+.
// For /login and /register renders children centered with no sidebar.
// Mounts ToastProvider and CommandPalette once globally.

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import CommandPalette from './CommandPalette';
import { ToastProvider } from '@/components/ui/Toast';

const NO_SHELL_PATHS = ['/login', '/register'];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const bare = NO_SHELL_PATHS.some((p) => pathname === p || pathname?.startsWith(p + '/'));

  if (bare) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-background flex items-center justify-center px-5 py-16">
          {children}
        </div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <CommandPalette />
      {/* Sidebar — hidden on mobile, fixed on md+ */}
      <Sidebar />
      {/* Main column offset by sidebar width on md+ */}
      <div className="md:pl-sidebar flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 px-8 py-8 md:px-10 md:py-10 max-w-shell w-full mx-auto">
          {children}
        </main>
      </div>
      <BottomNav />
    </ToastProvider>
  );
}
