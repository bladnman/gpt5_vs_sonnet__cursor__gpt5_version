import PosterCard from "@/app/features/shows/PosterCard";
import {getNew, getPopular, getTrending} from "@/lib/tmdb/client";
import type {MinimalShow, TmdbMediaType} from "@/lib/tmdb/types";

type Props = {
  media: TmdbMediaType;
};

export default async function DiscoveryLists({media}: Props) {
  const [trending, popular, newest] = await Promise.all([
    getTrending(media),
    getPopular(media),
    getNew(media),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <Section
        title="Trending"
        items={trending}
        media={media}
        sectionKey="trending"
      />
      <Section
        title="Popular"
        items={popular}
        media={media}
        sectionKey="popular"
      />
      <Section
        title={media === "movie" ? "Now Playing" : "On the Air"}
        items={newest}
        media={media}
        sectionKey="now"
      />
    </div>
  );
}

function Section({
  title,
  items,
  media,
  sectionKey,
}: {
  title: string;
  items: {id: string; title: string; posterPath?: string | null}[];
  media: TmdbMediaType;
  sectionKey: "trending" | "popular" | "now";
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        <SeeAllLink media={media} section={sectionKey} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {items.map((item) => (
          <PosterCard key={item.id} show={item as MinimalShow} />
        ))}
      </div>
    </section>
  );
}

function SeeAllLink({
  media,
  section,
}: {
  media: TmdbMediaType;
  section: "trending" | "popular" | "now";
}) {
  return (
    <a
      className="text-sm underline opacity-80 hover:opacity-100"
      href={`/discovery/${media}/${section}`}
    >
      See all
    </a>
  );
}
