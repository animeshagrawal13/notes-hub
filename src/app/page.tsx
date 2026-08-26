import Link from "next/link";
import { prisma } from "@/lib/prisma";
import TiltCard from "@/components/TiltCard";
import { ArrowRight, Download, Search, Star, TrendingUp, Upload } from "lucide-react";

export const dynamic = "force-dynamic";

const BADGES = ["NAAC Grade A", "RGPV Affiliated", "Autonomous · Estd. 1952", "Common to All Branches"];

async function getHomeData() {
  const [popularSubjects, trending, recent] = await Promise.all([
    prisma.subject.findMany({
      where: { resources: { some: {} } },
      take: 6,
      include: { _count: { select: { resources: true } } },
      orderBy: { resources: { _count: "desc" } },
    }),
    prisma.resource.findMany({
      where: { status: "APPROVED" },
      take: 4,
      orderBy: { downloads: "desc" },
      include: { subject: true },
    }),
    prisma.resource.findMany({
      where: { status: "APPROVED" },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { subject: true },
    }),
  ]);
  return { popularSubjects, trending, recent };
}

export default async function HomePage() {
  const { popularSubjects, trending, recent } = await getHomeData();

  return (
    <main>
      <section className="max-w-2xl mx-auto px-5 pt-16 sm:pt-20 pb-12 text-center">
        <div className="flex flex-wrap justify-center gap-2 mb-5">
          {BADGES.map((b) => (
            <span key={b} className="mono text-[10px] px-3 py-1 rounded-full pill">
              {b}
            </span>
          ))}
        </div>
        <h1 className="serif font-bold text-4xl sm:text-5xl leading-tight mb-4">
          B.Tech First Year
          <br />
          <span style={{ color: "var(--blue)" }}>Notes &amp; Syllabus Hub</span>
        </h1>
        <p className="text-base sm:text-lg text-[var(--soft)]">
          Unit-wise notes, official syllabus, class slides and previous year questions for every subject — Semester I &amp;
          II.
        </p>

        <form action="/search" className="relative max-w-md mx-auto mt-8">
          <input
            name="q"
            placeholder='Search e.g. "Physics" or "EE10510"…'
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm outline-none"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          />
          <Search size={18} className="absolute left-4 top-4" style={{ color: "var(--soft)" }} />
        </form>

        <div className="flex gap-3 justify-center flex-wrap mt-6">
          <Link
            href="/browse"
            className="px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2"
            style={{ background: "var(--blue)" }}
          >
            Find My Notes <ArrowRight size={18} />
          </Link>
          <Link href="/upload" className="px-6 py-3 rounded-xl font-semibold border border-[var(--border)] flex items-center gap-2 bg-white">
            <Upload size={18} /> Upload Notes
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pb-16">
        <h2 className="serif text-xl font-bold mb-5">Popular Subjects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {popularSubjects.map((s) => (
            <Link key={s.id} href={`/subject/${s.id}`}>
              <TiltCard className="p-5 h-full">
                <p className="font-semibold mb-1">{s.name}</p>
                <p className="mono text-xs text-[var(--faint)] mb-3">
                  {s.code}
                  {s.credits ? ` · ${s.credits}` : ""}
                </p>
                <p className="text-sm text-[var(--soft)]">{s._count.resources} resources</p>
              </TiltCard>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pb-16 grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="serif text-xl font-bold mb-5 flex items-center gap-2">
            <TrendingUp size={20} /> Trending Notes
          </h2>
          <div className="space-y-3">
            {trending.map((r) => (
              <Link key={r.id} href={`/resource/${r.id}`} className="card p-4 flex items-center justify-between block">
                <div>
                  <p className="font-medium text-sm">{r.title}</p>
                  <p className="mono text-xs text-[var(--faint)]">{r.subject.name}</p>
                </div>
                <span className="flex items-center gap-1 text-xs text-[var(--soft)]">
                  <Download size={14} /> {r.downloads}
                </span>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="serif text-xl font-bold mb-5 flex items-center gap-2">
            <Star size={20} /> Recently Added
          </h2>
          <div className="space-y-3">
            {recent.map((r) => (
              <Link key={r.id} href={`/resource/${r.id}`} className="card p-4 flex items-center justify-between block">
                <div>
                  <p className="font-medium text-sm">{r.title}</p>
                  <p className="mono text-xs text-[var(--faint)]">{r.subject.name}</p>
                </div>
                <span className="badge badge-soft">{r.type.replace(/_/g, " ")}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pb-24">
        <h2 className="serif text-xl font-bold mb-6 text-center">How It Works</h2>
        <div className="grid sm:grid-cols-4 gap-4 text-center">
          {["Choose your college", "Find your subject", "Open your notes", "Study smarter"].map((step, i) => (
            <div key={step} className="card p-5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3"
                style={{ background: "var(--blue)" }}
              >
                {i + 1}
              </div>
              <p className="text-sm font-medium">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
