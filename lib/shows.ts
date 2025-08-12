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
  waiting?: boolean;
};

export async function getUserShowStates(
  userId: string,
  showIds: string[]
): Promise<Record<string, UserShowState>> {
  if (showIds.length === 0) return {};
  const [watches, ratings, interests] = await Promise.all([
    prisma.watch.findMany({where: {userId, showId: {in: showIds}}}),
    prisma.rating.findMany({
      where: {userId, showId: {in: showIds}},
      select: {showId: true, rating: true},
    }),
    prisma.interest.findMany({
      where: {userId, showId: {in: showIds}},
      select: {showId: true, level: true, waiting: true},
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
  for (const w of watches) {
    const dateStr = w.watchedAt?.toISOString?.() ?? null;
    map[w.showId].watchedAt = dateStr;
  }
  for (const r of ratings) {
    map[r.showId].rating = r.rating;
  }
  for (const i of interests) {
    map[i.showId].interest = i.level as UserShowState["interest"];
    map[i.showId].waiting = (i as {waiting?: boolean}).waiting ?? false;
    map[i.showId].onWatchlist = true; // derived from having interest
  }
  return map;
}
