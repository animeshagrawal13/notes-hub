import { prisma } from '@/lib/prisma';

/** Resource ids the given user has bookmarked, as a Set for O(1) lookups
 *  while rendering a list. Returns an empty set for signed-out visitors. */
export async function getBookmarkedIds(userId?: string | null): Promise<Set<string>> {
  if (!userId) return new Set();
  const rows = await prisma.bookmark.findMany({
    where: { userId },
    select: { resourceId: true },
  });
  return new Set(rows.map((r) => r.resourceId));
}
