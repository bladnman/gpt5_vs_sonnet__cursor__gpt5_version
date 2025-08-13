import Unauthenticated from "@/app/history/features/empty_state/Unauthenticated";
import HistoryFilters from "@/app/history/features/filters/HistoryFilters";
import HistoryGrid from "@/app/history/features/grid/HistoryGrid";
import HistoryHeader from "@/app/history/features/header/HistoryHeader";
import use_history_items from "@/app/history/hooks/use_history_items";
import {getUserId} from "@/lib/session";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HistoryPage({searchParams}: Props) {
  const sp = await searchParams;
  const userId = (await getUserId()) ?? undefined;
  const items = await use_history_items(sp, userId);
  return (
    <div className="p-6 flex flex-col gap-4">
      <HistoryHeader />
      <HistoryFilters />
      {userId ? <HistoryGrid items={items} /> : <Unauthenticated />}
    </div>
  );
}
