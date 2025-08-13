import DiscoverySection from "@/app/discovery/features/discovery_list/sections/DiscoverySection";
import use_discovery_lists from "@/app/discovery/hooks/use_discovery_lists";

export default async function DiscoveryLists({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const {trending, popular, now, stateMap} =
    await use_discovery_lists(searchParams);
  return (
    <div className="flex flex-col gap-10">
      <DiscoverySection
        title="Trending"
        items={trending}
        sectionKey="trending"
        stateMap={stateMap}
      />
      <DiscoverySection
        title="Popular"
        items={popular}
        sectionKey="popular"
        stateMap={stateMap}
      />
      <DiscoverySection
        title="Now"
        items={now}
        sectionKey="now"
        stateMap={stateMap}
      />
    </div>
  );
}
