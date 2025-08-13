export type RatingsParams = {
  minUser: number | null;
  minTmdb: number | null;
  interest: "LOW" | "MEDIUM" | "HIGH" | null;
  sort: "recent" | "rating" | "title";
};

export function parseRatingsParams(
  sp: Record<string, string | string[] | undefined>
): RatingsParams {
  const minUser = Number(sp.minUser ?? "");
  const minTmdb = Number(sp.minTmdb ?? "");
  const interest = (sp.interest as string | undefined)?.toUpperCase?.();
  const sortRaw = (sp.sort as string | undefined) ?? "recent";
  const sort: RatingsParams["sort"] = ["rating", "title"].includes(sortRaw)
    ? (sortRaw as RatingsParams["sort"])
    : "recent";
  return {
    minUser: Number.isFinite(minUser) ? minUser : null,
    minTmdb: Number.isFinite(minTmdb) ? minTmdb : null,
    interest:
      interest && ["LOW", "MEDIUM", "HIGH"].includes(interest)
        ? (interest as RatingsParams["interest"])
        : null,
    sort,
  };
}
