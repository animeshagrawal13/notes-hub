"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck, Download, Flag, Star } from "lucide-react";

const REPORT_REASONS = [
  "Incorrect content",
  "Wrong subject",
  "Wrong semester",
  "Duplicate",
  "Poor quality",
  "Copyright issue",
  "Other",
];

export default function ResourceActions({
  resourceId,
  fileUrl,
  initiallyBookmarked,
  myRating,
}: {
  resourceId: string;
  fileUrl: string;
  initiallyBookmarked: boolean;
  myRating: number | null;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(initiallyBookmarked);
  const [rating, setRating] = useState(myRating ?? 0);
  const [toast, setToast] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  async function handleDownload() {
    await fetch(`/api/resources/${resourceId}/download`, { method: "POST" });
    window.open(fileUrl, "_blank");
    showToast("Download started");
    router.refresh();
  }

  async function handleBookmark() {
    if (!session) return (window.location.href = "/login");
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resourceId }),
    });
    const data = await res.json();
    setBookmarked(data.bookmarked);
    showToast(data.bookmarked ? "Saved to library" : "Removed from library");
  }

  async function handleRate(stars: number) {
    if (!session) return (window.location.href = "/login");
    setRating(stars);
    await fetch(`/api/resources/${resourceId}/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stars }),
    });
    showToast("Thanks for rating!");
    router.refresh();
  }

  async function handleReport(reason: string) {
    if (!session) return (window.location.href = "/login");
    await fetch(`/api/resources/${resourceId}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    setReportOpen(false);
    showToast("Report submitted. Thank you.");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleDownload}
          className="px-4 py-2 rounded-lg text-white font-semibold flex items-center gap-2"
          style={{ background: "var(--primary)" }}
        >
          <Download size={16} /> Download
        </button>
        <button onClick={handleBookmark} className="px-4 py-2 rounded-lg border border-[var(--border)] font-semibold flex items-center gap-2">
          {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          {bookmarked ? "Saved" : "Save"}
        </button>
        <button
          onClick={() => setReportOpen((v) => !v)}
          className="px-4 py-2 rounded-lg border border-[var(--border)] font-semibold flex items-center gap-2 text-[var(--soft)]"
        >
          <Flag size={16} /> Report
        </button>
      </div>

      <div>
        <p className="text-sm font-medium mb-1">Rate this resource</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => handleRate(n)} aria-label={`Rate ${n} stars`}>
              <Star size={22} fill={n <= rating ? "var(--accent)" : "none"} style={{ color: "var(--accent)" }} />
            </button>
          ))}
        </div>
      </div>

      {reportOpen && (
        <div className="card p-4">
          <p className="text-sm font-medium mb-2">Why are you reporting this?</p>
          <div className="flex flex-wrap gap-2">
            {REPORT_REASONS.map((r) => (
              <button key={r} onClick={() => handleReport(r)} className="badge badge-soft hover:bg-[var(--border)]">
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 bg-[var(--ink)] text-white text-sm px-4 py-2 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
