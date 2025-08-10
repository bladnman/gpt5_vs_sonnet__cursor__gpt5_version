"use client";
import {useRouter, useSearchParams} from "next/navigation";

export default function MediaFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const media = params.get("media") ?? "multi";

  function setMedia(next: string) {
    const usp = new URLSearchParams(params.toString());
    usp.set("media", next);
    if (q) usp.set("q", q);
    router.push(`/search?${usp.toString()}`);
  }

  const Button = ({value, label}: {value: string; label: string}) => (
    <button
      onClick={() => setMedia(value)}
      className={`px-3 py-1 rounded-md border ${
        media === value
          ? "bg-[--color-primary] text-white"
          : "border-[--color-border]"
      }`}
      aria-pressed={media === value}
    >
      {label}
    </button>
  );

  return (
    <div className="flex gap-2">
      <Button value="multi" label="All" />
      <Button value="movie" label="Movies" />
      <Button value="tv" label="TV" />
    </div>
  );
}
