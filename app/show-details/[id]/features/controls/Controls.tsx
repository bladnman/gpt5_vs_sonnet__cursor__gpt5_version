import {
  addToWatchlist,
  clearInterest,
  clearRating,
  clearWatched,
  markWatched,
  rateShow,
  removeFromWatchlist,
  setInterest,
  setWaiting,
} from "@/app/actions/shows";
import RatingControl from "@/app/show-details/[id]/RatingControl";
import WatchActions from "@/app/show-details/[id]/WatchActions";
import type {ShowDetails} from "@/lib/tmdb/types";

export default function Controls({
  rich,
  interest,
  rating,
}: {
  rich: ShowDetails;
  interest: {level: "LOW" | "MEDIUM" | "HIGH"; waiting?: boolean} | null;
  rating: {rating: number} | null;
}) {
  return (
    <div className="mt-4 flex flex-wrap gap-3 items-center">
      <WatchActions
        inWatchlist={!!interest}
        onAdd={async () => {
          "use server";
          await addToWatchlist(rich);
        }}
        onRemove={async () => {
          "use server";
          await removeFromWatchlist(rich.id);
        }}
        onWatched={async () => {
          "use server";
          await markWatched(rich);
        }}
        onClearWatched={async () => {
          "use server";
          await clearWatched(rich.id);
        }}
        onInterest={async (lvl) => {
          "use server";
          if (lvl) await setInterest(rich, lvl);
          else await clearInterest(rich.id);
        }}
        onToggleWaiting={async () => {
          "use server";
          await setWaiting(rich, !interest?.waiting);
        }}
      />
      <RatingControl
        initial={rating?.rating ?? null}
        onSave={async (value) => {
          "use server";
          await rateShow(rich, value);
        }}
        onClear={async () => {
          "use server";
          await clearRating(rich.id);
        }}
      />
    </div>
  );
}
