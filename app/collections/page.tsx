import {prisma} from "@/lib/db";
import {getUserId} from "@/lib/session";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const userId = await getUserId();
  if (!userId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Your Collections</h1>
        <p className="opacity-80 mt-2">
          Sign in or perform an action to create a session.
        </p>
      </div>
    );
  }
  const [watchlist, ratings, history] = await Promise.all([
    prisma.watchlist.findMany({where: {userId}, include: {show: true}}),
    prisma.rating.findMany({where: {userId}, include: {show: true}}),
    prisma.watch.findMany({
      where: {userId},
      include: {show: true},
      orderBy: {watchedAt: "desc"},
    }),
  ]);

  return (
    <div className="p-6 flex flex-col gap-10">
      <h1 className="text-2xl font-bold">Your Collections</h1>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Watchlist</h2>
        <Grid items={watchlist.map((w) => w.show)} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Ratings</h2>
        <Grid
          items={ratings.map((r) => r.show)}
          noteForId={(id) =>
            ratings.find((r) => r.showId === id)?.rating?.toString()
          }
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">History</h2>
        <Grid items={history.map((h) => h.show)} />
      </section>
    </div>
  );
}

function Grid({
  items,
  noteForId,
}: {
  items: {id: string; title: string; posterPath: string | null}[];
  noteForId?: (id: string) => string | undefined;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
      {items.map((item) => (
        <figure key={item.id} className="flex flex-col gap-2">
          {item.posterPath ? (
            <Image
              src={`https://image.tmdb.org/t/p/w342${item.posterPath}`}
              alt={item.title}
              width={228}
              height={342}
              className="rounded-md border border-[--color-border]"
            />
          ) : (
            <div className="w-[228px] h-[342px] rounded-md bg-[--color-muted]" />
          )}
          <figcaption className="text-sm">
            {item.title}
            {noteForId?.(item.id) ? (
              <span className="opacity-70"> • {noteForId(item.id)}</span>
            ) : null}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
