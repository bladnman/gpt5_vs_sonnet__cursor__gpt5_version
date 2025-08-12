import PosterCard from "@/app/features/shows/PosterCard";
import {prisma} from "@/lib/db";
import {getUserId} from "@/lib/session";
import type {MinimalShow} from "@/lib/tmdb/types";
import RatingsFilters from "./features/filters/RatingsFilters";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RatingsPage({searchParams}: Props) {
  const sp = await searchParams;
  const userId = await getUserId();
  if (!userId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Ratings</h1>
        <p className="opacity-80 mt-2">Rate a show to see it listed here.</p>
      </div>
    );
  }
  let items = await prisma.rating.findMany({
    where: {userId},
    include: {show: true},
    orderBy: {ratedAt: "desc"},
  });
  const minUser = Number(sp.minUser ?? "");
  const minTmdb = Number(sp.minTmdb ?? "");
  const interest = (sp.interest as string | undefined)?.toUpperCase?.();
  const sort = (sp.sort as string | undefined) ?? "recent";

  // interest joins
  const interests = await prisma.interest.findMany({
    where: {userId, showId: {in: items.map((i) => i.showId)}},
    select: {showId: true, level: true},
  });
  const interestMap = new Map(interests.map((r) => [r.showId, r.level]));

  // filter
  items = items.filter((i) => {
    if (Number.isFinite(minUser) && i.rating < minUser) return false;
    if (
      Number.isFinite(minTmdb) &&
      typeof i.show?.tmdbRating === "number" &&
      (i.show?.tmdbRating as number) < minTmdb
    )
      return false;
    if (
      interest &&
      ["LOW", "MEDIUM", "HIGH"].includes(interest) &&
      interestMap.get(i.showId) !== interest
    )
      return false;
    return true;
  });

  // sort
  items.sort((a, b) => {
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "title")
      return (a.show?.title ?? "").localeCompare(b.show?.title ?? "");
    // default recent
    return (b.ratedAt?.getTime?.() ?? 0) - (a.ratedAt?.getTime?.() ?? 0);
  });
  return (
    <div className="p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Ratings</h1>
      <RatingsFilters />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {items.map((i) => (
          <PosterCard
            key={i.id}
            show={i.show as unknown as MinimalShow}
            userState={{rating: i.rating}}
          />
        ))}
      </div>
    </div>
  );
}
