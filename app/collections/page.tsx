import Unauthenticated from "@/app/collections/features/empty_state/Unauthenticated";
import CollectionsHeader from "@/app/collections/features/header/CollectionsHeader";
import Section from "@/app/collections/features/section/Section";
import use_collections_data from "@/app/collections/hooks/use_collections_data";
import {getUserId} from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const userId = (await getUserId()) ?? undefined;
  if (!userId) return <Unauthenticated />;
  const {watchlist, ratings, history} = await use_collections_data(userId);

  return (
    <div className="p-6 flex flex-col gap-10">
      <CollectionsHeader />

      <Section title="Watchlist" items={watchlist} />

      <Section
        title="Ratings"
        items={ratings.map((r) => r.show)}
        footer={(item) => {
          const r = ratings.find((x) => x.show.id === item.id);
          return r ? `Your rating: ${r.rating}` : null;
        }}
      />

      <Section title="History" items={history} />
    </div>
  );
}

// simplified: reuse PosterCard for consistent styling
