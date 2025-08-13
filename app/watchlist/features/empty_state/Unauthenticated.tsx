import WatchlistHeader from "@/app/watchlist/features/header/WatchlistHeader";

export default function Unauthenticated() {
  return (
    <div className="p-6">
      <WatchlistHeader />
      <p className="opacity-80 mt-2">
        Add shows to your watchlist to see them here.
      </p>
    </div>
  );
}
