import PosterCard from "@/app/features/shows/PosterCard";
import {getPagedList} from "@/lib/tmdb/client";
import type {MinimalShow, TmdbMediaType} from "@/lib/tmdb/types";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{media: string; section: string}>;
  searchParams: Promise<{page?: string | string[]}>;
};

export default async function SectionIndex({params, searchParams}: Props) {
  const {media, section} = await params;
  const {page: pageParam} = await searchParams;
  const mediaType: TmdbMediaType = media === "tv" ? "tv" : "movie";
  const sectionKey =
    section === "popular" ? "popular" : section === "now" ? "now" : "trending";
  const page = Number(
    Array.isArray(pageParam) ? pageParam[0] : (pageParam ?? "1")
  );

  const {items, totalPages} = await getPagedList(sectionKey, mediaType, page);

  const titleMap: Record<string, string> = {
    trending: "Trending",
    popular: "Popular",
    now: mediaType === "movie" ? "Now Playing" : "On the Air",
  };

  const basePath = `/discovery/${mediaType}/${sectionKey}`;

  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">{titleMap[sectionKey]}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {items.map((item) => (
          <PosterCard key={item.id} show={item as MinimalShow} />
        ))}
      </div>
      <nav className="flex items-center justify-center gap-3">
        {page > 1 && (
          <a
            className="px-3 py-1 rounded-md border border-[--color-border]"
            href={`${basePath}?page=${page - 1}`}
          >
            Previous
          </a>
        )}
        {totalPages && page < totalPages && (
          <a
            className="px-3 py-1 rounded-md border border-[--color-border]"
            href={`${basePath}?page=${page + 1}`}
          >
            Next
          </a>
        )}
      </nav>
    </div>
  );
}
