import {prisma} from "@/lib/db";
import type {MinimalShow} from "@/lib/tmdb/types";

export async function ensureShowExists(minimal: MinimalShow) {
  await prisma.show.upsert({
    where: {id: minimal.id},
    create: {
      id: minimal.id,
      tmdbId: minimal.tmdbId,
      mediaType: minimal.mediaType,
      title: minimal.title,
      posterPath: minimal.posterPath ?? null,
      releaseDate: minimal.releaseDate ?? null,
      tmdbRating: minimal.tmdbRating ?? null,
      tmdbVoteCount: minimal.tmdbVoteCount ?? null,
    },
    update: {
      title: minimal.title,
      posterPath: minimal.posterPath ?? null,
      releaseDate: minimal.releaseDate ?? null,
      tmdbRating: minimal.tmdbRating ?? null,
      tmdbVoteCount: minimal.tmdbVoteCount ?? null,
    },
  });
}

export type UserShowState = {
  showId: string;
  onWatchlist: boolean;
  watchedAt?: string | null;
  rating?: number | null;
  interest?: "LOW" | "MEDIUM" | "HIGH" | null;
};

export async function getUserShowStates(
  userId: string,
  showIds: string[]
): Promise<Record<string, UserShowState>> {
  if (showIds.length === 0) return {};
  const [watchlist, watches, ratings, interests] = await Promise.all([
    prisma.watchlist.findMany({where: {userId, showId: {in: showIds}}}),
    prisma.watch.findMany({where: {userId, showId: {in: showIds}}}),
    prisma.rating.findMany({
      where: {userId, showId: {in: showIds}},
      select: {showId: true, rating: true},
    }),
    prisma.interest.findMany({
      where: {userId, showId: {in: showIds}},
      select: {showId: true, level: true},
    }),
  ]);

  const map: Record<string, UserShowState> = {};
  for (const id of showIds) {
    map[id] = {
      showId: id,
      onWatchlist: false,
      watchedAt: null,
      rating: null,
      interest: null,
    };
  }
  for (const w of watchlist) {
    map[w.showId].onWatchlist = true;
  }
  for (const w of watches) {
    const dateStr = w.watchedAt?.toISOString?.() ?? null;
    map[w.showId].watchedAt = dateStr;
  }
  for (const r of ratings) {
    map[r.showId].rating = r.rating;
  }
  for (const i of interests) {
    map[i.showId].interest = i.level as UserShowState["interest"];
  }
  return map;
}
