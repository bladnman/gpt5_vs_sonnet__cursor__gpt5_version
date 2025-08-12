import DiscoveryFilters from "@/app/discovery/features/filters";
import DiscoveryLists from "@/app/features/discovery/DiscoveryLists";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DiscoveryPage({searchParams}: Props) {
  const sp = await searchParams;
  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">The Shows</h1>
          <p className="opacity-80 text-sm">
            All shows at a glance — trending, popular, and what’s new.
          </p>
        </div>
        <DiscoveryFilters />
      </div>
      <DiscoveryLists searchParams={sp} />
    </div>
  );
}
