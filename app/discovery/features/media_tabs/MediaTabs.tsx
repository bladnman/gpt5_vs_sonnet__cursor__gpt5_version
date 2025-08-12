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
    <div className="inline-flex rounded-full ring-1 ring-inset ring-[--color-border] p-0.5 bg-[--color-background]">
      {(["movie", "tv"] as const).map((m) => {
        const isActive = m === active;
        return (
          <button
            key={m}
            onClick={() => router.push(makeHref(m))}
            className={[
              "px-3 py-1 text-xs rounded-full",
              isActive ? "bg-[--color-muted]" : "opacity-80 hover:opacity-100",
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
