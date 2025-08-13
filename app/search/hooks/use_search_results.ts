import {searchAll} from "@/lib/tmdb/client";
import type {MinimalShow, TmdbMediaType} from "@/lib/tmdb/types";

export default async function use_search_results(
  sp: Record<string, string | string[] | undefined>
): Promise<{q: string; items: MinimalShow[]}> {
  const qParam = sp.q;
  const q = Array.isArray(qParam)
    ? (qParam[0]?.trim?.() ?? "")
    : (qParam?.trim?.() ?? "");
  const mediaParam = sp.media;
  const media: TmdbMediaType | undefined = Array.isArray(mediaParam)
    ? mediaParam[0] === "movie" || mediaParam[0] === "tv"
      ? (mediaParam[0] as TmdbMediaType)
      : undefined
    : mediaParam === "movie" || mediaParam === "tv"
      ? (mediaParam as TmdbMediaType)
      : undefined;
  const results = q ? await searchAll(q, media) : [];
  return {q, items: results as MinimalShow[]};
}
