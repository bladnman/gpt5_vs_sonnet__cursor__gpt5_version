import PosterCard from "@/app/features/shows/PosterCard";
import type {MinimalShow} from "@/lib/tmdb/types";

export default function SearchGrid({items}: {items: MinimalShow[]}) {
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-sm opacity-80">No results.</div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
      {items.map((item) => (
        <PosterCard key={item.id} show={item} />
      ))}
    </div>
  );
}
