import DiscoveryFilters from "@/app/discovery/features/filters";

export default async function DiscoveryHeader() {
  return (
    <div className="flex items-baseline justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Discovery</h1>
        <p className="opacity-80 text-sm">
          All shows at a glance — trending, popular, and what’s new.
        </p>
      </div>
      <DiscoveryFilters />
    </div>
  );
}
