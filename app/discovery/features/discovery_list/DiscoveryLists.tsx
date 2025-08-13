import PosterCard from "@/app/features/shows/PosterCard";
import {getUserId} from "@/lib/session";
import {getUserShowStates} from "@/lib/shows";
import {getHomepageSections} from "@/lib/tmdb/client";
import type {MinimalShow} from "@/lib/tmdb/types";

export default async function DiscoveryLists({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const {trending, popular, now: newest} = await getHomepageSections();
  const userId = await getUserId();
  let stateMap: Record<
    string,
    {
      onWatchlist: boolean;
      watchedAt?: string | null;
      rating?: number | null;
      interest?: "LOW" | "MEDIUM" | "HIGH" | null;
    }
  > = {};
  if (userId) {
    const ids = [...trending, ...popular, ...newest].map((s) => s.id);
    const states = await getUserShowStates(userId, ids);
    stateMap = Object.fromEntries(
      Object.entries(states).map(([k, v]) => [
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

  // lightweight filter/sort per request params
  const interest = ((searchParams?.interest as string) ?? "ANY").toUpperCase();
  const watchlistOnly = (searchParams?.wl as string) === "1";
  const unwatchedOnly = (searchParams?.uw as string) === "1";
  const sort = (searchParams?.sort as string) ?? "score_auto";
  const order = (searchParams?.order as string) ?? "desc";
  const genresParam = (searchParams?.genres as string) ?? "";
  const selectedGenres = new Set(
    genresParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => Number(s))
      .filter((n) => Number.isFinite(n))
  );

  const applyFilters = (items: MinimalShow[]) => {
    const filtered = items.filter((s) => {
      const us = stateMap[s.id];
      if (watchlistOnly && !us?.onWatchlist) return false;
      if (unwatchedOnly && us?.watchedAt) return false;
      if (
        ["LOW", "MEDIUM", "HIGH"].includes(interest) &&
        (us?.interest ?? null) !== interest
      )
        return false;
      if (selectedGenres.size > 0) {
        const gids = s.genreIds ?? [];
        const hasAny = gids.some((g) => selectedGenres.has(g));
        if (!hasAny) return false;
      }
      return true;
    });

    const compare = (a: MinimalShow, b: MinimalShow) => {
      const aState = stateMap[a.id];
      const bState = stateMap[b.id];
      const autoScore = (s: MinimalShow, st?: {rating?: number | null}) =>
        (st?.rating ?? null) != null ? st!.rating! : (s.tmdbRating ?? 0);
      if (sort === "score_auto")
        return autoScore(b, bState) - autoScore(a, aState);
      if (sort === "score_user")
        return (bState?.rating ?? -1) - (aState?.rating ?? -1);
      if (sort === "score_tmdb")
        return (b.tmdbRating ?? 0) - (a.tmdbRating ?? 0);
      if (sort === "interest") {
        const rank = (v?: string | null) =>
          v === "HIGH" ? 3 : v === "MEDIUM" ? 2 : v === "LOW" ? 1 : 0;
        return rank(bState?.interest ?? null) - rank(aState?.interest ?? null);
      }
      if (sort === "year") {
        const year = (s?: string | null) =>
          s && s.length >= 4 ? Number(s.slice(0, 4)) : 0;
        return year(b.releaseDate ?? null) - year(a.releaseDate ?? null);
      }
      // title
      return a.title.localeCompare(b.title);
    };

    const sorted = filtered.sort(compare);
    if (order === "asc") sorted.reverse();
    return sorted;
  };

  return (
    <div className="flex flex-col gap-10">
      <Section
        title="Trending"
        items={applyFilters(trending)}
        sectionKey="trending"
        stateMap={stateMap}
      />
      <Section
        title="Popular"
        items={applyFilters(popular)}
        sectionKey="popular"
        stateMap={stateMap}
      />
      <Section
        title="Now"
        items={applyFilters(newest)}
        sectionKey="now"
        stateMap={stateMap}
      />
    </div>
  );
}

function Section({
  title,
  items,
  sectionKey,
  stateMap,
}: {
  title: string;
  items: {id: string; title: string; posterPath?: string | null}[];
  sectionKey: "trending" | "popular" | "now";
  stateMap: Record<
    string,
    {
      onWatchlist: boolean;
      watchedAt?: string | null;
      rating?: number | null;
      interest?: "LOW" | "MEDIUM" | "HIGH" | null;
    }
  >;
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        <SeeAllLink section={sectionKey} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {items.map((item) => (
          <PosterCard
            key={item.id}
            show={item as MinimalShow}
            userState={stateMap[item.id]}
          />
        ))}
      </div>
    </section>
  );
}

function SeeAllLink({section}: {section: "trending" | "popular" | "now"}) {
  return (
    <a
      className="text-sm underline opacity-80 hover:opacity-100"
      href={`/discovery/movie/${section}`}
    >
      See all
    </a>
  );
}
