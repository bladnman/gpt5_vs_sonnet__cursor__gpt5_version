import DiscoveryLists from "@/app/features/discovery/DiscoveryLists";

export const dynamic = "force-dynamic";

export default async function DiscoveryPage() {
  return (
    <div className="p-6 flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Discover</h1>
      <div className="flex flex-col gap-12">
        <div>
          <h2 className="text-xl font-semibold mb-4">Movies</h2>
          <DiscoveryLists media="movie" />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">TV</h2>
          <DiscoveryLists media="tv" />
        </div>
      </div>
    </div>
  );
}
