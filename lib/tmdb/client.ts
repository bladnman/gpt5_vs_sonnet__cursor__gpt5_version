import {getCached, setCached} from "@/lib/cache";
import {env} from "@/lib/env";
import {
  MinimalShow,
  TmdbMediaType,
  TmdbPagedResponseSchema,
  TmdbShowSchema,
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

export async function getDetails(
  mediaType: TmdbMediaType,
  tmdbId: number
): Promise<MinimalShow> {
  const path = mediaType === "movie" ? `/movie/${tmdbId}` : `/tv/${tmdbId}`;
  const json = await fetchTmdb(path);
  const parsed = TmdbShowSchema.parse(json);
  return toMinimalShow(mediaType, parsed);
}
