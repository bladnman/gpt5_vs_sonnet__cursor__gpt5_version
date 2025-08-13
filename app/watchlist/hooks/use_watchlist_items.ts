import {parseWatchlistParams} from "@/app/watchlist/utils/parse_params";
import {filterAndSortWatchlist} from "@/app/watchlist/utils/transform_items";
import {prisma} from "@/lib/db";
import type {MinimalShow} from "@/lib/tmdb/types";

export default async function use_watchlist_items(
  sp: Record<string, string | string[] | undefined>,
  userId?: string
): Promise<
  {id: string; show: MinimalShow; interest: "LOW" | "MEDIUM" | "HIGH"}[]
> {
  if (!userId) return [];
  const raw = await prisma.interest.findMany({
    where: {userId},
    include: {show: true},
    orderBy: {createdAt: "desc"},
  });
  const ratings = await prisma.rating.findMany({
    where: {userId, showId: {in: raw.map((i) => i.showId)}},
    select: {showId: true, rating: true},
  });
  const ratingMap = new Map(ratings.map((r) => [r.showId, r.rating]));
  const params = parseWatchlistParams(sp);
  const sorted = filterAndSortWatchlist(
    raw.map((i) => ({
      id: i.id,
      createdAt: i.createdAt,
      show: {title: i.show?.title ?? null},
      rating: ratingMap.get(i.showId) ?? null,
      interest: i.level as "LOW" | "MEDIUM" | "HIGH",
    })),
    params
  );
  const idToShow = new Map(raw.map((i) => [i.id, i.show]));
  return sorted.map((i) => ({
    id: i.id,
    show: idToShow.get(i.id) as unknown as MinimalShow,
    interest: i.interest,
  }));
}
