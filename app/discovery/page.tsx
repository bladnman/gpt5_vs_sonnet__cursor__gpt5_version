import DiscoveryLists from "./features/discovery_list/DiscoveryLists";
import DiscoveryHeader from "./features/header/DiscoveryHeader";
import HeroCarousel from "./features/header/HeroCarousel";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DiscoveryPage({searchParams}: Props) {
  const sp = await searchParams;
  return (
    <div className="p-0 flex flex-col gap-6">
      <HeroCarousel />
      <div className="px-6">
        <DiscoveryHeader />
      </div>
      <DiscoveryLists searchParams={sp} />
    </div>
  );
}
