import MediaFilters from "@/app/search/features/filters/MediaFilters";
import SearchGrid from "@/app/search/features/grid/SearchGrid";
import SearchHeader from "@/app/search/features/header/SearchHeader";
import SearchBox from "@/app/search/features/search_box/SearchBox";
import use_search_results from "@/app/search/hooks/use_search_results";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{q?: string | string[]; media?: string | string[]}>;
};

export default async function SearchPage({searchParams}: Props) {
  const params = await searchParams;
  const {q, items} = await use_search_results(params);

  return (
    <div className="p-6 flex flex-col gap-6">
      <SearchHeader />
      <div className="flex items-center gap-3">
        <SearchBox />
        <MediaFilters />
      </div>
      {q && (
        <p className="text-sm text-[--color-foreground]/80">
          Results for “{q}”
        </p>
      )}
      <SearchGrid items={items} />
    </div>
  );
}
