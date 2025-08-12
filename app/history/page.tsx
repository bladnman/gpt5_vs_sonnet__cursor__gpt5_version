import PosterCard from "@/app/features/shows/PosterCard";
import {prisma} from "@/lib/db";
import {getUserId} from "@/lib/session";
import type {MinimalShow} from "@/lib/tmdb/types";
import HistoryFilters from "./features/filters/HistoryFilters";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HistoryPage({searchParams}: Props) {
  const sp = await searchParams;
  const userId = await getUserId();
  if (!userId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">History</h1>
        <p className="opacity-80 mt-2">
          Mark shows as watched to track your history.
        </p>
      </div>
    );
  }
  let items = await prisma.watch.findMany({
    where: {userId},
    include: {show: true},
    orderBy: {watchedAt: "desc"},
  });
  const minTmdb = Number(sp.minTmdb ?? "");
  const sort = (sp.sort as string | undefined) ?? "recent";

  // filter by TMDB rating and (optional) title substring
  items = items.filter((i) => {
    if (
      Number.isFinite(minTmdb) &&
      typeof i.show?.tmdbRating === "number" &&
      (i.show?.tmdbRating as number) < minTmdb
    )
      return false;
    return true;
  });

  items.sort((a, b) => {
    if (sort === "title")
      return (a.show?.title ?? "").localeCompare(b.show?.title ?? "");
    return (b.watchedAt?.getTime?.() ?? 0) - (a.watchedAt?.getTime?.() ?? 0);
  });
  return (
    <div className="p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">History</h1>
      <HistoryFilters />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {items.map((i) => (
          <PosterCard
            key={i.id}
            show={i.show as unknown as MinimalShow}
            userState={{watchedAt: i.watchedAt.toISOString()}}
          />
        ))}
      </div>
    </div>
  );
}
