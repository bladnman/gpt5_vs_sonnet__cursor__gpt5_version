import {parseHistoryParams} from "@/app/history/utils/parse_params";
import {filterAndSortHistory} from "@/app/history/utils/transform_items";
import {prisma} from "@/lib/db";
import type {MinimalShow} from "@/lib/tmdb/types";

export default async function use_history_items(
  sp: Record<string, string | string[] | undefined>,
  userId?: string
): Promise<{id: string; show: MinimalShow; watchedAt: string}[]> {
  if (!userId) return [];
  const rawItems = await prisma.watch.findMany({
    where: {userId},
    include: {show: true},
    orderBy: {watchedAt: "desc"},
  });

  const idToShow = new Map(rawItems.map((i) => [i.id, i.show]));
  const params = parseHistoryParams(sp);
  const sorted = filterAndSortHistory(
    rawItems.map((i) => ({
      id: i.id,
      watchedAt: i.watchedAt,
      show: {
        tmdbRating: i.show?.tmdbRating as number | null | undefined,
        title: i.show?.title ?? null,
      },
    })),
    params
  );

  return sorted.map((i) => ({
    id: i.id,
    show: idToShow.get(i.id) as unknown as MinimalShow,
    watchedAt: i.watchedAt.toISOString(),
  }));
}
