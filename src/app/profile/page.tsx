import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Award, Download, FileStack, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      resources: { include: { ratings: true } },
      bookmarks: true,
    },
  });
  if (!user) redirect("/login");

  const approvedResources = user.resources.filter((r) => r.status === "APPROVED");
  const totalDownloads = approvedResources.reduce((s, r) => s + r.downloads, 0);
  const allRatings = approvedResources.flatMap((r) => r.ratings);
  const avgRating = allRatings.length > 0 ? allRatings.reduce((s, r) => s + r.stars, 0) / allRatings.length : null;

  const badge =
    approvedResources.length >= 20
      ? "Top Contributor"
      : approvedResources.length >= 5
      ? "Verified Contributor"
      : approvedResources.length >= 1
      ? "Helpful Student"
      : null;

  return (
    <main className="max-w-3xl mx-auto px-5 py-12">
      <div className="card p-8 mb-8 flex items-center gap-5">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
          style={{ background: "var(--primary)" }}
        >
          {user.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-xl font-bold">{user.name}</h1>
          <p className="text-sm text-[var(--soft)]">{user.email}</p>
          <p className="text-xs text-[var(--faint)] mt-1">
            Joined {user.createdAt.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </p>
        </div>
        {badge && (
          <span className="ml-auto badge badge-gold flex items-center gap-1">
            <Award size={12} /> {badge}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-5 text-center">
          <FileStack size={20} className="mx-auto mb-2" style={{ color: "var(--primary)" }} />
          <p className="text-xl font-bold">{approvedResources.length}</p>
          <p className="text-xs text-[var(--soft)]">Resources</p>
        </div>
        <div className="card p-5 text-center">
          <Download size={20} className="mx-auto mb-2" style={{ color: "var(--primary)" }} />
          <p className="text-xl font-bold">{totalDownloads}</p>
          <p className="text-xs text-[var(--soft)]">Downloads</p>
        </div>
        <div className="card p-5 text-center">
          <Star size={20} className="mx-auto mb-2" style={{ color: "var(--accent)" }} />
          <p className="text-xl font-bold">{avgRating ? avgRating.toFixed(1) : "—"}</p>
          <p className="text-xs text-[var(--soft)]">Avg Rating</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-xl font-bold">{user.bookmarks.length}</p>
          <p className="text-xs text-[var(--soft)]">Saved</p>
        </div>
      </div>
    </main>
  );
}
