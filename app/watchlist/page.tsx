import PosterCard from "@/app/features/shows/PosterCard";
import {prisma} from "@/lib/db";
import {getUserId} from "@/lib/session";
import type {MinimalShow} from "@/lib/tmdb/types";
import WatchlistFilters from "./features/filters/WatchlistFilters";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function WatchlistPage({searchParams}: Props) {
  const sp = await searchParams;
  const userId = await getUserId();
  if (!userId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Watchlist</h1>
        <p className="opacity-80 mt-2">
          Add shows to your watchlist to see them here.
        </p>
      </div>
    );
  }
  // Watchlist is derived: any Interest record means it's on the list
  let items = await prisma.interest.findMany({
    where: {userId},
    include: {show: true},
    orderBy: {createdAt: "desc"},
  });
  const interest = (sp.interest as string | undefined)?.toUpperCase?.();
  const minUser = Number(sp.minUser ?? "");
  const sort = (sp.sort as string | undefined) ?? "recent";

  // enrich with user data (rating + interest) via extra queries
  const ratings = await prisma.rating.findMany({
    where: {userId, showId: {in: items.map((i) => i.showId)}},
    select: {showId: true, rating: true},
  });
  const ratingMap = new Map(ratings.map((r) => [r.showId, r.rating]));
  const interestMap = new Map(items.map((r) => [r.showId, r.level]));

  // filter
  items = items.filter((i) => {
    const userRating = ratingMap.get(i.showId) ?? null;
    const lvl = interestMap.get(i.showId) ?? null;
    if (Number.isFinite(minUser) && userRating !== null && userRating < minUser)
      return false;
    if (
      interest &&
      ["LOW", "MEDIUM", "HIGH"].includes(interest) &&
      lvl !== interest
    )
      return false;
    return true;
  });

  // sort
  items.sort((a, b) => {
    if (sort === "rating") {
      const ra = ratingMap.get(a.showId) ?? -1;
      const rb = ratingMap.get(b.showId) ?? -1;
      return rb - ra;
    }
    if (sort === "title") {
      return (a.show?.title ?? "").localeCompare(b.show?.title ?? "");
    }
    // default recent
    return (b.createdAt?.getTime?.() ?? 0) - (a.createdAt?.getTime?.() ?? 0);
  });
  return (
    <div className="p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Watchlist</h1>
      <WatchlistFilters />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {items.map((i) => (
          <PosterCard
            key={i.id}
            show={i.show as unknown as MinimalShow}
            userState={{interest: i.level as "LOW" | "MEDIUM" | "HIGH"}}
          />
        ))}
      </div>
    </div>
  );
}
