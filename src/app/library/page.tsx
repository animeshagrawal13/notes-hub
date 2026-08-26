import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ResourceCard from "@/components/ResourceCard";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    include: { resource: { include: { unit: true, topic: true, ratings: { select: { stars: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  const grouped = bookmarks.reduce<Record<string, typeof bookmarks>>((acc, b) => {
    (acc[b.collection] ??= []).push(b);
    return acc;
  }, {});

  return (
    <main className="max-w-5xl mx-auto px-5 py-12">
      <h1 className="serif text-2xl font-bold mb-8">My Library</h1>

      {bookmarks.length === 0 ? (
        <EmptyState
          title="Your library is empty"
          subtitle="Save resources to find them here later."
          action={
            <Link href="/browse" className="inline-block px-5 py-2.5 rounded-lg text-white font-semibold" style={{ background: "var(--primary)" }}>
              Browse Notes
            </Link>
          }
        />
      ) : (
        Object.entries(grouped).map(([collection, items]) => (
          <div key={collection} className="mb-10">
            <h2 className="font-semibold mb-4">{collection}</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {items.map((b) => (
                <ResourceCard key={b.id} resource={b.resource} />
              ))}
            </div>
          </div>
        ))
      )}
    </main>
  );
}
