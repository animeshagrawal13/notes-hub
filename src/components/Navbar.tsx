"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Search, Upload, Library, User, LogOut, ShieldCheck } from "lucide-react";
import Crest from "@/components/Crest";

const NAV_LINKS = [
  { href: "/browse", label: "Browse Notes" },
  { href: "/library", label: "My Library" },
  { href: "/upload", label: "Upload" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <>
      <div style={{ background: "#163D73", color: "rgba(255,255,255,.85)" }} className="mono text-xs hidden sm:block">
        <div className="max-w-6xl mx-auto px-5 py-1.5 flex flex-wrap justify-between gap-2">
          <span>Shri G. S. Institute of Technology &amp; Science, Indore — NAAC A Grade · RGPV Affiliated</span>
          <span>📍 23, Sir M. Visvesvaraya Marg, Indore M.P. 452003 · Estd. 1952</span>
        </div>
      </div>

      <header className="sticky top-0 z-50" style={{ background: "var(--hdr)" }}>
        <div className="max-w-6xl mx-auto px-5 h-[68px] flex items-center gap-4 justify-between">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Crest size={40} />
            <div>
              <div className="serif font-bold text-white text-[14px] leading-tight hidden sm:block">
                Shri G. S. Institute of Technology &amp; Science
              </div>
              <div className="serif font-bold text-white text-[13px] leading-tight sm:hidden">SGSITS, Indore</div>
              <div className="mono text-[10px] tracking-widest" style={{ color: "var(--gold)" }}>
                NOTES HUB · B.TECH 1ST YEAR
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="transition-colors"
                style={{ color: pathname?.startsWith(l.href) ? "var(--gold)" : "rgba(255,255,255,.8)" }}
              >
                {l.label}
              </Link>
            ))}
            {session?.user?.role === "ADMIN" && (
              <Link href="/admin" className="flex items-center gap-1" style={{ color: "var(--gold)" }}>
                <ShieldCheck size={16} /> Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/search"
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ border: "1px solid rgba(255,255,255,.2)", color: "#fff" }}
              aria-label="Search"
            >
              <Search size={16} />
            </Link>
            {session ? (
              <>
                <Link href="/profile" className="hidden sm:flex items-center gap-2 text-sm font-medium text-white">
                  <User size={16} />
                  {session.user?.name?.split(" ")[0]}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ border: "1px solid rgba(255,255,255,.2)", color: "#fff" }}
                  aria-label="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-full text-sm font-semibold"
                style={{ background: "var(--gold)", color: "#163D73" }}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
        <div className="ribbon" />
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-[var(--border)] flex justify-around py-2">
        <Link href="/" className="flex flex-col items-center text-xs gap-1 p-1">
          <Crest size={18} /> Home
        </Link>
        <Link href="/search" className="flex flex-col items-center text-xs gap-1 p-1">
          <Search size={20} /> Search
        </Link>
        <Link href="/upload" className="flex flex-col items-center text-xs gap-1 p-1">
          <Upload size={20} /> Upload
        </Link>
        <Link href="/library" className="flex flex-col items-center text-xs gap-1 p-1">
          <Library size={20} /> Library
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-xs gap-1 p-1">
          <User size={20} /> Profile
        </Link>
      </nav>
    </>
  );
}
