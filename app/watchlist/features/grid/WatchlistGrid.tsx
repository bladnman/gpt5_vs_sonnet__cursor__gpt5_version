import PosterCard from "@/app/features/shows/PosterCard";
import type {MinimalShow} from "@/lib/tmdb/types";

export default function WatchlistGrid({
  items,
}: {
  items: {id: string; show: MinimalShow; interest: "LOW" | "MEDIUM" | "HIGH"}[];
}) {
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-sm opacity-80">Your watchlist is empty.</div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
      {items.map((i) => (
        <PosterCard
          key={i.id}
          show={i.show}
          userState={{interest: i.interest}}
        />
      ))}
    </div>
  );
}
