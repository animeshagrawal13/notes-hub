import {
  LayoutDashboard, BookOpen, FileText,
  Bookmark, ScrollText, CalendarDays, Upload, Settings,
} from 'lucide-react';

// Shared between the desktop Sidebar and the mobile drawer so the two menus
// can never drift apart.
export const NAV_ITEMS = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/subjects', icon: BookOpen, label: 'Subjects' },
  { href: '/notes', icon: FileText, label: 'Notes' },
  { href: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
  { href: '/pyq', icon: ScrollText, label: 'PYQ Papers' },
] as const;

export const NAV_SECONDARY = [
  { href: '/schedule', icon: CalendarDays, label: 'Schedule' },
  { href: '/uploads', icon: Upload, label: 'My Uploads' },
  { href: '/settings', icon: Settings, label: 'Settings' },
] as const;
