import PosterCard from "@/app/features/shows/PosterCard";
import type {MinimalShow} from "@/lib/tmdb/types";

export default function RelatedGrid({
  title,
  items,
  stateMap,
}: {
  title: string;
  items: MinimalShow[];
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
  if (!items || items.length === 0) return null;
  return (
    <section className="p-6 md:p-8">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {items.slice(0, 14).map((s) => (
          <PosterCard key={s.id} show={s} userState={stateMap[s.id]} />
        ))}
      </div>
    </section>
  );
}
