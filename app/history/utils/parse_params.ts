export type HistoryParams = {
  minTmdb: number | null;
  sort: "recent" | "title";
};

export function parseHistoryParams(
  sp: Record<string, string | string[] | undefined>
): HistoryParams {
  const minTmdbRaw = sp.minTmdb as string | undefined;
  const minTmdb = Number(minTmdbRaw ?? "");
  const sortRaw = (sp.sort as string | undefined) ?? "recent";
  const sort: "recent" | "title" = sortRaw === "title" ? "title" : "recent";
  return {
    minTmdb: Number.isFinite(minTmdb) ? minTmdb : null,
    sort,
  };
}
