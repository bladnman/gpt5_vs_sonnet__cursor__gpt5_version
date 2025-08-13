import type {WatchlistParams} from "./parse_params";

export type WatchlistRecord = {
  id: string;
  createdAt: Date;
  show: {title?: string | null};
  rating?: number | null;
  interest: "LOW" | "MEDIUM" | "HIGH";
};

export function filterAndSortWatchlist(
  items: WatchlistRecord[],
  params: WatchlistParams
): WatchlistRecord[] {
  const filtered = items.filter((i) => {
    if (
      params.minUser != null &&
      (i.rating ?? -1) !== -1 &&
      (i.rating as number) < params.minUser
    )
      return false;
    if (params.interest && i.interest !== params.interest) return false;
    return true;
  });
  filtered.sort((a, b) => {
    if (params.sort === "rating") {
      const ra = a.rating ?? -1;
      const rb = b.rating ?? -1;
      return rb - ra;
    }
    if (params.sort === "title")
      return (a.show.title ?? "").localeCompare(b.show.title ?? "");
    return (b.createdAt?.getTime?.() ?? 0) - (a.createdAt?.getTime?.() ?? 0);
  });
  return filtered;
}
