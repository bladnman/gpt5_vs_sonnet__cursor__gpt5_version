import ShowCard from "@/app/features/shows/ShowCard";
import MediaFilters from "@/app/search/features/filters/MediaFilters";
import SearchBox from "@/app/search/features/search_box/SearchBox";
import {searchAll} from "@/lib/tmdb/client";
import type {MinimalShow, TmdbMediaType} from "@/lib/tmdb/types";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{q?: string | string[]; media?: string | string[]}>;
};

export default async function SearchPage({searchParams}: Props) {
  const params = await searchParams;
  const qParam = Array.isArray(params.q) ? params.q[0] : params.q;
  const q = qParam?.trim() ?? "";
  const mediaParam = Array.isArray(params.media)
    ? params.media[0]
    : params.media;
  const media: TmdbMediaType | undefined =
    mediaParam === "movie" || mediaParam === "tv"
      ? (mediaParam as TmdbMediaType)
      : undefined;
  const results = q ? await searchAll(q, media) : [];

  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Search</h1>
      <div className="flex items-center gap-3">
        <SearchBox />
        <MediaFilters />
      </div>
      {q && (
        <p className="text-sm text-[--color-foreground]/80">
          Results for “{q}”
        </p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {results.map((item) => (
          <ShowCard key={item.id} show={item as MinimalShow} />
        ))}
      </div>
    </div>
  );
}
