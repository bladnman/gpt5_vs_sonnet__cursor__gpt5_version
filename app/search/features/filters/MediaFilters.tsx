"use client";
import MediaToggleButton from "@/app/search/features/filters/components/MediaToggleButton";
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

  return (
    <div className="flex gap-2">
      <MediaToggleButton
        value="multi"
        label="All"
        active={media === "multi"}
        onClick={setMedia}
      />
      <MediaToggleButton
        value="movie"
        label="Movies"
        active={media === "movie"}
        onClick={setMedia}
      />
      <MediaToggleButton
        value="tv"
        label="TV"
        active={media === "tv"}
        onClick={setMedia}
      />
    </div>
  );
}
