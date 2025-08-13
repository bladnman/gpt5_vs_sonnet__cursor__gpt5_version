import DiscoveryLists from "@/app/discovery/features/discovery_list/DiscoveryLists";
import DiscoveryHeader from "@/app/discovery/features/header/DiscoveryHeader";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DiscoveryPage({searchParams}: Props) {
  const sp = await searchParams;
  return (
    <div className="p-6 flex flex-col gap-6">
      <DiscoveryHeader />
      <DiscoveryLists searchParams={sp} />
    </div>
  );
}
