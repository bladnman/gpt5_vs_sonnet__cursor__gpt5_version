import PosterCard from "@/app/features/shows/PosterCard";
import {prisma} from "@/lib/db";
import {getUserId} from "@/lib/session";
import type {MinimalShow} from "@/lib/tmdb/types";

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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
          {watchlist.map((w) => (
            <PosterCard key={w.id} show={w.show as unknown as MinimalShow} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Ratings</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
          {ratings.map((r) => (
            <div key={r.id} className="flex flex-col gap-1">
              <PosterCard show={r.show as unknown as MinimalShow} />
              <div className="text-xs opacity-80">Your rating: {r.rating}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">History</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
          {history.map((h) => (
            <PosterCard key={h.id} show={h.show as unknown as MinimalShow} />
          ))}
        </div>
      </section>
    </div>
  );
}

// simplified: reuse PosterCard for consistent styling
