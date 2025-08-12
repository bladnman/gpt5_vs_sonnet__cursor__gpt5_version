import {getCached, setCached} from "@/lib/cache";
import {env} from "@/lib/env";
import type {TmdbWatchProviders} from "@/lib/tmdb/types";
import {
  MinimalShow,
  ShowDetails,
  TmdbCreditsSchema,
  TmdbMediaType,
  TmdbPagedResponseSchema,
  TmdbShowSchema,
  TmdbWatchProvidersSchema,
  toMinimalShow,
} from "@/lib/tmdb/types";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

type Endpoint = "trending" | "popular" | "now" | "search";
const TTL_SECONDS: Record<Endpoint, number> = {
  trending: 10 * 60,
  popular: 10 * 60,
  now: 5 * 60,
  search: 60,
};

async function fetchTmdb(
  path: string,
  params: Record<string, string | number> = {}
): Promise<unknown> {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  // If a v3 key is provided, send it as api_key param (compatible mode).
  if (env.TMDB_API_KEY) {
    url.searchParams.set("api_key", env.TMDB_API_KEY);
  }
  Object.entries(params).forEach(([k, v]) =>
    url.searchParams.set(k, String(v))
  );

  const headers: Record<string, string> = {};
  // If a v4 token is provided, prefer Bearer header.
  if (env.TMDB_V4_TOKEN) {
    headers.Authorization = `Bearer ${env.TMDB_V4_TOKEN}`;
  }

  const res = await fetch(url.toString(), {
    headers,
    next: {revalidate: 0},
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`[tmdb] miss ${path} ${res.status} ${text}`);
    throw new Error(`TMDB ${path} error ${res.status}: ${text}`);
  }
  return res.json();
}

export async function getTrending(
  mediaType: TmdbMediaType
): Promise<MinimalShow[]> {
  const key = `tmdb:trending:${mediaType}`;
  const cached = await getCached<MinimalShow[]>(key);
  if (cached) return cached;

  const json = await fetchTmdb(`/trending/${mediaType}/week`);
  const parsed = TmdbPagedResponseSchema.parse(json);
  const items = parsed.results.map((r) => toMinimalShow(mediaType, r));
  await setCached(key, items, TTL_SECONDS.trending);
  return items;
}

export async function getPopular(
  mediaType: TmdbMediaType
): Promise<MinimalShow[]> {
  const key = `tmdb:popular:${mediaType}`;
  const cached = await getCached<MinimalShow[]>(key);
  if (cached) return cached;
  const json = await fetchTmdb(`/${mediaType}/popular`);
  const parsed = TmdbPagedResponseSchema.parse(json);
  const items = parsed.results.map((r) => toMinimalShow(mediaType, r));
  await setCached(key, items, TTL_SECONDS.popular);
  return items;
}

export async function getNew(mediaType: TmdbMediaType): Promise<MinimalShow[]> {
  const key = `tmdb:new:${mediaType}`;
  const cached = await getCached<MinimalShow[]>(key);
  if (cached) return cached;
  const path = mediaType === "movie" ? "/movie/now_playing" : "/tv/on_the_air";
  const json = await fetchTmdb(path);
  const parsed = TmdbPagedResponseSchema.parse(json);
  const items = parsed.results.map((r) => toMinimalShow(mediaType, r));
  await setCached(key, items, TTL_SECONDS.now);
  return items;
}

export async function getPagedList(
  section: "trending" | "popular" | "now",
  mediaType: TmdbMediaType,
  page: number
): Promise<{items: MinimalShow[]; page: number; totalPages?: number}> {
  let path: string;
  if (section === "trending") path = `/trending/${mediaType}/week`;
  else if (section === "popular") path = `/${mediaType}/popular`;
  else path = mediaType === "movie" ? "/movie/now_playing" : "/tv/on_the_air";

  const json = await fetchTmdb(path, {page});
  const parsed = TmdbPagedResponseSchema.parse(json);
  const items = parsed.results.map((r) => toMinimalShow(mediaType, r));
  return {items, page: parsed.page, totalPages: parsed.total_pages};
}

export async function searchAll(
  query: string,
  mediaType?: TmdbMediaType
): Promise<MinimalShow[]> {
  const q = query.trim();
  if (!q) return [];
  const key = `tmdb:search:${mediaType ?? "multi"}:${q.toLowerCase()}`;
  const cached = await getCached<MinimalShow[]>(key);
  if (cached) return cached;

  if (mediaType) {
    const json = await fetchTmdb(`/search/${mediaType}`, {query: q});
    const parsed = TmdbPagedResponseSchema.parse(json);
    const items = parsed.results.map((r) => toMinimalShow(mediaType, r));
    await setCached(key, items, TTL_SECONDS.search);
    return items;
  }
  const json = await fetchTmdb(`/search/multi`, {query: q});
  const parsed = TmdbPagedResponseSchema.parse(json);
  const items = parsed.results
    .filter((r) => r.media_type === "movie" || r.media_type === "tv")
    .map((r) => toMinimalShow((r.media_type as TmdbMediaType) ?? "movie", r));
  await setCached(key, items, TTL_SECONDS.search);
  return items;
}

