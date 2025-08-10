import ShowCard from "@/app/features/shows/ShowCard";
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
    <div className="flex flex-col gap-8">
      <Section title="Trending" items={trending} />
      <Section title="Popular" items={popular} />
      <Section
        title={media === "movie" ? "Now Playing" : "On the Air"}
        items={newest}
      />
    </div>
  );
}

function Section({
  title,
  items,
}: {
  title: string;
  items: {id: string; title: string; posterPath?: string | null}[];
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {items.map((item) => (
          <ShowCard key={item.id} show={item as MinimalShow} />
        ))}
      </div>
    </section>
  );
}
