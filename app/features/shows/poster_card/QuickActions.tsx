import {
  addToWatchlist,
  clearInterest,
  clearRating,
  clearWatched,
  markWatched,
  rateShow,
  removeFromWatchlist,
  setInterest,
} from "@/app/actions/shows";
import RatingControl from "@/app/show-details/[id]/RatingControl";
import type {MinimalShow} from "@/lib/tmdb/types";

export default function QuickActions({
  show,
  onWatchlist,
  userState,
}: {
  show: MinimalShow;
  onWatchlist: boolean;
  userState?: {
    watchedAt?: string | null;
    rating?: number | null;
    interest?: "LOW" | "MEDIUM" | "HIGH" | null;
    waiting?: boolean;
  };
}) {
  return (
    <details className="group">
      <summary className="cursor-pointer select-none w-6 h-6 rounded-md bg-black/60 text-white flex items-center justify-center text-sm ring-1 ring-white/10 hover:bg-black/80">
        ⋯
      </summary>
      <div className="mt-1 p-2 rounded-md bg-black/85 backdrop-blur ring-1 ring-white/10 text-white text-xs min-w-56 max-w-64 space-y-2">
        <form
          action={async () => {
            "use server";
            if (onWatchlist) await removeFromWatchlist(show.id);
            else await addToWatchlist(show);
          }}
        >
          <button className="w-full text-left px-2 py-1 rounded hover:bg-white/10">
            {onWatchlist ? "Remove from Watchlist" : "+ Watchlist"}
          </button>
        </form>
        <div className="h-px bg-white/10" />

        <form
          action={async () => {
            "use server";
            if (userState?.watchedAt) await clearWatched(show.id);
            else await markWatched(show);
          }}
        >
          <button className="w-full text-left px-2 py-1 rounded hover:bg-white/10">
            {userState?.watchedAt ? "Unmark Watched" : "Mark Watched"}
          </button>
        </form>
        <div className="h-px bg-white/10" />

        <div className="flex items-center gap-1">
          <span>Interest</span>
          {(["LOW", "MEDIUM", "HIGH"] as const).map((lvl) => (
            <form
              key={lvl}
              action={async () => {
                "use server";
                if (userState?.interest === lvl) await clearInterest(show.id);
                else await setInterest(show, lvl);
              }}
            >
              <button
                className={[
                  "px-2 py-0.5 rounded ring-1 ring-white/10",
                  userState?.interest === lvl
                    ? "bg-white/15"
                    : "hover:bg-white/10",
                ].join(" ")}
              >
                {lvl === "LOW" ? "Low" : lvl === "MEDIUM" ? "Med" : "High"}
              </button>
            </form>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span>Rate</span>
          <RatingControl
            initial={userState?.rating ?? null}
            onSave={async (value) => {
              "use server";
              await rateShow(show, value);
            }}
            onClear={async () => {
              "use server";
              await clearRating(show.id);
            }}
          />
        </div>
      </div>
    </details>
  );
}
