"use client";
import {useRouter, useSearchParams} from "next/navigation";

export default function HistoryFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const setParam = (key: string, val: string | null) => {
    const usp = new URLSearchParams(params.toString());
    if (val == null || val === "") usp.delete(key);
    else usp.set(key, val);
    router.push(`/history?${usp.toString()}`);
  };

  const minTmdb = params.get("minTmdb") ?? "";
  const sort = params.get("sort") ?? "recent";

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <label className="text-xs opacity-80">TMDB ≥</label>
      <input
        type="number"
        min={0}
        max={10}
        step={0.1}
        value={minTmdb}
        onChange={(e) => setParam("minTmdb", e.target.value)}
        className="w-20 px-2 py-1 text-sm rounded-md bg-[--color-muted] border border-[--color-border]"
      />
      <label className="text-xs opacity-80">Sort</label>
      <select
        value={sort}
        onChange={(e) => setParam("sort", e.target.value)}
        className="px-2 py-1 text-sm rounded-md bg-[--color-muted] border border-[--color-border]"
      >
        <option value="recent">Recently Watched</option>
        <option value="title">Title</option>
      </select>
    </div>
  );
}
