import PosterCard from "@/app/features/shows/PosterCard";
import {getHomepageSections} from "@/lib/tmdb/client";
import type {MinimalShow} from "@/lib/tmdb/types";

type Props = Record<string, never>;

export default async function DiscoveryLists(_: Props) {
  const {trending, popular, now: newest} = await getHomepageSections();

  return (
    <div className="flex flex-col gap-10">
      <Section title="Trending" items={trending} sectionKey="trending" />
      <Section title="Popular" items={popular} sectionKey="popular" />
      <Section title="Now" items={newest} sectionKey="now" />
    </div>
  );
}

function Section({
  title,
  items,
  sectionKey,
}: {
  title: string;
  items: {id: string; title: string; posterPath?: string | null}[];
  sectionKey: "trending" | "popular" | "now";
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        <SeeAllLink section={sectionKey} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {items.map((item) => (
          <PosterCard key={item.id} show={item as MinimalShow} />
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
