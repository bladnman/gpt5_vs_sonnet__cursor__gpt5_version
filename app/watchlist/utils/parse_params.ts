export type WatchlistParams = {
  minUser: number | null;
  interest: "LOW" | "MEDIUM" | "HIGH" | null;
  sort: "recent" | "rating" | "title";
};

export function parseWatchlistParams(
  sp: Record<string, string | string[] | undefined>
): WatchlistParams {
  const minUser = Number(sp.minUser ?? "");
  const interest = (sp.interest as string | undefined)?.toUpperCase?.();
  const sortRaw = (sp.sort as string | undefined) ?? "recent";
  const sort: WatchlistParams["sort"] = ["rating", "title"].includes(sortRaw)
    ? (sortRaw as WatchlistParams["sort"])
    : "recent";
  return {
    minUser: Number.isFinite(minUser) ? minUser : null,
    interest:
      interest && ["LOW", "MEDIUM", "HIGH"].includes(interest)
        ? (interest as WatchlistParams["interest"])
        : null,
    sort,
  };
}
