import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Sign in to save resources" }, { status: 401 });

  const { resourceId, collection } = await req.json();
  if (!resourceId) return NextResponse.json({ error: "resourceId required" }, { status: 400 });

  const existing = await prisma.bookmark.findUnique({
    where: { userId_resourceId: { userId: session.user.id, resourceId } },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
    return NextResponse.json({ bookmarked: false });
  }

  await prisma.bookmark.create({
    data: { userId: session.user.id, resourceId, collection: collection || "Saved" },
  });
  return NextResponse.json({ bookmarked: true });
}
