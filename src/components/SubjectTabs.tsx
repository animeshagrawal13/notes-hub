"use client";

import { useMemo, useState } from "react";
import ResourceCard from "@/components/ResourceCard";
import EmptyState from "@/components/EmptyState";

type Resource = {
  id: string;
  title: string;
  type: string;
  fileType: string;
  fileSize: number;
  downloads: number;
  views: number;
  unit?: { id: string; number: number } | null;
  topic?: { id: string; name: string } | null;
  ratings: { stars: number }[];
};

type Topic = { id: string; name: string };
type Unit = { id: string; number: number; title: string; topics: Topic[] };

const TABS = [
  { key: "units", label: "Units" },
  { key: "NOTES", label: "Notes" },
  { key: "PYQ", label: "PYQs" },
  { key: "QUESTION_BANK", label: "Question Bank" },
  { key: "ASSIGNMENT", label: "Assignments" },
  { key: "PRACTICAL", label: "Practicals" },
  { key: "REFERENCE_MATERIAL", label: "Reference" },
];

export default function SubjectTabs({ resources, units }: { resources: Resource[]; units: Unit[] }) {
  const [tab, setTab] = useState("units");

  const grouped = useMemo(() => {
    const byUnit = new Map<string, Resource[]>();
    const byTopic = new Map<string, Resource[]>();
    for (const u of units) {
      byUnit.set(u.id, []);
      for (const t of u.topics) byTopic.set(t.id, []);
    }
    const noUnit: Resource[] = [];
    for (const r of resources) {
      if (r.topic) byTopic.get(r.topic.id)?.push(r);
      else if (r.unit) byUnit.get(r.unit.id)?.push(r);
      else noUnit.push(r);
    }
    return { byUnit, byTopic, noUnit };
  }, [resources, units]);

  const filtered = tab === "units" ? [] : resources.filter((r) => r.type === tab || (tab === "PRACTICAL" && r.type === "LAB_MANUAL"));

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 border-b border-[var(--border)]">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
            style={
              tab === t.key
                ? { background: "var(--primary)", color: "white" }
                : { background: "var(--border-soft)", color: "var(--soft)" }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "units" ? (
        units.length === 0 && grouped.noUnit.length === 0 ? (
          <EmptyState title="No notes found" subtitle="Try changing your filters or upload the first resource." />
        ) : (
          <div className="space-y-8">
            {units.map((u) => {
              const directItems = grouped.byUnit.get(u.id) ?? [];
              const hasTopicItems = u.topics.some((t) => (grouped.byTopic.get(t.id)?.length ?? 0) > 0);
              if (directItems.length === 0 && !hasTopicItems) return null;
              return (
                <div key={u.id}>
                  <h3 className="font-semibold mb-3">
                    Unit {u.number} — {u.title}
                  </h3>

                  {u.topics.map((t) => {
                    const items = grouped.byTopic.get(t.id) ?? [];
                    if (items.length === 0) return null;
                    return (
                      <div key={t.id} className="mb-5">
                        <p className="text-sm font-medium text-[var(--soft)] mb-2 ml-1">{t.name}</p>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {items.map((r) => (
                            <ResourceCard key={r.id} resource={r} />
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {directItems.length > 0 && (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {directItems.map((r) => (
                        <ResourceCard key={r.id} resource={r} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {grouped.noUnit.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">General / Subject-wide</h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {grouped.noUnit.map((r) => (
                    <ResourceCard key={r.id} resource={r} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      ) : filtered.length === 0 ? (
        <EmptyState title="No notes found" subtitle="Try changing your filters or upload the first resource." />
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      )}
    </div>
  );
}
