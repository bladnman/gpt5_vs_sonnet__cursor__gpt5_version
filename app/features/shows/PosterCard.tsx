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
import type {MinimalShow} from "@/lib/tmdb/types";
// user state is provided by parent; keep this component purely presentational
import RatingControl from "@/app/show-details/[id]/RatingControl";
import Image from "next/image";
import Link from "next/link";

type Props = {
  show: MinimalShow;
  className?: string;
  href?: string;
  userState?: {
    onWatchlist?: boolean;
    watchedAt?: string | null;
    rating?: number | null;
    interest?: "LOW" | "MEDIUM" | "HIGH" | null;
    waiting?: boolean;
  };
};

export default async function PosterCard({
  show,
  className,
  href,
  userState,
}: Props) {
  const imageSrc = show.posterPath
    ? `https://image.tmdb.org/t/p/w342${show.posterPath}`
    : undefined;

  const detailHref = href ?? `/show-details/${encodeURIComponent(show.id)}`;
  const onWatchlist = userState?.onWatchlist ?? Boolean(userState?.interest);

  return (
    <div
      className={["group relative", className ?? ""].join(" ")}
      aria-label={show.title}
    >
      <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg bg-[--color-muted] shadow-sm ring-1 ring-inset ring-[--color-border]">
        {/* Clickable poster/link area only */}
        <Link href={detailHref} className="block w-full h-full">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={show.title}
              fill
              sizes="(max-width: 640px) 40vw, (max-width: 1024px) 20vw, 15vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              priority={false}
            />
          ) : (
            <div className="w-full h-full" />
          )}

          {/* Title overlay remains part of the link */}
          <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
            <div className="text-sm font-medium leading-tight line-clamp-2">
              {show.title}
            </div>
          </div>
        </Link>

        {/* TMDB rating badge (non-navigating) */}
        {typeof show.tmdbRating === "number" && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 text-xs rounded-md bg-black/65 backdrop-blur text-white ring-1 ring-white/15">
            ★ {show.tmdbRating.toFixed(1)}
          </div>
        )}

        {/* User state chips (non-navigating) */}
        {userState && (
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
            {typeof userState.rating === "number" && (
              <span className="px-1.5 py-0.5 text-xs rounded-md bg-[--color-primary] text-white/95 ring-1 ring-white/10">
                You: {userState.rating}
              </span>
            )}
            {userState.interest && (
              <span className="px-1.5 py-0.5 text-xs rounded-md bg-black/65 text-white ring-1 ring-white/10">
                {userState.interest === "HIGH"
                  ? "High interest"
                  : userState.interest === "LOW"
                    ? "Low interest"
                    : "Interest"}
              </span>
            )}
            {userState.watchedAt && (
              <span className="px-1.5 py-0.5 text-xs rounded-md bg-black/65 text-white ring-1 ring-white/10">
                Watched
              </span>
            )}
            {userState.waiting && (
              <span className="px-1.5 py-0.5 text-xs rounded-md bg-black/65 text-white ring-1 ring-white/10">
                Waiting
              </span>
            )}
          </div>
        )}

        {/* Quick Edit lightweight sheet moved outside to avoid clipping */}
      </div>

      {/* Quick Edit lightweight sheet (outside overflow, so not clipped) */}
      <div className="absolute top-2 right-2 z-20">
        <details className="group">
          <summary className="cursor-pointer select-none w-6 h-6 rounded-md bg-black/60 text-white flex items-center justify-center text-sm ring-1 ring-white/10 hover:bg-black/80">
            ⋯
          </summary>
          <div className="mt-1 p-2 rounded-md bg-black/85 backdrop-blur ring-1 ring-white/10 text-white text-xs min-w-56 max-w-64 space-y-2">
            {/* Watchlist toggle */}
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

            {/* Watched toggle */}
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

            {/* Interest segmented toggle (clicking the active level clears) */}
            <div className="flex items-center gap-1">
              <span>Interest</span>
              {(["LOW", "MEDIUM", "HIGH"] as const).map((lvl) => (
                <form
                  key={lvl}
                  action={async () => {
                    "use server";
                    if (userState?.interest === lvl)
                      await clearInterest(show.id);
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

            {/* Rating stars (toggle off by clicking the same star) */}
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

            {/* Waiting toggle */}
            <form
              action={async () => {
                "use server";
                const next = !userState?.waiting;
                const {setWaiting} = await import("@/app/actions/shows");
                await setWaiting(show, next);
              }}
            >
              <button className="w-full text-left px-2 py-1 rounded hover:bg-white/10">
                {userState?.waiting ? "Unset Waiting" : "Set Waiting"}
              </button>
            </form>
          </div>
        </details>
      </div>
    </div>
  );
}
