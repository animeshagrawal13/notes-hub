'use client';
// Sidebar open/closed state for the app shell. Persisted to localStorage so a
// collapsed sidebar stays collapsed across navigations and reloads. Defaults
// to open; on md- viewports the sidebar is hidden regardless (BottomNav takes
// over there), so this only drives the md+ layout.

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';

type ShellState = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (v: boolean) => void;
};

const ShellContext = createContext<ShellState>({
  sidebarOpen: true,
  toggleSidebar: () => {},
  setSidebarOpen: () => {},
});

export const useShell = () => useContext(ShellContext);

const STORAGE_KEY = 'notes-hub:sidebar-open';

export function ShellProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored !== null) setSidebarOpen(stored === '1');
    } catch {
      /* localStorage unavailable — keep default */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, sidebarOpen ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [sidebarOpen, hydrated]);

  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);

  return (
    <ShellContext.Provider value={{ sidebarOpen, toggleSidebar, setSidebarOpen }}>
      {children}
    </ShellContext.Provider>
  );
}
