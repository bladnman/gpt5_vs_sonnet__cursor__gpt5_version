import PosterCard from "@/app/features/shows/PosterCard";
import {getUserId} from "@/lib/session";
import {getUserShowStates} from "@/lib/shows";
import {getHomepageSections} from "@/lib/tmdb/client";
import type {MinimalShow} from "@/lib/tmdb/types";

type Props = Record<string, never>;

export default async function DiscoveryLists() {
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

  return (
    <div className="flex flex-col gap-10">
      <Section
        title="Trending"
        items={trending}
        sectionKey="trending"
        stateMap={stateMap}
      />
      <Section
        title="Popular"
        items={popular}
        sectionKey="popular"
        stateMap={stateMap}
      />
      <Section
        title="Now"
        items={newest}
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
