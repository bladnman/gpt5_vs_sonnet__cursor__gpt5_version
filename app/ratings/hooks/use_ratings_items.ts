import {parseRatingsParams} from "@/app/ratings/utils/parse_params";
import {filterAndSortRatings} from "@/app/ratings/utils/transform_items";
import {prisma} from "@/lib/db";
import type {MinimalShow} from "@/lib/tmdb/types";

export default async function use_ratings_items(
  sp: Record<string, string | string[] | undefined>,
  userId?: string
): Promise<{id: string; show: MinimalShow; rating: number}[]> {
  if (!userId) return [];
  const raw = await prisma.rating.findMany({
    where: {userId},
    include: {show: true},
    orderBy: {ratedAt: "desc"},
  });
  const interests = await prisma.interest.findMany({
    where: {userId, showId: {in: raw.map((i) => i.showId)}},
    select: {showId: true, level: true},
  });
  const interestMap = new Map(interests.map((r) => [r.showId, r.level]));
  const params = parseRatingsParams(sp);
  const sorted = filterAndSortRatings(
    raw.map((i) => ({
      id: i.id,
      rating: i.rating,
      ratedAt: i.ratedAt,
      show: {
        tmdbRating: i.show?.tmdbRating as number | null | undefined,
        title: i.show?.title ?? null,
      },
      interestLevel: (interestMap.get(i.showId) ?? null) as
        | "LOW"
        | "MEDIUM"
        | "HIGH"
        | null,
    })),
    params
  );
  const idToShow = new Map(raw.map((i) => [i.id, i.show]));
  return sorted.map((i) => ({
    id: i.id,
    show: idToShow.get(i.id) as unknown as MinimalShow,
    rating: i.rating,
  }));
}
