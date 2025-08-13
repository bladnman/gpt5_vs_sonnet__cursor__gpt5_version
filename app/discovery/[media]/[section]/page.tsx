import Pagination from "@/app/discovery/[media]/[section]/features/pagination/Pagination";
import SectionGrid from "@/app/discovery/[media]/[section]/features/section_grid/SectionGrid";
import SectionHeader from "@/app/discovery/[media]/[section]/features/section_header/SectionHeader";
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
      <SectionHeader title={titleMap[sectionKey]} />
      <SectionGrid items={items as MinimalShow[]} />
      <Pagination basePath={basePath} page={page} totalPages={totalPages} />
    </div>
  );
}
