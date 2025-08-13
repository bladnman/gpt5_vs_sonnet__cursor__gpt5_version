import PosterCard from "@/app/features/shows/PosterCard";
import type {MinimalShow} from "@/lib/tmdb/types";

export default function RatingsGrid({
  items,
}: {
  items: {id: string; show: MinimalShow; rating: number}[];
}) {
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-sm opacity-80">No ratings yet.</div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
      {items.map((i) => (
        <div key={i.id} className="flex flex-col gap-1">
          <PosterCard show={i.show} userState={{rating: i.rating}} />
          <div className="text-xs opacity-80">Your rating: {i.rating}</div>
        </div>
      ))}
    </div>
  );
}