// Combined popular/trending/now for homepage: returns a map keyed by section
export async function getHomepageSections(): Promise<{
  trending: MinimalShow[];
  popular: MinimalShow[];
  now: MinimalShow[];
}> {
  const [trM, trT, popM, popT, nowM, nowT] = await Promise.all([
    getTrending("movie"),
    getTrending("tv"),
    getPopular("movie"),
    getPopular("tv"),
    getNew("movie"),
    getNew("tv"),
  ]);
  const merge = (a: MinimalShow[], b: MinimalShow[]) =>
    [...a, ...b].sort((x, y) => (y.tmdbRating ?? 0) - (x.tmdbRating ?? 0));
  return {
    trending: merge(trM, trT),
    popular: merge(popM, popT),
    now: merge(nowM, nowT),
  };
}

export async function getDetails(
  mediaType: TmdbMediaType,
  tmdbId: number
): Promise<MinimalShow> {
  const path = mediaType === "movie" ? `/movie/${tmdbId}` : `/tv/${tmdbId}`;
  const json = await fetchTmdb(path);
  const parsed = TmdbShowSchema.parse(json);
  return toMinimalShow(mediaType, parsed);
}

// Rich details including overview, credits, seasons, providers
export async function getRichDetails(
  mediaType: TmdbMediaType,
  tmdbId: number,
  region: string = "US"
): Promise<ShowDetails> {
  const base = mediaType === "movie" ? `/movie/${tmdbId}` : `/tv/${tmdbId}`;
  const [detailsJson, creditsJson, providersJson] = await Promise.all([
    fetchTmdb(base),
    fetchTmdb(`${base}/credits`),
    fetchTmdb(`${base}/watch/providers`),
  ]);
  const details = TmdbShowSchema.parse(detailsJson);
  const minimal = toMinimalShow(mediaType, details);
  const credits = TmdbCreditsSchema.parse(creditsJson);
  const providers = TmdbWatchProvidersSchema.parse(
    providersJson
  ) as TmdbWatchProviders;
  const resultsMap = (providers.results ?? {}) as Record<
    string,
    {
      link?: string;
      flatrate?: {
        provider_id: number;
        provider_name: string;
        logo_path?: string | null;
      }[];
      buy?: {
        provider_id: number;
        provider_name: string;
        logo_path?: string | null;
      }[];
      rent?: {
        provider_id: number;
        provider_name: string;
        logo_path?: string | null;
      }[];
    }
  >;
  const regionData = resultsMap[region];
  return {
    ...minimal,
    overview: details.overview ?? null,
    tagline: details.tagline ?? null,
    genres: details.genres,
    runtimeMinutes: details.runtime ?? null,
    episodeRunTimeMinutes:
      details.episode_run_time && details.episode_run_time.length > 0
        ? Math.round(
            details.episode_run_time.reduce((a, b) => a + b, 0) /
              details.episode_run_time.length
          )
        : null,
    numberOfSeasons: details.number_of_seasons ?? null,
    numberOfEpisodes: details.number_of_episodes ?? null,
    seasons:
      details.seasons?.map((s) => ({
        id: s.id,
        name: s.name,
        seasonNumber: s.season_number,
        episodeCount: s.episode_count,
        airDate: s.air_date ?? null,
        posterPath: s.poster_path ?? null,
      })) ?? [],
    cast:
      credits.cast?.map((c) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profilePath: c.profile_path ?? null,
      })) ?? [],
    crew:
      credits.crew?.map((c) => ({
        id: c.id,
        name: c.name,
        job: c.job,
        profilePath: c.profile_path ?? null,
      })) ?? [],
    providers: regionData
      ? {
          link: regionData.link,
          region,
          flatrate:
            regionData.flatrate?.map((p) => ({
              id: p.provider_id,
              name: p.provider_name,
              logoPath: p.logo_path ?? null,
            })) ?? [],
          buy:
            regionData.buy?.map((p) => ({
              id: p.provider_id,
              name: p.provider_name,
              logoPath: p.logo_path ?? null,
            })) ?? [],
          rent:
            regionData.rent?.map((p) => ({
              id: p.provider_id,
              name: p.provider_name,
              logoPath: p.logo_path ?? null,
            })) ?? [],
        }
      : undefined,
  };
}

export async function getRecommendations(
  mediaType: TmdbMediaType,
  tmdbId: number
): Promise<MinimalShow[]> {
  const path =
    mediaType === "movie"
      ? `/movie/${tmdbId}/recommendations`
      : `/tv/${tmdbId}/recommendations`;
  const json = await fetchTmdb(path);
  const parsed = TmdbPagedResponseSchema.parse(json);
  return parsed.results.map((r) => toMinimalShow(mediaType, r));
}

export async function getSimilar(
  mediaType: TmdbMediaType,
  tmdbId: number
): Promise<MinimalShow[]> {
  const path =
    mediaType === "movie"
      ? `/movie/${tmdbId}/similar`
      : `/tv/${tmdbId}/similar`;
  const json = await fetchTmdb(path);
  const parsed = TmdbPagedResponseSchema.parse(json);
  return parsed.results.map((r) => toMinimalShow(mediaType, r));
}
