import {prisma} from "@/lib/db";
import type {MinimalShow} from "@/lib/tmdb/types";

export default async function use_collections_data(userId?: string): Promise<{
  watchlist: MinimalShow[];
  ratings: {id: string; show: MinimalShow; rating: number}[];
  history: MinimalShow[];
}> {
  if (!userId) return {watchlist: [], ratings: [], history: []};
  const [watchlist, ratings, history] = await Promise.all([
    prisma.watchlist.findMany({where: {userId}, include: {show: true}}),
    prisma.rating.findMany({where: {userId}, include: {show: true}}),
    prisma.watch.findMany({
      where: {userId},
      include: {show: true},
      orderBy: {watchedAt: "desc"},
    }),
  ]);
  return {
    watchlist: watchlist.map((w) => w.show as unknown as MinimalShow),
    ratings: ratings.map((r) => ({
      id: r.id,
      show: r.show as unknown as MinimalShow,
      rating: r.rating,
    })),
    history: history.map((h) => h.show as unknown as MinimalShow),
  };
}
