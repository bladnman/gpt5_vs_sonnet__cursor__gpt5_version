import PosterCard from "@/app/features/shows/PosterCard";
import type {MinimalShow} from "@/lib/tmdb/types";
import SeeAllLink from "./SeeAllLink";

export default function DiscoverySection({
  title,
  items,
  sectionKey,
  stateMap,
}: {
  title: string;
  items: MinimalShow[];
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {items.map((item) => (
          <PosterCard key={item.id} show={item} userState={stateMap[item.id]} />
        ))}
      </div>
    </section>
  );
}
