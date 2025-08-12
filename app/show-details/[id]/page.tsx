import {
  addToWatchlist,
  markWatched,
  rateShow,
  removeFromWatchlist,
} from "@/app/actions/shows";
import PosterCard from "@/app/features/shows/PosterCard";
import {prisma} from "@/lib/db";
import {getUserId} from "@/lib/session";
import {ensureShowExists} from "@/lib/shows";
import {
  getDetails,
  getRecommendations,
  getRichDetails,
  getSimilar,
} from "@/lib/tmdb/client";
import type {TmdbMediaType} from "@/lib/tmdb/types";
import Image from "next/image";
import {notFound} from "next/navigation";
import RatingControl from "./RatingControl";
import WatchActions from "./WatchActions";

type Props = {params: Promise<{id: string}>};

export default async function ShowDetailsPage({params}: Props) {
  const {id} = await params;
  let show = await prisma.show.findUnique({where: {id}});
  if (!show) {
    const [prefix, tmdbIdStr] = id.split("_");
    const normalized = (prefix ?? "").toUpperCase();
    const mediaType: TmdbMediaType = normalized === "MOVIE" ? "movie" : "tv";
    const tmdbId = Number.parseInt(tmdbIdStr ?? "", 10);
    if (!Number.isFinite(tmdbId)) return notFound();
    const minimal = await getDetails(mediaType, tmdbId);
    await ensureShowExists(minimal);
    show = await prisma.show.findUnique({where: {id}});
    if (!show) return notFound();
  }
  const userId = await getUserId();
  const [rating, onWatchlist] = await Promise.all([
    userId
      ? prisma.rating.findUnique({where: {userId_showId: {userId, showId: id}}})
      : Promise.resolve(null),
    userId
      ? prisma.watchlist.findUnique({
          where: {userId_showId: {userId, showId: id}},
        })
      : Promise.resolve(null),
  ]);

  const [prefix, tmdbIdStr] = id.split("_");
  const normalized = (prefix ?? "").toUpperCase();
  const mediaType: TmdbMediaType = normalized === "MOVIE" ? "movie" : "tv";
  const tmdbId = Number.parseInt(tmdbIdStr ?? "", 10);
  const rich = await getRichDetails(mediaType, tmdbId);
  const [recs, similar] = await Promise.all([
    getRecommendations(mediaType, tmdbId),
    getSimilar(mediaType, tmdbId),
  ]);

  return (
    <div className="pb-10">
      {/* Hero image */}
      {rich.backdropPath ? (
        <div className="relative">
          <Image
            src={`https://image.tmdb.org/t/p/w1280${rich.backdropPath}`}
            alt=""
            width={1280}
            height={720}
            className="h-[28vh] w-full object-cover opacity-35"
            priority
          />
        </div>
      ) : null}

      {/* Content below the image for readability */}
      <section className="p-6 md:p-8 lg:p-10">
        <div className="flex gap-6">
          {rich.posterPath ? (
            <Image
              src={`https://image.tmdb.org/t/p/w342${rich.posterPath}`}
              alt={rich.title}
              width={228}
              height={342}
              className="rounded-md ring-1 ring-inset ring-[--color-border] shadow-xl"
            />
          ) : (
            <div className="w-[228px] h-[342px] rounded-md bg-[--color-muted]" />
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold tracking-tight">{rich.title}</h1>
            {rich.tagline && (
              <p className="text-lg opacity-80 mt-1">{rich.tagline}</p>
            )}
            <div className="mt-2 text-sm opacity-90 flex flex-wrap gap-x-3 gap-y-1">
              <span>{rich.releaseDate ?? "—"}</span>
              {rich.genres && rich.genres.length > 0 && (
                <span>{rich.genres.map((g) => g.name).join(" · ")}</span>
              )}
              {mediaType === "movie" && rich.runtimeMinutes ? (
                <span>{rich.runtimeMinutes} min</span>
              ) : null}
              {mediaType === "tv" && rich.numberOfSeasons ? (
                <span>
                  {rich.numberOfSeasons} seasons · {rich.numberOfEpisodes ?? 0}{" "}
                  episodes
                </span>
              ) : null}
            </div>
            <div className="mt-3 flex items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-black/50 border border-white/10">
                ★ {rich.tmdbRating?.toFixed?.(1) ?? "—"}
              </span>
              <span className="opacity-80">
                TMDB votes: {rich.tmdbVoteCount ?? 0}
              </span>
              <span className="opacity-80">
                Your rating: {rating?.rating ?? "—"}
              </span>
              <span className="opacity-80">
                Watchlist: {onWatchlist ? "Yes" : "No"}
              </span>
            </div>
            {/* Controls */}
            <div className="mt-4 flex flex-wrap gap-3 items-center">
              <WatchActions
                inWatchlist={!!onWatchlist}
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
              />
              <RatingControl
                initial={rating?.rating ?? null}
                onSave={async (value) => {
                  "use server";
                  await rateShow(rich, value);
                }}
              />
            </div>
            {rich.overview && (
              <p className="mt-4 max-w-3xl leading-relaxed opacity-90">
                {rich.overview}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Providers */}
      {rich.providers && (
        <section className="p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-3">Where to watch</h2>
          <div className="flex flex-wrap gap-3 text-sm">
            {rich.providers.flatrate && rich.providers.flatrate.length > 0 && (
              <div>
                <div className="opacity-80 mb-1">Streaming</div>
                <div className="flex flex-wrap gap-2">
                  {rich.providers.flatrate.map((p) => (
                    <ProviderBadge
                      key={`f-${p.id}`}
                      name={p.name}
                      logoPath={p.logoPath}
                    />
                  ))}
                </div>
              </div>
            )}
            {rich.providers.buy && rich.providers.buy.length > 0 && (
              <div>
                <div className="opacity-80 mb-1">Buy</div>
                <div className="flex flex-wrap gap-2">
                  {rich.providers.buy.map((p) => (
                    <ProviderBadge
                      key={`b-${p.id}`}
                      name={p.name}
                      logoPath={p.logoPath}
                    />
                  ))}
                </div>
              </div>
            )}
            {rich.providers.rent && rich.providers.rent.length > 0 && (
              <div>
                <div className="opacity-80 mb-1">Rent</div>
                <div className="flex flex-wrap gap-2">
                  {rich.providers.rent.map((p) => (
                    <ProviderBadge
                      key={`r-${p.id}`}
                      name={p.name}
                      logoPath={p.logoPath}
                    />
                  ))}
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
            {rich.cast.slice(0, 14).map((c) => (
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
                  <div className="font-medium leading-tight">{c.name}</div>
                  {c.character && (
                    <div className="opacity-80 leading-tight">
                      as {c.character}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Seasons for TV */}
      {mediaType === "tv" && rich.seasons && rich.seasons.length > 0 && (
        <section className="p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-3">Seasons</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
            {rich.seasons.map((s) => (
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
            ))}
          </div>
        </section>
      )}

      {/* Discovery under details */}
      {recs.length > 0 && (
        <section className="p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-3">Recommended</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
            {recs.slice(0, 14).map((s) => (
              <PosterCard key={s.id} show={s} />
            ))}
          </div>
        </section>
      )}
      {similar.length > 0 && (
        <section className="p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-3">Similar</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
            {similar.slice(0, 14).map((s) => (
              <PosterCard key={s.id} show={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
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
