import MediaTabs from "@/app/discovery/features/media_tabs/MediaTabs";
import DiscoveryLists from "@/app/features/discovery/DiscoveryLists";

export const dynamic = "force-dynamic";

export default async function DiscoveryPage({
  searchParams,
}: {
  searchParams?: Promise<{media?: string | string[]}>;
}) {
  const params = (await searchParams) ?? {};
  const mediaParam = Array.isArray(params.media)
    ? params.media[0]
    : params.media;
  const media = mediaParam === "tv" ? "tv" : "movie";

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Discover</h1>
        <MediaTabs active={media} />
      </div>
      <DiscoveryLists media={media} />
    </div>
  );
}
