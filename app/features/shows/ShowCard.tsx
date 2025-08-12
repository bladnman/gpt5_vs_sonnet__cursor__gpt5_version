import {
  addToWatchlist,
  clearRating,
  markWatched,
  rateShow,
  removeFromWatchlist,
} from "@/app/actions/shows";
import {prisma} from "@/lib/db";
import {getUserId} from "@/lib/session";
import type {MinimalShow} from "@/lib/tmdb/types";
import Image from "next/image";
import Link from "next/link";

export default async function ShowCard({show}: {show: MinimalShow}) {
  const userId = await getUserId();
  let existingRating: {rating: number} | null = null;
  if (userId) {
    existingRating = await prisma.rating.findUnique({
      where: {userId_showId: {userId, showId: show.id}},
      select: {rating: true},
    });
  }
  async function onWatchlist() {
    "use server";
    await addToWatchlist(show);
  }
  async function onWatched() {
    "use server";
    await markWatched(show);
  }
  async function onRate(formData: FormData) {
    "use server";
    const valueRaw = formData.get("rating");
    if (valueRaw === "clear") {
      await clearRating(show.id);
      return;
    }
    const value = Number(valueRaw);
    if (Number.isFinite(value)) {
      await rateShow(show, value);
    }
  }

  return (
    <figure className="flex flex-col gap-2">
      <Link href={`/show-details/${encodeURIComponent(show.id)}`}>
        {show.posterPath ? (
          <Image
            src={`https://image.tmdb.org/t/p/w342${show.posterPath}`}
            alt={show.title}
            width={228}
            height={342}
            className="rounded-md border border-[--color-border]"
          />
        ) : (
          <div className="w-[228px] h-[342px] rounded-md bg-[--color-muted]" />
        )}
      </Link>
      <figcaption className="text-sm">
        {show.title}
        <div className="text-xs opacity-80 mt-1">
          Your: {existingRating?.rating ?? "—"} • TMDB: {show.tmdbRating ?? "—"}
        </div>
      </figcaption>

      <div className="flex gap-2">
        <form action={onWatchlist}>
          <button className="px-2 py-1 text-sm rounded-md bg-[--color-primary] text-white">
            + Watchlist
          </button>
        </form>
        <form
          action={async () => {
            "use server";
            await removeFromWatchlist(show.id);
          }}
        >
          <button className="px-2 py-1 text-sm rounded-md border border-[--color-border]">
            Remove
          </button>
        </form>
        <form action={onWatched}>
          <button className="px-2 py-1 text-sm rounded-md border border-[--color-border]">
            Watched
          </button>
        </form>
      </div>
      <form action={onRate} className="flex items-center gap-2">
        <label className="text-xs opacity-80">Rate</label>
        <select
          name="rating"
          defaultValue={existingRating?.rating?.toString() ?? ""}
          className="px-2 py-1 text-sm rounded-md bg-[--color-muted] border border-[--color-border]"
        >
          <option value="">—</option>
          {Array.from({length: 10}).map((_, i) => (
            <option key={i + 1} value={String(i + 1)}>
              {i + 1}
            </option>
          ))}
          <option value="clear">Clear</option>
        </select>
        <button className="px-2 py-1 text-sm rounded-md border border-[--color-border]">
          Save
        </button>
      </form>
    </figure>
  );
}
