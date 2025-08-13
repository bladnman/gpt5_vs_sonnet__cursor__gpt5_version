"use client";
import GenrePill from "@/app/discovery/features/filters/components/GenrePill";
import SegmentButton from "@/app/discovery/features/filters/components/SegmentButton";
import {useRouter, useSearchParams} from "next/navigation";
import {useMemo} from "react";

type Genre = {id: number; name: string};

type Props = {genres: Genre[]};

export default function DiscoveryFilters({genres}: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const setParam = (key: string, val: string | null) => {
    const usp = new URLSearchParams(params.toString());
    if (val == null || val === "") usp.delete(key);
    else usp.set(key, val);
    router.push(`/discovery?${usp.toString()}`);
  };

  const sort = params.get("sort") ?? "score_auto";
  const order = params.get("order") ?? "desc";
  const interest = (params.get("interest") ?? "ANY").toUpperCase();
  const watchlistOnly = params.get("wl") === "1";
  const unwatchedOnly = params.get("uw") === "1";
  const selectedGenres = useMemo(() => {
    const raw = params.get("genres") ?? "";
    return new Set(
      raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => Number(s))
        .filter((n) => Number.isFinite(n))
    );
  }, [params]);

  const toggleGenre = (id: number) => {
    const usp = new URLSearchParams(params.toString());
    const cur = new Set(selectedGenres);
    if (cur.has(id)) cur.delete(id);
    else cur.add(id);
    const val = Array.from(cur).join(",");
    if (val) usp.set("genres", val);
    else usp.delete("genres");
    router.push(`/discovery?${usp.toString()}`);
  };

  const Seg = ({
    value,
    label,
    group,
  }: {
    value: string;
    label: string;
    group: "sort" | "order" | "interest";
  }) => {
    const active =
      group === "sort"
        ? sort === value
        : group === "order"
          ? order === value
          : interest === value;
    const onClick = () => setParam(group, active ? null : value);
    return <SegmentButton label={label} active={active} onClick={onClick} />;
  };

  return (
    <div className="flex flex-col gap-2 items-end">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs opacity-80">Sort</span>
        <Seg group="sort" value="score_auto" label="Score (Auto)" />
        <Seg group="sort" value="score_user" label="Your Score" />
        <Seg group="sort" value="score_tmdb" label="TMDB Score" />
        <Seg group="sort" value="interest" label="Interest" />
        <Seg group="sort" value="title" label="Title" />
        <Seg group="sort" value="year" label="Year" />
        <span className="ml-2 text-xs opacity-80">Order</span>
        <Seg group="order" value="desc" label="Desc" />
        <Seg group="order" value="asc" label="Asc" />
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs opacity-80">Interest</span>
        <Seg group="interest" value="ANY" label="All" />
        <Seg group="interest" value="HIGH" label="High" />
        <Seg group="interest" value="MEDIUM" label="Med" />
        <Seg group="interest" value="LOW" label="Low" />
        <label className="inline-flex items-center gap-2 text-xs ml-2">
          <input
            type="checkbox"
            checked={watchlistOnly}
            onChange={(e) => setParam("wl", e.target.checked ? "1" : null)}
          />
          Watchlist
        </label>
        <label className="inline-flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={unwatchedOnly}
            onChange={(e) => setParam("uw", e.target.checked ? "1" : null)}
          />
          Unwatched
        </label>
      </div>

      <div className="flex flex-wrap gap-1 max-w-[70vw] justify-end">
        {genres.map((g) => (
          <GenrePill
            key={g.id}
            label={g.name}
            active={selectedGenres.has(g.id)}
            onClick={() => toggleGenre(g.id)}
          />
        ))}
      </div>
    </div>
  );
}
