import Unauthenticated from "@/app/watchlist/features/empty_state/Unauthenticated";
import WatchlistGrid from "@/app/watchlist/features/grid/WatchlistGrid";
import WatchlistHeader from "@/app/watchlist/features/header/WatchlistHeader";
import use_watchlist_items from "@/app/watchlist/hooks/use_watchlist_items";
import {getUserId} from "@/lib/session";
import WatchlistFilters from "./features/filters/WatchlistFilters";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function WatchlistPage({searchParams}: Props) {
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
      <WatchlistHeader />
      <WatchlistFilters />
      <WatchlistGrid items={await use_watchlist_items(sp, userId)} />
    </div>
  );
}
