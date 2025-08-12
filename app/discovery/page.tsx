import DiscoveryLists from "@/app/features/discovery/DiscoveryLists";

export const dynamic = "force-dynamic";

export default async function DiscoveryPage() {
  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">The Shows</h1>
          <p className="opacity-80 text-sm">
            All shows at a glance — trending, popular, and what’s new.
          </p>
        </div>
      </div>
      <DiscoveryLists />
    </div>
  );
}
