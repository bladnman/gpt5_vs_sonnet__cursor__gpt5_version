import type {RatingsParams} from "./parse_params";

export type RatingRecord = {
  id: string;
  rating: number;
  ratedAt: Date;
  show: {tmdbRating?: number | null; title?: string | null};
  interestLevel?: "LOW" | "MEDIUM" | "HIGH" | null;
};

export function filterAndSortRatings(
  items: RatingRecord[],
  params: RatingsParams
): RatingRecord[] {
  const filtered = items.filter((i) => {
    if (params.minUser != null && i.rating < params.minUser) return false;
    const tr = typeof i.show.tmdbRating === "number" ? i.show.tmdbRating : null;
    if (params.minTmdb != null && tr != null && tr < params.minTmdb)
      return false;
    if (
      params.interest &&
      ["LOW", "MEDIUM", "HIGH"].includes(params.interest) &&
      i.interestLevel !== params.interest
    )
      return false;
    return true;
  });

  filtered.sort((a, b) => {
    if (params.sort === "rating") return b.rating - a.rating;
    if (params.sort === "title")
      return (a.show.title ?? "").localeCompare(b.show.title ?? "");
    return (b.ratedAt?.getTime?.() ?? 0) - (a.ratedAt?.getTime?.() ?? 0);
  });
  return filtered;
}
