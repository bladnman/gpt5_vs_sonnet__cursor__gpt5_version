"use client";
import {useRouter, useSearchParams} from "next/navigation";

export default function WatchlistFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const setParam = (key: string, val: string | null) => {
    const usp = new URLSearchParams(params.toString());
    if (val == null || val === "") usp.delete(key);
    else usp.set(key, val);
    router.push(`/watchlist?${usp.toString()}`);
  };

  const interest = (params.get("interest") ?? "ANY").toUpperCase();
  const minUser = params.get("minUser") ?? "";
  const sort = params.get("sort") ?? "recent";

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <label className="text-xs opacity-80">Interest</label>
      <select
        value={interest}
        onChange={(e) => setParam("interest", e.target.value)}
        className="px-2 py-1 text-sm rounded-md bg-[--color-muted] border border-[--color-border]"
      >
        <option value="ANY">Any</option>
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
      </select>
      <label className="text-xs opacity-80">Your Rating ≥</label>
      <input
        type="number"
        min={1}
        max={10}
        step={1}
        value={minUser}
        onChange={(e) => setParam("minUser", e.target.value)}
        className="w-20 px-2 py-1 text-sm rounded-md bg-[--color-muted] border border-[--color-border]"
      />
      <label className="text-xs opacity-80">Sort</label>
      <select
        value={sort}
        onChange={(e) => setParam("sort", e.target.value)}
        className="px-2 py-1 text-sm rounded-md bg-[--color-muted] border border-[--color-border]"
      >
        <option value="recent">Recently Added</option>
        <option value="rating">Your Rating</option>
        <option value="title">Title</option>
      </select>
    </div>
  );
}
