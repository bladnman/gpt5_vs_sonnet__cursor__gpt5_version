import type {MinimalShow} from "@/lib/tmdb/types";
// user state is provided by parent; keep this component purely presentational
import Image from "next/image";
import Link from "next/link";

type Props = {
  show: MinimalShow;
  className?: string;
  href?: string;
  userState?: {
    onWatchlist?: boolean;
    watchedAt?: string | null;
    rating?: number | null;
    interest?: "LOW" | "MEDIUM" | "HIGH" | null;
  };
};

export default function PosterCard({show, className, href, userState}: Props) {
  const imageSrc = show.posterPath
    ? `https://image.tmdb.org/t/p/w342${show.posterPath}`
    : undefined;

  return (
    <Link
      href={href ?? `/show-details/${encodeURIComponent(show.id)}`}
      className={["group block", className ?? ""].join(" ")}
      aria-label={show.title}
    >
      <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg bg-[--color-muted] shadow-sm ring-1 ring-inset ring-[--color-border]">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={show.title}
            fill
            sizes="(max-width: 640px) 40vw, (max-width: 1024px) 20vw, 15vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            priority={false}
          />
        ) : (
          <div className="w-full h-full" />
        )}

        {typeof show.tmdbRating === "number" && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 text-xs rounded-md bg-black/65 backdrop-blur text-white ring-1 ring-white/15">
            ★ {show.tmdbRating.toFixed(1)}
          </div>
        )}

        {/* User overlays: watchlist, watched, rating, interest */}
        {userState && (
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
            {typeof userState.rating === "number" && (
              <span className="px-1.5 py-0.5 text-xs rounded-md bg-[--color-primary] text-white/95 ring-1 ring-white/10">
                You: {userState.rating}
              </span>
            )}
            {userState.onWatchlist && (
              <span className="px-1.5 py-0.5 text-xs rounded-md bg-black/65 text-white ring-1 ring-white/10">
                Watchlist
              </span>
            )}
            {userState.watchedAt && (
              <span className="px-1.5 py-0.5 text-xs rounded-md bg-black/65 text-white ring-1 ring-white/10">
                Watched
              </span>
            )}
            {userState.interest && (
              <span className="px-1.5 py-0.5 text-xs rounded-md bg-black/65 text-white ring-1 ring-white/10">
                {userState.interest === "HIGH"
                  ? "High interest"
                  : userState.interest === "LOW"
                    ? "Low interest"
                    : "Interest"}
              </span>
            )}
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
          <div className="text-sm font-medium leading-tight line-clamp-2">
            {show.title}
          </div>
        </div>
      </div>
    </Link>
  );
}
