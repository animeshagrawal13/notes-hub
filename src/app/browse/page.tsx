import Link from "next/link";
import { prisma } from "@/lib/prisma";
import TiltCard from "@/components/TiltCard";
import { MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BrowseCollegesPage() {
  const colleges = await prisma.college.findMany({ orderBy: { name: "asc" } });

  return (
    <main className="max-w-4xl mx-auto px-5 py-12">
      <h1 className="serif text-2xl font-bold mb-2">Select Your College</h1>
      <p className="text-[var(--soft)] mb-8">Step 1 of 3 — choose where you study.</p>

      <div className="grid sm:grid-cols-2 gap-4">
        {colleges.map((c) => (
          <Link key={c.id} href={`/browse/${c.slug}`}>
            <TiltCard className="p-5 h-full flex items-start gap-3">
              <MapPin size={20} style={{ color: "var(--primary)" }} />
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-[var(--faint)]">{c.city}</p>
              </div>
            </TiltCard>
          </Link>
        ))}
      </div>
    </main>
  );
}
