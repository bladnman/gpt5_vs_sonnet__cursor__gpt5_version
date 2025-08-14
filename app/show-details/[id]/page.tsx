// server actions used inside Controls feature
import HeaderBlock from "@/app/show-details/[id]/features/HeaderBlock";
import HeroImage from "@/app/show-details/[id]/features/HeroImage";
import RelatedGrid from "@/app/show-details/[id]/features/RelatedGrid";
import CastSection from "@/app/show-details/[id]/features/cast/CastSection";
import Controls from "@/app/show-details/[id]/features/controls/Controls";
import ProvidersSection from "@/app/show-details/[id]/features/providers/ProvidersSection";
import SeasonsSection from "@/app/show-details/[id]/features/seasons/SeasonsSection";
import use_show_details_data from "@/app/show-details/[id]/hooks/use_show_details_data";
import {notFound} from "next/navigation";

type Props = {params: Promise<{id: string}>};

export default async function ShowDetailsPage({params}: Props) {
  const {id} = await params;
  try {
    const {mediaType, rich, rating, interest, recs, similar, relatedStates} =
      await use_show_details_data(id);

    return (
      <div className="pb-10">
        <HeroImage backdropPath={rich.backdropPath} />

        {/* Controls + details */}
        <HeaderBlock
          rich={rich}
          mediaType={mediaType}
          rating={rating}
          interest={interest}
        />
        <Controls rich={rich} interest={interest} rating={rating} />

        {/* Providers */}
        <ProvidersSection providers={rich.providers} />

        {/* Cast */}
        <CastSection cast={rich.cast} />

        {/* Seasons for TV */}
        {mediaType === "tv" && <SeasonsSection seasons={rich.seasons} />}

        {/* Discovery under details */}
        <RelatedGrid
          title="Recommended Shows"
          items={recs}
          stateMap={relatedStates}
        />
        <RelatedGrid
          title="Similar Shows"
          items={similar}
          stateMap={relatedStates}
        />
      </div>
    );
  } catch {
    return notFound();
  }
}

// ProviderBadge moved to features/providers/ProviderBadge
