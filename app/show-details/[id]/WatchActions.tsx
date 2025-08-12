"use client";
import {useTransition} from "react";

export default function WatchActions({
  onAdd,
  onRemove,
  onWatched,
  onClearWatched,
  onInterest,
  inWatchlist,
}: {
  onAdd: () => Promise<void>;
  onRemove: () => Promise<void>;
  onWatched: () => Promise<void>;
  onClearWatched: () => Promise<void>;
  onInterest: (level: "LOW" | "MEDIUM" | "HIGH" | null) => Promise<void>;
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
      <button
        className="px-3 py-1.5 text-sm rounded-md ring-1 ring-inset ring-[--color-border] hover:bg-[--color-muted]"
        onClick={() => start(onClearWatched)}
        aria-busy={isPending}
      >
        Unmark Watched
      </button>
      <div className="inline-flex items-center gap-1 ml-2">
        <span className="text-xs opacity-80">Interest:</span>
        {(
          [
            ["LOW", "Low"],
            ["MEDIUM", "Med"],
            ["HIGH", "High"],
          ] as const
        ).map(([lvl, label]) => (
          <button
            key={lvl}
            className="px-2 py-1 text-xs rounded-md ring-1 ring-inset ring-[--color-border] hover:bg-[--color-muted]"
            onClick={() => start(() => onInterest(lvl))}
            aria-busy={isPending}
          >
            {label}
          </button>
        ))}
        <button
          className="px-2 py-1 text-xs rounded-md ring-1 ring-inset ring-[--color-border] hover:bg-[--color-muted]"
          onClick={() => start(() => onInterest(null))}
          aria-busy={isPending}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
