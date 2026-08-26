import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q) return NextResponse.json({ results: [] });

  const results = await prisma.resource.findMany({
    where: {
      status: "APPROVED",
      OR: [
        { title: { contains: q } },
        { tags: { contains: q } },
        { subject: { name: { contains: q } } },
      ],
    },
    take: 8,
    select: { id: true, title: true, type: true, subject: { select: { name: true } } },
  });

  return NextResponse.json({ results });
}
