import {
  addToWatchlist,
  clearInterest,
  clearRating,
  clearWatched,
  markWatched,
  rateShow,
  removeFromWatchlist,
  setInterest,
  setWaiting,
} from "@/app/actions/shows";
import HeaderBlock from "@/app/show-details/[id]/features/HeaderBlock";
import HeroImage from "@/app/show-details/[id]/features/HeroImage";
import RelatedGrid from "@/app/show-details/[id]/features/RelatedGrid";
import use_show_details_data from "@/app/show-details/[id]/hooks/use_show_details_data";
import Image from "next/image";
import {notFound} from "next/navigation";
import RatingControl from "./RatingControl";
import WatchActions from "./WatchActions";

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
        {/* Controls */}
        <div className="mt-4 flex flex-wrap gap-3 items-center">
          <WatchActions
            inWatchlist={!!interest}
            onAdd={async () => {
              "use server";
              await addToWatchlist(rich);
            }}
            onRemove={async () => {
              "use server";
              await removeFromWatchlist(rich.id);
            }}
            onWatched={async () => {
              "use server";
              await markWatched(rich);
            }}
            onClearWatched={async () => {
              "use server";
              await clearWatched(rich.id);
            }}
            onInterest={async (lvl) => {
              "use server";
              if (lvl) await setInterest(rich, lvl);
              else await clearInterest(rich.id);
            }}
            onToggleWaiting={async () => {
              "use server";
              await setWaiting(rich, !interest?.waiting);
            }}
          />
          <RatingControl
            initial={rating?.rating ?? null}
            onSave={async (value) => {
              "use server";
              await rateShow(rich, value);
            }}
            onClear={async () => {
              "use server";
              await clearRating(rich.id);
            }}
          />
        </div>

        {/* Providers */}
        {rich.providers && (
          <section className="p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-3">Where to watch</h2>
            <div className="flex flex-wrap gap-3 text-sm">
              {rich.providers.flatrate &&
                rich.providers.flatrate.length > 0 && (
                  <div>
                    <div className="opacity-80 mb-1">Streaming</div>
                    <div className="flex flex-wrap gap-2">
                      {rich.providers.flatrate.map(
                        (p: {
                          id: number;
                          name: string;
                          logoPath?: string | null;
                        }) => (
                          <ProviderBadge
                            key={`f-${p.id}`}
                            name={p.name}
                            logoPath={p.logoPath}
                          />
                        )
                      )}
                    </div>
                  </div>
                )}
              {rich.providers.buy && rich.providers.buy.length > 0 && (
                <div>
                  <div className="opacity-80 mb-1">Buy</div>
                  <div className="flex flex-wrap gap-2">
                    {rich.providers.buy.map(
                      (p: {
                        id: number;
                        name: string;
                        logoPath?: string | null;
                      }) => (
                        <ProviderBadge
                          key={`b-${p.id}`}
                          name={p.name}
                          logoPath={p.logoPath}
                        />
                      )
                    )}
                  </div>
                </div>
              )}
              {rich.providers.rent && rich.providers.rent.length > 0 && (
                <div>
                  <div className="opacity-80 mb-1">Rent</div>
                  <div className="flex flex-wrap gap-2">
                    {rich.providers.rent.map(
                      (p: {
                        id: number;
                        name: string;
                        logoPath?: string | null;
                      }) => (
                        <ProviderBadge
                          key={`r-${p.id}`}
                          name={p.name}
                          logoPath={p.logoPath}
                        />
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Cast */}
        {rich.cast && rich.cast.length > 0 && (
          <section className="px-6 md:px-8">
            <h2 className="text-xl font-semibold mb-3">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
              {rich.cast
                .slice(0, 14)
                .map(
                  (c: {
                    id: number;
                    name: string;
                    character?: string;
                    profilePath?: string | null;
                  }) => (
                    <div key={c.id} className="flex items-center gap-3">
                      {c.profilePath ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w185${c.profilePath}`}
                          alt={c.name}
                          width={40}
                          height={60}
                          className="rounded-md object-cover border border-[--color-border] w-10 h-14"
                        />
                      ) : (
                        <div className="w-10 h-14 rounded-md bg-[--color-muted]" />
                      )}
                      <div className="text-sm">
                        <div className="font-medium leading-tight">
                          {c.name}
                        </div>
                        {c.character && (
                          <div className="opacity-80 leading-tight">
                            as {c.character}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
            </div>
          </section>
        )}

        {/* Seasons for TV */}
        {mediaType === "tv" && rich.seasons && rich.seasons.length > 0 && (
          <section className="p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-3">Seasons</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
              {rich.seasons.map(
                (s: {
                  id: number;
                  name: string;
                  seasonNumber: number;
                  episodeCount?: number;
                  posterPath?: string | null;
                }) => (
                  <div key={s.id} className="flex flex-col gap-2">
                    {s.posterPath ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w342${s.posterPath}`}
                        alt={s.name}
                        width={228}
                        height={342}
                        className="rounded-md border border-[--color-border] object-cover"
                      />
                    ) : (
                      <div className="w-full aspect-[2/3] rounded-md bg-[--color-muted]" />
                    )}
                    <div className="text-sm">
                      <div className="font-medium leading-tight">{s.name}</div>
                      <div className="opacity-80 leading-tight">
                        S{s.seasonNumber} · {s.episodeCount ?? 0} episodes
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {/* Discovery under details */}
        <RelatedGrid
          title="Recommended"
          items={recs}
          stateMap={relatedStates}
        />
        <RelatedGrid title="Similar" items={similar} stateMap={relatedStates} />
      </div>
    );
  } catch {
    return notFound();
  }
}

function ProviderBadge({
  name,
  logoPath,
}: {
  name: string;
  logoPath?: string | null;
}) {
  return (
    <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md border border-[--color-border] bg-[--color-muted]">
      {logoPath ? (
        <Image
          src={`https://image.tmdb.org/t/p/w92${logoPath}`}
          alt=""
          width={18}
          height={18}
          className="rounded"
        />
      ) : (
        <div className="w-[18px] h-[18px] rounded bg-[--color-border]" />
      )}
      <span className="text-xs">{name}</span>
    </div>
  );
}
