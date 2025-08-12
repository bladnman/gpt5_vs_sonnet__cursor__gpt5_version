import {z} from "zod";

export const MediaTypeSchema = z.enum(["movie", "tv"]);
export type TmdbMediaType = z.infer<typeof MediaTypeSchema>;

export const TmdbShowSchema = z.object({
  id: z.number(),
  media_type: MediaTypeSchema.optional(),
  title: z.string().optional(),
  name: z.string().optional(),
  poster_path: z.string().nullable().optional(),
  backdrop_path: z.string().nullable().optional(),
  release_date: z.string().optional(),
  first_air_date: z.string().optional(),
  vote_average: z.number().optional(),
  vote_count: z.number().optional(),
  overview: z.string().optional(),
  tagline: z.string().optional(),
  runtime: z.number().optional(), // movies
  episode_run_time: z.array(z.number()).optional(), // tv
  // present in list endpoints; used for lightweight genre filtering
  genre_ids: z.array(z.number()).optional(),
  genres: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
      })
    )
    .optional(),
  number_of_seasons: z.number().optional(),
  number_of_episodes: z.number().optional(),
  seasons: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        season_number: z.number(),
        episode_count: z.number().optional(),
        air_date: z.string().nullable().optional(),
        poster_path: z.string().nullable().optional(),
      })
    )
    .optional(),
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
  backdropPath?: string | null;
  releaseDate?: string | null;
  tmdbRating?: number | null;
  tmdbVoteCount?: number | null;
  genreIds?: number[] | null;
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
    backdropPath: item.backdrop_path ?? undefined,
    releaseDate: release ?? null,
    tmdbRating: item.vote_average ?? null,
    tmdbVoteCount: item.vote_count ?? null,
    genreIds: item.genre_ids ?? null,
  };
}

// Credits (cast and crew)
export const TmdbCreditsSchema = z.object({
  id: z.number().optional(),
  cast: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        character: z.string().optional(),
        profile_path: z.string().nullable().optional(),
        order: z.number().optional(),
      })
    )
    .optional(),
  crew: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        job: z.string().optional(),
        department: z.string().optional(),
        profile_path: z.string().nullable().optional(),
      })
    )
    .optional(),
});
export type TmdbCredits = z.infer<typeof TmdbCreditsSchema>;

// Watch providers
export const TmdbProviderSchema = z.object({
  provider_id: z.number(),
  provider_name: z.string(),
  logo_path: z.string().nullable().optional(),
});
export const TmdbWatchProvidersSchema = z.object({
  id: z.number().optional(),
  results: z.record(
    z.string(),
    z.object({
      link: z.string().optional(),
      flatrate: z.array(TmdbProviderSchema).optional(),
      buy: z.array(TmdbProviderSchema).optional(),
      rent: z.array(TmdbProviderSchema).optional(),
      ads: z.array(TmdbProviderSchema).optional(),
      free: z.array(TmdbProviderSchema).optional(),
    })
  ),
});
export type TmdbWatchProviders = z.infer<typeof TmdbWatchProvidersSchema>;

// Genres list
export const TmdbGenreListSchema = z.object({
  genres: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
});
export type TmdbGenreList = z.infer<typeof TmdbGenreListSchema>;

export type ShowDetails = MinimalShow & {
  overview?: string | null;
  tagline?: string | null;
  genres?: {id: number; name: string}[];
  runtimeMinutes?: number | null; // movies; tv will use episodeRunTimeMinutes
  episodeRunTimeMinutes?: number | null; // average for TV
  numberOfSeasons?: number | null;
  numberOfEpisodes?: number | null;
  seasons?: {
    id: number;
    name: string;
    seasonNumber: number;
    episodeCount?: number;
    airDate?: string | null;
    posterPath?: string | null;
  }[];
  cast?: {
    id: number;
    name: string;
    character?: string;
    profilePath?: string | null;
  }[];
  crew?: {
    id: number;
    name: string;
    job?: string;
    profilePath?: string | null;
  }[];
  providers?: {
    flatrate?: {id: number; name: string; logoPath?: string | null}[];
    buy?: {id: number; name: string; logoPath?: string | null}[];
    rent?: {id: number; name: string; logoPath?: string | null}[];
    link?: string;
    region?: string;
  };
};
