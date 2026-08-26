import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminPanel from "@/components/AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");

  const [totalUsers, totalResources, totalDownloadsAgg, totalViewsAgg, pending, reports, colleges] = await Promise.all([
    prisma.user.count(),
    prisma.resource.count(),
    prisma.resource.aggregate({ _sum: { downloads: true } }),
    prisma.resource.aggregate({ _sum: { views: true } }),
    prisma.resource.findMany({
      where: { status: "PENDING" },
      include: { subject: true, uploadedBy: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.report.findMany({
      where: { status: "OPEN" },
      include: { resource: true, user: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.college.findMany({
      include: {
        semesters: {
          include: { branch: true, subjects: true },
          orderBy: [{ year: "asc" }, { number: "asc" }],
        },
      },
    }),
  ]);

  const stats = {
    totalUsers,
    totalResources,
    totalDownloads: totalDownloadsAgg._sum.downloads ?? 0,
    totalViews: totalViewsAgg._sum.views ?? 0,
    pendingCount: pending.length,
    reportsCount: reports.length,
  };

  return (
    <main className="max-w-6xl mx-auto px-5 py-12">
      <h1 className="serif text-2xl font-bold mb-8">Admin Dashboard</h1>
      <AdminPanel stats={stats} pending={pending} reports={reports} colleges={colleges} />
    </main>
  );
}
