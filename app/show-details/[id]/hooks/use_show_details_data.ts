import {prisma} from "@/lib/db";
import {getUserId} from "@/lib/session";
import {ensureShowExists, getUserShowStates} from "@/lib/shows";
import {
  getDetails,
  getRecommendations,
  getRichDetails,
  getSimilar,
} from "@/lib/tmdb/client";
import type {MinimalShow, ShowDetails, TmdbMediaType} from "@/lib/tmdb/types";

function parseShowId(id: string): {mediaType: TmdbMediaType; tmdbId: number} {
  const [prefix, tmdbIdStr] = id.split("_");
  const normalized = (prefix ?? "").toUpperCase();
  const mediaType: TmdbMediaType = normalized === "MOVIE" ? "movie" : "tv";
  const tmdbId = Number.parseInt(tmdbIdStr ?? "", 10);
  if (!Number.isFinite(tmdbId)) throw new Error("INVALID_ID");
  return {mediaType, tmdbId};
}

export default async function use_show_details_data(id: string): Promise<{
  mediaType: TmdbMediaType;
  tmdbId: number;
  rich: ShowDetails;
  rating: {rating: number} | null;
  interest: {level: "LOW" | "MEDIUM" | "HIGH"; waiting?: boolean} | null;
  recs: MinimalShow[];
  similar: MinimalShow[];
  relatedStates: Record<
    string,
    {
      onWatchlist: boolean;
      watchedAt?: string | null;
      rating?: number | null;
      interest?: "LOW" | "MEDIUM" | "HIGH" | null;
    }
  >;
}> {
  // Ensure show exists
  let show = await prisma.show.findUnique({where: {id}});
  const {mediaType, tmdbId} = parseShowId(id);
  if (!show) {
    const minimal = await getDetails(mediaType, tmdbId);
    await ensureShowExists(minimal);
    show = await prisma.show.findUnique({where: {id}});
    if (!show) throw new Error("NOT_FOUND");
  }

  const userId = await getUserId();
  const [rating, interest] = await Promise.all([
    userId
      ? prisma.rating.findUnique({where: {userId_showId: {userId, showId: id}}})
      : Promise.resolve(null),
    userId
      ? prisma.interest.findUnique({
          where: {userId_showId: {userId, showId: id}},
        })
      : Promise.resolve(null),
  ]);

  const rich = await getRichDetails(mediaType, tmdbId);
  const [recs, similar] = await Promise.all([
    getRecommendations(mediaType, tmdbId),
    getSimilar(mediaType, tmdbId),
  ]);

  let relatedStates: Record<
    string,
    {
      onWatchlist: boolean;
      watchedAt?: string | null;
      rating?: number | null;
      interest?: "LOW" | "MEDIUM" | "HIGH" | null;
    }
  > = {};
  if (userId) {
    const ids = [...recs, ...similar].map((s) => s.id);
    const state = await getUserShowStates(userId, ids);
    relatedStates = Object.fromEntries(
      Object.entries(state).map(([k, v]) => [
        k,
        {
          onWatchlist: v.onWatchlist,
          watchedAt: v.watchedAt ?? null,
          rating: v.rating ?? null,
          interest: v.interest ?? null,
        },
      ])
    );
  }

  return {
    mediaType,
    tmdbId,
    rich,
    rating,
    interest,
    recs,
    similar,
    relatedStates,
  };
}
