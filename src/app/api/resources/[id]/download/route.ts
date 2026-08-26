import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resource = await prisma.resource.update({
    where: { id },
    data: { downloads: { increment: 1 } },
  });
  return NextResponse.json({ fileUrl: resource.fileUrl });
}
