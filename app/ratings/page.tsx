import Unauthenticated from "@/app/ratings/features/empty_state/Unauthenticated";
import RatingsGrid from "@/app/ratings/features/grid/RatingsGrid";
import RatingsHeader from "@/app/ratings/features/header/RatingsHeader";
import use_ratings_items from "@/app/ratings/hooks/use_ratings_items";
import {getUserId} from "@/lib/session";
import RatingsFilters from "./features/filters/RatingsFilters";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RatingsPage({searchParams}: Props) {
  const sp = await searchParams;
  const userId = (await getUserId()) ?? undefined;
  if (!userId) {
    return (
      <div className="p-6">
        <Unauthenticated />
      </div>
    );
  }
  return (
    <div className="p-6 flex flex-col gap-4">
      <RatingsHeader />
      <RatingsFilters />
      <RatingsGrid items={await use_ratings_items(sp, userId)} />
    </div>
  );
}
