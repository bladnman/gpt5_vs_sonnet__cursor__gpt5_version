import CollectionsHeader from "@/app/collections/features/header/CollectionsHeader";
import Section from "@/app/collections/features/section/Section";
import {prisma} from "@/lib/db";
import {getUserId} from "@/lib/session";
import type {MinimalShow} from "@/lib/tmdb/types";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const userId = await getUserId();
  if (!userId) {
    return (
      <div className="p-6">
        <CollectionsHeader />
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
      <CollectionsHeader />

      <Section
        title="Watchlist"
        items={watchlist.map((w) => w.show as unknown as MinimalShow)}
      />

      <Section
        title="Ratings"
        items={ratings.map((r) => r.show as unknown as MinimalShow)}
        footer={(item) => {
          const r = ratings.find(
            (x) => (x.show as unknown as MinimalShow).id === item.id
          );
          return r ? `Your rating: ${r.rating}` : null;
        }}
      />

      <Section
        title="History"
        items={history.map((h) => h.show as unknown as MinimalShow)}
      />
    </div>
  );
}

// simplified: reuse PosterCard for consistent styling
