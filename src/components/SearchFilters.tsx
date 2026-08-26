"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

const YEAR_LABELS: Record<number, string> = { 1: "First Year", 2: "Second Year", 3: "Third Year", 4: "Fourth Year" };

export default function SearchFilters({
  q,
  type,
  year,
  sort,
  types,
}: {
  q: string;
  type?: string;
  year?: string;
  sort?: string;
  types: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(q);

  function update(next: Record<string, string | undefined>) {
    const params = new URLSearchParams({ q, ...(type && { type }), ...(year && { year }), ...(sort && { sort }) });
    for (const [k, v] of Object.entries(next)) {
      if (v) params.set(k, v);
      else params.delete(k);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="space-y-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          update({ q: query });
        }}
        className="flex"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes, subjects, topics, PYQs..."
          className="flex-1 px-4 py-2.5 rounded-l-lg border border-[var(--border)] outline-none"
        />
        <button className="px-5 py-2.5 rounded-r-lg text-white font-semibold" style={{ background: "var(--primary)" }}>
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-2 text-sm">
        <select
          value={type ?? ""}
          onChange={(e) => update({ type: e.target.value || undefined })}
          className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-white"
        >
          <option value="">All Types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t.replace(/_/g, " ")}
            </option>
          ))}
        </select>

        <select
          value={year ?? ""}
          onChange={(e) => update({ year: e.target.value || undefined })}
          className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-white"
        >
          <option value="">All Years</option>
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {YEAR_LABELS[n]}
            </option>
          ))}
        </select>

        <select
          value={sort ?? ""}
          onChange={(e) => update({ sort: e.target.value || undefined })}
          className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-white"
        >
          <option value="">Most Viewed</option>
          <option value="downloads">Most Downloaded</option>
          <option value="recent">Recently Added</option>
        </select>
      </div>
    </div>
  );
}
