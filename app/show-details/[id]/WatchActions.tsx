"use client";
import {useTransition} from "react";

export default function WatchActions({
  onAdd,
  onRemove,
  onWatched,
  inWatchlist,
}: {
  onAdd: () => Promise<void>;
  onRemove: () => Promise<void>;
  onWatched: () => Promise<void>;
  inWatchlist: boolean;
}) {
  const [isPending, start] = useTransition();
  return (
    <div className="flex flex-wrap gap-2">
      {!inWatchlist ? (
        <button
          className="px-3 py-1.5 text-sm rounded-md bg-[--color-primary] text-white shadow"
          onClick={() => start(onAdd)}
          aria-busy={isPending}
        >
          + Watchlist
        </button>
      ) : (
        <button
          className="px-3 py-1.5 text-sm rounded-md ring-1 ring-inset ring-[--color-border] hover:bg-[--color-muted]"
          onClick={() => start(onRemove)}
          aria-busy={isPending}
        >
          Remove from Watchlist
        </button>
      )}
      <button
        className="px-3 py-1.5 text-sm rounded-md ring-1 ring-inset ring-[--color-border] hover:bg-[--color-muted]"
        onClick={() => start(onWatched)}
        aria-busy={isPending}
      >
        Mark Watched
      </button>
    </div>
  );
}
