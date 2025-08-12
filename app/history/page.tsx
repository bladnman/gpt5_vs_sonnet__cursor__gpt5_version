import PosterCard from "@/app/features/shows/PosterCard";
import {prisma} from "@/lib/db";
import {getUserId} from "@/lib/session";
import type {MinimalShow} from "@/lib/tmdb/types";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
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
  const items = await prisma.watch.findMany({
    where: {userId},
    include: {show: true},
    orderBy: {watchedAt: "desc"},
  });
  return (
    <div className="p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">History</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {items.map((i) => (
          <PosterCard key={i.id} show={i.show as unknown as MinimalShow} />
        ))}
      </div>
    </div>
  );
}
