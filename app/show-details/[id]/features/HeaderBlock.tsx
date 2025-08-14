import type {ShowDetails, TmdbMediaType} from "@/lib/tmdb/types";
import Image from "next/image";

export default function HeaderBlock({
  rich,
  mediaType,
  rating,
  interest,
}: {
  rich: ShowDetails;
  mediaType: TmdbMediaType;
  rating: {rating: number} | null;
  interest: {level: "LOW" | "MEDIUM" | "HIGH"; waiting?: boolean} | null;
}) {
  return (
    <section className="px-6 md:px-8 lg:px-10 -mt-24">
      <div className="flex gap-6 items-end">
        {rich.posterPath ? (
          <Image
            src={`https://image.tmdb.org/t/p/w342${rich.posterPath}`}
            alt={rich.title}
            width={228}
            height={342}
            className="rounded-md ring-1 ring-inset ring-[--color-border] shadow-2xl"
          />
        ) : (
          <div className="w-[228px] h-[342px] rounded-md bg-[--color-muted]" />
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-bold tracking-tight">{rich.title}</h1>
          {rich.tagline && (
            <p className="text-lg opacity-80 mt-1">{rich.tagline}</p>
          )}
          <div className="mt-2 text-sm opacity-90 flex flex-wrap gap-x-3 gap-y-1">
            <span>{rich.releaseDate ?? "—"}</span>
            {rich.genres && rich.genres.length > 0 && (
              <span>
                {rich.genres
                  .map((g: {id: number; name: string}) => g.name)
                  .join(" · ")}
              </span>
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
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[--color-primary] text-white">
              {rich.tmdbRating?.toFixed?.(1) ?? "—"}
            </span>
            <span className="opacity-80">
              TMDB votes: {rich.tmdbVoteCount ?? 0}
            </span>
            <span className="opacity-80">
              Your rating: {rating?.rating ?? "—"}
            </span>
            <span className="opacity-80">
              On list: {interest ? "Yes" : "No"}
            </span>
            {interest?.level && (
              <span className="opacity-80">Interest: {interest.level}</span>
            )}
            {interest?.waiting && <span className="opacity-80">Waiting</span>}
          </div>
          {rich.overview && (
            <p className="mt-4 max-w-3xl leading-relaxed opacity-90">
              {rich.overview}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
