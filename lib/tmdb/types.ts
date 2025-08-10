import {z} from "zod";

export const MediaTypeSchema = z.enum(["movie", "tv"]);
export type TmdbMediaType = z.infer<typeof MediaTypeSchema>;

export const TmdbShowSchema = z.object({
  id: z.number(),
  media_type: MediaTypeSchema.optional(),
  title: z.string().optional(),
  name: z.string().optional(),
  poster_path: z.string().nullable().optional(),
  release_date: z.string().optional(),
  first_air_date: z.string().optional(),
  vote_average: z.number().optional(),
  vote_count: z.number().optional(),
});
export type TmdbShow = z.infer<typeof TmdbShowSchema>;

export const TmdbPagedResponseSchema = z.object({
  page: z.number(),
  results: z.array(TmdbShowSchema),
  total_pages: z.number().optional(),
  total_results: z.number().optional(),
});
export type TmdbPagedResponse = z.infer<typeof TmdbPagedResponseSchema>;

export type MinimalShow = {
  id: string; // `${mediaType}_${tmdbId}`
  tmdbId: number;
  mediaType: "MOVIE" | "TV";
  title: string;
  posterPath?: string | null;
  releaseDate?: string | null;
  tmdbRating?: number | null;
  tmdbVoteCount?: number | null;
};

export function toMinimalShow(
  mediaType: TmdbMediaType,
  item: TmdbShow
): MinimalShow {
  const title = item.title ?? item.name ?? "";
  const release = item.release_date ?? item.first_air_date ?? undefined;
  const mt = mediaType === "movie" ? "MOVIE" : "TV";
  const id = `${mt}_${item.id}`;
  return {
    id,
    tmdbId: item.id,
    mediaType: mt,
    title,
    posterPath: item.poster_path ?? undefined,
    releaseDate: release ?? null,
    tmdbRating: item.vote_average ?? null,
    tmdbVoteCount: item.vote_count ?? null,
  };
}
