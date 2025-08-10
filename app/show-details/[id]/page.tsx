import {prisma} from "@/lib/db";
import {getUserId} from "@/lib/session";
import Image from "next/image";
import {notFound} from "next/navigation";

type Props = {params: Promise<{id: string}>};

export default async function ShowDetailsPage({params}: Props) {
  const {id} = await params;
  const show = await prisma.show.findUnique({where: {id}});
  if (!show) return notFound();
  const userId = await getUserId();
  const [rating, onWatchlist] = await Promise.all([
    userId
      ? prisma.rating.findUnique({where: {userId_showId: {userId, showId: id}}})
      : Promise.resolve(null),
    userId
      ? prisma.watchlist.findUnique({
          where: {userId_showId: {userId, showId: id}},
        })
      : Promise.resolve(null),
  ]);

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex gap-6">
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
        <div>
          <h1 className="text-2xl font-bold">{show.title}</h1>
          <p className="opacity-80 mt-2">Released: {show.releaseDate ?? "—"}</p>
          <p className="opacity-80">
            TMDB: {show.tmdbRating ?? "—"} ({show.tmdbVoteCount ?? 0} votes)
          </p>
          <p className="opacity-80">Your rating: {rating?.rating ?? "—"}</p>
          <p className="opacity-80">
            In watchlist: {onWatchlist ? "Yes" : "No"}
          </p>
        </div>
      </div>
    </div>
  );
}
