import type {HistoryParams} from "./parse_params";

export type HistoryRecord = {
  id: string;
  watchedAt: Date;
  show: {tmdbRating?: number | null; title?: string | null};
};

export function filterAndSortHistory(
  items: HistoryRecord[],
  params: HistoryParams
): HistoryRecord[] {
  let filtered = items;
  if (params.minTmdb != null) {
    filtered = filtered.filter((i) => {
      const rating =
        typeof i.show.tmdbRating === "number" ? i.show.tmdbRating : null;
      return !(rating != null && rating < params.minTmdb!);
    });
  }
  filtered.sort((a, b) => {
    if (params.sort === "title")
      return (a.show.title ?? "").localeCompare(b.show.title ?? "");
    return (b.watchedAt?.getTime?.() ?? 0) - (a.watchedAt?.getTime?.() ?? 0);
  });
  return filtered;
}
