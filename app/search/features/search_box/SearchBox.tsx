"use client";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";

export default function SearchBox() {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");

  useEffect(() => {
    setQuery(params.get("q") ?? "");
  }, [params]);

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const q = query.trim();
        if (!q) return;
        router.push(`/search?q=${encodeURIComponent(q)}`);
      }}
    >
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies and TV"
        className="px-3 py-2 rounded-md bg-[--color-muted] border border-[--color-border] min-w-[280px]"
        aria-label="Search"
      />
      <button className="px-4 py-2 rounded-md bg-[--color-primary] text-white font-medium">
        Search
      </button>
    </form>
  );
}
