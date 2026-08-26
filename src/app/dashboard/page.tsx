import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ResourceCard from "@/components/ResourceCard";
import EmptyState from "@/components/EmptyState";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [recent, popular, myUploads] = await Promise.all([
    prisma.resource.findMany({
      where: { status: "APPROVED" },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { unit: true, topic: true, ratings: { select: { stars: true } } },
    }),
    prisma.resource.findMany({
      where: { status: "APPROVED" },
      take: 4,
      orderBy: { downloads: "desc" },
      include: { unit: true, topic: true, ratings: { select: { stars: true } } },
    }),
    prisma.resource.findMany({
      where: { uploadedById: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { unit: true, topic: true, ratings: { select: { stars: true } } },
    }),
  ]);

  return (
    <main className="max-w-5xl mx-auto px-5 py-12 space-y-12">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {session.user.name?.split(" ")[0]}</h1>
      </div>

      <section>
        <h2 className="font-semibold mb-4">Recently Added</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {recent.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-4">Most Popular</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {popular.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Your Contributions</h2>
          <Link href="/upload" className="text-sm font-semibold" style={{ color: "var(--primary)" }}>
            Upload Notes
          </Link>
        </div>
        {myUploads.length === 0 ? (
          <EmptyState title="You haven't uploaded anything yet." subtitle="Share notes with your classmates." />
        ) : (
          <div className="space-y-2">
            {myUploads.map((r) => (
              <div key={r.id} className="card p-4 flex items-center justify-between">
                <Link href={`/resource/${r.id}`} className="font-medium text-sm hover:underline">
                  {r.title}
                </Link>
                <span
                  className="badge"
                  style={
                    r.status === "APPROVED"
                      ? { background: "#dcfce7", color: "#166534" }
                      : r.status === "REJECTED"
                      ? { background: "#fee2e2", color: "#991b1b" }
                      : { background: "var(--accent-pale)", color: "var(--accent)" }
                  }
                >
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
