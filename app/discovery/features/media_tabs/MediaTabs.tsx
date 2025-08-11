"use client";
import {useRouter} from "next/navigation";

type Media = "movie" | "tv";

export default function MediaTabs({active}: {active: Media}) {
  const router = useRouter();

  const makeHref = (m: Media) => {
    // stay on the same discovery page; it reads search param ?media=
    const base = "/discovery";
    return `${base}?media=${m}`;
  };

  return (
    <div className="inline-flex rounded-md border border-[--color-border] p-1 bg-[--color-muted]">
      {(["movie", "tv"] as const).map((m) => {
        const isActive = m === active;
        return (
          <button
            key={m}
            onClick={() => router.push(makeHref(m))}
            className={[
              "px-3 py-1.5 text-sm rounded-md",
              isActive
                ? "bg-[--color-background] border border-[--color-border]"
                : "opacity-80 hover:opacity-100",
            ].join(" ")}
            aria-current={isActive ? "page" : undefined}
          >
            {m === "movie" ? "Movies" : "TV"}
          </button>
        );
      })}
    </div>
  );
}
