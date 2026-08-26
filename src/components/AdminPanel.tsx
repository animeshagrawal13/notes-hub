"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Users, FileStack, Download, Eye, Clock, Flag } from "lucide-react";

type Pending = {
  id: string;
  title: string;
  type: string;
  subject: { name: string };
  uploadedBy: { name: string };
};

type ReportItem = {
  id: string;
  reason: string;
  details: string | null;
  resource: { id: string; title: string };
  user: { name: string };
};

const YEAR_LABELS: Record<number, string> = { 1: "First Year", 2: "Second Year", 3: "Third Year", 4: "Fourth Year" };

type CollegeTree = {
  id: string;
  name: string;
  city: string;
  semesters: {
    id: string;
    year: number;
    number: number;
    branch: { name: string } | null;
    subjects: { id: string; name: string; code: string }[];
  }[];
};

const TABS = ["Overview", "Pending Approvals", "Reports", "Colleges"] as const;

export default function AdminPanel({
  stats,
  pending,
  reports,
  colleges,
}: {
  stats: { totalUsers: number; totalResources: number; totalDownloads: number; totalViews: number; pendingCount: number; reportsCount: number };
  pending: Pending[];
  reports: ReportItem[];
  colleges: CollegeTree[];
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const router = useRouter();

  async function decide(id: string, status: "APPROVED" | "REJECTED") {
    await fetch(`/api/admin/resources/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function resolve(id: string) {
    await fetch(`/api/admin/reports/${id}`, { method: "PATCH" });
    router.refresh();
  }

  return (
    <div>
      <div className="flex gap-2 mb-8 border-b border-[var(--border)] overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 text-sm font-semibold whitespace-nowrap border-b-2"
            style={tab === t ? { borderColor: "var(--primary)", color: "var(--primary)" } : { borderColor: "transparent", color: "var(--soft)" }}
          >
            {t}
            {t === "Pending Approvals" && stats.pendingCount > 0 && <span className="ml-1 badge badge-gold">{stats.pendingCount}</span>}
            {t === "Reports" && stats.reportsCount > 0 && <span className="ml-1 badge" style={{ background: "#fee2e2", color: "#991b1b" }}>{stats.reportsCount}</span>}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard icon={<Users size={18} />} label="Total Users" value={stats.totalUsers} />
          <StatCard icon={<FileStack size={18} />} label="Total Resources" value={stats.totalResources} />
          <StatCard icon={<Download size={18} />} label="Total Downloads" value={stats.totalDownloads} />
          <StatCard icon={<Eye size={18} />} label="Total Views" value={stats.totalViews} />
          <StatCard icon={<Clock size={18} />} label="Pending Approvals" value={stats.pendingCount} />
          <StatCard icon={<Flag size={18} />} label="Open Reports" value={stats.reportsCount} />
        </div>
      )}

      {tab === "Pending Approvals" && (
        <div className="space-y-3">
          {pending.length === 0 && <p className="text-sm text-[var(--soft)]">No resources awaiting review.</p>}
          {pending.map((r) => (
            <div key={r.id} className="card p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Link href={`/resource/${r.id}`} className="font-medium text-sm hover:underline">
                  {r.title}
                </Link>
                <p className="text-xs text-[var(--faint)]">
                  {r.subject.name} · {r.type.replace(/_/g, " ")} · by {r.uploadedBy.name}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => decide(r.id, "APPROVED")} className="px-3 py-1.5 rounded-lg text-white text-sm font-semibold" style={{ background: "#16a34a" }}>
                  Approve
                </button>
                <button onClick={() => decide(r.id, "REJECTED")} className="px-3 py-1.5 rounded-lg text-white text-sm font-semibold" style={{ background: "#dc2626" }}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "Reports" && (
        <div className="space-y-3">
          {reports.length === 0 && <p className="text-sm text-[var(--soft)]">No open reports.</p>}
          {reports.map((r) => (
            <div key={r.id} className="card p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Link href={`/resource/${r.resource.id}`} className="font-medium text-sm hover:underline">
                  {r.resource.title}
                </Link>
                <p className="text-xs text-[var(--faint)]">
                  {r.reason} · reported by {r.user.name}
                  {r.details ? ` — ${r.details}` : ""}
                </p>
              </div>
              <button onClick={() => resolve(r.id)} className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-sm font-semibold shrink-0">
                Mark Resolved
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "Colleges" && (
        <div className="space-y-6">
          <p className="text-xs text-[var(--faint)]">Read-only view of the college/year/semester/subject hierarchy.</p>
          {colleges.map((c) => (
            <div key={c.id} className="card p-4">
              <p className="font-semibold mb-2">
                {c.name} <span className="text-[var(--faint)] font-normal">· {c.city}</span>
              </p>
              {c.semesters.map((s) => (
                <p key={s.id} className="ml-4 text-xs text-[var(--soft)]">
                  {YEAR_LABELS[s.year]} · {s.branch ? s.branch.name : "Common to All Branches"} · Sem {s.number}:{" "}
                  {s.subjects.map((sub) => sub.code).join(", ") || "no subjects"}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 text-[var(--soft)] mb-2">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
